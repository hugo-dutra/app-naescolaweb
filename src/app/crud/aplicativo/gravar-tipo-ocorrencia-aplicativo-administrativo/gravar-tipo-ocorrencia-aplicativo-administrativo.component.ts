import { AlertModalService } from './../../../shared-module/alert-modal.service';
import { Router } from '@angular/router';
import { FirebaseService } from './../../../shared/firebase/firebase.service';
import { CONSTANTES } from './../../../shared/constantes.shared';
import { Utils } from './../../../shared/utils.shared';
import { TipoOcorrenciaDisciplinarService } from './../../tipo-ocorrencia-disciplinar/tipo-ocorrencia-disciplinar.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'ngx-gravar-tipo-ocorrencia-aplicativo-administrativo',
  templateUrl: './gravar-tipo-ocorrencia-aplicativo-administrativo.component.html',
  styleUrls: ['./gravar-tipo-ocorrencia-aplicativo-administrativo.component.scss'],
  providers: [TipoOcorrenciaDisciplinarService]
})
export class GravarTipoOcorrenciaAplicativoAdministrativoComponent implements OnInit {

  public feedbackUsuario: string = undefined;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public arrayDeTiposOcorrenciasDisponiveis = new Array<Object>()
  public esc_id: number;
  constructor(private tipoOcorrenciaDisciplinarService: TipoOcorrenciaDisciplinarService,
    private firebaseService: FirebaseService,
    private router: Router,
    private alertModalService: AlertModalService,
  ) { }

  ngOnInit() {
    this.carregarParametros();
    this.listarTiposOcorrenciasDisciplinares();
  }

  public carregarParametros(): void {
    this.esc_id = Utils.pegarDadosEscolaDetalhado().id;
  }

  public listarTiposOcorrenciasDisciplinares(): void {
    this.feedbackUsuario = 'Carregando dados, aguarde...';
    this.tipoOcorrenciaDisciplinarService.listar(5000, 0, true, this.esc_id).toPromise().then((response: Response) => {
      this.arrayDeTiposOcorrenciasDisponiveis = Object.values(response);
      console.log(this.arrayDeTiposOcorrenciasDisponiveis);
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
    });
  }

  public gerenciarAplicativo(): void {
    this.router.navigate(['gerenciar-aplicativo']);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public gravaStatusTipoOcorrencia(event: Event): void {
    alert('aqui..............');
  }

}
