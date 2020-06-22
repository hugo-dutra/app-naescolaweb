import { Component, OnInit } from '@angular/core';
import { EscolaService } from '../escola.service';
import { RegiaoEscolaService } from '../../regiao-escola/regiao-escola.service';
import { RedeEnsinoService } from '../../rede-ensino/rede-ensino.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';
import { Escola } from '../escola.model';
import { FormGroup, FormControl } from '@angular/forms';
import { Utils } from '../../../shared/utils.shared';
import { FirebaseUpload } from '../../../shared/firebase/firebase.upload.model';
import { RedeEnsino } from '../../rede-ensino/rede-ensino.model';

@Component({
  selector: 'ngx-inserir-escola',
  templateUrl: './inserir-escola.component.html',
  styleUrls: ['./inserir-escola.component.scss'],
  providers: [EscolaService, RegiaoEscolaService, RedeEnsinoService],
  animations: [
    trigger('chamado', [
      state(
        'visivel',
        style({
          opacity: 1,
        }),
      ),
      transition('void => visivel', [
        style({ opacity: 0 }),
        animate(CONSTANTES.ANIMATION_DELAY_TIME + 'ms ease-in-out'),
      ]),
    ]),
  ],
})
export class InserirEscolaComponent implements OnInit {

  constructor(
    private diretorService: EscolaService,
    private router: Router,
    private regiaoEscolaService: RegiaoEscolaService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private redeEnsinoService: RedeEnsinoService,
  ) { }

  public escola: Escola = new Escola();
  public regioesEscolas: Object;
  public no_logo_url: string = CONSTANTES.NO_AVATAR_URL;
  public feedbackUsuario: string;
  public estado: string = 'visivel';
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;

  public formulario: FormGroup = new FormGroup({
    id: new FormControl(null),
    ren_id: new FormControl(null),
    nome: new FormControl(null),
    nome_abreviado: new FormControl(null),
    email: new FormControl(null),
    telefone: new FormControl(null),
    endereco: new FormControl(null),
    logo: new FormControl(null),
    ree_id: new FormControl(null),
    inep: new FormControl(null),
    cep: new FormControl(null),
    cnpj: new FormControl(null),
    assinatura_gestor: new FormControl(null),
  });

  ngOnInit() {
    this.listarRegiaoEscola();
    this.gravarRedeEnsino();
  }

  public inserir(): void {
    // Guarda os parametros do formulario nos atributos do objeto diretor
    this.escola.cep = this.formulario.value.cep;
    this.escola.email = this.formulario.value.email;
    this.escola.endereco = this.formulario.value.endereco;
    this.escola.inep = this.formulario.value.inep;
    this.escola.nome = this.formulario.value.nome;
    this.escola.ree_id = this.formulario.value.ree_id;
    this.escola.telefone = this.formulario.value.telefone;
    this.formulario.value.ren_id = localStorage.getItem('ren_id');
    this.escola.ren_id = this.formulario.value.ren_id;
    this.escola.cnpj = this.formulario.value.cnpj;
    this.escola.nome_abreviado = this.formulario.value.nome_abreviado;
    this.feedbackUsuario = 'Salvando dados, aguarde...';
    this.diretorService
      .inserir(this.escola)
      .toPromise()
      .then((response: Response) => {
        if (response == null) {
          this.formulario.reset();
          this.feedbackUsuario = undefined;
          this.escola.logo = undefined;
          this.exibirAlerta = false;
        } else {
          this.alertModalService.showAlertWarning('Já existe uma escola com o INEP informado');
          this.feedbackUsuario = undefined;
          this.exibirAlerta = false;
        }
      })
      .catch((erro: Response) => {
        this.tratarErro(erro);
        this.feedbackUsuario = undefined;
        this.escola.logo = undefined;
        this.exibirAlerta = true;
      });
  }

  public enviarArquivoAssinatura(event: Event): void {
    const arquivos: FileList = (<HTMLInputElement>event.target).files;
    const firebaseUpload = new FirebaseUpload(arquivos[0]);
    firebaseUpload.name = Utils.gerarNomeUnico();
    this.feedbackUsuario = 'Enviando assinatura, aguarde...';
    const basePath: string = `${CONSTANTES.FIREBASE_STORAGE_BASE_PATH}/${CONSTANTES.FIREBASE_STORAGE_ESCOLA}`;
    this.firebaseService.enviarArquivoFirebase(firebaseUpload, basePath).then(() => {
      this.feedbackUsuario = 'Carregando assinatura, aguarde...';
      this.firebaseService.pegarUrlArquivoUpload(firebaseUpload, basePath).then((url_download) => {
        this.escola.assinatura_gestor = url_download;
        this.feedbackUsuario = undefined;
      }).catch((erro: Response) => {
        this.tratarErro(erro);
      });
    }).catch((erro: Response) => {
      this.tratarErro(erro);
    });
  }

  public enviarArquivo(event: Event): void {
    const arquivos: FileList = (<HTMLInputElement>event.target).files;
    const firebaseUpload = new FirebaseUpload(arquivos[0]);
    firebaseUpload.name = Utils.gerarNomeUnico();
    this.feedbackUsuario = 'Enviando logo, aguarde...';
    const basePath: string = `${CONSTANTES.FIREBASE_STORAGE_BASE_PATH}/${CONSTANTES.FIREBASE_STORAGE_ESCOLA}`;
    this.firebaseService.enviarArquivoFirebase(firebaseUpload, basePath).then(() => {
      this.feedbackUsuario = 'Carregando logo, aguarde...';
      this.firebaseService.pegarUrlArquivoUpload(firebaseUpload, basePath).then((url_download) => {
        this.escola.logo = url_download;
        this.feedbackUsuario = undefined;
      }).catch((erro: Response) => {
        this.tratarErro(erro);
      });
    }).catch((erro: Response) => {
      this.tratarErro(erro);
    });
  }

  public listar(): void {
    this.router.navigateByUrl('listar-escola');
  }

  public validar(event: Event) {
    Utils.validarCampos({ event: event });
    this.exibirAlerta = false;
  }


  public validarCNPJ(event: Event): void {
    const cnpj = (<HTMLInputElement>event.target).value;
    const validadeCNPJ = Utils.validarCNPJ(cnpj);
    if (!validadeCNPJ) {
      this.alertModalService.showAlertDanger('CNPJ Inválido');
      this.formulario.get('cnpj').reset();
    }
  }

  public listarRegiaoEscola(): void {
    this.feedbackUsuario = 'Carregando dados, aguarde...';
    this.regiaoEscolaService
      .listar()
      .toPromise()
      .then((response: Response) => {
        this.regioesEscolas = response;
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        console.log(erro);
        this.tratarErro(erro);
      });
  }

  public gravarRedeEnsino(): void {
    this.feedbackUsuario = 'Carregando dados, aguarde...';
    this.redeEnsinoService
      .listar()
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        const redeEnsino = <RedeEnsino><unknown>response;
        localStorage.setItem('ren_id', redeEnsino.id.toString());
      })
      .catch((erro: Response) => {
        this.tratarErro(erro);
      });
  }

  public tratarErro(erro: Response): void {
    // Mostra modal
    this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
    // registra log de erro no firebase usando serviço singlenton
    this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`,
      JSON.stringify(erro));
    // Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
    // Caso token seja invalido, reenvia rota para login
    Utils.tratarErro({ router: this.router, response: erro });
    this.feedbackUsuario = undefined;
  }

}
