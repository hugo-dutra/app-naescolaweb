import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-gerenciar-alerta',
  templateUrl: './gerenciar-alerta.component.html',
  styleUrls: ['./gerenciar-alerta.component.scss'],
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
export class GerenciarAlertaComponent implements OnInit {

  public feedbackUsuario: string;
  public estado: string = "visivel";
  public esc_id: number;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  constructor(private router: Router) { }

  ngOnInit() {

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
    //return true;
  }

}
