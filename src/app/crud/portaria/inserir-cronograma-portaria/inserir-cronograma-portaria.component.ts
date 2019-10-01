import { Component, OnInit } from '@angular/core';
import { PortariaService } from '../portaria.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { CronogramaPortaria } from '../cronograma-portaria.model';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-inserir-cronograma-portaria',
  templateUrl: './inserir-cronograma-portaria.component.html',
  styleUrls: ['./inserir-cronograma-portaria.component.scss'],
  providers: [PortariaService, FirebaseService],
  animations: [
    trigger(
      "chamado",
      [
        state(
          "visivel",
          style(
            { opacity: 1 }
          )
        ),
        transition("void => visivel", [
          style({ opacity: 0 }),
          animate(CONSTANTES.ANIMATION_DELAY_TIME + "ms ease-in-out")
        ])
      ]
    )
  ]
})
export class InserirCronogramaPortariaComponent implements OnInit {

  public cronogramasPortaria = new Array<CronogramaPortaria>();
  public cronogramaPortaria = new CronogramaPortaria();
  public nomePortaria: string;
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public exibirComponenteExcluir: Boolean = false;

  constructor(private portariaService: PortariaService,
    private alertModalService: AlertModalService,
    private route: ActivatedRoute,
    private router: Router,
    private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(dados => {
      this.cronogramaPortaria.porId = dados["por_id"];
      this.nomePortaria = dados["nome"];
    });
    this.listar();
    this.exibirComponentesEdicao();
  }

  public exibirComponentesEdicao(): void {
    this.exibirComponenteExcluir = Utils.exibirComponente('excluir-cronograma-portaria');
  }

  public gravarAtributoCronograma(event: Event): void {
    const nomeAtributo = (<HTMLInputElement>event.target).name;
    const valorAtributo = (<HTMLInputElement>event.target).value;
    this.cronogramaPortaria[nomeAtributo] = valorAtributo;
  }

  public inserir(): void {
    this.feedbackUsuario = "Adicionando cronograma, aguarde...";
    this.portariaService.inserirCronogramaPortaria(this.cronogramaPortaria)
      .toPromise()
      .then(() => {
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
    this.feedbackUsuario = "Carregando cronogramas, aguarde..."
    this.portariaService.listarCronogramaPortaria(this.cronogramaPortaria.porId).toPromise().then((response: Response) => {
      this.cronogramasPortaria = Object.values(response);
      this.feedbackUsuario = undefined;
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    })
  }

  public listarPortarias(): void {
    this.router.navigate([`${this.route.parent.routeConfig.path}/listar-portaria`]);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public excluir(cronogramaPortaria: CronogramaPortaria): void {
    this.feedbackUsuario = "Excluindo cronograma, aguarde...";
    this.portariaService.excluirCronogramaPortaria(parseInt(cronogramaPortaria["crp_id"])).toPromise().then(() => {
      this.firebaseService.apagarCronogramaFirebaseFirestorePortaria(cronogramaPortaria).then(() => {
        this.listar();
      }).catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      })
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    })
  }

}
