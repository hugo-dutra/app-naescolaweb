import { FirebaseService } from './../../../shared/firebase/firebase.service';
import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';
import { HintService } from 'angular-custom-tour';
import { AcessoComumService } from '../../../shared/acesso-comum/acesso-comum.service';


@Component({
  selector: 'ngx-gerenciar-alerta',
  templateUrl: './gerenciar-alerta.component.html',
  styleUrls: ['./gerenciar-alerta.component.scss'],
  providers: [HintService],
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
export class GerenciarAlertaComponent implements OnInit {

  public feedbackUsuario: string;
  public estado: string = 'visivel';
  public esc_id: number;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  constructor(private router: Router,
    private hintService: HintService,
    private acessoComumService: AcessoComumService,
    private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.subscribeTour();
  }

  public escreverTesteFirebase(): void {
    const dados_escola = JSON.parse(
      Utils.decriptAtoB(
        localStorage.getItem('dados_escola'),
        CONSTANTES.PASSO_CRIPT,
      ),
    )[0];
    const inep = dados_escola['inep'];

    for (let i = 0; i < 450000; i++) {
      this.firebaseService.escreverDocumentosTeste(inep).then(() => {
        console.log(`${i + 1}º documento escrito de ${450000}...`);
      });
    }
  }

  public atualizarStatus_0_1Firebase(): void {
    const dados_escola = JSON.parse(
      Utils.decriptAtoB(
        localStorage.getItem('dados_escola'),
        CONSTANTES.PASSO_CRIPT,
      ),
    )[0];
    const inep = dados_escola['inep'];
    console.log('Carregando coleção');

    this.firebaseService.atualizarStatusDocumentos_0_1(inep).then((docs: firebase.firestore.QuerySnapshot) => {
      docs.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot) => {
        console.log(doc.data());
      });

    })
  }


  public subscribeTour(): void {
    this.acessoComumService.emitirAlertaInicioTour.subscribe(() => {
      this.hintService.initialize({ elementsDisabled: false });
    });
  }

  public listarAlertas(): void {
    this.router.navigate([`${this.router.url}/listar-alerta`]);
  }

  public atribuirAlertaUsuario(): void {
    this.router.navigate([`${this.router.url}/atribuir-alerta-usuario`]);
  }

  public inserirAlerta(): void {
    this.router.navigate([`${this.router.url}/inserir-alerta`]);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
    // return true;
  }

}
