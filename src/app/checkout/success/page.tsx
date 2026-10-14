import { CheckoutSuccessClient } from "./checkout-success-client";
type SearchParams = Promise<{ provider?: string; order_id?: string; token?: string; session_id?: string }>;
export default async function CheckoutSuccessPage({ searchParams }: { searchParams: SearchParams }) { const p=await searchParams; return <CheckoutSuccessClient provider={p.provider??null} orderId={p.order_id??null} paypalOrderId={p.token??null} sessionId={p.session_id??null}/>; }
