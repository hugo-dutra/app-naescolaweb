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
  selector: 'ngx-excluir-atestado-medico',
  templateUrl: './excluir-atestado-medico.component.html',
  styleUrls: ['./excluir-atestado-medico.component.scss'],
  providers: [AtestadoMedicoService],
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
export class ExcluirAtestadoMedicoComponent implements OnInit {

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

  public excluirAtestado(): void {
    this.feedbackUsuario = 'Excluindo atestado, aguarde...';
    this.atestadoMedicoService.excluir(this.atm_id).toPromise().then((response: Response) => {
      this.alertModalService.showAlertSuccess('Exclusão concluída com sucesso');
      this.router.navigate(['listar-atestado-medico']);
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
  }


}
