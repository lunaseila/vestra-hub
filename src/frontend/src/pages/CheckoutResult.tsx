import { useMarketplace } from "@/context/MarketplaceContext";
import type { MarketplaceOrder } from "@/context/MarketplaceContext";
import { Link, useSearch } from "@tanstack/react-router";
import { CheckCircle, CircleAlert, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

type CheckoutResultKind = "success" | "cancelled" | "failed";

const COPY: Record<
  CheckoutResultKind,
  { eyebrow: string; title: string; body: string }
> = {
  success: {
    eyebrow: "Payment Confirmed",
    title: "Your piece is reserved.",
    body: "Stripe returned a successful checkout session. The deployment webhook must still verify and persist the payment server-side before fulfillment.",
  },
  cancelled: {
    eyebrow: "Checkout Cancelled",
    title: "Your bag is still waiting.",
    body: "No payment was captured. Return to checkout when you are ready.",
  },
  failed: {
    eyebrow: "Payment Failed",
    title: "The payment could not be completed.",
    body: "No order has been confirmed. Please retry checkout or contact Vestra if the issue persists.",
  },
};

export default function CheckoutResult({
  result,
}: { result: CheckoutResultKind }) {
  const search = useSearch({ strict: false }) as { session_id?: string };
  const { completeCheckoutDraft, pendingCheckout } = useMarketplace();
  const [order, setOrder] = useState<MarketplaceOrder | null>(null);
  const [message, setMessage] = useState("");
  const copy = COPY[result];

  useEffect(() => {
    if (result !== "success") return;
    if (!search.session_id) {
      setMessage("Stripe did not return a checkout session id.");
      return;
    }
    const completed = completeCheckoutDraft({
      sessionId: search.session_id,
      paymentStatus: "succeeded",
    });
    setOrder(completed);
    if (!completed) {
      setMessage(
        "No local pending checkout was found. If webhook deployment is configured, check the server order record.",
      );
    }
  }, [completeCheckoutDraft, result, search.session_id]);

  const isSuccess = result === "success";

  return (
    <div
      data-ocid={`checkout_result.${result}.page`}
      style={{ minHeight: "100vh", background: "#ffffff", color: "#111111" }}
    >
      <section
        style={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(3rem, 7vw, 6rem) clamp(1.25rem, 5vw, 5rem)",
        }}
      >
        <div style={{ maxWidth: "680px", textAlign: "center" }}>
          {isSuccess ? (
            <CheckCircle size={42} strokeWidth={1.3} />
          ) : (
            <CircleAlert size={42} strokeWidth={1.3} />
          )}
          <p
            style={{
              marginTop: "1.5rem",
              fontSize: "0.7rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#888888",
            }}
          >
            {copy.eyebrow}
          </p>
          <h1
            style={{
              marginTop: "0.75rem",
              fontSize: "clamp(2.2rem, 5vw, 4.5rem)",
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            {copy.title}
          </h1>
          <p
            style={{
              margin: "1.5rem auto 0",
              color: "#555555",
              lineHeight: 1.75,
              maxWidth: "520px",
            }}
          >
            {copy.body}
          </p>

          {order && (
            <div
              style={{
                margin: "2rem auto 0",
                border: "1px solid #111111",
                padding: "1rem",
                textAlign: "left",
                maxWidth: "420px",
              }}
            >
              <p style={{ fontSize: "0.68rem", color: "#888888" }}>
                Order reference
              </p>
              <p style={{ fontSize: "1.2rem", marginTop: "0.25rem" }}>
                {order.orderNumber}
              </p>
              <p style={{ color: "#666666", marginTop: "0.5rem" }}>
                Payment: {order.paymentStatus} · Status: {order.status}
              </p>
            </div>
          )}

          {message && (
            <p role="alert" style={{ color: "#7a4a00", marginTop: "1.5rem" }}>
              {message}
            </p>
          )}

          {!isSuccess && pendingCheckout && (
            <p style={{ color: "#666666", marginTop: "1rem" }}>
              Pending checkout: {pendingCheckout.id}
            </p>
          )}

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "2rem",
            }}
          >
            {isSuccess && (
              <Link
                to="/Account"
                style={{
                  padding: "0.85rem 1.4rem",
                  background: "#111111",
                  color: "#ffffff",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontSize: "0.78rem",
                }}
              >
                View Account
              </Link>
            )}
            {!isSuccess && (
              <Link
                to="/Checkout"
                style={{
                  padding: "0.85rem 1.4rem",
                  background: "#111111",
                  color: "#ffffff",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontSize: "0.78rem",
                }}
              >
                Return to Checkout
              </Link>
            )}
            <Link
              to="/Archive"
              style={{
                padding: "0.85rem 1.4rem",
                border: "1px solid #111111",
                color: "#111111",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontSize: "0.78rem",
                display: "inline-flex",
                gap: "0.5rem",
                alignItems: "center",
              }}
            >
              <ShoppingBag size={14} />
              Archive
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
