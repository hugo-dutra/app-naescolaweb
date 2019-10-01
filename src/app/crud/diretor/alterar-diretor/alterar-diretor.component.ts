import { Component, OnInit } from '@angular/core';
import { DiretorService } from '../diretor.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Diretor } from '../diretor.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { FirebaseUpload } from '../../../shared/firebase/firebase.upload.model';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-alterar-diretor',
  templateUrl: './alterar-diretor.component.html',
  styleUrls: ['./alterar-diretor.component.scss'],
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
export class AlterarDiretorComponent implements OnInit {

  public diretor = new Diretor();
  public estado: string = "visivel";
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;

  constructor(
    private diretorService: DiretorService,
    private activeroute: ActivatedRoute,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  ngOnInit() {
    this.activeroute.queryParams.subscribe((diretor: Diretor) => {
      this.diretor.id = diretor.id;
      this.diretor.nome = diretor.nome;
      this.diretor.telefone = diretor.telefone;
      this.diretor.email = diretor.email;
      this.diretor.matricula = diretor.matricula;
      this.diretor.foto = diretor.foto;
    });
  }

  public alterar(): void {
    this.feedbackUsuario = "Salvando dados, aguarde...";
    this.diretorService
      .alterar(this.diretor)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.router.navigateByUrl("listar-diretor");
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

  public modificarInputs(event: Event): void {
    let campo: string = (<HTMLInputElement>event.target).name;
    let valor: string = (<HTMLInputElement>event.target).value;
    this.diretor[campo] = valor;

    this.validar(event);
  }

  public enviarArquivo(event: Event): void {
    let arquivos: FileList = (<HTMLInputElement>event.target).files;
    let firebaseUpload = new FirebaseUpload(arquivos[0]);
    firebaseUpload.name = Utils.gerarNomeUnico();

    let basePath: string = `${CONSTANTES.FIREBASE_STORAGE_BASE_PATH}/${CONSTANTES.FIREBASE_STORAGE_DIRETOR}`;
    this.feedbackUsuario = "Enviando foto, aguarde...";
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

  public validar(event: Event) {
    Utils.validarCampos({ event: event });
    this.exibirAlerta = false;
  }

}
