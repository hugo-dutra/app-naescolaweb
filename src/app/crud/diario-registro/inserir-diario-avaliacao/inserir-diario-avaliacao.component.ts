import { Component, OnInit } from '@angular/core';
import { DiarioProfessorService } from '../../diario-professor/diario-professor.service';
import { EstudanteService } from '../../estudante/estudante.service';
import { DiarioRegistroService } from '../diario-registro.service';
import { PeriodoLetivoService } from '../../periodo-letivo/periodo-letivo.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { DiarioAvaliacaoNotaEstudante } from '../diario-avaliacao-nota-estudante.model';
import { DiarioAvaliacao } from '../diario-avaliacao-model';
import { Router } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-inserir-diario-avaliacao',
  templateUrl: './inserir-diario-avaliacao.component.html',
  styleUrls: ['./inserir-diario-avaliacao.component.scss'],
  providers: [DiarioProfessorService, EstudanteService, DiarioRegistroService, PeriodoLetivoService],
  animations: [
    trigger('chamado', [
      state(
        'visivel',
        style({
          opacity: 1
        })
      ),
      transition('void => visivel', [
        style({ opacity: 0 }),
        animate(CONSTANTES.ANIMATION_DELAY_TIME + 'ms ease-in-out')
      ])
    ])
  ]

})
export class InserirDiarioAvaliacaoComponent implements OnInit {

  public estado = 'visivel';
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;

  public arrayOfDiariosProfessor = new Array<Object>();
  public arrayOfEstudantesTurmaSelecionada = new Array<Object>();
  public arrayOfRegistrosNotas = new Array<DiarioAvaliacaoNotaEstudante>();
  public arrayOfPeriodosLetivos = new Array<Object>();
  public diarioAvaliacao = new DiarioAvaliacao();

  public dados_escola = new Array<Object>();
  public dados_usuario = new Array<Object>();
  public modos_tela = { inserir: 'inserir', listar: 'listar' };
  public modo_tela = '';
  public diarioSelecionado: Object;
  public exibirAlerta = false;
  public anoAtual: number;

  public usr_id: number;
  public esc_id: number;

  constructor(
    private diarioProfessorService: DiarioProfessorService,
    private router: Router,
    private estudanteService: EstudanteService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private diarioRegistroService: DiarioRegistroService,
    private periodoLetivoService: PeriodoLetivoService
  ) { }

