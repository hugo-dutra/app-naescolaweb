import { Component, OnInit } from '@angular/core';
import { EstudanteService } from '../estudante.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-listar-observacao-estudante',
  templateUrl: './listar-observacao-estudante.component.html',
  styleUrls: ['./listar-observacao-estudante.component.scss'],
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
export class ListarObservacaoEstudanteComponent implements OnInit {

  public arrayOfObservacoes: Array<Object>;
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public est_id: number;
  public fotoEstudante: string = "";
  public nomeEstudante: string = "";
  public textoObservacaoAlterada = "";
  public exibirComponenteAlterar: Boolean = false;
  public exibirComponenteExcluir: Boolean = false;

  constructor(
    private estudanteService: EstudanteService,
    private route: ActivatedRoute,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(est_id => {
      this.est_id = parseInt(est_id["est_id"]);
    });
    this.exibirComponentesEdicao();
    this.listarObservacao(this.est_id);
  }

  public exibirComponentesEdicao(): void {
    this.exibirComponenteAlterar = Utils.exibirComponente('alterar-observacao-estudante');
    this.exibirComponenteExcluir = Utils.exibirComponente('excluir-observacao-estudante');
  }

  public listarObservacao(id: number): void {
    this.feedbackUsuario = "Carregando observações, aguarde...";
    this.estudanteService
      .listarObservacao(id)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.arrayOfObservacoes = Object.values(response);
        if (this.arrayOfObservacoes.length > 0) {
          this.fotoEstudante = this.arrayOfObservacoes[0]["foto"];
          this.nomeEstudante = this.arrayOfObservacoes[0]["estudante"];
        }
      })
      .catch((erro: Response) => {
        this.feedbackUsuario = undefined;
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
      });
  }

  public inserirObservacao(): void {
    this.router.navigate(["inserir-observacao-estudante"]);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public gravarAlteracaoObservacao(event: Event): void {
    this.textoObservacaoAlterada = (<HTMLInputElement>event.target).value;

  }

  public alterar(observacao: Object): void {
    let novoTextoObservacao = this.textoObservacaoAlterada;
    let usr_id: number = JSON.parse(
      Utils.decriptAtoB(localStorage.getItem("dados"), CONSTANTES.PASSO_CRIPT)
    )[0].id;
    let obe_id = observacao["id"];
    this.feedbackUsuario = "Alterando observação, aguarde...";
    this.estudanteService
      .alterarObservacao(obe_id, usr_id, novoTextoObservacao)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.listarObservacao(this.est_id);
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public excluir(id: number): void {
    this.feedbackUsuario = "Excluindo observação, aguarde...";
    this.estudanteService
      .excluirObservacao(id)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.listarObservacao(this.est_id);
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }
}
