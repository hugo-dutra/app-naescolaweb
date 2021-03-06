import { Component, OnInit } from '@angular/core';
import { EstudanteService } from '../../estudante/estudante.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';

@Component({
  selector: 'ngx-sincronizar-estudante-aplicativo',
  templateUrl: './sincronizar-estudante-aplicativo.component.html',
  styleUrls: ['./sincronizar-estudante-aplicativo.component.scss'],
  providers: [EstudanteService, FirebaseService],
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
export class SincronizarEstudanteAplicativoComponent implements OnInit {

  public feedbackUsuario: string = undefined;
  public estado: string = 'visivel';
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public arrayOfEstudantesAplicativo = new Array<Object>();
  public esc_id: number;
  public dados_escola: Object;

  constructor(
    private estudanteService: EstudanteService,
    private firebaseService: FirebaseService,
    private router: Router,
    private alertModalService: AlertModalService,
  ) { }

  ngOnInit() {
    this.dados_escola = JSON.parse(
      Utils.decriptAtoB(
        localStorage.getItem('dados_escola'),
        CONSTANTES.PASSO_CRIPT,
      ),
    )[0];
    this.esc_id = parseInt(this.dados_escola['id'], 10);
  }

  public sincronizarDadosNoAplicativoAdministrativo(): void {
    const dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
    const telefone = dados_escola['telefone'];
    this.feedbackUsuario = 'Carregando dados para aplicativo adminstrativo, aguarde...';
    this.estudanteService.listarEstudantesAplicativo(this.esc_id).toPromise().then((response: Response) => {
      this.arrayOfEstudantesAplicativo = Object.values(response);
      const arrayDeEstudantesAplicativoEstruturado = new Array<Object>();
      const arrayDeEstudantesAplicativo = new Array<Object>();
      this.arrayOfEstudantesAplicativo.forEach(estudante => {
        let dataFoto = 0;
        if (estudante['data_foto'] != null) {
          dataFoto = parseInt(estudante['data_foto'], 10) * 1000;
        }
        const escola = estudante['escola'];
        const etapa = estudante['etapa'];
        const foto = {
          datePicture: new Date(dataFoto), url: estudante['foto'],
          userId: estudante['usr_id_foto'], userName: estudante['usuario'],
        };
        const inep = estudante['inep'];
        const matricula = estudante['matricula'];
        const nome = estudante['nome'];
        const serie = estudante['serie'];
        const telefoneEscola = telefone;
        const turma = estudante['turma'];
        const turno = estudante['turno'];
        arrayDeEstudantesAplicativoEstruturado.push({
          escola, etapa, foto, inep, matricula,
          nome, serie, telefoneEscola, turma, turno,
        });
        arrayDeEstudantesAplicativo.push({
          escola, etapa, foto, inep, matricula, nome, serie,
          telefoneEscola, turma, turno,
        });
      });
      this.feedbackUsuario = 'Gravando documento, aguarde...';
      let parteArray = 0;
      const tamanhoDocumento = 500;
      while (arrayDeEstudantesAplicativoEstruturado.length) {
        const pedaco = arrayDeEstudantesAplicativoEstruturado.splice(0, tamanhoDocumento);
        this.firebaseService.gravarListagemEstudantesAplicativoDocumentoUnico(pedaco, parteArray).then(() => { })
          .catch((erro: Response) => {
            this.mostrarAlertaErro(erro);
          });
        parteArray++;
        this.feedbackUsuario = 'Gravando estudantes, pode demorar um pouco, aguarde...';
        this.firebaseService.gravarListagemEstudantesAplicativoAdministrativoBatch(pedaco).then(() => {
          this.feedbackUsuario = undefined;
        }).catch((erro: Response) => {
          this.mostrarAlertaErro(erro);
        });
      }
    }).catch((erro: Response) => {
      this.mostrarAlertaErro(erro);
    });
  }

  public gerenciarAplicativo(): void {
    this.router.navigate(['gerenciar-aplicativo']);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public mostrarAlertaErro(erro: Response): void {
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
}




