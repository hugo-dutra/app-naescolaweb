import { Component, OnInit } from '@angular/core';
import { DisciplinaService } from '../disciplina.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Disciplina } from '../disciplina.model';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router, NavigationExtras } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-listar-disciplina',
  templateUrl: './listar-disciplina.component.html',
  styleUrls: ['./listar-disciplina.component.scss'],
  providers: [DisciplinaService],
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
export class ListarDisciplinaComponent implements OnInit {

  public disciplinas: Array<Object>;
  public disciplina = new Disciplina();
  public estado: string = "visivel";
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirComponenteAlterar: Boolean = false;
  public exibirComponenteInserir: Boolean = false;
  public exibirComponenteExcluir: Boolean = false;
  public decrescente: boolean = true;

  constructor(
    private disciplinaService: DisciplinaService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  ngOnInit() {
    this.exibirComponentesEdicao();
    this.listar();
  }

  public exibirComponentesEdicao(): void {
    this.exibirComponenteInserir = Utils.exibirComponente('inserir-disciplina');
    this.exibirComponenteAlterar = Utils.exibirComponente('alterar-disciplina');
    this.exibirComponenteExcluir = Utils.exibirComponente('excluir-disciplina');

  }


  public listar(): void {
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.disciplinaService
      .listar()
      .toPromise()
      .then((response: Response) => {
        this.disciplinas = Object.values(response);
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public alterar(disciplina: Disciplina): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        disciplina: JSON.stringify(disciplina)
      }
    };
    this.router.navigate([`${this.router.url}/alterar-disciplina`], navigationExtras);
  }

  public excluir(disciplina: Disciplina): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        disciplina: JSON.stringify(disciplina)
      }
    };
    this.router.navigate([`${this.router.url}/excluir-disciplina`], navigationExtras);
  }

  public adicionar(): void {
    this.router.navigate([`${this.router.url}/inserir-disciplina`]);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public ordenarColuna(campo: string): void {
    if (!this.decrescente) {
      let retorno = this.disciplinas.sort(function (a, b) {
        if (a[campo] < b[campo]) {
          return 1;
        }
        if (a[campo] > b[campo]) {
          return -1;
        }
        return 0;
      })
      this.disciplinas = retorno;

    } else {
      let retorno = this.disciplinas.sort(function (a, b) {
        if (a[campo] > b[campo]) {
          return 1;
        }
        if (a[campo] < b[campo]) {
          return -1;
        }
        return 0;
      })
      this.disciplinas = retorno;
    }
    this.decrescente = !this.decrescente;
  }

}
