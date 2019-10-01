import { Component, OnInit } from '@angular/core';
import { DiarioProfessorService } from '../diario-professor.service';
import { ProfessorTurmaService } from '../../professor-turma/professor-turma.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-inserir-diario-professor',
  templateUrl: './inserir-diario-professor.component.html',
  styleUrls: ['./inserir-diario-professor.component.scss'],
  providers: [DiarioProfessorService, ProfessorTurmaService],
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
export class InserirDiarioProfessorComponent implements OnInit {
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;

  public tableLimit: number = 5;
  public totalRegistros: number;
  public offsetRegistros: number = 0;
  public saltarQuantidade: number = 5;
  public navegacaoInicio: boolean = undefined;
  public navegacaoFim: boolean = undefined;
  public valorFiltro: string = "";
  public statusFiltro: boolean = false;
  public decrescente: boolean = true;

  public dados_escola = new Array<Object>();
  public esc_id: number;
  public arrayOfProfessoresHabilitados = new Array<Object>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private diarioProfessorService: DiarioProfessorService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private professorTurmaService: ProfessorTurmaService
  ) { }

  ngOnInit() {
    this.dados_escola = JSON.parse(
      Utils.decriptAtoB(
        localStorage.getItem("dados_escola"),
        CONSTANTES.PASSO_CRIPT
      )
    )[0];
    this.esc_id = parseInt(this.dados_escola["id"]);
    this.listarProfessoresHabilitados();
  }

  public listarQuantidade(limit: number = 5) {
    this.navegacaoInicio = undefined;
    this.navegacaoFim = undefined;

    this.offsetRegistros = 0;
    this.saltarQuantidade = limit;

    if (this.statusFiltro) {
      this.filtrarProfessoresHabilitados(this.saltarQuantidade);
    } else {
      this.listarProfessoresHabilitados(this.saltarQuantidade);
    }
  }

  public listarProfessoresHabilitados(
    limit: number = 5,
    offset: number = 0
  ): void {
    this.saltarQuantidade = limit;
    this.feedbackUsuario = undefined;
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.diarioProfessorService
      .listarProfessorHabilitado(this.esc_id, limit, offset)
      .toPromise()
      .then((response: Response) => {
        this.arrayOfProfessoresHabilitados = Object.values(response);
        if (this.arrayOfProfessoresHabilitados.length > 0) {
          this.totalRegistros = parseInt(this.arrayOfProfessoresHabilitados[0]["total"]);
        } else {
          this.totalRegistros = 0;
        }
        this.feedbackUsuario = undefined;
        this.verificaLimitesNavegacao();
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

  public gerenciarDiarioProfessor(): void {
    this.router.navigate(["gerenciar-diario-professor"]);
  }

  public verDiariosProfessorDisciplina(professor: Object) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        diarioProfessorDisciplina: JSON.stringify(professor)
      }
    };
    this.router.navigate([`${this.route.parent.routeConfig.path}/listar-diario-professor-disciplina-ano`], navigationExtras);
  }

  public criarDiarioProfessorDisciplina(event: Event) {
    let prd_id: number = parseInt((<HTMLInputElement>event.target).value);
    this.feedbackUsuario = "Preparando diários, aguarde...";
    this.professorTurmaService
      .listarProfessorTurmaDisciplinaId(prd_id, this.esc_id)
      .toPromise()
      .then((response: Response) => {
        let arrayOfTurmasProfessor = new Array<number>();
        let arrayOfNomesDiarios = new Array<string>();
        Array.from(Object.values(response)).forEach(elem => {
          arrayOfTurmasProfessor.push(elem["trm_id"]);
          arrayOfNomesDiarios.push(elem["serie"] + " - " + elem["etapa"] + " - " + elem["turma"] + " - " + elem["turno"]);
        });

        this.salvarProfessorDiscipliaTurmas(
          prd_id,
          arrayOfTurmasProfessor,
          arrayOfNomesDiarios
        );
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

  public salvarProfessorDiscipliaTurmas(
    prd_id: number,
    arrayDeTurmas: Array<number>,
    arrayDeNomesDiarios: Array<string>
  ) {
    this.feedbackUsuario = "Criando diários, aguarde...";
    this.diarioProfessorService
      .inserir(prd_id, arrayDeTurmas, arrayDeNomesDiarios)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
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

  //Método de navegação otimizado. Replicar para demais listagens.
  public navegarProximo() {
    if (!this.navegacaoFim) {
      this.offsetRegistros = this.offsetRegistros + this.saltarQuantidade;
      if (this.statusFiltro) {
        this.filtrarProfessoresHabilitadosNavegacao(
          this.saltarQuantidade,
          this.offsetRegistros
        );
      } else {
        this.listarProfessoresHabilitados(
          this.saltarQuantidade,
          this.offsetRegistros
        );
      }
    }
    this.verificaLimitesNavegacao();
  }

  //Método de navegação otimizado. Replicar para demais listagens.
  public navegarAnterior() {
    if (!this.navegacaoInicio) {
      this.offsetRegistros = this.offsetRegistros - this.saltarQuantidade;
      if (this.statusFiltro) {
        this.filtrarProfessoresHabilitadosNavegacao(
          this.saltarQuantidade,
          this.offsetRegistros
        );
      } else {
        this.listarProfessoresHabilitados(
          this.saltarQuantidade,
          this.offsetRegistros
        );
      }
    }
    this.verificaLimitesNavegacao();
  }

  public verificaLimitesNavegacao(): void {
    //Verifica se deve desabilitar botao de registro Anterior.
    if (this.offsetRegistros + this.saltarQuantidade <= this.saltarQuantidade) {
      this.navegacaoInicio = true;
      this.navegacaoFim = false;
    } else {
      this.navegacaoInicio = false;
    }
    //Verifica se deve desabilitar botao de registro seguinte.
    if (this.offsetRegistros + this.saltarQuantidade >= this.totalRegistros) {
      this.navegacaoFim = true;
      this.navegacaoInicio = false;
    }
    else {
      this.navegacaoFim = false;
    }
    //Quantidade de registros é inferior ao tamanho do saltarQuantidade
    if (this.totalRegistros <= this.saltarQuantidade) {
      this.navegacaoInicio = true;
      this.navegacaoFim = true;
    }
  }

  public gravarValorFiltro(valor: string) {
    this.valorFiltro = valor;
    if (this.valorFiltro.length < 3) {
      this.statusFiltro = false;
    } else {
      this.statusFiltro = true;
    }
  }

  public filtrarEnter(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filtrarProfessoresHabilitados();
    }
  }

  public ordenarColuna(campo: string): void {
    if (!this.decrescente) {
      let retorno = this.arrayOfProfessoresHabilitados.sort(function (a, b) {
        if (a[campo] < b[campo]) {
          return 1;
        }
        if (a[campo] > b[campo]) {
          return -1;
        }
        return 0;
      })
      this.arrayOfProfessoresHabilitados = retorno;

    } else {
      let retorno = this.arrayOfProfessoresHabilitados.sort(function (a, b) {
        if (a[campo] > b[campo]) {
          return 1;
        }
        if (a[campo] < b[campo]) {
          return -1;
        }
        return 0;
      })
      this.arrayOfProfessoresHabilitados = retorno;
    }
    this.decrescente = !this.decrescente;
  }

  public filtrarProfessoresHabilitados(
    limit: number = 5,
    offset: number = 0
  ): void {
    if (this.statusFiltro) {
      this.saltarQuantidade = limit;
      this.offsetRegistros = 0;
      this.feedbackUsuario = undefined;
      this.feedbackUsuario = "Carregando dados, aguarde...";
      this.diarioProfessorService
        .filtrarProfessorHabilitado(
          this.esc_id,
          limit,
          offset,
          this.valorFiltro
        )
        .toPromise()
        .then((response: Response) => {
          this.arrayOfProfessoresHabilitados = Object.values(response);
          if (this.arrayOfProfessoresHabilitados.length > 0) {
            this.totalRegistros = parseInt(this.arrayOfProfessoresHabilitados[0]["total"]);
          } else {
            this.totalRegistros = 0;
          }
          this.feedbackUsuario = undefined;
          this.verificaLimitesNavegacao();
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
    } else {
      this.listarProfessoresHabilitados(limit, offset);
    }
  }

  public filtrarProfessoresHabilitadosNavegacao(
    limit: number = 5,
    offset: number = 0
  ): void {
    if (this.statusFiltro) {
      this.saltarQuantidade = limit;
      this.feedbackUsuario = undefined;
      this.feedbackUsuario = "Carregando dados, aguarde...";
      this.diarioProfessorService
        .filtrarProfessorHabilitado(
          this.esc_id,
          limit,
          offset,
          this.valorFiltro
        )
        .toPromise()
        .then((response: Response) => {
          this.arrayOfProfessoresHabilitados = Object.values(response);
          if (this.arrayOfProfessoresHabilitados.length > 0) {
            this.totalRegistros = parseInt(this.arrayOfProfessoresHabilitados[0]["total"]);
          } else {
            this.totalRegistros = 0;
          }
          this.feedbackUsuario = undefined;
          this.verificaLimitesNavegacao();
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
    } else {
      this.listarProfessoresHabilitados(limit, offset);
    }
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

}
