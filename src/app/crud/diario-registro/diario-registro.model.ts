import { ItemRegistroFrequenciaDiario } from "./item-registro-diario.model";

export class DiarioRegistro {
  public dip_id: number;
  public conteudo: string;
  public data: string;
  public aula_dupla: boolean;
  public arrayOfDadosFrequenciaEstudantes: Array<ItemRegistroFrequenciaDiario>;
}