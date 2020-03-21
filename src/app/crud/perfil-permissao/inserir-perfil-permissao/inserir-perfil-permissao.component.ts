import { Component, OnInit } from '@angular/core';
import { PerfilPermissaoService } from '../perfil-permissao.service';
import { PerfilService } from '../../perfil/perfil.service';
import { PermissaoAcessoService } from '../../permissao-acesso/permissao-acesso.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { PerfilPermissao } from '../perfil-permissao.model';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-inserir-perfil-permissao',
  templateUrl: './inserir-perfil-permissao.component.html',
  styleUrls: ['./inserir-perfil-permissao.component.scss'],
  providers: [PerfilPermissaoService, PerfilService, PermissaoAcessoService],
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
export class InserirPerfilPermissaoComponent implements OnInit {

  public perfis = new Array<Object>();
  public permissoesExistentes = new Array<Object>();
  public pru_id: number;
  public permissoesPerfilSelecionado: Object;
  public permissoesSelecionadas = new Array<PerfilPermissao>();
  public feedbackUsuario: string;
  public estado: string = 'visivel';
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public esc_id: number;

  public formulario = new FormGroup({
    pru_id: new FormControl(null),
    pac_id: new FormControl(null),
  });

  constructor(
    private perfilPermissaoService: PerfilPermissaoService,
    private perfilService: PerfilService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private permissaoAcessoService: PermissaoAcessoService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.esc_id = Utils.pegarDadosEscolaDetalhado().id;
    this.listarPerfisEPermissoes();
  }

  public listarPermissaoAcessoPerfilUsuario(event: Event): void {
    this.limparChecks(event);
    this.pru_id = this.formulario.value.pru_id;
    this.feedbackUsuario = 'Carregando dados, aguarde...';
    this.perfilPermissaoService
      .listarPermissaoAcesso(this.pru_id)
      .toPromise()
      .then((response: Response) => {
        this.permissoesPerfilSelecionado = response;
        const checkedItems = (<HTMLInputElement>event.target).form;
        for (let item = 0; item < checkedItems.length; item++) {
          // tslint:disable-next-line: forin
          for (const pSelecionado in this.permissoesPerfilSelecionado) {
            const pac_id: number = this.permissoesPerfilSelecionado[pSelecionado][
              'pac_id'
            ];
            const id: number = parseInt((<HTMLInputElement>checkedItems[item]).name, 10);
            if (pac_id === id) {
              (<HTMLInputElement>checkedItems[item]).checked = true;
            }
          }
        }
        this.feedbackUsuario = undefined;
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

  public limparChecks(event: Event) {
    const checkedItems = (<HTMLInputElement>event.target).form;
    for (let item = 0; item < checkedItems.length; item++) {
      (<HTMLInputElement>checkedItems[item]).checked = false;
    }
  }

  public listarPerfis(): void {
    this.formulario.reset();
    this.feedbackUsuario = 'Carregando dados, aguarde...';
    const nivelPerfil = Utils.pegarDadosEscopo().nivel;
    this.perfilService
      .listar(nivelPerfil, this.esc_id)
      .toPromise()
      .then((response: Response) => {
        this.perfis = Object.values(response);
      })
      .then(() => {
        this.listarPermissoes();
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

  public listarPermissoes(): void {
    this.permissaoAcessoService
      .listar()
      .toPromise()
      .then((response: Response) => {
        const permissoesUsuario = Object.values(Utils.verificarPermissoes());
        const permissoesTotais = Object.values(response);
        this.permissoesExistentes = permissoesTotais.filter(
          (set => a => true === set.has(a['rota']))(new Set(permissoesUsuario.map(b => b['rota']))),
        );
        this.feedbackUsuario = undefined;
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

  public findIndex(
    objetos: PerfilPermissao[],
    objeto: PerfilPermissao,
  ): number {
    for (let i = 0; i < objetos.length; i++) {
      if (objetos[i].pac_id === objeto.pac_id) {
        return i;
      }
    }
  }

  public inserir(event: Event): void {
    this.exibirAlerta = false;
    this.permissoesSelecionadas = [];
    this.feedbackUsuario = 'Gravando dados, aguarde...';
    const checkedItems = (<HTMLInputElement>event.target).form;
    for (let item = 0; item < checkedItems.length; item++) {
      if ((<HTMLInputElement>checkedItems[item]).checked) {
        const perfilPermissao = new PerfilPermissao();
        if (!isNaN(parseInt((<HTMLInputElement>checkedItems[item]).name, 10))) {
          perfilPermissao.pac_id = parseInt((<HTMLInputElement>checkedItems[item]).name, 10);
          this.permissoesSelecionadas.push(perfilPermissao);
        }
      }
    }

    this.pru_id = this.formulario.value.pru_id;
    this.perfilPermissaoService
      .inserir(this.pru_id, this.permissoesSelecionadas)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.formulario.reset();
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
        this.exibirAlerta = true;
        this.feedbackUsuario = undefined;
      });
  }

  public selecionarTodos(event: Event) {
    const checkBoxes = (<HTMLInputElement>event.target).form;
    for (let i = 0; i < checkBoxes.length; i++) {
      if ((<HTMLInputElement>event.target).checked) {
        const perfilPermissao = new PerfilPermissao();
        if (!isNaN(parseInt((<HTMLInputElement>checkBoxes[i]).name, 10))) {
          (<HTMLInputElement>checkBoxes[i]).checked = (<HTMLInputElement>event.target).checked;
        }
      } else {
        (<HTMLInputElement>checkBoxes[i]).checked = (<HTMLInputElement>event.target).checked;
      }
    }
  }

  public listarPerfisEPermissoes() {
    this.listarPerfis();
  }

  public listarPerfil(): void {
    this.router.navigate(['listar-perfil']);
  }

}
