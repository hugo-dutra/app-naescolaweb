import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../perfil.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Utils } from '../../../shared/utils.shared';
import { Perfil } from '../perfil.model';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';

@Component({
  selector: 'ngx-alterar-perfil',
  templateUrl: './alterar-perfil.component.html',
  styleUrls: ['./alterar-perfil.component.scss'],
  providers: [PerfilService],
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

export class AlterarPerfilComponent implements OnInit {

  public perfil = new Perfil();
  public feedbackUsuario: string;
  public escoposPerfil = new Array<Object>();
  public estado: string = 'visivel';
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public escopoSelecionado: Object;
  public stringEscopoSelecionado: string = 'Selecione o escopo';
  public escopoUsuario: Object;

  public formulario = new FormGroup({
    id: new FormControl(null),
    nome: new FormControl(null),
  });

  constructor(
    private router: Router,
    private perfilService: PerfilService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((perfil: Perfil) => {
      this.perfil = JSON.parse(perfil['perfil']);
    });
    this.escopoUsuario = Utils.pegarDadosEscopo();
    this.listarEscopoPerfil();

  }

  public listarEscopoPerfil(): void {
    this.feedbackUsuario = 'Carregando escopos de acesso, acesso...';
    this.perfilService.listarEscopoPerfil().toPromise().then((response: Response) => {
      this.escoposPerfil = Object.values(response).filter((escopo) => {
        return escopo['nivel'] <= this.escopoUsuario['nivel'];
      });
      this.feedbackUsuario = undefined;
      this.stringEscopoSelecionado = this.perfil.escopo;
    });
  }

  public selecionarEscopo(escopo: Object): void {
    this.escopoSelecionado = escopo;
    this.stringEscopoSelecionado = this.escopoSelecionado['nome'];
    this.perfil.epu_id = parseInt(this.escopoSelecionado['epu_id'], 10);
  }


  public alterar(): void {
    this.feedbackUsuario = 'Salvando dados, aguarde...';
    if (this.validarEntrada()) {
      this.perfilService
        .alterar(this.perfil)
        .toPromise()
        .then((response: Response) => {
          this.feedbackUsuario = undefined;
          this.listar();
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
  }

  public listar(): void {
    this.router.navigateByUrl('listar-perfil');
  }

  public validarEntrada(): boolean {
    if (this.perfil != null && this.perfil.nome != null) {
      if (this.perfil.nome.trim() != '' && this.perfil.epu_id > 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  public modificarInputs(event: Event) {
    const campo: string = (<HTMLInputElement>event.target).name;
    const valor: string = (<HTMLInputElement>event.target).value;
    this.perfil[campo] = valor;
    this.validar(event);
  }

  public validar(event: Event) {
    Utils.validarCampos({ event: event });
    this.exibirAlerta = false;
  }

}
