import { Component, OnInit } from '@angular/core';


import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import { UsuarioService } from '../../usuario/usuario.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-gerar-qrcode-aplicativo-administrativo',
  templateUrl: './gerar-qrcode-aplicativo-administrativo.component.html',
  styleUrls: ['./gerar-qrcode-aplicativo-administrativo.component.scss'],
  providers: [UsuarioService],
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
export class GerarQrcodeAplicativoAdministrativoComponent implements OnInit {

  public feedbackUsuario: string = undefined;
  public estado: string = 'visivel';
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public turmas = new Array<Object>();
  public estudantes = new Array<Object>();
  public arrayOfUsuarios = new Array<Object>();
  public esc_id: number;
  public inep: string;
  public nomeEscola: string;
  public anoAtual: number;
  public dados_escola: Object;
  public turmaSelecionada: number;

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private usuarioService: UsuarioService,
    private alertModalService: AlertModalService,
  ) { }

  ngOnInit() {
    this.carregarIdEscola();
    this.anoAtual = (new Date()).getFullYear();
    this.listarUsuarios();
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
    this.nomeEscola = this.dados_escola['nome'];
  }

  public concederPermissoes(): void {
    this.feedbackUsuario = 'Concedendo permissões para tirar fotos, aguarde...';
    setTimeout(() => {
      this.firebaseService.gravarUsuariosAutorizadosTirarFotos(this.arrayOfUsuarios, this.inep).then(() => {
        this.feedbackUsuario = undefined;
      });
    }, 1000);
  }

  public revogarPermissoes(): void {
    this.feedbackUsuario = 'Revogando permissões para tirar fotos, aguarde...';
    setTimeout(() => {
      this.firebaseService.revogarUsuariosTirarFotos(this.arrayOfUsuarios, this.inep).then(() => {
        this.feedbackUsuario = undefined;
      });
    }, 1000);
  }

  public concederPermissaoIndividual(usr_id: string): void {
    this.feedbackUsuario = 'Concedendo permissões para tirar fotos, aguarde...';
    this.firebaseService.concederUsuarioIndividual(this.inep, usr_id).then(() => {
      this.feedbackUsuario = undefined;
    });
  }

  public revogarPermissaoIndividual(usr_id: string): void {
    this.feedbackUsuario = 'Revogando permissões para tirar fotos, aguarde...';
    this.firebaseService.revogarUsuarioIndividual(this.inep, usr_id).then(() => {
      this.feedbackUsuario = undefined;
    });
  }

  public listarUsuarios(): void {
    this.feedbackUsuario = 'Listando usuários da escola, aguarde...';
    this.usuarioService.listarPorEscola(this.esc_id, true).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.arrayOfUsuarios = Object.values(response);
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

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public gerenciarAplicativo(): void {
    this.router.navigate(['gerenciar-aplicativo']);
  }

  public gerarQRCodeDocumentoPDF(): void {
    this.feedbackUsuario = `Criando acessos administrativos, aguarde..`;
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
        const distanciaVertical = 10;
        const distanciHorizontal = 0;
        const alturaCartao = ((alturaPagina / 4) - distanciaVertical);
        const larguraCartao = ((larguraPagina / 2) - distanciHorizontal);
        let yPos = 0;
        let xPos = -1;
        const margem = 0;
        let contaCartao = 0;
        const quantidadeDocumentosPorPagina = 10;

        this.arrayOfUsuarios.forEach(elem => {
          html2canvas(document.querySelector(`#qrcode_${elem['usr_id']}`), { useCORS: true }).then(canvas => {
            this.feedbackUsuario = `Criando cartão do(a) usuário ${elem['usuario']}`;
            if (contaCartao % 2 == 0 && contaCartao > 0) {
              yPos += (alturaPagina / (quantidadeDocumentosPorPagina / 2));
            }
            if (contaCartao % quantidadeDocumentosPorPagina == 0 && contaCartao > 0) {
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
            doc.addImage(imgData, 'JPEG', xPos, yPos, larguraCartao, alturaCartao, elem['usr_id']);

            contaCartao += 1;
            if (contaCartao == this.arrayOfUsuarios.length) {
              this.feedbackUsuario = undefined;
              doc.save(`QRCodeAdministrativoPDF.pdf`);
              resolve('ok');
            }
          });
        });
      });
    }, 2000);
  }


}
