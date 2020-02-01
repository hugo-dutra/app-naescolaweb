import { Utils } from './../../../shared/utils.shared';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'ngx-gerenciar-usuario',
  templateUrl: './gerenciar-usuario.component.html',
  styleUrls: ['./gerenciar-usuario.component.scss'],
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
export class GerenciarUsuarioComponent implements OnInit {

  public feedbackUsuario: string;
  public estado: string = "visivel";
  public esc_id: number;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public alterarSenha(): void {
    this.router.navigate([`listar-usuario/alterar-senha-usuario`]);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

}
