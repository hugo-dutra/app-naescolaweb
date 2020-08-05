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
import { DisciplinaService } from '../../../crud/disciplina/disciplina.service';
import { DiarioRegistroService } from '../../../crud/diario-registro/diario-registro.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ProfessorService } from '../../../crud/professor/professor.service';
import { ProfessorEscolaService } from '../../../crud/professor-escola/professor-escola.service';
import { ProfessorDisciplinaService } from '../../../crud/professor-disciplina/professor-disciplina.service';
import { ProfessorTurmaService } from '../../../crud/professor-turma/professor-turma.service';


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
    DisciplinaService,
    DiarioRegistroService,
    ProfessorService,
    ProfessorEscolaService,
    ProfessorDisciplinaService,
    ProfessorTurmaService,
  ],
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
  public listaTurmas: Boolean = false;
  public listaDeTurmas = new Array<Object>();
  public decrescente: boolean = true;


  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public estado: string = 'visivel';

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
    private diarioRegistroService: DiarioRegistroService,
    private professorService: ProfessorService,
    private professorEscolaService: ProfessorEscolaService,
    private professorDisciplinaService: ProfessorDisciplinaService,
    private professorTurmaService: ProfessorTurmaService,
  ) { }

  ngOnInit() {
    this.ano_atual = (new Date()).getFullYear();
    this.carregarDados();
  }

  public carregarDados(): void {
    this.dados_escola = JSON.parse(
      Utils.decriptAtoB(
        localStorage.getItem('dados_escola'),
        CONSTANTES.PASSO_CRIPT,
      ),
    )[0];
    this.esc_id = parseInt(this.dados_escola['id'], 10);
    this.inep = this.dados_escola['inep'];
    this.autenticar();
  }

  public autenticar(): void {
    this.feedbackUsuario = 'Atualizando dados, aguarde...';
    this.sedfService.listarDadosIntegracaoIEducar().toPromise().then((response: string) => {
      const cypher = response['config'];
      const dcypher = Utils.decypher(cypher);
      const auth = JSON.parse(dcypher);
      const matricula = auth['matricula'];
      const password = auth['password'];
      const system = auth['system'];
      // tslint:disable-next-line: no-shadowed-variable
      this.sedfService.pegarTokenIntegracao(matricula, password, system).toPromise().then((response: Response) => {
        const token_intg = response['token'];
        localStorage.setItem('token_intg', token_intg);
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
      this.feedbackUsuario = `Inserindo carga de ${arrayComEstudantes.length} estudantes, aguarde...`;
      const tamanhoBloco = 500;
      let contaRegistroInserido = 0;
      for (let i = 0; i < arrayComEstudantes.length; i += tamanhoBloco) {
        const blocoDeEstudantes = arrayComEstudantes.slice(i, i + tamanhoBloco);
        this.estudanteService.integracaoInserir(blocoDeEstudantes, this.esc_id)
          .toPromise().then((response: Response) => {
            contaRegistroInserido += tamanhoBloco;
            this.feedbackUsuario = `Inserindo ${contaRegistroInserido} de
           ${arrayComEstudantes.length} registros, aguarde...`;
            if (contaRegistroInserido >= arrayComEstudantes.length) {
              resolve({ message: response });
            }
          }).catch((response: Response) => {
            reject({ message: response });
          });
      }
    });
    return retorno;
  }

  public identificarDesativarDesenturmarInativos(estudantesNovos: Object[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.feedbackUsuario = 'Desativando estudantes transferidos, aguarde...';
        this.estudanteService.listar(100000, 0, true, this.esc_id).toPromise().then((response: Response) => {
          const estudantesAntigos = Object.values(response);
          const estudantesDesativados = estudantesAntigos.filter((valor) => {
            return !estudantesNovos.some((valor2) => {
              return valor['id'] == valor2['idpes'];
            });
          });
          const arrayDeEstudanteId = estudantesDesativados.map(valor => {
            return { est_id: valor['id'] };
          })
          this.estudanteService.desabilitarTurmaTransferido(arrayDeEstudanteId, this.esc_id).toPromise().then(() => {
            resolve(null);
          });
          resolve(null);
        });
      } catch (error) {
        reject(error);
      }
    });

  }

  public sincronizarProfessoresDisciplinasTurmas(): void {
    this.feedbackUsuario = 'Listando professores, disciplinas e turmas. Aguarde...';
    this.sedfService.listarProfessoresDisciplinasTurmas(this.tokenIntegracao, this.inep)
      .toPromise().then((response: Response) => {
        const professoresDisciplinasTurmas: Object[] = Object.values(response);
        const arrayDeProfessores: Object[] = Utils
          .eliminaValoresRepetidos(professoresDisciplinasTurmas, 'emp_cd_matricula');
        this.feedbackUsuario = 'Gravando professores, aguarde...';
        this.professorService.integracaoInserir(arrayDeProfessores).toPromise().then(() => {
          const arrayDeDisciplinas = Utils
            .eliminaValoresRepetidos(professoresDisciplinasTurmas, 'cod_disciplina');
          this.feedbackUsuario = 'Atualizando disciplinas, aguarde...';
          this.disciplinaService.integracaoInserir(arrayDeDisciplinas).toPromise().then(() => {
            this.feedbackUsuario = 'Vinculando professores a escola, aguarde...';
            this.professorEscolaService.integracaoInserir(arrayDeProfessores, this.esc_id).toPromise().then(() => {
              this.feedbackUsuario = 'Vinculando professores a disciplinas, aguarde...';
              this.professorDisciplinaService.integracaoInserir(professoresDisciplinasTurmas).toPromise().then(() => {
                this.feedbackUsuario = 'Vinculando professores e turmas, finalizando...';
                const professoresTurmas = new Array<Object>();
                professoresDisciplinasTurmas.forEach(professorDisciplinaturma => {
                  professoresTurmas.push({
                    dsp_id: professorDisciplinaturma['cod_disciplina'],
                    matricula: professorDisciplinaturma['emp_cd_matricula'],
                    trm_id: professorDisciplinaturma['cod_turma'],
                    esc_id: this.esc_id,
                  });
                });
                this.professorTurmaService.integracaoInserir(professoresTurmas).toPromise().then(() => {
                  this.feedbackUsuario = undefined;
                  this.alertModalService.showAlertSuccess('Dados sincronizados com sucesso');
                }).catch((erro: Response) => {
                  this.gravarErroMostrarMensagem(erro);
                });
              }).catch((erro: Response) => {
                this.gravarErroMostrarMensagem(erro);
              });
            }).catch((erro: Response) => {
              this.gravarErroMostrarMensagem(erro);
            });
          }).catch((erro: Response) => {
            this.gravarErroMostrarMensagem(erro);
          });
        }).catch((erro: Response) => {
          this.gravarErroMostrarMensagem(erro);
        });
      }).catch((erro: Response) => {
        this.gravarErroMostrarMensagem(erro);
      });
  }

  public enturmarEstudantesEmBlocos(arrayComEstudantes: Object[]): Promise<Object> {
    const retorno = new Promise((resolve, reject) => {
      this.feedbackUsuario = 'Iniciando enturmação, aguarde...';
      const tamanhoBloco = 500;
      let contaRegistroInserido = 0;
      for (let i = 0; i < arrayComEstudantes.length; i += tamanhoBloco) {
        const blocoDeEstudantes = arrayComEstudantes.slice(i, i + tamanhoBloco);
        this.estudanteService.integracaoEnturmar(blocoDeEstudantes, this.esc_id).toPromise().then((response: Response) => {
          contaRegistroInserido += tamanhoBloco;
          this.feedbackUsuario = `Inserindo ${contaRegistroInserido} de
          ${arrayComEstudantes.length} registros, aguarde...`;
          if (contaRegistroInserido >= arrayComEstudantes.length) {
            resolve({ message: 'Alunos enturmados com sucesso' });
          }
        }).catch((erro: Response) => {
          reject({ message: erro });
        });
      }
    });
    return retorno;
  }

  public sincronizarEstudantes(): void {
    this.feedbackUsuario = 'Listando Estudantes...';
    this.sedfService.listarEstudantesImportacao(this.tokenIntegracao, this.inep)
      .toPromise().then((response: Response) => {
        this.feedbackUsuario = 'Iniciando carga, aguarde...';
        this.arrayOfEstudantesEscola = Utils.removerCaracteresEspeciaisArray(Object.values(response));
        const estudantesSemNomesRepetidos = Utils.eliminaValoresRepetidos(this.arrayOfEstudantesEscola, 'idpes');
        this.identificarDesativarDesenturmarInativos(estudantesSemNomesRepetidos).then(() => {
          this.inserirEstudantesEmBlocos(estudantesSemNomesRepetidos, this.esc_id)
            .then(() => {
              this.feedbackUsuario = undefined;
              this.enturmarEstudantesEmBlocos(estudantesSemNomesRepetidos).then(() => {
                this.feedbackUsuario = undefined;
                this.alertModalService.showAlertSuccess('Estudantes sincronizados com sucesso');
              }).catch((erro: Response) => {
                this.gravarErroMostrarMensagem(erro);
              });
            }).catch((erro: Response) => {
              this.gravarErroMostrarMensagem(erro);
            });
        }).catch((erro: Response) => {
          this.gravarErroMostrarMensagem(erro);
        });
      }).catch((erro: Response) => {
        this.gravarErroMostrarMensagem(erro);
      });


  }

  public gerenciarIntegracao(): void {
    this.listaTurmas = false;
  }

  public marcarTurmaNotasBaixadas(turma: Object): void {
    document.getElementById(turma['id']).removeAttribute('class');
    document.getElementById(turma['id']).setAttribute('disabled', 'true');
    document.getElementById(turma['id']).setAttribute('class', 'btn btn-sm form-control btn-secondary text-white');
  }

  public baixarNotasFaltasTurmaSelecionada(turma: Object): void {
    this.feedbackUsuario = `Baixando notas da turma ${turma['nome']}`;
    this.sedfService.listarNotasImportacao(this.tokenIntegracao, turma['id']/* 325028 */)
      .toPromise().then((response: Response) => {
        if (response != null && response != undefined) {
          const notasFaltas = Object.values(response);
          this.atualizarDisciplinas(notasFaltas).then(() => {
            this.feedbackUsuario = `Importando notas da turma ${turma['nome']}, aguarde...`;
            this.diarioRegistroService.integracaoGravarNotasImportacao(notasFaltas, this.ano_atual)
              .toPromise().then(() => {
                this.marcarTurmaNotasBaixadas(turma);
                this.feedbackUsuario = undefined;
                this.alertModalService.showAlertSuccess('Notas e faltas sincronizadas com sucesso');
              }).catch((erro: Response) => {
                this.gravarErroMostrarMensagem(erro);
              });
          }).catch((erro: Response) => {
            this.gravarErroMostrarMensagem(erro);
          });
        } else {
          this.alertModalService.showAlertWarning('Sem dados para turma informada.');
          this.feedbackUsuario = undefined;
        }
      }).catch((erro: Response) => {
        this.gravarErroMostrarMensagem(erro);
      });
  }

  public sincronizarNotasFaltas(): void {
    this.listaDeTurmas = [];
    this.feedbackUsuario = 'Listando turmas para carga de notas, aguarde...';
    this.turmaService.listarTodasAno(this.ano_atual, this.esc_id).toPromise().then((response: Response) => {
      this.listaDeTurmas = Object.values(response);
      this.feedbackUsuario = undefined;
      this.listaTurmas = true;
    }).catch((erro: Response) => {
      this.gravarErroMostrarMensagem(erro);
    });
  }

  public gravarErroMostrarMensagem(erro: Response) {
    // Mostra modal
    this.feedbackUsuario = undefined;
    this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
    // registra log de erro no firebase usando serviço singlenton
    this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`,
      JSON.stringify(erro));
    // Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
    // Caso token seja invalido, reenvia rota para login
    Utils.tratarErro({ router: this.router, response: erro });

  }

  public filtrarEtapaEnsinoEJA(objeto: Object) {
    return objeto['nm_curso'] != 'Educação de Jovens e Adultos';
  }

  public eliminarTapaEnsinoEJA(turmas: Object[]): Object[] {
    return turmas.filter(this.filtrarEtapaEnsinoEJA);
  }

  public sincronizarTurmas(): void {
    this.feedbackUsuario = 'Listando Turmas...';
    this.sedfService.listarTurmasImportacao(this.tokenIntegracao, this.inep).toPromise().then((response: Response) => {
      this.arrayOfTurmasEscola = Object.values(response);
      const etapas: EtapaEnsino[] = <EtapaEnsino[]>Utils.eliminaValoresRepetidos(this.arrayOfTurmasEscola, 'nm_curso');
      const series: Serie[] = <Serie[]>Utils.eliminaValoresRepetidos(this.arrayOfTurmasEscola, 'nm_serie');
      const turmas: Turma[] = <Turma[]>this.eliminarTapaEnsinoEJA(this.arrayOfTurmasEscola);
      const turnos: Turno[] = <Turno[]>Utils.eliminaValoresRepetidos(this.arrayOfTurmasEscola, 'nm_turno');
      this.feedbackUsuario = 'Atualizando turnos...';
      this.turnoService.integracaoInserir(turnos, this.esc_id).toPromise().then(() => {
        this.feedbackUsuario = 'Atualizando Cursos...';
        this.etapaEnsinoService.integracaoInserir(etapas).toPromise().then(() => {
          this.feedbackUsuario = 'Atualizando Séries...';
          this.serieService.integracaoInserir(series).toPromise().then(() => {
            this.feedbackUsuario = 'Atualizando Turmas...';
            this.turmaService.integracaoInserir(turmas, this.esc_id, this.ano_atual)
              .toPromise().then(() => {
                this.feedbackUsuario = undefined;
                this.alertModalService.showAlertSuccess('Turmas sincronizadas com sucesso');
              }).catch((erro: Response) => {
                this.gravarErroMostrarMensagem(erro);
              });
          }).catch((erro: Response) => {
            this.gravarErroMostrarMensagem(erro);
          });
        }).catch((erro: Response) => {
          this.gravarErroMostrarMensagem(erro);
        });
      }).catch((erro: Response) => {
        this.gravarErroMostrarMensagem(erro);
      });
    }).catch((erro: Response) => {
      this.gravarErroMostrarMensagem(erro);
    });
  }

  public sincronizarProfessores(): void {
    alert('Professores serão sincronizados por aqui');
  }

  public sincronizarGradeHoraria(): void {
    alert('Grade horária será sincronizada por aqui');
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public ordenarColuna(campo: string): void {
    if (!this.decrescente) {
      const retorno = this.listaDeTurmas.sort(function (a, b) {
        if (a[campo] < b[campo]) {
          return 1;
        }
        if (a[campo] > b[campo]) {
          return -1;
        }
        return 0;
      });
      this.listaDeTurmas = retorno;
    } else {
      const retorno = this.listaDeTurmas.sort(function (a, b) {
        if (a[campo] > b[campo]) {
          return 1;
        }
        if (a[campo] < b[campo]) {
          return -1;
        }
        return 0;
      });
      this.listaDeTurmas = retorno;
    }
    this.decrescente = !this.decrescente;
  }

  public inserirDisciplinas(disciplinas: Object[]): Promise<Object> {
    const retorno = new Promise((resolve, reject) => {
      this.feedbackUsuario = 'Atualizando disciplinas, aguarde...';
      this.disciplinaService.integracaoInserir(disciplinas).toPromise().then(() => {
        resolve({ message: 'Disciplinas inseridas com sucesso.' });
      }).catch(() => {
        reject({ message: 'Erro ao inserir Disciplinas.' });
      });

    });
    return retorno;
  }

  public atualizarDisciplinas(notasFaltas: Object[]): Promise<Object> {
    const disciplinasSemRepeticao = new Array<Object>();
    const retorno = new Promise((resolve, reject) => {
      if (notasFaltas != null && notasFaltas != undefined) {
        disciplinasSemRepeticao.push(...Utils.eliminaValoresRepetidos(notasFaltas, 'cod_disciplina'));
        this.feedbackUsuario = 'Atualizando disciplinas, aguarde...';
        this.inserirDisciplinas(disciplinasSemRepeticao).then(() => {
          this.feedbackUsuario = undefined;
          resolve('ok');
        });
      }


    });
    return retorno;
  }
}
