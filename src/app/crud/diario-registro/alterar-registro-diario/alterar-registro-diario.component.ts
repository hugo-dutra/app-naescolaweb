import { Component, OnInit } from '@angular/core';
import { DiarioProfessorService } from '../../diario-professor/diario-professor.service';
import { DiarioRegistroService } from '../diario-registro.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-alterar-registro-diario',
  templateUrl: './alterar-registro-diario.component.html',
  styleUrls: ['./alterar-registro-diario.component.scss'],
  providers: [DiarioProfessorService, DiarioRegistroService],
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
export class AlterarRegistroDiarioComponent implements OnInit {

  public estado: string = "visivel";
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;

  public arrayOfDiariosProfessor = new Array<Object>();
  public arrayOfRegistrosDeAula = new Array<Object>();
  public arrayOfRegistrosDeFrequencia = new Array<Object>();

  public dados_escola = new Array<Object>();
  public dados_usuario = new Array<Object>();
  public modos_tela = { alterar: "alterar", listar: "listar", modificar: "modificar" };
  public modo_tela: string = "";
  public diarioSelecionado: Object;
  public registroAulaSelecionado: Object;
  public anoAtual: number;

  public usr_id: number;
  public esc_id: number;

  public dataRegistroDiario: string;
  public conteudoRegistroDiario: string;

  constructor(
    private diarioRegistroService: DiarioRegistroService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private diarioProfessorService: DiarioProfessorService,
    private router: Router
  ) { }

  ngOnInit() {
    this.anoAtual = (new Date()).getFullYear();
    this.dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados_escola"), CONSTANTES.PASSO_CRIPT))[0];
    this.dados_usuario = JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados"), CONSTANTES.PASSO_CRIPT))[0];
    this.esc_id = parseInt(this.dados_escola["id"]);
    this.usr_id = parseInt(this.dados_usuario["id"]);

    this.modo_tela = this.modos_tela.listar;
    this.listarDiariosProfessor();
  }

