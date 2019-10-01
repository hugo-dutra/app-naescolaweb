import { Component, OnInit } from '@angular/core';
import { EstudanteService } from '../estudante.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Telefone } from '../telefone.estudante.model';
import { Estudante } from '../estudante.model';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';
import { FirebaseUpload } from '../../../shared/firebase/firebase.upload.model';

@Component({
  selector: 'ngx-alterar-estudante',
  templateUrl: './alterar-estudante.component.html',
  styleUrls: ['./alterar-estudante.component.scss'],
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

export class AlterarEstudanteComponent implements OnInit {
  public str_telefones = new Array<string>();
  public str_telefone: string = "";
  public telefone = new Telefone();
  public obj_telefones = new Object();
  public estudante = new Estudante();
  public estado: string = "visivel";
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public msg_status: boolean;
  public ativo: boolean;
  public est_id: string;
  public dados_escola: Object;
  public matricula: string;
  public inep: string;

  public tipos_sanguineos: Array<string>;

  public formulario = new FormGroup({
    id: new FormControl(null),
    nome: new FormControl(null),
    matricula: new FormControl(null),
    pai: new FormControl(null),
    mae: new FormControl(null),
    responsavel: new FormControl(null),
    email: new FormControl(null),
    endereco: new FormControl(null),
    tipo_sanguineo: new FormControl(null),
    envio_msg_status: new FormControl(null),
    status_ativo: new FormControl(null),
    nascimento: new FormControl(null),
    foto: new FormControl(null),
    cep: new FormControl(null)
  });

  constructor(
    private estudanteService: EstudanteService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.tipos_sanguineos = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    this.route.queryParams.subscribe((estudante: Estudante) => {
      this.estudante = JSON.parse(estudante["estudante"]);
      this.msg_status = this.estudante.envio_msg_status == 1 ? true : false;
      this.ativo = this.estudante.status_ativo == 1 ? true : false;
      this.listarTelefones();
    });
    this.pegarInepMatricula();
  }

  public pegarInepMatricula(): void {
    this.dados_escola = JSON.parse(
      Utils.decriptAtoB(
        localStorage.getItem("dados_escola"),
        CONSTANTES.PASSO_CRIPT
      )
    )[0];
    this.inep = this.dados_escola["inep"];
    this.matricula = this.estudante["matricula"];
  }

  public alterar(): void {
    this.feedbackUsuario = "Salvando dados, aguarde...";
    this.estudanteService
      .alterar(this.estudante)
      .toPromise()
      .then((response: Response) => {
        this.alterarTelefone();
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.exibirAlerta = true;
        this.feedbackUsuario = undefined;
      });
  }

  public alterarTelefone(): void {
    this.feedbackUsuario = "Atualizando telefones, aguarde...";
    this.estudanteService
      .excluirTelefones(this.estudante.id)
      .toPromise()
      .then((response: Response) => {
        let telefones = new Array<Telefone>();
        for (let i = 0; i < this.str_telefones.length; i++) {
          let str_tel = this.str_telefones[i];
          let telefone = new Telefone();
          telefone.est_id = this.estudante.id;
          telefone.telefone = str_tel;
          telefones.push(telefone);
        }
        this.estudanteService
          .inserirTelefones(telefones)
          .toPromise()
          .then((response: Response) => {
            this.feedbackUsuario = undefined;
            this.router.navigateByUrl("listar-estudante");
          }).catch((erro: Response) => {
            //Mostra modal
            this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
            //registra log de erro no firebase usando serviço singlenton
            this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
            //Caso token seja invalido, reenvia rota para login
            Utils.tratarErro({ router: this.router, response: erro });
            this.feedbackUsuario = undefined;
          });
      }).catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public enviarArquivo(event: Event): void {
    this.feedbackUsuario = "Carregando foto, aguarde...";
    let arquivos: FileList = (<HTMLInputElement>event.target).files;
    let firebaseUpload = new FirebaseUpload(arquivos[0]);
    firebaseUpload.name = `${this.inep}_${this.matricula}`;
    //Utils.gerarNomeUnico(); <- Esse método gerava um nome único para o arquivo.

    let basePath: string = `${CONSTANTES.FIREBASE_STORAGE_BASE_PATH}/${CONSTANTES.FIREBASE_STORAGE_ESTUDANTE}`;

    this.firebaseService.enviarArquivoFirebase(firebaseUpload, basePath).then(() => {
      this.firebaseService.pegarUrlArquivoUpload(firebaseUpload, basePath).then(url_download => {
        this.estudante.foto = url_download;
        this.feedbackUsuario = undefined;
      })
        .catch((erro: Response) => {
          //Mostra modal
          this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
          //registra log de erro no firebase usando serviço singlenton
          this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });
          this.feedbackUsuario = undefined;
        });
    })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public modificarInputs(event: Event): void {
    let campo: string = (<HTMLInputElement>event.target).name;
    let valor: any = (<HTMLInputElement>event.target).value;
    this.estudante[campo] = valor;
    this.validar(event);
  }

  public modificarChecks(event: Event): void {
    let campo: string = (<HTMLInputElement>event.target).name;
    let valor: any = (<HTMLInputElement>event.target).checked;
    this.estudante[campo] = valor == true ? 1 : 0;
    this.validar(event);
  }

  public listar(): void {
    this.router.navigateByUrl("listar-estudante");
  }

  public validar(event: Event) {
    Utils.validarCampos({ event: event });
    this.exibirAlerta = false;
  }

  public verificarCEP(event: Event): void {
    let CEP: string = (<HTMLInputElement>event.target).value;
    this.estudanteService
      .consultarCEP(CEP)
      .toPromise()
      .then((response: Response) => {
        let endereco: string =
          response["localidade"] +
          " - " +
          response["uf"] +
          " - " +
          response["bairro"] +
          " - " +
          response["logradouro"];

        if (endereco.indexOf("undefined") < 0) {
          this.estudante.endereco = `${endereco} - ...?`;
        }
      })
      .catch((erro: Response) => {
        //Mostra modal
        //this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        this.formulario.value.endereco = "";
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public listarTelefones(): void {
    this.feedbackUsuario = "Carregando telefones, aguarde...";
    this.estudanteService
      .listarTelefones(this.estudante.id)
      .toPromise()
      .then((response: Response) => {
        this.obj_telefones = response;
        for (let key in this.obj_telefones) {
          let value = this.obj_telefones[key];
          this.str_telefones.push(value.telefone);
        }
        this.feedbackUsuario = undefined;
        this.exibirAlerta = false;
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
        this.exibirAlerta = true;
      });
  }

  public adicionarTelefoneEnter(event): void {
    if (event.key == "Enter") {
      event.preventDefault();
      if (this.str_telefones.indexOf(this.str_telefone) < 0) {
        this.str_telefones.push(this.str_telefone);
        this.str_telefone = "";
      }
    }
  }

  public adicionarTelefone(event): void {
    if (this.str_telefones.indexOf(this.str_telefone) < 0) {
      this.str_telefones.push(this.str_telefone);
      this.str_telefone = "";
    }
  }

  public excluirTelefone(event: Event): void {
    let telefoneClicado: string = (<HTMLInputElement>event.target).value;
    this.str_telefones.splice(this.str_telefones.indexOf(telefoneClicado), 1);


  }

  public gravarTelefone(event: Event): void {
    this.str_telefone = (<HTMLInputElement>event.target).value;
  }

}
