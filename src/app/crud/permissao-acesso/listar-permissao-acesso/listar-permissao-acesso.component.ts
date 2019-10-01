import { Component, OnInit } from '@angular/core';
import { PermissaoAcessoService } from '../permissao-acesso.service';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-listar-permissao-acesso',
  templateUrl: './listar-permissao-acesso.component.html',
  styleUrls: ['./listar-permissao-acesso.component.scss'],
  providers: [PermissaoAcessoService]
})
export class ListarPermissaoAcessoComponent implements OnInit {

  public permissoesAcessos: Object;
  constructor(
    private permissaoAcessoService: PermissaoAcessoService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router) { }

  ngOnInit() {
    this.listar();
  }

  public listar(): void {
    this.permissaoAcessoService
      .listar()
      .toPromise()
      .then((response: Response) => {
        console.log(response);
      }).catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
    //Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
      });
  }
}
