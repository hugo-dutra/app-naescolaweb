import { Component, OnInit } from '@angular/core';
import { EstudanteService } from '../../estudante/estudante.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';

@Component({
  selector: 'ngx-sincronizar-estudante-aplicativo',
  templateUrl: './sincronizar-estudante-aplicativo.component.html',
  styleUrls: ['./sincronizar-estudante-aplicativo.component.scss'],
  providers: [EstudanteService, FirebaseService],
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
export class SincronizarEstudanteAplicativoComponent implements OnInit {

  public feedbackUsuario: string = undefined;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public arrayOfEstudantesAplicativo = new Array<Object>();
  public esc_id: number;
  public dados_escola: Object;

  constructor(
    private estudanteService: EstudanteService,
    private firebaseService: FirebaseService,
    private router: Router,
    private alertModalService: AlertModalService
  ) { }

  ngOnInit() {
    this.dados_escola = JSON.parse(
      Utils.decriptAtoB(
        localStorage.getItem("dados_escola"),
        CONSTANTES.PASSO_CRIPT
      )
    )[0];
    this.esc_id = parseInt(this.dados_escola["id"]);
  }

  public sincronizarDadosNoAplicativoAdministrativo(): void {
    this.feedbackUsuario = "Carregando dados para aplicativo adminstrativo, aguarde..."
    this.estudanteService.listarEstudantesAplicativo(this.esc_id).toPromise().then((response: Response) => {
      this.arrayOfEstudantesAplicativo = Object.values(response);
      /* let idxEstudante = 0;
      const quantidadeEstudantes = this.arrayOfEstudantesAplicativo.length; */

      this.firebaseService.gravarListagemEstudantesAplicativoDocumentoUnico(this.arrayOfEstudantesAplicativo).then(() => {
        this.feedbackUsuario = undefined;

        /* this.arrayOfEstudantesAplicativo.forEach(estudante => {
          const etapa = estudante["etapa"];
          const foto = estudante["foto"];
          const inep = estudante["inep"];
          const matricula = estudante["matricula"];
          const nome = estudante["nome"];
          const serie = estudante["serie"];
          const turma = estudante["turma"];
          const turno = estudante["turno"];

          this.firebaseService.gravarEstudanteFirebaseFirestoreAplicativo(inep, matricula, foto, nome, serie, turma, turno, etapa).then(response => {
            this.feedbackUsuario = `Inserindo estudante ${idxEstudante} de um total de ${quantidadeEstudantes}, aguarde...`;
            idxEstudante++;
            if (idxEstudante >= this.arrayOfEstudantesAplicativo.length - 2) {
              this.feedbackUsuario = undefined;
            }
          }).catch((erro: Response) => {
            //Mostra modal
            this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
            //registra log de erro no firebase usando serviço singlenton
            this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
            //Caso token seja invalido, reenvia rota para login
            Utils.tratarErro({ router: this.router, response: erro });
            this.feedbackUsuario = undefined;
          })
        }) */

      }).catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
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

  public gerenciarAplicativo(): void {
    this.router.navigate(['gerenciar-aplicativo']);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }


}
