export type PaymentProvider="stripe"|"paypal";
export type CreateCheckoutInput={orderId:string;amountMinor:number;currency:"GBP";successUrl:string;cancelUrl:string};
export type CheckoutSession={provider:PaymentProvider;providerSessionId:string;redirectUrl:string};
// Intentionally interface-only. Implement server-side provider adapters and verified webhooks before accepting payment.
export interface PaymentAdapter{createCheckout(input:CreateCheckoutInput):Promise<CheckoutSession>;verifyWebhook(rawBody:string,signature:string):Promise<{eventId:string;eventType:string;payload:unknown}>}
