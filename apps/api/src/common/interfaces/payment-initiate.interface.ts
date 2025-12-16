export interface KhaltiPayInitiateInterface {
  amount: number;
  purchase_order_id: string;
  purchase_order_name: string;
}

export interface EsewaPaymentInitiateInterface {
  total_amount: number;
  transaction_uuid: string;
  product_code: string;
}
