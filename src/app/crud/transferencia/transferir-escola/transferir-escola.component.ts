import { Router } from '@angular/router';
import { EscolaService } from './../../escola/escola.service';
import { AlertModalService } from './../../../shared-module/alert-modal.service';
import { CONSTANTES } from './../../../shared/constantes.shared';
import { EstudanteService } from './../../estudante/estudante.service';
import { Utils } from './../../../shared/utils.shared';
import { Component, OnInit } from '@angular/core';
import { TurmaService } from '../../turma/turma.service';

@Component({
  selector: 'ngx-transferir-escola',
  templateUrl: './transferir-escola.component.html',
  styleUrls: ['./transferir-escola.component.scss'],
  providers: [TurmaService, EstudanteService, EscolaService]
})
export class TransferirEscolaComponent implements OnInit {
  private esc_id: number;
  public trm_id_selecionada = 0;
  public esc_id_destino_estudante = 0;
  private anoAtual: number;
  public arrayDeTurmas: Object[];
  public arrayDeEscolas: Object[];
  public exibirCampoFiltro: boolean = false;

  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public arrayDeEstudantesSelecionados = new Array<Object>();
  public arrayDeEstudantesNaTurma: Object[];
  public arrayDeReferenciaEstudantesNaTurma: Object[];

  constructor(private router: Router, private escolaService: EscolaService, private turmaService: TurmaService, private estudanteService: EstudanteService, private alertModalService: AlertModalService) { }

  ngOnInit() {
    this.carregarDados();
    this.listarTurmas();
  }

  public navegarGerenciarTransferencia(): void {
    this.router.navigate(['gerenciar-transferencia'])
  }

  public carregarDados(): void {
    this.esc_id = Utils.pegarDadosEscolaDetalhado().id;
    this.anoAtual = new Date().getFullYear();
  }

  public listarTurmas(): void {
    this.feedbackUsuario = 'Carregando turmas,aguarde...';
    this.turmaService.listarTodasAno(this.anoAtual, this.esc_id).toPromise().then((response: Response) => {
      this.arrayDeTurmas = Object.values(response);
      this.listarEscolas();
    })
  }

  public listarEscolas(): void {
    this.feedbackUsuario = 'Carregando escolas,aguarde...';
    this.escolaService.listar(5000, 0, true).toPromise().then((response: Response) => {
      this.arrayDeEscolas = Object.values(response);
      this.feedbackUsuario = undefined;
    });
  }

  public listarEstudantesTurmaSelecionada(event: Event): void {
    this.trm_id_selecionada = parseInt((<HTMLInputElement>event.target).value);
    if (this.trm_id_selecionada >= 0) {
      this.feedbackUsuario = 'Listando estudantes da turma selecionada, aguarde...';
      this.estudanteService.listarTurmaId(this.trm_id_selecionada).toPromise().then((response: Response) => {
        this.arrayDeEstudantesNaTurma = Object.values(response);
        this.arrayDeReferenciaEstudantesNaTurma = this.arrayDeEstudantesNaTurma;
        this.feedbackUsuario = undefined;
        this.exibirCampoFiltro = false;
      })
    } else {
      this.feedbackUsuario = 'Listando estudantes da turma selecionada, aguarde...';
      this.estudanteService.listar(5000, 0, true, this.esc_id).toPromise().then((response: Response) => {
        this.arrayDeEstudantesNaTurma = Object.values(response);
        this.arrayDeReferenciaEstudantesNaTurma = this.arrayDeEstudantesNaTurma;
        this.feedbackUsuario = undefined;
        this.exibirCampoFiltro = true;
      })
    }
  }

  public selecionarEscIdDestinoEstudante(event: Event): void {
    this.esc_id_destino_estudante = parseInt((<HTMLInputElement>event.target).value);
  }

  public transferirDeEscola(): void {
    if (this.validarDadosTransferencia()) {
      this.feedbackUsuario = 'Transferindo estudante, aguarde..';
      this.estudanteService.alterarEscola(this.arrayDeEstudantesSelecionados, this.esc_id_destino_estudante).toPromise().then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.limparDadosAposTranferencia();
      });
    }
  }

  public validarDadosTransferencia(): boolean {
    if (this.arrayDeEstudantesSelecionados.length > 0) {
      if (this.esc_id_destino_estudante > 0) {
        return true;
      } else {
        this.alertModalService.showAlertWarning('Selecione a escola de destino');
        return false;
      }
    } else {
      this.alertModalService.showAlertWarning('Selecione um ou mais estudantes');
      return false;
    }
  }

  public limparDadosAposTranferencia(): void {
    this.esc_id_destino_estudante = 0;
    this.arrayDeEstudantesSelecionados = [];
    this.arrayDeEstudantesNaTurma = [];
    this.listarTurmas();
  }

  public gravaEstudanteSelecionado(event: Event): void {
    const est_id = parseInt((<HTMLInputElement>event.target).value);
    const statusCheck = (<HTMLInputElement>event.target).checked;
    if (statusCheck) {
      if (this.filtrarEstudanteAdicionadoLista(est_id).length == 0) {
        const estudanteSelecionado = this.filtrarEstudantePorEstId(est_id);
        if (estudanteSelecionado.length > 0) {
          this.arrayDeEstudantesSelecionados.push(estudanteSelecionado[0]);
          this.arrayDeEstudantesSelecionados = this.removerCamposIndesejados();
        }
      }
    } else {
      this.arrayDeEstudantesSelecionados = this.removerEstudante(est_id);
      this.arrayDeEstudantesSelecionados = this.removerCamposIndesejados();
    }
  }

  public removerCamposIndesejados(): Object[] {
    return this.arrayDeEstudantesSelecionados.map((estudante) => {
      return { id: estudante['id'], nome: estudante['nome'], matricula: estudante['matricula'], foto: estudante['foto'] }
    })
  }

  public removerEstudante(est_id): Object[] {
    return this.arrayDeEstudantesSelecionados.filter((estudante) => {
      return estudante['id'] != est_id;
    });
  }

  public filtrarEstudantePorEstId(est_id: number): Object[] {
    return this.arrayDeEstudantesNaTurma.filter((estudante) => {
      return estudante['id'] == est_id;
    });
  }

  public filtrarEstudanteAdicionadoLista(est_id: number): Object[] {
    return this.arrayDeEstudantesSelecionados.filter((estudante) => {
      return estudante['id'] == est_id;
    });
  }

  public filtrarEstudantePorNome(event: Event): void {
    let valorFiltro = (<HTMLInputElement>event.target).value;
    let matrizRetorno = new Array<Object>();
    matrizRetorno = this.arrayDeEstudantesNaTurma.filter((elemento) => {
      return elemento["nome"].toLowerCase().indexOf(valorFiltro.toLocaleLowerCase()) != -1;
    })
    if (valorFiltro.length > 0) {
      this.arrayDeEstudantesNaTurma = matrizRetorno;
    } else {
      this.arrayDeEstudantesNaTurma = this.arrayDeReferenciaEstudantesNaTurma;
    }
  }

  public limparFiltro(event: KeyboardEvent): void {
    if (event.key == 'Backspace' || event.key == 'Delete') {
      setTimeout(() => {
        this.arrayDeEstudantesNaTurma = this.arrayDeReferenciaEstudantesNaTurma;
        this.feedbackUsuario = undefined;
        this.filtrarEstudantePorNome(event);
      }, 25)
    }
  }

}
