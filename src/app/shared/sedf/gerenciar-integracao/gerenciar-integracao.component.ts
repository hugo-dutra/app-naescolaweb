import { Component, OnInit } from '@angular/core';
import { Utils } from '../../utils.shared';
import { SedfService } from '../sedf.service';
import { CONSTANTES } from '../../constantes.shared';

@Component({
  selector: 'ngx-gerenciar-integracao',
  templateUrl: './gerenciar-integracao.component.html',
  styleUrls: ['./gerenciar-integracao.component.scss'],
  providers: [SedfService]
})
export class GerenciarIntegracaoComponent implements OnInit {
  public inep: string;
  public dados_escola: Object;
  constructor(private sedfService: SedfService) { }

  ngOnInit() {
    this.carregarDados();
  }

  public carregarDados(): void {
    this.dados_escola = JSON.parse(
      Utils.decriptAtoB(
        localStorage.getItem("dados_escola"),
        CONSTANTES.PASSO_CRIPT
      )
    )[0];
    this.inep = this.dados_escola["inep"];
  }

  public sincronizarEstudantes(): void {
    alert("Estudantes serão sincronizados por aqui");
  }

  public sincronizarNotasFaltas(): void {
    alert("Notas e faltas serão sincronizadas por aqui");
  }

  public sincronizarTurmas(): void {
    alert("Tumas serão sincronizadas por aqui");
  }

  public sincronizarProfessores(): void {
    alert("Professores serão sincronizados por aqui");
  }

  public sincronizarGradeHoraria(): void {
    alert("Grade horária será sincronizada por aqui");
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

}
