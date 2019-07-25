import { Component, OnInit } from '@angular/core';
import { AlertaService } from '../alerta.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Utils } from '../../../shared/utils.shared';
import { Router } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { UsuarioService } from '../../usuario/usuario.service';

@Component({
  selector: 'ngx-atribuir-alerta-usuario',
  templateUrl: './atribuir-alerta-usuario.component.html',
  styleUrls: ['./atribuir-alerta-usuario.component.scss'],
  providers: [UsuarioService, AlertaService],
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
export class AtribuirAlertaUsuarioComponent implements OnInit {

  public dados_escola = new Array<Object>();
  public dados_usuario = new Array<Object>();
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public esc_id: number;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public arrayOfRegrasSelecionadas = new Array<number>();
  public arrayOfUsuariosSelecionados = new Array<number>();
  public arrayOfRegrasAlertasUsuariosEscola = new Array<Object>();

  public arrayOfUsuariosEscola: Array<Object>;
  public arrayOfRegraAlerta: Array<Object>;
  public arrayOfRegrasAlertasUsuarioSelecionado: Array<Object>;

  constructor(
    //private usuarioService: UsuarioService,
    private alertaService: AlertaService,
    private usuarioService: UsuarioService,
    private router: Router,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.carregarDados();
    this.listarRegrasAlertas();
  }

  public carregarDados(): void {
    this.arrayOfRegrasSelecionadas = [];
    this.dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
    this.dados_usuario = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT))[0];
    this.esc_id = parseInt(this.dados_escola['id'], 10);
  }

  /**
   * Lista as regras de alerta associadas a determinado usuãrio, em determinada escola
   * @param usr_id Usuário cujas regras serão verficadas.
   */
  public verificarRegrasAlertasUsuario(usr_id: number): void {
    this.feedbackUsuario = "Carregando alertas do usuário selecionado, aguarde..."
    this.arrayOfRegrasAlertasUsuarioSelecionado = [];
    this.alertaService.listarRegraAlertaUsuario(usr_id, this.esc_id)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.arrayOfRegrasAlertasUsuarioSelecionado = Object.values(response.json());
        this.marcarComponentesDeAlertasDoUsuario(usr_id);
      }).catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro.json()["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      })
  }

  public marcarComponentesDeAlertasDoUsuario(usr_id: number): void {
    this.limparMatrizesComponentes();
    (<HTMLInputElement>document.getElementById(`check_usr_${usr_id}`)).checked = true;
    this.arrayOfRegrasAlertasUsuarioSelecionado.forEach(dadoAlerta => {
      (<HTMLInputElement>document.getElementById(`chkb_${dadoAlerta["ral_id"]}`)).checked = true;
      this.arrayOfRegrasSelecionadas.push(parseInt(dadoAlerta["ral_id"]));
      this.arrayOfUsuariosSelecionados.push(usr_id);
    })
  }

  public listarRegrasAlertas(): void {
    this.feedbackUsuario = "Carregando regras para alertas, aguarde...";
    this.alertaService.listarRegraAlerta(this.esc_id).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.arrayOfRegraAlerta = Object.values(response);
      this.listarUsuariosEscola();
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro.json()["message"]);
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    })
  }

  public selecionarRegraAlerta(ral_id: number, event: Event): void {
    let status: boolean = (<HTMLInputElement>event.target).checked;
    if (status) {
      if (this.arrayOfRegrasSelecionadas.indexOf(ral_id) < 0) {
        this.arrayOfRegrasSelecionadas.push(ral_id)
      }
      //Adicionar o ral_id a matriz
    } else {
      this.arrayOfRegrasSelecionadas.splice(this.arrayOfRegrasSelecionadas.indexOf(ral_id), 1);
      //Remove o ral_id a matriz
    }
  }

  public selecionarUsuario(usr_id: number, event: Event): void {
    let status: boolean = (<HTMLInputElement>event.target).checked;
    if (status) {
      //Adicionar o usr_id a matriz
      if (this.arrayOfUsuariosSelecionados.indexOf(usr_id) < 0) {
        this.arrayOfUsuariosSelecionados.push(usr_id)
      }
    } else {
      //Remove o usr_id a matriz
      this.arrayOfUsuariosSelecionados.splice(this.arrayOfUsuariosSelecionados.indexOf(usr_id), 1);
    }
  }

  public salvarRegrasAlertasUsuarios(): void {
    this.arrayOfRegrasAlertasUsuariosEscola = [];
    this.feedbackUsuario = "Associando regras selecionados aos usuários informados,aguarde...";
    this.arrayOfRegrasSelecionadas.forEach(ral_id => {
      this.arrayOfUsuariosSelecionados.forEach(usr_id => {
        this.arrayOfRegrasAlertasUsuariosEscola.push({ ral_id: ral_id, usr_id: usr_id, esc_id: this.esc_id })
      })
    })
    this.alertaService.inserirRegraAlertaUsuario(this.arrayOfRegrasAlertasUsuariosEscola)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.limparMatrizesComponentes();
      }).catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro.json()["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      })
  }

  public revogarRegrasAlertasUsuarios(): void {
    this.arrayOfRegrasAlertasUsuariosEscola = [];
    this.feedbackUsuario = "Revogando regras selecionados aos usuários informados,aguarde...";
    this.arrayOfRegrasSelecionadas.forEach(ral_id => {
      this.arrayOfUsuariosSelecionados.forEach(usr_id => {
        this.arrayOfRegrasAlertasUsuariosEscola.push({ ral_id: ral_id, usr_id: usr_id, esc_id: this.esc_id })
      })
    })
    this.alertaService.excluirRegraAlertaUsuario(this.arrayOfRegrasAlertasUsuariosEscola)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.limparMatrizesComponentes();
      }).catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro.json()["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      })
  }

  public limparMatrizesComponentes(): void {
    this.arrayOfRegrasSelecionadas = [];
    this.arrayOfUsuariosSelecionados = [];
    this.arrayOfRegrasAlertasUsuariosEscola = [];
    Array.from(document.getElementsByClassName("checkbox")).forEach((elem: HTMLInputElement) => {
      elem.checked = false;
    })
  }

  public listarUsuariosEscola(): void {
    this.feedbackUsuario = "Carregando usuários, aguarde...";
    this.usuarioService.listarPorEscola(this.esc_id, true).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.arrayOfUsuariosEscola = Object.values(response);

    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro.json()["message"]);
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    })
  }

  public gerenciarAlerta(): void {
    this.router.navigate([`gerenciar-alerta-ocorrencia`]);
  }
}
