import { Component, OnInit } from '@angular/core';
import { DiarioProfessorService } from '../../diario-professor/diario-professor.service';
import { EstudanteService } from '../../estudante/estudante.service';
import { DiarioRegistroService } from '../diario-registro.service';
import { PeriodoLetivoService } from '../../periodo-letivo/periodo-letivo.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { DiarioAvaliacaoNotaEstudante } from '../diario-avaliacao-nota-estudante.model';
import { DiarioAvaliacao } from '../diario-avaliacao-model';
import { Router } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-alterar-diario-avaliacao',
  templateUrl: './alterar-diario-avaliacao.component.html',
  styleUrls: ['./alterar-diario-avaliacao.component.scss'],
  providers: [
    DiarioProfessorService,
    EstudanteService,
    DiarioRegistroService,
    PeriodoLetivoService
  ],
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
export class AlterarDiarioAvaliacaoComponent implements OnInit {

  public estado: string = "visivel";
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;

  public arrayOfDiariosProfessor = new Array<Object>();
  public arrayOfEstudantesTurmaSelecionada = new Array<Object>();
  public arrayOfRegistrosNotas = new Array<DiarioAvaliacaoNotaEstudante>();
  public arrayOfPeriodosLetivos = new Array<Object>();
  public arrayOfAvaliacoesDiario = new Array<Object>();
  public diarioAvaliacao = new DiarioAvaliacao();
  public anoAtual: number;

  public dados_escola = new Array<Object>();
  public dados_usuario = new Array<Object>();
  public modos_tela = {
    listar_avaliacoes: "listar_avaliacoes",
    listar_diarios: "listar_diarios",
    alterar: "alterar"
  };
  public modo_tela: string = "";
  public diarioSelecionado: Object;
  public avaliacaoSelecionada: Object;
  public exibirAlerta = false;

  public usr_id: number;
  public esc_id: number;

