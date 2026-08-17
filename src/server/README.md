# Vestra server integration layer

These modules are intentionally server-only. Do not import them into the Vite
client bundle.

## Stripe

Mount:

- `POST /stripe/create-checkout-session` -> `createCheckoutSessionRequest`
- `POST /stripe/webhook` -> `stripeWebhookRequest`

Required server environment:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Frontend uses only:

- `VITE_CHECKOUT_API_BASE_URL`

The webhook is the production source of truth for successful payment. It should
create or update the backend order, persist the Stripe session/payment intent,
and queue order/payment emails.

## Email

Recommended provider for Vestra: Resend, because it is simple to configure,
supports verified domains, and has a small server SDK.

Mount:

- `POST /email/send-transactional` -> `sendTransactionalEmailRequest`

Required server environment:

- `VESTRA_EMAIL_API_KEY`
- `VESTRA_EMAIL_FROM`

## Shipping and storage

Shipping rates, labels, tracking, and image uploads require provider-specific
adapters. The current frontend/backend data model is ready to store:

- shipping address
- billing address
- shipping method
- shipping cost
- tracking number
- order status
- uploaded image references

Do not hardcode rates, tracking values, or logistics copy.
