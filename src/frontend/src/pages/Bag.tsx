import { useMarketplace } from "@/context/MarketplaceContext";
import { Link } from "@tanstack/react-router";
import { ShoppingBag, Trash2 } from "lucide-react";

function formatPrice(cents: number) {
  return `€${(cents / 100).toLocaleString("en-EU", { minimumFractionDigits: 0 })}`;
}

export default function Bag() {
  const { bagItems, removeFromBag, subtotal } = useMarketplace();

  return (
    <div
      data-ocid="bag.page"
      style={{ minHeight: "100vh", background: "#ffffff", color: "#111111" }}
    >
      <section
        style={{
          padding: "clamp(3rem, 7vw, 6rem) clamp(1.25rem, 5vw, 5rem)",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "0.7rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#888888",
              marginBottom: "0.75rem",
            }}
          >
            Vestra Bag
          </p>
          <h1
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "clamp(2.4rem, 5vw, 5rem)",
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            Curated Pieces
          </h1>
        </div>
      </section>

      <section
        style={{
          padding: "clamp(2rem, 5vw, 4rem) clamp(1.25rem, 5vw, 5rem)",
        }}
      >
        <div
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: bagItems.length ? "1fr 360px" : "1fr",
            gap: "clamp(2rem, 5vw, 4rem)",
            alignItems: "start",
          }}
          className="bag-grid"
        >
          {bagItems.length === 0 ? (
            <div
              data-ocid="bag.empty_state"
              style={{
                minHeight: "42vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                border: "1px solid #e0e0e0",
                padding: "3rem 1.5rem",
              }}
            >
              <ShoppingBag size={36} strokeWidth={1.4} />
              <h2
                style={{
                  marginTop: "1.25rem",
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: 400,
                  textTransform: "uppercase",
                }}
              >
                Your bag is empty
              </h2>
              <p
                style={{
                  color: "#666666",
                  maxWidth: "360px",
                  marginTop: "0.75rem",
                }}
              >
                Begin with the archive and save the pieces that belong in your
                collection.
              </p>
              <Link
                to="/Archive"
                style={{
                  marginTop: "1.5rem",
                  display: "inline-block",
                  padding: "0.85rem 1.5rem",
                  background: "#111111",
                  color: "#ffffff",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontSize: "0.78rem",
                }}
              >
                Explore Archive
              </Link>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {bagItems.map((item) => (
                  <article
                    key={item.id}
                    data-ocid={`bag.item.${item.id}`}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "120px 1fr auto",
                      gap: "1.25rem",
                      border: "1px solid #e0e0e0",
                      padding: "1rem",
                      alignItems: "center",
                    }}
                    className="bag-line"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      loading="lazy"
                      style={{
                        width: "120px",
                        height: "150px",
                        objectFit: "cover",
                        background: "#f4f4f4",
                      }}
                    />
                    <div>
                      <p
                        style={{
                          fontSize: "0.68rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          color: "#888888",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {item.brand}
                      </p>
                      <Link
                        to="/Item"
                        search={{ id: item.id }}
                        style={{
                          color: "#111111",
                          textDecoration: "none",
                          fontSize: "1.15rem",
                        }}
                      >
                        {item.name}
                      </Link>
                      <p style={{ color: "#666666", marginTop: "0.35rem" }}>
                        {item.condition} · {item.measurements}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
                        {formatPrice(item.price_buy ?? 0)}
                      </p>
                      <button
                        type="button"
                        aria-label={`Remove ${item.name} from bag`}
                        onClick={() => removeFromBag(item.id)}
                        style={{
                          border: "none",
                          background: "transparent",
                          color: "#777777",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <aside
                data-ocid="bag.summary"
                style={{
                  border: "1px solid #111111",
                  padding: "1.5rem",
                  position: "sticky",
                  top: "88px",
                }}
              >
                <p
                  style={{
                    fontSize: "0.68rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "#888888",
                    marginBottom: "1rem",
                  }}
                >
                  Order Summary
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #e0e0e0",
                    paddingBottom: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <p
                  style={{
                    color: "#666666",
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                  }}
                >
                  Shipping, duties, taxes and carrier services require provider
                  configuration and are calculated during production checkout.
                </p>
                <Link
                  to="/Checkout"
                  data-ocid="bag.checkout_link"
                  style={{
                    display: "block",
                    marginTop: "1.5rem",
                    textAlign: "center",
                    padding: "0.9rem 1.5rem",
                    background: "#111111",
                    color: "#ffffff",
                    textDecoration: "none",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontSize: "0.78rem",
                  }}
                >
                  Proceed to Checkout
                </Link>
              </aside>
            </>
          )}
        </div>
      </section>
      <style>{`
        @media (max-width: 860px) {
          .bag-grid { grid-template-columns: 1fr !important; }
          .bag-line { grid-template-columns: 96px 1fr !important; }
          .bag-line > div:last-child { grid-column: 1 / -1; text-align: left !important; }
        }
      `}</style>
    </div>
  );
}
