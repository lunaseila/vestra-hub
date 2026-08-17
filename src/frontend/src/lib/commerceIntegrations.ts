export const SERVER_ENVIRONMENT_REQUIREMENTS = {
  stripeSecretKey: "STRIPE_SECRET_KEY",
  stripeWebhookSecret: "STRIPE_WEBHOOK_SECRET",
  emailApiKey: "VESTRA_EMAIL_API_KEY",
  emailFromAddress: "VESTRA_EMAIL_FROM",
  shippingProviderApiKey: "VESTRA_SHIPPING_API_KEY",
  crmApiKey: "VESTRA_CRM_API_KEY",
} as const;

export const CLIENT_ENVIRONMENT_REQUIREMENTS = {
  stripePublishableKey: "VITE_STRIPE_PUBLISHABLE_KEY",
  checkoutApiBaseUrl: "VITE_CHECKOUT_API_BASE_URL",
  publicSiteUrl: "VITE_PUBLIC_SITE_URL",
} as const;

export function getCommerceIntegrationStatus() {
  const env = import.meta.env;
  return {
    stripeClientConfigured: Boolean(env.VITE_STRIPE_PUBLISHABLE_KEY),
    checkoutApiConfigured: Boolean(env.VITE_CHECKOUT_API_BASE_URL),
    publicSiteUrl: env.VITE_PUBLIC_SITE_URL || "https://www.vestra.space",
    serverRequirements: SERVER_ENVIRONMENT_REQUIREMENTS,
    clientRequirements: CLIENT_ENVIRONMENT_REQUIREMENTS,
  };
}

export function getStripeConfigurationMessage() {
  const status = getCommerceIntegrationStatus();
  if (status.stripeClientConfigured && status.checkoutApiConfigured) {
    return "Stripe client configuration detected. Server-side payment intent/session and webhook endpoints must also be deployed.";
  }
  return "Stripe requires VITE_STRIPE_PUBLISHABLE_KEY, VITE_CHECKOUT_API_BASE_URL, STRIPE_SECRET_KEY, and STRIPE_WEBHOOK_SECRET before live payments can be enabled.";
}

export interface StripeCheckoutLineItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image?: string;
}

export interface CreateStripeCheckoutSessionInput {
  checkoutId: string;
  items: StripeCheckoutLineItem[];
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export class StripeConfigurationError extends Error {
  constructor(message = getStripeConfigurationMessage()) {
    super(message);
    this.name = "StripeConfigurationError";
  }
}

export async function createStripeCheckoutSession(
  input: CreateStripeCheckoutSessionInput,
) {
  const status = getCommerceIntegrationStatus();
  if (!status.checkoutApiConfigured) {
    throw new StripeConfigurationError();
  }

  const response = await fetch(
    `${String(import.meta.env.VITE_CHECKOUT_API_BASE_URL).replace(/\/$/, "")}/stripe/create-checkout-session`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      message ||
        "Unable to create a Stripe Checkout session. Please try again.",
    );
  }

  const payload = (await response.json()) as { url?: string };
  if (!payload.url) {
    throw new Error("Stripe Checkout session did not return a redirect URL.");
  }
  return payload.url;
}
