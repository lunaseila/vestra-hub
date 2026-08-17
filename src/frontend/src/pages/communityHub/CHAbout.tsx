import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const _TEAM: never[] = [];

const PROBLEMS = [
  {
    title: "Fragmented Networks",
    desc: "Your professional network is scattered across 5 different platforms, none of them talking to each other.",
    Icon: FragmentedIcon,
  },
  {
    title: "Low-Quality Matches",
    desc: "You receive hundreds of irrelevant suggestions. The signal-to-noise ratio is broken.",
    Icon: TargetMissIcon,
  },
  {
    title: "No Premium Experience",
    desc: "Most platforms feel like job boards from 2010. We deserve better.",
    Icon: StarXIcon,
  },
];

const TRADITIONAL = [
  "Volume over quality",
  "Generic filtering",
  "No vetting or verification",
  "Impersonal, transactional",
];

const CH_ADVANTAGES = [
  "Curated, high-intent connections",
  "AI-powered matching by profile",
  "Verified members only",
  "Premium, human-first experience",
];

/* ─── SVG Icons ─────────────────────────────────────────────────────────────── */

function FragmentedIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--ch-text-accent)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="5" cy="5" r="2" />
      <circle cx="19" cy="5" r="2" />
      <circle cx="12" cy="19" r="2" />
      <line x1="7" y1="5" x2="17" y2="5" strokeDasharray="2 2" />
      <line x1="6.2" y1="6.8" x2="11" y2="17" strokeDasharray="2 2" />
      <line x1="17.8" y1="6.8" x2="13" y2="17" strokeDasharray="2 2" />
    </svg>
  );
}

function TargetMissIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--ch-text-accent)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <line x1="18" y1="2" x2="22" y2="6" />
      <line x1="22" y1="2" x2="18" y2="6" />
    </svg>
  );
}

function StarXIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--ch-text-accent)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      <line x1="9" y1="9" x2="15" y2="15" />
      <line x1="15" y1="9" x2="9" y2="15" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="var(--ch-success)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <polyline points="2,7 5.5,10.5 12,3" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="rgba(255,80,80,0.7)"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <line x1="3" y1="3" x2="11" y2="11" />
      <line x1="11" y1="3" x2="3" y2="11" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="var(--ch-text-tertiary)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="4,7 10,13 16,7" />
    </svg>
  );
}

/* ─── Scroll indicator ───────────────────────────────────────────────────── */

function ScrollIndicator() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const handleScroll = () => setHidden(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        bottom: "2.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.25rem",
        opacity: hidden ? 0 : 1,
        transition: "opacity 0.4s var(--ease-smooth)",
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "0.68rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--ch-text-tertiary)",
        }}
      >
        Scroll
      </span>
      <div
        style={{
          animation: "ch-scroll-bounce 2s ease-in-out infinite",
          color: "var(--ch-text-tertiary)",
        }}
      >
        <ChevronDownIcon />
      </div>
    </div>
  );
}

/* ─── Stagger reveal hook ───────────────────────────────────────────────── */

