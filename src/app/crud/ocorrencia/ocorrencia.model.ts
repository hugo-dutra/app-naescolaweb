import { MessageFirebase } from '../../shared/firebase/message.model';

export class Ocorrencia {
  public id: number;
  public ocorrencia: string;
  public data_hora: string;
  public tod_id: number;
  public est_id: number;
  public usr_id: number;
  public array_msg: Array<MessageFirebase>;
}
