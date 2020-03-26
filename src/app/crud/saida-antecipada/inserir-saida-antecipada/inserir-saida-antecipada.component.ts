import { Component, OnInit } from '@angular/core';
import { SaidaAntecipadaService } from '../saida-antecipada.service';
import { TurmaService } from '../../turma/turma.service';
import { EstudanteService } from '../../estudante/estudante.service';
import { PortariaService } from '../../portaria/portaria.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Router } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { Turma } from '../../turma/turma.model';
import { SaidaAntecipadaEventual } from '../saida-antecipada-eventual.model';
import { SaidaAntecipadaRecorrente } from '../saida-antecipada-recorrente.model';
import { Utils } from '../../../shared/utils.shared';
import * as moment from "moment";

@Component({
  selector: 'ngx-inserir-saida-antecipada',
  templateUrl: './inserir-saida-antecipada.component.html',
  styleUrls: ['./inserir-saida-antecipada.component.scss'],
  providers: [
    SaidaAntecipadaService,
    TurmaService,
    EstudanteService,
    PortariaService,
    FirebaseService
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
export class InserirSaidaAntecipadaComponent implements OnInit {

  constructor(
    private saidaAntecipadaService: SaidaAntecipadaService,
    private router: Router,
    private turmaService: TurmaService,
    private estudanteService: EstudanteService,
    private portariaService: PortariaService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService) { }

  public arrayOfPortarias = new Array<Object>();
  public dadosUsuario = new Object();
  public motivoSaidaAntecipada: string = "";
  public dataSaidaAntecipada: string = "";
  public horaSaidaAntecipada: string = "";
  public turmas = new Array<Turma>();
  public estudantes = new Array<Object>();
  public estudantesSaidaAutorizada = new Array<Object>();
  public arrayOfTurmas = new Array<number>();
  public arrayOfEstudantesSelecionados = new Array<string>();
  public arrayOfIds = new Array<string>();
  public saidaAntecipadaEventual = new SaidaAntecipadaEventual();
  public saidaAntecipadaRecorrente = new SaidaAntecipadaRecorrente();
  public saidaRecorrente: Boolean = false;

  public saidaRecorrenteSegundaFeira: number = 0;
  public saidaRecorrenteTercaFeira: number = 0;
  public saidaRecorrenteQuartaFeira: number = 0;
  public saidaRecorrenteQuintaFeira: number = 0;
  public saidaRecorrenteSextaFeira: number = 0;
  public saidaRecorrenteSabado: number = 0;

  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta = false;
  public esc_id: number;
  public usr_id: number;
  public diasSemanaSaidaRecorrente = new Array<number>();

  ngOnInit() {
    this.esc_id = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
    this.listarTurmas();
    this.dadosUsuario = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT));
    this.usr_id = parseInt(this.dadosUsuario[0]['id']);
    this.dataSaidaAntecipada = moment().format('YYYY-MM-DD');
    this.horaSaidaAntecipada = moment().format('HH:mm');
  }

  public marcarSaidaRecorrente(event: Event): void {
    this.saidaRecorrente = (<HTMLInputElement>event.target).checked;
  }

  public modificarDiaDaSemanaSaidaRecorrente(event: Event): void {
    const statusDiaSemana = (<HTMLInputElement>event.target).checked;
    const diaSemanaSelecionado = parseInt((<HTMLInputElement>event.target).value);
    if (statusDiaSemana) {
      switch (diaSemanaSelecionado) {
        case 2: {
          this.saidaRecorrenteSegundaFeira = 1;
          break;
        }
        case 3: {
          this.saidaRecorrenteTercaFeira = 1;
          break;
        }
        case 4: {
          this.saidaRecorrenteQuartaFeira = 1;
          break;
        }
        case 5: {
          this.saidaRecorrenteQuintaFeira = 1;
          break;
        }
        case 6: {
          this.saidaRecorrenteSextaFeira = 1;
          break;
        }
        case 7: {
          this.saidaRecorrenteSabado = 1;
          break;
        }
        default:
          break;
      }
    } else {
      switch (diaSemanaSelecionado) {
        case 2: {
          this.saidaRecorrenteSegundaFeira = 0;
          break;
        }
        case 3: {
          this.saidaRecorrenteTercaFeira = 0;
          break;
        }
        case 4: {
          this.saidaRecorrenteQuartaFeira = 0;
          break;
        }
        case 5: {
          this.saidaRecorrenteQuintaFeira = 0;
          break;
        }
        case 6: {
          this.saidaRecorrenteSextaFeira = 0;
          break;
        }
        case 7: {
          this.saidaRecorrenteSabado = 0;
          break;
        }
        default:
          break;
      }
    }
  }

  public validarCampos(): boolean {
    if (!this.saidaRecorrente) {
      if (this.arrayOfEstudantesSelecionados.length != 0 &&
        this.motivoSaidaAntecipada.trim() != "" &&
        this.dataSaidaAntecipada != "" &&
        this.dataSaidaAntecipada != "") {
        return true;
      }
    } else {
      if (this.arrayOfEstudantesSelecionados.length != 0 &&
        this.motivoSaidaAntecipada.trim() != "" &&
        this.dataSaidaAntecipada != "" &&
        this.dataSaidaAntecipada != "" && (
          this.saidaRecorrenteSegundaFeira != 0 ||
          this.saidaRecorrenteTercaFeira != 0 ||
          this.saidaRecorrenteQuartaFeira != 0 ||
          this.saidaRecorrenteQuintaFeira != 0 ||
          this.saidaRecorrenteSextaFeira != 0 ||
          this.saidaRecorrenteSabado != 0
        )) {
        return true;
      }
      return false;
    }
  }

  public inserir(): void {
    if (this.validarCampos()) {
      if (this.saidaRecorrente) {//######SAÍDA RECORRENTE
        this.feedbackUsuario = 'Inserindo saídas recorrentes, aguarde...'
        this.saidaAntecipadaRecorrente.arrayOfEstId = this.arrayOfEstudantesSelecionados;
        this.saidaAntecipadaRecorrente.data = this.dataSaidaAntecipada;
        this.saidaAntecipadaRecorrente.hora = this.horaSaidaAntecipada;
        this.saidaAntecipadaRecorrente.motivo = this.motivoSaidaAntecipada;
        this.saidaAntecipadaRecorrente.usr_id = this.usr_id;

        this.saidaAntecipadaRecorrente.segunda = this.saidaRecorrenteSegundaFeira;
        this.saidaAntecipadaRecorrente.terca = this.saidaRecorrenteTercaFeira;
        this.saidaAntecipadaRecorrente.quarta = this.saidaRecorrenteQuartaFeira;
        this.saidaAntecipadaRecorrente.quinta = this.saidaRecorrenteQuintaFeira;
        this.saidaAntecipadaRecorrente.sexta = this.saidaRecorrenteSextaFeira;
        this.saidaAntecipadaRecorrente.sabado = this.saidaRecorrenteSabado;

        this.saidaAntecipadaService
          .inserirAlterarRecorrente(this.saidaAntecipadaRecorrente)
          .toPromise()
          .then(() => {
            let portarias = [];
            const est_ids = this.arrayOfIds;
            const dataSaida = this.saidaAntecipadaRecorrente.data;
            const horaSaida = this.saidaAntecipadaRecorrente.hora;
            this.arrayOfPortarias.forEach(portaria => {
              portarias.push(portaria['codigo']);
            })
            this.firebaseService.gravarSaidaAntecipadaRecorrenteFirebaseFirestore(
              portarias,
              est_ids,
              dataSaida,
              horaSaida,
              this.saidaAntecipadaRecorrente.segunda,
              this.saidaAntecipadaRecorrente.terca,
              this.saidaAntecipadaRecorrente.quarta,
              this.saidaAntecipadaRecorrente.quinta,
              this.saidaAntecipadaRecorrente.sexta,
              this.saidaAntecipadaRecorrente.sabado,
            ).then(retorno => {
              this.feedbackUsuario = undefined;
              this.alertModalService.showAlertSuccess('Operação finalizada com sucesso!');
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
          }).catch(() => {
            this.feedbackUsuario = undefined;
          });
      } else {//######SAÍDA EVENTUAL
        this.feedbackUsuario = 'Inserindo saídas eventuais, aguarde...'
        this.saidaAntecipadaEventual.arrayOfEstId = this.arrayOfEstudantesSelecionados;
        this.saidaAntecipadaEventual.data = this.dataSaidaAntecipada;
        this.saidaAntecipadaEventual.hora = this.horaSaidaAntecipada;
        this.saidaAntecipadaEventual.motivo = this.motivoSaidaAntecipada;
        this.saidaAntecipadaEventual.usr_id = this.usr_id;
        this.saidaAntecipadaService
          .inserirEventual(this.saidaAntecipadaEventual)
          .toPromise()
          .then(() => {
            let portarias = [];
            const ids = this.arrayOfIds;
            const dataSaida = this.saidaAntecipadaEventual.data;
            const horaSaida = this.saidaAntecipadaEventual.hora;
            this.arrayOfPortarias.forEach(portaria => {
              portarias.push(portaria['codigo']);
            })
            this.firebaseService.gravarSaidaAntecipadaEventualFirebaseFirestore(
              portarias,
              ids,
              dataSaida,
              horaSaida
            ).then((retorno: Response) => {
              this.feedbackUsuario = undefined;
              this.alertModalService.showAlertSuccess('Operação finalizada com sucesso!');
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
          }).catch(() => {
            this.feedbackUsuario = undefined;
          });
      }
    } else {
      this.alertModalService.showAlertWarning("Preencha os campos 'Motivo da saída, data, hora e selecione ao menos um estudante'");
    }
  }

  public listarPortarias(): void {
    this.feedbackUsuario = 'Carregando portarias cadastradas, aguarde...';
    this.portariaService.listar(this.esc_id).toPromise().then((retorno: Response) => {
      this.arrayOfPortarias = Object.values(retorno);
      this.feedbackUsuario = undefined;
    }).catch(() => {
      this.feedbackUsuario = undefined;
    })
  }

  public listar(): void {
    this.router.navigate(['filtrar-saida-antecipada']);
  }

  public listarTurmas(): void {
    this.feedbackUsuario = 'Carregando turmas, aguarde...';
    this.turmaService.listarTodasAno(new Date().getFullYear(), this.esc_id).toPromise().then((retorno: Response) => {
      this.turmas = Object.values(retorno);
      this.listarPortarias();
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


  public adicionarEstudantesEscId(esc_id: number): void {
    this.feedbackUsuario = 'Atualizando relação de estudantes, aguarde...';
    this.estudanteService.listarTurmaEscolaId(esc_id).toPromise().then((retorno: Response) => {
      this.estudantes = Object.values(retorno);
      this.estudantes.forEach(est => {
        this.estudantesSaidaAutorizada.push(est);
      })
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

  public adicionarEstudantesTurmaId(trm_id: number): void {
    this.feedbackUsuario = 'Atualizando relação de estudantes, aguarde...';
    this.estudanteService.listarTurmaId(trm_id).toPromise().then((retorno: Response) => {
      this.estudantes = Object.values(retorno);
      this.estudantes.forEach(est => {
        this.estudantesSaidaAutorizada.push(est);
      })
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

  public excluirEstudantesTurmaId(trm_id: number): void {
    let arrayOfIndices = new Array<number>();
    let arrayOfMatriculasParaExcluir = new Array<string>();
    let arrayOfIdsParaExcluir = new Array<string>();
    this.estudantesSaidaAutorizada.forEach(elem => {
      if (trm_id == parseInt(elem['trm_id'])) {
        arrayOfIndices.push(this.estudantesSaidaAutorizada.indexOf(elem));
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
    this.estudantesSaidaAutorizada.splice(arrayOfIndices[0], arrayOfIndices.length);
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
      this.estudantesSaidaAutorizada = [];
      this.arrayOfIds = [];
      //(<HTMLInputElement>document.getElementById('relacao_estudantes')).checked = false;
    } else {
      this.adicionarEstudantesEscId(this.esc_id);
      //(<HTMLInputElement>document.getElementById('relacao_estudantes')).checked = true;
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

  public gravarMotivoSaidaAntecipadaEventual(event: Event): void {
    this.motivoSaidaAntecipada = (<HTMLInputElement>event.target).value;
  }

  public gravarDataSaidaAntecipadaEventual(event: Event): void {
    this.dataSaidaAntecipada = (<HTMLInputElement>event.target).value;
  }

  public gravarHoraSaidaAntecipadaEventual(event: Event): void {
    this.horaSaidaAntecipada = (<HTMLInputElement>event.target).value;
  }


}
