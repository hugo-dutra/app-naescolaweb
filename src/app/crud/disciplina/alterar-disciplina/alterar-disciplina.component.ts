import { EtapaEnsinoService } from './../../etapa-ensino/etapa-ensino.service';
import { Component, OnInit } from '@angular/core';
import { DisciplinaService } from '../disciplina.service';
import { AreaConhecimentoService } from '../../area-conhecimento/area-conhecimento.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Disciplina } from '../disciplina.model';
import { AreaConhecimento } from '../../area-conhecimento/area-conhecimento.model';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-alterar-disciplina',
  templateUrl: './alterar-disciplina.component.html',
  styleUrls: ['./alterar-disciplina.component.scss'],
  providers: [DisciplinaService, AreaConhecimentoService, EtapaEnsinoService],
  animations: [
    trigger('chamado', [
      state(
        'visivel',
        style({
          opacity: 1,
        }),
      ),
      transition('void => visivel', [
        style({ opacity: 0 }),
        animate(CONSTANTES.ANIMATION_DELAY_TIME + 'ms ease-in-out'),
      ]),
    ]),
  ],
})
export class AlterarDisciplinaComponent implements OnInit {

  public disciplina = new Disciplina();
  public areaConhecimento = new AreaConhecimento();
  public areasConhecimento = new Array<Object>();
  public etapasEnsino = new Array<Object>();
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public estado: string = 'visivel';

  public formulario = new FormGroup({
    id: new FormControl(null),
    nome: new FormControl(null),
    abreviatura: new FormControl(null),
    arc_id: new FormControl(null),
    ete_id: new FormControl(null),
  });

  constructor(
    private disciplinaService: DisciplinaService,
    private router: Router,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private etapaEnsinoService: EtapaEnsinoService,
    private areaConhecimentoService: AreaConhecimentoService,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((disciplina: Disciplina) => {
      this.disciplina = JSON.parse(disciplina['disciplina']);
    });
    this.carregarDados();
  }

  public carregarDados(): void {
    this.listarAreaConhecimento();
  }

  public listarAreaConhecimento(): void {
    this.feedbackUsuario = 'Carregando areas do conhecimento, aguarde...';
    this.areaConhecimentoService
      .listar()
      .toPromise()
      .then((response: Response) => {
        this.areasConhecimento = Object.values(response);
        this.listarEtapaEnsino();
      })
      .catch((erro: Response) => {
        this.tratarErro(erro);
      });
  }

  public listarEtapaEnsino(): void {
    this.feedbackUsuario = 'Carregando etapas do ensino, aguarde...';
    this.etapaEnsinoService.listar().toPromise().then((response: Response) => {
      this.etapasEnsino = Object.values(response);
      this.feedbackUsuario = undefined;
    }).catch((erro: Response) => {
      this.tratarErro(erro);
    });
  }

  public alterar(): void {
    this.feedbackUsuario = 'Salvando dados, aguarde...';
    this.disciplinaService
      .alterar(this.disciplina)
      .toPromise()
      .then(() => {
        this.feedbackUsuario = undefined;
        this.formulario.reset();
        this.router.navigateByUrl('listar-disciplina');
      })
      .catch((erro: Response) => {
        this.tratarErro(erro);
        this.exibirAlerta = true;
      });
  }

  public modificarInputs(event: Event) {
    const campo: string = (<HTMLInputElement>event.target).name;
    const valor: string = (<HTMLInputElement>event.target).value;
    this.disciplina[campo] = valor;
    this.validar(event);
  }

  public validar(event: Event) {
    Utils.validarCampos({ event: event });
    this.exibirAlerta = false;
  }

  public listar(): void {
    this.router.navigateByUrl('listar-disciplina');
  }

  public tratarErro(erro: Response): void {
    // Mostra modal
    this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
    // registra log de erro no firebase usando serviço singlenton
    this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`,
      JSON.stringify(erro));
    // Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
    // Caso token seja invalido, reenvia rota para login
    Utils.tratarErro({ router: this.router, response: erro });
    this.feedbackUsuario = undefined;
  }

}
