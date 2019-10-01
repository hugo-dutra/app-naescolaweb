import { Component, OnInit } from '@angular/core';
import { ProfessorService } from '../professor.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router, NavigationExtras } from '@angular/router';
import { Professor } from '../professor.model';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-listar-professor',
  templateUrl: './listar-professor.component.html',
  styleUrls: ['./listar-professor.component.scss'],
  providers: [ProfessorService],
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
export class ListarProfessorComponent implements OnInit {

  constructor(
    private professorService: ProfessorService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  public professores: Array<Professor>;
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public tableLimit: number = 10;
  public totalRegistros: number;
  public offsetRegistros: number = 0;
  public saltarQuantidade: number = 5;
  public navegacaoInicio: boolean = undefined;
  public navegacaoFim: boolean = undefined;
  public valorFiltro: string = "";
  public statusFiltro: boolean = false;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public arrayOfDisciplinas = new Array<string>();
  public exibirComponenteAlterar: Boolean = false;
  public exibirComponenteInserir: Boolean = false;
  public exibirComponenteExcluir: Boolean = false;
  public decrescente: boolean = true;

  ngOnInit() {
    this.professores = undefined;
    this.exibirComponentesEdicao();
    this.listar();
  }


  public exibirComponentesEdicao(): void {
    this.exibirComponenteInserir = Utils.exibirComponente('inserir-professor');
    this.exibirComponenteAlterar = Utils.exibirComponente('alterar-professor');
    this.exibirComponenteExcluir = Utils.exibirComponente('excluir-professor');
  }

  public listarDisciplina(professor: Object): void {
    this.feedbackUsuario = "Carregando disciplinas, aguarde..."
    let prf_id = parseInt(professor["id"]);
    for (let i = 0; i < this.professores.length; i++) {
      if (this.professores[i].id == prf_id) {
        if (this.professores[i].disciplinas == undefined) {
          this.professorService.listarDisciplina(prf_id).toPromise().then((response: Response) => {
            let disciplinas = Object.values(response)
            let disciplinasString = new Array<string>();
            for (let j = 0; j < disciplinas.length; j++) {
              disciplinasString.push(disciplinas[j]["disciplina"]);
            }
            this.professores[i].disciplinas = disciplinasString;
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
          this.feedbackUsuario = undefined;
        }
      }
    }
  }

  public listarQuantidade(event: Event) {
    this.navegacaoInicio = undefined;
    this.navegacaoFim = undefined;
    this.offsetRegistros = 0;
    this.saltarQuantidade = parseInt((<HTMLInputElement>event.target).value);
    if (this.statusFiltro) {
      this.filtrar(this.saltarQuantidade);
    } else {
      this.listar(this.saltarQuantidade);
    }
  }

  public listar(limit: number = 5, offset: number = 0): void {
    this.saltarQuantidade = limit;
    this.feedbackUsuario = undefined;
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.professorService
      .listar(limit, offset, true)
      .toPromise()
      .then((response: Response) => {
        this.professores = Object.values(response);
        if (this.professores.length > 0) {
          this.totalRegistros = parseInt(this.professores[0]["total"]);
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
    //Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public alterar(professor: Professor): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        professor: JSON.stringify(professor)
      }
    };
    this.router.navigate([`${this.router.url}/alterar-professor`], navigationExtras);
  }

  public excluir(professor: Professor): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        professor: JSON.stringify(professor)
      }
    };
    this.router.navigate([`${this.router.url}/excluir-professor`], navigationExtras);
  }

  //Método de navegação otimizado. Replicar para demais listagens.
  public navegarProximo() {
    if (!this.navegacaoFim) {
      this.offsetRegistros = this.offsetRegistros + this.saltarQuantidade;
      if (this.statusFiltro) {
        this.filtrarNavegacao(this.saltarQuantidade, this.offsetRegistros);
      } else {
        this.listar(this.saltarQuantidade, this.offsetRegistros);
      }
    }
    this.verificaLimitesNavegacao();
  }

  //Método de navegação otimizado. Replicar para demais listagens.
  public navegarAnterior() {
    if (!this.navegacaoInicio) {
      this.offsetRegistros = this.offsetRegistros - this.saltarQuantidade;
      if (this.statusFiltro) {
        this.filtrarNavegacao(this.saltarQuantidade, this.offsetRegistros);
      } else {
        this.listar(this.saltarQuantidade, this.offsetRegistros);
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
      this.filtrar();
    }
  }

  public ordenarColuna(campo: string): void {
    if (!this.decrescente) {
      let retorno = this.professores.sort(function (a, b) {
        if (a[campo] < b[campo]) {
          return 1;
        }
        if (a[campo] > b[campo]) {
          return -1;
        }
        return 0;
      })
      this.professores = retorno;

    } else {
      let retorno = this.professores.sort(function (a, b) {
        if (a[campo] > b[campo]) {
          return 1;
        }
        if (a[campo] < b[campo]) {
          return -1;
        }
        return 0;
      })
      this.professores = retorno;
    }
    this.decrescente = !this.decrescente;
  }


  public filtrar(limit: number = 5, offset: number = 0): void {
    if (this.statusFiltro) {
      this.saltarQuantidade = limit;
      this.offsetRegistros = 0;
      this.feedbackUsuario = undefined;
      this.feedbackUsuario = "Carregando dados, aguarde...";
      this.professorService
        .filtrar(this.valorFiltro, limit, offset)
        .toPromise()
        .then((response: Response) => {
          this.professores = Object.values(response);
          if (this.professores.length > 0) {
            this.totalRegistros = parseInt(this.professores[0]["total"]);
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
    //Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });
          this.feedbackUsuario = undefined;
        });
    } else {
      this.listar(limit, offset);
    }
  }

  public filtrarNavegacao(limit: number = 5, offset: number = 0): void {
    if (this.statusFiltro) {
      this.saltarQuantidade = limit;
      this.feedbackUsuario = undefined;
      this.feedbackUsuario = "Carregando dados, aguarde...";
      this.professorService
        .filtrar(this.valorFiltro, limit, offset)
        .toPromise()
        .then((response: Response) => {
          this.professores = Object.values(response);
          if (this.professores.length > 0) {
            this.totalRegistros = parseInt(this.professores[0]["total"]);
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
    //Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });
          this.feedbackUsuario = undefined;
        });
    } else {
      this.listar(limit, offset);
    }
  }

  public inserir(): void {
    this.router.navigate([`${this.router.url}/inserir-professor`]);
  }

  public inserirProfessorDisciplina(): void {
    this.router.navigate(["inserir-professor-disciplina"]);
  }

  public inserirProfessorTurma(): void {
    this.router.navigate(["inserir-professor-turma"]);
  }

  public inserirProfessorEscola(): void {
    this.router.navigate(["inserir-professor-escola"]);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

}
