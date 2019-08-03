import { DiarioAvaliacaoNotaEstudante } from "./diario-avaliacao-nota-estudante.model";

export class DiarioAvaliacao {
  public dav_id: number;
  public metodologia: string;
  public objetivo: string;
  public data_avaliacao: string;
  public dip_id: number;
  public valor: number;
  public prl_id: number;
  public peso: number;
  public estudantes_avaliados: Array<DiarioAvaliacaoNotaEstudante>;
}
