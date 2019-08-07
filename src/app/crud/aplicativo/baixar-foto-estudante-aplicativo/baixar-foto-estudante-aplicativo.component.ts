import { Component, OnInit } from '@angular/core';
import { EstudanteService } from '../../estudante/estudante.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-baixar-foto-estudante-aplicativo',
  templateUrl: './baixar-foto-estudante-aplicativo.component.html',
  styleUrls: ['./baixar-foto-estudante-aplicativo.component.scss'],
  providers: [EstudanteService],
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
export class BaixarFotoEstudanteAplicativoComponent implements OnInit {

  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public arrayOfEstudantesAplicativo = new Array<Object>();
  public esc_id: number;
  public inep: string;
  public dados_escola: Object;
  public anoAtual: number;
  public arrayOfEstudantesSemFoto: Array<Object>;
  public sobrescreveFoto: number = 0;

  constructor(
    private estudanteService: EstudanteService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router) { }

  ngOnInit() {
    this.dados_escola = JSON.parse(
      Utils.decriptAtoB(
        localStorage.getItem("dados_escola"),
        CONSTANTES.PASSO_CRIPT
      )
    )[0];
    this.esc_id = parseInt(this.dados_escola["id"]);
    this.inep = this.dados_escola["inep"];
    this.anoAtual = (new Date()).getFullYear();
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public gerenciarAplicativo(): void {
    this.router.navigate(['gerenciar-aplicativo']);
  }

  public listarSincronizarFotosEstudantesFirebase(sobrescrever: number): void {
    this.feedbackUsuario = "Listando fotos obtidas no aplicativo administrativo, aguarde..."
    let contaFoto: number = 0;
    this.firebaseService.lerFotosEstudanteAplicativoAdministrativo(this.inep)
      .then((querySnapshot: firebase.firestore.QuerySnapshot) => {
        let maximo = querySnapshot.docs.length;
        querySnapshot.forEach(documento => {
          this.estudanteService
            .alterarFoto(documento.id, documento.data()['foto'], sobrescrever)
            .toPromise()
            .then((response: Response) => {
              contaFoto++;
              if (contaFoto == maximo) {
                this.feedbackUsuario = undefined;
              } else {
                this.feedbackUsuario = `Alterando foto ${contaFoto} de ${maximo}...\n${documento.data()['nome']}`;
              }
            }).catch((erro: Response) => {
              //registra log de erro no firebase usando serviço singlenton
              this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
            })
        })
      }).catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      })
  }

  public sobrescreverFoto(event: Event): void {
    let valor = (<HTMLInputElement>(event.target)).checked;
    this.sobrescreveFoto = valor == true ? 1 : 0;
  }

  public sincronizarFotos(): void {
    this.listarSincronizarFotosEstudantesFirebase(this.sobrescreveFoto);
  }

}
