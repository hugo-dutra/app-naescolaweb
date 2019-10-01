import { Component, OnInit } from '@angular/core';
import { RedeEnsinoService } from '../rede-ensino.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';
import { RedeEnsino } from '../rede-ensino.model';
import { FormGroup, FormControl } from '@angular/forms';
import { Utils } from '../../../shared/utils.shared';
import { FirebaseUpload } from '../../../shared/firebase/firebase.upload.model';

@Component({
  selector: 'ngx-inserir-rede-ensino',
  templateUrl: './inserir-rede-ensino.component.html',
  styleUrls: ['./inserir-rede-ensino.component.scss'],
  providers: [RedeEnsinoService],
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
export class InserirRedeEnsinoComponent implements OnInit {

  constructor(
    private redeEnsinoService: RedeEnsinoService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  public redeEnsino: RedeEnsino = new RedeEnsino();
  public no_logo_url: string = CONSTANTES.NO_LOGO_URL;
  public formularioValido: boolean = false;
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;

  public formulario: FormGroup = new FormGroup({
    id: new FormControl(null),
    nome: new FormControl(null),
    abreviatura: new FormControl(null),
    email: new FormControl(null),
    responsavel: new FormControl(null),
    telefone: new FormControl(null),
    endereco: new FormControl(null),
    cnpj: new FormControl(null),
    logo: new FormControl(null)
  });

  ngOnInit() {
    this.listar();
  }
  public modificar(): void { }

  public inserir(): void {
    this.feedbackUsuario = "Salvando dados, aguarde...";
    this.redeEnsinoService
      .inserir(this.redeEnsino)
      .toPromise()
      .then((resposta: Response) => {
        this.feedbackUsuario = "Dados Salvos";
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
        this.exibirAlerta = true;
      });
  }

  public enviarArquivo(event: Event) {
    let arquivos: FileList = (<HTMLInputElement>event.target).files;
    let firebaseUpload = new FirebaseUpload(arquivos[0]);

    firebaseUpload.name = Utils.gerarNomeUnico();
    let basePath: string = `${CONSTANTES.FIREBASE_STORAGE_BASE_PATH}/${CONSTANTES.FIREBASE_STORAGE_REDE_ENSINO}`;
    this.feedbackUsuario = "Enviando foto, aguarde...";
    this.firebaseService.enviarArquivoFirebase(firebaseUpload, basePath).then(() => {
      this.feedbackUsuario = "Garregando foto, aguarde...";
      this.firebaseService.pegarUrlArquivoUpload(firebaseUpload, basePath).then((url_download) => {
        this.redeEnsino.logo = url_download;
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

  public excluir(): void { }

  public listar(): void {
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.redeEnsinoService
      .listar()
      .toPromise()
      .then((response: Response) => {
        this.redeEnsino = <RedeEnsino>response[0];
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

  public modificarInputs(event: Event): void {
    let campo: string = (<HTMLInputElement>event.target).name;
    let valor: string = (<HTMLInputElement>event.target).value;
    this.redeEnsino[campo] = valor;
    this.validar(event);
  }

  public validar(event: Event) {
    Utils.validarCampos({ event: event });
    this.exibirAlerta = false;
  }

  public listarObjeto(): Object {
    return new RedeEnsino();
  }

  public listarObjetos(): Object[] {
    return null;
  }


}
