import { Link } from "@tanstack/react-router";
import { Leaf, ShieldCheck, Star } from "lucide-react";

const PILLARS = [
  {
    icon: ShieldCheck,
    heading: "Authentication",
    desc: "Every item verified by certified experts before listing \u2014 no exceptions.",
  },
  {
    icon: Leaf,
    heading: "Sustainability",
    desc: "Give luxury fashion a second life, reduce fashion\u2019s carbon footprint.",
  },
  {
    icon: Star,
    heading: "Exclusivity",
    desc: "Curated selection, not a marketplace. Every piece is chosen.",
  },
];

export default function About() {
  return (
    <div
      data-ocid="about.page"
      style={{
        background: "var(--vestra-ink)",
        color: "var(--vestra-white)",
        minHeight: "100vh",
      }}
    >
      {/* Hero */}
      <section
        style={{
          minHeight: "92vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "clamp(4rem,8vw,8rem) clamp(1.5rem,5vw,5rem)",
          background:
            "linear-gradient(180deg,#0a0a0e 0%,var(--vestra-ink) 40%,#0f0d08 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-60%)",
            width: "700px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse,rgba(196,169,125,0.07) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", maxWidth: "900px" }}>
          <p
            style={{
              fontFamily: "JetBrains Mono,monospace",
              fontSize: "var(--text-label)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--vestra-gold)",
              marginBottom: "2rem",
            }}
          >
            About Vestra
          </p>
          <h1
            style={{
              fontFamily: "Playfair Display,serif",
              fontSize: "clamp(3rem,6vw,7rem)",
              fontWeight: 400,
              lineHeight: 1.05,
              color: "var(--vestra-white)",
              margin: 0,
            }}
          >
            Wear the Past.
          </h1>
          <h1
            style={{
              fontFamily: "Playfair Display,serif",
              fontStyle: "italic",
              fontSize: "clamp(3rem,6vw,7rem)",
              fontWeight: 400,
              lineHeight: 1.05,
              color: "var(--vestra-gold-light)",
              marginBottom: "2rem",
            }}
          >
            Own the Future.
          </h1>
          <p
            style={{
              fontFamily: "DM Sans,sans-serif",
              fontSize: "1.15rem",
              color: "var(--vestra-grey-light)",
              maxWidth: "540px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.7,
            }}
          >
            Vintage luxury and art pieces, this is Vestra. Try me
          </p>
          <Link
            to="/"
            data-ocid="about.try_me_pill"
            style={{
              display: "inline-block",
              padding: "10px 28px",
              borderRadius: "50px",
              background: "#1A1A14",
              color: "#C4A97D",
              fontFamily: "Playfair Display,serif",
              fontStyle: "italic",
              fontSize: "11px",
              fontWeight: 400,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              textDecoration: "none",
              cursor: "pointer",
              border: "1px solid rgba(196,169,125,0.6)",
              boxShadow:
                "0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(196,169,125,0.08)",
              animation: "floatPill 3s ease-in-out infinite",
              transition:
                "background 200ms ease,transform 200ms ease,box-shadow 200ms ease",
              marginTop: "1rem",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "#22221a";
              el.style.transform = "translateY(-2px)";
              el.style.boxShadow =
                "0 8px 24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(196,169,125,0.12)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "#1A1A14";
              el.style.transform = "translateY(0)";
              el.style.boxShadow =
                "0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(196,169,125,0.08)";
            }}
          >
            Try Me
          </Link>
        </div>
      </section>

      {/* Pillars */}
      <section
        style={{
          padding: "clamp(3.5rem,7vw,7rem) clamp(1.5rem,5vw,5rem)",
          background: "var(--vestra-graphite)",
          borderTop: "1px solid var(--vestra-border)",
          borderBottom: "1px solid var(--vestra-border)",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: "1.5rem",
          }}
        >
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={p.heading}
                data-ocid={`about.pillar.item.${i + 1}`}
                style={{
                  padding: "2rem 1.75rem",
                  border: "1px solid var(--vestra-border)",
                  borderRadius: "4px",
                  background: "var(--vestra-glass)",
                  transition:
                    "border-color var(--dur-base) var(--ease-luxury),transform var(--dur-base) var(--ease-luxury)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "var(--vestra-border-hover)";
                  el.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "var(--vestra-border)";
                  el.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: "var(--vestra-gold-muted)",
                    border: "1px solid var(--vestra-border-hover)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.25rem",
                  }}
                >
                  <Icon size={22} color="var(--vestra-gold)" />
                </div>
                <h3
                  style={{
                    fontFamily: "Playfair Display,serif",
                    fontSize: "1.15rem",
                    fontWeight: 500,
                    color: "var(--vestra-white)",
                    marginBottom: "0.6rem",
                  }}
                >
                  {p.heading}
                </h3>
                <p
                  style={{
                    fontFamily: "DM Sans,sans-serif",
                    fontSize: "0.88rem",
                    color: "var(--vestra-grey-light)",
                    lineHeight: 1.65,
                  }}
                >
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Social + Founder Photo */}
      <section
        style={{
          padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,5rem)",
          background: "var(--vestra-ink)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          {/* Founder Name + Title */}
          <div
            data-ocid="about.founder_byline"
            style={{ marginBottom: "1.5rem" }}
          >
            <p
              style={{
                fontFamily: "Playfair Display, serif",
                fontStyle: "italic",
                fontSize: "1.25rem",
                fontWeight: 400,
                color: "#F5F0E8",
                letterSpacing: "0.02em",
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              Luna Seila Timpani
            </p>
            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.72rem",
                fontWeight: 500,
                color: "#C4A97D",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                margin: "0.35rem 0 0",
              }}
            >
              Founder &amp; Creative Director
            </p>
          </div>

          {/* Founder Photo */}
          <img
            data-ocid="about.founder_photo"
            src="/assets/images/founder-portrait.jpg"
            alt="Luna Seila Timpani, Founder and Creative Director"
            style={{
              width: "220px",
              height: "240px",
              objectFit: "cover",
              borderRadius: 0,
              display: "block",
              margin: "0 auto 2.5rem",
            }}
          />

          {/* Social Links */}
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="https://www.instagram.com/vestra.space/"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="about.social.instagram"
              style={{
                fontFamily: "DM Sans,sans-serif",
                fontSize: "0.85rem",
                color: "var(--vestra-grey-light)",
                textDecoration: "none",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                transition: "color var(--dur-micro) var(--ease-luxury)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--vestra-gold)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--vestra-grey-light)";
              }}
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@vestra.space"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="about.social.tiktok"
              style={{
                fontFamily: "DM Sans,sans-serif",
                fontSize: "0.85rem",
                color: "var(--vestra-grey-light)",
                textDecoration: "none",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                transition: "color var(--dur-micro) var(--ease-luxury)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--vestra-gold)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--vestra-grey-light)";
              }}
            >
              TikTok
            </a>
            <a
              href="https://www.linkedin.com/in/luna-seila-timpani-/"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="about.social.linkedin"
              style={{
                fontFamily: "DM Sans,sans-serif",
                fontSize: "0.85rem",
                color: "var(--vestra-grey-light)",
                textDecoration: "none",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                transition: "color var(--dur-micro) var(--ease-luxury)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--vestra-gold)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--vestra-grey-light)";
              }}
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,5rem)",
          background: "var(--vestra-ink)",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "Playfair Display,serif",
            fontSize: "clamp(1.6rem,3vw,2.5rem)",
            fontWeight: 400,
            color: "var(--vestra-white)",
            marginBottom: "2.5rem",
          }}
        >
          Ready to explore?
        </h2>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/Collection"
            data-ocid="about.browse_button"
            style={{
              display: "inline-block",
              padding: "0.875rem 2rem",
              borderRadius: "100px",
              background: "var(--vestra-gold)",
              color: "var(--vestra-black)",
              fontFamily: "DM Sans,sans-serif",
              fontWeight: 500,
              textDecoration: "none",
              transition:
                "background var(--dur-micro) var(--ease-luxury),transform var(--dur-micro) var(--ease-luxury)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "var(--vestra-gold-light)";
              el.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "var(--vestra-gold)";
              el.style.transform = "translateY(0)";
            }}
          >
            Browse Collection
          </Link>
          <Link
            to="/SubmitItem"
            data-ocid="about.sell_button"
            style={{
              display: "inline-block",
              padding: "0.875rem 2rem",
              borderRadius: "100px",
              border: "1px solid var(--vestra-border-hover)",
              color: "var(--vestra-white)",
              fontFamily: "DM Sans,sans-serif",
              fontWeight: 500,
              textDecoration: "none",
              background: "transparent",
              transition:
                "background var(--dur-micro) var(--ease-luxury),transform var(--dur-micro) var(--ease-luxury)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "var(--vestra-glass)";
              el.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "transparent";
              el.style.transform = "translateY(0)";
            }}
          >
            Sell Your Pieces
          </Link>
        </div>
      </section>
    </div>
  );
}
