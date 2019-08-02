export class BoletoBancario {
  code: number;
  reference: string;
  dueDate: string;
  checkoutUrl: string;
  link: string;
  installmentLink: string;
  payNumber: string;
  bankAccount: string;
  ourNumber: string;
  barcodeNumber: string;
  portfolio: string;
}

/* Retorno quando boleto é gerado.... usar para construção desse modelo.
{
  "data": {
      "charges": [
          {
              "code": 30197708,
              "reference": "",
              "dueDate": "03/12/2018",
              "checkoutUrl": "https://sandbox.boletobancario.com/boletofacil/checkout/47B97FE0FBE31666662C5D183D0A2562EB3749F27EF0A7DA",
              "link": "https://sandbox.boletobancario.com/boletofacil/charge/boleto.pdf?token=364360:m:a941ad5006b41446f80d0e925d6e8d1947c091f267378048cc571ab837bb7b01",
              "installmentLink": "https://sandbox.boletobancario.com/boletofacil/charge/boleto.pdf?token=30197708:02c1a29adebee8b5a051ecfefe58390e2b9931b2c41d62188af26fa843667642",
              "payNumber": "BOLETO TESTE - Não é válido para pagamento",
              "billetDetails": {
                  "bankAccount": "0655/46480-8",
                  "ourNumber": "176/30197708-9",
                  "barcodeNumber": "34193772700000012751763019770890655464808000",
                  "portfolio": "176"
              }
          }
      ]
  },
  "success": true
}


*/