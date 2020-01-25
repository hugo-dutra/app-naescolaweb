import { Component, OnInit } from '@angular/core';
import { AccessService } from '../access.service';
import { CONSTANTES } from '../../shared/constantes.shared';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { Utils } from '../../shared/utils.shared';


declare var particlesJS: any;

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AccessService],
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
        animate(CONSTANTES.ANIMATION_DELAY_TIME * 2 + "ms ease-in-out")
      ])
    ])
  ]

})
export class LoginComponent implements OnInit {
  public email: string;
  public senha: string;
  public feedbackUsuario = undefined;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public dados: Object;
  public permissoes: Object;
  public grupos: Object;
  public menus: Object;
  public dados_escola: Object;
  public escopo_perfil = new Object();
  public escolas = new Array<Object>();
  public esc_id: number;
  public mensagemAlerta: string = "";
  public status_ativo_usuario: number = 0;
  public mostraSenha: boolean = false;
  public nomeDoSistema: string = "";
  public caminhoImagemLogo: string = "";


  constructor(
    private accessService: AccessService,
    private router: Router,
  ) { }

  ngOnInit() {
    setTimeout(() => {
      particlesJS.load('particles-js', '../../../assets/particles.json', function () {
        console.log('callback - particles.js config loaded');
      });
    }, 200);

    this.definirDadosDoSistema();
    this.accessService
      .deslogar()
      .toPromise()
      .then((response: Response) => {

        this.limparSenha();
      }).catch((erro: Response) => {
        this.limparSenha();
        /* if (!CONSTANTES.PRODUCAO) {
          console.log(CONSTANTES.DEF_MSG_ERRO);
        } else {
          console.log(erro);
        } */
      });
  }



  public definirDadosDoSistema(): void {
    if (CONSTANTES.BUILD_DESTINO == CONSTANTES.BUILD_SEDF) {
      this.nomeDoSistema = CONSTANTES.NOME_SISTEMA_SEDF;
      this.caminhoImagemLogo = CONSTANTES.CAMINHO_LOGO_SEDF;
    }
    if (CONSTANTES.BUILD_DESTINO == CONSTANTES.BUILS_RESOLVIDOS) {
      this.nomeDoSistema = CONSTANTES.NOME_SISTEMA_RESOLVIDOS;
      this.caminhoImagemLogo = CONSTANTES.CAMINHO_LOGO_RESOLVIDOS;
    }
  }

  public mostrarSenha(): void {
    if (this.mostraSenha == false) {
      document.getElementById('senha').setAttribute('type', 'text');
      this.mostraSenha = true;
    } else {
      this.mostraSenha = false;
      document.getElementById('senha').setAttribute('type', 'password');
    }
  }

  public carregarValor(event: Event) {
    this.mensagemAlerta = "";
    if ((<HTMLInputElement>event.target).name == "email") {
      this.email = (<HTMLInputElement>event.target).value;
    }
    if ((<HTMLInputElement>event.target).name == "senha") {
      this.senha = (<HTMLInputElement>event.target).value;
    }
  }

  public chamarLogin(event: KeyboardEvent): void {
    if (event.keyCode == 13) {
      this.logar();
    }
  }

  public selecionarEscola(event: Event): void {
    this.esc_id = parseInt((<HTMLInputElement>event.target).value);
    let escolasArray: Array<Object> = Object.keys(this.escolas).map(
      i => this.escolas[i]
    );
    for (let i = 0; i < escolasArray.length; i++) {
      if (this.esc_id == escolasArray[i]["id"]) {
        let nomeEscola = escolasArray[i]["nome"];
        localStorage.setItem("escola", Utils.encriptBtoA(nomeEscola, CONSTANTES.PASSO_CRIPT));
      }
    }
    document.getElementById('senha').focus();
  }

  public limparDadosLogin(): void {
    this.email = ""
    this.senha = "";
    this.escolas = undefined;
    this.esc_id = null;
    this.mensagemAlerta = "";
  }

  public limparSenha(): void {
    this.senha = "";
    (<HTMLInputElement>document.getElementById("senha")).value = "";
    localStorage.removeItem("perm");
    localStorage.removeItem("dados");
    localStorage.removeItem("escola");
    localStorage.removeItem("grupos");
    localStorage.removeItem("menus");
    localStorage.removeItem("dados_escola");
    localStorage.removeItem("escopo_perfil");
    localStorage.removeItem("esc_id");
    localStorage.removeItem("token");
  }

