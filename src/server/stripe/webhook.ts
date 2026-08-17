import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

function getStripe() {
  if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }
  return new Stripe(stripeSecretKey);
}

export interface VestraPaymentEvent {
  checkoutId?: string;
  stripeSessionId?: string;
  paymentStatus: "succeeded" | "failed" | "cancelled" | "pending";
  orderStatus: "confirmed" | "pending_payment" | "cancelled";
  customerEmail?: string | null;
}

export async function verifyStripeWebhook(
  rawBody: string | Buffer,
  signature: string | null,
) {
  if (!stripeWebhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured.");
  }
  if (!signature) {
    throw new Error("Stripe webhook signature is missing.");
  }

  const stripe = getStripe();
  const event = stripe.webhooks.constructEvent(
    rawBody,
    signature,
    stripeWebhookSecret,
  );

  return mapStripeEventToVestraPaymentEvent(event);
}

export function mapStripeEventToVestraPaymentEvent(
  event: Stripe.Event,
): VestraPaymentEvent | null {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    return {
      checkoutId: session.metadata?.checkoutId,
      stripeSessionId: session.id,
      paymentStatus: "succeeded",
      orderStatus: "confirmed",
      customerEmail: session.customer_email,
    };
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    return {
      checkoutId: session.metadata?.checkoutId,
      stripeSessionId: session.id,
      paymentStatus: "cancelled",
      orderStatus: "cancelled",
      customerEmail: session.customer_email,
    };
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    return {
      stripeSessionId: typeof intent.id === "string" ? intent.id : undefined,
      paymentStatus: "failed",
      orderStatus: "pending_payment",
    };
  }

  return null;
}

export async function stripeWebhookRequest(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");
    const vestraEvent = await verifyStripeWebhook(rawBody, signature);

    // Deployment-specific work belongs here:
    // 1. Look up the checkout/order draft by checkoutId.
    // 2. Create or update the order in the backend.
    // 3. Queue transactional emails.
    // 4. Persist payment status and Stripe identifiers.
    return Response.json({ received: true, vestraEvent });
  } catch (error) {
    return new Response(
      error instanceof Error ? error.message : "Webhook verification failed.",
      { status: 400 },
    );
  }
}
