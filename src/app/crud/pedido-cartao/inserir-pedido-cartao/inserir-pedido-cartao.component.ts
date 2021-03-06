import { Component, OnInit } from '@angular/core';
import { PedidoCartaoService } from '../pedido-cartao.service';
import { TurmaService } from '../../turma/turma.service';
import { EstudanteService } from '../../estudante/estudante.service';
import { BoletoBancarioService } from '../../../shared/financeiro/boleto-bancario/boleto-bancario.service';
import { EscolaService } from '../../escola/escola.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Turma } from '../../turma/turma.model';
import { Estudante } from '../../estudante/estudante.model';
import { ModeloCartao } from '../modelo-cartao.model';
import { ItemPedido } from '../item-pedido.model';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';
import { Cobranca } from '../../../shared/financeiro/boleto-bancario/cobranca.model';
import { BoletoBancario } from '../../../shared/financeiro/boleto-bancario/boleto-bancario.model';
import { EstudantePedido } from '../estudante-pedido.model';
import { PedidoCartao } from '../pedido-cartao.model';

@Component({
  selector: 'ngx-inserir-pedido-cartao',
  templateUrl: './inserir-pedido-cartao.component.html',
  styleUrls: ['./inserir-pedido-cartao.component.scss'],
  providers: [
    PedidoCartaoService,
    TurmaService,
    EstudanteService,
    BoletoBancarioService,
    EscolaService,
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
export class InserirPedidoCartaoComponent implements OnInit {
  public turmas = new Array<Turma>();
  public estudantes = new Array<Estudante>();
  public modelosCartao = new Array<ModeloCartao>();
  public arrayOfItensPedido = new Array<ItemPedido>();
  public totalPedido: number;
  public dados_escola: Object;

  public feedbackUsuario: string;
  public estado: string = 'visivel';
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public est_id: string;
  public esc_id: number;

  public diaPadraoVencimento: number;
  public valorMensalidade: number;
  public descontoAssiduidade: number;
  public valorJurosDiario: number;

  constructor(
    private pedidoCartaoService: PedidoCartaoService,
    private turmaService: TurmaService,
    private estudanteService: EstudanteService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private boletoBancarioService: BoletoBancarioService,
    private router: Router,
    private route: ActivatedRoute,
    private escolaService: EscolaService,
  ) { }

  ngOnInit() {
    this.dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
    this.esc_id = this.dados_escola['id'];
    this.listarModelosCartao();
  }

  public listarDadosBoletoPagamentoEscola(): void {
    this.feedbackUsuario = 'Finalizando carga...';
    this.escolaService.listarDadosBoletoPagamento(this.esc_id).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.diaPadraoVencimento = Object.values(response)[0]['dia_vencimento'];
      this.valorMensalidade = Object.values(response)[0]['valor_mensalidade'];
      this.descontoAssiduidade = Object.values(response)[0]['desconto_assiduidade'];
      this.valorJurosDiario = Object.values(response)[0]['valor_juros_diario'];
    }).catch((erro: Response) => {
      // Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      // registra log de erro no firebase usando servi??o singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`,
        JSON.stringify(erro));
      // Gravar erros no analytics
      Utils.gravarErroAnalytics(JSON.stringify(erro));
      // Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
    });
  }

  public gerarBoletoBancario(dataVencimento: string, valor: number, pec_id: number): void {
    alert('Boleto banc??rio de pedido de cart??o est?? desativado');
    /* const cobranca = new Cobranca();
    cobranca.amount = valor;
    cobranca.description =
      'Pagamento referente a solicita????o de cart??es de acesso do sistema de gest??o \'NaEscola\'';
    cobranca.dueDate = dataVencimento;
    cobranca.maxOverdueDays = CONSTANTES.BOLETO_FACIL_LIMITE_DIAS_PAGAMENTO_PEDIDO_CARTAO;
    cobranca.notifyPayer = true;
    cobranca.payerCpfCnpj = this.dados_escola['cnpj'];
    cobranca.payerEmail = this.dados_escola['email'];
    cobranca.payerName = this.dados_escola['nome'];
    cobranca.token = CONSTANTES.BOLETO_FACIL_TOKEN;
    cobranca.discountAmount = this.descontoAssiduidade * valor;
    cobranca.discountDays = 0;
    this.feedbackUsuario = 'Gerando boleto banc??rio, aguarde...';
    this.boletoBancarioService
      .gerarBoletoBancario(cobranca)
      .toPromise()
      .then((response: Response) => {
        const boleto_bancario = new BoletoBancario();
        const boleto = response;
        const dados_boleto = boleto['data']['charges'][0];

        boleto_bancario.bankAccount =
          dados_boleto['billetDetails']['bankAccount'];
        boleto_bancario.barcodeNumber =
          dados_boleto['billetDetails']['barcodeNumber'];
        boleto_bancario.checkoutUrl = dados_boleto['checkoutUrl'];
        boleto_bancario.code = dados_boleto['code'];
        boleto_bancario.dueDate = Utils.formatarDataPadraoAmericano(
          dados_boleto['dueDate'],
        );
        boleto_bancario.installmentLink = dados_boleto['installmentLink'];
        boleto_bancario.link = dados_boleto['link'];
        boleto_bancario.ourNumber = dados_boleto['billetDetails']['ourNumber'];
        boleto_bancario.payNumber = dados_boleto['payNumber'];
        boleto_bancario.portfolio = dados_boleto['billetDetails']['portfolio'];
        boleto_bancario.reference = dados_boleto['reference'];

        this.feedbackUsuario = 'Salvando dados do boleto, aguarde...';
        this.boletoBancarioService
          .salvarBoletoBancarioPedidoCartao(boleto_bancario, pec_id)
          .toPromise()
          .then(() => {
            this.feedbackUsuario = undefined;
          })
          .catch((erro: Response) => {
            this.tratarErro(erro);
          });
      })
      .catch((erro: Response) => {
        this.tratarErro(erro);
      }); */
  }

  public calcularTodalPedido(): void {
    this.totalPedido = 0;
    for (let i = 0; i < this.arrayOfItensPedido.length; i++) {
      this.totalPedido += parseFloat(
        this.arrayOfItensPedido[i].Modelo.valor.toString(),
      );
    }
  }

  public selecionarEstudantesTurma(event: Event) {
    this.feedbackUsuario = 'Carregando dados, aguarde...';
    const trm_id = parseInt((<HTMLInputElement>event.target).value, 10);
    this.estudanteService
      .listarTurmaId(trm_id)
      .toPromise()
      .then((response: Response) => {
        this.estudantes = Object.values(response);
        this.limparModeloTodosCartoes();
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        this.tratarErro(erro);
      });
  }

  public limparModeloTodosCartoes(): void {
    Array.from(document.getElementsByName('modelos-cartao-todos')).forEach(
      element => {
        element.getElementsByTagName('option')[0].selected = true;
      },
    );
  }

  public adicionarEstudante(event: Event): void {
    const itemPedido = new ItemPedido();
    const modelo = new ModeloCartao();
    const estudante = new EstudantePedido();

    modelo.id = parseInt((<HTMLInputElement>event.target).value.toString().split('|')[0], 10);
    modelo.nome = (<HTMLInputElement>event.target).value
      .toString()
      .split('|')[1];
    modelo.valor = parseFloat(
      (<HTMLInputElement>event.target).value.toString().split('|')[2],
    );

    estudante.id = parseInt(
      (<HTMLInputElement>event.target).value.toString().split('|')[3], 10);
    estudante.nome = (<HTMLInputElement>event.target).value
      .toString()
      .split('|')[4];

    itemPedido.Modelo = modelo;
    itemPedido.Estudante = estudante;

    if (this.validarNovoEstudante(itemPedido)) {
      this.arrayOfItensPedido.push(itemPedido);
    }
  }

  public adicionarTodos(event: Event): void {
    for (let i = 0; i < this.estudantes.length; i++) {
      const estudante = new EstudantePedido();
      const modelo = new ModeloCartao();
      const itemPedido = new ItemPedido();

      modelo.id = parseInt((<HTMLInputElement>event.target).value.toString().split('|')[0], 10);
      modelo.nome = (<HTMLInputElement>event.target).value.toString().split('|')[1];
      modelo.valor = parseFloat((<HTMLInputElement>event.target).value.toString().split('|')[2]);

      estudante.id = this.estudantes[i].id;
      estudante.nome = this.estudantes[i].nome;

      itemPedido.Modelo = modelo;
      itemPedido.Estudante = estudante;

      if (this.validarNovoEstudante(itemPedido)) {
        if (this.verificarTemFoto(estudante.id)) {
          this.arrayOfItensPedido.push(itemPedido);
        }
      }
    }
    Array.from(document.getElementsByName('modelos-cartao')).forEach(
      element => {
        const indexSelecionado: number = parseInt(
          (<HTMLInputElement>event.target).value.toString().split('|')[3], 10);
        element.getElementsByTagName('option')[
          indexSelecionado + 1
        ].selected = true;
      },
    );
  }

  public verificarTemFoto(id: number): boolean {
    let retorno = false;
    for (let i = 0; i < this.estudantes.length; i++) {
      if (this.estudantes[i]['id'] == id) {
        if (this.estudantes[i]['foto'] != '' && this.estudantes[i]['foto'] != null &&
          this.estudantes[i]['foto'] != undefined) {
          retorno = true;
          break;
        }
      }
    }
    return retorno;
  }

  public validarNovoEstudante(itemPedido: ItemPedido): boolean {
    const est_id = itemPedido.Estudante.id;
    for (let i = 0; i < this.arrayOfItensPedido.length; i++) {
      const estudante_adicionado = this.arrayOfItensPedido[i].Estudante.id;
      if (estudante_adicionado == est_id) {
        this.arrayOfItensPedido[i].Modelo = itemPedido.Modelo;
        return false;
      }
    }
    return true;
  }

  public listarTurmas(): void {
    this.feedbackUsuario = 'Carregando turmas, aguarde...';
    const esc_id: number = parseInt(
      Utils.decriptAtoB(localStorage.getItem('esc_id'), CONSTANTES.PASSO_CRIPT), 10);
    this.turmaService
      .listarTodasAno(new Date().getFullYear(), esc_id)
      .toPromise()
      .then((response: Response) => {
        this.listarDadosBoletoPagamentoEscola();
        this.turmas = Object.values(response);
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        this.tratarErro(erro);
      });
  }

  public removerItemPedido(event: Event): void {
    const est_id: number = parseInt((<HTMLInputElement>event.target).id, 10);
    let index_array: number;
    for (let i = 0; i < this.arrayOfItensPedido.length; i++) {
      if (est_id == this.arrayOfItensPedido[i].Estudante.id) {
        index_array = i;
      }
    }
    this.arrayOfItensPedido.splice(index_array, 1);
  }

  public listarModelosCartao(): void {
    this.feedbackUsuario = 'Carregando modelos de cart??o, aguarde...';
    this.pedidoCartaoService
      .listarModeloCartao()
      .toPromise()
      .then((response: Response) => {
        this.listarTurmas();
        this.modelosCartao = Object.values(response);
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        this.tratarErro(erro);
      });
  }

  public efetuarPedido(): void {
    this.feedbackUsuario = 'Finalizando pedido, aguarde...';
    const pedidoCartoes = new PedidoCartao();
    pedidoCartoes.esc_id = parseInt(Utils.decriptAtoB(localStorage.getItem('esc_id'), CONSTANTES.PASSO_CRIPT), 10);
    pedidoCartoes.usr_id = parseInt(JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'),
      CONSTANTES.PASSO_CRIPT))[0].id, 10);
    pedidoCartoes.itensPedido = this.arrayOfItensPedido;
    pedidoCartoes.total = this.totalPedido;
    pedidoCartoes.quantidade = this.arrayOfItensPedido.length;
    if (this.arrayOfItensPedido.length > 0) {
      this.pedidoCartaoService
        .inserir(pedidoCartoes)
        .toPromise()
        .then((response: Response) => {
          const day = (new Date().getDate()).toString();
          const month = (new Date().getMonth() + 1).toString();
          const year = (new Date().getFullYear()).toString();
          const last_insert_id = response[0]['last_insert_id'];
          this.gerarBoletoBancario(`${day}/${month}/${year}`, pedidoCartoes.total, last_insert_id);
          this.limparDados();
          this.feedbackUsuario = undefined;
        })
        .catch((erro: Response) => {

        });
    } else {
      this.feedbackUsuario = undefined;
      this.limparDados();
    }
  }

  public limparDados(): void {
    this.estudantes = [];
    this.arrayOfItensPedido = [];
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public listarPedido(): void {
    this.router.navigate([`${this.route.parent.routeConfig.path}/listar-pedido-cartao`]);
  }

  public tratarErro(erro: Response): void {
    // Mostra modal
    this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
    // registra log de erro no firebase usando servi??o singlenton
    this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`,
      JSON.stringify(erro));
    // Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
    // Caso token seja invalido, reenvia rota para login
    Utils.tratarErro({ router: this.router, response: erro });
    this.feedbackUsuario = undefined;
  }

}
