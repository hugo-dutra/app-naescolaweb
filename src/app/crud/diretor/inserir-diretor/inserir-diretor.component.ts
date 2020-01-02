import { Component, OnInit } from '@angular/core';
import { DiretorService } from '../diretor.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Router } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Diretor } from '../diretor.model';
import { FormGroup, FormControl } from '@angular/forms';
import { Utils } from '../../../shared/utils.shared';
import { FirebaseUpload } from '../../../shared/firebase/firebase.upload.model';

@Component({
  selector: 'ngx-inserir-diretor',
  templateUrl: './inserir-diretor.component.html',
  styleUrls: ['./inserir-diretor.component.scss'],
  providers: [DiretorService],
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
export class InserirDiretorComponent implements OnInit {

  constructor(
    private diretorService: DiretorService,
    private router: Router,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService
  ) { }

  public diretor: Diretor = new Diretor();
  public no_avatar_url: string = CONSTANTES.NO_AVATAR_URL;
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public escopoUsuario: string;
  public esc_id: number;

  public formulario: FormGroup = new FormGroup({
    id: new FormControl(null),
    nome: new FormControl(null),
    telefone: new FormControl(null),
    email: new FormControl(null),
    foto: new FormControl(null),
    matricula: new FormControl(null)
  });

  ngOnInit() {
    this.esc_id = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
  }

  public testarDiretorCadastrado(response: Response): string {
    return Object.values(response)[0]["usuario_existente"];
  }

  public inserir(): void {
    //Guarda os parametros do formulario nos atributos do objeto diretor
    if (this.diretor.foto == undefined) this.diretor.foto = "";
    this.diretor.nome = this.formulario.value.nome;
    this.diretor.telefone = this.formulario.value.telefone;
    this.diretor.matricula = this.formulario.value.matricula;
    this.diretor.email = this.formulario.value.email;
    //Pegar esse valor, passar para um serviço fazer um post http para o servidor laravel gravar no banco e retorna o ultimo objeto inserido
    this.feedbackUsuario = "Salvando dados, aguarde...";
    this.diretorService
      .inserir(this.diretor, this.esc_id)
      .toPromise()
      .then((resposta: Response) => {
        if (this.testarDiretorCadastrado(resposta) == "error") {
          this.alertModalService.showAlertWarning(`Diretor '${this.diretor.email}' já cadastrado.`);
          this.feedbackUsuario = undefined;
        } else {
          this.feedbackUsuario = "Dados Salvos";
          this.formulario.reset();
          this.feedbackUsuario = undefined;
          this.diretor.foto = undefined;
          this.exibirAlerta = false;
        }
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
        this.diretor.foto = undefined;
        this.exibirAlerta = true;
      });
  }

  public enviarArquivo(event: Event): void {
    let arquivos: FileList = (<HTMLInputElement>event.target).files;
    let firebaseUpload = new FirebaseUpload(arquivos[0]);
    firebaseUpload.name = Utils.gerarNomeUnico();
    this.feedbackUsuario = "Enviando foto, aguarde...";
    let basePath: string = `${CONSTANTES.FIREBASE_STORAGE_BASE_PATH}/${CONSTANTES.FIREBASE_STORAGE_DIRETOR}`;
    this.firebaseService.enviarArquivoFirebase(firebaseUpload, basePath).then(() => {
      this.feedbackUsuario = "Carregando foto, aguarde...";
      this.firebaseService.pegarUrlArquivoUpload(firebaseUpload, basePath).then((url_download) => {
        this.diretor.foto = url_download;
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
    this.router.navigateByUrl("listar-diretor");
  }

  public listarObjeto(): Object {
    return null;
  }

  public listarObjetos(): Object[] {
    return null;
  }

  public validar(event: Event) {
    Utils.validarCampos({ event: event });
    this.exibirAlerta = false;
  }

}
