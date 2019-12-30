import { Component, OnInit } from '@angular/core';
import { DiretorEscolaService } from '../diretor-escola.service';
import { EscolaService } from '../../escola/escola.service';
import { DiretorService } from '../../diretor/diretor.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Utils } from '../../../shared/utils.shared';
import { DiretorEscola } from '../diretor-escola.model';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ngx-inserir-diretor-escola',
  templateUrl: './inserir-diretor-escola.component.html',
  styleUrls: ['./inserir-diretor-escola.component.scss'],
  providers: [DiretorEscolaService, EscolaService, DiretorService],
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
export class InserirDiretorEscolaComponent implements OnInit {

  public diretores: Object;
  public escolas: Object;
  public estado: string = "visivel";

  public diretorEscola = new DiretorEscola();
  public statusCheck: boolean;
  public feedbackUsuario: string;
  private arrayOfDiretores = new Array<number>();
  private arrayOfEscolas = new Array<number>();
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public exibeTodos: boolean = true;
  public exibeTodas: boolean = true;
  public origemChamada: string = undefined;
  public escopoUsuario: string;

  public formulario = new FormGroup({
    check_diretor: new FormControl(null),
    check_escola: new FormControl(null)
  });

  constructor(
    private diretorEscolaService: DiretorEscolaService,
    private escolaService: EscolaService,
    private diretorService: DiretorService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      this.origemChamada = params["origem"];
    });
    this.escopoUsuario = Utils.pegarDadosEscopo().nome;
    this.listarEscolas(this.exibeTodas);
    this.listarDiretores(this.exibeTodos);
  }

  public exibirTodos(): void {
    this.exibeTodos = !this.exibeTodos;
    this.listarDiretores(this.exibeTodos);
  }

  public exibirTodas(): void {
    this.exibeTodas = !this.exibeTodas;
    this.listarEscolas(this.exibeTodas);
  }

  public listarEscolas(todas: boolean): void {
    if (todas == false) {
      /* TODAS POR ESCOPO SEM DIRETOR */
      this.feedbackUsuario = "Carregando, aguarde...";
      this.escolaService
        .listarSemDiretor()
        .toPromise()
        .then((response: Response) => {
          this.escolas = response;
          this.feedbackUsuario = undefined;
        })
        .catch((erro: Response) => {
          //Mostra modal
          this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
          //registra log de erro no firebase usando serviço singlenton
          this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
          //Gravar erros no analytics
          Utils.gravarErroAnalytics(JSON.stringify(erro));
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });
          this.feedbackUsuario = undefined;
        });
    } else {
      /* TODAS POR ESCOPO */
      if (this.escopoUsuario == CONSTANTES.ESCOPO_GLOBAL) {
        this.feedbackUsuario = "Carregando, aguarde...";
        this.escolaService
          .listar(5000, 0, true)
          .toPromise()
          .then((response: Response) => {
            this.escolas = response;
            this.feedbackUsuario = undefined;
          })
          .catch((erro: Response) => {
            //Mostra modal
            this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
            //registra log de erro no firebase usando serviço singlenton
            this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
            //Gravar erros no analytics
            Utils.gravarErroAnalytics(JSON.stringify(erro));
            //Caso token seja invalido, reenvia rota para login
            Utils.tratarErro({ router: this.router, response: erro });
            this.feedbackUsuario = undefined;
          });
      }

      if (this.escopoUsuario == CONSTANTES.ESCOPO_REGIONAL) {
        this.feedbackUsuario = "Carregando, aguarde...";
        let esc_id: number = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
        this.escolaService
          .listarRegional(5000, 0, true, esc_id)
          .toPromise()
          .then((response: Response) => {
            this.escolas = response;
            this.feedbackUsuario = undefined;
          })
          .catch((erro: Response) => {
            //Mostra modal
            this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
            //registra log de erro no firebase usando serviço singlenton
            this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
            //Gravar erros no analytics
            Utils.gravarErroAnalytics(JSON.stringify(erro));
            //Caso token seja invalido, reenvia rota para login
            Utils.tratarErro({ router: this.router, response: erro });
            this.feedbackUsuario = undefined;
          });
      }

      if (this.escopoUsuario == CONSTANTES.ESCOPO_LOCAL) {
        this.feedbackUsuario = "Carregando, aguarde...";
        let esc_id: number = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
        this.escolaService
          .listarLocal(5000, 0, true, esc_id)
          .toPromise()
          .then((response: Response) => {
            this.escolas = response;
            this.feedbackUsuario = undefined;
          })
          .catch((erro: Response) => {
            //Mostra modal
            this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
            //registra log de erro no firebase usando serviço singlenton
            this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
            //Gravar erros no analytics
            Utils.gravarErroAnalytics(JSON.stringify(erro));
            //Caso token seja invalido, reenvia rota para login
            Utils.tratarErro({ router: this.router, response: erro });
            this.feedbackUsuario = undefined;
          });
      }
    }








  }

  public listarDiretores(todos: boolean): void {
    if (!todos) {
      this.feedbackUsuario = "Carregando, aguarde...";
      this.diretorService
        .listarSemEscola()
        .toPromise()
        .then((response: Response) => {
          this.diretores = response;
          this.feedbackUsuario = undefined;
        })
        .catch((erro: Response) => {
          //Mostra modal
          this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
          //registra log de erro no firebase usando serviço singlenton
          this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
          //Gravar erros no analytics
          Utils.gravarErroAnalytics(JSON.stringify(erro));
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });
          this.feedbackUsuario = undefined;
        });
    } else {
      this.feedbackUsuario = "Carregando, aguarde...";
      this.diretorService
        .listar(5000, 0, true)
        .toPromise()
        .then((response: Response) => {
          this.diretores = response;
          this.feedbackUsuario = undefined;
        })
        .catch((erro: Response) => {
          //Mostra modal
          this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
          //registra log de erro no firebase usando serviço singlenton
          this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
          //Gravar erros no analytics
          Utils.gravarErroAnalytics(JSON.stringify(erro));
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });
          this.feedbackUsuario = undefined;
        });
    }
  }

  public gravaStatusDiretores(event: Event): void {
    let nome: string = (<HTMLInputElement>event.target).id;
    let status: boolean = (<HTMLInputElement>event.target).checked;

    if (status) {
      this.arrayOfDiretores.push(parseInt(nome));
    } else {
      this.arrayOfDiretores.splice(
        this.arrayOfDiretores.indexOf(parseInt(nome), 0),
        1
      );
    }
    this.alertarChecksVazios();
  }

  public gravaStatusEscolas(event: Event): void {
    let nome: string = (<HTMLInputElement>event.target).name;
    let status: boolean = (<HTMLInputElement>event.target).checked;
    if (status) {
      this.arrayOfEscolas.push(parseInt(nome));
    } else {
      this.arrayOfEscolas.splice(
        this.arrayOfEscolas.indexOf(parseInt(nome), 0),
        1
      );
    }
    this.alertarChecksVazios();
  }

  public inserir(event: Event): void {
    if (this.arrayOfDiretores.length > 0 && this.arrayOfEscolas.length > 0) {
      this.exibirAlerta = false;
      this.feedbackUsuario = "Salvando, aguarde...";
      this.diretorEscolaService
        .inserir(this.arrayOfDiretores, this.arrayOfEscolas)
        .toPromise()
        .then((response: Response) => {
          this.feedbackUsuario = undefined;
          this.limparTodosChecks();
        })
        .catch((erro: Response) => {
          //Mostra modal
          this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
          //registra log de erro no firebase usando serviço singlenton
          this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
          //Gravar erros no analytics
          Utils.gravarErroAnalytics(JSON.stringify(erro));
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });
          this.feedbackUsuario = undefined;
          this.limparTodosChecks();
        });
    } else {
      this.exibirAlerta = true;
    }
  }

  public listar(): void {
    if (this.origemChamada != undefined) {
      this.router.navigateByUrl(this.origemChamada);
    } else {
      this.router.navigateByUrl("listar-diretor");
    }
  }

  public limparTodosChecks() {
    this.formulario.reset();
    this.arrayOfDiretores.length = 0;
    this.arrayOfEscolas.length = 0;
    this.listarDiretores(this.exibeTodos);
    this.listarEscolas(this.exibeTodas);
  }

  public alertarChecksVazios() {
    if (this.arrayOfDiretores.length != 0 && this.arrayOfEscolas.length != 0) {
      this.exibirAlerta = false;
    }

    if (this.arrayOfDiretores.length == 0 || this.arrayOfEscolas.length == 0) {
      this.exibirAlerta = true;
    }
  }

}
