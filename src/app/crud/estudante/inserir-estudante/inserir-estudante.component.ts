import { Component, OnInit } from '@angular/core';
import { EstudanteService } from '../estudante.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Utils } from '../../../shared/utils.shared';
import { FirebaseUpload } from '../../../shared/firebase/firebase.upload.model';
import { Telefone } from '../telefone.estudante.model';
import { Estudante } from '../estudante.model';

@Component({
  selector: 'ngx-inserir-estudante',
  templateUrl: './inserir-estudante.component.html',
  styleUrls: ['./inserir-estudante.component.scss'],
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
export class InserirEstudanteComponent implements OnInit {

  public str_telefones = new Array<string>();
  public str_telefone: string = "";
  public telefone = new Telefone();
  public estudante = new Estudante();
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public extudanteMatriculado: boolean = false;
  public est_id: string;
  public esc_id: number;
  public inep: string;


  constructor(
    private estudanteService: EstudanteService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

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

  ngOnInit() {
    this.esc_id = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
    this.inep = Utils.pegarDadosEscola()['inep'];
  }

  public inserir(): void {
    //Guarda os parametros do formulario nos atributos do objeto diretor
    this.estudante.id = this.formulario.value.id;
    this.estudante.nome = this.formulario.value.nome;
    this.estudante.matricula = this.formulario.value.matricula;
    this.estudante.pai = this.formulario.value.pai;
    this.estudante.mae = this.formulario.value.mae;
    this.estudante.responsavel = this.formulario.value.responsavel;
    this.estudante.email = this.formulario.value.email;
    this.estudante.endereco = this.formulario.value.endereco;
    this.estudante.tipo_sanguineo = this.formulario.value.tipo_sanguineo;
    this.estudante.envio_msg_status = this.formulario.value.envio_msg_status;
    this.estudante.status_ativo = this.formulario.value.status_ativo;
    this.estudante.nascimento = this.formulario.value.nascimento;
    //this.estudante.foto = this.formulario.value.foto;
    this.estudante.cep = this.formulario.value.cep;
    this.estudante.esc_id = parseInt(
      Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT)
    );

    if (this.estudante.foto == undefined) {
      this.estudante.foto = ""
    }

    this.feedbackUsuario = "Salvando dados, aguarde...";
    this.estudanteService
      .inserir(this.estudante)
      .toPromise()
      .then((response: Response) => {
        let estudante_id = new Object();
        estudante_id = response;
        this.est_id = estudante_id[0].est_id;
        this.inserirTelefones();
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

  public listar(): void {
    this.router.navigateByUrl("listar-estudante");
  }

  public validar(event: Event) {
    Utils.validarCampos({ event: event });
    this.exibirAlerta = false;
  }

  public enviarArquivo(event: Event): void {
    this.feedbackUsuario = "Carregando foto, aguarde...";
    let arquivos: FileList = (<HTMLInputElement>event.target).files;
    let firebaseUpload = new FirebaseUpload(arquivos[0]);
    firebaseUpload.name = Utils.gerarNomeUnico();
    let basePath: string = `${CONSTANTES.FIREBASE_STORAGE_BASE_PATH}/${CONSTANTES.FIREBASE_STORAGE_ESTUDANTE}`;
    this.firebaseService.enviarArquivoFirebase(firebaseUpload, basePath).then(() => {
      this.firebaseService.pegarUrlArquivoUpload(firebaseUpload, basePath).then(url_download => {
        this.estudante.foto = url_download;
        this.feedbackUsuario = undefined;
      }).then((metadata) => {
        console.log({ metadata });
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

  public enviarArquivoExcel(event: Event): void {
    this.feedbackUsuario = "Carregando estudantes, aguarde...";
    let arquivos: FileList = (<HTMLInputElement>event.target).files;
    this.estudanteService.enviarArquivoExcel(arquivos).toPromise().then((response: Response) => {
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

  public inserirTelefones(): void {
    let telefones = new Array<Telefone>();
    for (let i = 0; i < this.str_telefones.length; i++) {
      let str_tel = this.str_telefones[i];
      let telefone = new Telefone();
      telefone.est_id = parseInt(this.est_id);
      telefone.telefone = str_tel;
      telefones.push(telefone);
    }
    this.feedbackUsuario = "Salvando telefones, aguarde...";
    this.estudanteService
      .inserirTelefones(telefones)
      .toPromise()
      .then((response: Response) => {
        this.formulario.reset();
        this.str_telefones = [];
        this.feedbackUsuario = undefined;
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
        this.feedbackUsuario = undefined;
        this.exibirAlerta = true;
      });
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
          this.formulario.value.endereco = endereco;
        }

        if (this.formulario.value.endereco.indexOf("undefined") >= 0) {
          this.formulario.value.endereco = "";
        }
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

  public importarEstudante(): void {
    this.router.navigate(["importar-estudante"]);
  }

  public validarMatricula(event: Event): void {
    let matricula = (<HTMLInputElement>event.target).value;
    this.estudanteService.validarMatricula(matricula).toPromise().then((response: Response) => {
      let matriculado = (response[0]["matriculado"]);
      if (matriculado == 1) {
        (<HTMLInputElement>event.target).classList.add("is-invalid");
        document.getElementById("btn_salvar").setAttribute("disabled", "disabled");
        this.extudanteMatriculado = true;

      } else {
        (<HTMLInputElement>event.target).classList.remove("is-invalid");
        document.getElementById("btn_salvar").removeAttribute("disabled");
        this.extudanteMatriculado = false;
      }
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
    //Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
    })
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

}