  constructor(
    private diarioProfessorService: DiarioProfessorService,
    private router: Router,
    private estudanteService: EstudanteService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private diarioRegistroService: DiarioRegistroService,
    private periodoLetivoService: PeriodoLetivoService
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

    this.modo_tela = this.modos_tela.listar_diarios;
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
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;

      });
  }

  public listarPeriodosLetivos(): void {
    this.feedbackUsuario = "Carregando períodos letivos, aguarde...";
    let anoAtual: number = new Date().getFullYear();
    this.periodoLetivoService
      .listarPorAno(anoAtual)
      .toPromise()
      .then((response: Response) => {
        this.arrayOfPeriodosLetivos = Object.values(response);
        this.feedbackUsuario = undefined;
        this.modo_tela = this.modos_tela.alterar;
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;

      });
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
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public gerenciarDiarioProfessor(): void {
    this.router.navigate(["gerenciar-diario-registro"]);
  }

  public adicionarNotaEstudante(
    nota: DiarioAvaliacaoNotaEstudante,
    event: Event
  ): void {
    let valor_nota = ((<HTMLInputElement>event.target).value);
    let idx_registro = this.arrayOfRegistrosNotas.findIndex(
      x => x.ave_id == nota.ave_id
    );
    if (isNaN(parseFloat(valor_nota))) {
      valor_nota = "";
      nota.valor = null;
    } else {
      nota.valor = parseFloat(valor_nota);
    }

    if (idx_registro == -1) {
      //Novo registro
      nota.valor = null ? -1 : nota.valor;

      this.arrayOfRegistrosNotas.push(nota);
    } else {
      //registro existente
      nota.valor = null ? -1 : nota.valor;
      this.arrayOfRegistrosNotas[idx_registro] = nota;
    }
  }

  public listarDiarioProfessor(): void {
    this.modo_tela = this.modos_tela.listar_diarios;
    this.arrayOfAvaliacoesDiario.length = 0;
    this.avaliacaoSelecionada = null;
    this.diarioSelecionado = null;
  }

  public listarRegistrosAvaliacao(diario: Object): void {
    let dip_id = diario["dip_id"];
    this.diarioSelecionado = diario;
    this.feedbackUsuario = "Carregando avaliações, aguarde...";
    this.diarioRegistroService
      .listarAvaliacaoDiarioProfessor(dip_id)
      .toPromise()
      .then((response: Response) => {
        this.arrayOfAvaliacoesDiario = Object.values(response);
        this.modo_tela = this.modos_tela.listar_avaliacoes;
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public listarAvaliacoesDiario(): void {
    this.modo_tela = this.modos_tela.listar_avaliacoes;
    this.arrayOfRegistrosNotas.length = 0;
    this.avaliacaoSelecionada = null;
  }

  public alterarRegistrosAvaliacao(avaliacao: Object) {
    this.avaliacaoSelecionada = avaliacao;
    let dav_id = this.avaliacaoSelecionada["dav_id"];
    this.feedbackUsuario = "Carregando notas dos estudantes, aguarde...";
    this.diarioRegistroService
      .listarAvaliacaoEstudanteDiarioAvaliacao(dav_id)
      .toPromise()
      .then((response: Response) => {
        this.listarPeriodosLetivos();
        this.arrayOfRegistrosNotas = Object.values(response);
        this.diarioAvaliacao = <DiarioAvaliacao>this.avaliacaoSelecionada;
        this.diarioAvaliacao.data_avaliacao = this.avaliacaoSelecionada["data"];
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public salvarAlteracaoAvaliacoesDiario(): void {
    if (this.validarGravacaoNotas()) {
      this.feedbackUsuario = "Alterando dados da avaliação, aguarde..."
      this.diarioAvaliacao.estudantes_avaliados = this.arrayOfRegistrosNotas;
      this.diarioRegistroService
        .alterarAvaliacaoTurmaEstudantes(this.diarioAvaliacao)
        .toPromise()
        .then((response: Response) => {
          this.modo_tela = this.modos_tela.listar_avaliacoes;
          this.feedbackUsuario = undefined;
          this.listarRegistrosAvaliacao(this.diarioSelecionado);
        })
        .catch((erro: Response) => {
          //Mostra modal
          this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
          //registra log de erro no firebase usando serviço singlenton
          this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });
          this.feedbackUsuario = undefined;
        });

      this.exibirAlerta = false;
    } else {
      console.log(
        "Existem notas ou campos não informados ou com valores incorretos."
      );
      this.exibirAlerta = true;
    }
  }

  public validarGravacaoNotas(): boolean {
    let retorno = true;
    let valor = this.diarioAvaliacao.valor;
    if (valor > this.diarioAvaliacao.valor) {
      (<HTMLInputElement>event.target).value = "";
    }

    Array.from(document.getElementsByClassName("valores_notas")).forEach(
      elem => {
        let valorElemento: number = parseFloat(
          (<HTMLInputElement>elem).value.toString()
        );

        if (isNaN(valorElemento)) {
          retorno = false;
        }

        if (valorElemento > valor) {
          elem.classList.add("is-invalid");
          elem.setAttribute("Max", this.diarioAvaliacao.valor.toString());
          retorno = false;
        } else {
          elem.classList.remove("is-invalid");
          elem.removeAttribute("Max");
        }
      }
    );

    if (
      this.diarioAvaliacao.data_avaliacao == "" ||
      this.diarioAvaliacao.data_avaliacao == null ||
      this.diarioAvaliacao.data_avaliacao == undefined
    ) {
      retorno = false;
    }

    if (
      this.diarioAvaliacao.metodologia == "" ||
      this.diarioAvaliacao.metodologia == null ||
      this.diarioAvaliacao.metodologia == undefined
    ) {
      retorno = false;
    }

    if (
      this.diarioAvaliacao.objetivo == "" ||
      this.diarioAvaliacao.objetivo == null ||
      this.diarioAvaliacao.objetivo == undefined
    ) {
      retorno = false;
    }

    if (
      this.diarioAvaliacao.peso == 0 ||
      isNaN(this.diarioAvaliacao.peso) ||
      this.diarioAvaliacao.peso == null ||
      this.diarioAvaliacao.peso == undefined
    ) {
      retorno = false;
    }

    if (
      this.diarioAvaliacao.valor == 0 ||
      isNaN(this.diarioAvaliacao.valor) ||
      this.diarioAvaliacao.valor == null ||
      this.diarioAvaliacao.valor == undefined
    ) {
      retorno = false;
    }

    if (this.diarioAvaliacao.estudantes_avaliados != undefined) {
      if (
        this.diarioAvaliacao.estudantes_avaliados.length <
        this.arrayOfEstudantesTurmaSelecionada.length
      ) {
        retorno = false;
      }
    }

    this.exibirAlerta = !retorno;
    return retorno;
  }

  public gravarDadosAvaliacao(event: Event): void {
    let componente_name = (<HTMLInputElement>event.target).name;
    let componente_value = (<HTMLInputElement>event.target).value;

    switch (componente_name) {
      case "metodologia": {
        this.diarioAvaliacao.metodologia = componente_value;
        break;
      }
      case "objetivo": {
        this.diarioAvaliacao.objetivo = componente_value;
        break;
      }
      case "data_avaliacao": {
        this.diarioAvaliacao.data_avaliacao = componente_value;
        break;
      }
      case "valor": {
        this.diarioAvaliacao.valor = parseFloat(componente_value);
        break;
      }
      case "peso": {
        this.diarioAvaliacao.peso = parseFloat(componente_value);
        break;
      }
      case "periodo_letivo": {
        this.diarioAvaliacao.prl_id = parseInt(componente_value);
        break;
      }

      default:
        break;
    }
  }

  public verificarNotasErradas(): boolean {
    let retorno = true;
    Array.from(document.getElementsByClassName("valores_notas")).forEach(
      elem => {
        let valorElemento: number = parseFloat(
          (<HTMLInputElement>elem).value.toString()
        );
        if (valorElemento > this.diarioAvaliacao.valor) {
          elem.classList.add("is-invalid");
          elem.setAttribute("Max", this.diarioAvaliacao.valor.toString());
          retorno = false;
          this.exibirAlerta = true;
        } else {
          elem.classList.remove("is-invalid");
          elem.removeAttribute("Max");
          this.exibirAlerta = false;
        }
      }
    );
    return retorno;
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

}
