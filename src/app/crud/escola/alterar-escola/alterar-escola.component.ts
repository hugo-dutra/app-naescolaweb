import { Component, OnInit } from '@angular/core';
import { EscolaService } from '../escola.service';
import { RegiaoEscolaService } from '../../regiao-escola/regiao-escola.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Escola } from '../escola.model';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';
import { FirebaseUpload } from '../../../shared/firebase/firebase.upload.model';

@Component({
  selector: 'ngx-alterar-escola',
  templateUrl: './alterar-escola.component.html',
  styleUrls: ['./alterar-escola.component.scss'],
  providers: [EscolaService, RegiaoEscolaService],
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
export class AlterarEscolaComponent implements OnInit {

  public regioesEscolas: Object;
  public escola = new Escola();
  public estado: string = 'visivel';
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;

  public formulario = new FormGroup({
    nome: new FormControl(null),
    email: new FormControl(null),
    telefone: new FormControl(null),
    endereco: new FormControl(null),
    logo: new FormControl(null),
    ree_id: new FormControl(null),
    inep: new FormControl(null),
    cep: new FormControl(null),
    cnpj: new FormControl(null),
    nome_abreviado: new FormControl(null),
    assinatura_gestor: new FormControl(null),

  });

  constructor(
    private regiaoEscolaService: RegiaoEscolaService,
    private escolaService: EscolaService,
    private activeroute: ActivatedRoute,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.activeroute.queryParams.subscribe((escola: Escola) => {
      this.escola = JSON.parse(escola['escola']);
    });
    this.listarRegiaoEscola();
  }
  public alterar(): void {
    this.feedbackUsuario = 'Salvando dados, aguarde...';
    this.escolaService
      .alterar(this.escola)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.router.navigate(['listar-escola']);
      })
      .catch((erro: Response) => {
        this.tratarErro(erro);
        this.exibirAlerta = true;
      });
  }

  public modificarInputs(event: Event): void {
    const campo: string = (<HTMLInputElement>event.target).name;
    const valor: string = (<HTMLInputElement>event.target).value;
    this.escola[campo] = valor;
    this.validar(event);
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

  public tratarErro(erro: Response): void {
    // Mostra modal
    this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
    // registra log de erro no firebase usando servi??o singlenton
    this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`,
      JSON.stringify(erro));
    // Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
    // Caso token seja invalido, reenvia rota para login
    Utils.tratarErro({ router: this.router, response: erro });
    this.feedbackUsuario = undefined;
  }


  public enviarArquivo(event: Event): void {
    const arquivos: FileList = (<HTMLInputElement>event.target).files;
    const firebaseUpload = new FirebaseUpload(arquivos[0]);
    firebaseUpload.name = Utils.gerarNomeUnico();

    const basePath: string = `${CONSTANTES.FIREBASE_STORAGE_BASE_PATH}/${CONSTANTES.FIREBASE_STORAGE_DIRETOR}`;
    this.feedbackUsuario = 'Enviando logo, aguarde...';
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
        this.tratarErro(erro);
      });
  }

}
