import { Component, OnInit } from '@angular/core';
import { TurmaService } from '../../turma/turma.service';
import { DisciplinaService } from '../../disciplina/disciplina.service';
import { DiarioRegistroService } from '../../diario-registro/diario-registro.service';
import { EstudanteService } from '../../estudante/estudante.service';
import { PeriodoLetivoService } from '../../periodo-letivo/periodo-letivo.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as ExcelProper from 'exceljs';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-importar-nota-boletim',
  templateUrl: './importar-nota-boletim.component.html',
  styleUrls: ['./importar-nota-boletim.component.scss'],
  providers: [TurmaService, DisciplinaService, DiarioRegistroService, EstudanteService, PeriodoLetivoService],
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
export class ImportarNotaBoletimComponent implements OnInit {

  public feedbackUsuario: string;
  public estado: string = 'visivel';
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public turmas: Array<Object>;
  public disciplinas: Object[];
  public estudantes: Object[];
  public dados_escola = new Array<Object>();
  public dados_usuario = new Array<Object>();
  public periodosLetivos: Object[];
  public esc_id: number;
  public usr_id: number;
  public stringTurmaSelecionada: string = 'Selecione uma turma';
  public stringPeriodoSelecionado: string = 'Selecione um período';
  public trm_id_selecionada: number = 0;
  public prl_id_selecionado: number = 0;
  public anoAtual: number;

  constructor(
    private turmaService: TurmaService,
    private disciplinaService: DisciplinaService,
    private diarioRegistroService: DiarioRegistroService,
    private periodoLetivoService: PeriodoLetivoService,
    private alertModalService: AlertModalService,
    private router: Router,
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private estudanteService: EstudanteService) { }

