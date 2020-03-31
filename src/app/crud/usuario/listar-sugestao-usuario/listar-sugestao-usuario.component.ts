import { FirebaseService } from './../../../shared/firebase/firebase.service';
import { AlertModalService } from './../../../shared-module/alert-modal.service';
import { UsuarioService } from './../usuario.service';
import { Component, OnInit } from '@angular/core';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Router, ActivatedRoute } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'ngx-listar-sugestao-usuario',
  templateUrl: './listar-sugestao-usuario.component.html',
  styleUrls: ['./listar-sugestao-usuario.component.scss'],
  providers: [UsuarioService],
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
export class ListarSugestaoUsuarioComponent implements OnInit {

  public feedbackUsuario: string;
  public estado: string = 'visivel';
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public decrescente: boolean = false;

  public dataInicio: string = '';
  public dataFim: string = '';
  public escopoUsuario: string = '';
  public escId: number = 0;
  public usrId: number = 0;
  public statusSugestao: number = 0;
  public arrayDeSugestoes = new Array<Object>();
  public arrayHistoricoAlteracoesSugestoes = new Array<Object>();
  public observacaoAlteracaoDeStatus: string = '';
  public statusAtendimentoModificado: number = -1;

  constructor(
    private usuarioService: UsuarioService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,
    private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.carregarDados();
  }

  public carregarDados(): void {
    this.escId = Utils.pegarDadosEscolaDetalhado().id;
    const dados_usuario = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT))[0];
    this.usrId = parseInt(dados_usuario['id'], 10);
    this.escopoUsuario = Utils.pegarDadosEscopo().nome;
    this.dataInicio = `${(new Date()).getFullYear()}-01-01`;
    this.dataFim = Utils.dataAtual();
  }

  public navegarInserirSugestao(): void {
    this.router.navigate([`${this.activeRoute.parent.routeConfig.path}/enviar-sugestao-usuario`]);
  }

  public alterarStatusAtendimentoModificado(event: Event): void {
    this.statusAtendimentoModificado = parseInt((<HTMLInputElement>event.target).value, 10);
  }

  public listarHistoricoAtendimentoModificado(event: Event): void {
    this.feedbackUsuario = 'Carregando histórico de modificações, aguarde...';
    const susId = parseInt((<HTMLInputElement>event.target).value, 10);
    this.arrayHistoricoAlteracoesSugestoes = [];
    this.usuarioService.listarHistoricoAlteracaoSugestaoUsuario(susId).toPromise().then((response: Response) => {
      this.arrayHistoricoAlteracoesSugestoes = Object.values(response);
      this.feedbackUsuario = undefined;
    }).catch((erro: Response) => {
      this.tratarErro(erro);
    });

  }

  public alterarStatusAtendimento(susId: number): void {
    if (this.observacaoAlteracaoDeStatus != '') {
      this.feedbackUsuario = 'Atualizando statuso do atendimento, aguarde...';
      this.usuarioService.alterarSugestaoUsuario(this.usrId, susId,
        this.observacaoAlteracaoDeStatus, this.statusAtendimentoModificado)
        .toPromise().then(() => {
          this.feedbackUsuario = undefined;
          this.statusAtendimentoModificado = -1;
          this.alertModalService.showAlertSuccess('Status atualizado com sucesso');
        }).catch((erro: Response) => {
          this.tratarErro(erro);
        });
    } else {
      this.alertModalService.showAlertWarning('O campo observação deve ser preenchido');
    }
  }

  public ordenarColuna(campo: string): void {
    if (!this.decrescente) {
      const retorno = this.arrayDeSugestoes.sort(function (a, b) {
        if (a[campo] < b[campo]) {
          return 1;
        }
        if (a[campo] > b[campo]) {
          return -1;
        }
        return 0;
      });
      this.arrayDeSugestoes = retorno;

    } else {
      const retorno = this.arrayDeSugestoes.sort(function (a, b) {
        if (a[campo] > b[campo]) {
          return 1;
        }
        if (a[campo] < b[campo]) {
          return -1;
        }
        return 0;
      });
      this.arrayDeSugestoes = retorno;
    }
    this.decrescente = !this.decrescente;
  }

  public listarSugestoes(): void {
    this.feedbackUsuario = 'Carregando lista de atendimentos, aguarde...';
    this.usuarioService.listarSugestaoUsuario(
      this.dataInicio, this.dataFim,
      this.escId, this.escopoUsuario,
      this.statusSugestao).toPromise().then((response: Response) => {
        this.arrayDeSugestoes = Object.values(response);
        this.feedbackUsuario = undefined;
      }).catch((erro: Response) => {
        this.tratarErro(erro);
      });
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
