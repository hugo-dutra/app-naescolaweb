import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../usuario.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-alterar-senha-usuario',
  templateUrl: './alterar-senha-usuario.component.html',
  styleUrls: ['./alterar-senha-usuario.component.scss'],
  providers: [UsuarioService],
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
export class AlterarSenhaUsuarioComponent implements OnInit {

  public feedbackUsuario: string;
  public estado: string = "visivel";
  public esc_id: number;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public usr_id: number;
  public dados_usuario = new Array<Object>();

  public senha1: string = "";
  public senha2: string = "";

  constructor(
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    this.dados_usuario = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT))[0];
    this.usr_id = parseInt(this.dados_usuario['id'], 10);
  }

  public alterarSenha(): void {
    if (this.validarEntradaSenha()) {
      this.feedbackUsuario = "Modificando senha, aguarde...";
      this.usuarioService.modificarSenha(this.usr_id, this.senha1).toPromise().then(() => {
        this.feedbackUsuario = undefined;
        this.alertModalService.showAlertSuccess('Senha modificada com sucesso!!!');
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
  }

  public validarEntradaSenha(): boolean {

    String.prototype.trim

    if (this.senha1 === this.senha2) {
      if (this.senha1 != "" && this.senha2 != "") {
        return true;
      } else {
        this.alertModalService.showAlertDanger('As senha não podem ser vazias!');
        this.limparCampos();
      }
    } else {
      this.alertModalService.showAlertDanger('As senhas não conferem!');
      this.limparCampos();
    }
    return false;
  }

  public cancelarAlterarSenha(): void {
    this.router.navigate(['gerenciar-usuario']);
  }

  public limparCampos(): void {
    this.senha1 = '';
    this.senha2 = '';
    document.getElementById("senha1").focus();
  }

  public gravarStringSenha(event: Event): void {
    switch ((<HTMLInputElement>event.target).id) {
      case "senha1": {
        this.senha1 = (<HTMLInputElement>event.target).value;
        break;
      }

      case "senha2": {
        this.senha2 = (<HTMLInputElement>event.target).value;
        break;
      }
    }
  }

}
