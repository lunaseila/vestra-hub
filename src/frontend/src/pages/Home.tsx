import ItemCard from "@/components/shared/ItemCard";
import { MOCK_ITEMS } from "@/types";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Leaf, Shield, Sparkles, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const PILLARS = [
  {
    icon: Shield,
    title: "Authenticated",
    desc: "Every piece undergoes rigorous expert inspection before receiving its Digital Passport.",
  },
  {
    icon: Leaf,
    title: "Sustainable",
    desc: "Extending the life of luxury fashion is the most intentional act of modern dressing.",
  },
  {
    icon: Star,
    title: "Exclusive",
    desc: "Access rare and coveted pieces that exist nowhere else — curated by connoisseurs.",
  },
  {
    icon: Sparkles,
    title: "Curated",
    desc: "Unlike other vintage marketplaces, we curate our wardrobe 100% — every piece is hand-selected, not just listed.",
  },
];

const TIMELINE_STEPS = [
  {
    num: "01",
    title: "Item Submitted",
    desc: "Seller submits the piece with provenance documentation.",
  },
  {
    num: "02",
    title: "Expert Inspection",
    desc: "Our specialists authenticate every detail under strict protocol.",
  },
  {
    num: "03",
    title: "Digital Passport",
    desc: "A permanent certificate is issued and bound to the item.",
  },
  {
    num: "04",
    title: "Listed for Sale",
    desc: "Verified pieces become available to buy.",
  },
];

