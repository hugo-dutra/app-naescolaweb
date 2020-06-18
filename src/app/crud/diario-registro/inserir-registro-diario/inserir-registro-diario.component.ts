import { Component, OnInit } from '@angular/core';
import { DiarioProfessorService } from '../../diario-professor/diario-professor.service';
import { EstudanteService } from '../../estudante/estudante.service';
import { DiarioRegistroService } from '../diario-registro.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { ItemRegistroFrequenciaDiario } from '../item-registro-diario.model';
import { Router } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';
import { DiarioRegistro } from '../diario-registro.model';

@Component({
  selector: 'ngx-inserir-registro-diario',
  templateUrl: './inserir-registro-diario.component.html',
  styleUrls: ['./inserir-registro-diario.component.scss'],
  providers: [DiarioProfessorService, EstudanteService, DiarioRegistroService],
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
export class InserirRegistroDiarioComponent implements OnInit {

  public estado: string = "visivel";
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;

  public arrayOfDiariosProfessor = new Array<Object>();
  public arrayOfEstudantesTurmaSelecionada = new Array<Object>();
  public arrayOfRegistrosFrequencia = new Array<ItemRegistroFrequenciaDiario>();
  public conteudoRegistroAula: string = "";
  public dataRegistroAula: string = "";
  public aula_dupla: boolean = false;

  public dados_escola = new Array<Object>();
  public dados_usuario = new Array<Object>();
  public modos_tela = { inserir: "inserir", listar: "listar" };
  public modo_tela: string = "";
  public diarioSelecionado: Object;
  public anoAtual: number;

  public usr_id: number;
  public esc_id: number;

  constructor(
    private diarioProfessorService: DiarioProfessorService,
    private router: Router,
    private estudanteService: EstudanteService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private diarioRegistroService: DiarioRegistroService
  ) { }

  ngOnInit() {
    this.anoAtual = (new Date()).getFullYear();
    this.dados_escola = JSON.parse(
      Utils.decriptAtoB(
        localStorage.getItem("dados_escola"),
        CONSTANTES.PASSO_CRIPT
      )
    )[0];
    this.dados_usuario = JSON.parse(
      Utils.decriptAtoB(localStorage.getItem("dados"), CONSTANTES.PASSO_CRIPT)
    )[0];
    this.esc_id = parseInt(this.dados_escola["id"]);
    this.usr_id = parseInt(this.dados_usuario["id"]);

    this.modo_tela = this.modos_tela.listar;
    this.listarDiariosProfessor();
  }

  public gravarAulaDupla(event: Event): void {
    let checkAulaDupla = (<HTMLInputElement>event.target).checked;
    this.aula_dupla = checkAulaDupla;
  }

  public adicionarRegistroAula(objeto: Object): void {
    this.arrayOfRegistrosFrequencia.length = 0;
    this.conteudoRegistroAula = "";
    this.dataRegistroAula = "";
    this.aula_dupla = false;
    this.modo_tela = this.modos_tela.inserir;
    this.diarioSelecionado = objeto;
    let trm_id = parseInt(this.diarioSelecionado["trm_id"]);
    this.listarEstudantesTurmaId(trm_id);
  }

  public listarEstudantesTurmaId(trm_id: number): void {
    this.feedbackUsuario = "Carregando estudantes...";
    this.estudanteService
      .listarTurmaId(trm_id)
      .toPromise()
      .then((response: Response) => {
        this.arrayOfEstudantesTurmaSelecionada = Object.values(response);
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

  public adicionarFrequenciaEstudanteSelecionado(
    estudanteSelecionado: Object,
    informacaoFrequencia: string,
    event: Event
  ): void {
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
      case "1": { //Presente
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
      case "0": { //Ausente
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
      case "2": { //Falta justificada.
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

    let itemRegistroFrequencia = new ItemRegistroFrequenciaDiario();
    itemRegistroFrequencia.frequenciaRegistrada = only_name;
    itemRegistroFrequencia.est_id = only_id;
    this.inserirAtualizarItemRegistroDeFrequencia(itemRegistroFrequencia);
  }

  public gravarConteudoRegistroAula(event: Event): void {
    this.conteudoRegistroAula = (<HTMLInputElement>event.target).value;
  }

  public gravarDataRegistroAula(event: Event): void {
    this.dataRegistroAula = (<HTMLInputElement>event.target).value;
  }

  public inserirAtualizarItemRegistroDeFrequencia(
    itemDeRegistro: ItemRegistroFrequenciaDiario
  ) {
    let idx_registro = this.arrayOfRegistrosFrequencia.findIndex(
      x => x.est_id == itemDeRegistro.est_id
    );
    if (idx_registro == -1) {
      //Novo registro
      this.arrayOfRegistrosFrequencia.push(itemDeRegistro);
    } else {
      //registro existente
      this.arrayOfRegistrosFrequencia[idx_registro] = itemDeRegistro;
    }
  }

  public listagemDiarios(): void {
    this.diarioSelecionado = null;
    this.modo_tela = this.modos_tela.listar;
  }

  public salvarRegistroDiario(): void {
    if (
      this.arrayOfRegistrosFrequencia.length ==
      this.arrayOfEstudantesTurmaSelecionada.length &&
      this.dataRegistroAula != "" &&
      this.conteudoRegistroAula != ""
    ) {
      let diarioRegistro = new DiarioRegistro();
      let dip_id = parseInt(this.diarioSelecionado["dip_id"]);

      diarioRegistro.dip_id = dip_id;
      diarioRegistro.data = this.dataRegistroAula;
      diarioRegistro.conteudo = this.conteudoRegistroAula;
      diarioRegistro.aula_dupla = this.aula_dupla;
      diarioRegistro.arrayOfDadosFrequenciaEstudantes = this.arrayOfRegistrosFrequencia;

      this.feedbackUsuario = "Salvando registros de frequência, aguarde...";
      this.diarioRegistroService
        .inserir(diarioRegistro)
        .toPromise()
        .then((response: Response) => {
          this.feedbackUsuario = undefined
          this.listagemDiarios();
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
          this.feedbackUsuario = undefined

        });
    } else {
      console.log(
        "Existem campos a serem preenchidos. Preencha todos os campos"
      );
    }

    //this.listagemDiarios();
    /*Esse bloco vai salvar a data da aula, o conteúdo e os registros de frequencia. O array de registro de frequencia precisa ter o mesmo tamanho d listgem de alunos.*/
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
        this.feedbackUsuario = undefined;
        console.log(erro);
      });
  }

  public gerenciarDiarioProfessor(): void {
    this.router.navigate(["gerenciar-diario-registro"]);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

}
