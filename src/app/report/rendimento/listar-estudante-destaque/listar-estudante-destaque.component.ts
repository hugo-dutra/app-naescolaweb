import { Component, OnInit } from '@angular/core';
import { BoletimEstudanteService } from '../../../crud/boletim-estudante/boletim-estudante.service';
import { Utils } from '../../../shared/utils.shared';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';
import { PeriodoLetivoService } from '../../../crud/periodo-letivo/periodo-letivo.service';

@Component({
  selector: 'ngx-listar-estudante-destaque',
  templateUrl: './listar-estudante-destaque.component.html',
  styleUrls: ['./listar-estudante-destaque.component.scss'],
  providers: [BoletimEstudanteService, PeriodoLetivoService],
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
        animate(CONSTANTES.ANIMATION_DELAY_TIME * 2 + "ms ease-in-out")
      ])
    ])
  ]
})
export class ListarEstudanteDestaqueComponent implements OnInit {
  public feedbackUsuario = undefined;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;

  public dados_escola = new Array<Object>();
  public esc_id: number;
  public dados_usuario = new Array<Object>();
  public usr_id: number;
  public notaCorte: number = 5;
  public quantidadeDisciplinas: number = 8;
  public anoAtual: number;
  public periodosLetivos = new Array<Object>();
  public decrescente: boolean = true;
  public stringPeriodoSelecionado: string = "Selecione um periodo letivo...";
  public prl_id: number = 0;
  public listaDeEstudantesDestaque = new Array<Object>();

  constructor(
    private boletimEstudanteService: BoletimEstudanteService,
    private periodoLetivoService: PeriodoLetivoService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router) { }

  ngOnInit() {
    this.carregarDadosEscolares();
    this.carregarPeriodoLetivo();
  }

  public carregarDadosEscolares(): void {
    this.anoAtual = (new Date()).getFullYear();
    this.dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
    this.dados_usuario = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT))[0];
    this.esc_id = parseInt(this.dados_escola['id'], 10);
    this.usr_id = parseInt(this.dados_usuario['id'], 10);
  }


  public selecionarPeriodo(event: Event, periodo: Object): void {
    this.prl_id = parseInt((<HTMLInputElement>event.target).id);
    this.stringPeriodoSelecionado = (<HTMLInputElement>event.target).name;
  }


  public carregarPeriodoLetivo(): void {
    this.feedbackUsuario = "Listando períodos letivos";
    this.periodoLetivoService.listarPorAno(this.anoAtual).toPromise().then((response: Response) => {
      this.periodosLetivos = Object.values(response);
      this.feedbackUsuario = undefined;
    })
  }

  public listarEstudantesDestaque(): void {
    if (this.prl_id != 0) {
      this.feedbackUsuario = "Procurando por estudantes destaque, aguarde..."
      this.boletimEstudanteService.listarEstudantesDestaque(this.prl_id, this.notaCorte, this.esc_id, this.quantidadeDisciplinas, 0).toPromise().then((response: Response) => {
        this.listaDeEstudantesDestaque = Object.values(response);
        this.feedbackUsuario = undefined;
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
    } else {
      this.alertModalService.showAlertWarning("Selecione um período letivo.");
    }
  }

  public modificarNotaCorte(event: Event) {
    this.notaCorte = parseFloat((<HTMLInputElement>event.target).value);
  }

  public modificarQuantidadeDisciplinas(event: Event) {
    this.quantidadeDisciplinas = parseFloat((<HTMLInputElement>event.target).value);
  }

  public ordenarColuna(campo: string): void {
    if (!this.decrescente) {
      let retorno = this.listaDeEstudantesDestaque.sort(function (a, b) {
        if (a[campo] < b[campo]) {
          return 1;
        }
        if (a[campo] > b[campo]) {
          return -1;
        }
        return 0;
      })
      this.listaDeEstudantesDestaque = retorno;
    } else {
      let retorno = this.listaDeEstudantesDestaque.sort(function (a, b) {
        if (a[campo] > b[campo]) {
          return 1;
        }
        if (a[campo] < b[campo]) {
          return -1;
        }
        return 0;
      })
      this.listaDeEstudantesDestaque = retorno;
    }
    this.decrescente = !this.decrescente;
  }

}
