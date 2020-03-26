import { Component, OnInit } from '@angular/core';
import { EstudanteService } from '../../estudante/estudante.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-baixar-foto-estudante-aplicativo',
  templateUrl: './baixar-foto-estudante-aplicativo.component.html',
  styleUrls: ['./baixar-foto-estudante-aplicativo.component.scss'],
  providers: [EstudanteService],
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
export class BaixarFotoEstudanteAplicativoComponent implements OnInit {

  public feedbackUsuario: string;
  public estado: string = 'visivel';
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public arrayOfEstudantesAplicativo = new Array<Object>();
  public esc_id: number;
  public inep: string;
  public dados_escola: Object;
  public anoAtual: number;
  public arrayOfEstudantesSemFoto: Array<Object>;
  public sobrescreveFoto: number = 0;

  constructor(
    private estudanteService: EstudanteService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router) { }

  ngOnInit() {
    this.dados_escola = JSON.parse(
      Utils.decriptAtoB(
        localStorage.getItem('dados_escola'),
        CONSTANTES.PASSO_CRIPT,
      ),
    )[0];
    this.esc_id = parseInt(this.dados_escola['id'], 10);
    this.inep = this.dados_escola['inep'];
    this.anoAtual = (new Date()).getFullYear();
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public gerenciarAplicativo(): void {
    this.router.navigate(['gerenciar-aplicativo']);
  }

  public listarSincronizarFotosEstudantesFirebase(sobrescrever: number): void {
    this.feedbackUsuario = 'Listando fotos obtidas no aplicativo administrativo, aguarde...';
    this.firebaseService.lerFotosEstudanteAplicativoAdministrativo(this.inep)
      .then((querySnapshot: firebase.firestore.QuerySnapshot) => {
        const arrayOfEstudantes = new Array<Object>();
        querySnapshot.forEach(documento => {
          const dadosEstudantes = documento.data();
          arrayOfEstudantes.push(dadosEstudantes);
        });
        this.feedbackUsuario = 'Atualizando fotos na base, aguarde...';
        this.estudanteService
          .alterarFotosEstudantesAplicativoAdministrativo(arrayOfEstudantes, sobrescrever)
          .toPromise()
          .then(() => {
            this.sincronizarDadosNoAplicativoAdministrativo();
          });
      }).catch((erro: Response) => {
        this.mostrarAlertaErro(erro);
      });
  }

  public sobrescreverFoto(event: Event): void {
    const valor = (<HTMLInputElement>(event.target)).checked;
    this.sobrescreveFoto = valor == true ? 1 : 0;
  }

  public sincronizarFotos(): void {
    this.listarSincronizarFotosEstudantesFirebase(this.sobrescreveFoto);
  }

  public sincronizarDadosNoAplicativoAdministrativo(): void {
    const dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
    const telefone = dados_escola['telefone'];
    this.feedbackUsuario = 'Atualizando dados para aplicativo adminstrativo, aguarde...';
    this.estudanteService.listarEstudantesAplicativo(this.esc_id).toPromise().then((response: Response) => {
      this.arrayOfEstudantesAplicativo = Object.values(response);
      const arrayDeEstudantesAplicativoEstruturado = new Array<Object>();
      const arrayDeEstudantesAplicativo = new Array<Object>();
      this.arrayOfEstudantesAplicativo.forEach(estudante => {
        let dataFoto = 0;
        if (estudante['dataFoto'] != null) {
          dataFoto = parseInt(estudante['dataFoto'], 10) * 1000;
        }
        const escola = estudante['escola'];
        const etapa = estudante['etapa'];
        const foto = {
          datePicture: new Date(dataFoto), url: estudante['foto'],
          userId: estudante['usr_id_foto'], userName: estudante['usuario'],
        };
        const inep = estudante['inep'];
        const est_id = estudante['est_id'];
        const nome = estudante['nome'];
        const serie = estudante['serie'];
        const telefoneEscola = telefone;
        const turma = estudante['turma'];
        const turno = estudante['turno'];
        arrayDeEstudantesAplicativoEstruturado.push({
          escola, etapa, foto, inep, est_id,
          nome, serie, telefoneEscola, turma, turno,
        });
        arrayDeEstudantesAplicativo.push({
          escola, etapa, foto, inep, est_id, nome,
          serie, telefoneEscola, turma, turno,
        });
      });
      this.feedbackUsuario = 'Gravando documento para carga única, aguarde...';
      let parteArray = 0;
      const tamanhoDocumento = 500;
      while (arrayDeEstudantesAplicativoEstruturado.length) {
        const pedaco = arrayDeEstudantesAplicativoEstruturado.splice(0, tamanhoDocumento);
        this.firebaseService.gravarListagemEstudantesAplicativoDocumentoUnico(pedaco, parteArray).then(() => { })
          .catch((erro: Response) => {
            this.mostrarAlertaErro(erro);
          });
        parteArray++;
        this.feedbackUsuario = 'Gravando coleção de estudantes, pode demorar um pouco, aguarde...';
        this.firebaseService.gravarListagemEstudantesAplicativoAdministrativoBatch(pedaco).then(() => {
          if (this.feedbackUsuario != undefined) {
            this.alertModalService.showAlertSuccess('Operação finalizada com sucesso!');
          }
          this.feedbackUsuario = undefined;
        }).catch((erro: Response) => {
          this.mostrarAlertaErro(erro);
        });
      }
    }).catch((erro: Response) => {
      this.mostrarAlertaErro(erro);
    });
  }

  public mostrarAlertaErro(erro: Response): void {
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
