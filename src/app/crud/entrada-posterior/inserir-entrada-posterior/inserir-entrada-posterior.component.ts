import { EntradaPosteriorService } from './../entrada-posterior.service';
import { SaidaAntecipadaService } from './../../saida-antecipada/saida-antecipada.service';
import { Component, OnInit } from '@angular/core';
import { TurmaService } from '../../turma/turma.service';
import { EstudanteService } from '../../estudante/estudante.service';
import { PortariaService } from '../../portaria/portaria.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Router } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { Utils } from '../../../shared/utils.shared';
import * as moment from "moment";
import { Turma } from '../../turma/turma.model';
import { SaidaAntecipadaEventual } from '../../saida-antecipada/saida-antecipada-eventual.model';
import { SaidaAntecipadaRecorrente } from '../../saida-antecipada/saida-antecipada-recorrente.model';
import { EntradaPosterior } from '../entrada-posterior.model';

@Component({
  selector: 'ngx-inserir-entrada-posterior',
  templateUrl: './inserir-entrada-posterior.component.html',
  styleUrls: ['./inserir-entrada-posterior.component.scss'],
  providers: [
    SaidaAntecipadaService,
    TurmaService,
    EstudanteService,
    PortariaService,
    FirebaseService,
    EntradaPosteriorService
  ],
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
export class InserirEntradaPosteriorComponent implements OnInit {
  public arrayOfPortarias = new Array<any>();
  public dadosUsuario = new Object();
  public motivoEntradaPosterior: string = "";
  public dataEntradaPosterior: string = "";
  public horaEntradaPosterior: string = "";
  public turmas = new Array<Turma>();
  public estudantes = new Array<Object>();
  public estudantesEntradaPosterior = new Array<Object>();
  public arrayOfTurmas = new Array<number>();
  public arrayOfEstudantesSelecionados = new Array<string>();
  public arrayOfIds = new Array<string>();
  public entradaPosterior = new EntradaPosterior();

  public entradaPosteriorSegundaFeira: number = 0;
  public entradaPosteriorTercaFeira: number = 0;
  public entradaPosteriorQuartaFeira: number = 0;
  public entradaPosteriorQuintaFeira: number = 0;
  public entradaPosteriorSextaFeira: number = 0;
  public entradaPosteriorSabado: number = 0;

  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta = false;
  public esc_id: number;
  public usr_id: number;
  //public diasSemanaEntradaPosterior = new Array<number>();

  constructor(
    private entradaPosteriorService: EntradaPosteriorService,
    private router: Router,
    private turmaService: TurmaService,
    private estudanteService: EstudanteService,
    private portariaService: PortariaService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.esc_id = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
    this.listarTurmas();
    this.dadosUsuario = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT));
    this.usr_id = parseInt(this.dadosUsuario[0]['id']);
    this.dataEntradaPosterior = moment().format('YYYY-MM-DD');
    this.horaEntradaPosterior = moment().format('HH:mm');
  }
  public listar(): void {
    this.router.navigate(['listar-entrada-posterior']);
  }

  public listarTurmas(): void {
    this.feedbackUsuario = 'Carregando turmas, aguarde...';
    this.turmaService.listarTodasAno(new Date().getFullYear(), this.esc_id).toPromise().then((retorno: Response) => {
      this.turmas = Object.values(retorno);
      this.listarPortarias();
    }).catch((erro: Response) => {
      this.tratarErro(erro);
    })
  }

  public adicionarEstudantesEscId(esc_id: number): void {
    this.feedbackUsuario = 'Atualizando relação de estudantes, aguarde...';
    this.estudanteService.listarTurmaEscolaId(esc_id).toPromise().then((retorno: Response) => {
      this.estudantes = Object.values(retorno);
      this.estudantes.forEach(est => {
        this.estudantesEntradaPosterior.push(est);
      });
      this.feedbackUsuario = undefined;
    }).catch((erro: Response) => {
      this.tratarErro(erro);
    });
  }


  public adicionarEstudantesTurmaId(trm_id: number): void {
    this.feedbackUsuario = 'Atualizando relação de estudantes, aguarde...';
    this.estudanteService.listarTurmaId(trm_id).toPromise().then((retorno: Response) => {
      this.estudantes = Object.values(retorno);
      this.estudantes.forEach(est => {
        this.estudantesEntradaPosterior.push(est);
      })
      this.feedbackUsuario = undefined;
    }).catch((erro: Response) => {
      this.tratarErro(erro);
    })
  }


  public excluirEstudantesTurmaId(trm_id: number): void {
    let arrayOfIndices = new Array<number>();
    let arrayOfMatriculasParaExcluir = new Array<string>();
    let arrayOfIdsParaExcluir = new Array<string>();
    this.estudantesEntradaPosterior.forEach(elem => {
      if (trm_id == parseInt(elem['trm_id'])) {
        arrayOfIndices.push(this.estudantesEntradaPosterior.indexOf(elem));
        arrayOfMatriculasParaExcluir.push(elem['matricula']);
        arrayOfIdsParaExcluir.push(elem['id']);
      }
    })

    // Exclui ID da matriz que grava no banco
    arrayOfIdsParaExcluir.forEach(idParaExcluid => {
      const idx = this.arrayOfEstudantesSelecionados.indexOf(idParaExcluid);
      if (idx >= 0) {
        this.arrayOfEstudantesSelecionados.splice(idx, 1);
      }
    })

    // Exclui Matrículas da matriz que grava no firebase
    arrayOfMatriculasParaExcluir.forEach(idParaExcluir => {
      const idx = this.arrayOfIds.indexOf(idParaExcluir);
      if (idx >= 0) {
        this.arrayOfIds.splice(idx, 1);
      }
    })
    this.estudantesEntradaPosterior.splice(arrayOfIndices[0], arrayOfIndices.length);
  }

  public alertarChecksVazios() {
    if (
      this.arrayOfTurmas.length != 0
    ) {
      this.exibirAlerta = false;
    }
    if (
      this.arrayOfTurmas.length == 0
    ) {
      this.exibirAlerta = true;
    }
  }

  public selecionarTurmaIndividual(event: Event): void {
    let trm_id: number = parseInt((<HTMLInputElement>event.target).name);
    let status: boolean = (<HTMLInputElement>event.target).checked;
    if (status) {
      this.arrayOfTurmas.push(trm_id);
      this.adicionarEstudantesTurmaId(trm_id);
    } else {
      this.arrayOfTurmas.splice(
        this.arrayOfTurmas.indexOf(trm_id, 0),
        1
      );
      this.excluirEstudantesTurmaId(trm_id);
    }
  }

  public selecionarTodasTurmas(event: Event): void {
    let checkBoxes = Array.from(document.getElementsByClassName('checkturmas'));
    this.arrayOfTurmas = [];
    for (let i = 0; i < checkBoxes.length; i++) {
      if ((<HTMLInputElement>event.target).checked) {
        if (!isNaN(parseInt((<HTMLInputElement>checkBoxes[i]).name))) {
          this.arrayOfTurmas.push(parseInt((<HTMLInputElement>checkBoxes[i]).name));
          (<HTMLInputElement>checkBoxes[i]).checked = (<HTMLInputElement>(event.target)).checked;
        }
      } else {
        (<HTMLInputElement>checkBoxes[i]).checked = (<HTMLInputElement>(event.target)).checked;
      }
    }
    if (!(<HTMLInputElement>event.target).checked) {
      this.arrayOfTurmas = [];
      this.arrayOfEstudantesSelecionados = [];
      this.estudantesEntradaPosterior = [];
      this.arrayOfIds = [];
    } else {
      this.adicionarEstudantesEscId(this.esc_id);
    }
  }


  public selecionarEstudanteIndividual(event: Event): void {
    let est_id: string = ((<HTMLInputElement>event.target).name);
    let matricula: string = (<HTMLInputElement>event.target).value;
    let status: boolean = (<HTMLInputElement>event.target).checked;
    if (status) {
      this.arrayOfEstudantesSelecionados.push(est_id);
      this.arrayOfIds.push(est_id);
    } else {
      this.arrayOfEstudantesSelecionados.splice(
        this.arrayOfEstudantesSelecionados.indexOf(est_id, 0),
        1
      );
      this.arrayOfIds.splice(
        this.arrayOfIds.indexOf(matricula, 0),
        1
      );
    }
  }



  public selecionarTodosEstudantes(event: Event): void {
    let checkBoxes = Array.from(document.getElementsByClassName('checkestudantes'));
    this.arrayOfEstudantesSelecionados = [];
    this.arrayOfIds = [];
    for (let i = 0; i < checkBoxes.length; i++) {
      if ((<HTMLInputElement>event.target).checked) {
        if (!isNaN(parseInt((<HTMLInputElement>checkBoxes[i]).name))) {
          this.arrayOfEstudantesSelecionados.push(((<HTMLInputElement>checkBoxes[i]).name));
          this.arrayOfIds.push((<HTMLInputElement>checkBoxes[i]).name);
          (<HTMLInputElement>checkBoxes[i]).checked = (<HTMLInputElement>(event.target)).checked;
        }
      } else {
        (<HTMLInputElement>checkBoxes[i]).checked = (<HTMLInputElement>(
          event.target
        )).checked;
      }
    }
  }


  public inserir(): void {
    if (this.validarCampos()) {
      const arrayDeEntradaPosterior = new Array<EntradaPosterior>();
      this.arrayOfEstudantesSelecionados.forEach((estId) => {
        const entradaPosterior = new EntradaPosterior();
        entradaPosterior.epe_data = this.dataEntradaPosterior;
        entradaPosterior.epe_hora = this.horaEntradaPosterior;
        entradaPosterior.epe_motivo = this.motivoEntradaPosterior;
        entradaPosterior.epe_quarta = this.entradaPosteriorQuartaFeira;
        entradaPosterior.epe_quinta = this.entradaPosteriorQuintaFeira;
        entradaPosterior.epe_sabado = this.entradaPosteriorSabado;
        entradaPosterior.epe_segunda = this.entradaPosteriorSegundaFeira;
        entradaPosterior.epe_sexta = this.entradaPosteriorSextaFeira;
        entradaPosterior.epe_terca = this.entradaPosteriorTercaFeira;
        entradaPosterior.esc_id = this.esc_id;
        entradaPosterior.est_id = parseInt(estId);
        entradaPosterior.usr_id = this.usr_id;
        entradaPosterior.epe_motivo = this.motivoEntradaPosterior;
        arrayDeEntradaPosterior.push(entradaPosterior);
      });

      let portarias = [];
      this.arrayOfPortarias.forEach(portaria => {
        portarias.push(portaria['codigo']);
      });



      const est_ids = this.arrayOfIds;
      this.feedbackUsuario = 'Inserindo estudantes em entrada posterior, aguarde...'
      this.entradaPosteriorService.inserir(arrayDeEntradaPosterior).toPromise().then(() => {
        this.feedbackUsuario = undefined;
      }).then(() => {
        this.feedbackUsuario = 'Enviando estudantes para as portarias, aguarde...'
        this.firebaseService
          .gravarEntradaPosteriorFirebaseFirestore(
            portarias, est_ids, this.dataEntradaPosterior, this.horaEntradaPosterior,
            this.entradaPosteriorSegundaFeira, this.entradaPosteriorTercaFeira, this.entradaPosteriorQuartaFeira,
            this.entradaPosteriorQuintaFeira, this.entradaPosteriorSextaFeira, this.entradaPosteriorSabado, this.motivoEntradaPosterior
          ).then(() => {
            this.feedbackUsuario = undefined;
            this.alertModalService.showAlertSuccess('Operação finalizada com sucesso.');
          }).catch((reason: any) => {
            this.feedbackUsuario = undefined;
            this.tratarErro(reason);
          })
      }).catch((erro: Response) => {
        this.tratarErro(erro);
      })
    } else {
      this.alertModalService.showAlertWarning("Preencha os campos 'Motivo da entrada, data, hora e selecione ao menos um estudante'");
    }
  }



  public listarPortarias(): void {
    this.feedbackUsuario = 'Carregando portarias cadastradas, aguarde...';
    this.portariaService.listar(this.esc_id).toPromise().then((retorno: Response) => {
      this.arrayOfPortarias = Object.values(retorno);
      console.log(this.arrayOfPortarias);
      this.feedbackUsuario = undefined;
    }).catch(() => {
      this.feedbackUsuario = undefined;
    })
  }


  public modificarDiaDaSemanaEntradaPosterior(event: Event): void {
    const statusDiaSemana = (<HTMLInputElement>event.target).checked;
    const diaSemanaSelecionado = parseInt((<HTMLInputElement>event.target).value);
    if (statusDiaSemana) {
      switch (diaSemanaSelecionado) {
        case 2: {
          this.entradaPosteriorSegundaFeira = 1;
          break;
        }
        case 3: {
          this.entradaPosteriorTercaFeira = 1;
          break;
        }
        case 4: {
          this.entradaPosteriorQuartaFeira = 1;
          break;
        }
        case 5: {
          this.entradaPosteriorQuintaFeira = 1;
          break;
        }
        case 6: {
          this.entradaPosteriorSextaFeira = 1;
          break;
        }
        case 7: {
          this.entradaPosteriorSabado = 1;
          break;
        }
        default:
          break;
      }
    } else {
      switch (diaSemanaSelecionado) {
        case 2: {
          this.entradaPosteriorSegundaFeira = 0;
          break;
        }
        case 3: {
          this.entradaPosteriorTercaFeira = 0;
          break;
        }
        case 4: {
          this.entradaPosteriorQuartaFeira = 0;
          break;
        }
        case 5: {
          this.entradaPosteriorQuintaFeira = 0;
          break;
        }
        case 6: {
          this.entradaPosteriorSextaFeira = 0;
          break;
        }
        case 7: {
          this.entradaPosteriorSabado = 0;
          break;
        }
        default:
          break;
      }
    }
  }

  public validarCampos(): boolean {
    if (this.arrayOfEstudantesSelecionados.length != 0 &&
      this.motivoEntradaPosterior.trim() != "" &&
      this.dataEntradaPosterior != "" &&
      this.horaEntradaPosterior != "" && (
        this.entradaPosteriorSegundaFeira != 0 ||
        this.entradaPosteriorTercaFeira != 0 ||
        this.entradaPosteriorQuartaFeira != 0 ||
        this.entradaPosteriorQuintaFeira != 0 ||
        this.entradaPosteriorSextaFeira != 0 ||
        this.entradaPosteriorSabado != 0
      )) {
      return true;
    }
    return false;
  }















  public gravarMotivoEntradaPosterior(event: Event): void {
    this.motivoEntradaPosterior = (<HTMLInputElement>event.target).value;
  }

  public gravarDataEntradaPosterior(event: Event): void {
    this.dataEntradaPosterior = (<HTMLInputElement>event.target).value;
  }

  public gravarHoraEntradaPosterior(event: Event): void {
    this.horaEntradaPosterior = (<HTMLInputElement>event.target).value;
  }

  public tratarErro(erro: Response): void {
    //Mostra modal
    this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
    //registra log de erro no firebase usando serviço singlenton
    this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
    //Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
    //Caso token seja invalido, reenvia rota para login
    Utils.tratarErro({ router: this.router, response: erro });
    this.feedbackUsuario = undefined;
  }

}
