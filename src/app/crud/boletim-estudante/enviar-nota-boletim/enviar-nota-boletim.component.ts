import { Component, OnInit } from '@angular/core';
import { DiarioProfessorService } from '../../diario-professor/diario-professor.service';
import { BoletimEstudanteService } from '../boletim-estudante.service';
import { PeriodoLetivoService } from '../../periodo-letivo/periodo-letivo.service';
import { EstudanteService } from '../../estudante/estudante.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';
import { ResultadoBoletim } from '../resultado-boletim.model';

@Component({
  selector: 'ngx-enviar-nota-boletim',
  templateUrl: './enviar-nota-boletim.component.html',
  styleUrls: ['./enviar-nota-boletim.component.scss'],
  providers: [DiarioProfessorService, BoletimEstudanteService, PeriodoLetivoService, EstudanteService],
  animations: [
    trigger('chamado', [
      state(
        'visivel',
        style({
          opacity: 1
        })
      ),
      transition('void => visivel', [
        style({ opacity: 0 }),
        animate(CONSTANTES.ANIMATION_DELAY_TIME + 'ms ease-in-out')
      ])
    ])
  ]
})
export class EnviarNotaBoletimComponent implements OnInit {

  public estado = 'visivel';
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;

  public dados_escola = new Array<Object>();
  public dados_usuario = new Array<Object>();
  public arrayOfIdsEstudantes = new Array<Object>();

  public modos_tela = { inserir: 'inserir', listar: 'listar' };
  public modo_tela = '';

  public arrayOfDiariosProfessor = new Array<Object>();
  public arrayOfPeriodosLetivos = new Array<Object>();
  public anoAtual: number;

  constructor(
    private diarioProfessorService: DiarioProfessorService,
    private periodoLetivoService: PeriodoLetivoService,
    private estudanteService: EstudanteService,
    private boletimEstudanteService: BoletimEstudanteService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router) { }

  public usr_id: number;
  public esc_id: number;
  public exibirAlerta = false;

  public diarioSelecionado = new Object();
  public idPeriodoLetivoSelecionado: number = -1;
  public tipoConsolicacao: number = -1;

  ngOnInit() {
    this.anoAtual = (new Date()).getFullYear();
    this.dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
    this.dados_usuario = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT))[0];
    this.esc_id = parseInt(this.dados_escola['id'], 10);
    this.usr_id = parseInt(this.dados_usuario['id'], 10);

    this.modo_tela = this.modos_tela.listar;
    this.listarDiariosProfessor();
  }

  public listarDiariosProfessor(): void {
    this.feedbackUsuario = 'Carregando diários, aguarde...';
    this.diarioProfessorService
      .listarPorUsuarioEscola(this.usr_id, this.esc_id, this.anoAtual)
      .toPromise()
      .then((response: Response) => {
        this.arrayOfDiariosProfessor = Object.values(response);
        this.listarPeriodosLetivos();
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

  public listarPeriodosLetivos(): void {
    this.feedbackUsuario = 'Carregando períodos letivos, aguarde...';
    const anoAtual: number = (new Date()).getFullYear();
    this.periodoLetivoService.listarPorAno(anoAtual).toPromise().then((response: Response) => {
      this.arrayOfPeriodosLetivos = Object.values(response);
      this.feedbackUsuario = undefined;
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

  public adicionarRegistroAvaliacao(diario: Object): void {
    this.diarioSelecionado = diario;
    if (this.validarEnvioNotas()) {
      this.desabilitarBotoes();
      this.exibirAlerta = false;
      this.arrayOfIdsEstudantes = [];
      const trm_id = parseInt(this.diarioSelecionado["trm_id"]);
      this.feedbackUsuario = "Listando estudantes...";
      this.estudanteService.listarTurmaId(trm_id).toPromise().then((response: Response) => {
        const estudantesTurmaSelecionada = Object.values(response);
        estudantesTurmaSelecionada.forEach(elem => {
          this.arrayOfIdsEstudantes.push({ id: parseInt(elem['id']), matricula: elem['matricula'] })
        });
        this.feedbackUsuario = "Atualizando boletins de estudantes...";
        this.boletimEstudanteService.inserirBoletimEscolar(this.arrayOfIdsEstudantes, (new Date()).getFullYear()).toPromise().then((response: Response) => {
          this.feedbackUsuario = "Calculando valores de notas...";
          this.boletimEstudanteService.consolidarNotasBoletimEscolar(this.tipoConsolicacao, this.idPeriodoLetivoSelecionado, parseInt(this.diarioSelecionado["dip_id"]))
            .toPromise()
            .then((response: Response) => {
              const arrayOfNotasConsolidadas = Object.values(response);
              let arrayOfResultadoBoletim = new Array<ResultadoBoletim>()
              arrayOfNotasConsolidadas.forEach(elem => {
                let resultadoBoletim = new ResultadoBoletim();
                resultadoBoletim.bes_id = parseInt(elem["bes_id"]);
                resultadoBoletim.dsp_id = parseInt(elem["dsp_id"]);
                resultadoBoletim.prl_id = parseInt(elem["prl_id"]);
                resultadoBoletim.reb_falta = parseInt(elem["faltas"]);
                resultadoBoletim.reb_nota = parseFloat(elem["nota"]);
                arrayOfResultadoBoletim.push(resultadoBoletim);
              })
              this.feedbackUsuario = "Inserindo notas nos boletins, aguarde...";
              this.boletimEstudanteService.inserirResultadoBoletim(arrayOfResultadoBoletim).toPromise().then(() => {
                this.feedbackUsuario = "Processo concluído com sucesso!";
                setTimeout(() => {
                  this.diarioSelecionado = null;
                  this.feedbackUsuario = undefined;
                  this.habilitarBotoes();
                }, 2000);
              }).catch((erro: Response) => {
                //Mostra modal
                this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
                //registra log de erro no firebase usando serviço singlenton
                this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
                //Caso token seja invalido, reenvia rota para login
                Utils.tratarErro({ router: this.router, response: erro });
                this.diarioSelecionado = null;
                this.feedbackUsuario = undefined;
                this.habilitarBotoes();
              })
            })
        }).catch((erro: Response) => {
          //Mostra modal
          this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
          //registra log de erro no firebase usando serviço singlenton
          this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });
          this.diarioSelecionado = null;
          this.feedbackUsuario = undefined;
          this.habilitarBotoes();
        })
      }).catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.diarioSelecionado = null;
        this.feedbackUsuario = undefined;
        this.habilitarBotoes();
      })
    } else {
      this.exibirAlerta = true;
    }




  }

  public desabilitarBotoes(): void {
    Array.from(document.getElementsByClassName("bg-danger")).forEach(elem => {
      (<HTMLInputElement>elem).setAttribute("disabled", "disabled");
    })
  }

  public habilitarBotoes(): void {
    Array.from(document.getElementsByClassName("bg-danger")).forEach(elem => {
      (<HTMLInputElement>elem).removeAttribute("disabled");
    })
  }

  public validarEnvioNotas(): boolean {
    let retorno = true;
    if (this.idPeriodoLetivoSelecionado == -1 || this.tipoConsolicacao == -1 || this.diarioSelecionado == null) {
      retorno = false;
    }
    return retorno;
  }

  public gravarTipoConsolidacao(tipo: number): void {
    this.tipoConsolicacao = tipo;
  }

  public selecionarPeriodo(event: Event): void {
    this.idPeriodoLetivoSelecionado = parseInt((<HTMLInputElement>event.target).value);
  }

  public gerenciarDiarioProfessor(): void {
    this.router.navigate(['gerenciar-diario-registro']);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }


}
