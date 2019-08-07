import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Utils } from '../../../shared/utils.shared';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-gerenciar-pedido-cartao',
  templateUrl: './gerenciar-pedido-cartao.component.html',
  styleUrls: ['./gerenciar-pedido-cartao.component.scss'],
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
export class GerenciarPedidoCartaoComponent implements OnInit {

  constructor(private router: Router) { }

  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;

  ngOnInit() {
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public listarPedidoCartao(): void {
    this.router.navigate([`${this.router.url}/listar-pedido-cartao`]);
  }

  public confeccionarCartaoAcesso(): void {
    this.router.navigate([`${this.router.url}/confeccionar-cartao-acesso`]);
  }

}
