import { Component, OnInit } from '@angular/core';
import { SaidaAntecipadaService } from '../saida-antecipada.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { PortariaService } from '../../portaria/portaria.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-filtrar-saida-antecipada',
  templateUrl: './filtrar-saida-antecipada.component.html',
  styleUrls: ['./filtrar-saida-antecipada.component.scss'],
  providers: [SaidaAntecipadaService, FirebaseService, PortariaService],
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
export class FiltrarSaidaAntecipadaComponent implements OnInit {

  constructor(
    private saidaAntecipadaService: SaidaAntecipadaService,
    private router: Router,
    private route:ActivatedRoute,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private portariaService: PortariaService) { }

  public esc_id: number;
  public dadosUsuario: Object;
  public usr_id: number;
  public saidasAntecipadasEventuais = new Array<any>()
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

  ngOnInit() {
    this.esc_id = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
    this.dadosUsuario = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT));
    this.usr_id = parseInt(this.dadosUsuario[0]['id']);
    this.saidasAntecipadasEventuais = undefined;
  }

  public excluir(sae_id: number, matricula: string): void {
    this.feedbackUsuario = "Excluindo registro, aguarde...";
    this.saidaAntecipadaService.excluirEventual(sae_id).toPromise().then((response: Response) => {
      this.excluirSaidaAntecipadaEventualPortarias(matricula);
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    })
  }

  public excluirSaidaAntecipadaEventualPortarias(matricula: string): void {
    this.portariaService.listar(this.esc_id).toPromise().then((response: Response) => {
      const portarias = Object.values(response);
      portarias.forEach(portaria => {
        const codigo = portaria['codigo'];
        this.firebaseService.apagarSaidaAntecipadaEventual(codigo, matricula).then(() => {
          this.feedbackUsuario = `Atualizando portaria ${portaria['nome']}...`;
        }).catch((erro: Response) => {
          //Mostra modal
          this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
          //registra log de erro no firebase usando serviço singlenton
          this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });
        })
      })
      this.filtrarEventual(50000, 0);
    }).catch((erro: Response) => {
      this.feedbackUsuario = undefined;
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
    })
  }

  public inserir(): void {
    this.router.navigate([`${this.route.parent.routeConfig.path}/inserir-saida-antecipada`]);
  }

  public ordenarColuna(campo: string): void {
    let retorno = this.saidasAntecipadasEventuais.sort(function (a, b) {
      if (a[campo] > b[campo]) {
        return 1;
      }
      if (a[campo] < b[campo]) {
        return -1;
      }
      return 0;
    })
    this.saidasAntecipadasEventuais = retorno;
  }

  public filtrarEventual(limit: number = 5, offset: number = 0): void {
    this.feedbackUsuario = 'Procurando registros, aguarde...';
    this.saidaAntecipadaService.filtrarEventual(limit, offset, this.valorFiltro, this.esc_id)
      .toPromise()
      .then((response: Response) => {
        this.saidasAntecipadasEventuais = Object.values(response);
        if (this.saidasAntecipadasEventuais.length > 0) {
          this.totalRegistros = parseInt(this.saidasAntecipadasEventuais[0]["total"])
        } else {
          this.totalRegistros = 0;
        }
        this.feedbackUsuario = undefined;
        this.verificaLimitesNavegacao();
      }).catch((erro: Response) => {
        this.feedbackUsuario = undefined;
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
      })
  }

  public filtrarEventualNavegacao(limit: number = 5, offset: number = 0): void {
    this.feedbackUsuario = 'Procurando registros, aguarde...';
    this.saidaAntecipadaService.filtrarEventual(limit, offset, this.valorFiltro, this.esc_id)
      .toPromise()
      .then((response: Response) => {
        this.saidasAntecipadasEventuais = Object.values(response);
        if (this.saidasAntecipadasEventuais.length > 0) {
          this.totalRegistros = parseInt(this.saidasAntecipadasEventuais[0]["total"])
        } else {
          this.totalRegistros = 0;
        }
        this.feedbackUsuario = undefined;
        this.verificaLimitesNavegacao();
      }).catch((erro: Response) => {
        this.feedbackUsuario = undefined;
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
      })
  }

  //Método de navegação otimizado. Replicar para demais listagens.
  public navegarProximo() {
    if (!this.navegacaoFim) {
      this.offsetRegistros = this.offsetRegistros + this.saltarQuantidade;
      this.filtrarEventualNavegacao(this.saltarQuantidade, this.offsetRegistros);
    }
    this.verificaLimitesNavegacao();
  }

  //Método de navegação otimizado. Replicar para demais listagens.
  public navegarAnterior() {
    if (!this.navegacaoInicio) {
      this.offsetRegistros = this.offsetRegistros - this.saltarQuantidade;
      this.filtrarEventualNavegacao(this.saltarQuantidade, this.offsetRegistros);
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
      this.filtrarEventual();
    }
  }

  public listarQuantidade(limit: number = 5) {
    this.navegacaoInicio = undefined;
    this.navegacaoFim = undefined;
    this.offsetRegistros = 0;
    this.saltarQuantidade = limit;
    this.filtrarEventual(this.saltarQuantidade);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }


}
