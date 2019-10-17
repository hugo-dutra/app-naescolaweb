import { Component, OnInit } from '@angular/core';
import { EstudanteService } from '../estudante.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Estudante } from '../estudante.model';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-detalhar-estudante-notificacao',
  templateUrl: './detalhar-estudante-notificacao.component.html',
  styleUrls: ['./detalhar-estudante-notificacao.component.scss'],
  providers: [EstudanteService],
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
export class DetalharEstudanteNotificacaoComponent implements OnInit {

  public estudante = new Estudante();
  public estado: string = "visivel";
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public notificacoesDiversas = new Array<Object>();
  public decrescente: boolean = true;
  public dados_escola: Object;
  public inep: string;

  public arrayDeComunicadosVerificados = new Array<Object>();
  public arrayDeAdvertenciasVerificadas = new Array<Object>();
  public arrayDeEntradasVerificadas = new Array<Object>();
  public arrayDeSaidasVerificadas = new Array<Object>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private estudanteService: EstudanteService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.dados_escola = JSON.parse(
      Utils.decriptAtoB(
        localStorage.getItem("dados_escola"),
        CONSTANTES.PASSO_CRIPT
      )
    )[0];
    this.inep = this.dados_escola["inep"];
    this.route.queryParams.subscribe((estudante: Estudante) => {
      this.estudante = JSON.parse(estudante["estudante"]);
    });
    this.listarNotificacoes();
  }

  public detalharEstudante(): void {
    let navigationExtras: NavigationExtras = {
      queryParams: { estudante: JSON.stringify(this.estudante) }
    };
    this.router.navigate([`${this.route.parent.routeConfig.path}/detalhar-estudante`], navigationExtras);
  }

  public ordenarColuna(campo: string): void {
    if (!this.decrescente) {
      let retorno = this.notificacoesDiversas.sort(function (a, b) {
        if (a[campo] < b[campo]) {
          return 1;
        }
        if (a[campo] > b[campo]) {
          return -1;
        }
        return 0;
      })
      this.notificacoesDiversas = retorno;

    } else {
      let retorno = this.notificacoesDiversas.sort(function (a, b) {
        if (a[campo] > b[campo]) {
          return 1;
        }
        if (a[campo] < b[campo]) {
          return -1;
        }
        return 0;
      })
      this.notificacoesDiversas = retorno;
    }
    this.decrescente = !this.decrescente;
  }

  public listarNotificacoes(): void {
    this.feedbackUsuario = "Carregando as notificações do usuário, aguarde...";
    this.estudanteService.listarDetalhesNotificacoes(this.estudante.id).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.notificacoesDiversas = Object.values(response);
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

  public atualizarEntregaNotificacao(): void {
    this.arrayDeComunicadosVerificados = [];
    this.arrayDeAdvertenciasVerificadas = [];
    this.arrayDeEntradasVerificadas = [];
    this.arrayDeSaidasVerificadas = [];
    this.feedbackUsuario = "Carregando status de comunicados, aguarde...";
    this.firebaseService
      .listarStatusEntregaMensagensColecao(
        'comunicados',
        this.estudante['matricula'],
        this.inep)
      .then((response: firebase.firestore.QuerySnapshot) => {
        response.docs.forEach((documento) => {
          const fbdbkey = documento.id;
          const status_leitura = documento.data()['leitura'];
          this.arrayDeComunicadosVerificados.push({ fbdbkey: fbdbkey, status_leitura: status_leitura });
        });
      }).then(() => {
        this.feedbackUsuario = 'Carregando status de advertências, aguarde...';
        this.firebaseService
          .listarStatusEntregaMensagensColecao(
            'advertencias',
            this.estudante['matricula'],
            this.inep)
          .then((response: firebase.firestore.QuerySnapshot) => {
            response.docs.forEach((documento) => {
              const fbdbkey = documento.id;
              const status_leitura = documento.data()['leitura'];
              this.arrayDeAdvertenciasVerificadas.push({ fbdbkey: fbdbkey, status_leitura: status_leitura });
            })
          })
      }).then(() => {
        this.feedbackUsuario = 'Carregando status de entradas, aguarde...';
        this.firebaseService
          .listarStatusEntregaMensagensColecao(
            'entradas',
            this.estudante['matricula'],
            this.inep)
          .then((response: firebase.firestore.QuerySnapshot) => {
            response.docs.forEach((documento) => {
              const fbdbkey = documento.id;
              const status_leitura = documento.data()['leitura'];
              this.arrayDeEntradasVerificadas.push({ fbdbkey: fbdbkey, status_leitura: status_leitura });
            })
          }).then(() => {
            this.feedbackUsuario = 'Carregando status de saídas, aguarde...';
            this.firebaseService
              .listarStatusEntregaMensagensColecao(
                'saidas',
                this.estudante['matricula'],
                this.inep)
              .then((response: firebase.firestore.QuerySnapshot) => {
                response.docs.forEach((documento) => {
                  const fbdbkey = documento.id;
                  const status_leitura = documento.data()['leitura'];
                  this.arrayDeSaidasVerificadas.push({ fbdbkey: fbdbkey, status_leitura: status_leitura });
                })
              }).then(() => {
                this.feedbackUsuario = undefined;
                console.log(this.arrayDeAdvertenciasVerificadas);
                console.log(this.arrayDeComunicadosVerificados);
                console.log(this.arrayDeEntradasVerificadas);
                console.log(this.arrayDeSaidasVerificadas);
              })
          })
      })
  }
}
