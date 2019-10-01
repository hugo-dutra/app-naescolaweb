import { Component, OnInit } from '@angular/core';
import { EstudanteService } from '../estudante.service';
import { RendimentoService } from '../../../report/rendimento/rendimento.service';
import { PeriodoLetivoService } from '../../periodo-letivo/periodo-letivo.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Estudante } from '../estudante.model';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-detalhar-estudante-rendimento',
  templateUrl: './detalhar-estudante-rendimento.component.html',
  styleUrls: ['./detalhar-estudante-rendimento.component.scss'],
  providers: [EstudanteService, RendimentoService, PeriodoLetivoService],
  animations: [
    trigger("chamado", [
      state(
        "visivel",
        style({
          opacity: 1
        })
      ),
      transition("void => visivel", [
        style({ opacity: 0 }),
        animate(CONSTANTES.ANIMATION_DELAY_TIME + "ms ease-in-out")
      ])
    ])
  ]
})
export class DetalharEstudanteRendimentoComponent implements OnInit {

  public estudante = new Estudante();
  public estado: string = "visivel";
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public telefonesEstudante = new Array<Object>();
  public notasFaltasEstudante = new Array<Object>();
  public periodosLetivos = new Array<Object>();
  public media: number = 5;

  public prl_id_selecionado: number = 0;
  public stringPeriodoSelecionado: string = "Selecione um periodo";
  public stringInicioPeriodoSelecionado: string;
  public stringFimPeriodoSelecionado: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rendimentoService: RendimentoService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private periodoLetivoService: PeriodoLetivoService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((estudante: Estudante) => {
      this.estudante = JSON.parse(estudante["estudante"]);
    });
    this.listarPeriodosLetivos();
  }

  public atualizarMedia(event: Event): void {
    this.media = parseFloat((<HTMLInputElement>event.target).value);
  }

  public compararValor(nota: number): string {
    if (nota < (this.media - 0.5)) {
      return "recuperacao";
    } else
      if (nota < this.media) {
        return "atencao";
      } else {
        return "aprovado"
      }
  }

  public detalharEstudante(): void {
    let navigationExtras: NavigationExtras = {
      queryParams: { estudante: JSON.stringify(this.estudante) }
    };
    this.router.navigate([`${this.route.parent.routeConfig.path}/detalhar-estudante`], navigationExtras);
  }

  public selecionarPeriodo(event: Event, periodo: Object): void {
    this.prl_id_selecionado = parseInt((<HTMLInputElement>event.target).id);
    this.stringPeriodoSelecionado = (<HTMLInputElement>event.target).name;
    this.stringInicioPeriodoSelecionado = periodo["inicio"]
    this.stringFimPeriodoSelecionado = periodo["fim"]
    if (this.prl_id_selecionado != 0) {
      this.feedbackUsuario = "Carregando estudantes, aguarde...";
      this.listarNotasPorPeriodoLetivo();
    } else {
      this.notasFaltasEstudante = [];
    }
  }

  public listarPeriodosLetivos(): void {
    this.feedbackUsuario = "Listando periodos letivos, aguarde...";
    const anoAtual = (new Date().getFullYear());
    this.periodoLetivoService.listarPorAno(anoAtual).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.periodosLetivos = Object.values(response);
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
    //Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    })
  }

  public listarNotasPorPeriodoLetivo(): void {
    this.feedbackUsuario = "Carregando notas, aguarde...";
    this.rendimentoService.listarRendimentoFaltasEstudantePeriodo(this.estudante.id, this.prl_id_selecionado).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.notasFaltasEstudante = Object.values(response);
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
    //Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    })
  }


}
