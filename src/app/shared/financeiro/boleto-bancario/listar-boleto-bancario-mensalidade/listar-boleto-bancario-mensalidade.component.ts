import { Component, OnInit } from '@angular/core';
import { BoletoBancarioService } from '../boleto-bancario.service';
import { EscolaService } from '../../../../crud/escola/escola.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../constantes.shared';
import { AlertModalService } from '../../../../shared-module/alert-modal.service';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../firebase/firebase.service';
import { Utils } from '../../../utils.shared';
import { BoletoBancario } from '../boleto-bancario.model';
import { Cobranca } from '../cobranca.model';

@Component({
  selector: 'ngx-listar-boleto-bancario-mensalidade',
  templateUrl: './listar-boleto-bancario-mensalidade.component.html',
  styleUrls: ['./listar-boleto-bancario-mensalidade.component.scss'],
  providers: [BoletoBancarioService, EscolaService],
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
export class ListarBoletoBancarioMensalidadeComponent implements OnInit {
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public dados_escola: Object;
  public esc_id: number;
  public meses = new Array<Object>();
  public mesesComBoleto = new Array<Object>();

  public diaPadraoVencimento: number;
  public valorMensalidade: number;
  public descontoAssiduidade: number;
  public valorJurosDiario: number;

  constructor(
    private boletoBancarioService: BoletoBancarioService,
    private alertModalService: AlertModalService,
    private escolaService: EscolaService,
    private router: Router,
    private firebaseService: FirebaseService,
  ) { }

  ngOnInit() {
    this.dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados_escola"), CONSTANTES.PASSO_CRIPT))[0];
    this.esc_id = this.dados_escola["id"];
    this.listarBoletosExistententes();
    this.listarDadosBoletoPagamentoEscola();
  }

  public listarDadosBoletoPagamentoEscola(): void {
    this.escolaService.listarDadosBoletoPagamento(this.esc_id).toPromise().then((response: Response) => {
      this.diaPadraoVencimento = Object.values(response)[0]["dia_vencimento"];
      this.valorMensalidade = Object.values(response)[0]["valor_mensalidade"];
      this.descontoAssiduidade = Object.values(response)[0]["desconto_assiduidade"];
      this.valorJurosDiario = Object.values(response)[0]["valor_juros_diario"];
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
    })
  }


  public gerarListaMeses(): void {
    this.meses.push({ boleto: BoletoBancario, mes: "Janeiro", numero: 1, temBoleto: false, ativo: true });
    this.meses.push({ boleto: BoletoBancario, mes: "Fevereiro", numero: 2, temBoleto: false, ativo: true });
    this.meses.push({ boleto: BoletoBancario, mes: "Março", numero: 3, temBoleto: false, ativo: true });
    this.meses.push({ boleto: BoletoBancario, mes: "Abril", numero: 4, temBoleto: false, ativo: true });
    this.meses.push({ boleto: BoletoBancario, mes: "Maio", numero: 5, temBoleto: false, ativo: true });
    this.meses.push({ boleto: BoletoBancario, mes: "Junho", numero: 6, temBoleto: false, ativo: true });
    this.meses.push({ boleto: BoletoBancario, mes: "Julho", numero: 7, temBoleto: false, ativo: true });
    this.meses.push({ boleto: BoletoBancario, mes: "Agosto", numero: 8, temBoleto: false, ativo: true });
    this.meses.push({ boleto: BoletoBancario, mes: "Setembro", numero: 9, temBoleto: false, ativo: true });
    this.meses.push({ boleto: BoletoBancario, mes: "Outubro", numero: 10, temBoleto: false, ativo: true });
    this.meses.push({ boleto: BoletoBancario, mes: "Novembro", numero: 11, temBoleto: false, ativo: true });
    this.meses.push({ boleto: BoletoBancario, mes: "Dezembro", numero: 12, temBoleto: false, ativo: true });
  }

  public listarBoletosExistententes(): void {
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.boletoBancarioService
      .listarBoletoAnoEscolaId(new Date().getFullYear(), this.esc_id)
      .toPromise()
      .then((response: Response) => {
        this.meses = [];
        this.mesesComBoleto = Object.values(response);
        this.gerarListaMeses();
        this.atualizarLista();
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
      });
  }

  public atualizarLista(): void {
    this.meses.forEach(mes => {
      this.mesesComBoleto.forEach(mesComBoleto => {
        if (mes["numero"] == mesComBoleto["mes"]) {
          mes["temBoleto"] = true;
          mes["boleto"] = mesComBoleto
        }
        if (parseInt(mes["numero"]) < parseInt((new Date().getMonth() + 1).toString())) {
          mes["ativo"] = false;
        }
      })
    })
    this.meses.forEach(mes => {
      if (parseInt(mes["numero"]) < parseInt((new Date().getMonth() + 1).toString())) {
        mes["ativo"] = false;
      }
    })
  }

  public gerarBoleto(mes: Object): void {
    /*O valor e a data de vencimento deve estar aqui.*/
    this.gerarBoletoBancario(`${this.diaPadraoVencimento}/${mes["numero"]}/${(new Date().getFullYear()).toString()}`, this.valorMensalidade);
  }

  public gerarBoletoBancario(dataVencimento: string, valor: number): void {
    let cobranca = new Cobranca();
    cobranca.amount = valor;
    cobranca.description =
      "Mensalidade do sistema de gestão pedagógica 'NaEscola'";
    cobranca.dueDate = dataVencimento;
    cobranca.maxOverdueDays = CONSTANTES.BOLETO_FACIL_LIMITE_DIAS_PAGAMENTO;
    cobranca.notifyPayer = true;
    cobranca.payerCpfCnpj = this.dados_escola["cnpj"];
    cobranca.payerEmail = this.dados_escola["email"];
    cobranca.payerName = this.dados_escola["nome"];
    cobranca.token = CONSTANTES.BOLETO_FACIL_TOKEN;
    cobranca.discountAmount = (this.descontoAssiduidade / 100) * valor;
    cobranca.discountDays = 0;
    this.feedbackUsuario = "Gerando boleto bancário, aguarde...";
    this.boletoBancarioService
      .gerarBoletoBancario(cobranca)
      .toPromise()
      .then((response: Response) => {
        let boleto_bancario = new BoletoBancario();
        let boleto = response;
        let dados_boleto = boleto["data"]["charges"][0];
        boleto_bancario.bankAccount =
          dados_boleto["billetDetails"]["bankAccount"];
        boleto_bancario.barcodeNumber =
          dados_boleto["billetDetails"]["barcodeNumber"];
        boleto_bancario.checkoutUrl = dados_boleto["checkoutUrl"];
        boleto_bancario.code = dados_boleto["code"];
        boleto_bancario.dueDate = Utils.formatarDataPadraoAmericano(
          dados_boleto["dueDate"]
        );
        boleto_bancario.installmentLink = dados_boleto["installmentLink"];
        boleto_bancario.link = dados_boleto["link"];
        boleto_bancario.ourNumber = dados_boleto["billetDetails"]["ourNumber"];
        boleto_bancario.payNumber = dados_boleto["payNumber"];
        boleto_bancario.portfolio = dados_boleto["billetDetails"]["portfolio"];
        boleto_bancario.reference = dados_boleto["reference"];

        this.feedbackUsuario = "Salvando dados do boleto, aguarde...";
        this.boletoBancarioService
          .salvarBoletoBancario(boleto_bancario, this.esc_id)
          .toPromise()
          .then((response: Response) => {
            this.feedbackUsuario = undefined;
            this.listarBoletosExistententes();
          })
          .catch((erro: Response) => {
            this.feedbackUsuario = undefined;
            //Mostra modal
            this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
            //registra log de erro no firebase usando serviço singlenton
            this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
            //Caso token seja invalido, reenvia rota para login
            Utils.tratarErro({ router: this.router, response: erro });
          });
      })
      .catch((erro: Response) => {
        this.feedbackUsuario = undefined;
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
      });
  }

}