function useRevealOnEnter(_count: number, baseDelay = 0) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const item = (_i: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.72s var(--ease-reveal) ${baseDelay + _i * 80}ms, transform 0.72s var(--ease-reveal) ${baseDelay + _i * 80}ms`,
    willChange: "transform, opacity",
  });

  return { ref, item, visible };
}

/* ─── Section label ─────────────────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "DM Sans, sans-serif",
        fontSize: "0.72rem",
        fontWeight: 500,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "var(--ch-gold)",
        marginBottom: "0.875rem",
      }}
    >
      {children}
    </p>
  );
}

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function CHAbout() {
  // unused count param required by hook signature
  const hero = useRevealOnEnter(4);
  const mission = useRevealOnEnter(3);
  const problems = useRevealOnEnter(4);
  const diff = useRevealOnEnter(3);
  const founder = useRevealOnEnter(3);
  const cta = useRevealOnEnter(4);

  return (
    <div
      style={{
        background: "var(--ch-bg-base)",
        color: "var(--ch-text-primary)",
        fontFamily: "DM Sans, sans-serif",
        paddingTop: "64px",
      }}
      data-ocid="ch.about.page"
    >
      {/* ── SECTION 1: HERO ──────────────────────────────────────────────── */}
      <section
        ref={hero.ref as React.RefObject<HTMLElement>}
        data-ocid="ch.about.hero_section"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "6rem 2rem 8rem",
          background: "var(--ch-bg-base)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gradient orb — top right */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle 600px at 80% 20%, rgba(42,94,255,0.06), transparent)",
            pointerEvents: "none",
          }}
        />
        {/* Central ambient glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -55%)",
            width: "700px",
            height: "500px",
            background:
              "radial-gradient(ellipse, rgba(42,94,255,0.05) 0%, transparent 65%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: "700px", position: "relative", zIndex: 1 }}>
          <div style={hero.item(0)}>
            <SectionLabel>About Vestra Hub</SectionLabel>
          </div>

          <h1
            className="font-cormorant"
            style={{
              fontSize: "clamp(3rem, 6vw, 5.5rem)",
              fontWeight: 400,
              lineHeight: 1.05,
              color: "var(--ch-text-primary)",
              letterSpacing: "-0.02em",
              marginBottom: "1.75rem",
              ...hero.item(1),
            }}
          >
            Built for
            <br />
            <span style={{ color: "var(--ch-text-accent)" }}>
              the Builders.
            </span>
          </h1>

          <p
            style={{
              fontSize: "1.1rem",
              color: "var(--ch-text-secondary)",
              lineHeight: 1.7,
              maxWidth: "560px",
              margin: "0 auto 2.5rem",
              ...hero.item(2),
            }}
          >
            A different kind of professional network — built for those who are
            creating the future, not managing the past.
          </p>

          <div style={{ ...hero.item(3) }}>
            <Link
              to="/CommunityHub/Onboarding"
              className="ch-btn-primary"
              style={{ fontSize: "0.95rem", padding: "0.875rem 2rem" }}
              data-ocid="ch.about.hero_join_button"
            >
              Join the Network
            </Link>
          </div>
        </div>

        <ScrollIndicator />
      </section>

      {/* ── SECTION 2: MISSION ──────────────────────────────────────────── */}
      <section
        ref={mission.ref as React.RefObject<HTMLElement>}
        data-ocid="ch.about.mission_section"
        style={{
          padding: "6rem 2rem",
          background: "var(--ch-bg-surface)",
          borderTop: "1px solid var(--ch-border)",
        }}
      >
        <div
          style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}
        >
          <div style={mission.item(0)}>
            <SectionLabel>Our Mission</SectionLabel>
          </div>

          <h2
            className="font-cormorant"
            style={{
              fontSize: "var(--ch-text-h1)",
              fontWeight: 400,
              color: "var(--ch-text-primary)",
              lineHeight: 1.2,
              marginBottom: "2.5rem",
              ...mission.item(1),
            }}
          >
            We believe global connection
            <br />
            should feel effortless.
          </h2>

          <div style={{ textAlign: "left", ...mission.item(2) }}>
            <p
              style={{
                fontSize: "1rem",
                color: "var(--ch-text-secondary)",
                lineHeight: 1.75,
                marginBottom: "1.5rem",
              }}
            >
              Vestra Hub was born from a simple frustration: the world’s most
              talented professionals and ambitious companies were separated by
              geography, noise, and platforms designed for volume — not quality.
            </p>
            <p
              style={{
                fontSize: "1rem",
                color: "var(--ch-text-secondary)",
                lineHeight: 1.75,
              }}
            >
              We built Vestra Hub as the antidote. A focused, curated, and
              intentional platform where every connection means something.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: THE PROBLEM ───────────────────────────────────────── */}
      <section
        ref={problems.ref as React.RefObject<HTMLElement>}
        data-ocid="ch.about.problems_section"
        style={{
          padding: "5rem 2rem",
          background: "var(--ch-bg-base)",
          borderTop: "1px solid var(--ch-border)",
        }}
      >
        <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
          <div
            style={{
              textAlign: "center",
              marginBottom: "3.5rem",
              ...problems.item(0),
            }}
          >
            <SectionLabel>Why It Matters</SectionLabel>
            <h2
              className="font-cormorant"
              style={{
                fontSize: "var(--ch-text-h1)",
                fontWeight: 400,
                color: "var(--ch-text-primary)",
                lineHeight: 1.2,
              }}
            >
              The Problem We Solve
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {PROBLEMS.map(({ title, desc, Icon }, i) => (
              <div
                key={title}
                className="ch-card"
                style={{ padding: "2rem", ...problems.item(i + 1) }}
                data-ocid={`ch.about.problem.item.${i + 1}`}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "var(--ch-accent-muted)",
                    border: "1px solid var(--ch-border-hover)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.25rem",
                    flexShrink: 0,
                  }}
                >
                  <Icon />
                </div>
                <h3
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontWeight: 600,
                    fontSize: "1rem",
                    color: "var(--ch-text-primary)",
                    marginBottom: "0.625rem",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--ch-text-secondary)",
                    lineHeight: 1.8,
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: HOW IT'S DIFFERENT ─────────────────────────────────── */}
      <section
        ref={diff.ref as React.RefObject<HTMLElement>}
        data-ocid="ch.about.comparison_section"
        style={{
          padding: "5rem 2rem",
          background: "var(--ch-bg-surface)",
          borderTop: "1px solid var(--ch-border)",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div
            style={{
              textAlign: "center",
              marginBottom: "3.5rem",
              ...diff.item(0),
            }}
          >
            <SectionLabel>Side by Side</SectionLabel>
            <h2
              className="font-cormorant"
              style={{
                fontSize: "var(--ch-text-h1)",
                fontWeight: 400,
                color: "var(--ch-text-primary)",
                lineHeight: 1.2,
              }}
            >
              How We're Different
            </h2>
          </div>

          {/* Two-column side-by-side card */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              background: "var(--ch-bg-card)",
              border: "1px solid var(--ch-border)",
              borderRadius: "20px",
              overflow: "hidden",
              ...diff.item(1),
            }}
            data-ocid="ch.about.comparison.card"
          >
            {/* LEFT — Traditional */}
            <div style={{ padding: "2.5rem" }}>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--ch-text-tertiary)",
                  marginBottom: "1.75rem",
                }}
              >
                Traditional Job Boards
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.1rem",
                }}
              >
                {TRADITIONAL.map((entry) => (
                  <li
                    key={entry}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.625rem",
                      fontSize: "0.9rem",
                      color: "var(--ch-text-tertiary)",
                      lineHeight: 1.5,
                    }}
                  >
                    <CrossIcon />
                    {entry}
                  </li>
                ))}
              </ul>
            </div>

            {/* Vertical divider */}
            <div
              aria-hidden="true"
              style={{
                width: "1px",
                background: "var(--ch-border)",
                alignSelf: "stretch",
              }}
            />

            {/* RIGHT — Community Hub */}
            <div style={{ padding: "2.5rem" }}>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--ch-text-accent)",
                  marginBottom: "1.75rem",
                }}
              >
                Vestra Hub
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.1rem",
                }}
              >
                {CH_ADVANTAGES.map((entry) => (
                  <li
                    key={entry}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.625rem",
                      fontSize: "0.9rem",
                      color: "var(--ch-text-secondary)",
                      lineHeight: 1.5,
                    }}
                  >
                    <CheckIcon />
                    {entry}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: FOUNDER ─────────────────────────────────────────────── */}
      <section
        ref={founder.ref as React.RefObject<HTMLElement>}
        data-ocid="ch.about.founder_section"
        style={{
          padding: "7rem 2rem",
          background: "var(--ch-bg-base)",
          borderTop: "1px solid var(--ch-border)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle gold ambient glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "700px",
            height: "400px",
            background:
              "radial-gradient(ellipse, rgba(196,169,125,0.04) 0%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Top gold rule */}
          <div
            aria-hidden="true"
            style={{
              width: "48px",
              height: "1px",
              background: "var(--ch-gold)",
              opacity: 0.6,
              marginBottom: "2.5rem",
              ...founder.item(0),
            }}
          />

          {/* Role label */}
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase" as const,
              color: "var(--ch-gold)",
              marginBottom: "1.5rem",
              ...founder.item(0),
            }}
          >
            Founder &amp; CEO
          </p>

          {/* Name */}
          <h2
            className="font-cormorant"
            style={{
              fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
              fontWeight: 400,
              lineHeight: 1.05,
              color: "var(--ch-text-primary)",
              letterSpacing: "-0.02em",
              marginBottom: "3rem",
              ...founder.item(1),
            }}
          >
            Luna Seila Timpani
          </h2>

          {/* Quote block with left gold accent */}
          <div
            style={{
              position: "relative",
              paddingLeft: "2.5rem",
              ...founder.item(2),
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 0,
                top: "0.25rem",
                bottom: "0.25rem",
                width: "2px",
                background:
                  "linear-gradient(to bottom, var(--ch-gold), transparent)",
                borderRadius: "1px",
              }}
            />
            <blockquote
              className="font-cormorant"
              style={{
                fontStyle: "italic",
                fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
                lineHeight: 1.75,
                color: "var(--ch-text-secondary)",
                margin: 0,
              }}
            >
              &ldquo;Vestra Hub was born from the idea of connecting
              freelancers, creators and companies globally.
              <br />
              <br />
              We believe talent should not be limited by geography.
              <br />
              <br />
              Our goal is to build an ecosystem where meaningful collaborations
              happen naturally across industries, cultures and countries.&rdquo;
            </blockquote>
          </div>

          {/* Bottom gold rule */}
          <div
            aria-hidden="true"
            style={{
              width: "48px",
              height: "1px",
              background: "var(--ch-gold)",
              opacity: 0.4,
              marginTop: "3rem",
            }}
          />
        </div>
      </section>

      {/* ── SECTION 6: CTA ───────────────────────────────────────────────── */}
      <section
        ref={cta.ref as React.RefObject<HTMLElement>}
        data-ocid="ch.about.cta_section"
        style={{
          padding: "6rem 2rem",
          background: "var(--ch-bg-surface)",
          borderTop: "1px solid var(--ch-border)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "480px",
            height: "280px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(42,94,255,0.1) 0%, transparent 70%)",
            filter: "blur(48px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={cta.item(0)}>
            <SectionLabel>Join the Community</SectionLabel>
          </div>

          <h2
            className="font-cormorant"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 400,
              color: "var(--ch-text-primary)",
              lineHeight: 1.15,
              marginBottom: "1.25rem",
              ...cta.item(1),
            }}
          >
            Ready to start connecting?
          </h2>

          <p
            style={{
              fontSize: "1rem",
              color: "var(--ch-text-secondary)",
              maxWidth: "480px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.8,
              ...cta.item(2),
            }}
          >
            Join thousands of professionals already building their global
            network.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              ...cta.item(3),
            }}
          >
            <Link
              to="/CommunityHub/Onboarding"
              className="ch-btn-primary"
              style={{ fontSize: "1rem", padding: "1rem 2.5rem" }}
              data-ocid="ch.about.cta_join_button"
            >
              Join the Network
            </Link>
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.875rem",
                color: "var(--ch-text-secondary)",
                fontFamily: "DM Sans, sans-serif",
                transition: "color 0.2s",
              }}
              onClick={() => {
                window.location.href = "/CommunityHub/Onboarding";
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "var(--ch-text-primary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "var(--ch-text-secondary)";
              }}
              data-ocid="ch.about.sign_in_button"
            >
              Already a member?{" "}
              <span style={{ color: "var(--ch-text-accent)" }}>Sign In</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: "var(--ch-bg-base)",
          borderTop: "1px solid var(--ch-border)",
          padding: "4rem 2rem 2.5rem",
        }}
        data-ocid="ch.about.footer"
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "2.5rem",
              marginBottom: "3rem",
            }}
          >
            {(
              [
                {
                  heading: "Vestra Hub",
                  links: ["About", "Mission", "The Founder", "Press"],
                },
                {
                  heading: "Platform",
                  links: [
                    "How It Works",
                    "Opportunities",
                    "Dashboard",
                    "Onboarding",
                  ],
                },
                {
                  heading: "Resources",
                  links: ["Help Centre", "Blog", "API Docs", "Status"],
                },
                {
                  heading: "Legal",
                  links: [
                    "Privacy Policy",
                    "Terms of Service",
                    "Cookie Policy",
                    "GDPR",
                  ],
                },
              ] as const
            ).map((col) => (
              <div key={col.heading}>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    color: "var(--ch-text-primary)",
                    marginBottom: "1.1rem",
                  }}
                >
                  {col.heading}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {col.links.map((link) => (
                    <li key={link} style={{ marginBottom: "0.625rem" }}>
                      <Link
                        to="/CommunityHub/About"
                        style={{
                          fontSize: "0.83rem",
                          color: "var(--ch-text-tertiary)",
                          textDecoration: "none",
                          transition: "color 0.2s",
                          display: "inline-block",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.color =
                            "var(--ch-text-secondary)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.color =
                            "var(--ch-text-tertiary)";
                        }}
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: "1px solid var(--ch-border)",
              paddingTop: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <p
              style={{
                fontSize: "0.78rem",
                color: "var(--ch-text-tertiary)",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              All members are digitally verified. © {new Date().getFullYear()}{" "}
              Vestra Hub.
            </p>
            <p
              style={{
                fontSize: "0.78rem",
                color: "var(--ch-text-tertiary)",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.hostname : "",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--ch-gold)", textDecoration: "none" }}
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
