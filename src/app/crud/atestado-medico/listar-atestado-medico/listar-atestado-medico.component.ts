import { AlertModalService } from './../../../shared-module/alert-modal.service';
import { AtestadoMedicoService } from './../atestado-medico.service';

import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-listar-atestado-medico',
  templateUrl: './listar-atestado-medico.component.html',
  styleUrls: ['./listar-atestado-medico.component.scss'],
  providers: [AtestadoMedicoService],
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
export class ListarAtestadoMedicoComponent implements OnInit {

  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public arrayDeAtestados = new Array<Object>();
  public decrescente: boolean = true;
  public exibirComponenteAlterar: Boolean = false;
  public exibirComponenteInserir: Boolean = false;
  public exibirComponenteExcluir: Boolean = false;
  public nomeEstudanteAtestadoProcurado: string = "";
  public esc_id: number = 0;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private atestadoMedicoService: AtestadoMedicoService,
    private alertModalService: AlertModalService

  ) { }

  ngOnInit() {
    this.exibirComponentesEdicao();
    this.carregarDados();
  }

  public carregarDados(): void {
    this.esc_id = Utils.pegarDadosEscolaDetalhado().id;
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public exibirComponentesEdicao(): void {
    this.exibirComponenteInserir = Utils.exibirComponente('inserir-atestado-medico');
    this.exibirComponenteAlterar = Utils.exibirComponente('alterar-atestado-medico');
    this.exibirComponenteExcluir = Utils.exibirComponente('excluir-atestado-medico');
  }

  public ordenarColuna(campo: string): void {
    if (!this.decrescente) {
      let retorno = this.arrayDeAtestados.sort(function (a, b) {
        if (a[campo] < b[campo]) {
          return 1;
        }
        if (a[campo] > b[campo]) {
          return -1;
        }
        return 0;
      })
      this.arrayDeAtestados = retorno;
    } else {
      let retorno = this.arrayDeAtestados.sort(function (a, b) {
        if (a[campo] > b[campo]) {
          return 1;
        }
        if (a[campo] < b[campo]) {
          return -1;
        }
        return 0;
      })
      this.arrayDeAtestados = retorno;
    }
    this.decrescente = !this.decrescente;
  }

  public listarAtestadosMedicos(): void {
    console.log(this.esc_id);
    this.feedbackUsuario = "Filtrando atestados, aguarde..."
    this.atestadoMedicoService.listar(this.nomeEstudanteAtestadoProcurado, this.esc_id).toPromise().then((response: Response) => {
      this.arrayDeAtestados = Object.values(response);
      this.feedbackUsuario = undefined;
      console.log(this.arrayDeAtestados);
    })
  }

  public detalharCID(descricao_cid: string): void {
    this.alertModalService.showAlertInformation(descricao_cid);
  }

  public listarAtestadosMedicosKeyDown(key: KeyboardEvent): void {
    if (key.keyCode == 13) {
      this.listarAtestadosMedicos();
    }
  }

  public inserir(): void {
    this.router.navigate([`${this.route.parent.routeConfig.path}/inserir-atestado-medico`]);
  }

  public alterar(atestado: Object) {
    console.log(atestado);
  }

  public excluir(atestado: Object) {
    console.log(atestado)
  }

}
