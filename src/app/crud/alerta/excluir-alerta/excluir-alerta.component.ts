import { Component, OnInit } from '@angular/core';
import { AlertaService } from '../alerta.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Utils } from '../../../shared/utils.shared';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-excluir-alerta',
  templateUrl: './excluir-alerta.component.html',
  styleUrls: ['./excluir-alerta.component.scss'],
  providers: [AlertaService],
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
export class ExcluirAlertaComponent implements OnInit {

  public regra: Object;
  public estado: string = 'visivel';
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public stringTipoOcorrencia: string = '';
  public stringTipoOperador: string = '';
  public valorReferencia: number = 0;
  public dataInicio: string = '';
  public dataFim: string = '';
  public ral_id: number = 0;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private alertaService: AlertaService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
  ) { }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe((regra: Object) => {
      this.regra = JSON.parse(regra['regra']);
    });
    this.carregarDados();
  }

  public listarAlertas(): void {
    this.router.navigate([`${this.activeRoute.parent.routeConfig.path}/listar-alerta`]);
  }

  public carregarDados(): void {
    this.ral_id = parseInt(this.regra['ral_id'], 10);
    this.stringTipoOcorrencia = this.regra['tipo_ocorrencia'];
    this.stringTipoOperador = this.regra['operador'];
    this.valorReferencia = parseInt(this.regra['valor_referencia'], 10);
    this.dataInicio = this.regra['data_inicio'];
    this.dataFim = this.regra['data_fim'];
  }

  public excluirAlerta(): void {
    this.feedbackUsuario = 'Excluindo regra de alerta, aguarde...';
    this.alertaService.excluirRegraAlerta(this.ral_id).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.router.navigate([`${this.activeRoute.parent.routeConfig.path}/listar-alerta`]);
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
