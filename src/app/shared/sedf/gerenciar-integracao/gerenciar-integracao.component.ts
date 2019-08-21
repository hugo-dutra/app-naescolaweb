import { Component, OnInit } from '@angular/core';
import { Utils } from '../../utils.shared';
import { SedfService } from '../sedf.service';
import { CONSTANTES } from '../../constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../firebase/firebase.service';
import { Router } from '@angular/router';
import { EtapaEnsinoService } from '../../../crud/etapa-ensino/etapa-ensino.service';
import { EtapaEnsino } from '../../../crud/etapa-ensino/etapa-ensino.model';
import { Serie } from '../../../crud/serie/serie.model';
import { SerieService } from '../../../crud/serie/serie.service';
import { TurmaService } from '../../../crud/turma/turma.service';
import { Turma } from '../../../crud/turma/turma.model';
import { EstudanteService } from '../../../crud/estudante/estudante.service';

@Component({
  selector: 'ngx-gerenciar-integracao',
  templateUrl: './gerenciar-integracao.component.html',
  styleUrls: ['./gerenciar-integracao.component.scss'],
  providers: [SedfService, EtapaEnsinoService, SerieService, TurmaService, EstudanteService]
})
export class GerenciarIntegracaoComponent implements OnInit {
  public inep: string;
  public dados_escola: Object;
  public dadosIntegracao: Array<Object>;
  public dadosToken: Array<Object>;
  public tokenIntegracao: string;
  public arrayOfEstudantesEscola: Array<Object>;
  public arrayOfTurmasEscola: Array<Object>;
  public esc_id: number;
  public ano_atual: number;

  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;


  constructor(
    private sedfService: SedfService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,
    private etapaEnsinoService: EtapaEnsinoService,
    private serieService: SerieService,
    private turmaService: TurmaService,
    private estudanteService: EstudanteService,
  ) { }

  ngOnInit() {
    this.ano_atual = (new Date()).getFullYear();
    this.carregarDados();
  }

  public carregarDados(): void {
    this.dados_escola = JSON.parse(
      Utils.decriptAtoB(
        localStorage.getItem("dados_escola"),
        CONSTANTES.PASSO_CRIPT
      )
    )[0];
    this.esc_id = parseInt(this.dados_escola['id']);
    this.inep = this.dados_escola["inep"];
    this.autenticar();
  }

  public autenticar(): void {
    this.feedbackUsuario = "Atualizando informações, aguarde...";
    this.sedfService.listarDadosIntegracaoIEducar().toPromise().then((response: Response) => {
      this.dadosIntegracao = Object.values(response);
      this.feedbackUsuario = "Finalizando...";
      const matricula = this.dadosIntegracao[0].toString();
      const password = this.dadosIntegracao[1].toString();
      const system = this.dadosIntegracao[2].toString();
      this.sedfService.pegarTokenIntegracao(matricula, password, system).toPromise().then((response: Response) => {
        this.dadosToken = Object.values(response);
        localStorage.setItem("token_intg", this.dadosToken[0].toString());
        this.tokenIntegracao = localStorage.getItem('token_intg');
        this.feedbackUsuario = undefined;
      }).catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      })
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    });
  }

  public sincronizarEstudantes(): void {
    this.feedbackUsuario = 'Listando Estudante...';
    this.sedfService.listarEstudantesImportacao(this.tokenIntegracao, this.inep).toPromise().then((response: Response) => {
      this.arrayOfEstudantesEscola = Object.values(response);
      this.feedbackUsuario = 'Atualizando Estudantes...';
      this.estudanteService.integracaoInserir(this.arrayOfEstudantesEscola, this.esc_id).toPromise().then((response: Response) => {
        this.feedbackUsuario = 'Enturmando Estudantes...';
        this.estudanteService.integracaoEnturmar(this.arrayOfEstudantesEscola).toPromise().then((response: Response) => {
          this.feedbackUsuario = undefined;
        })
      })
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    })
  }

  public sincronizarNotasFaltas(): void {
    alert("Notas e faltas serão sincronizadas por aqui");
  }

  public sincronizarTurmas(): void {
    this.feedbackUsuario = 'Listando Turmas...';
    this.sedfService.listarTurmasImportacao(this.tokenIntegracao, this.inep).toPromise().then((response: Response) => {
      this.arrayOfTurmasEscola = Object.values(response);
      const etapas: EtapaEnsino[] = <EtapaEnsino[]>Utils.eliminaValoresRepetidos(this.arrayOfTurmasEscola, 'nm_curso');
      const series: Serie[] = <Serie[]>Utils.eliminaValoresRepetidos(this.arrayOfTurmasEscola, 'nm_serie');
      const turmas: Turma[] = <Turma[]>this.arrayOfTurmasEscola;
      this.feedbackUsuario = 'Atualizando Cursos...';
      this.etapaEnsinoService.integracaoInserir(etapas).toPromise().then((response: Response) => {
        this.feedbackUsuario = 'Atualizando Séries...';
        this.serieService.integracaoInserir(series).toPromise().then((response: Response) => {
          this.feedbackUsuario = 'Atualizando Turmas...';
          this.turmaService.integracaoInserir(turmas, this.esc_id, this.ano_atual).toPromise().then((response: Response) => {
            this.feedbackUsuario = undefined;
          })
        })
      })
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    })
  }

  public sincronizarProfessores(): void {
    alert("Professores serão sincronizados por aqui");
  }

  public sincronizarGradeHoraria(): void {
    alert("Grade horária será sincronizada por aqui");
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

}