  public listarEscolas(event: Event): void {
    let email = (<HTMLInputElement>event.target).value
    this.feedbackUsuario = "Listando escolas credenciadas, aguarde...";
    this.accessService.listarPorEmailUsuario(email)
      .toPromise()
      .then((response: Response) => {
        this.escolas = Object.values(response);
        if (this.escolas.length == 0) {
          this.mensagemAlerta = "Usuário não identificado";
        } else {
          this.mensagemAlerta = "";
        }
        this.feedbackUsuario = undefined;
      }).catch((erro: Response) => {
        //Utils.tratarErro({ router: this.router, response: erro });
        this.mensagemAlerta = "";
        if (!CONSTANTES.PRODUCAO) {
          console.log(CONSTANTES.DEF_MSG_ERRO);
        } else {
          console.log(erro);
        }
        this.feedbackUsuario = undefined;
      });
  }

  public logar(): void {
    this.feedbackUsuario = "Verificando credenciais, aguarde...";
    this.accessService
      .logar(this.email, this.senha)
      .toPromise()
      .then((response: Response) => {
        let token: Object = response;
        localStorage.setItem("token", "Bearer " + token["token"]);
      })
      .then(() => {
        this.feedbackUsuario = "Verificando permissoes, aguarde...";
        this.accessService
          .listarPermissoes(this.esc_id)
          .toPromise()
          .then((response: Response) => {
            this.dados = response["dados"];
            this.permissoes = response["permissoes"];
            this.grupos = response["grupos"];
            this.menus = response["menus"];
            this.dados_escola = response["dados_escola"];
            this.escopo_perfil = response['escopo_perfil'];
            console.log(this.escopo_perfil);

            this.status_ativo_usuario = (response["status_ativo_usuario"])[0]["status_ativo_usuario"];

            if (this.status_ativo_usuario === 1) {
              let str_permissoes = JSON.stringify(this.permissoes);
              let str_dados = JSON.stringify(this.dados);
              let str_grupos = JSON.stringify(this.grupos);
              let str_menus = JSON.stringify(this.menus);
              let str_dados_escola = JSON.stringify(this.dados_escola);
              let str_escopo_perfil = JSON.stringify(this.escopo_perfil);

              localStorage.setItem("perm", Utils.encriptBtoA(str_permissoes, CONSTANTES.PASSO_CRIPT));
              localStorage.setItem("dados", Utils.encriptBtoA(str_dados, CONSTANTES.PASSO_CRIPT));
              localStorage.setItem("grupos", Utils.encriptBtoA(str_grupos, CONSTANTES.PASSO_CRIPT));
              localStorage.setItem("menus", Utils.encriptBtoA(str_menus, CONSTANTES.PASSO_CRIPT));
              localStorage.setItem("dados_escola", Utils.encriptBtoA(str_dados_escola, CONSTANTES.PASSO_CRIPT));
              localStorage.setItem("escopo_perfil", Utils.encriptBtoA(str_escopo_perfil, CONSTANTES.PASSO_CRIPT));
              localStorage.setItem("esc_id", Utils.encriptBtoA(this.esc_id.toString(), CONSTANTES.PASSO_CRIPT));
              this.router.navigate(["dashboard"]); setTimeout(() => { window.location.reload(true); }, 1000);
            } else {
              this.limparSenha();
              this.mensagemAlerta = "Acesso não autorizado!";
            }

            this.feedbackUsuario = undefined;
          }).catch((erro: Response) => {
            //Utils.tratarErro({ router: this.router, response: erro });
            if (!CONSTANTES.PRODUCAO) {
              console.log(CONSTANTES.DEF_MSG_ERRO);
            } else {
              console.log(erro);
            }
            this.feedbackUsuario = undefined;
          });
      }).catch((erro: Response) => {
        //Utils.tratarErro({ router: this.router, response: erro });
        if (!CONSTANTES.PRODUCAO) {
          console.log(CONSTANTES.DEF_MSG_ERRO);
        } else {
          console.log(erro);
        }
        this.limparSenha();
        this.mensagemAlerta = "Senha inválida!";
        this.feedbackUsuario = undefined;
      });
  }

}
