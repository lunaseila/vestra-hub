import { useMarketplace } from "@/context/MarketplaceContext";
import { useAuth } from "@/hooks/useAuth";
import {
  StripeConfigurationError,
  createStripeCheckoutSession,
  getStripeConfigurationMessage,
} from "@/lib/commerceIntegrations";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowLeft,
  CreditCard,
  Lock,
  Package,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";

type Step = 1 | 2;

interface ShippingForm {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
}

const EMPTY_FORM: ShippingForm = {
  fullName: "",
  email: "",
  address: "",
  city: "",
  postcode: "",
  country: "",
};

const COUNTRIES = [
  "France",
  "Italy",
  "United Kingdom",
  "Germany",
  "Spain",
  "United States",
  "UAE",
  "Singapore",
  "Netherlands",
  "Belgium",
];

export default function BuyItem() {
  const { isAuthenticated, login } = useAuth();
  const { products, bagItems, createCheckoutDraft } = useMarketplace();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const search = useSearch({ strict: false }) as any;
  const navigate = useNavigate();
  const itemId = search?.id as string | undefined;

  const checkoutItems = itemId
    ? products.filter((i) => i.id === itemId)
    : bagItems;
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<ShippingForm>(EMPTY_FORM);
  const [checkoutError, setCheckoutError] = useState("");
  const [isStartingPayment, setIsStartingPayment] = useState(false);

  const subtotal = checkoutItems.reduce(
    (sum, checkoutItem) => sum + (checkoutItem.price_buy ?? 0),
    0,
  );
  const total = subtotal;

  const fmt = (cents: number) =>
    `€${(cents / 100).toLocaleString("en-EU", { minimumFractionDigits: 0 })}`;
  const handleField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const isFormValid = Object.values(form).every((v) => v.trim().length > 0);

  const handleStartStripeCheckout = async () => {
    setCheckoutError("");
    setIsStartingPayment(true);
    try {
      const draft = createCheckoutDraft({
        itemId,
        shippingAddress: { ...form, isDefault: true },
      });
      const origin = window.location.origin;
      const redirectUrl = await createStripeCheckoutSession({
        checkoutId: draft.id,
        customerEmail: form.email,
        successUrl: `${origin}/CheckoutSuccess`,
        cancelUrl: `${origin}/CheckoutCancelled`,
        items: checkoutItems.map((checkoutItem) => ({
          id: checkoutItem.id,
          name: checkoutItem.name,
          brand: checkoutItem.brand,
          price: checkoutItem.price_buy ?? 0,
          image: checkoutItem.images[0],
        })),
        metadata: {
          itemIds: draft.itemIds.join(","),
          vestraCheckoutId: draft.id,
        },
      });
      window.location.assign(redirectUrl);
    } catch (error) {
      setCheckoutError(
        error instanceof StripeConfigurationError
          ? getStripeConfigurationMessage()
          : error instanceof Error
            ? error.message
            : "Unable to start secure Stripe checkout. Please try again.",
      );
      setIsStartingPayment(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--vestra-ink)" }}
      >
        <div className="text-center space-y-6 max-w-sm p-8">
          <Lock size={40} className="text-gold mx-auto" />
          <h2 className="font-playfair text-2xl text-vestra-white">
            Members Only
          </h2>
          <p className="text-vestra-grey-light text-sm">
            Please sign in to purchase items from Vestra.
          </p>
          <button
            type="button"
            onClick={login}
            className="btn-gold w-full"
            data-ocid="buy.login_button"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--vestra-ink)" }}
      >
        <div className="text-center space-y-6 max-w-sm p-8">
          <ShoppingBag size={40} className="text-gold mx-auto" />
          <h2 className="font-playfair text-2xl text-vestra-white">
            Your bag is empty
          </h2>
          <p className="text-vestra-grey-light text-sm">
            Add an authenticated piece before entering checkout.
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/Archive" })}
            className="btn-gold w-full"
          >
            Explore Archive
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--vestra-ink)" }}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress Bar */}
        <div className="mb-10" data-ocid="buy.progress">
          <div className="flex items-center gap-3 mb-3">
            {([1, 2] as Step[]).map((s) => (
              <div
                key={s}
                className="flex items-center gap-3 flex-1 last:flex-none"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono-vestra transition-luxury"
                    style={{
                      background:
                        step >= s
                          ? "var(--vestra-gold)"
                          : "var(--vestra-graphite)",
                      color:
                        step >= s
                          ? "var(--vestra-black)"
                          : "var(--vestra-grey)",
                      border: `1px solid ${step >= s ? "var(--vestra-gold)" : "var(--vestra-border)"}`,
                    }}
                  >
                    {s}
                  </div>
                  <span
                    className="text-xs font-dm-sans hidden sm:block"
                    style={{
                      color:
                        step === s
                          ? "var(--vestra-gold)"
                          : "var(--vestra-grey)",
                    }}
                  >
                    {s === 1 ? "Review" : "Payment"}
                  </span>
                </div>
                {s < 2 && (
                  <div
                    className="flex-1 h-px transition-luxury"
                    style={{
                      background:
                        step > s
                          ? "var(--vestra-gold)"
                          : "var(--vestra-border)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1 — Review Order */}
        {step === 1 && (
          <div
            className="space-y-6 animate-luxury-reveal"
            data-ocid="buy.step1"
          >
            <div>
              <p className="text-label text-gold mb-1">Step 1</p>
              <h1 className="font-playfair text-3xl text-vestra-white">
                Review Your Order
              </h1>
            </div>

            <div
              className="vestra-card p-5 space-y-4"
              data-ocid="buy.item_card"
            >
              {checkoutItems.map((checkoutItem) => (
                <div key={checkoutItem.id} className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={checkoutItem.images[0]}
                      alt={checkoutItem.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-label text-gold mb-1">
                      {checkoutItem.brand}
                    </p>
                    <h3 className="font-playfair text-vestra-white text-lg leading-tight">
                      {checkoutItem.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className="text-xs px-2 py-0.5 rounded font-mono-vestra"
                        style={{
                          background: "var(--vestra-graphite)",
                          color: "var(--vestra-grey-light)",
                          border: "1px solid var(--vestra-border)",
                        }}
                      >
                        {checkoutItem.condition}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-playfair italic text-xl text-vestra-white">
                      {checkoutItem.price_buy
                        ? fmt(checkoutItem.price_buy)
                        : "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="vestra-card p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm text-vestra-grey-light">
                <Package size={14} className="text-gold" />
                <span>
                  Shipping method, timing and cost require provider
                  configuration
                </span>
              </div>
              <div className="section-divider pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--vestra-grey-light)" }}>
                    Item
                  </span>
                  <span className="text-vestra-white">{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--vestra-grey-light)" }}>
                    Shipping
                  </span>
                  <span className="text-vestra-white">
                    Calculated by provider
                  </span>
                </div>
                <div className="flex justify-between section-divider pt-3">
                  <span className="font-playfair text-vestra-white">Total</span>
                  <span className="font-playfair italic text-xl text-gold">
                    {fmt(total)}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-gold w-full"
              onClick={() => setStep(2)}
              data-ocid="buy.continue_shipping_button"
            >
              Continue to Shipping
            </button>
          </div>
        )}

        {/* Step 2 — Shipping + Payment */}
        {step === 2 && (
          <div
            className="space-y-6 animate-luxury-reveal"
            data-ocid="buy.step2"
          >
            <div>
              <p className="text-label text-gold mb-1">Step 2</p>
              <h1 className="font-playfair text-3xl text-vestra-white">
                Shipping & Payment
              </h1>
            </div>

            <div className="vestra-card p-5 space-y-4">
              <h3
                className="text-vestra-white font-dm-sans font-medium text-sm uppercase tracking-widest"
                style={{ color: "var(--vestra-grey-light)" }}
              >
                Delivery Address
              </h3>
              {(
                ["fullName", "email", "address", "city", "postcode"] as const
              ).map((field) => (
                <div key={field}>
                  <label
                    htmlFor={`buyitem-field-${field}`}
                    className="text-label text-vestra-grey-light block mb-1.5"
                  >
                    {field === "fullName"
                      ? "Full Name"
                      : field === "email"
                        ? "Email Address"
                        : field === "address"
                          ? "Address Line 1"
                          : field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    id={`buyitem-field-${field}`}
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={form[field]}
                    onChange={handleField}
                    placeholder={
                      field === "fullName"
                        ? "Sophie Laurent"
                        : field === "email"
                          ? "sophie@example.com"
                          : ""
                    }
                    className="w-full bg-transparent text-vestra-white text-sm px-4 py-3 rounded-lg outline-none transition-luxury placeholder:text-vestra-grey"
                    style={{ border: "1px solid var(--vestra-border)" }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--vestra-gold)";
                      e.target.style.boxShadow =
                        "0 0 0 3px var(--vestra-gold-muted)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--vestra-border)";
                      e.target.style.boxShadow = "none";
                    }}
                    data-ocid={`buy.${field}_input`}
                  />
                </div>
              ))}
              <div>
                <label
                  htmlFor="buyitem-country"
                  className="text-label text-vestra-grey-light block mb-1.5"
                >
                  Country
                </label>
                <select
                  id="buyitem-country"
                  name="country"
                  value={form.country}
                  onChange={handleField}
                  className="w-full text-vestra-white text-sm px-4 py-3 rounded-lg outline-none transition-luxury"
                  style={{
                    background: "var(--vestra-graphite)",
                    border: "1px solid var(--vestra-border)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--vestra-gold)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--vestra-border)";
                  }}
                  data-ocid="buy.country_select"
                >
                  <option value="" disabled>
                    Select country
                  </option>
                  {COUNTRIES.map((c) => (
                    <option
                      key={c}
                      value={c}
                      style={{ background: "var(--vestra-graphite)" }}
                    >
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="vestra-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3
                  className="text-sm uppercase tracking-widest"
                  style={{ color: "var(--vestra-grey-light)" }}
                >
                  Payment
                </h3>
                <div className="flex items-center gap-1.5">
                  <Lock size={12} style={{ color: "var(--vestra-verified)" }} />
                  <span
                    className="text-xs font-mono-vestra"
                    style={{ color: "var(--vestra-verified)" }}
                  >
                    Secure
                  </span>
                </div>
              </div>
              <div
                className="rounded-lg p-4 flex items-center gap-3"
                style={{
                  border: "1px solid var(--vestra-border)",
                  minHeight: "52px",
                }}
              >
                <CreditCard size={18} style={{ color: "var(--vestra-grey)" }} />
                <span
                  className="text-sm"
                  style={{ color: "var(--vestra-grey)" }}
                >
                  Stripe Payment Element
                </span>
                <div className="ml-auto flex gap-1.5">
                  {["VISA", "MC", "AMEX"].map((card) => (
                    <span
                      key={card}
                      className="text-[10px] font-mono-vestra px-1.5 py-0.5 rounded"
                      style={{
                        background: "var(--vestra-graphite)",
                        color: "var(--vestra-grey-light)",
                        border: "1px solid var(--vestra-border)",
                      }}
                    >
                      {card}
                    </span>
                  ))}
                </div>
              </div>
              <p
                className="text-sm"
                style={{ color: "var(--vestra-grey-light)" }}
              >
                Payment is completed through Stripe Checkout. Vestra creates the
                Checkout Session server-side, redirects you to Stripe, and the
                deployed webhook verifies payment before production fulfillment.
              </p>
              <p className="text-xs" style={{ color: "var(--vestra-grey)" }}>
                Required configuration: VITE_CHECKOUT_API_BASE_URL,
                STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, and webhook
                deployment.
              </p>
            </div>

            {checkoutError && (
              <p role="alert" className="text-sm" style={{ color: "#ff9b9b" }}>
                {checkoutError}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                className="btn-outlined"
                onClick={() => setStep(1)}
                data-ocid="buy.back_button"
              >
                <ArrowLeft size={14} className="mr-1" /> Back
              </button>
              <button
                type="button"
                className="btn-gold flex-1"
                onClick={handleStartStripeCheckout}
                disabled={!isFormValid || isStartingPayment}
                style={{
                  opacity: isFormValid && !isStartingPayment ? 1 : 0.45,
                }}
                data-ocid="buy.place_order_button"
              >
                {isStartingPayment
                  ? "Starting Secure Payment..."
                  : `Continue to Stripe — ${fmt(total)}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
