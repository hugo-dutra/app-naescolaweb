import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { TurmaService } from '../../turma/turma.service';
import { EscolaService } from '../../escola/escola.service';
import { EstudanteService } from '../../estudante/estudante.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import { Router } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { CartaoAcessoImpressao } from './confeccionar-cartao-acesso.model';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-confeccionar-cartao-acesso',
  templateUrl: './confeccionar-cartao-acesso.component.html',
  styleUrls: ['./confeccionar-cartao-acesso.component.scss'],
  providers: [FirebaseService, TurmaService, EstudanteService, EscolaService],
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
export class ConfeccionarCartaoAcessoComponent implements OnInit {


  constructor(
    private router: Router,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private turmaService: TurmaService,
    private estudanteService: EstudanteService,
    private escolaService: EscolaService,
  ) { }

  public feedbackUsuario: string;
  public estado: string = 'visivel';
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public esc_id: number;
  public usr_id: number;
  public anoAtual: number;
  public turmas: Object[];
  public arrayOfEstudantes: Object[];
  public arrayOfEstudantesCartaoConfeccionado = new Array<CartaoAcessoImpressao>();
  public stringTurmaSelecionada: string = 'Selecione uma turma';
  public stringLayoutSelecionado: string = 'Selecione um layout';
  public trm_id_selecionada: number;
  public id_layout_selecionado: number;
  public layouts = new Array<object>();
  public linkLogoEscola: string;
  public linkLogoRedeEnsino: string;
  public nomeRedeEnsino: string;
  public nomeEscola: string;
  public enderecoEscola: string;
  public cepEscola: string;
  public telefoneEscola: string;
  public urlAssinaguraGestor: string = '';
  public regiaoEscola: string = '';
  public nomeUsuario: string = '';
  public linkLogoGDF = CONSTANTES.CAMINHO_LOGO_GDF;
  public dataHoraAtual: string = '';

