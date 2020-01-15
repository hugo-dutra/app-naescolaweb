import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../../perfil/perfil.service';
import { UsuarioProfessorService } from '../../usuario-professor/usuario-professor.service';

import { UsuarioService } from '../usuario.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Usuario } from '../usuario.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';
import { FirebaseUpload } from '../../../shared/firebase/firebase.upload.model';

@Component({
  selector: 'ngx-alterar-usuario',
  templateUrl: './alterar-usuario.component.html',
  styleUrls: ['./alterar-usuario.component.scss'],
  providers: [UsuarioService, UsuarioProfessorService],
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
export class AlterarUsuarioComponent implements OnInit {

  public usuario = new Usuario();
  public estado: string = "visivel";
  public perfis: Object;
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public dados_escola = new Array<Object>();
  public esc_id: number;

  constructor(
    private usuarioService: UsuarioService,
    private usuarioProfessorService: UsuarioProfessorService,
    private router: Router,
    private route: ActivatedRoute,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,

  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((usuario: Usuario) => {
      this.usuario = JSON.parse(usuario["usuario"]);
    });
    this.carregarDados();
    this.listarPerfis();
  }

  public carregarDados(): void {
    const dados_escola = localStorage.getItem('dados_escola');
    if (dados_escola != undefined && dados_escola != null && dados_escola != "") {
      this.dados_escola = JSON.parse(Utils.decriptAtoB(dados_escola, CONSTANTES.PASSO_CRIPT))[0];
      this.esc_id = parseInt(this.dados_escola['id']);
    }
  }

  public listarPerfis(): void {
    this.feedbackUsuario = "Carregando perfis..."
    this.usuarioService
      .listarEscolaPerfilStatus(this.usuario.id, this.esc_id)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.perfis = response;
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

  public alterarStatusUsuario(use_id: number, event: Event): void {
    const use_id_local = use_id;
    const status_checked = (<HTMLInputElement>event.target).checked == true ? 1 : 0;
    this.feedbackUsuario = "Alterando status do usuário...";
    this.usuarioService.alterarStatusUsuario(use_id_local, status_checked).toPromise().then(() => {
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
  }

  public alterar(): void {
    this.feedbackUsuario = "Salvando dados, aguarde...";
    this.usuarioService
      .alterar(this.usuario)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.router.navigateByUrl("listar-usuario");
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
        this.exibirAlerta = true;
        this.feedbackUsuario = undefined;
      });
  }

  public desvincular(): void {
    this.feedbackUsuario = 'Desvinculando professor de usuário, aguarde...';
    this.usuarioProfessorService.desvincular(this.usuario.id).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.alertModalService.showAlertSuccess('Desvinculação concluída.');
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

  public enviarArquivo(event: Event): void {
    let arquivos: FileList = (<HTMLInputElement>event.target).files;
    let firebaseUpload = new FirebaseUpload(arquivos[0]);
    firebaseUpload.name = Utils.gerarNomeUnico();

    let basePath: string = `${CONSTANTES.FIREBASE_STORAGE_BASE_PATH}/${CONSTANTES.FIREBASE_STORAGE_USUARIO}`;
    this.feedbackUsuario = "Enviando foto, aguarde...";
    this.firebaseService.enviarArquivoFirebase(firebaseUpload, basePath).then(() => {
      this.firebaseService.pegarUrlArquivoUpload(firebaseUpload, basePath).then((url_download) => {
        this.feedbackUsuario = "Carregando foto, aguarde...";
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

  public modificarInputs(event: Event): void {
    let campo: string = (<HTMLInputElement>event.target).name;
    let valor: string = (<HTMLInputElement>event.target).value;
    this.usuario[campo] = valor;
    this.validar(event);
  }

  public validar(event: Event) {
    Utils.validarCampos({ event: event });
    this.exibirAlerta = false;
  }

  public listar(): void {
    this.router.navigateByUrl("listar-usuario");
  }

}
