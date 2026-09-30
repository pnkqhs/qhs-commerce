import 'server-only';
export type PaymentMethod = 'COD' | 'BANK_TRANSFER' | 'PAYOS';
export interface PaymentProvider {
  createPayment(input: {
    orderId: string;
    amount: number;
    currency: 'VND';
    idempotencyKey: string;
  }): Promise<{ reference: string; checkoutUrl?: string }>;
  verifyPayment(
    reference: string,
  ): Promise<{ status: 'PENDING' | 'PAID' | 'FAILED'; amount: number }>;
  handleWebhook(
    rawBody: string,
    signature: string,
  ): Promise<{ eventId: string; reference: string; amount: number }>;
}
/** Fail closed until the selected provider and its webhook verification are implemented in Phase 2. */
export function getPaymentProvider(method: PaymentMethod): PaymentProvider {
  void method;
  throw new Error('Thanh toán trực tuyến chưa được bật.');
}
