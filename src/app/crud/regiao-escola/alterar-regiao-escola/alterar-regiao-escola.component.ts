import { Component, OnInit } from '@angular/core';
import { RegiaoEscolaService } from '../regiao-escola.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { RegiaoEscola } from '../regiao-escola.model';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-alterar-regiao-escola',
  templateUrl: './alterar-regiao-escola.component.html',
  styleUrls: ['./alterar-regiao-escola.component.scss'],
  providers: [RegiaoEscolaService],
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
export class AlterarRegiaoEscolaComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,

    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private regiaoEscolaService: RegiaoEscolaService
  ) { }

  public regiaoEscola = new RegiaoEscola();
  public feedbackUsuario: string;
  public estado = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;

  ngOnInit() {
    this.route.queryParams.subscribe((regiaoEscola: RegiaoEscola) => {
      this.regiaoEscola = JSON.parse(regiaoEscola["regiaoEscola"]);
    });
  }

  public alterar() {
    this.feedbackUsuario = "Alterando dados, aguarde...";
    this.regiaoEscolaService
      .alterar(this.regiaoEscola)
      .toPromise()
      .then((response: Response) => {
        this.router.navigateByUrl("listar-regiao-escola");
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
    //Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.exibirAlerta = true;
        this.feedbackUsuario = undefined;
      });
  }

  public modificarInputs(event: Event) {
    let campo: string = (<HTMLInputElement>event.target).name;
    let valor: string = (<HTMLInputElement>event.target).value;
    this.regiaoEscola[campo] = valor;
    this.validar(event);
  }

  public listar() {
    this.router.navigateByUrl("listar-regiao-escola");
  }

  public validar(event: Event) {
    Utils.validarCampos({ event: event });
    this.exibirAlerta = false;
  }

}
