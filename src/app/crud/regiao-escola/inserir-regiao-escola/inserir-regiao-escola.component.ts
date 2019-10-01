import { Component, OnInit } from '@angular/core';
import { RegiaoEscolaService } from '../regiao-escola.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';
import { RegiaoEscola } from '../regiao-escola.model';
import { FormGroup, FormControl } from '@angular/forms';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-inserir-regiao-escola',
  templateUrl: './inserir-regiao-escola.component.html',
  styleUrls: ['./inserir-regiao-escola.component.scss'],
  providers: [RegiaoEscolaService],
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
export class InserirRegiaoEscolaComponent implements OnInit {

  constructor(
    private regiaoEscolaService: RegiaoEscolaService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router
  ) { }
  public regiaoEscola = new RegiaoEscola();
  public regioesEscolas: Object;
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta = false;
  public formulario = new FormGroup({
    id: new FormControl(null),
    nome: new FormControl(null),
    abreviatura: new FormControl(null),
    uf: new FormControl(null)
  });

  ngOnInit() { }


  public modificar(): void { }

  public inserir(): void {
    this.regiaoEscola.id = this.formulario.value.id;
    this.regiaoEscola.nome = this.formulario.value.nome;
    this.regiaoEscola.abreviatura = this.formulario.value.abreviatura;
    this.regiaoEscola.uf = this.formulario.value.uf;

    this.feedbackUsuario = "Salvando dados, aguarde...";
    this.regiaoEscolaService
      .inserir(this.regiaoEscola)
      .toPromise()
      .then((response: Response) => {
        this.formulario.reset();
        this.feedbackUsuario = undefined;
        this.router.navigateByUrl("listar-regiao-escola");
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

  public enviarArquivo(event: Event): void { }

  public excluir(): void { }

  public listar() {
    this.router.navigateByUrl("listar-regiao-escola");
  }

  public listarObjeto(): Object {
    return new RegiaoEscola();
  }

  public listarObjetos(): Object[] {
    return null;
  }

  public validar(event: Event) {
    Utils.validarCampos({ event: event });
    this.exibirAlerta = false;
  }


}
