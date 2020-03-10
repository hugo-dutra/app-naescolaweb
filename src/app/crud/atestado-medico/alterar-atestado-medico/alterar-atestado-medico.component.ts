import { trigger, state, style, transition, animate } from '@angular/animations';
import { Utils } from './../../../shared/utils.shared';
import { AtestadoMedico } from './../atestado-medico.model';
import { CONSTANTES } from './../../../shared/constantes.shared';
import { FirebaseService } from './../../../shared/firebase/firebase.service';
import { AlertModalService } from './../../../shared-module/alert-modal.service';
import { EstudanteService } from './../../estudante/estudante.service';
import { AtestadoMedicoService } from './../atestado-medico.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'ngx-alterar-atestado-medico',
  templateUrl: './alterar-atestado-medico.component.html',
  styleUrls: ['./alterar-atestado-medico.component.scss'],
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
export class AlterarAtestadoMedicoComponent implements OnInit {

  public atestadoMedico = new Object();

  public feedbackUsuario: string;
  public estado: string = 'visivel';
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;

  public nomeEstudante: string = '';
  public codigoCid: string = '';
  public nomeCID: string = '';
  public data_inicio: string = '';
  public data_fim: string = '';
  public dias_diferenca: number = 0;
  public est_id: number = 0;
  public usr_id: number = 0;
  public atm_id: number = 0;

  constructor(
    private route: ActivatedRoute,
    private atestadoMedicoService: AtestadoMedicoService,
    private estudanteService: EstudanteService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe((atestado: Object) => {
      this.atestadoMedico = JSON.parse(atestado['atestado']);
    });
    this.carregarDados();
  }

  public carregarDados(): void {
    this.nomeEstudante = this.atestadoMedico['estudante'];
    this.codigoCid = this.atestadoMedico['codigo_cid'];
    this.nomeCID = this.atestadoMedico['descricao_cid'];
    this.data_inicio = this.atestadoMedico['data_inicio'];
    this.data_fim = this.atestadoMedico['data_fim'];
    this.dias_diferenca = this.atestadoMedico['dias_letivos'];
    const dadosUsuario = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT));
    this.usr_id = parseInt(dadosUsuario[0]['id'], 10);
    this.est_id = this.atestadoMedico['est_id'];
    this.atm_id = this.atestadoMedico['atm_id'];
  }

  public listar(): void {
    this.router.navigate(['listar-atestado-medico']);
  }

  public alterarAtestado(): void {
    if (this.validarSalvarAtestadoMedico()) {
      const atestado = new AtestadoMedico();
      atestado.atm_codigo_cid = this.codigoCid;
      atestado.atm_data_fim = this.data_fim;
      atestado.atm_data_inicio = this.data_inicio;
      atestado.atm_descricao_cid = this.nomeCID;
      atestado.atm_id = this.atm_id;
      atestado.atm_quantidade_dias_letivos = this.dias_diferenca;
      atestado.est_id = this.est_id;
      atestado.usr_id = this.usr_id;
      this.feedbackUsuario = 'Salvando alterações, aguarde...';
      this.atestadoMedicoService.alterar(atestado).toPromise().then((response: Response) => {
        this.alertModalService.showAlertSuccess('Alterações salvas com sucesso');
        this.feedbackUsuario = undefined;
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
      this.alertModalService.showAlertWarning('Todos os campos devem ser preenchidos');
    }
  }

  public validarSalvarAtestadoMedico(): boolean {
    if (this.nomeEstudante !== '' &&
      this.codigoCid !== '' &&
      this.nomeCID !== '' &&
      this.data_inicio !== '' &&
      this.data_fim !== '' &&
      this.dias_diferenca !== 0 &&
      this.usr_id !== 0 &&
      this.est_id !== 0) {
      return true;
    }
    return false;
  }

  public filtrarCID(event: Event): void {
    this.feedbackUsuario = 'Procurando, aguarde CID...';
    this.codigoCid = (<HTMLInputElement>event.target).value.toString().toUpperCase();
    if (this.codigoCid !== '') {
      this.atestadoMedicoService.consultarCid(this.codigoCid).then((response: Object) => {
        this.feedbackUsuario = undefined;
        this.nomeCID = response['nome'];
      });
    }
  }

  public contarDias(): void {
    const dado = moment(this.data_fim).diff(this.data_inicio, 'days');
    if (dado > 0 && !isNaN(dado)) {
      this.dias_diferenca = dado;
    } else {
      this.dias_diferenca = 0;
    }
  }
}
