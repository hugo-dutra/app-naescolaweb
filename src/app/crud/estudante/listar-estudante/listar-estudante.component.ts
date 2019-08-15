import { Component, OnInit } from '@angular/core';
import { EstudanteService } from '../estudante.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router, NavigationExtras } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';
import { Estudante } from '../estudante.model';

@Component({
  selector: 'ngx-listar-estudante',
  templateUrl: './listar-estudante.component.html',
  styleUrls: ['./listar-estudante.component.scss'],
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
export class ListarEstudanteComponent implements OnInit {

  constructor(
    private estudanteService: EstudanteService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  public estudantes = new Array<Object>();
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
  public filtrandoEntrada: boolean = false;
  public exibirComponenteAlterar: Boolean = false;
  public exibirComponenteInserir: Boolean = false;
  public exibirComponenteExcluir: Boolean = false;
  public exibirComponenteDetalhar: Boolean = false;
  public decrescente: boolean = true;

  ngOnInit() {
    this.exibirComponentesEdicao();
    this.estudantes = undefined;
    this.listar();
  }

  public exibirComponentesEdicao(): void {
    this.exibirComponenteInserir = Utils.exibirComponente('inserir-estudante');
    this.exibirComponenteAlterar = Utils.exibirComponente('alterar-estudante');
    this.exibirComponenteExcluir = Utils.exibirComponente('excluir-estudante');
    this.exibirComponenteDetalhar = Utils.exibirComponente('detalhar-estudante');
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


  public ordenarColuna(campo: string): void {
    if (!this.decrescente) {
      let retorno = this.estudantes.sort(function (a, b) {
        if (a[campo] < b[campo]) {
          return 1;
        }
        if (a[campo] > b[campo]) {
          return -1;
        }
        return 0;
      })
      this.estudantes = retorno;

    } else {
      let retorno = this.estudantes.sort(function (a, b) {
        if (a[campo] > b[campo]) {
          return 1;
        }
        if (a[campo] < b[campo]) {
          return -1;
        }
        return 0;
      })
      this.estudantes = retorno;
    }
    this.decrescente = !this.decrescente;
  }


  public listar(limit: number = 5, offset: number = 0): void {
    this.saltarQuantidade = limit;
    this.feedbackUsuario = undefined;
    this.feedbackUsuario = "Carregando dados, aguarde...";
    let esc_id: number = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
    this.estudanteService
      .listar(limit, offset, true, esc_id)
      .toPromise()
      .then((response: Response) => {
        this.estudantes = Object.values(response);
        if (this.estudantes.length > 0) {
          this.totalRegistros = parseInt(this.estudantes[0]["total"])
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
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public alterar(estudante: Estudante): void {
    let navigationExtras: NavigationExtras = {
      queryParams: { estudante: JSON.stringify(estudante) }
    };
    this.router.navigate([`${this.router.url}/alterar-estudante`], navigationExtras);
  }

  public excluir(estudante: Estudante): void {
    let navigationExtras: NavigationExtras = {
      queryParams: { estudante: JSON.stringify(estudante) }
    };
    this.router.navigate([`${this.router.url}/excluir-estudante`], navigationExtras);
  }

  public detalhar(estudante: Estudante): void {
    let navigationExtras: NavigationExtras = {
      queryParams: { estudante: JSON.stringify(estudante) }
    };
    this.router.navigate([`${this.router.url}/detalhar-estudante`], navigationExtras);
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
    setTimeout(() => {
      this.valorFiltro = valor;
      if (this.valorFiltro.length < 3) {
        this.statusFiltro = false;
      } else {
        this.statusFiltro = true;
      }
    }, 1000);
  }

  public filtrarEnter(event: KeyboardEvent) {
    setTimeout(() => {
      if (event.key == "Enter") {
        this.filtrar();
      }
    }, 1000);
  }

  public filtrar(limit: number = 5, offset: number = 0): void {
    if (this.statusFiltro) {
      this.saltarQuantidade = limit;
      this.offsetRegistros = 0;
      this.feedbackUsuario = undefined;
      this.feedbackUsuario = "Carregando dados, aguarde...";
      let esc_id: number = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
      this.estudanteService
        .filtrar(this.valorFiltro, limit, offset, esc_id)
        .toPromise()
        .then((response: Response) => {
          this.estudantes = Object.values(response);
          if (this.estudantes.length > 0) {
            this.totalRegistros = parseInt(this.estudantes[0]["total"])
          } else {
            this.totalRegistros = 0;
          }
          this.feedbackUsuario = undefined;
          this.filtrandoEntrada = false;
          this.verificaLimitesNavegacao();
        })
        .catch((erro: Response) => {
          this.feedbackUsuario = undefined;
          this.filtrandoEntrada = false;
          //Mostra modal
          this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
          //registra log de erro no firebase usando serviço singlenton
          this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });
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
      let esc_id: number = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
      this.estudanteService
        .filtrar(this.valorFiltro, limit, offset, esc_id)
        .toPromise()
        .then((response: Response) => {
          this.estudantes = Object.values(response);
          if (this.estudantes.length > 0) {
            this.totalRegistros = parseInt(this.estudantes[0]["total"])
          } else {
            this.totalRegistros = 0;
          }
          this.feedbackUsuario = undefined;
          this.filtrandoEntrada = false;
          this.verificaLimitesNavegacao();
        })
        .catch((erro: Response) => {
          this.feedbackUsuario = undefined;
          this.filtrandoEntrada = false;
          //Mostra modal
          this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
          //registra log de erro no firebase usando serviço singlenton
          this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });
        });
    } else {
      this.listar(limit, offset);
    }
  }

  public inserir(): void {
    this.router.navigate([`${this.router.url}/inserir-estudante`]);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

}
