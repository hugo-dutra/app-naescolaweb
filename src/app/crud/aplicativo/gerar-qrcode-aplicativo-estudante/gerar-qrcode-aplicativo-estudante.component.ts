import { Component, OnInit } from '@angular/core';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import { TurmaService } from '../../turma/turma.service';
import { EstudanteService } from '../../estudante/estudante.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-gerar-qrcode-aplicativo-estudante',
  templateUrl: './gerar-qrcode-aplicativo-estudante.component.html',
  styleUrls: ['./gerar-qrcode-aplicativo-estudante.component.scss'],
  providers: [TurmaService, EstudanteService],
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
export class GerarQrcodeAplicativoEstudanteComponent implements OnInit {

  public feedbackUsuario: string = undefined;
  public estado: string = 'visivel';
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public turmas = new Array<Object>();
  public estudantes = new Array<Object>();
  public arrayOfEstudantes = new Array<Object>();
  public esc_id: number;
  public inep: string;
  public anoAtual: number;
  public dados_escola: Object;
  public stringTurmaSelecionada: string = 'Selecione uma turma';
  public turmaSelecionada: number;

  constructor(
    private turmaService: TurmaService,
    private firebaseService: FirebaseService,
    private router: Router,
    private alertModalService: AlertModalService,
    private estudanteService: EstudanteService,
  ) { }

  ngOnInit() {
    this.carregarIdEscola();
    this.anoAtual = (new Date()).getFullYear();
    this.listarTurmas();
  }

  public carregarIdEscola(): void {
    this.dados_escola = JSON.parse(
      Utils.decriptAtoB(
        localStorage.getItem('dados_escola'),
        CONSTANTES.PASSO_CRIPT,
      ),
    )[0];
    this.esc_id = parseInt(this.dados_escola['id'], 10);
    this.inep = this.dados_escola['inep'];
  }

  public selecionarTurma(event: Event) {
    this.stringTurmaSelecionada = 'Selecione uma turma';
    this.turmaSelecionada = parseInt((<HTMLInputElement>event.target).id, 10);
    this.stringTurmaSelecionada = (<HTMLInputElement>event.target).name;
    this.listarEstudantesQRCode();
  }

  public listarTurmas(): void {
    this.feedbackUsuario = 'Carregando estudantes, aguarde...';
    this.turmaService.listarTodasAno(this.anoAtual, this.esc_id)
      .toPromise()
      .then((response: Response) => {
        this.turmas = Object.values(response);
        this.feedbackUsuario = undefined;
      }).catch((erro: Response) => {
        this.tratarErro(erro);
      });
  }

  public listarEstudantesQRCode(): void {
    this.feedbackUsuario = 'Listando estudantes, aguarde...';
    this.arrayOfEstudantes = [];
    this.estudanteService.listarTurmaId(this.turmaSelecionada).toPromise().then((response: Response) => {
      this.arrayOfEstudantes = Object.values(response).map((valor) => {
        return {
          id: valor['id'],
          nome: valor['nome'],
          matricula: valor['matricula'],
          foto: valor['foto'],
          trm_id: valor['trm_id'],
          numero_chamada: valor['numero_chamada'],
          data_nascimento: valor['data_nascimento'],
          qrCodeString: Utils.cypherQRCode(JSON.stringify({
            nome: valor['nome'], est_id: valor['id'], plano: '0', inep: this.inep,
          })).toString(),
        };
      });
      this.feedbackUsuario = undefined;
    }).catch((erro: Response) => {
      this.tratarErro(erro);
    });
  }

  public tratarErro(erro: Response) {
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
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public gerenciarAplicativo(): void {
    this.router.navigate(['gerenciar-aplicativo']);
  }

  public gerarQRCodeDocumentoPDF(): void {
    this.feedbackUsuario = `Criando cartões, aguarde...`;
    setTimeout(() => {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compressPdf: true,
      });
      new Promise(resolve => {
        const alturaPagina = doc.internal.pageSize.height;
        const larguraPagina = doc.internal.pageSize.width;
        const distanciaVertical = 5;
        const distanciHorizontal = 0;
        const quantidadeDePaginas = 5;
        const alturaCartao = ((alturaPagina / quantidadeDePaginas) - distanciaVertical);
        const larguraCartao = ((larguraPagina / 2) - distanciHorizontal);
        let yPos = 0;
        let xPos = -1;
        const margem = 0;
        let contaCartao = 0;

        this.arrayOfEstudantes.forEach(elem => {
          html2canvas(document.querySelector(`#qrcode_${elem['id']}`), { useCORS: true }).then(canvas => {
            this.feedbackUsuario = `Criando cartão do(a) estudante ${elem['nome']}`;

            if (contaCartao % 2 == 0 && contaCartao > 0) {
              yPos += (alturaPagina / quantidadeDePaginas);
            }
            if (contaCartao % (2 * quantidadeDePaginas) == 0 && contaCartao > 0) {
              yPos = 0;
              xPos = -1 + margem;
              doc.addPage('portrait', 'a4');
            }
            if (xPos == 0 + margem) {
              xPos = (larguraPagina / 2) + margem;
            } else {
              xPos = 0 + margem;
            }

            const imgData = canvas.toDataURL('image/jpeg');
            doc.addImage(imgData, 'JPEG', xPos, yPos, larguraCartao, alturaCartao, elem['id']);

            contaCartao += 1;
            if (contaCartao == this.arrayOfEstudantes.length) {
              this.feedbackUsuario = undefined;
              doc.save(`QRCodePDF_${this.turmaSelecionada}.pdf`);
              resolve('ok');
            }
          });
        });
      });
    }, 2000);
  }
}