  ngOnInit() {
    this.anoAtual = new Date().getFullYear();
    this.dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
    this.dados_usuario = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT))[0];
    this.esc_id = parseInt(this.dados_escola['id'], 10);
    this.usr_id = parseInt(this.dados_usuario['id'], 10);

    this.modo_tela = this.modos_tela.listar;
    this.listarDiariosProfessor();

  }

  public listarPeriodosLetivos(): void {
    this.feedbackUsuario = 'Carregando períodos letivos, aguarde...';
    const anoAtual = (new Date()).getFullYear();
    this.periodoLetivoService.listarPorAno(anoAtual).toPromise().then((response: Response) => {
      this.arrayOfPeriodosLetivos = Object.values(response);
      this.feedbackUsuario = undefined;
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;

    });
  }

  public adicionarRegistroAvaliacao(objeto: Object): void {
    this.arrayOfRegistrosNotas = new Array<DiarioAvaliacaoNotaEstudante>();
    this.diarioAvaliacao = new DiarioAvaliacao();
    this.modo_tela = this.modos_tela.inserir;
    this.diarioSelecionado = objeto;
    const trm_id = parseInt(this.diarioSelecionado['trm_id'], 10);
    this.listarEstudantesTurmaId(trm_id);
  }

  public listarEstudantesTurmaId(trm_id: number): void {
    this.feedbackUsuario = 'Carregando estudantes...';
    this.estudanteService
      .listarTurmaId(trm_id)
      .toPromise()
      .then((response: Response) => {
        this.arrayOfEstudantesTurmaSelecionada = Object.values(response);
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

  public adicionarNotaEstudantesAvaliacao(): void {
    console.log('Adicionar a nota ao array de estudante que chegará a esse método');
  }

  public gravarDadosAvaliacao(event: Event): void {
    let componente_name = (<HTMLInputElement>event.target).name;
    let componente_value = (<HTMLInputElement>event.target).value;

    switch (componente_name) {
      case 'metodologia': {
        this.diarioAvaliacao.metodologia = componente_value;
        break;
      }
      case 'objetivo': {
        this.diarioAvaliacao.objetivo = componente_value;
        break;
      }
      case 'data_avaliacao': {
        this.diarioAvaliacao.data_avaliacao = componente_value;
        break;
      }
      case 'valor': {
        this.diarioAvaliacao.valor = parseFloat(componente_value);
        break;
      }
      case 'peso': {
        this.diarioAvaliacao.peso = parseFloat(componente_value);
        break;
      }
      case 'periodo_letivo': {
        this.diarioAvaliacao.prl_id = parseInt(componente_value);
        break;
      }
      default:
        break;
    }
  }

  public listagemDiarios(): void {
    this.diarioSelecionado = null;
    this.modo_tela = this.modos_tela.listar;
  }

  public corrigirNotaErrada(event: Event): void {
    let valor = ((<HTMLInputElement>event.target).value)
    let elem_id = (<HTMLInputElement>event.target).id;

    if (isNaN(parseFloat(valor))) {
      valor = ''
    } else {
      if (parseFloat(valor) > this.diarioAvaliacao.valor) {
        (<HTMLInputElement>event.target).value = '';
      }
    }

    Array.from(document.getElementsByClassName('valores_notas')).forEach(elem => {
      if (elem.id == elem_id) {
        let valor: string = (<HTMLInputElement>elem).value;
        if (valor == '') {
          elem.classList.add('is-invalid');
          //elem.setAttribute('Max',this.diarioAvaliacao.valor.toString());
        } else {
          elem.classList.remove('is-invalid');
          elem.removeAttribute('Max');
        }
      }
    })

  }

  public verificarNotasErradas(event: Event): boolean {
    let retorno = true;
    let valor = parseFloat((<HTMLInputElement>event.target).value)
    if (valor > this.diarioAvaliacao.valor) {
      (<HTMLInputElement>event.target).value = '';
    }

    Array.from(document.getElementsByClassName('valores_notas')).forEach(elem => {
      let valorElemento: number = parseFloat((<HTMLInputElement>elem).value.toString());
      if (valorElemento > valor) {
        elem.classList.add('is-invalid');
        elem.setAttribute('Max', this.diarioAvaliacao.valor.toString());
        retorno = false;
      } else {
        elem.classList.remove('is-invalid');
        elem.removeAttribute('Max');
      }
    })
    return retorno;
  }

  public validarGravacaoNotas(): boolean {
    let retorno = true;
    let valor = this.diarioAvaliacao.valor;
    if (valor > this.diarioAvaliacao.valor) {
      (<HTMLInputElement>event.target).value = '';
    }

    Array.from(document.getElementsByClassName('valores_notas')).forEach(elem => {
      let valorElemento: number = parseFloat((<HTMLInputElement>elem).value.toString());
      if (isNaN(valorElemento)) {
        retorno = false;
      }
      if (valorElemento > valor) {
        elem.classList.add('is-invalid');
        elem.setAttribute('Max', this.diarioAvaliacao.valor.toString());
        retorno = false;
      } else {
        elem.classList.remove('is-invalid');
        elem.removeAttribute('Max');
      }
    })

    if (this.diarioAvaliacao.data_avaliacao == '' || this.diarioAvaliacao.data_avaliacao == null || this.diarioAvaliacao.data_avaliacao == undefined) {
      retorno = false;
    }

    if (this.diarioAvaliacao.metodologia == '' || this.diarioAvaliacao.metodologia == null || this.diarioAvaliacao.metodologia == undefined) {
      retorno = false;
    }

    if (this.diarioAvaliacao.objetivo == '' || this.diarioAvaliacao.objetivo == null || this.diarioAvaliacao.objetivo == undefined) {
      retorno = false;
    }

    if (this.diarioAvaliacao.peso == 0 || isNaN(this.diarioAvaliacao.peso) || this.diarioAvaliacao.peso == null || this.diarioAvaliacao.peso == undefined) {
      retorno = false;
    }

    if (this.diarioAvaliacao.valor == 0 || isNaN(this.diarioAvaliacao.valor) || this.diarioAvaliacao.valor == null || this.diarioAvaliacao.valor == undefined) {
      retorno = false;
    }

    if (this.diarioAvaliacao.estudantes_avaliados != undefined) {
      if (this.diarioAvaliacao.estudantes_avaliados.length < this.arrayOfEstudantesTurmaSelecionada.length) {
        retorno = false;
      }
    }
    return retorno;
  }

  public adicionarNotaEstudante(estudante: Object, event: Event): void {
    let nota: number = parseFloat((<HTMLInputElement>event.target).value);
    let idx_registro = this.arrayOfRegistrosNotas.findIndex(
      x => x.est_id == parseInt(estudante['id'])
    );

    let diarioAvaliacaoNotaEstudante = new DiarioAvaliacaoNotaEstudante()
    diarioAvaliacaoNotaEstudante.est_id = parseInt(estudante['id']);

    if (isNaN(nota)) {
      nota = -1;
    }

    if (nota > this.diarioAvaliacao.valor) {
      nota = -1;
    } else {
      diarioAvaliacaoNotaEstudante.valor = nota;
      if (idx_registro == -1) {
        //Novo registro
        this.arrayOfRegistrosNotas.push(diarioAvaliacaoNotaEstudante);
      } else {
        //registro existente
        this.arrayOfRegistrosNotas[idx_registro] = diarioAvaliacaoNotaEstudante;
      }
    }
  }

  public listarDiariosProfessor(): void {
    this.feedbackUsuario = 'Carregando diários, aguarde...';
    this.diarioProfessorService
      .listarPorUsuarioEscola(this.usr_id, this.esc_id, this.anoAtual)
      .toPromise()
      .then((response: Response) => {
        this.arrayOfDiariosProfessor = Object.values(response);
        this.listarPeriodosLetivos();
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

  public gerenciarDiarioProfessor(): void {
    this.router.navigate(['gerenciar-diario-registro']);
  }

  public listagemDiariosAvaliacao(): void {
    this.modo_tela = this.modos_tela.listar;
    this.arrayOfEstudantesTurmaSelecionada.length = 0;
    this.diarioSelecionado = null;
  }

  public salvarRegistroDiarioAvaliacao(): void {
    this.diarioAvaliacao.estudantes_avaliados = this.arrayOfRegistrosNotas;
    this.diarioAvaliacao.dip_id = this.diarioSelecionado['dip_id'];
    // console.log(this.diarioAvaliacao);
    if (this.arrayOfRegistrosNotas.length === this.arrayOfEstudantesTurmaSelecionada.length) {
      if (this.validarGravacaoNotas() === true) {
        this.exibirAlerta = false;
        this.feedbackUsuario = 'Salvando notas e avaliação, aguarde...';
        this.diarioRegistroService.inserirAvaliacaoTurmaEstudantes(this.diarioAvaliacao).toPromise().then((response: Response) => {
          this.feedbackUsuario = undefined;
          this.modo_tela = this.modos_tela.listar;
          this.arrayOfEstudantesTurmaSelecionada.length = 0;
          this.diarioAvaliacao = null;
        }).catch((erro: Response) => {
          //Mostra modal
          this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
          //registra log de erro no firebase usando serviço singlenton
          this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });
          this.feedbackUsuario = undefined;
        })

      } else {
        console.log('Existem notas ou campos não informados.');
        this.exibirAlerta = true;
      }
    } else {
      console.log('Existem notas ou campos não informados.');
      this.exibirAlerta = true;
    }
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }
}
