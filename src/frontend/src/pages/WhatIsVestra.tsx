import { FounderSpotlight } from "@/components/FounderSpotlight";
import { Link } from "@tanstack/react-router";
import { CheckCircle, FileText, Leaf, Link2, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function useCounter(target: number, duration: number, triggered: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [triggered, target, duration]);
  return count;
}

const AUTH_CARDS = [
  {
    icon: Shield,
    heading: "Physical Inspection",
    desc: "Every item is physically examined by a certified expert against 47 authentication criteria specific to each brand and category.",
  },
  {
    icon: FileText,
    heading: "Digital Passport",
    desc: "A permanent, tamper-proof record is created: authentication date, inspector, condition, measurements, and a unique certificate code.",
  },
  {
    icon: Link2,
    heading: "Verified Ownership",
    desc: "Every transfer of ownership is recorded. When you buy a Vestra piece, its full provenance comes with it \u2014 blockchain-ready.",
  },
];

const SUSTAINABILITY_ITEMS = [
  "Carbon, water, and waste footprints cut by 20\u201330% per extended garment life",
  "Every Vestra transaction keeps a luxury piece out of landfill",
  "We partner with certified couriers to offset 100% of delivery emissions",
];

export default function WhatIsVestra() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stat1 = useCounter(30, 1800, statsVisible);
  const stat2 = useCounter(62, 1800, statsVisible);

  return (
    <div
      data-ocid="what_is_vestra.page"
      style={{
        background: "var(--vestra-ink)",
        color: "var(--vestra-white)",
        minHeight: "100vh",
      }}
    >
      {/* Hero */}
      <section
        style={{
          padding:
            "clamp(5rem,10vw,10rem) clamp(1.5rem,5vw,5rem) clamp(4rem,8vw,8rem)",
          background:
            "linear-gradient(160deg,#10100E 0%,var(--vestra-ink) 60%,#0a0a0d 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{ maxWidth: "880px", margin: "0 auto", position: "relative" }}
        >
          <p
            style={{
              fontFamily: "JetBrains Mono,monospace",
              fontSize: "var(--text-label)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--vestra-gold)",
              marginBottom: "1.5rem",
            }}
          >
            The Vestra Story
          </p>
          <h1
            style={{
              fontFamily: "Playfair Display,serif",
              fontSize: "clamp(2.5rem,5vw,5rem)",
              fontWeight: 400,
              color: "var(--vestra-white)",
              lineHeight: 1.1,
              marginBottom: "2rem",
            }}
          >
            A Different Kind of
            <br />
            <em
              style={{ fontStyle: "italic", color: "var(--vestra-gold-light)" }}
            >
              Fashion Platform
            </em>
          </h1>
          <p
            style={{
              fontFamily: "DM Sans,sans-serif",
              fontSize: "1.1rem",
              color: "var(--vestra-grey-light)",
              maxWidth: "600px",
              lineHeight: 1.75,
            }}
          >
            Vestra was built on a single conviction: that pre-owned luxury
            fashion deserves the same trust, care, and presentation as
            brand-new. We authenticate every piece so you never have to guess.
          </p>
        </div>
        <div
          style={{
            maxWidth: "880px",
            margin: "3rem auto 0",
            height: "1px",
            background:
              "linear-gradient(90deg,var(--vestra-gold) 0%,transparent 100%)",
          }}
        />
      </section>

      {/* The Problem */}
      <section
        ref={statsRef}
        style={{
          padding: "clamp(4rem,8vw,8rem) clamp(1.5rem,5vw,5rem)",
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
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: "clamp(2rem,5vw,5rem)",
            alignItems: "start",
          }}
        >
          <div>
            <div style={{ marginBottom: "2.5rem" }}>
              <p
                style={{
                  fontFamily: "Playfair Display,serif",
                  fontStyle: "italic",
                  fontSize: "clamp(3rem,6vw,5rem)",
                  color: "var(--vestra-gold)",
                  lineHeight: 1,
                }}
              >
                ${stat1}B
              </p>
              <p
                style={{
                  fontFamily: "DM Sans,sans-serif",
                  fontSize: "0.9rem",
                  color: "var(--vestra-grey-light)",
                  marginTop: "0.5rem",
                  letterSpacing: "0.04em",
                }}
              >
                in counterfeit luxury goods annually
              </p>
            </div>
            <div
              style={{
                padding: "1.5rem",
                border: "1px solid var(--vestra-border)",
                borderLeft: "3px solid var(--vestra-gold)",
                background: "var(--vestra-gold-muted)",
                borderRadius: "4px",
              }}
            >
              <p
                style={{
                  fontFamily: "Playfair Display,serif",
                  fontStyle: "italic",
                  fontSize: "1.35rem",
                  color: "var(--vestra-white)",
                  lineHeight: 1.55,
                }}
              >
                \u201c{stat2}% of buyers are unsure about the authenticity of
                second-hand luxury items they purchase.\u201d
              </p>
              <p
                style={{
                  fontFamily: "JetBrains Mono,monospace",
                  fontSize: "0.7rem",
                  color: "var(--vestra-grey)",
                  marginTop: "0.75rem",
                  letterSpacing: "0.08em",
                }}
              >
                \u2014 Bain &amp; Company Luxury Study, 2023
              </p>
            </div>
          </div>
          <div>
            <h2
              style={{
                fontFamily: "Playfair Display,serif",
                fontSize: "clamp(1.6rem,3vw,2.5rem)",
                fontWeight: 400,
                color: "var(--vestra-white)",
                marginBottom: "1.5rem",
                lineHeight: 1.2,
              }}
            >
              The fashion industry has a trust problem.
            </h2>
            <p
              style={{
                fontFamily: "DM Sans,sans-serif",
                color: "var(--vestra-grey-light)",
                lineHeight: 1.75,
                marginBottom: "1.25rem",
              }}
            >
              The second-hand luxury market is one of the fastest-growing
              segments in fashion \u2014 but it\u2019s plagued by uncertainty.
              Counterfeit goods flood online platforms. Condition descriptions
              are subjective. Provenance is unverifiable. The buyer bears all
              the risk.
            </p>
            <p
              style={{
                fontFamily: "DM Sans,sans-serif",
                color: "var(--vestra-grey-light)",
                lineHeight: 1.75,
              }}
            >
              Vestra was built to change that. We believe that if a piece is
              worth wearing, it\u2019s worth verifying. Every item on our
              platform has been physically inspected, digitally documented, and
              certified before it reaches you. Trust shouldn\u2019t be a luxury
              \u2014 it should be the baseline.
            </p>
          </div>
        </div>
      </section>

      {/* Digital Authentication */}
      <section
        style={{
          padding: "clamp(4rem,8vw,8rem) clamp(1.5rem,5vw,5rem)",
          background: "var(--vestra-ink)",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "JetBrains Mono,monospace",
              fontSize: "var(--text-label)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--vestra-gold)",
              marginBottom: "0.75rem",
            }}
          >
            Digital Authentication
          </p>
          <h2
            style={{
              fontFamily: "Playfair Display,serif",
              fontSize: "clamp(1.6rem,3vw,2.5rem)",
              fontWeight: 400,
              color: "var(--vestra-white)",
              marginBottom: "3rem",
            }}
          >
            What it means for you
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: "1.5rem",
            }}
          >
            {AUTH_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.heading}
                  data-ocid={`what_is_vestra.auth_card.item.${i + 1}`}
                  style={{
                    padding: "2rem",
                    border: "1px solid var(--vestra-border)",
                    borderRadius: "4px",
                    background: "var(--vestra-graphite)",
                    transition:
                      "border-color var(--dur-base) var(--ease-luxury),box-shadow var(--dur-base) var(--ease-luxury)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "var(--vestra-border-hover)";
                    el.style.boxShadow = "0 8px 32px var(--vestra-gold-glow)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "var(--vestra-border)";
                    el.style.boxShadow = "none";
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
                      fontSize: "1.2rem",
                      fontWeight: 500,
                      color: "var(--vestra-white)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {card.heading}
                  </h3>
                  <p
                    style={{
                      fontFamily: "DM Sans,sans-serif",
                      fontSize: "0.9rem",
                      color: "var(--vestra-grey-light)",
                      lineHeight: 1.7,
                    }}
                  >
                    {card.desc}
                  </p>
                  <div
                    style={{
                      marginTop: "1.5rem",
                      width: "32px",
                      height: "2px",
                      background: "var(--vestra-gold)",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section
        style={{
          padding: "clamp(4rem,8vw,8rem) clamp(1.5rem,5vw,5rem)",
          background:
            "linear-gradient(135deg,#111008 0%,var(--vestra-graphite) 50%,#0d1008 100%)",
          borderTop: "1px solid var(--vestra-border)",
          borderBottom: "1px solid var(--vestra-border)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(196,169,125,0.06) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{ maxWidth: "880px", margin: "0 auto", position: "relative" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1.5rem",
            }}
          >
            <Leaf size={18} color="var(--vestra-gold)" />
            <p
              style={{
                fontFamily: "JetBrains Mono,monospace",
                fontSize: "var(--text-label)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--vestra-gold)",
              }}
            >
              Sustainability
            </p>
          </div>
          <blockquote
            style={{
              fontFamily: "Playfair Display,serif",
              fontStyle: "italic",
              fontSize: "clamp(1.4rem,2.5vw,2rem)",
              color: "var(--vestra-white)",
              lineHeight: 1.45,
              borderLeft: "none",
              margin: "0 0 1.5rem",
            }}
          >
            \u201cThe most sustainable fashion is the fashion that already
            exists.\u201d
          </blockquote>
          <p
            style={{
              fontFamily: "DM Sans,sans-serif",
              color: "var(--vestra-grey-light)",
              fontSize: "0.95rem",
              lineHeight: 1.7,
              marginBottom: "2.5rem",
            }}
          >
            Extending a garment\u2019s life by just 9 months reduces its carbon,
            water, and waste footprints by 20\u201330%. Every Vestra purchase is
            an act of conscious consumption.
          </p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.875rem",
            }}
          >
            {SUSTAINABILITY_ITEMS.map((item) => (
              <li
                key={item}
                style={{
                  display: "flex",
                  gap: "0.875rem",
                  alignItems: "flex-start",
                }}
              >
                <CheckCircle
                  size={18}
                  style={{ flexShrink: 0, marginTop: "2px" }}
                  color="var(--vestra-verified)"
                />
                <span
                  style={{
                    fontFamily: "DM Sans,sans-serif",
                    color: "var(--vestra-grey-light)",
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                  }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Meet the Founder */}
      <FounderSpotlight ocidPrefix="what_is_vestra" />

      {/* CTA */}
      <section
        style={{
          padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,5rem)",
          background: "var(--vestra-graphite)",
          borderTop: "1px solid var(--vestra-border)",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "Playfair Display,serif",
            fontSize: "clamp(1.8rem,3vw,2.5rem)",
            fontWeight: 400,
            color: "var(--vestra-white)",
            marginBottom: "1.25rem",
          }}
        >
          Ready to explore?
        </h2>
        <p
          style={{
            fontFamily: "DM Sans,sans-serif",
            color: "var(--vestra-grey-light)",
            maxWidth: "480px",
            margin: "0 auto 2.5rem",
          }}
        >
          Browse hundreds of authenticated luxury pieces \u2014 each with its
          own digital passport.
        </p>
        <Link
          to="/Collection"
          data-ocid="what_is_vestra.cta_button"
          style={{
            display: "inline-block",
            padding: "0.875rem 2.5rem",
            borderRadius: "100px",
            background: "var(--vestra-gold)",
            color: "var(--vestra-black)",
            fontFamily: "DM Sans,sans-serif",
            fontWeight: 500,
            fontSize: "0.95rem",
            textDecoration: "none",
            letterSpacing: "0.02em",
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
          Start Exploring
        </Link>
      </section>
    </div>
  );
}
