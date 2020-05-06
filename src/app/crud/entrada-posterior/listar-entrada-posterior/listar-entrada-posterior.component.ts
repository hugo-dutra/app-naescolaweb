import { EntradaPosteriorService } from './../entrada-posterior.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';
import { EntradaPosterior } from '../entrada-posterior.model';
import { CONSTANTES } from '../../../shared/constantes.shared';

@Component({
  selector: 'ngx-listar-entrada-posterior',
  templateUrl: './listar-entrada-posterior.component.html',
  styleUrls: ['./listar-entrada-posterior.component.scss'],
  providers: [EntradaPosteriorService]
})
export class ListarEntradaPosteriorComponent implements OnInit {

  private esc_id: number;
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta = false;

  public arrayEntradasPosteriores = new Array<Object>();
  public matrizReferencia = new Array<Object>();
  constructor(
    private router: Router,
    private entradaPosteriorService: EntradaPosteriorService
  ) { }

  ngOnInit() {
    this.esc_id = Utils.pegarDadosEscolaDetalhado().id;
    this.listarEntradasPosteriores();
  }

  public inserirEntradaPosterior(): void {
    this.router.navigate([`${this.router.url}/inserir-entrada-posterior`])
  }

  public listarEntradasPosteriores(): void {
    this.feedbackUsuario = 'Carregando autorizações de entrada posterior, aguarde...'
    this.entradaPosteriorService.listar(this.esc_id).toPromise().then((response: Response) => {
      this.arrayEntradasPosteriores = Object.values(response);
      this.matrizReferencia = this.arrayEntradasPosteriores;
      console.log(this.arrayEntradasPosteriores);
      this.feedbackUsuario = undefined;
    });
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public detalharEntradaPosterior(entradaPosterior: Object): void {
    console.log(entradaPosterior);
  }

  public excluirEntradaPosterior(entradaPosterior: Object): void {
    console.log(entradaPosterior);
  }

  public filtrarEstudante(event: Event): void {
    const valorFiltro = (<HTMLInputElement>event.target).value;
    let matrizRetorno = new Array<Object>();
    matrizRetorno = this.arrayEntradasPosteriores.filter((elemento) => {
      return elemento['nome'].toLowerCase().indexOf(valorFiltro.toLocaleLowerCase()) != -1;
    });
    if (valorFiltro.length > 0) {
      this.arrayEntradasPosteriores = matrizRetorno;
    } else {
      this.arrayEntradasPosteriores = this.matrizReferencia;
    }
  }

}
