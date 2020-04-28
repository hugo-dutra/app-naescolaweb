import { Component, OnInit } from '@angular/core';
import { Utils } from '../../../shared/utils.shared';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-gerenciar-listagem',
  templateUrl: './gerenciar-listagem.component.html',
  styleUrls: ['./gerenciar-listagem.component.scss']
})
export class GerenciarListagemComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }
  public gerarListagem(): void {
    this.router.navigate([`${this.router.url}/listar-gerador-listagem`]);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

}
