import { Component, OnInit } from '@angular/core';
import { PedidoCartaoService } from '../pedido-cartao.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';

import * as Excel from "exceljs/dist/exceljs.min.js";
import * as ExcelProper from "exceljs";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'ngx-detalhar-pedido-cartao-entidade',
  templateUrl: './detalhar-pedido-cartao-entidade.component.html',
  styleUrls: ['./detalhar-pedido-cartao-entidade.component.scss'],
  providers: [PedidoCartaoService],
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
export class DetalharPedidoCartaoEntidadeComponent implements OnInit {

  public pec_id: number;
  public arrayOfDetalhesPedido = new Array<Object>();
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public dados_planilha: Object = null;
  public path_planilha_pedidos: string = "";
  public arquivo_planilha_pedidos: string = "";
  public caminho_arquivo_pedidos: string = "";
  public rotaOrigem = ""
  constructor(
    private route: ActivatedRoute,
    private pedidoCartaoService: PedidoCartaoService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((pec_id: any) => {
      this.pec_id = JSON.parse(pec_id["pec_id"]);
      this.rotaOrigem = JSON.parse(pec_id["rota_origem"]);
    });
    this.detalharPedido();
  }

  public detalharPedido(): void {
    this.feedbackUsuario = "Carregando detalhes, aguarde...";
    this.pedidoCartaoService
      .detalharPecId(this.pec_id)
      .toPromise()
      .then((response: Response) => {
        this.arrayOfDetalhesPedido = Object.values(response);
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
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

  public listarPedidoCartaoEntidade(): void {
    if (this.rotaOrigem == "") {
      this.router.navigate([`${this.route.parent.routeConfig.path}/listar-pedido-cartao-entidade`]);
    } else {
      this.router.navigate([`${this.route.parent.routeConfig.path}/${this.rotaOrigem}`]);
    }
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public gerarPlanilhaEntidade(pedidos: Object[]): void {
    this.feedbackUsuario = "Gerando planilha, aguarde...";

    let modeloPlanilhaImportareEstudantes: ExcelProper.Workbook = new Excel.Workbook();
    modeloPlanilhaImportareEstudantes.addWorksheet("Relação de estudantes");
    const tipoBlobArquivo: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const nomeArquivoImportacao: string = 'Arquivo de importação';

    modeloPlanilhaImportareEstudantes.worksheets[0].addRow(["DADOS PARA CONFECÃO DE CARTÕES"]);
    modeloPlanilhaImportareEstudantes.worksheets[0].mergeCells(1, 8, 0, 0);
    modeloPlanilhaImportareEstudantes.worksheets[0].getCell(1, 1).alignment = { vertical: 'middle', horizontal: 'center' };

    //Monta a estrutura para adicionar estudantes as turmas da escola para o ano atual
    const dadosDoPedido = ['Validade', 'Escola', 'Municipio', 'UF', 'Etapa', 'Série', 'Turno', 'Matrícula', 'Nome', 'Nascimento', 'Turma', 'Modelo', 'Foto', 'Pendência']
    modeloPlanilhaImportareEstudantes.worksheets[0].addRows([dadosDoPedido]);

    pedidos.forEach(pedido => {
      const dadosPreenchimento = [
        pedido['validade'], pedido['escola'], pedido['municipio'],
        pedido['UF'], pedido['etapa'], pedido['serie'],
        pedido['turno'], pedido['matricula'], pedido['nome'],
        pedido['nascimento'], pedido['turma'], pedido['modelo'],
        pedido['foto'], pedido['pendencia']
      ]
      modeloPlanilhaImportareEstudantes.worksheets[0].addRows([dadosPreenchimento]);
    })

    //Preenchimento do background da planilha para facilitar a utilização feita pelo usuário
    for (let i = 0; i < pedidos.length + 4; i++) {
      if (i % 2 == 0) {
        for (let j = 0; j < 13; j++) {
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
    modeloPlanilhaImportareEstudantes.worksheets[0].columns[0].width = 12;
    modeloPlanilhaImportareEstudantes.worksheets[0].columns[1].width = 50;
    modeloPlanilhaImportareEstudantes.worksheets[0].columns[2].width = 12;
    modeloPlanilhaImportareEstudantes.worksheets[0].columns[3].width = 6;
    modeloPlanilhaImportareEstudantes.worksheets[0].columns[4].width = 30;
    modeloPlanilhaImportareEstudantes.worksheets[0].columns[5].width = 6;
    modeloPlanilhaImportareEstudantes.worksheets[0].columns[6].width = 10;
    modeloPlanilhaImportareEstudantes.worksheets[0].columns[7].width = 10;
    modeloPlanilhaImportareEstudantes.worksheets[0].columns[8].width = 50;
    modeloPlanilhaImportareEstudantes.worksheets[0].columns[9].width = 15;
    modeloPlanilhaImportareEstudantes.worksheets[0].columns[10].width = 15;
    modeloPlanilhaImportareEstudantes.worksheets[0].columns[11].width = 15;
    modeloPlanilhaImportareEstudantes.worksheets[0].columns[12].width = 300;
    modeloPlanilhaImportareEstudantes.worksheets[0].columns[13].width = 12;
    //Gerar o arquivo e dispara o download
    modeloPlanilhaImportareEstudantes.xlsx.writeBuffer().then((data: Blob) => {
      const blob = new Blob([data], { type: tipoBlobArquivo });
      FileSaver.saveAs(blob, `${nomeArquivoImportacao}_${Math.random().toString(36).substr(2, 9).toUpperCase()}.xlsx`);
    });
    this.feedbackUsuario = undefined;
  }
}
