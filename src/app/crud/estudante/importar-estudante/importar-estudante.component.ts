import { Component, OnInit } from '@angular/core';
import { EstudanteService } from '../estudante.service';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TurmaService } from '../../turma/turma.service';
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as ExcelProper from "exceljs";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';
import * as moment from "moment";

@Component({
  selector: 'app-importar-estudante',
  templateUrl: './importar-estudante.component.html',
  styleUrls: ['./importar-estudante.component.scss'],
  providers: [EstudanteService, TurmaService],
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
export class ImportarEstudanteComponent implements OnInit {

  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public est_id: string;
  public link_modelo_planilha: string = CONSTANTES.FIREBASE_MODELO_PLANILHA_IMPORTACAO;
  private arrayOfturmasParaCadastro = new Array<Object>();
  public dados_escola: Object;
  public esc_id: number;
  public anoAtual: number;
  public arrayOfEstudantes = new Array<any>();


  constructor(
    private estudanteService: EstudanteService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private turmaService: TurmaService,
    private router: Router) { }

  ngOnInit() {
    this.carregarDadosEscolares();
  }

  public carregarDadosEscolares(): void {
    this.dados_escola = JSON.parse(
      Utils.decriptAtoB(
        localStorage.getItem("dados_escola"),
        CONSTANTES.PASSO_CRIPT
      )
    )[0];
    this.esc_id = parseInt(this.dados_escola["id"]);
    this.anoAtual = (new Date()).getFullYear();
    this.listarTurmasAnoLetivo();
  }

  public listarTurmasAnoLetivo(): void {
    this.feedbackUsuario = 'Carregando dados das turmas, aguarde...';
    this.turmaService.listarTodasAno(this.anoAtual, this.esc_id).toPromise().then((response: Response) => {
      this.arrayOfturmasParaCadastro = Object.values(response);
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

  public gerarArquivoModeloExcel(): void {
    let modeloPlanilhaImportareEstudantes: ExcelProper.Workbook = new Excel.Workbook();
    modeloPlanilhaImportareEstudantes.addWorksheet("Relação de estudantes");
    const tipoBlobArquivo: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const nomeArquivoImportacao: string = 'Arquivo de importação';
    const QuantidadeEsEstudantesPorTurma: number = 100;

    modeloPlanilhaImportareEstudantes.worksheets[0].addRow(["RELAÇÃO DE ESTUDANTE A SEREM ADICIONADOS AO SISTEMA"]);
    modeloPlanilhaImportareEstudantes.worksheets[0].mergeCells(1, 8, 0, 0);
    modeloPlanilhaImportareEstudantes.worksheets[0].getCell(1, 1).alignment = { vertical: 'middle', horizontal: 'center' };

    //Monta a estrutura para adicionar estudantes as turmas da escola para o ano atual
    this.arrayOfturmasParaCadastro.forEach(turma => {
      const dadosDaTurma = ['Código:', turma['id'], 'Série:', turma['serie_abv'], 'Turma:', turma['nome'], 'Turno:', turma['turno_abv']]
      modeloPlanilhaImportareEstudantes.worksheets[0].addRows([dadosDaTurma]);
      const camposDePreenchimento = ['Número', 'Matrícula', 'Nome', 'Data de nascimento', 'Nome do responsável'];
      modeloPlanilhaImportareEstudantes.worksheets[0].addRows([camposDePreenchimento]);
      for (let i = 0; i < QuantidadeEsEstudantesPorTurma; i++) {
        const preenchimentoPadrao = ['0', '-', '-', '01-01-0001', '-'];
        modeloPlanilhaImportareEstudantes.worksheets[0].addRows([preenchimentoPadrao]);
      }
    })

    //Preenchimento do background da planilha para facilitar a utilização feita pelo usuário
    for (let i = 0; i < (QuantidadeEsEstudantesPorTurma * this.arrayOfturmasParaCadastro.length) + 4; i++) {
      if (i % 2 == 0) {
        for (let j = 0; j < 8; j++) {
          //Formada a entrada de dados para se comportarem como strings.
          modeloPlanilhaImportareEstudantes.worksheets[0].getRow(i).getCell(j + 1).numFmt = '';
          modeloPlanilhaImportareEstudantes.worksheets[0].getRow(i).getCell(j + 1).fill = {
            type: 'pattern',
            pattern: "solid",
            fgColor: { argb: 'FFDDDDDD' },
            bgColor: { argb: 'FFDDDDDD' }
          };
          modeloPlanilhaImportareEstudantes.worksheets[0].getRow(i).getCell(j + 1).border = {
            top: { style: 'thin', color: { argb: 'FFBBBBBB' } },
            left: { style: 'thin', color: { argb: 'FFBBBBBB' } },
            bottom: { style: 'thin', color: { argb: 'FFBBBBBB' } },
            right: { style: 'thin', color: { argb: 'FFBBBBBB' } }
          };
        }
      }
    }

    //Ajusta tamanho das colunas para preenchimento dos dados
    modeloPlanilhaImportareEstudantes.worksheets[0].columns[0].width = 10;
    modeloPlanilhaImportareEstudantes.worksheets[0].columns[1].width = 10;
    modeloPlanilhaImportareEstudantes.worksheets[0].columns[2].width = 18;
    modeloPlanilhaImportareEstudantes.worksheets[0].columns[3].width = 18;
    modeloPlanilhaImportareEstudantes.worksheets[0].columns[4].width = 30;
    modeloPlanilhaImportareEstudantes.worksheets[0].columns[5].width = 4;
    modeloPlanilhaImportareEstudantes.worksheets[0].columns[6].width = 8;
    modeloPlanilhaImportareEstudantes.worksheets[0].columns[7].width = 6;
    //Gerar o arquivo e dispara o download
    modeloPlanilhaImportareEstudantes.xlsx.writeBuffer().then((data: Blob) => {
      const blob = new Blob([data], { type: tipoBlobArquivo });
      FileSaver.saveAs(blob, `${nomeArquivoImportacao}_${Math.random().toString(36).substr(2, 9).toUpperCase()}.xlsx`);
    });
  }

  public inserir(): void {
    this.router.navigate(["inserir-estudante"]);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public enturmarEstudante(): void {
    this.router.navigate(["enturmar-estudante"]);
  }

  public enviarArquivoExcel(event: any): void {
    this.feedbackUsuario = "Carregando dados dos estudantes, aguarde...";
    let listaDeArquivos: FileList = (<HTMLInputElement>event.target).files;
    let arquivo: File = listaDeArquivos[0];
    this.arrayOfEstudantes = [];

    let fileReader = new FileReader();

    fileReader.onload = (e) => {
      let arrayBuffer: any = fileReader.result;
      let data = new Uint8Array(arrayBuffer)
      let arr = new Array();
      for (let i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);

      let bstr = arr.join("");
      let workbook = XLSX.read(bstr, { type: "binary" });
      let first_sheet_name = workbook.SheetNames[0];

      let worksheet = workbook.Sheets[first_sheet_name];
      let jsonWorkSheet = XLSX.utils.sheet_to_json(worksheet, { raw: true });

      let trm_id: number = 0;
      jsonWorkSheet.forEach((linha) => {
        const objetoLinha = Object.values(linha);
        if (objetoLinha[0] == 'Código:') {
          trm_id = objetoLinha[1];
        } else if (objetoLinha[1] == '-' || objetoLinha[2] == '-') {
          //Náo incrementa valores a matriz
        } else if (objetoLinha[0] != 'Código:' && objetoLinha[0] != 'Número') {
          const numero = objetoLinha[0];
          const matricula = objetoLinha[1];
          const nome = objetoLinha[2];
          const dataNascimento = this.ExcelDateToJSDate(<string>objetoLinha[3]);
          const responsavel = objetoLinha[4];
          this.arrayOfEstudantes.push({ trm_id: trm_id, numero: numero, matricula: matricula, nome: nome, dataNascimento: dataNascimento, responsavel: responsavel, esc_id: this.esc_id });
        }
      })
      this.inserirEstudanteImportado();
    }
    fileReader.readAsArrayBuffer(arquivo);
  }

  public ExcelDateToJSDate(serial) {
    var utc_days = Math.floor(serial - 25568);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);
    return `${date_info.getFullYear()}-${date_info.getMonth() + 1}-${date_info.getDate()}`;
  }

  public inserirEstudanteImportado(): void {
    this.feedbackUsuario = "Inserindo estudantes, aguarde...";
    this.estudanteService.inserirViaListagem(this.arrayOfEstudantes).toPromise().then((response: Response) => { })
      .then(() => {
        this.enturmarEstudanteImportado();
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

  public enturmarEstudanteImportado(): void {
    this.feedbackUsuario = "Enturmando novos estudantes, aguarde...";
    this.estudanteService.enturmarViaImportacao(this.arrayOfEstudantes).toPromise().then((response: Response) => {
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


}

