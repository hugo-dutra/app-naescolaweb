import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../../perfil/perfil.service';
import { UsuarioService } from '../usuario.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Usuario } from '../usuario.model';
import { FormGroup, FormControl } from '@angular/forms';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { Utils } from '../../../shared/utils.shared';
import { FirebaseUpload } from '../../../shared/firebase/firebase.upload.model';

@Component({
  selector: 'ngx-inserir-usuario',
  templateUrl: './inserir-usuario.component.html',
  styleUrls: ['./inserir-usuario.component.scss'],
  providers: [UsuarioService, PerfilService],
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
export class InserirUsuarioComponent implements OnInit {

  public usuario = new Usuario();
  public perfis: Object;
  public no_avatar_url: string = CONSTANTES.NO_AVATAR_URL;
  public feedbackUsuario: string;

  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;

  public formulario = new FormGroup({
    id: new FormControl(null),
    nome: new FormControl(null),
    senha: new FormControl(null),
    confirmarSenha: new FormControl(null),
    email: new FormControl(null),
    foto: new FormControl(null)
  });


  constructor(
    private usuarioService: UsuarioService,
    private perfilService: PerfilService,
    private firebaseService: FirebaseService,
    private router: Router,
    private alertModalService: AlertModalService
  ) { }

  ngOnInit() {
    this.listarPerfis();

  }

  public carregarObjeto(): void {
    this.usuario.nome = this.formulario.value.nome;
    this.usuario.senha = this.formulario.value.senha;
    this.usuario.email = this.formulario.value.email;
    this.usuario.esc_id = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
  }

  public inserir(): void {
    if (this.formulario.value.confirmarSenha == this.formulario.value.senha) {
      this.carregarObjeto();
      this.feedbackUsuario = "Salvando dados, aguarde...";
      this.usuarioService
        .inserir(this.usuario)
        .toPromise()
        .then((response: Response) => {
          this.feedbackUsuario = undefined;
          this.formulario.reset();
          this.usuario.foto = undefined;
          this.exibirAlerta = false;
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

          this.usuario.foto = undefined;
          this.exibirAlerta = true;
        });
    } else {
      this.alertModalService.showAlertWarning("Os valores de senha devem ser iguais");
    }
  }

  public listarPerfis(): void {
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.perfilService
      .listar()
      .toPromise()
      .then((response: Response) => {
        this.perfis = response;
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

  public enviarArquivo(event: Event): void {
    let arquivos: FileList = (<HTMLInputElement>event.target).files;
    let firebaseUpload = new FirebaseUpload(arquivos[0]);
    firebaseUpload.name = Utils.gerarNomeUnico();
    this.feedbackUsuario = "Enviando foto, aguarde";
    let basePath: string = `${CONSTANTES.FIREBASE_STORAGE_BASE_PATH}/${CONSTANTES.FIREBASE_STORAGE_USUARIO}`;
    this.firebaseService.enviarArquivoFirebase(firebaseUpload, basePath).then(() => {
      this.feedbackUsuario = "Carregando foto, aguarde";
      this.firebaseService.pegarUrlArquivoUpload(firebaseUpload, basePath).then((url_download) => {
        this.usuario.foto = url_download;
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
  }

  public listar(): void {
    this.router.navigateByUrl("listar-usuario");
  }

  public validar(event: Event) {
    Utils.validarCampos({ event: event });
    this.exibirAlerta = false;
  }

}
