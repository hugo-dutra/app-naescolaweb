import { AtividadeExtraClasseService } from './../atividade-extra-classe.service';
import { Component, OnInit } from '@angular/core';
import { Utils } from '../../../shared/utils.shared';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'ngx-listar-atividade',
  templateUrl: './listar-atividade.component.html',
  styleUrls: ['./listar-atividade.component.scss'],
  providers: [AtividadeExtraClasseService],
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
export class ListarAtividadeComponent implements OnInit {

  public escId: number = 0;
  public dataInicial: string = '';
  public dataFinal: string = '';
  public feedbackUsuario: string;
  public estado: string = 'visivel';
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public arrayDeAtividadesExtraClasse = new Array<Object>();
  public arrayDeEstudantesAtividadesExtraClasse = new Array<Object>();
  public arrayDeAnexosAtividadesExtraClasse = new Array<Object>();

  constructor(
    private atividadeExtraClasseService: AtividadeExtraClasseService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router) { }

  ngOnInit() {
    this.carregarDados();
  }

  public carregarDados(): void {
    this.escId = Utils.pegarDadosEscolaDetalhado().id;
    this.dataInicial = Utils.dataAtual();
    this.dataFinal = Utils.dataAtual();
  }

  public listarAtividades(): void {
    this.listarAtividadesExtraClasse();
  }

  public listarAtividadesExtraClasse(): void {
    this.feedbackUsuario = 'Listando atividades, aguarde...';
    this.atividadeExtraClasseService.listarAtividadeExtraClasse(this.escId, this.dataInicial, this.dataFinal)
      .toPromise().then((response: Response) => {
        this.arrayDeAtividadesExtraClasse = Object.values(response);
        this.feedbackUsuario = undefined;
      }).catch((erro: Response) => {
        this.tratarErro(erro);
      });
  }

  public listarEstudantesAtividade(aecId: number): void {
    this.feedbackUsuario = 'Listando estudantes,aguarde...';
    this.arrayDeEstudantesAtividadesExtraClasse = [];
    this.atividadeExtraClasseService.listarEstudanteAtividadeExtraClasse(aecId)
      .toPromise().then((response: Response) => {
        this.arrayDeEstudantesAtividadesExtraClasse = Object.values(response);
        this.feedbackUsuario = undefined;
      }).catch((erro: Response) => {
        this.tratarErro(erro);
      });
  }

  public listarAnexosAtividade(aecId: number): void {
    this.feedbackUsuario = 'Listando anexos,aguarde...';
    this.arrayDeAnexosAtividadesExtraClasse = [];
    this.atividadeExtraClasseService.listarAnexoAtividadeExtraClasse(aecId)
      .toPromise().then((response: Response) => {
        this.arrayDeAnexosAtividadesExtraClasse = Object.values(response);
        this.feedbackUsuario = undefined;
      }).catch((erro: Response) => {
        this.tratarErro(erro);
      });
  }

  public atualizarStatusAtividadeExtraClasse(firebase_dbkey: string): void {
    alert(firebase_dbkey);
  }

  public voltarGerenciarAtividade(): void {
    this.router.navigate(['gerenciar-atividade-extra-classe']);
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
