import { Component, OnInit } from '@angular/core';
import { EstudanteService } from '../estudante.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Estudante } from '../estudante.model';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-excluir-estudante',
  templateUrl: './excluir-estudante.component.html',
  styleUrls: ['./excluir-estudante.component.scss'],
  providers: [EstudanteService],
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
export class ExcluirEstudanteComponent implements OnInit {

  public estudante = new Estudante();
  public estado: string = "visivel";
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public msg_status: boolean;
  public ativo: boolean;

  public tipos_sanguineos: Array<string>;

  public formulario = new FormGroup({
    id: new FormControl(null),
    nome: new FormControl(null),
    matricula: new FormControl(null),
    pai: new FormControl(null),
    mae: new FormControl(null),
    responsavel: new FormControl(null),
    email: new FormControl(null),
    endereco: new FormControl(null),
    tipo_sanguineo: new FormControl(null),
    envio_msg_status: new FormControl(null),
    status_ativo: new FormControl(null),
    nascimento: new FormControl(null),
    foto: new FormControl(null)
  });

  constructor(
    private estudanteService: EstudanteService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,

    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.tipos_sanguineos = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    this.route.queryParams.subscribe((estudante: Estudante) => {
      this.estudante = JSON.parse(estudante["estudante"]);
      this.msg_status = this.estudante.envio_msg_status == 1 ? true : false;
      this.ativo = this.estudante.status_ativo == 1 ? true : false;
    });
  }

  public excluir(): void {
    this.feedbackUsuario = "Salvando dados, aguarde...";
    this.estudanteService
      .excluir(this.estudante.id)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.router.navigateByUrl("listar-estudante");
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.exibirAlerta = true;
        this.feedbackUsuario = undefined;
      });
  }

  public listar(): void {
    this.router.navigate([`listar-estudante`]);
  }


}
