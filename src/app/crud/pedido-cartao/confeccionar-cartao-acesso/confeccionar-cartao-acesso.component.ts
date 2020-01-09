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
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public esc_id: number;
  public usr_id: number;
  public anoAtual: number;
  public turmas: Object[];
  public arrayOfEstudantes: Object[];
  public arrayOfEstudantesCartaoConfeccionado = new Array<CartaoAcessoImpressao>();
  public stringTurmaSelecionada: string = "Selecione uma turma";
  public stringLayoutSelecionado: string = "Selecione um layout";
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
  public urlAssinaguraGestor: string;

  ngOnInit() {
    this.esc_id = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
    this.usr_id = parseInt(JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados"), CONSTANTES.PASSO_CRIPT))[0].id);
    this.linkLogoEscola = JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados_escola"), CONSTANTES.PASSO_CRIPT))[0].logo;
    this.nomeEscola = JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados_escola"), CONSTANTES.PASSO_CRIPT))[0].nome;
    this.linkLogoRedeEnsino = JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados_escola"), CONSTANTES.PASSO_CRIPT))[0].logo_rede_ensino;
    this.nomeRedeEnsino = JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados_escola"), CONSTANTES.PASSO_CRIPT))[0].rede_ensino;
    this.cepEscola = JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados_escola"), CONSTANTES.PASSO_CRIPT))[0].cep;
    this.enderecoEscola = JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados_escola"), CONSTANTES.PASSO_CRIPT))[0].endereco;
    this.telefoneEscola = JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados_escola"), CONSTANTES.PASSO_CRIPT))[0].telefone;
    this.anoAtual = (new Date()).getFullYear();
    this.pegarUrlAssinaguraDiretor();
    this.listarTurmas();
    this.carregarLayouts();
  }

  public pegarUrlAssinaguraDiretor(): void {
    this.escolaService.litarAssinaturaGestor(this.esc_id).toPromise().then((response: Response) => {
      this.urlAssinaguraGestor = Object.values(response)[0]["assinatura_gestor"];
    })
  }

  public carregarLayouts(): void {
    this.layouts = [{ id: 0, name: "Básico-frente" }, { id: 1, name: "Básico-frente e verso" }, { id: 2, name: "Etiqueta" }, { id: 3, name: "PVC-SEDF-FRENTE E VERSO" }]
  }

  public gerenciarPortaria(): void {
    this.router.navigate(["gerenciar-pedido-cartao"]);
  }

  public listarTurmas(): void {
    this.feedbackUsuario = "Listando turmas, aguarde...";
    this.turmaService.listarTodasAno(this.anoAtual, this.esc_id).toPromise().then((response: Response) => {
      this.turmas = Object.values(response);
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

  public selecionarTurma(event: Event): void {
    this.trm_id_selecionada = parseInt((<HTMLInputElement>event.target).id);
    this.stringTurmaSelecionada = (<HTMLInputElement>event.target).name;
    if (this.id_layout_selecionado >= 0) {
      this.listarEstudantesTurmaSelecionada();
    }
  }

  public selecionarLayout(layout: Object): void {
    this.stringLayoutSelecionado = layout["name"];
    this.id_layout_selecionado = layout["id"];
    this.listarEstudantesTurmaSelecionada();
  }

  public listarEstudantesTurmaSelecionada(): void {
    this.feedbackUsuario = "Listando estudantes, aguarde...";
    this.estudanteService.listarTurmaId(this.trm_id_selecionada).toPromise().then((response: Response) => {
      this.arrayOfEstudantes = Object.values(response);
      this.arrayOfEstudantesCartaoConfeccionado = [];

      const serie = this.stringTurmaSelecionada.split('-')[0].replace(/ /g, '');
      const etapa = this.stringTurmaSelecionada.split('-')[1].replace(/ /g, '');
      const turma = this.stringTurmaSelecionada.split('-')[2].replace(/ /g, '');
      const turno = this.stringTurmaSelecionada.split('-')[3].replace(/ /g, '');

      this.arrayOfEstudantes.forEach(elem => {
        let cartaoAcessoImpressao = new CartaoAcessoImpressao();
        cartaoAcessoImpressao.etapa = etapa;
        cartaoAcessoImpressao.foto = elem["foto"];
        cartaoAcessoImpressao.est_id = elem["id"];
        cartaoAcessoImpressao.logoEscola = "";
        cartaoAcessoImpressao.logoRedeEnsino = "";
        cartaoAcessoImpressao.nome = elem["nome"];
        cartaoAcessoImpressao.serie = serie;
        cartaoAcessoImpressao.stringCodigoBarras = Utils.gerarDigitosCodigoDeBarras(cartaoAcessoImpressao.est_id.toString(), this.anoAtual);
        cartaoAcessoImpressao.turma = turma;
        cartaoAcessoImpressao.turno = turno;
        cartaoAcessoImpressao.dataNascimento = elem["data_nascimento"];
        this.arrayOfEstudantesCartaoConfeccionado.push(cartaoAcessoImpressao);
      })

      if (this.arrayOfEstudantesCartaoConfeccionado.length > 0 && this.id_layout_selecionado >= 0) {
        this.feedbackUsuario = "Ajustando layouts, aguarde...";
        setTimeout(() => {
          this.arrayOfEstudantesCartaoConfeccionado.forEach(elem => {
            document.getElementById(`ngx_Barcode_${elem["est_id"]}`).parentElement.appendChild(document.getElementById(`ngx_Barcode_${elem["est_id"]}`).children[0].children[0]);
            document.getElementById(`ngx_Barcode_${elem["est_id"]}`).remove()
          })
          this.feedbackUsuario = undefined;
        }, 2000);
      }

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

  public atualizarEstudanteSelecionado(estudante: Object): void {
    //alert(JSON.stringify(estudante));
  }

  public gerarCarteirinhaBasicoFrenteVersoCanvasEPdf(): void {
    this.feedbackUsuario = `Criando cartões, aguarde..`;
    setTimeout(() => {
      var doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compressPdf: true,
      });
      new Promise(resolve => {
        let alturaPagina = doc.internal.pageSize.height;
        let larguraPagina = doc.internal.pageSize.width;
        let distanciaVertical = 4;
        let distanciHorizontal = 0;
        let alturaCartao = ((alturaPagina / 4) - distanciaVertical)
        let larguraCartao = ((larguraPagina) - distanciHorizontal);
        let yPos = 0;
        let xPos = 0;
        let margem = 2;
        let contaCartao = 0;
        let quantidadeColunas = 1;
        let quantidadeCartoesPorPagina = 4;

        this.arrayOfEstudantesCartaoConfeccionado.forEach(elem => {
          html2canvas(document.querySelector(`#frente_verso${elem["est_id"]}`), { useCORS: true }).then(canvas => {
            this.feedbackUsuario = `Criando cartão do(a) estudante ${elem["nome"]}`;


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

            var imgData = canvas.toDataURL('image/jpeg');
            doc.addImage(imgData, 'JPEG', xPos, yPos, larguraCartao, alturaCartao, elem["est_id"]);

            contaCartao += 1
            if (contaCartao == this.arrayOfEstudantesCartaoConfeccionado.length) {
              this.feedbackUsuario = undefined;
              doc.save(`cartoes.pdf`);
              resolve("ok");
            }

          });

        })
      })
    }, 2000);
  }

  public gerarCarteirinhaEtiquetaCanvasEPdf(): void {
    this.feedbackUsuario = `Criando cartões, aguarde..`;
    setTimeout(() => {
      var doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compressPdf: true,
      });
      new Promise(resolve => {
        let alturaPagina = doc.internal.pageSize.height;
        let larguraPagina = doc.internal.pageSize.width;
        let distanciaVertical = 2;
        let distanciHorizontal = 0;
        let alturaCartao = ((alturaPagina / 8) - distanciaVertical)
        let larguraCartao = ((larguraPagina / 3) - distanciHorizontal);
        let yPos = 0;
        let xPos = 0;
        let margem = 2;
        let contaCartao = 0;
        let quantidadeColunas = 3;
        let quantidadeCartoesPorPagina = 24;

        this.arrayOfEstudantesCartaoConfeccionado.forEach(elem => {
          html2canvas(document.querySelector(`#etiqueta_${elem["est_id"]}`), { useCORS: true }).then(canvas => {
            this.feedbackUsuario = `Criando cartão do(a) estudante ${elem["nome"]}`;

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

            var imgData = canvas.toDataURL('image/jpeg');
            doc.addImage(imgData, 'JPEG', xPos, yPos, larguraCartao, alturaCartao, elem["est_id"]);

            contaCartao += 1
            if (contaCartao == this.arrayOfEstudantesCartaoConfeccionado.length) {
              this.feedbackUsuario = undefined;
              doc.save(`cartoes.pdf`);
              resolve("ok");
            }
          });

        })
      })
    }, 2000);
  }

  public gerarCarteirinhaBasicoFrenteCanvasEPdf(): void {
    this.feedbackUsuario = `Criando cartões, aguarde..`;

    setTimeout(() => {
      var doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compressPdf: true,
      });
      new Promise(resolve => {
        let alturaPagina = doc.internal.pageSize.height;
        let larguraPagina = doc.internal.pageSize.width;
        let distanciaVertical = 10;
        let distanciHorizontal = 0;
        let alturaCartao = ((alturaPagina / 4) - distanciaVertical)
        let larguraCartao = ((larguraPagina / 2) - distanciHorizontal);
        let yPos = 0;
        let xPos = -1;
        let margem = 0;
        let contaCartao = 0;

        this.arrayOfEstudantesCartaoConfeccionado.forEach(elem => {
          html2canvas(document.querySelector(`#cartao_${elem["est_id"]}`), { useCORS: true }).then(canvas => {
            this.feedbackUsuario = `Criando cartão do(a) estudante ${elem["nome"]}`;

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
              xPos = 0 + margem
            }

            var imgData = canvas.toDataURL('image/jpeg');
            doc.addImage(imgData, 'JPEG', xPos, yPos, larguraCartao, alturaCartao, elem["est_id"]);

            contaCartao += 1
            if (contaCartao == this.arrayOfEstudantesCartaoConfeccionado.length) {
              this.feedbackUsuario = undefined;
              doc.save(`cartoes.pdf`);
              resolve("ok");
            }
          });
        })
      })
    }, 2000);
  }

}
