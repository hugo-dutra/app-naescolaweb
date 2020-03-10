export class ResultadoEstudante {
  public est_id: number;
  public estudante: string;
  public foto: string;
  public notaFaltasdisciplinas = new Array<NotaFaltasDisciplinaEstudante>();
}

export class NotaFaltasDisciplinaEstudante {
  public descricao_abv: string;
  public descricao: string;
  public nota: number;
  public faltas: number;
}
