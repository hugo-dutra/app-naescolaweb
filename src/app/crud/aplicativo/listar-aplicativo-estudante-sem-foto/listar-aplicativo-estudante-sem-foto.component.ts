import { Router } from '@angular/router';
import { FirebaseService } from './../../../shared/firebase/firebase.service';
import { AlertModalService } from './../../../shared-module/alert-modal.service';
import { CONSTANTES } from './../../../shared/constantes.shared';
import { Utils } from './../../../shared/utils.shared';
import { EstudanteService } from './../../estudante/estudante.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-listar-aplicativo-estudante-sem-foto',
  templateUrl: './listar-aplicativo-estudante-sem-foto.component.html',
  styleUrls: ['./listar-aplicativo-estudante-sem-foto.component.scss'],
  providers: [EstudanteService]
})
export class ListarAplicativoEstudanteSemFotoComponent implements OnInit {

  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public arrayEstudantesSemfoto = new Array<Object>();
  public esc_id: number;
  constructor(
    private estudanteService: EstudanteService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router) { }

  ngOnInit() {
    this.esc_id = Utils.pegarDadosEscolaDetalhado().id;
    this.listarEstudantesSemFoto();
  }


  public listarEstudantesSemFoto(): void {
    this.feedbackUsuario = "Listando estudantes sem foto, aguarde...";
    this.estudanteService.listarSemFotoEscolaId(this.esc_id).toPromise().then((response: Response) => {
      this.arrayEstudantesSemfoto = Object.values(response);
      this.feedbackUsuario = undefined;
      console.log(this.arrayEstudantesSemfoto);
    }).catch((erro: Response) => {
      this.mostrarAlertaErro(erro);
    })
  }

  public mostrarAlertaErro(erro: Response): void {
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
