import { Component, OnInit } from '@angular/core';
import { PortariaService } from '../portaria.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { EstudanteService } from '../../estudante/estudante.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { CronogramaPortaria } from '../cronograma-portaria.model';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';
import { Portaria } from '../portaria.model';

@Component({
  selector: 'ngx-listar-portaria',
  templateUrl: './listar-portaria.component.html',
  styleUrls: ['./listar-portaria.component.scss'],
  providers: [PortariaService, FirebaseService, EstudanteService],
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
export class ListarPortariaComponent implements OnInit {

  public portarias: Object[];
  public cronogramasPortaria = new Array<CronogramaPortaria>();
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public esc_id: number;
  public sincronizaEstudantes: Boolean = false;
  public usr_id: number;
  public dataInferiorSincronizarDadosPortaria: string;
  public checkedValue: boolean = true;

  public exibirComponenteAlterar: Boolean = false;
  public exibirComponenteInserir: Boolean = false;
  public exibirComponenteInserirCronograma: Boolean = false;
  public exibirComponenteExcluir: Boolean = false;
  public exibirComponenteBaixarDados: Boolean = false;


  constructor(
    private portariaService: PortariaService,
    private alertModalService: AlertModalService,
    private router: Router,
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private estudanteService: EstudanteService) { }

  ngOnInit() {
    this.esc_id = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
    this.usr_id = parseInt(JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados"), CONSTANTES.PASSO_CRIPT))[0].id);
    this.dataInferiorSincronizarDadosPortaria = "2000-01-01";
    this.listar();
    this.exibirComponentesEdicao();
    this.sincronizaEstudantes = this.checkedValue;
  }

  public exibirComponentesEdicao(): void {
    this.exibirComponenteInserirCronograma = Utils.exibirComponente('inserir-cronograma-portaria');
    this.exibirComponenteAlterar = Utils.exibirComponente('alterar-portaria');
    this.exibirComponenteExcluir = Utils.exibirComponente('excluir-portaria');
    this.exibirComponenteBaixarDados = Utils.exibirComponente('baixar-dados-portaria');
  }

  public gerenciar(): void {
    this.router.navigate(['gerenciar-portaria']);
  }

  public listar(): void {
    this.feedbackUsuario = "Carregando portarias, aguarde...";
    this.portariaService.listar(this.esc_id)
      .toPromise()
      .then((response: Response) => {
        this.portarias = Object.values(response);
        this.feedbackUsuario = undefined;
      }).catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Gravar erros no analytics
        Utils.gravarErroAnalytics(JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      })
  }

  public adicionar(): void {
    this.router.navigate([`${this.route.parent.routeConfig.path}/inserir-portaria`]);
  }

  public sincronizar(portaria: Portaria): void {
    this.feedbackUsuario = "Sincronizando portaria...";
    this.firebaseService.gravarConfiguracaoFirebaseFirestorePortaria(portaria)
      .then(() => {
        this.gravarCronogramaPortaria(portaria);
      })
      .catch((erro) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Gravar erros no analytics
        Utils.gravarErroAnalytics(JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public baixarDadosPortaria(portaria: Portaria) {
    let arrayDeEntradas = new Array<Object>();
    let arrayDeSaidas = new Array<Object>();
    let arrayDeAtrasos = new Array<Object>();
    let arrayDeSemUniforme = new Array<Object>();
    const por_id = portaria["por_id"];
    const codigo_portaria = portaria["codigo"];
    this.feedbackUsuario = "Carregando entradas...";
    this.firebaseService.lerDadosFrequenciaEntradaPortaria(codigo_portaria, this.dataInferiorSincronizarDadosPortaria).then((querySnapshot: firebase.firestore.QuerySnapshot) => {
      querySnapshot.forEach(documento => {
        const data = documento.data()["data"];
        const hora = documento.data()["hora"];
        const est_id = documento.data()["est_id"];
        const firebaseDbKey = documento.id;
        arrayDeEntradas.push({ data: data, hora: hora, est_id: est_id, firebaseDbKey: firebaseDbKey });
      })
    }).then(() => {
      this.feedbackUsuario = "Carregando saídas...";
      this.firebaseService.lerDadosFrequenciaSaidaPortaria(codigo_portaria, this.dataInferiorSincronizarDadosPortaria).then((querySnapshot: firebase.firestore.QuerySnapshot) => {
        querySnapshot.forEach(documento => {
          const data = documento.data()["data"];
          const hora = documento.data()["hora"];
          const est_id = documento.data()["est_id"];
          const firebaseDbKey = documento.id;
          arrayDeSaidas.push({ data: data, hora: hora, est_id: est_id, firebaseDbKey: firebaseDbKey });
        })
      }).then(() => {
        this.feedbackUsuario = "Carregando atrasos...";
        this.firebaseService.lerDadosAtrasoPortaria(codigo_portaria).then((querySnapshot: firebase.firestore.QuerySnapshot) => {
          querySnapshot.forEach(documento => {
            const data = documento.data()["data"];
            const hora = documento.data()["hora"];
            const est_id = documento.data()["est_id"];
            const firebaseDbKey = documento.id;
            arrayDeAtrasos.push({ data: data, hora: hora, est_id: est_id, firebaseDbKey: firebaseDbKey });
          })
        })
      }).then(() => {
        this.feedbackUsuario = "Carregando ocorrencias de uniforme...";
        this.firebaseService.lerDadosSemUniformePortaria(codigo_portaria).then((querySnapshot: firebase.firestore.QuerySnapshot) => {
          querySnapshot.forEach(documento => {
            const data = documento.data()["data"];
            const hora = documento.data()["hora"];
            const est_id = documento.data()["est_id"];
            const firebaseDbKey = documento.id;
            arrayDeSemUniforme.push({ data: data, hora: hora, est_id: est_id, firebaseDbKey: firebaseDbKey });
          })
        }).then(() => {
          this.inserirDadosDaPortariaBancoDeDados(arrayDeEntradas, arrayDeSaidas, arrayDeAtrasos, arrayDeSemUniforme, por_id, portaria);
        }).catch((erro: Response) => {
          //Mostra modal
          this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
          //registra log de erro no firebase usando serviço singlenton
          this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
          //Gravar erros no analytics
          Utils.gravarErroAnalytics(JSON.stringify(erro));
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });
        })
      }).catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Gravar erros no analytics
        Utils.gravarErroAnalytics(JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
      })
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
      //Gravar erros no analytics
      Utils.gravarErroAnalytics(JSON.stringify(erro));
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
    })
  }

  public inserirDadosDaPortariaBancoDeDados(entradas: Object[], saidas: Object[], atrasos: Object[], semUniforme: Object[], por_id: number, portaria: Portaria) {
    this.feedbackUsuario = "Gravando entradas no banco de dados...";
    this.portariaService.inserirEntradas(por_id, entradas).toPromise()
      .then(() => {
        this.feedbackUsuario = "Gravando saídas no banco de dados...";
        this.portariaService.inserirSaidas(por_id, saidas).toPromise()
          .then(() => {
            this.feedbackUsuario = "Gravando atrasos no banco de dados...";
            this.portariaService.inserirAtrasos(this.usr_id, this.esc_id, atrasos).toPromise()
              .then(() => {
                this.feedbackUsuario = "Gravando sem uniforme no banco de dados...";
                this.portariaService.inserirSemUniforme(this.usr_id, this.esc_id, semUniforme).toPromise()
                  .then(() => {
                    this.feedbackUsuario = "Atualizando cronograma...";
                    this.gravarCronogramaPortaria(portaria);
                    //this.sincronizar(portaria);
                  }).catch((erro: Response) => {
                    //Mostra modal
                    this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
                    //registra log de erro no firebase usando serviço singlenton
                    this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
                    //Gravar erros no analytics
                    Utils.gravarErroAnalytics(JSON.stringify(erro));
                    //Caso token seja invalido, reenvia rota para login
                    Utils.tratarErro({ router: this.router, response: erro });
                    this.feedbackUsuario = undefined;
                  })
              }).catch((erro: Response) => {
                //Mostra modal
                this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
                //registra log de erro no firebase usando serviço singlenton
                this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
                //Gravar erros no analytics
                Utils.gravarErroAnalytics(JSON.stringify(erro));
                //Caso token seja invalido, reenvia rota para login
                Utils.tratarErro({ router: this.router, response: erro });
                this.feedbackUsuario = undefined;
              })
          }).catch((erro: Response) => {
            //Mostra modal
            this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
            //registra log de erro no firebase usando serviço singlenton
            this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
            //Gravar erros no analytics
            Utils.gravarErroAnalytics(JSON.stringify(erro));
            //Caso token seja invalido, reenvia rota para login
            Utils.tratarErro({ router: this.router, response: erro });
            this.feedbackUsuario = undefined;
          })
      }).catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Gravar erros no analytics
        Utils.gravarErroAnalytics(JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      })
  }

  public gravarCronogramaPortaria(portaria: Portaria): void {
    this.portariaService.listarCronogramaPortaria(portaria.por_id).toPromise().then((response: Response) => {
      this.cronogramasPortaria = Object.values(response);
      if (this.cronogramasPortaria.length > 0) {
        let contaSincronizados = 0;
        const gravacao = new Promise((resolve) => {
          this.cronogramasPortaria.forEach((cronogramaPortaria) => {
            let cronogramaAtual = new CronogramaPortaria();
            cronogramaAtual.crpId = cronogramaPortaria['crp_id'];
            cronogramaAtual.codigoPortaria = cronogramaPortaria['codigo_portaria'];
            cronogramaAtual.horarioInicio = cronogramaPortaria['horario_inicio'];
            cronogramaAtual.horarioFim = cronogramaPortaria['horario_fim'];
            cronogramaAtual.modoPortaria = cronogramaPortaria['modo_portaria'];
            this.firebaseService.gravarCronogramaFirebaseFirestorePortaria(cronogramaAtual)
              .then(() => {
                contaSincronizados += 1;
                if (contaSincronizados == this.cronogramasPortaria.length) {
                  resolve('ok');
                  this.feedbackUsuario = undefined;
                } else {
                  this.feedbackUsuario = `Sincronizando cronograma ${contaSincronizados} de ${this.cronogramasPortaria.length}`;
                }
              }).catch((erro: Response) => {
                //registra log de erro no firebase usando serviço singlenton
                this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
                //Gravar erros no analytics
                Utils.gravarErroAnalytics(JSON.stringify(erro));
                //Caso token seja invalido, reenvia rota para login
                Utils.tratarErro({ router: this.router, response: erro });
              })
          })
        });
        gravacao.then(() => {
          this.feedbackUsuario = undefined;
          if (this.sincronizaEstudantes) {
            this.gravarEstudantes(portaria.codigo);
          }
        }).catch((erro: Response) => {
          //Mostra modal
          this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
          //registra log de erro no firebase usando serviço singlenton
          this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
          //Gravar erros no analytics
          Utils.gravarErroAnalytics(JSON.stringify(erro));
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });
          this.feedbackUsuario = undefined;
        })
      } else {
        this.feedbackUsuario = undefined;
        if (this.sincronizaEstudantes) {
          this.gravarEstudantes(portaria.codigo);
        }
      }
    });
  }

  public sincronizarEstudantes(event: Event): void {
    this.checkedValue = (<HTMLInputElement>event.target).checked;
    this.sincronizaEstudantes = this.checkedValue;
  }

  public gravarEstudantes(codigoPortaria: string): void {
    this.feedbackUsuario = 'Sincronizando estudantes, aguarde...';
    let estudantes = null;
    this.estudanteService.listarEstudantesAplicativo(this.esc_id).toPromise().then((retorno) => {
      estudantes = Object.values(retorno);
      let parteArray = 0;
      const tamanhoDocumento = 500;
      while (estudantes.length) {
        const pedaco = estudantes.splice(0, tamanhoDocumento);
        this.firebaseService.gravarListagemEstudantesPortariaDocumentoUnico(pedaco, codigoPortaria, parteArray).then(() => {
          if (this.feedbackUsuario != undefined) {
            this.alertModalService.showAlertSuccess('Operação finalizada com sucesso!');
            this.feedbackUsuario = undefined;
          }
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
        parteArray++;
      }
    })
  }

  public alterar(portaria: Portaria): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        portaria: JSON.stringify(portaria)
      }
    }
    this.router.navigate([`${this.route.parent.routeConfig.path}/alterar-portaria`], navigationExtras);
  }

  public excluir(portaria: Portaria): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        portaria: JSON.stringify(portaria),
      }
    }
    this.router.navigate([`${this.route.parent.routeConfig.path}/excluir-portaria`], navigationExtras);
  }

  public inserirCronograma(portaria: Portaria): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        por_id: portaria.por_id,
        nome: portaria.nome
      }
    }
    this.router.navigate([`${this.route.parent.routeConfig.path}/inserir-cronograma-portaria`], navigationExtras);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

}
