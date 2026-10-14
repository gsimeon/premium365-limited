const base = process.env.PAYPAL_API_BASE || (process.env.NODE_ENV === "production" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com");
export async function paypalAccessToken() {
  const id = process.env.PAYPAL_CLIENT_ID; const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) throw new Error("PayPal credentials are not configured.");
  const response = await fetch(`${base}/v1/oauth2/token`, { method: "POST", headers: { Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" }, body: "grant_type=client_credentials", cache: "no-store" });
  if (!response.ok) throw new Error("Could not authenticate with PayPal.");
  const data = await response.json(); return data.access_token as string;
}
export async function paypalRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await paypalAccessToken(); const response = await fetch(`${base}${path}`, { ...init, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(init.headers || {}) }, cache: "no-store" });
  const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(typeof data.message === "string" ? data.message : "PayPal request failed."); return data as T;
}
