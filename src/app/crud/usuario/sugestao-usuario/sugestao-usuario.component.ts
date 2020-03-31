import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseService } from './../../../shared/firebase/firebase.service';
import { AlertModalService } from './../../../shared-module/alert-modal.service';
import { CONSTANTES } from './../../../shared/constantes.shared';
import { Utils } from './../../../shared/utils.shared';
import { UsuarioService } from './../usuario.service';
import { SugestaoUsuario } from './sugestao-usuario.model';
import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'ngx-sugestao-usuario',
  templateUrl: './sugestao-usuario.component.html',
  styleUrls: ['./sugestao-usuario.component.scss'],
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
export class SugestaoUsuarioComponent implements OnInit {

  public tipoMensagemSelecionada: string = '';
  public tituloMensagem: string = '';
  public textoMensagem: string = '';
  public arrayTipoMensagem: Object[] = [{ tipo: 'Crítica' }, { tipo: 'Sugestão' }, { tipo: 'Problema' }];
  public sugestaoUsuario = new Object();
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public estado: string = 'visivel';
  constructor(
    private usuarioService: UsuarioService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,
    private activeRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  public enviarMensagem(): void {
    if (this.validarEnvioMensagem()) {
      this.feedbackUsuario = `Enviando ${this.tipoMensagemSelecionada}, aguarde...'`;
      this.usuarioService.inserirSugestaoUsuario(this.sugestaoUsuario).toPromise().then((response: Response) => {
        this.feedbackUsuario = 'Finalizando, aguarde...';
        const detalhesSugestao = {
          mensagem: this.sugestaoUsuario['mensagem'],
          tipoSugestao: this.sugestaoUsuario['tipoSugestao'],
          titulo: this.sugestaoUsuario['titulo'],
        };
        this.firebaseService.gravarSugestaoInformacaoBug(this.router.url, detalhesSugestao).then(() => {
          this.feedbackUsuario = undefined;
          this.reiniciarValores();
        });
      }).catch((erro: Response) => {
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
      });
    } else {
      this.alertModalService.showAlertWarning('Preencha todos os campos');
    }
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public listarSugestoesUsuario(): void {
    this.router.navigate([`${this.activeRoute.parent.routeConfig.path}/listar-sugestao-usuario`]);
  }

  public validarEnvioMensagem(): boolean {
    this.sugestaoUsuario['titulo'] = this.tituloMensagem;
    this.sugestaoUsuario['mensagem'] = this.textoMensagem;
    this.sugestaoUsuario['tipoSugestao'] = this.tipoMensagemSelecionada;
    this.sugestaoUsuario['esc_id'] = Utils.pegarDadosEscolaDetalhado().id;
    const dados_usuario = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT))[0];
    this.sugestaoUsuario['usr_id'] = parseInt(dados_usuario['id'], 10);
    if (this.sugestaoUsuario['titulo'].trim() != '' &&
      this.sugestaoUsuario['mensagem'].trim() != '' &&
      this.sugestaoUsuario['tipoSugestao'].trim() != '') {
      return true;
    }
    return false;
  }

  public reiniciarValores(): void {
    this.sugestaoUsuario['mensagem'] = '';
    this.sugestaoUsuario['tipoSugestao'] = '';
    this.sugestaoUsuario['titulo'] = '';
    this.tituloMensagem = '';
    this.textoMensagem = '';
    this.tipoMensagemSelecionada = '';
  }
}