  public listarDiariosProfessor(): void {
    this.feedbackUsuario = "Carregando diários, aguarde...";
    this.diarioProfessorService
      .listarPorUsuarioEscola(this.usr_id, this.esc_id, this.anoAtual)
      .toPromise()
      .then((response: Response) => {
        this.arrayOfDiariosProfessor = Object.values(response);
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

  public listarRegistrosDeAula(diario: Object) {
    this.arrayOfRegistrosDeAula.length = 0;
    this.modo_tela = this.modos_tela.alterar;
    this.diarioSelecionado = diario;

    this.feedbackUsuario = "Carregando registros de aula, aguarde...";
    this.diarioRegistroService
      .listar(diario["dip_id"])
      .toPromise()
      .then((response: Response) => {
        this.arrayOfRegistrosDeAula = Object.values(response);
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

  public alterarRegistroDeAula(aula: Object) {
    this.modo_tela = this.modos_tela.modificar;
    this.registroAulaSelecionado = aula;
    this.arrayOfRegistrosDeFrequencia.length = 0;

    this.feedbackUsuario = "Carregando frequencias, aguarde...";
    this.diarioRegistroService
      .listarFrequencia(aula["rdi_id"])
      .toPromise()
      .then((response: Response) => {
        this.arrayOfRegistrosDeFrequencia = Object.values(response);
        this.feedbackUsuario = "Atualizando campos...";
        setTimeout(() => {
          this.feedbackUsuario = undefined;
          this.atualizaStatusBotoesFrequencia();
        }, 2000);

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

  public atualizaStatusBotoesFrequencia(): void {
    this.arrayOfRegistrosDeFrequencia.forEach(elem => {
      let presente = elem["presente"]
      switch (presente) {
        case 0: {//Ausente
          let btn_id = "A_" + elem["ref_id"];
          document.getElementById(btn_id).classList.add("border-danger");
          document.getElementById(btn_id).classList.add("border-10");
          document.getElementById(btn_id).classList.add("text-danger");
          document.getElementById(btn_id).classList.remove("text-light");
          break;
        }
        case 1: {//Presente
          let btn_id = "P_" + elem["ref_id"];
          document.getElementById(btn_id).classList.add("border-danger");
          document.getElementById(btn_id).classList.add("border-10");
          document.getElementById(btn_id).classList.add("text-danger");
          document.getElementById(btn_id).classList.remove("text-light");
          break;
        }
        case 2: {//Falta Justificada
          let btn_id = "FJ_" + elem["ref_id"];
          document.getElementById(btn_id).classList.add("border-danger");
          document.getElementById(btn_id).classList.add("border-10");
          document.getElementById(btn_id).classList.add("text-danger");
          document.getElementById(btn_id).classList.remove("text-light");
          break;
        }

        default:
          break;
      }



    })
  }

  public alterarFrequenciaEstudanteSelecionado(registroFrequencia: Object, valor: string, event: Event) {
    let btn_id = (<HTMLInputElement>event.target).id;
    let only_id = parseInt((<HTMLInputElement>event.target).value.toString());
    let only_name = (<HTMLInputElement>event.target).name;

    document.getElementById(btn_id).classList.add("border-danger");
    document.getElementById(btn_id).classList.add("border-10");
    document.getElementById(btn_id).classList.add("text-danger");
    document.getElementById(btn_id).classList.remove("text-light");

    //Controlar visual dos botões
    //selecionados ou desmarcados
    switch (only_name) {
      case "1": {
        //Presente
        document.getElementById("A_" + only_id).classList.remove("border-danger");
        document.getElementById("A_" + only_id).classList.remove("border-10");
        document.getElementById("A_" + only_id).classList.remove("text-danger");
        document.getElementById("A_" + only_id).classList.add("text-light");

        document
          .getElementById("FJ_" + only_id)
          .classList.remove("border-danger");
        document.getElementById("FJ_" + only_id).classList.remove("border-10");
        document.getElementById("FJ_" + only_id).classList.remove("text-danger");
        document.getElementById("FJ_" + only_id).classList.add("text-light");
        break;
      }
      case "0": {
        //Ausente
        document.getElementById("P_" + only_id).classList.remove("border-danger");
        document.getElementById("P_" + only_id).classList.remove("border-10");
        document.getElementById("P_" + only_id).classList.remove("text-danger");
        document.getElementById("P_" + only_id).classList.add("text-light");

        document
          .getElementById("FJ_" + only_id)
          .classList.remove("border-danger");
        document.getElementById("FJ_" + only_id).classList.remove("border-10");
        document.getElementById("FJ_" + only_id).classList.remove("text-danger");
        document.getElementById("FJ_" + only_id).classList.add("text-light");
        break;
      }
      case "2": {
        //Falta justificada.
        document.getElementById("P_" + only_id).classList.remove("border-danger");
        document.getElementById("P_" + only_id).classList.remove("border-10");
        document.getElementById("P_" + only_id).classList.remove("text-danger");
        document.getElementById("P_" + only_id).classList.add("text-light");

        document.getElementById("A_" + only_id).classList.remove("border-danger");
        document.getElementById("A_" + only_id).classList.remove("border-10");
        document.getElementById("A_" + only_id).classList.remove("text-danger");
        document.getElementById("A_" + only_id).classList.add("text-light");
        break;
      }
      default:
        break;
    }

    //Converte o valor do botão para um valor inteiro.
    let valor_inteiro: number;
    switch (valor) {
      case "A": {
        valor_inteiro = 0;
        break;
      }
      case "P": {
        valor_inteiro = 1;
        break;
      }
      case "FJ": {
        valor_inteiro = 2;
        break;
      }
      default:
        break;
    }

    let ref_id = parseInt(registroFrequencia["ref_id"]);
    this.feedbackUsuario = "Alterando...";
    this.diarioRegistroService
      .alterarFrequencia(ref_id, valor_inteiro)
      .toPromise()
      .then((response: Response) => {
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

  public modificarDataRegistroDiario(event: Event): void {
    this.registroAulaSelecionado["data_registro"] = (<HTMLInputElement>(
      event.target
    )).value;
  }

  public modificarConteudoRegistroDiario(event: Event): void {
    this.registroAulaSelecionado["conteudo"] = (<HTMLInputElement>(
      event.target
    )).value;
  }

  public alterarDataOuConteudo(): void {
    this.feedbackUsuario = "Atualizando data e conteúdo, aguarde...";
    this.diarioRegistroService
      .alterar(
        this.registroAulaSelecionado["rdi_id"],
        this.registroAulaSelecionado["conteudo"],
        this.registroAulaSelecionado["data_registro"]
      )
      .toPromise()
      .then((response: Response) => {
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

  public listagemDeRegistros(): void {
    this.registroAulaSelecionado = null;
    this.modo_tela = this.modos_tela.alterar;
  }

  public listagemDiarios(): void {
    this.diarioSelecionado = null;
    this.modo_tela = this.modos_tela.listar;
  }

  public gerenciarDiarioProfessor(): void {
    this.router.navigate(["gerenciar-diario-registro"]);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }


}
