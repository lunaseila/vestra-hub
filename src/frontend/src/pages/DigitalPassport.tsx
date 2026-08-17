import { Link } from "@tanstack/react-router";

const TIMELINE_STEPS = [
  { num: "①", label: "Submitted by Seller" },
  { num: "②", label: "Expert Inspection" },
  { num: "③", label: "Digital Passport Issued" },
  { num: "④", label: "Listed for Sale" },
];

const CERTIFICATE_ITEM = {
  id: "N17639",
  name: "Items N17639",
  brand: "Brand",
  collection: "Collection",
  category: "Type",
  condition: "Condition",
};

const CERTIFICATE_PASSPORT = {
  id: "pp-N17639",
  item_id: "N17639",
  authentication_date: "",
  inspector_name: "",
  certificate_code: "",
  condition_verified: "",
  qr_code_url: "",
  blockchain_hash: "",
  created_at: "",
};

export default function DigitalPassport() {
  const passport = CERTIFICATE_PASSPORT;
  const item = CERTIFICATE_ITEM;

  const formattedDate = passport.authentication_date
    ? new Date(passport.authentication_date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div
      data-ocid="passport.page"
      style={{
        background: "#08080A",
        color: "var(--vestra-white)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "3rem 1.5rem 4rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated radial glow beneath card */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "600px",
          background:
            "radial-gradient(ellipse at center, rgba(196,169,125,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Page content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2.5rem",
          width: "100%",
          maxWidth: "800px",
        }}
      >
        {/* What is a Digital Passport? */}
        <div
          style={{
            textAlign: "center",
            maxWidth: "640px",
            marginBottom: "1rem",
          }}
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--vestra-gold)",
              marginBottom: "1rem",
            }}
          >
            Authentication
          </p>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 400,
              color: "var(--vestra-white)",
              lineHeight: 1.1,
              marginBottom: "1.25rem",
            }}
          >
            The Digital Passport
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: "1rem",
              color: "var(--vestra-grey-light)",
              lineHeight: 1.7,
              maxWidth: "520px",
              margin: "0 auto",
            }}
          >
            Every piece authenticated by Vestra receives a Digital Passport — a
            permanent, verifiable record of its provenance, condition, and
            journey. It cannot be forged, lost, or disputed.
          </p>
        </div>

        {/* Passport Certificate */}
        <div
          data-ocid="passport.card"
          style={{
            width: "480px",
            maxWidth: "100%",
            background: "#0F0F12",
            border: "1px solid rgba(196,169,125,0.4)",
            padding: "3rem 2.5rem",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            flexShrink: 0,
          }}
        >
          {/* Corner ornaments */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "1rem",
              left: "1rem",
              width: "24px",
              height: "24px",
              borderTop: "1px solid rgba(196,169,125,0.5)",
              borderLeft: "1px solid rgba(196,169,125,0.5)",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              width: "24px",
              height: "24px",
              borderTop: "1px solid rgba(196,169,125,0.5)",
              borderRight: "1px solid rgba(196,169,125,0.5)",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              bottom: "1rem",
              left: "1rem",
              width: "24px",
              height: "24px",
              borderBottom: "1px solid rgba(196,169,125,0.5)",
              borderLeft: "1px solid rgba(196,169,125,0.5)",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              bottom: "1rem",
              right: "1rem",
              width: "24px",
              height: "24px",
              borderBottom: "1px solid rgba(196,169,125,0.5)",
              borderRight: "1px solid rgba(196,169,125,0.5)",
            }}
          />

          {/* Certificate Header */}
          <div
            style={{
              textAlign: "center",
              borderBottom: "1px solid rgba(196,169,125,0.25)",
              paddingBottom: "1.5rem",
            }}
          >
            <span
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.5rem",
                fontWeight: 500,
                color: "#C4A97D",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              VESTRA
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--vestra-grey)",
              }}
            >
              Certificate of Authentication
            </span>
          </div>

          {/* Certificate Body */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                borderBottom: "1px solid rgba(196,169,125,0.12)",
                paddingBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--vestra-grey)",
                }}
              >
                Items
              </span>
              <span
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.1rem",
                  color: "var(--vestra-white)",
                  letterSpacing: "0.04em",
                }}
              >
                {item.id}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                borderBottom: "1px solid rgba(196,169,125,0.12)",
                paddingBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--vestra-grey)",
                }}
              >
                Brand
              </span>
              <span
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1rem",
                  color: "var(--vestra-white)",
                }}
              >
                {item.brand}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                borderBottom: "1px solid rgba(196,169,125,0.12)",
                paddingBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--vestra-grey)",
                }}
              >
                Collection
              </span>
              <span
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1rem",
                  color: "var(--vestra-white)",
                }}
              >
                {item.collection}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                borderBottom: "1px solid rgba(196,169,125,0.12)",
                paddingBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--vestra-grey)",
                }}
              >
                Type
              </span>
              <span
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1rem",
                  color: "var(--vestra-white)",
                }}
              >
                {item.category}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                borderBottom: "1px solid rgba(196,169,125,0.12)",
                paddingBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--vestra-grey)",
                }}
              >
                Authentication
              </span>
              <span
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1rem",
                  color: "var(--vestra-white)",
                }}
              >
                Verified
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                borderBottom: "1px solid rgba(196,169,125,0.12)",
                paddingBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--vestra-grey)",
                }}
              >
                ID
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.85rem",
                  color: "var(--vestra-gold)",
                  letterSpacing: "0.04em",
                }}
              >
                {passport.certificate_code || "—"}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                borderBottom: "1px solid rgba(196,169,125,0.12)",
                paddingBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--vestra-grey)",
                }}
              >
                Date
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.85rem",
                  color: "var(--vestra-white)",
                  letterSpacing: "0.04em",
                }}
              >
                {formattedDate}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                borderBottom: "1px solid rgba(196,169,125,0.12)",
                paddingBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--vestra-grey)",
                }}
              >
                Inspector
              </span>
              <span
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1rem",
                  color: "var(--vestra-white)",
                }}
              >
                {passport.inspector_name || "—"}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--vestra-grey)",
                }}
              >
                Condition
              </span>
              <span
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1rem",
                  color: "var(--vestra-white)",
                }}
              >
                {passport.condition_verified || item.condition}
              </span>
            </div>
          </div>

          {/* Certificate Footer */}
          <div
            style={{
              textAlign: "center",
              borderTop: "1px solid rgba(196,169,125,0.25)",
              paddingTop: "1.5rem",
              marginTop: "0.5rem",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.55rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--vestra-grey)",
              }}
            >
              This certificate is issued by Vestra and is non-transferable
            </span>
          </div>
        </div>

        {/* Item History Timeline */}
        <div
          data-ocid="passport.timeline"
          style={{
            width: "100%",
            maxWidth: "640px",
          }}
        >
          {/* Desktop: horizontal timeline */}
          <div
            style={{
              display: "none",
            }}
            className="timeline-desktop"
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                position: "relative",
                paddingTop: "1rem",
              }}
            >
              {/* Dashed connecting line */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  top: "28px",
                  left: "12%",
                  right: "12%",
                  height: "1px",
                  borderTop: "1px dashed rgba(196,169,125,0.4)",
                }}
              />
              {TIMELINE_STEPS.map((step) => (
                <div
                  key={step.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                    textAlign: "center",
                    width: "22%",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      border: "1px solid var(--vestra-gold)",
                      background: "rgba(196,169,125,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "0.85rem",
                      color: "var(--vestra-gold)",
                    }}
                  >
                    {step.num}
                  </div>
                  <p
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      fontSize: "0.72rem",
                      color: "var(--vestra-grey-light)",
                      lineHeight: 1.4,
                      maxWidth: "90px",
                    }}
                  >
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: vertical timeline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              paddingLeft: "1rem",
            }}
            className="timeline-mobile"
          >
            {TIMELINE_STEPS.map((step, i) => (
              <div
                key={step.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  position: "relative",
                }}
              >
                {/* Vertical dashed line */}
                {i < TIMELINE_STEPS.length - 1 && (
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: "18px",
                      top: "36px",
                      width: "1px",
                      height: "calc(100% + 1.25rem)",
                      borderLeft: "1px dashed rgba(196,169,125,0.4)",
                    }}
                  />
                )}
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: "1px solid var(--vestra-gold)",
                    background: "rgba(196,169,125,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "0.85rem",
                    color: "var(--vestra-gold)",
                    flexShrink: 0,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {step.num}
                </div>
                <p
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: "0.8rem",
                    color: "var(--vestra-grey-light)",
                    lineHeight: 1.4,
                  }}
                >
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
          <Link to="/Collection">
            <button
              type="button"
              data-ocid="passport.shop_similar_button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.75rem 2rem",
                borderRadius: "100px",
                background: "transparent",
                color: "var(--vestra-gold)",
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontWeight: 500,
                fontSize: "0.875rem",
                letterSpacing: "0.04em",
                border: "1px solid rgba(196,169,125,0.4)",
                cursor: "pointer",
                transition: "background-color 160ms ease, transform 160ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(196,169,125,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.97)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Shop Similar Authenticated Pieces
            </button>
          </Link>
        </div>
      </div>

      {/* Responsive timeline visibility */}
      <style>{`
        @media (min-width: 640px) {
          .timeline-desktop {
            display: block !important;
          }
          .timeline-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
