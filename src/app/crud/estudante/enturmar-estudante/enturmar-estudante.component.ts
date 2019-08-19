import { Component, OnInit } from '@angular/core';
import { TurmaService } from '../../turma/turma.service';
import { EstudanteService } from '../estudante.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';
import { AlertaService } from '../../alerta/alerta.service';

@Component({
  selector: 'ngx-enturmar-estudante',
  templateUrl: './enturmar-estudante.component.html',
  styleUrls: ['./enturmar-estudante.component.scss'],
  providers: [TurmaService, EstudanteService],
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
export class EnturmarEstudanteComponent implements OnInit {

  public estudantes: Array<Object>;
  public matrizReferencia: Array<Object>;
  public estado: string = "visivel";
  public turmas: Object;
  public turmaSelecionada: number;
  public statusCheck: boolean;
  public feedbackUsuario: string;
  private arrayOfEstudantes = new Array<number>();
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public exibeTodos: boolean = true;
  public enturmadosTotais: string = "";
  private stringTurmaSelecionada: string = "Selecione uma turma";


  constructor(
    private turmaService: TurmaService,

    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private estudanteService: EstudanteService,
    private router: Router
  ) { }

  ngOnInit() {
    this.listarSemTurma();
    this.listarTurma();
  }

  public listarSemTurma(): void {
    this.arrayOfEstudantes = [];
    this.turmaSelecionada = undefined;

    this.feedbackUsuario = "Carregando estudantes, aguarde...";
    let esc_id: number = parseInt(
      Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT)
    );
    this.estudanteService
      .listarSemTurma(esc_id)
      .toPromise()
      .then((response: Response) => {
        this.estudantes = Object.values(response);
        this.matrizReferencia = this.estudantes;
        this.feedbackUsuario = undefined;
        this.listarTurma();

        if (this.arrayOfEstudantes.length > 0) {
          this.enturmadosTotais = this.arrayOfEstudantes.length + " de " + this.estudantes.length
        } else {
          this.enturmadosTotais = "";
        }

      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public selecionarTodos(event: Event): void {
    const arrayOfCheckbox = (<HTMLCollectionOf<HTMLInputElement>>document.getElementsByClassName('checkbox_estudante'));
    const statusCheckbox = (<HTMLInputElement>event.target).checked;
    Array.from(arrayOfCheckbox).forEach((elem: HTMLInputElement) => {
      elem.checked = statusCheckbox;
      const name = elem.name;
      if (elem.checked) {
        this.arrayOfEstudantes.push(parseInt(name));
      } else {
        this.arrayOfEstudantes.splice(
          this.arrayOfEstudantes.indexOf(parseInt(name), 0),
          1
        );
      }
    })

    if (this.arrayOfEstudantes.length > 0) {
      this.enturmadosTotais = this.arrayOfEstudantes.length + " de " + this.estudantes.length
    } else {
      this.enturmadosTotais = "";
    }

  }

  public filtrarEstudante(event: Event): void {
    let valorFiltro = (<HTMLInputElement>event.target).value;
    let matrizRetorno = new Array<Object>();
    matrizRetorno = this.estudantes.filter((elemento) => {
      return elemento["nome"].toLowerCase().indexOf(valorFiltro.toLocaleLowerCase()) != -1;
    })
    if (valorFiltro.length > 0) {
      this.estudantes = matrizRetorno;
    } else {
      this.estudantes = this.matrizReferencia;
    }
  }

  public limparFiltro(event: KeyboardEvent): void {
    if (event.key == 'Backspace' || event.key == 'Delete') {
      this.feedbackUsuario = "Filtrando, aguarde...";
      setTimeout(() => {
        this.estudantes = this.matrizReferencia
        this.feedbackUsuario = undefined;
        this.filtrarEstudante(event);
      }, 2000)
    }
  }

  public listarTurma(): void {
    this.feedbackUsuario = "Carregando turmas, aguarde...";
    let esc_id: number = parseInt(
      Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT)
    );
    let Data = new Date();
    this.turmaService
      .listarTodasAno(Data.getFullYear(), esc_id)
      .toPromise()
      .then((response: Response) => {
        this.turmas = response;
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public gravaStatusEstudantes(event: Event): void {
    let nome: string = (<HTMLInputElement>event.target).name;
    let status: boolean = (<HTMLInputElement>event.target).checked;
    if (status) {
      this.arrayOfEstudantes.push(parseInt(nome));
    } else {
      this.arrayOfEstudantes.splice(
        this.arrayOfEstudantes.indexOf(parseInt(nome), 0),
        1
      );
    }

    if (this.arrayOfEstudantes.length > 0) {
      this.enturmadosTotais = this.arrayOfEstudantes.length + " de " + this.estudantes.length
    } else {
      this.enturmadosTotais = "";
    }

  }

  public selecionarTurma(event: Event) {
    this.turmaSelecionada = parseInt((<HTMLInputElement>event.target).id);
    this.stringTurmaSelecionada = (<HTMLInputElement>event.target).name;
  }

  public enturmar(): void {
    if (this.validarEnturmacao()) {
      this.feedbackUsuario = "Salvando dados, aguarde...";
      this.estudanteService
        .enturmar(this.arrayOfEstudantes, this.turmaSelecionada)
        .toPromise()
        .then(() => {
          this.feedbackUsuario = undefined;
          this.arrayOfEstudantes = [];
          this.turmaSelecionada = undefined;
          this.stringTurmaSelecionada = "Selecione uma turma";
          (<HTMLInputElement>document.getElementById("chk_selecionar_todos")).checked = false;
          this.listarSemTurma();
        })
        .catch((erro: Response) => {
          //Mostra modal
          this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
          //registra log de erro no firebase usando serviço singlenton
          this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });
          this.feedbackUsuario = undefined;
        });
    }
  }

  public validarEnturmacao(): boolean {
    if (this.arrayOfEstudantes.length > 0 && this.turmaSelecionada != undefined) {
      return true;
    } else {
      this.alertModalService.showAlertDanger("Selecione uma turma e ao menos um estudante!");
      return false;
    }
  }

}
