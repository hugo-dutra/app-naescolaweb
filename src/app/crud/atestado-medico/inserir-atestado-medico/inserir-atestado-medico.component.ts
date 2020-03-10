import { Router } from '@angular/router';
import { FirebaseService } from './../../../shared/firebase/firebase.service';
import { AlertModalService } from './../../../shared-module/alert-modal.service';
import { Utils } from './../../../shared/utils.shared';
import { Estudante } from './../../estudante/estudante.model';
import { AtestadoMedico } from './../atestado-medico.model';
import { EstudanteService } from './../../estudante/estudante.service';
import { CONSTANTES } from './../../../shared/constantes.shared';
import { AtestadoMedicoService } from './../atestado-medico.service';
import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as moment from 'moment';

@Component({
  selector: 'ngx-inserir-atestado-medico',
  templateUrl: './inserir-atestado-medico.component.html',
  styleUrls: ['./inserir-atestado-medico.component.scss'],
  providers: [AtestadoMedicoService, EstudanteService],
  animations: [
    trigger('chamado', [
      state(
        'visivel',
        style({
          opacity: 1,
        }),
      ),
      transition('void => visivel', [
        style({ opacity: 0 }),
        animate(CONSTANTES.ANIMATION_DELAY_TIME + 'ms ease-in-out'),
      ]),
    ]),
  ],
})
export class InserirAtestadoMedicoComponent implements OnInit {

  public feedbackUsuario: string;
  public estado: string = 'visivel';
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public atestadoMedico = new AtestadoMedico();
  public arrayDeEstudantes = new Array<Estudante>();
  public esc_id: number = 0;
  public est_id: number = 0;
  public codigoCid: string = '';
  public cid: string = '';
  public estudante: string = '';
  public estudanteSelecionado = new Object();
  public data_inicio: string = '';
  public data_fim: string = '';
  public dias_diferenca: number = 0;
  public usr_id: number = 0;

  constructor(
    private atestadoMedicoService: AtestadoMedicoService,
    private estudanteService: EstudanteService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router) { }

  ngOnInit() {
    this.carregarDados();
  }

  public carregarDados(): void {
    this.esc_id = Utils.pegarDadosEscolaDetalhado().id;
    this.usr_id = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT))[0].id;
    this.arrayDeEstudantes = [];
  }

  public gravarNomeEstudante(event: KeyboardEvent): void {
    if (event.keyCode === 13) {
      this.est_id = 0;
      this.arrayDeEstudantes = [];
      this.filtrarEstudante();
    }
    this.estudante = (<HTMLInputElement>event.target).value;
  }

  public filtrarEstudante(): void {
    this.feedbackUsuario = 'Procurando estudantes, aguarde...';
    this.estudanteService.filtrar(this.estudante, 20, 0, this.esc_id).toPromise().then((response: Response) => {
      this.arrayDeEstudantes = Object.values(response);
      this.feedbackUsuario = undefined;
    });
  }

  public selecionarEstudante(estudante: string): void {
    this.est_id = parseInt(estudante.split('-')[1], 10);
  }

  public filtrarCID(event: Event): void {
    this.codigoCid = (<HTMLInputElement>event.target).value.toString().toUpperCase();
    if (this.codigoCid !== '') {
      this.atestadoMedicoService.consultarCid(this.codigoCid).then((response: Object) => {
        this.cid = response['nome'];
      });
    }
  }

  public salvarAtestado(): void {
    this.atestadoMedico.atm_codigo_cid = this.codigoCid;
    this.atestadoMedico.atm_data_fim = this.data_fim;
    this.atestadoMedico.atm_data_inicio = this.data_inicio;
    this.atestadoMedico.atm_descricao_cid = this.cid;
    this.atestadoMedico.atm_quantidade_dias_letivos = this.dias_diferenca;
    this.atestadoMedico.est_id = this.est_id;
    this.atestadoMedico.usr_id = this.usr_id;
    if (this.validarSalvarAtestadoMedico()) {
      this.feedbackUsuario = 'Gravando atestado médico, aguarde...';
      this.atestadoMedicoService.inserir(this.atestadoMedico).toPromise().then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.alertModalService.showAlertSuccess('Atestado médico gravado com sucesso');
      }).catch((erro: Response) => {
        // Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        // registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`,
          JSON.stringify(erro));
        // Gravar erros no analytics
        Utils.gravarErroAnalytics(JSON.stringify(erro));
        // Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
    } else {
      this.alertModalService.showAlertWarning('Todos os campos devem ser preenchidos.');
    }
  }

  public validarSalvarAtestadoMedico(): boolean {
    if (this.atestadoMedico.atm_codigo_cid !== '' &&
      this.atestadoMedico.atm_data_fim !== '' &&
      this.atestadoMedico.atm_data_inicio !== '' &&
      this.atestadoMedico.atm_descricao_cid !== '' &&
      this.atestadoMedico.atm_quantidade_dias_letivos !== 0 &&
      this.atestadoMedico.est_id !== 0 &&
      this.atestadoMedico.usr_id !== 0) {
      return true;
    }
    return false;
  }


  public contarDias(): void {
    const dado = moment(this.data_fim).diff(this.data_inicio, 'days');
    if (dado > 0 && !isNaN(dado)) {
      this.dias_diferenca = dado;
    } else {
      this.dias_diferenca = 0;
    }
  }

  public listar(): void {
    this.router.navigate(['listar-atestado-medico']);
  }

}
