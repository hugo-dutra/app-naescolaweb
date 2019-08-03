import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Utils } from '../../../shared/utils.shared';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-gerenciar-diario-registro',
  templateUrl: './gerenciar-diario-registro.component.html',
  styleUrls: ['./gerenciar-diario-registro.component.scss'],
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
export class GerenciarDiarioRegistroComponent implements OnInit {

  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public inserirRegistroDiario(): void {
    this.router.navigate([`${this.router.url}/inserir-registro-diario`]);
  }

  public alterarRegistroDiario(): void {
    this.router.navigate([`${this.router.url}/alterar-registro-diario`]);
  }

  public inserirDiarioAvaliacao(): void {
    this.router.navigate([`${this.router.url}/inserir-diario-avaliacao`]);
  }

  public alterarRegistroDeAvaliacao(): void {
    this.router.navigate([`${this.router.url}/alterar-diario-avaliacao`]);
  }

  public inserirDiarioObservacaoEstudante(): void {
    this.router.navigate([`${this.router.url}/inserir-diario-observacao-estudante`]);
  }

  public inserirDiarioObservacaoGeral(): void {
    this.router.navigate([`${this.router.url}/inserir-diario-observacao-geral`]);
  }

  public EnviarNotaBoletim(): void {
    /* É rota raiz pois está em outro módulo */
    this.router.navigate([`enviar-nota-boletim`]);
  }

  public listarTurmaDisciplinaNotasConselho(): void {
    this.router.navigate([`${this.router.url}/listar-turma-disciplina-professor`]);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

}