const FILTER_CATEGORIES = [
  "All",
  "Bags",
  "Ready-to-Wear",
  "Shoes",
  "Accessories",
  "Jewellery",
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredItems =
    activeFilter === "All"
      ? MOCK_ITEMS.slice(0, 8)
      : MOCK_ITEMS.filter((i) => i.category === activeFilter).slice(0, 8);

  return (
    <div style={{ background: "#ffffff", color: "#111111" }}>
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        data-ocid="home.hero"
        className="vestra-hero-section"
        style={{
          position: "relative",
          background: "#ffffff",
          overflow: "hidden",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        {/* Hero image — full-width editorial */}
        <div
          className="vestra-hero-image-wrap"
          style={{
            position: "relative",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <img
            src="/assets/images/vestra-hero-new.png"
            alt="Vestra — Authenticated Luxury Fashion"
            className="vestra-hero-img"
            style={{
              display: "block",
              width: "100%",
              maxWidth: "100vw",
              objectFit: "cover",
              objectPosition: "center top",
              animation: "hero-text-up 1.2s var(--ease-reveal) 0s both",
            }}
          />
          {/* Subtle bottom fade so image blends into text block */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "30%",
              background:
                "linear-gradient(to bottom, transparent, rgba(255,255,255,0.92))",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Text block below image */}
        <div
          className="vestra-hero-text"
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            padding:
              "clamp(2rem, 5vw, 4rem) clamp(1.25rem, 5vw, 2.5rem) clamp(2.5rem, 5vw, 3rem)",
            width: "100%",
            textAlign: "center",
          }}
        >
          {/* Eyebrow label */}
          <p
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "0.72rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#888888",
              marginBottom: "0.875rem",
              animation: "hero-text-up 0.8s var(--ease-reveal) 0.05s both",
            }}
          >
            Authenticated Luxury
          </p>

          {/* Accent line */}
          <div
            style={{
              width: "48px",
              height: "2px",
              background: "#111111",
              margin: "0 auto 0.875rem",
              animation: "hero-text-up 0.8s var(--ease-reveal) 0.1s both",
            }}
          />

          {/* Main headline */}
          <h1
            className="vestra-hero-h1"
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontWeight: 400,
              lineHeight: 1.05,
              color: "#111111",
              marginBottom: "0.875rem",
              animation: "hero-text-up 0.8s var(--ease-reveal) 0.18s both",
              letterSpacing: "-0.01em",
              textTransform: "uppercase",
            }}
          >
            Vestra
          </h1>

          {/* Subheadline */}
          <p
            className="vestra-hero-sub"
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontWeight: 400,
              color: "#666666",
              marginBottom: "0.875rem",
              lineHeight: 1.55,
              animation: "hero-text-up 0.8s var(--ease-reveal) 0.28s both",
            }}
          >
            Wear the Past.
            <br />
            Own the Future.
          </p>

          {/* Description */}
          <p
            className="vestra-hero-desc"
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              color: "#666666",
              lineHeight: 1.6,
              marginBottom: "1.75rem",
              maxWidth: "460px",
              margin: "0 auto 1.75rem",
              animation: "hero-text-up 0.8s var(--ease-reveal) 0.38s both",
            }}
          >
            The world&apos;s most trusted destination for authenticated
            pre-owned luxury. Every piece carries a Digital Fashion Passport
            tracing its journey from atelier to you.
          </p>

          {/* CTA Buttons */}
          <div
            className="vestra-hero-ctas"
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
              animation: "hero-text-up 0.8s var(--ease-reveal) 0.5s both",
            }}
          >
            <Link to="/Archive">
              <button
                type="button"
                data-ocid="home.start_creating_button"
                className="vestra-hero-btn-primary"
                style={{
                  fontSize: "0.8rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  background: "#111111",
                  color: "#ffffff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Shop Collection
              </button>
            </Link>
            <Link to="/Sell">
              <button
                type="button"
                data-ocid="home.submit_item_button"
                className="vestra-hero-btn-secondary"
                style={{
                  fontSize: "0.8rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  background: "transparent",
                  color: "#111111",
                  border: "1px solid #111111",
                  cursor: "pointer",
                }}
              >
                Submit an Item
              </button>
            </Link>
          </div>

          {/* Stats row */}
          <div
            className="vestra-hero-stats"
            style={{
              display: "flex",
              gap: "2.5rem",
              marginTop: "2rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid #e0e0e0",
              animation: "hero-text-up 0.8s var(--ease-reveal) 0.62s both",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {[
              { val: "21+", label: "Authenticated Pieces" },
              { val: "15+", label: "Luxury Brands" },
              { val: "100%", label: "Verified" },
            ].map(({ val, label }) => (
              <div
                key={label}
                style={{ minWidth: "60px", textAlign: "center" }}
              >
                <div
                  style={{
                    fontFamily:
                      "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontSize: "1.4rem",
                    fontWeight: 400,
                    color: "#111111",
                    lineHeight: 1,
                    marginBottom: "0.25rem",
                  }}
                >
                  {val}
                </div>
                <div
                  style={{
                    fontFamily:
                      "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#888888",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div
          style={{
            position: "absolute",
            bottom: "1.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.35rem",
            opacity: Math.max(0, 1 - scrollY / 120),
            transition: "opacity 0.2s ease",
          }}
        >
          <span
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#888888",
            }}
          >
            Scroll
          </span>
          <ChevronDown
            size={16}
            style={{
              animation: "hero-text-up 2s ease-in-out infinite alternate",
              color: "#888888",
            }}
          />
        </div>
      </section>

      {/* ── WHAT IS VESTRA ── */}
      <section
        data-ocid="home.manifesto_section"
        style={{
          padding: "clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 5rem)",
          background: "#ffffff",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <div
          style={{ maxWidth: "768px", margin: "0 auto", textAlign: "center" }}
        >
          <h2
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
              fontWeight: 400,
              color: "#111111",
              marginBottom: "1rem",
              textAlign: "center",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            What is Vestra?
          </h2>
          <p
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "clamp(1rem, 1.6vw, 1.25rem)",
              fontWeight: 400,
              color: "#666666",
              textAlign: "center",
              marginBottom: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            We are not a marketplace. We are a gallery.
          </p>
          <p
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "0.95rem",
              color: "#444444",
              lineHeight: 1.7,
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            VESTRA exists at the intersection of art, heritage, and desire.
            Every piece in our collection is chosen not for its logo, but for
            its lineage. In an era of fast fashion and disposability, Vestra
            stands for permanence—objects that have lived, traveled, and
            witnessed culture unfold.
          </p>
          <h3
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
              fontWeight: 400,
              color: "#111111",
              marginBottom: "1rem",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              textAlign: "center",
            }}
          >
            The Vestra Philosophy
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              marginBottom: "2rem",
              alignItems: "center",
            }}
          >
            {[
              "Provenance over price",
              "Storytelling over selling",
              "Heritage over hype",
              "Sustainability through circularity",
            ].map((line) => (
              <p
                key={line}
                style={{
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontSize: "0.9rem",
                  color: "#444444",
                  lineHeight: 1.6,
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    color: "#888888",
                    marginRight: "0.5rem",
                  }}
                >
                  →
                </span>
                {line}
              </p>
            ))}
          </div>
          <h3
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
              fontWeight: 400,
              color: "#111111",
              marginBottom: "1rem",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              textAlign: "center",
            }}
          >
            Who We Serve
          </h3>
          <p
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "0.95rem",
              color: "#444444",
              lineHeight: 1.7,
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            The discerning collector. The conscious consumer. The art enthusiast
            who sees fashion as sculpture.
          </p>
          <p
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "0.95rem",
              color: "#444444",
              lineHeight: 1.7,
              textAlign: "center",
            }}
          >
            Those who prefer authenticity over algorithms, curation over
            consumption.
          </p>
        </div>
      </section>

      {/* ── SUBMIT AN ITEM CTA ── */}
      <section
        data-ocid="home.submit_cta_section"
        style={{
          padding: "2.5rem 2rem",
          background: "#0F0F12",
          borderBottom: "1px solid #e0e0e0",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#888888",
              marginBottom: "0.75rem",
            }}
          >
            For Sellers
          </p>
          <h2
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
              fontWeight: 400,
              color: "#ffffff",
              marginBottom: "1.25rem",
              textTransform: "uppercase",
              letterSpacing: "0.02em",
            }}
          >
            Have a piece to sell?
          </h2>
          <Link to="/Sell">
            <button
              type="button"
              data-ocid="home.submit_item_cta_button"
              style={{
                padding: "0.75rem 2.5rem",
                fontSize: "0.8rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                background: "transparent",
                color: "#C4A97D",
                border: "1px solid #C4A97D",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#C4A97D";
                (e.currentTarget as HTMLButtonElement).style.color = "#0F0F12";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "#C4A97D";
              }}
            >
              Submit an Item
            </button>
          </Link>
        </div>
      </section>

      {/* ── THE PROMISE ── */}
      <section
        data-ocid="home.promise_section"
        style={{
          padding: "4rem 2rem",
          background: "#f7f7f7",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p
            style={{
              textAlign: "center",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#888888",
              marginBottom: "0.75rem",
            }}
          >
            Our Promise
          </p>
          <h2
            style={{
              textAlign: "center",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
              fontWeight: 400,
              color: "#111111",
              marginBottom: "2rem",
              textTransform: "uppercase",
              letterSpacing: "0.02em",
            }}
          >
            Fashion with Integrity
          </h2>
          <div
            className="vestra-pillars-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1rem",
            }}
          >
            {PILLARS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                style={{
                  padding: "1.75rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  background: "#ffffff",
                  border: "1px solid #e0e0e0",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Icon
                  size={24}
                  style={{ color: "#111111" }}
                  strokeWidth={1.5}
                />
                <h3
                  style={{
                    fontFamily:
                      "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontSize: "1rem",
                    color: "#111111",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    textAlign: "center",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontFamily:
                      "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontSize: "0.85rem",
                    color: "#666666",
                    lineHeight: 1.6,
                    textAlign: "center",
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Logo above Collection section */}
      <div
        style={{
          textAlign: "center",
          padding: "3rem 2rem 0",
          background: "#ffffff",
        }}
      >
        <img
          src="/assets/images/vestra-logo.png"
          alt="Vestra"
          style={{ height: "84px", width: "auto", display: "inline-block" }}
        />
      </div>
      {/* ── FEATURED PIECES ── */}
      <section
        data-ocid="home.featured_section"
        style={{
          padding: "4rem 2rem",
          background: "#ffffff",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "2rem",
              flexDirection: "column",
            }}
          >
            <h2
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                fontWeight: 400,
                color: "#111111",
                textTransform: "uppercase",
                letterSpacing: "0.02em",
                textAlign: "center",
              }}
            >
              Curated for You
            </h2>
            <Link to="/Archive">
              <button
                type="button"
                data-ocid="home.explore_collection_button"
                style={{
                  padding: "0.5rem 1.5rem",
                  fontSize: "0.75rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  background: "transparent",
                  color: "#111111",
                  border: "1px solid #111111",
                  cursor: "pointer",
                }}
              >
                Explore Full Collection
              </button>
            </Link>
          </div>

          {/* Filter pills */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginBottom: "1.5rem",
              justifyContent: "center",
            }}
          >
            {FILTER_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                data-ocid={`home.filter_pill.${cat.toLowerCase().replace(/-/g, "_")}`}
                onClick={() => setActiveFilter(cat)}
                style={{
                  padding: "0.35rem 1rem",
                  borderRadius: "0px",
                  border: `1px solid ${activeFilter === cat ? "#111111" : "#d0d0d0"}`,
                  background: activeFilter === cat ? "#111111" : "transparent",
                  color: activeFilter === cat ? "#ffffff" : "#666666",
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredItems.length === 0 ? (
            <div
              data-ocid="home.empty_state"
              style={{
                textAlign: "center",
                padding: "4rem",
                color: "#888888",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              }}
            >
              No pieces available in this category yet.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "1rem",
              }}
            >
              {filteredItems.map((item, i) => (
                <ItemCard key={item.id} item={item} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── AUTHENTICATION TIMELINE ── */}
      <section
        data-ocid="home.timeline_section"
        style={{
          padding: "4rem 2rem",
          background: "#f7f7f7",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p
            style={{
              textAlign: "center",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#888888",
              marginBottom: "0.75rem",
            }}
          >
            Authentication Process
          </p>
          <h2
            style={{
              textAlign: "center",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
              fontWeight: 400,
              color: "#111111",
              marginBottom: "2.5rem",
              textTransform: "uppercase",
              letterSpacing: "0.02em",
            }}
          >
            How Authentication Works
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "0",
              position: "relative",
            }}
          >
            {/* Dashed connector */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: "1.25rem",
                left: "12.5%",
                right: "12.5%",
                height: "1px",
                borderTop: "1px dashed #d0d0d0",
              }}
            />
            {TIMELINE_STEPS.map((step) => (
              <div
                key={step.num}
                style={{
                  textAlign: "center",
                  padding: "0 1rem 0",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "1px solid #111111",
                    background: "#f7f7f7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                    color: "#111111",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {step.num}
                </div>
                <h3
                  style={{
                    fontFamily:
                      "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontSize: "0.9rem",
                    color: "#111111",
                    marginBottom: "0.35rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily:
                      "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontSize: "0.8rem",
                    color: "#666666",
                    lineHeight: 1.6,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DUAL CTA SPLIT ── */}
      <section
        data-ocid="home.dual_cta_section"
        className="vestra-dual-cta"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          borderBottom: "1px solid #e0e0e0",
          position: "relative",
        }}
      >
        <div
          style={{
            padding: "4rem 3rem",
            background: "#ffffff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            borderRight: "1px solid #e0e0e0",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#888888",
              textAlign: "center",
            }}
          >
            For Buyers
          </p>
          <h2
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "clamp(1.6rem, 3vw, 2.5rem)",
              fontWeight: 400,
              color: "#111111",
              lineHeight: 1.2,
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              textAlign: "center",
            }}
          >
            Looking to Buy?
          </h2>
          <p
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              color: "#666666",
              lineHeight: 1.6,
              fontSize: "0.9rem",
              textAlign: "center",
            }}
          >
            Discover authenticated luxury pieces at a fraction of their original
            price.
          </p>
          <Link to="/Archive">
            <button
              type="button"
              data-ocid="home.buy_cta_button"
              style={{
                padding: "0.75rem 2rem",
                fontSize: "0.8rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                background: "#111111",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Shop Collection
            </button>
          </Link>
        </div>
        <div
          style={{
            padding: "4rem 3rem",
            background: "#f7f7f7",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#888888",
              textAlign: "center",
            }}
          >
            For Sellers
          </p>
          <h2
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "clamp(1.6rem, 3vw, 2.5rem)",
              fontWeight: 400,
              color: "#111111",
              lineHeight: 1.2,
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              textAlign: "center",
            }}
          >
            Have a piece to sell?
          </h2>
          <p
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              color: "#666666",
              lineHeight: 1.6,
              fontSize: "0.9rem",
              textAlign: "center",
            }}
          >
            Let our experts authenticate and list your luxury items to thousands
            of discerning buyers.
          </p>
          <Link to="/Sell">
            <button
              type="button"
              data-ocid="home.sell_cta_button"
              style={{
                padding: "0.75rem 2rem",
                fontSize: "0.8rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                background: "transparent",
                color: "#111111",
                border: "1px solid #111111",
                cursor: "pointer",
              }}
            >
              Submit an Item
            </button>
          </Link>
        </div>
      </section>

      {/* ── PERSONALITY TEST TEASER ── */}
      <section
        data-ocid="home.personality_teaser_section"
        style={{
          padding: "4rem 2rem",
          background: "#f7f7f7",
          textAlign: "center",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <div
          style={{
            maxWidth: "640px",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <p
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#888888",
              marginBottom: "0.75rem",
            }}
          >
            Discover Your Identity
          </p>
          <h2
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
              fontWeight: 400,
              color: "#111111",
              marginBottom: "1rem",
              textTransform: "uppercase",
              letterSpacing: "0.02em",
            }}
          >
            Discover Your Style DNA
          </h2>
          <p
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "0.9rem",
              color: "#666666",
              lineHeight: 1.6,
              marginBottom: "2rem",
            }}
          >
            Take the Vestra Personality Test and get curated picks matched to
            your aesthetic.
          </p>
          <Link to="/PersonalityTest">
            <button
              type="button"
              data-ocid="home.personality_test_button"
              style={{
                padding: "0.75rem 2rem",
                fontSize: "0.8rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                background: "#111111",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Start the Test
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