  ngOnInit() {
    this.dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
    this.dados_usuario = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT))[0];
    this.esc_id = parseInt(this.dados_escola['id'], 10);
    this.usr_id = parseInt(this.dados_usuario['id'], 10);
    this.anoAtual = (new Date()).getFullYear();
    this.carregarTurmas();
  }

  public gerenciarDiarioProfessor(): void {
    this.router.navigate(['gerenciar-diario-professor']);
  }

  public carregarPeriodoLetivo(): void {
    this.feedbackUsuario = 'Listando períodos letivos';
    this.periodoLetivoService.listarPorAno(this.anoAtual).toPromise().then((response: Response) => {
      this.periodosLetivos = Object.values(response);
      this.feedbackUsuario = undefined;
    });
  }

  public carregarTurmas(): void {
    this.feedbackUsuario = 'Carregando turmas, aguarde...';
    this.turmaService.listarTodasAno(this.anoAtual, this.esc_id).toPromise().then((response: Response) => {
      this.turmas = Object.values(response);
      this.carregarDisciplinas();
    }).catch((erro: Response) => {
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
    });
  }

  public carregarDisciplinas(): void {
    this.feedbackUsuario = 'Carregando disciplinas, aguarde...';
    this.disciplinaService.listar(this.esc_id).toPromise().then((response: Response) => {
      this.disciplinas = Object.values(response);
      this.carregarPeriodoLetivo();
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
    });
  }

  public selecionarTurma(event: Event): void {
    this.feedbackUsuario = 'Carregando estudantes, aguarde...';
    this.trm_id_selecionada = parseInt((<HTMLInputElement>event.target).value);
    //this.stringTurmaSelecionada = (<HTMLInputElement>event.target).name;
    this.estudanteService.listarTurmaId(this.trm_id_selecionada).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.estudantes = Object.values(response);
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
    });
  }

  public selecionarPeriodo(event: Event): void {
    this.prl_id_selecionado = parseInt((<HTMLInputElement>event.target).value);
  }

  public gerarModeloPlanilhaBoletim(): void {
    const modeloPlanilhaImportarNotasBoletim: ExcelProper.Workbook = new Excel.Workbook();
    modeloPlanilhaImportarNotasBoletim.addWorksheet('Notas e Faltas');
    const tipoBlobArquivo: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

    //Extrai abreviatuas da lista de disciplinas
    const abreviturasDisciplinas = new Array<string>();
    abreviturasDisciplinas.push('');
    abreviturasDisciplinas.push('');
    abreviturasDisciplinas.push('N.º');
    Array.from(this.disciplinas).forEach(disciplina => {
      abreviturasDisciplinas.push(disciplina['abreviatura']);
      abreviturasDisciplinas.push('');
    });

    //Alinhamento do titulo da planilha e identificação
    modeloPlanilhaImportarNotasBoletim.worksheets[0].addRow(['MAPA DE FALTAS E NOTAS']);
    modeloPlanilhaImportarNotasBoletim.worksheets[0].mergeCells(1, 2 * this.disciplinas.length + 3, 0, 0);
    modeloPlanilhaImportarNotasBoletim.worksheets[0].getCell(1, 1).alignment = { vertical: 'middle', horizontal: 'center' };

    //Acrescenta disciplina na segunda linha
    const rows = [abreviturasDisciplinas];
    modeloPlanilhaImportarNotasBoletim.worksheets[0].addRows(rows);

    //Acrescenta uma terceira linha para preenchimento de notas e faltas e preenche com valores
    modeloPlanilhaImportarNotasBoletim.worksheets[0].addRow('');
    const rowFaltasNotas: ExcelProper.Row = modeloPlanilhaImportarNotasBoletim.worksheets[0].getRow(3);
    //Determina a colunca de número da chamada do estudante
    for (let i = 0; i < this.disciplinas.length * 2; i++) {
      if (i % 2 == 0) {
        rowFaltasNotas.getCell(i + 4).value = 'Faltas';
      } else {
        rowFaltasNotas.getCell(i + 4).value = 'Notas';
      }
    }

    //Faz um merge com as celulas que contém os nomes abreviados das disciplinas
    for (let i = this.disciplinas.length * 2 + 3; i > 0; i--) {
      const valorCelula = modeloPlanilhaImportarNotasBoletim.worksheets[0].getRow(2).getCell(i).value;
      if (valorCelula != '') {
        modeloPlanilhaImportarNotasBoletim.worksheets[0].mergeCells(2, i, 2, i + 1);
        i--;
      }
    }

    //Centraliza o texto nas celulas das descrições das disciplinas
    for (let i = 0; i < this.disciplinas.length * 2 + 2; i++) {
      modeloPlanilhaImportarNotasBoletim.worksheets[0].getCell(2, i + 1).alignment = { vertical: 'middle', horizontal: 'center' };
    }

    //Centraliza o texto nas celulas das descrições das disciplinas
    for (let i = 0; i < this.disciplinas.length * 2 + 3; i++) {
      if (modeloPlanilhaImportarNotasBoletim.worksheets[0].columns[i] != undefined) {
        modeloPlanilhaImportarNotasBoletim.worksheets[0].columns[i].width = 6;
      }
    }

    //Gerar a relação de matriculas dos alunos na primeira coluna
    let caracteresId = 0;
    this.estudantes.forEach(estudante => {
      if ((<string>estudante['id']).length > caracteresId) {
        caracteresId = (<string>estudante['id']).length;
      }
      modeloPlanilhaImportarNotasBoletim.worksheets[0].addRow(
        [
          estudante['id'].toString().toUpperCase(),
          estudante['nome'].toString().toUpperCase(),
          estudante['numero_chamada'].toString().toUpperCase(),
        ]);
    });
    modeloPlanilhaImportarNotasBoletim.worksheets[0].columns[0].width = caracteresId + 7;

    //Gerar a relação dos alunos na segunda
    let caracteres = 0;
    this.estudantes.forEach(estudante => {
      if ((<string>estudante['nome']).length > caracteres) {
        caracteres = (<string>estudante['nome']).length;
      }
    });
    modeloPlanilhaImportarNotasBoletim.worksheets[0].columns[1].width = caracteres + 5;

    //Ajusta o nome do arquivo
    const identificadorArquivoTurma = this.stringTurmaSelecionada.replace('-', '_');

    //Constrói a borda da planilha e os preenchimentos
    for (let i = 0; i < this.estudantes.length + 4; i++) {
      if (i > 3) {
        if (i % 2 == 0) {
          for (let j = 0; j < this.disciplinas.length * 2 + 3; j++) {
            modeloPlanilhaImportarNotasBoletim.worksheets[0].getRow(i).getCell(j + 1).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFDDDDDD' },
              bgColor: { argb: 'FFDDDDDD' },
            };
            modeloPlanilhaImportarNotasBoletim.worksheets[0].getRow(i).getCell(j + 1).border = {
              top: { style: 'thin', color: { argb: 'FFBBBBBB' } },
              left: { style: 'thin', color: { argb: 'FFBBBBBB' } },
              bottom: { style: 'thin', color: { argb: 'FFBBBBBB' } },
              right: { style: 'thin', color: { argb: 'FFBBBBBB' } },
            };
          }
        }
      }
    }

    //Preenche os espaços vazios com traços.
    for (let i = 0; i < this.estudantes.length + 4; i++) {
      if (i > 3) {
        for (let j = 0; j < this.disciplinas.length * 2 + 3; j++) {
          if (j > 2) {
            modeloPlanilhaImportarNotasBoletim.worksheets[0].getRow(i).getCell(j + 1).value = '-';
          }
        }
      }
    }

    //Gerar o arquivo e dispara o download
    modeloPlanilhaImportarNotasBoletim.xlsx.writeBuffer().then((data: Blob) => {
      const blob = new Blob([data], { type: tipoBlobArquivo });
      FileSaver.saveAs(blob, `${identificadorArquivoTurma}_${Math.random().toString(36).substr(2, 9).toUpperCase()}.xlsx`);
    });

  }

  public enviarArquivo(event: any): void {
    const listaDeArquivos: FileList = (<HTMLInputElement>event.target).files;
    const arquivo: File = listaDeArquivos[0];
    const resultadosEstudantes = new Array<any>();
    const arrayOfDisciplinas = new Array<string>();
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      const arrayBuffer: any = fileReader.result;
      const data = new Uint8Array(arrayBuffer);
      const arr = new Array();
      for (let i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);

      const bstr = arr.join('');
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const first_sheet_name = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[first_sheet_name];
      const jsonWorkSheet = XLSX.utils.sheet_to_json(worksheet, { raw: true });

      jsonWorkSheet.forEach((linha) => {
        //Grava array de disciplinas
        if (jsonWorkSheet.indexOf(linha) == 0) {
          Object.values(linha).forEach(disciplina => {
            if (disciplina != '') {
              arrayOfDisciplinas.push(disciplina);
            }
          });
        }

        //Grava array com objetos contendo id, nome, disciplina, faltas e notas dos alunos
        if (jsonWorkSheet.indexOf(linha) > 1) {
          //Grava resultados de faltas e notas do aluno corrente
          const arrayOfResultadosNotasFaltas = new Array<any>();
          Object.values(linha).forEach(resultadoNotaFalta => {
            arrayOfResultadosNotasFaltas.push(resultadoNotaFalta);
          });
          const resultadosEstudanteOrganizado = new Array<any>();
          let id: number;
          //let nome: string;
          let disciplinaAtual: string;
          let faltaAtual: any;
          let notaAtual: any;
          let idxDisciplinaAtual: number = 0;
          let idxResultadoEstudante: number = 0;
          arrayOfResultadosNotasFaltas.forEach(resultadoEstudante => {
            //Pega o ID único do estudante
            if (idxResultadoEstudante == 0) {
              id = parseFloat(resultadoEstudante);
            }
            //Pega os valores de faltas e notas do estudante
            if (idxResultadoEstudante > 1) {
              //Pega quantidade de faltas e a disciplina atual
              if (idxResultadoEstudante % 2 == 0) {
                disciplinaAtual = arrayOfDisciplinas[idxDisciplinaAtual + 1];
                faltaAtual = arrayOfResultadosNotasFaltas[idxResultadoEstudante + 1];
                idxDisciplinaAtual++;
              } else {
                //Pega resultado da nota e cria o objeto com os dados da disciplina
                notaAtual = arrayOfResultadosNotasFaltas[idxResultadoEstudante + 1];
                resultadosEstudanteOrganizado.push({ id: id, /*nome: nome,*/ disciplina: disciplinaAtual, faltas: faltaAtual, nota: notaAtual });
              }
            }
            idxResultadoEstudante++;
          });
          resultadosEstudantes.push(resultadosEstudanteOrganizado);
        }
      });
      this.feedbackUsuario = 'Gravando notas no sistema, aguarde...';
      this.diarioRegistroService.gravarNotasImportacaoPlanilha(this.prl_id_selecionado, resultadosEstudantes, this.anoAtual).toPromise().then((response: Response) => {
        this.feedbackUsuario = undefined;
      });
    };
    fileReader.readAsArrayBuffer(arquivo);
  }

}
