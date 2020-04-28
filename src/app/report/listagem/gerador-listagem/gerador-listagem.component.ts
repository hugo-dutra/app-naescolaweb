import { AlertModalService } from './../../../shared-module/alert-modal.service';
import { Component, OnInit } from '@angular/core';
import { ListagemService } from '../listagem.service';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Utils } from '../../../shared/utils.shared';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-gerador-listagem',
  templateUrl: './gerador-listagem.component.html',
  styleUrls: ['./gerador-listagem.component.scss'],
  providers: [ListagemService]
})
export class GeradorListagemComponent implements OnInit {
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;

  public arrayDeCamposETabela = new Array<Object>();
  public arrayDeTabelas = new Array<Object>();
  public arrayDeCamposSelecionados = new Array<Object>();
  public arrayDeOrdenamento = new Array<object>();
  public dados_escola = new Object();
  public esc_id: number;

  constructor(
    private listagemService: ListagemService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router) { }

  ngOnInit() {
    this.carregarDados();
  }

  public carregarDados(): void {
    const dados_escola = localStorage.getItem('dados_escola');
    this.dados_escola = JSON.parse(Utils.decriptAtoB(dados_escola, CONSTANTES.PASSO_CRIPT))[0];
    this.esc_id = parseInt(this.dados_escola['id']);
  }

  public selecionarTabelas(event: Event): void {
    const nomeTabela = (<HTMLInputElement>event.target).value;
    const statusCheck = (<HTMLInputElement>event.target).checked;
    if (statusCheck) {
      this.arrayDeTabelas.push(nomeTabela);
    } else {
      this.arrayDeTabelas = this.arrayDeTabelas.filter(valor => {
        return valor != nomeTabela;
      })
      this.arrayDeCamposSelecionados = this.arrayDeCamposSelecionados.filter((valor) => {
        return valor['tabela'] != nomeTabela;
      });
    }
    this.selcionarCamposTabelas(nomeTabela, statusCheck);
  }

  public selcionarCamposTabelas(tabela: string, statusCheck): void {
    this.feedbackUsuario = 'Atualizando campos, aguarde...';
    if (statusCheck) {
      this.listagemService.listarCamposTabela(tabela).toPromise().then((response: Response) => {
        const arrayAuxiliar = Object.values(response).map((valor) => {
          const valorLabel = (<string>valor['Field']).substr(0, (<string>valor['Field']).length - 4);
          const labelTabela = (tabela).substr(0, tabela.length - 4);

          return { tabela: tabela, campo: valor['Field'], label: valorLabel, labelTabela: labelTabela }
        });
        this.arrayDeCamposETabela.push(...arrayAuxiliar);
        this.arrayDeCamposETabela = Utils.eliminaValoresRepetidos(this.arrayDeCamposETabela, 'campo').sort((a, b) => {
          if (a['campo'] > b['campo']) {
            return 1;
          } else {
            return -1;
          }
        });
        this.feedbackUsuario = undefined;
      }).catch((erro: Response) => {
        this.tratarErro(erro);
      });
    } else {
      this.arrayDeCamposETabela = this.arrayDeCamposETabela.filter((valor) => {
        return valor['tabela'] != tabela;
      }).sort((a, b) => {
        if (a['campo'] > b['campo']) {
          return 1;
        } else {
          return -1;
        }
      });
      this.feedbackUsuario = undefined;
    }
  }

  public selecionarCampo(event: Event): void {
    const statusCheck = (<HTMLInputElement>event.target).checked;
    const campo = (<HTMLInputElement>event.target).value;
    const tabela = (<HTMLInputElement>event.target).name;
    if (statusCheck) {
      this.arrayDeCamposSelecionados.push({ tabela: tabela, campo: campo });
      document.getElementById(`dropdown_${campo}`).removeAttribute('hidden');
    } else {
      this.arrayDeCamposSelecionados = this.arrayDeCamposSelecionados.filter((valor) => {
        return valor['campo'] != campo;
      });
      document.getElementById(`dropdown_${campo}`).setAttribute('hidden', 'true');
      this.arrayDeOrdenamento = this.arrayDeOrdenamento.filter((valor) => {
        return valor['campo'] != campo;
      })
    }
  }

  public selecionarAscDesc(event: Event, campoSelecionado: string): void {
    console.clear();
    const ascDesc = (<HTMLInputElement>event.target).value;
    const campo = campoSelecionado;
    this.arrayDeOrdenamento = this.arrayDeOrdenamento.filter((valor) => {
      return valor['campo'] != campo;
    })
    this.arrayDeOrdenamento.push({ campo: campo, ordem: ascDesc });
    this.arrayDeOrdenamento = this.arrayDeOrdenamento.filter((valor) => {
      return valor['ordem'] != 'null';
    })
    console.table(this.arrayDeOrdenamento);
  }

  public gerarListagem(): void {
    let stringDeCampos = '';
    let stringDeOrdenamento = '';
    this.arrayDeCamposSelecionados.forEach((valor) => {
      stringDeCampos += valor['campo'] + ', '
    });

    this.arrayDeOrdenamento.forEach((valor) => {
      stringDeOrdenamento += `${valor['campo']} ${valor['ordem']}, `;
    })
    const lengthStringDeOrdenamento = stringDeOrdenamento.length;
    const listaDeOrdenamento = stringDeOrdenamento.substring(0, lengthStringDeOrdenamento - 2);

    const lengthStringDeCampos = stringDeCampos.length;
    const listaDeCampos = stringDeCampos.substr(0, lengthStringDeCampos - 2);

    this.feedbackUsuario = 'Listando dados, aguarde...';
    this.listagemService.listarDadosCamposSelecionados(listaDeCampos, this.esc_id, listaDeOrdenamento).toPromise().then((response: Response) => {
      const dadosDaLista = Object.values(response);
      Utils.gerarLista(dadosDaLista, 'Listagem');
      this.feedbackUsuario = undefined;
    });
  }

  public tratarErro(erro: Response): void {
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
