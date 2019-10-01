import { Component, OnInit } from '@angular/core';
import { ProfessorService } from '../professor.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Utils } from '../../../shared/utils.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';
import { Professor } from '../professor.model';
import { FormGroup, FormControl } from '@angular/forms';
import { ProfessorEscolaService } from '../../professor-escola/professor-escola.service';
import { ProfessorEscola } from '../../professor-escola/professor-escola.model';

@Component({
  selector: 'ngx-inserir-professor',
  templateUrl: './inserir-professor.component.html',
  styleUrls: ['./inserir-professor.component.scss'],
  providers: [ProfessorService, ProfessorEscolaService],
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
export class InserirProfessorComponent implements OnInit {

  constructor(
    private professorService: ProfessorService,
    private professorEscolaService: ProfessorEscolaService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router
  ) { }
  public professor: Professor = new Professor();
  public no_avatar_url: string = CONSTANTES.NO_AVATAR_URL;
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public esc_id: number;
  public prf_id: number;
  public dados_escola: Object;

  public formulario: FormGroup = new FormGroup({
    id: new FormControl(null),
    nome: new FormControl(null),
    email: new FormControl(null),
    matricula: new FormControl(null),
    cpf: new FormControl(null),
    telefone: new FormControl(null)
  });

  ngOnInit() {
    this.carregarDados();
  }

  public carregarDados(): void {
    this.dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
    this.esc_id = parseInt(this.dados_escola['id'], 10);
  }

  public modificar(): void { }

  public inserir(): void {
    //Guarda os parametros do formulario nos atributos do objeto diretor
    this.professor.nome = this.formulario.value.nome;
    this.professor.email = this.formulario.value.email;
    this.professor.matricula = this.formulario.value.matricula;
    this.professor.cpf = this.formulario.value.cpf;
    this.professor.telefone = this.formulario.value.telefone;

    //Pegar esse valor, passar para um serviço fazer um post http para o servidor laravel gravar no banco e retorna o ultimo objeto inserido
    this.feedbackUsuario = 'Salvando dados, aguarde...';
    this.professorService
      .inserir(this.professor)
      .toPromise()
      .then((resposta: Response) => {
        const prf_id = <number>Object.values(resposta)[0]['prf_id'];
        const professoresEscolas = new Array<ProfessorEscola>();
        const professorEscola = new ProfessorEscola();
        professorEscola.esc_id = this.esc_id;
        professorEscola.prf_id = prf_id;
        professoresEscolas.push(professorEscola);
        this.feedbackUsuario = 'Associando professor a escola atual, aguarde...';
        this.professorEscolaService.inserir(professoresEscolas).toPromise().then(() => {
          this.formulario.reset();
          this.feedbackUsuario = undefined;
          this.exibirAlerta = false;
        })
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
        this.feedbackUsuario = undefined;
        this.exibirAlerta = true;
      });
  }

  public enviarArquivo(event: Event): void {
    //************/
  }

  public excluir(): void { }

  public listar(): void {
    this.router.navigate(['listar-professor']);
  }

  public listarObjeto(): Object {
    return null;
  }

  public listarObjetos(): Object[] {
    return null;
  }

  public validar(event: Event) {
    Utils.validarCampos({ event: event });
    this.exibirAlerta = false;
  }

}
