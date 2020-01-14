import { Component, OnInit } from '@angular/core';
import { ProfessorService } from '../professor.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Professor } from '../professor.model';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';
import { ProfessorDisciplinaService } from '../../professor-disciplina/professor-disciplina.service';

@Component({
  selector: 'ngx-alterar-professor',
  templateUrl: './alterar-professor.component.html',
  styleUrls: ['./alterar-professor.component.scss'],
  providers: [ProfessorService, ProfessorDisciplinaService],
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
export class AlterarProfessorComponent implements OnInit {

  public professor = new Professor();
  public disciplinasProfessor = new Array<Object>();
  public estado: string = "visivel";
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;

  constructor(
    private professorService: ProfessorService,
    private alertModalService: AlertModalService,
    private professorDisciplina: ProfessorDisciplinaService,
    private firebaseService: FirebaseService,
    private activeroute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.activeroute.queryParams.subscribe((professor: Professor) => {
      this.professor = JSON.parse(professor["professor"]);
    });
    this.listarDisciplinas(this.professor);
  }

  public alterar(): void {
    this.feedbackUsuario = "Salvando dados, aguarde...";
    this.professorService
      .alterar(this.professor)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.router.navigate(['listar-professor']);
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Gravar erros no analytics
        Utils.gravarErroAnalytics(JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.exibirAlerta = true;
        this.feedbackUsuario = undefined;
      });
  }

  public modificarInputs(event: Event): void {
    let campo: string = (<HTMLInputElement>event.target).name;
    let valor: string = (<HTMLInputElement>event.target).value;
    this.professor[campo] = valor;
    this.validar(event);
  }

  public validar(event: Event) {
    Utils.validarCampos({ event: event });
    this.exibirAlerta = false;
  }

  public listar(): void {
    this.router.navigate(['listar-professor']);
  }

  public listarDisciplinas(professor: Object): void {
    this.feedbackUsuario = "Carregando disciplinas vinculadas ao professor, aguarde..."
    let prf_id = parseInt(professor["id"]);
    this.professorService.listarDisciplina(prf_id).toPromise().then((response: Response) => {
      this.disciplinasProfessor = Object.values(response);
      console.log(this.disciplinasProfessor);
      this.feedbackUsuario = undefined;
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
      //Gravar erros no analytics
      Utils.gravarErroAnalytics(JSON.stringify(erro));
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    })
  }

  public desvincularProfessorDisciplina(dsp_id: number): void {
    this.feedbackUsuario = "Desvinculando disciplina, aguarde..."
    this.professorDisciplina.desvincularProfessorDisciplina(this.professor.id, dsp_id).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.listarDisciplinas(this.professor);
    })
  }


}
