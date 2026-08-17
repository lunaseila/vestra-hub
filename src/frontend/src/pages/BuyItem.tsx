import { useAuth } from "@/hooks/useAuth";
import { MOCK_ITEMS } from "@/types";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Lock,
  Package,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";

const SHIPPING_COST = 15;

type Step = 1 | 2 | 3;

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const search = useSearch({ strict: false }) as any;
  const navigate = useNavigate();
  const itemId = search?.id as string | undefined;

  const item = MOCK_ITEMS.find((i) => i.id === itemId) ?? MOCK_ITEMS[0];
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<ShippingForm>(EMPTY_FORM);
  const [orderNum] = useState(
    () => `VTR-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
  );

  const priceEur = item.price_buy ? item.price_buy / 100 : 0;
  const total = priceEur + SHIPPING_COST;

  const fmt = (cents: number) =>
    `€${(cents / 100).toLocaleString("en-EU", { minimumFractionDigits: 0 })}`;
  const fmtEur = (eur: number) =>
    `€${eur.toLocaleString("en-EU", { minimumFractionDigits: 0 })}`;

  const handleField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const isFormValid = Object.values(form).every((v) => v.trim().length > 0);

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

  return (
    <div className="min-h-screen" style={{ background: "var(--vestra-ink)" }}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress Bar */}
        <div className="mb-10" data-ocid="buy.progress">
          <div className="flex items-center gap-3 mb-3">
            {([1, 2, 3] as Step[]).map((s) => (
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
                    {s === 1 ? "Review" : s === 2 ? "Shipping" : "Confirm"}
                  </span>
                </div>
                {s < 3 && (
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

            <div className="vestra-card p-5" data-ocid="buy.item_card">
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-label text-gold mb-1">{item.brand}</p>
                  <h3 className="font-playfair text-vestra-white text-lg leading-tight">
                    {item.name}
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
                      {item.condition}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-playfair italic text-xl text-vestra-white">
                    {item.price_buy ? fmt(item.price_buy) : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="vestra-card p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm text-vestra-grey-light">
                <Package size={14} className="text-gold" />
                <span>Estimated delivery in 3–5 business days</span>
              </div>
              <div className="section-divider pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--vestra-grey-light)" }}>
                    Item
                  </span>
                  <span className="text-vestra-white">{fmtEur(priceEur)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--vestra-grey-light)" }}>
                    Shipping
                  </span>
                  <span className="text-vestra-white">€{SHIPPING_COST}</span>
                </div>
                <div className="flex justify-between section-divider pt-3">
                  <span className="font-playfair text-vestra-white">Total</span>
                  <span className="font-playfair italic text-xl text-gold">
                    {fmtEur(total)}
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
                  Card number
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
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="rounded-lg p-4 flex items-center"
                  style={{
                    border: "1px solid var(--vestra-border)",
                    minHeight: "52px",
                  }}
                >
                  <span
                    className="text-sm"
                    style={{ color: "var(--vestra-grey)" }}
                  >
                    MM / YY
                  </span>
                </div>
                <div
                  className="rounded-lg p-4 flex items-center"
                  style={{
                    border: "1px solid var(--vestra-border)",
                    minHeight: "52px",
                  }}
                >
                  <span
                    className="text-sm"
                    style={{ color: "var(--vestra-grey)" }}
                  >
                    CVC
                  </span>
                </div>
              </div>
            </div>

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
                onClick={() => setStep(3)}
                disabled={!isFormValid}
                style={{ opacity: isFormValid ? 1 : 0.45 }}
                data-ocid="buy.place_order_button"
              >
                Place Order — {fmtEur(total)}
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Confirmation */}
        {step === 3 && (
          <div
            className="text-center space-y-8 animate-luxury-reveal py-8"
            data-ocid="buy.step3"
          >
            <div className="flex justify-center">
              <svg
                width="90"
                height="90"
                viewBox="0 0 90 90"
                fill="none"
                role="img"
                aria-label="Order confirmed"
              >
                <circle
                  cx="45"
                  cy="45"
                  r="40"
                  stroke="var(--vestra-gold)"
                  strokeWidth="2"
                  opacity="0.25"
                />
                <circle
                  cx="45"
                  cy="45"
                  r="40"
                  stroke="var(--vestra-gold)"
                  strokeWidth="2"
                  strokeDasharray="251"
                  strokeDashoffset="0"
                  style={{
                    animation: "draw-check 1.5s var(--ease-reveal) forwards",
                  }}
                  strokeLinecap="round"
                  transform="rotate(-90 45 45)"
                />
                <path
                  d="M28 46L40 58L63 33"
                  stroke="var(--vestra-gold)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="60"
                  strokeDashoffset="60"
                  style={{
                    animation:
                      "draw-check 0.8s 0.6s var(--ease-reveal) forwards",
                  }}
                />
              </svg>
            </div>

            <div className="space-y-3">
              <h1 className="font-playfair text-4xl text-vestra-white">
                Your piece is on its way.
              </h1>
              <p
                className="text-sm max-w-md mx-auto"
                style={{ color: "var(--vestra-grey-light)" }}
              >
                Your {item.brand} {item.name} will be carefully prepared,
                authenticated, and dispatched within 24 hours.
              </p>
            </div>

            <div
              className="vestra-card p-5 inline-block text-left space-y-2"
              style={{ minWidth: "260px" }}
            >
              <p className="text-label" style={{ color: "var(--vestra-grey)" }}>
                Order Reference
              </p>
              <p className="font-mono-vestra text-xl text-gold">{orderNum}</p>
              <p className="text-xs" style={{ color: "var(--vestra-grey)" }}>
                Keep this for your records
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                className="btn-gold"
                onClick={() =>
                  navigate({ to: `/DigitalPassport?id=${item.passport_id}` })
                }
                data-ocid="buy.view_passport_button"
              >
                <CheckCircle size={14} className="mr-2" />
                View Digital Passport
              </button>
              <button
                type="button"
                className="btn-outlined"
                onClick={() => navigate({ to: "/Collection" })}
                data-ocid="buy.continue_shopping_button"
              >
                <ShoppingBag size={14} className="mr-2" />
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
