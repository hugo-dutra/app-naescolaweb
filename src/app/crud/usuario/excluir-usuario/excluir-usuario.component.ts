import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../../perfil/perfil.service';
import { UsuarioService } from '../usuario.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Utils } from '../../../shared/utils.shared';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Usuario } from '../usuario.model';

@Component({
  selector: 'ngx-excluir-usuario',
  templateUrl: './excluir-usuario.component.html',
  styleUrls: ['./excluir-usuario.component.scss'],
  providers: [UsuarioService, PerfilService],
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
export class ExcluirUsuarioComponent implements OnInit {

  public perfis: Object;
  public lst_perfil: Object[];
  public usuario = new Usuario();
  public feedbackUsuario: string;
  public estado: string = 'visivel';
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public esc_id: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private perfilService: PerfilService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((usuario: Usuario) => {
      this.usuario = JSON.parse(usuario['usuario']);
    });
    this.esc_id = Utils.pegarDadosEscolaDetalhado().id;
    this.listarPerfis();
  }

  public listarPerfis(): void {
    this.feedbackUsuario = 'Carregando perfis...';
    const nivelPerfil = Utils.pegarDadosEscopo().nivel;
    this.perfilService
      .listar(nivelPerfil, this.esc_id)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.perfis = response;
      })
      .catch((erro: Response) => {
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
  }

  public excluir(): void {
    this.feedbackUsuario = 'Excluindo dados, aguarde...';
    this.usuarioService
      .excluir(this.usuario.id)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.router.navigate(['listar-usuario']);
      })
      .catch((erro: Response) => {
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
  }

  public listar(): void {
    this.router.navigate(['listar-usuario']);
  }

}
