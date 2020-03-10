import { ItemPedido } from './item-pedido.model';

export class PedidoCartao {
  public usr_id: number;
  public esc_id: number;
  public itensPedido: Array<ItemPedido>;
  public total: number;
  public quantidade: number;
}
