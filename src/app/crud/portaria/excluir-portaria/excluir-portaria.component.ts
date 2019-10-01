import { Component, OnInit } from '@angular/core';
import { PortariaService } from '../portaria.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Portaria } from '../portaria.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-excluir-portaria',
  templateUrl: './excluir-portaria.component.html',
  styleUrls: ['./excluir-portaria.component.scss'],
  providers: [PortariaService, FirebaseService],
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
export class ExcluirPortariaComponent implements OnInit {

  public portaria = new Portaria();
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private portariaService: PortariaService,
    private router: Router,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((objeto) => {
      this.portaria = JSON.parse(objeto["portaria"]);
    })
  }

  private excluirPortariaDadosFirebase(codigoPortaria: string): void {
    this.firebaseService.apagarPortariaFirebaseFirestore(codigoPortaria).then(() => {
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      ;
    })
  }

  public excluir(): void {
    this.feedbackUsuario = "Excluindo portaria, aguarde..."
    this.portariaService.excluir(this.portaria.por_id)
      .toPromise()
      .then(() => {
        this.feedbackUsuario = undefined;
        this.excluirPortariaDadosFirebase(this.portaria.codigo);
        this.listar();
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      })
  }

  public listar(): void {
    this.router.navigate([`${this.route.parent.routeConfig.path}/listar-portaria`]);
  }
}
