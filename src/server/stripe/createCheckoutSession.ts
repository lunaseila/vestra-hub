import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export interface VestraCheckoutItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image?: string;
}

export interface CreateCheckoutSessionBody {
  checkoutId: string;
  customerEmail: string;
  items: VestraCheckoutItem[];
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

function getStripe() {
  if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }
  return new Stripe(stripeSecretKey);
}

export async function createVestraCheckoutSession(
  body: CreateCheckoutSessionBody,
) {
  if (!body.items?.length) {
    throw new Error("Checkout session requires at least one item.");
  }
  if (!body.customerEmail) {
    throw new Error("Checkout session requires a customer email.");
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: body.customerEmail,
    success_url: `${body.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: body.cancelUrl,
    metadata: {
      checkoutId: body.checkoutId,
      source: "vestra_marketplace",
      ...(body.metadata ?? {}),
    },
    line_items: body.items.map((item) => ({
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: item.price,
        product_data: {
          name: `${item.brand} — ${item.name}`,
          metadata: { vestraItemId: item.id },
          images: item.image ? [item.image] : undefined,
        },
      },
    })),
  });

  return { id: session.id, url: session.url };
}

export async function createCheckoutSessionRequest(request: Request) {
  try {
    const body = (await request.json()) as CreateCheckoutSessionBody;
    const session = await createVestraCheckoutSession(body);
    return Response.json(session);
  } catch (error) {
    return new Response(
      error instanceof Error ? error.message : "Unable to create checkout session.",
      { status: 400 },
    );
  }
}
