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
import { TurnoService } from '../../../crud/turno/turno.service';
import { Turno } from '../../../crud/turno/turno.model';
import { Disciplina } from '../../../crud/disciplina/disciplina.model';
import { DisciplinaService } from '../../../crud/disciplina/disciplina.service';

@Component({
  selector: 'ngx-gerenciar-integracao',
  templateUrl: './gerenciar-integracao.component.html',
  styleUrls: ['./gerenciar-integracao.component.scss'],
  providers: [
    SedfService,
    EtapaEnsinoService,
    SerieService,
    TurmaService,
    EstudanteService,
    TurnoService,
    DisciplinaService]
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
  public notasFaltasEstudantes = new Array<Object>();
  public disciplinas = new Array<Object>();

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
    private turnoService: TurnoService,
    private disciplinaService: DisciplinaService,
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
        this.gravarErroMostrarMensagem(erro);
      })
    }).catch((erro: Response) => {
      this.gravarErroMostrarMensagem(erro);
    });
  }

  public inserirEstudantesEmBlocos(arrayComEstudantes: Object[], esc_id: number): Promise<Object> {
    const retorno = new Promise((resolve, reject) => {
      this.feedbackUsuario = "Iniciando carga, aguarde...";
      const tamanhoBloco = 250;
      let contaRegistroInserido = 0;
      for (let i = 0; i < arrayComEstudantes.length; i += tamanhoBloco) {
        let blocoDeEstudantes = arrayComEstudantes.slice(i, i + tamanhoBloco);
        this.estudanteService.integracaoInserir(blocoDeEstudantes, this.esc_id).toPromise().then((response: Response) => {
          contaRegistroInserido += tamanhoBloco;
          this.feedbackUsuario = `Inserindo ${contaRegistroInserido} de ${arrayComEstudantes.length} registros, aguarde...`;
          if (contaRegistroInserido >= arrayComEstudantes.length) {
            resolve({ message: "Alunos inseridos com sucesso" });
          }
        }).catch(() => {
          reject({ message: "Erro ao inserir estudantes." });
        })
      }
    })
    return retorno;
  }

  public enturmarEstudantesEmBlocos(arrayComEstudantes: Object[]): Promise<Object> {
    const retorno = new Promise((resolve, reject) => {
      this.feedbackUsuario = "Iniciando enturmação, aguarde...";
      const tamanhoBloco = 250;
      let contaRegistroInserido = 0;
      for (let i = 0; i < arrayComEstudantes.length; i += tamanhoBloco) {
        let blocoDeEstudantes = arrayComEstudantes.slice(i, i + tamanhoBloco);
        this.estudanteService.integracaoEnturmar(blocoDeEstudantes).toPromise().then((response: Response) => {
          contaRegistroInserido += tamanhoBloco;
          this.feedbackUsuario = `Inserindo ${contaRegistroInserido} de ${arrayComEstudantes.length} registros, aguarde...`;
          if (contaRegistroInserido >= arrayComEstudantes.length) {
            resolve({ message: "Alunos enturmados com sucesso" });
          }
        }).catch(() => {
          reject({ message: "Erro ao inserir estudantes." });
        })
      }
    })
    return retorno;
  }

  public sincronizarEstudantes(): void {
    this.feedbackUsuario = 'Listando Estudante...';
    this.sedfService.listarEstudantesImportacao(this.tokenIntegracao, this.inep).toPromise().then((response: Response) => {
      this.feedbackUsuario = 'Iniciando carga, aguarde...';
      this.arrayOfEstudantesEscola = Object.values(response);
      this.inserirEstudantesEmBlocos(Utils.eliminaValoresRepetidos(this.arrayOfEstudantesEscola, 'idpes'), this.esc_id).then(() => {
        this.enturmarEstudantesEmBlocos(this.arrayOfEstudantesEscola).then(() => {
          this.feedbackUsuario = undefined;
        }).catch((erro: Response) => {
          this.gravarErroMostrarMensagem(erro);
        })
      }).catch((erro: Response) => {
        this.gravarErroMostrarMensagem(erro);
      })
    }).catch((erro: Response) => {
      this.gravarErroMostrarMensagem(erro);
    })
  }

  public gravarNotasFaltasTurmasImportacaoIEducar(turmas: Object[]): Promise<Object> {
    this.notasFaltasEstudantes = [];
    this.disciplinas = [];
    let notasFaltasTurma: Array<Object>;
    const retorno = new Promise((resolve, reject) => {
      this.feedbackUsuario = "Iniciando carga de dados bimestrais, aguarde...";
      let contaRegistroInserido = 0;
      for (let i = 0; i < turmas.length; i += 1) {
        const trm_id: number = turmas[i]['id'];
        this.sedfService.listarNotasImportacao(this.tokenIntegracao, trm_id).toPromise().then((response: Response) => {
          if (response != null && response != undefined) {
            notasFaltasTurma = <Object[]>Object.values(response);
            this.notasFaltasEstudantes.push(...notasFaltasTurma);
          }
          contaRegistroInserido += 1;
          if (contaRegistroInserido >= turmas.length) {
            this.disciplinas.push(...Utils.eliminaValoresRepetidos(notasFaltasTurma, 'disciplina'));
            this.inserirDisciplinas(this.disciplinas).then(() => {
              resolve({ message: "Notas inseridas com sucesso" });
              console.log(this.notasFaltasEstudantes);
            })
          }
        }).catch(() => {
          reject({ message: "Erro ao inserir notas." });
        })
      }
    })
    return retorno;
  }

  public inserirNotasFaltas(notasFaltas: Object[]): Promise<Object> {
    const retorno = new Promise((resolve, reject) => {
      this.feedbackUsuario = "Iniciando carga de notas, aguarde...";
      const tamanhoBloco = 250;
      let contaRegistroInserido = 0;
      for (let i = 0; i < notasFaltas.length; i += tamanhoBloco) {
        let blocoDeNotasFaltasEstudantes = notasFaltas.slice(i, i + tamanhoBloco);


        /* this.estudanteService.integracaoInserir(blocoDeNotasFaltasEstudantes, this.esc_id).toPromise().then((response: Response) => {
          contaRegistroInserido += tamanhoBloco;
          this.feedbackUsuario = `Inserindo ${contaRegistroInserido} de ${notasFaltas.length} registros, aguarde...`;
          if (contaRegistroInserido >= notasFaltas.length) {
            resolve({ message: "Notas inseridas com sucesso." });
          }
        }).catch(() => {
          reject({ message: "Erro ao inserir estudantes." });
        }) */


      }
    })
    return retorno;
  }

  public inserirDisciplinas(disciplinas: Object[]): Promise<Object> {
    const retorno = new Promise((resolve, reject) => {
      let contaRegistroInserido = 0;
      for (let i = 0; i < disciplinas.length; i++) {
        let disciplina = new Disciplina();
        disciplina.id = disciplinas[i]['cod_disciplina'];
        disciplina.nome = disciplinas[i]['disciplina'];
        disciplina.abreviatura = Utils.abreviarNomeDisciplina(disciplina.nome);
        disciplina.arc_id = 1;
        this.feedbackUsuario = 'Atualizando disciplinas, aguarde...';
        this.disciplinaService.integracaoInserir(disciplina).toPromise().then(() => {
          contaRegistroInserido++;
          if (contaRegistroInserido >= disciplinas.length) {
            resolve({ message: "Disciplinas inseridas com sucesso." });
          }
        }).catch(() => {
          reject({ message: "Erro ao inserir Disciplinas." });
        })
      }
    })
    return retorno;
  }





  public sincronizarNotasFaltas(): void {
    this.feedbackUsuario = 'Listando turmas para carga de notas, aguarde...';
    this.turmaService.listarTodasAno(this.ano_atual, this.esc_id).toPromise().then((response: Response) => {
      const turmas = Object.values(response);
      this.gravarNotasFaltasTurmasImportacaoIEducar(turmas).then(() => {
        this.feedbackUsuario = undefined;
      })
    }).catch((erro: Response) => {
      this.gravarErroMostrarMensagem(erro);
    });
  }

  public gravarErroMostrarMensagem(erro: Response) {
    //Mostra modal
    this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
    //registra log de erro no firebase usando serviço singlenton
    this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
    //Caso token seja invalido, reenvia rota para login
    Utils.tratarErro({ router: this.router, response: erro });
    this.feedbackUsuario = undefined;
  }

  public sincronizarTurmas(): void {
    this.feedbackUsuario = 'Listando Turmas...';
    this.sedfService.listarTurmasImportacao(this.tokenIntegracao, this.inep).toPromise().then((response: Response) => {
      this.arrayOfTurmasEscola = Object.values(response);
      const etapas: EtapaEnsino[] = <EtapaEnsino[]>Utils.eliminaValoresRepetidos(this.arrayOfTurmasEscola, 'nm_curso');
      const series: Serie[] = <Serie[]>Utils.eliminaValoresRepetidos(this.arrayOfTurmasEscola, 'nm_serie');
      const turmas: Turma[] = <Turma[]>this.arrayOfTurmasEscola;
      const turnos: Turno[] = <Turno[]>Utils.eliminaValoresRepetidos(this.arrayOfTurmasEscola, 'nm_turno');
      this.feedbackUsuario = 'Atualizando turnos...';
      this.turnoService.integracaoInserir(turnos, this.esc_id).toPromise().then(() => {
        this.feedbackUsuario = 'Atualizando Cursos...';
        this.etapaEnsinoService.integracaoInserir(etapas).toPromise().then((response: Response) => {
          this.feedbackUsuario = 'Atualizando Séries...';
          this.serieService.integracaoInserir(series).toPromise().then((response: Response) => {
            this.feedbackUsuario = 'Atualizando Turmas...';
            this.turmaService.integracaoInserir(turmas, this.esc_id, this.ano_atual).toPromise().then((response: Response) => {
              this.feedbackUsuario = undefined;
            }).catch((erro: Response) => {
              this.gravarErroMostrarMensagem(erro);
            })
          }).catch((erro: Response) => {
            this.gravarErroMostrarMensagem(erro);
          })
        }).catch((erro: Response) => {
          this.gravarErroMostrarMensagem(erro);
        })
      }).catch((erro: Response) => {
        this.gravarErroMostrarMensagem(erro);
      })
    }).catch((erro: Response) => {
      this.gravarErroMostrarMensagem(erro);
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
