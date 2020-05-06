import { FirebaseService } from './../../../shared/firebase/firebase.service';
import { AlertModalService } from './../../../shared-module/alert-modal.service';
import { EntradaPosteriorService } from './../entrada-posterior.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { PortariaService } from '../../portaria/portaria.service';

@Component({
  selector: 'ngx-listar-entrada-posterior',
  templateUrl: './listar-entrada-posterior.component.html',
  styleUrls: ['./listar-entrada-posterior.component.scss'],
  providers: [EntradaPosteriorService, PortariaService]
})
export class ListarEntradaPosteriorComponent implements OnInit {

  private esc_id: number;
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta = false;

  public arrayEntradasPosteriores = new Array<Object>();
  public arrayCodigosPortarias = new Array<string>();
  public matrizReferencia = new Array<Object>();
  constructor(
    private router: Router,
    private entradaPosteriorService: EntradaPosteriorService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private portariaService: PortariaService
  ) { }

  ngOnInit() {
    this.esc_id = Utils.pegarDadosEscolaDetalhado().id;
    this.listarEntradasPosteriores();

  }

  public listarPortarias(): void {
    this.feedbackUsuario = 'Finalizando, aguarde...';
    this.portariaService.listar(this.esc_id).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.arrayCodigosPortarias = Object.values(response).map((portaria) => {
        return portaria['codigo'];
      });
    }).catch((erro: Response) => {
      this.tratarErro(erro);
    })
  }

  public inserirEntradaPosterior(): void {
    this.router.navigate([`${this.router.url}/inserir-entrada-posterior`])
  }

  public listarEntradasPosteriores(): void {
    this.feedbackUsuario = 'Carregando autorizações de entrada posterior, aguarde...'
    this.entradaPosteriorService.listar(this.esc_id).toPromise().then((response: Response) => {
      this.arrayEntradasPosteriores = Object.values(response);
      this.matrizReferencia = this.arrayEntradasPosteriores;
      this.feedbackUsuario = undefined;
      this.listarPortarias();
    });
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public excluirEntradaPosterior(epe_id: number, est_id: number): void {
    this.feedbackUsuario = 'Excluindo entrada posterior, aguarde...';
    this.entradaPosteriorService.excluir(epe_id).toPromise().then(() => {
      const totalPortarias = this.arrayCodigosPortarias.length;
      let contaTotalPortariasEstudanteExcluido = 0;
      this.arrayCodigosPortarias.forEach((codigoPortaria) => {
        this.firebaseService.excluirEntradaPosteriorFirestore(est_id.toString(), codigoPortaria).then(() => {
          contaTotalPortariasEstudanteExcluido++;
          if (totalPortarias == contaTotalPortariasEstudanteExcluido) {
            this.feedbackUsuario = undefined;
            this.alertModalService.showAlertSuccess('Operação finalizada com sucesso');
            this.listarEntradasPosteriores();
          }
        }).catch((erro: any) => {
          this.tratarErro(erro);
        });
      });
    }).catch((erro: Response) => {
      this.tratarErro(erro);
    });
  }

  public filtrarEstudante(event: Event): void {
    const valorFiltro = (<HTMLInputElement>event.target).value;
    let matrizRetorno = new Array<Object>();
    matrizRetorno = this.arrayEntradasPosteriores.filter((elemento) => {
      return elemento['nome'].toLowerCase().indexOf(valorFiltro.toLocaleLowerCase()) != -1;
    });
    if (valorFiltro.length > 0) {
      this.arrayEntradasPosteriores = matrizRetorno;
    } else {
      this.arrayEntradasPosteriores = this.matrizReferencia;
    }
  }

  public tratarErro(erro: Response): void {
    //Mostra modal
    this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
    //registra log de erro no firebase usando serviço singlenton
    this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
    //Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
    //Caso token seja invalido, reenvia rota para login
    Utils.tratarErro({ router: this.router, response: erro });
    this.feedbackUsuario = undefined;
  }
}
