import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';
import { CONSTANTES } from '../../../shared/constantes.shared';

@Component({
  selector: 'ngx-controlar-portaria',
  templateUrl: './controlar-portaria.component.html',
  styleUrls: ['./controlar-portaria.component.scss']
})
export class ControlarPortariaComponent implements OnInit {
  public dados_escola: Object;
  public esc_id: number;
  public inep: string;
  public anoAtual: number;
  //public stringModoPortariaSelecionado = "Selecione o modo de portaria";
  constructor(private firebaseService: FirebaseService) { }
  public arrayDePortariasControladas = new Array<Object>()

  ngOnInit() {
    this.dados_escola = JSON.parse(
      Utils.decriptAtoB(localStorage.getItem("dados_escola"), CONSTANTES.PASSO_CRIPT))[0];
    this.esc_id = parseInt(this.dados_escola["id"]);
    this.inep = this.dados_escola["inep"];
    this.anoAtual = (new Date()).getFullYear();
    this.listarPortariasControleRemoto();
  }


  /**
   *
   */
  public listarPortariasControleRemoto(): void {
    this.firebaseService.listarPortariaControleRemoto(this.inep).then((response: firebase.firestore.QuerySnapshot) => {
      response.docs.forEach((documento) => {
        this.arrayDePortariasControladas.push({ id: documento.id, dados: documento.data() });
      });
      this.ajustarCoresBotoesControleFuncaoPortaria(this.arrayDePortariasControladas);
    })
  }

  /**
   *
   * @param portarias
   */
  public ajustarCoresBotoesControleFuncaoPortaria(portarias: Object[]): void {
    const myInterval = setInterval(() => {
      portarias.forEach(portaria => {
        const nomep = portaria['dados']['nome'] + '_modoDePortaria';
        if (document.getElementById(nomep) != undefined) {
          if (portaria['dados']['modo'] == 'entrada') {
            document.getElementById(nomep).classList.remove('btn-danger');
            document.getElementById(nomep).classList.add('btn-primary');
          } else {
            document.getElementById(nomep).classList.remove('btn-primary');
            document.getElementById(nomep).classList.add('btn-danger');
          }
        }
      })
      clearInterval(myInterval);
    }, 100)
  }

  /**
   * Correção da hora da portaria
   * @param event Dados para gravação
   * @param id Id da portaria
   */
  public controlarAjusteHora(event: Event, id: number): void {
    const valor = parseInt((<HTMLInputElement>event.target).value);
    this.firebaseService.gravarAjusteHoraPortaria(this.inep, id.toString(), valor);
  }

  /**
   * Controla se atrasos serão considerados ocorrencias disciplinares
   * @param event Dados para gravação
   * @param id Id da portaria
   */
  public controlarStatusOcorrenciaAtraso(event: Event, id: number): void {
    const valor = (<HTMLInputElement>event.target).checked;
    this.firebaseService.gravarModoRegistroOcorrenciaAtrasoPortaria(this.inep, id.toString(), valor);
  }

  /**
   * Controla se estudante sem uniforme é considerada ocorrência disciplinar
  * @param event Dados para gravação
   * @param id Id da portaria
   */
  public controlarStatusOcorrenciaSemUniforme(event: Event, id: number): void {
    const valor = (<HTMLInputElement>event.target).checked;
    this.firebaseService.gravarModoRegistroOcorrenciaSemUniformePortaria(this.inep, id.toString(), valor);
  }

  /**
   * controla se portaria vai liberar saída sem controlar autorização
   * @param event Dados para gravação
   * @param id Id da portaria
   */
  public controlarStatusControleSaida(event: Event, id: number): void {
    const valor = (<HTMLInputElement>event.target).checked;
    this.firebaseService.gravarModoControlarSaidaPortaria(this.inep, id.toString(), valor);
  }

  /**
   *
   * @param event Dados para gravação
   * @param id Id da portaria
   */
  public selecionarModoPortaria(event: Event, id: number): void {
    const texto = (<HTMLInputElement>event.target).textContent;
    const valor = (<HTMLInputElement>event.target).name;
    const combo_id = (<HTMLInputElement>event.target).parentElement.parentElement.children[0].id;
    if (valor == 'saida') {
      document.getElementById(combo_id).classList.remove('btn-primary');
      document.getElementById(combo_id).classList.add('btn-danger');
    } else {
      document.getElementById(combo_id).classList.remove('btn-danger');
      document.getElementById(combo_id).classList.add('btn-primary');
    }
    this.arrayDePortariasControladas.map((portaria, idx, arr) => {
      if (portaria['id'] == id.toString()) {
        arr[idx]['dados']['modo'] = texto.toLowerCase();
      }
    })
    this.firebaseService.gravarModoPortaria(this.inep, id.toString(), valor);
  }

}
