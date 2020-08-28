import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-gerenciar-diario-professor',
  templateUrl: './gerenciar-diario-professor.component.html',
  styleUrls: ['./gerenciar-diario-professor.component.scss'],
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
export class GerenciarDiarioProfessorComponent implements OnInit {

  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public inserir(): void {

    this.router.navigate([`${this.router.url}/inserir-diario-professor`]);
  }
  public transferir(): void {
    this.router.navigate([`${this.router.url}/transferir-diario-professor`]);
  }
  public listar(): void {
    alert('Implementar listragem de diários da escola aqui...');
    //this.router.navigate([`${this.router.url}/listar-diario-professor`]);
  }
  public arquivar(): void {
    this.router.navigate([`${this.router.url}/arquivar-diario-professor`]);
  }
  public importarNotaBoletim(): void {
    this.router.navigate([`${this.router.url}/importar-nota-boletim`]);
  }
  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }


}
