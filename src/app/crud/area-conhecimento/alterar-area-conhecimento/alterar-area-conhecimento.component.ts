import { Component, OnInit } from '@angular/core';
import { AreaConhecimentoService } from '../area-conhecimento.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { AreaConhecimento } from '../area-conhecimento.model';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-alterar-area-conhecimento',
  templateUrl: './alterar-area-conhecimento.component.html',
  styleUrls: ['./alterar-area-conhecimento.component.scss'],
  providers: [AreaConhecimentoService],
  animations: [
    trigger('chamado', [
      state(
        'visivel',
        style({
          opacity: 1,
        }),
      ),
      transition('void => visivel', [
        style({ opacity: 0 }),
        animate(CONSTANTES.ANIMATION_DELAY_TIME + 'ms ease-in-out'),
      ]),
    ]),
  ],
})
export class AlterarAreaConhecimentoComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private areaConhecimentoService: AreaConhecimentoService,
  ) { }

  public areaConhecimento = new AreaConhecimento();
  public feedbackUsuario: string;
  public feedbackAlerta: string;
  public estado = 'visivel';
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;

  ngOnInit() {
    this.route.queryParams.subscribe((area: AreaConhecimento) => {
      this.areaConhecimento = JSON.parse(area['area']);
    });
  }

  public alterar() {
    this.feedbackUsuario = 'Alterando dados, aguarde...';
    this.areaConhecimentoService
      .alterar(this.areaConhecimento)
      .toPromise()
      .then((response: Response) => {
        this.router.navigateByUrl('listar-area-conhecimento');
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        // Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        // registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`,
          JSON.stringify(erro));
        // Gravar erros no analytics
        Utils.gravarErroAnalytics(JSON.stringify(erro));
        // Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.exibirAlerta = true;
        this.feedbackUsuario = undefined;
      });
  }

  public modificarInputs(event: Event) {
    const campo: string = (<HTMLInputElement>event.target).name;
    const valor: string = (<HTMLInputElement>event.target).value;
    this.areaConhecimento[campo] = valor;
    this.validar(event);
  }

  public listar() {
    this.router.navigate(['listar-area-conhecimento']);
  }

  public validar(event: Event) {
    Utils.validarCampos({ event: event });
    this.exibirAlerta = false;
  }

}