  ngOnInit() {
    this.dataHoraAtual = Utils.now();
    this.nomeUsuario = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'),
      CONSTANTES.PASSO_CRIPT))[0].nome;
    this.regiaoEscola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'),
      CONSTANTES.PASSO_CRIPT))[0].regiao_escola;
    this.esc_id = parseInt(Utils.decriptAtoB(localStorage.getItem('esc_id'), CONSTANTES.PASSO_CRIPT), 10);
    this.usr_id = parseInt(JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'),
      CONSTANTES.PASSO_CRIPT))[0].id, 10);
    this.linkLogoEscola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'),
      CONSTANTES.PASSO_CRIPT))[0].logo;
    this.nomeEscola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'),
      CONSTANTES.PASSO_CRIPT))[0].nome;
    this.linkLogoRedeEnsino = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'),
      CONSTANTES.PASSO_CRIPT))[0].logo_rede_ensino;
    this.nomeRedeEnsino = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'),
      CONSTANTES.PASSO_CRIPT))[0].rede_ensino;
    this.cepEscola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0].cep;
    this.enderecoEscola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'),
      CONSTANTES.PASSO_CRIPT))[0].endereco;
    this.telefoneEscola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'),
      CONSTANTES.PASSO_CRIPT))[0].telefone;
    this.anoAtual = (new Date()).getFullYear();
    this.pegarUrlAssinaguraDiretor();
    this.listarTurmas();
    this.carregarLayouts();
  }

  public pegarUrlAssinaguraDiretor(): void {
    this.escolaService.listarAssinaturaGestor(this.esc_id).toPromise().then((response: Response) => {
      this.urlAssinaguraGestor = Object.values(response)[0]['assinatura_gestor'];
    });
  }

  public carregarLayouts(): void {
    if (CONSTANTES.BUILD_DESTINO == CONSTANTES.BUILD_SEDF) {
      this.layouts = [
        { id: 0, name: 'Básico-frente' },
        { id: 1, name: 'Básico-frente e verso' },
        { id: 2, name: 'Etiqueta' },
        { id: 3, name: 'Pvc-Sedf' },
        { id: 5, name: 'Padrão-Sedf' },
        { id: 6, name: 'Padrão-Resolvidos' },
      ];
    }
    if (CONSTANTES.BUILD_DESTINO == CONSTANTES.BUILS_RESOLVIDOS) {
      this.layouts = [
        { id: 0, name: 'Básico-frente' },
        { id: 1, name: 'Básico-frente e verso' },
        { id: 2, name: 'Etiqueta' },
        { id: 3, name: 'Pvc-Sedf' },
        { id: 4, name: 'Pvc-Resolvidos' },
        { id: 5, name: 'Padrão-Sedf' },
        { id: 6, name: 'Padrão-Resolvidos' },
      ];
    }
  }

  public gerenciarPedidos(): void {
    this.router.navigate(['gerenciar-pedido-cartao']);
  }

  public listarTurmas(): void {
    this.feedbackUsuario = 'Listando turmas, aguarde...';
    this.turmaService.listarTodasAno(this.anoAtual, this.esc_id).toPromise().then((response: Response) => {
      this.turmas = Object.values(response);
      this.feedbackUsuario = undefined;
    }).catch((erro: Response) => {
      this.mostrarErro(erro);
    });
  }

  public selecionarTurma(event: Event): void {
    this.trm_id_selecionada = parseInt((<HTMLInputElement>event.target).id, 10);
    this.stringTurmaSelecionada = (<HTMLInputElement>event.target).name;
    if (this.id_layout_selecionado >= 0) {
      this.listarEstudantesTurmaSelecionada();
    }
  }

  public selecionarLayout(layout: Object): void {
    this.stringLayoutSelecionado = layout['name'];
    this.id_layout_selecionado = layout['id'];
    this.listarEstudantesTurmaSelecionada();
  }

  public listarEstudantesTurmaSelecionada(): void {
    this.feedbackUsuario = 'Listando estudantes, aguarde...';
    this.estudanteService.listarTurmaId(this.trm_id_selecionada).toPromise().then((response: Response) => {
      this.arrayOfEstudantes = Object.values(response);
      this.arrayOfEstudantesCartaoConfeccionado = [];
      const serie = this.stringTurmaSelecionada.split('-')[0].replace(/ /g, ' ');
      const etapa = this.stringTurmaSelecionada.split('-')[1].replace(/ /g, ' ');
      const turma = this.stringTurmaSelecionada.split('-')[2].replace(/ /g, ' ');
      const turno = this.stringTurmaSelecionada.split('-')[3].replace(/ /g, ' ');

      this.arrayOfEstudantes.forEach(elem => {
        const cartaoAcessoImpressao = new CartaoAcessoImpressao();
        cartaoAcessoImpressao.etapa = etapa;
        cartaoAcessoImpressao.foto = elem['foto'];
        cartaoAcessoImpressao.est_id = elem['id'];
        cartaoAcessoImpressao.logoEscola = '';
        cartaoAcessoImpressao.logoRedeEnsino = '';
        cartaoAcessoImpressao.nome = elem['nome'];
        cartaoAcessoImpressao.serie = serie;
        cartaoAcessoImpressao.stringCodigoBarras = Utils.gerarDigitosCodigoDeBarras(
          cartaoAcessoImpressao.est_id.toString(), this.anoAtual);
        cartaoAcessoImpressao.turma = turma;
        cartaoAcessoImpressao.turno = turno;
        cartaoAcessoImpressao.dataNascimento = elem['data_nascimento'];
        this.arrayOfEstudantesCartaoConfeccionado.push(cartaoAcessoImpressao);
      });
      const tamanhoArrayAntes = this.arrayOfEstudantesCartaoConfeccionado.length;
      /* Se layout não for etiqueta, faz o filtro */
      if (this.id_layout_selecionado != 2) {
        this.arrayOfEstudantesCartaoConfeccionado = this.arrayOfEstudantesCartaoConfeccionado.filter((valor) => {
          return valor.foto.length > 0;
        });
      }
      const tamanhoArrayDepois = this.arrayOfEstudantesCartaoConfeccionado.length;

      /* Layout etiqueta */
      if (this.id_layout_selecionado != 2) {
        if (tamanhoArrayAntes != tamanhoArrayDepois) {
          this.alertModalService.showAlertWarning(
            'Alguns estudantes dessa turma não possuem foto. Somente são listados estudantes que possuem foto.');
        }
      }

      if (this.arrayOfEstudantesCartaoConfeccionado.length == 0) {
        this.alertModalService.showAlertWarning(
          'Nenhum estudante dessa turma possui foto. Foto é um requisito para gerar esse documento');
      }

      if (this.arrayOfEstudantesCartaoConfeccionado.length > 0 && this.id_layout_selecionado >= 0) {
        this.feedbackUsuario = 'Ajustando layouts, aguarde...';
        setTimeout(() => {
          this.arrayOfEstudantesCartaoConfeccionado.forEach(elem => {
            document.getElementById(`ngx_Barcode_${elem['est_id']}`).parentElement
              .appendChild(document.getElementById(`ngx_Barcode_${elem['est_id']}`).children[0].children[0]);
            document.getElementById(`ngx_Barcode_${elem['est_id']}`).remove();
          });
          this.feedbackUsuario = undefined;
        }, 2000);
      }
      this.feedbackUsuario = undefined;

    }).catch((erro: Response) => {
      this.mostrarErro(erro);
    });
  }

  public atualizarEstudanteSelecionado(estudante: Object): void {
    // alert(JSON.stringify(estudante));
  }

  public gerarCarteirinhaEtiquetaCanvasEPdf(): void {
    this.feedbackUsuario = `Criando cartões, aguarde..`;
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
        const distanciaVertical = 2;
        const distanciHorizontal = 0;
        const alturaCartao = ((alturaPagina / 8) - distanciaVertical);
        const larguraCartao = ((larguraPagina / 3) - distanciHorizontal);
        let yPos = 0;
        let xPos = 0;
        const margem = 2;
        let contaCartao = 0;
        const quantidadeColunas = 3;
        const quantidadeCartoesPorPagina = 24;

        this.arrayOfEstudantesCartaoConfeccionado.forEach(elem => {
          html2canvas(document.querySelector(`#etiqueta_${elem['est_id']}`), { useCORS: true }).then(canvas => {
            this.feedbackUsuario = `Criando cartão do(a) estudante ${elem['nome']}`;

            if (contaCartao % quantidadeColunas == 0 && contaCartao > 0) {
              yPos += alturaCartao;
              xPos = 0;
            }
            if (contaCartao % quantidadeCartoesPorPagina == 0 && contaCartao > 0) {
              yPos = 0;
              xPos = 0;
              doc.addPage('portrait', 'a4');
            }

            if (xPos >= margem) {
              xPos += larguraCartao + margem;
            } else {
              xPos = 0 + margem;
            }

            const imgData = canvas.toDataURL('image/jpeg');
            doc.addImage(imgData, 'JPEG', xPos, yPos, larguraCartao, alturaCartao, elem['est_id']);

            contaCartao += 1;
            if (contaCartao == this.arrayOfEstudantesCartaoConfeccionado.length) {
              this.feedbackUsuario = undefined;
              doc.save(`cartoes.pdf`);
              resolve('ok');
            }
          });
        });
      });
    }, 2000);
  }

  public gerarCarteirinhaBasicoFrenteCanvasEPdf(): void {
    this.feedbackUsuario = `Criando cartões, aguarde..`;

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

        this.arrayOfEstudantesCartaoConfeccionado.forEach(elem => {
          html2canvas(document.querySelector(`#cartao_${elem['est_id']}`), { useCORS: true }).then(canvas => {
            this.feedbackUsuario = `Criando cartão do(a) estudante ${elem['nome']}`;

            if (contaCartao % 2 == 0 && contaCartao > 0) {
              yPos += (alturaPagina / 4);
            }
            if (contaCartao % 8 == 0 && contaCartao > 0) {
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
            doc.addImage(imgData, 'JPEG', xPos, yPos, larguraCartao, alturaCartao, elem['est_id']);

            contaCartao += 1;
            if (contaCartao == this.arrayOfEstudantesCartaoConfeccionado.length) {
              this.feedbackUsuario = undefined;
              doc.save(`cartoes.pdf`);
              resolve('ok');
            }
          });
        });
      });
    }, 2000);
  }

  public gerarCarteirinhaBasicoFrenteVersoCanvasEPdf(): void {
    this.feedbackUsuario = `Criando cartões, aguarde..`;
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
        const distanciaVertical = 4;
        const distanciHorizontal = 0;
        const alturaCartao = ((alturaPagina / 4) - distanciaVertical);
        const larguraCartao = ((larguraPagina) - distanciHorizontal);
        let yPos = 0;
        let xPos = 0;
        const margem = 2;
        let contaCartao = 0;
        const quantidadeColunas = 1;
        const quantidadeCartoesPorPagina = 4;

        this.arrayOfEstudantesCartaoConfeccionado.forEach(elem => {
          html2canvas(document.querySelector(`#frente_verso${elem['est_id']}`), { useCORS: true }).then(canvas => {
            this.feedbackUsuario = `Criando cartão do(a) estudante ${elem['nome']}`;


            if (contaCartao % quantidadeColunas == 0 && contaCartao > 0) {
              yPos += alturaCartao;
              xPos = 0;
            }
            if (contaCartao % quantidadeCartoesPorPagina == 0 && contaCartao > 0) {
              yPos = 0;
              xPos = 0;
              doc.addPage('portrait', 'a4');
            }

            if (xPos >= margem) {
              xPos += larguraCartao + margem;
            } else {
              xPos = 0 + margem;
            }

            const imgData = canvas.toDataURL('image/jpeg');
            doc.addImage(imgData, 'JPEG', xPos, yPos, larguraCartao, alturaCartao, elem['est_id']);

            contaCartao += 1;
            if (contaCartao == this.arrayOfEstudantesCartaoConfeccionado.length) {
              this.feedbackUsuario = undefined;
              doc.save(`cartoes.pdf`);
              resolve('ok');
            }
          });
        });
      });
    }, 2000);



  }

  public gerarCarteirinhaPadraoSEDFFrenteVersoCanvasEPdf(): void {
    this.feedbackUsuario = `Criando cartões, aguarde..`;
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
        const distanciaVertical = 4;
        const distanciHorizontal = 0;
        const quantidadeCartoesPorPagina = 5;
        const alturaCartao = ((alturaPagina / quantidadeCartoesPorPagina) - distanciaVertical);
        const larguraCartao = ((larguraPagina) - distanciHorizontal);
        let yPos = 0;
        let xPos = 0;
        const margem = 2;
        let contaCartao = 0;
        const quantidadeColunas = 1;

        this.arrayOfEstudantesCartaoConfeccionado.forEach(elem => {
          html2canvas(document.querySelector(`#frente_verso_padrao_sedf${elem['est_id']}`),
            { useCORS: true }).then(canvas => {
              this.feedbackUsuario = `Criando cartão do(a) estudante ${elem['nome']}`;

              if (contaCartao % quantidadeColunas == 0 && contaCartao > 0) {
                yPos += alturaCartao;
                xPos = 0;
              }
              if (contaCartao % quantidadeCartoesPorPagina == 0 && contaCartao > 0) {
                yPos = 0;
                xPos = 0;
                doc.addPage('portrait', 'a4');
              }

              if (xPos >= margem) {
                xPos += larguraCartao + margem;
              } else {
                xPos = 0 + margem;
              }

              const imgData = canvas.toDataURL('image/jpeg');
              doc.addImage(imgData, 'JPEG', xPos, yPos, larguraCartao, alturaCartao, elem['est_id']);

              contaCartao += 1;
              if (contaCartao == this.arrayOfEstudantesCartaoConfeccionado.length) {
                this.feedbackUsuario = undefined;
                doc.save(`cartoes.pdf`);
                resolve('ok');
              }
            });
        });
      });
    }, 2000);
  }

  public gerarCarteirinhaSEDFFrenteVersoPdf(): void {

    this.feedbackUsuario = `Criando cartões, aguarde..`;
    let canvasCartaoFrente = 0;
    let canvasCartaoVerso = 0;

    setTimeout(() => {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [86.0, 54.00],
        compressPdf: true,
      });

      const arrayOfCanvas = new Array<any>();
      this.arrayOfEstudantesCartaoConfeccionado.forEach(elem => {
        html2canvas(document.querySelector(`#frente_sedf_${elem['est_id']}`), { useCORS: true }).then(canvasFrente => {
          arrayOfCanvas.push({ canvas: canvasFrente, est_id: elem['est_id'], face: 'frente', nome: elem['nome'] });
          canvasCartaoFrente++;
          if (canvasCartaoVerso == this.arrayOfEstudantesCartaoConfeccionado.length &&
            canvasCartaoFrente == this.arrayOfEstudantesCartaoConfeccionado.length) {
            this.desenharPDF(arrayOfCanvas, doc);
          }
        });
      });

      this.arrayOfEstudantesCartaoConfeccionado.forEach(elem => {
        html2canvas(document.querySelector(`#verso_sedf_${elem['est_id']}`), { useCORS: true }).then(canvasVerso => {
          arrayOfCanvas.push({ canvas: canvasVerso, est_id: elem['est_id'], face: 'verso', nome: elem['nome'] });
          canvasCartaoVerso++;
          if (canvasCartaoVerso == this.arrayOfEstudantesCartaoConfeccionado.length &&
            canvasCartaoFrente == this.arrayOfEstudantesCartaoConfeccionado.length) {
            this.desenharPDF(arrayOfCanvas, doc);
          }
        });
      });

    }, 2000);
  }

  public gerarCarteirinhaPVCResolvidos(): void {
    this.feedbackUsuario = `Criando cartões, aguarde..`;
    let canvasCartaoFrente = 0;
    let canvasCartaoVerso = 0;

    setTimeout(() => {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [86.0, 54.00],
        compressPdf: true,
      });

      const arrayOfCanvas = new Array<any>();
      this.arrayOfEstudantesCartaoConfeccionado.forEach(elem => {
        html2canvas(document.querySelector(`#frente_resolvidos_${elem['est_id']}`),
          { useCORS: true }).then(canvasFrente => {
            arrayOfCanvas.push({ canvas: canvasFrente, est_id: elem['est_id'], face: 'frente', nome: elem['nome'] });
            canvasCartaoFrente++;
            if (canvasCartaoVerso == this.arrayOfEstudantesCartaoConfeccionado.length &&
              canvasCartaoFrente == this.arrayOfEstudantesCartaoConfeccionado.length) {
              this.desenharPDF(arrayOfCanvas, doc);
            }
          });
      });

      this.arrayOfEstudantesCartaoConfeccionado.forEach(elem => {
        html2canvas(document.querySelector(`#verso_resolvidos_${elem['est_id']}`),
          { useCORS: true }).then(canvasVerso => {
            arrayOfCanvas.push({ canvas: canvasVerso, est_id: elem['est_id'], face: 'verso', nome: elem['nome'] });
            canvasCartaoVerso++;
            if (canvasCartaoVerso == this.arrayOfEstudantesCartaoConfeccionado.length &&
              canvasCartaoFrente == this.arrayOfEstudantesCartaoConfeccionado.length) {
              this.desenharPDF(arrayOfCanvas, doc);
            }
          });
      });

    }, 2000);
  }

  public gerarCarteirinhaPapelResolvidos(): void {
    this.feedbackUsuario = `Criando cartões, aguarde..`;
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
        const distanciaVertical = 4;
        const distanciHorizontal = 0;
        const quantidadeCartoesPorPagina = 5;
        const alturaCartao = ((alturaPagina / quantidadeCartoesPorPagina) - distanciaVertical);
        const larguraCartao = ((larguraPagina) - distanciHorizontal);
        let yPos = 0;
        let xPos = 0;
        const margem = 2;
        let contaCartao = 0;
        const quantidadeColunas = 1;


        this.arrayOfEstudantesCartaoConfeccionado.forEach(elem => {
          html2canvas(document.querySelector(`#frente_verso_papel_resolvidos${elem['est_id']}`),
            { useCORS: true }).then(canvas => {
              this.feedbackUsuario = `Criando cartão do(a) estudante ${elem['nome']}`;

              if (contaCartao % quantidadeColunas == 0 && contaCartao > 0) {
                yPos += alturaCartao;
                xPos = 0;
              }
              if (contaCartao % quantidadeCartoesPorPagina == 0 && contaCartao > 0) {
                yPos = 0;
                xPos = 0;
                doc.addPage('portrait', 'a4');
              }

              if (xPos >= margem) {
                xPos += larguraCartao + margem;
              } else {
                xPos = 0 + margem;
              }

              const imgData = canvas.toDataURL('image/jpeg');
              doc.addImage(imgData, 'JPEG', xPos, yPos, larguraCartao, alturaCartao, elem['est_id']);

              contaCartao += 1;
              if (contaCartao == this.arrayOfEstudantesCartaoConfeccionado.length) {
                this.feedbackUsuario = undefined;
                doc.save(`cartoes.pdf`);
                resolve('ok');
              }
            });
        });
      });
    }, 2000);
  }

  public desenharPDF(arrayOfCanvas: any[], doc: jsPDF): void {
    const alturaPagina = doc.internal.pageSize.height;
    const larguraPagina = doc.internal.pageSize.width;
    const alturaCartao = alturaPagina;
    const larguraCartao = larguraPagina;
    let yPos = 0;
    let xPos = 0;

    const canvasFaceOrdenado = arrayOfCanvas.sort((a, b) => {
      if (a['face'] > b['face']) {
        return 1;
      }
      if (a['face'] < b['face']) {
        return -1;
      }
      return 0;
    });

    const canvasOrdenado = canvasFaceOrdenado.sort((a, b) => {
      if (a['nome'] > b['nome']) {
        return 1;
      }
      if (a['nome'] < b['nome']) {
        return -1;
      }
      return 0;
    });

    canvasOrdenado.forEach(elemento => {
      const canvas = elemento['canvas'];
      const est_id = elemento['est_id'];
      const face = elemento['face'];
      yPos = 0;
      xPos = 0;
      const imgData = canvas.toDataURL('image/jpeg');
      doc.addImage(imgData, 'JPEG', xPos, yPos, larguraCartao, alturaCartao, `#elemento_cartao_${est_id}_${face}`);
      doc.addPage();
    });
    doc.save(`cartoes.pdf`);
    this.feedbackUsuario = undefined;
  }

  public mostrarErro(erro: Response) {
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

}
