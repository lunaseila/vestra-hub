import EarthGlobe from "@/components/communityHub/EarthGlobe";
import InvitationGate from "@/components/communityHub/InvitationGate";
import { FEATURED_COUNTRIES } from "@/types/communityHub";
import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

// ─── Constants ──────────────────────────────────────────────────────────────

const STATS = [
  { label: "Opportunities Listed", value: 12400, suffix: "+" },
  { label: "Countries Represented", value: 47, suffix: "" },
  { label: "Active Professionals", value: 8200, suffix: "+" },
];

const CATEGORY_PILLS = ["Jobs", "Partnerships", "Freelance", "Startup Collab"];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Choose Your Country",
    desc: "Select from our interactive global network spanning 47 countries and growing.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Define Your Intent",
    desc: "Tell us what you offer or what you seek — jobs, partnerships, freelance, investment.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="2" x2="12" y2="8" />
        <line x1="12" y1="16" x2="12" y2="22" />
        <line x1="2" y1="12" x2="8" y2="12" />
        <line x1="16" y1="12" x2="22" y2="12" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Connect & Collaborate",
    desc: "Start verified conversations with global professionals who match your goals.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857" />
        <path d="M9 20H4v-2a3 3 0 015.356-1.857" />
        <circle cx="12" cy="7" r="4" />
        <path d="M9 20v-2a3 3 0 016 0v2" />
      </svg>
    ),
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Community Hub connected me with my CTO in three days. The quality of professionals here is unlike anything I've seen on traditional job platforms.",
    name: "Elena Marchetti",
    role: "Founder, Luminary AI",
    country: "🇮🇹",
  },
  {
    quote:
      "As a freelance designer, I found a six-month retainer with a London fintech through a single connection. The platform feels exclusive — because it is.",
    name: "Marcus Webb",
    role: "Brand Designer",
    country: "🇬🇧",
  },
  {
    quote:
      "We raised our seed round through introductions made on Community Hub. The calibre of investors and the elegance of the experience set it apart completely.",
    name: "Soren Lindqvist",
    role: "CEO, Nordex Ventures",
    country: "🇩🇪",
  },
];

const COMPANY_BENEFITS = [
  "Post opportunities to 8,200+ professionals",
  "Find pre-vetted talent across 47 countries",
  "Build strategic global partnerships",
  "Scale your network with precision",
];

const FREELANCE_BENEFITS = [
  "Discover high-quality global clients",
  "Showcase your expertise to decision-makers",
  "Connect on your terms, not a bidding war",
  "Get matched by intelligent recommendation",
];

const FOOTER_COLS = [
  {
    heading: "Community Hub",
    links: [
      { label: "About", path: "/CommunityHub/About" },
      { label: "Explore", path: "/CommunityHub/Explore" },
      { label: "Onboarding", path: "/CommunityHub/Onboarding" },
    ],
  },
  {
    heading: "Platform",
    links: [
      { label: "Opportunities", path: "/CommunityHub/Opportunities" },
      { label: "Dashboard", path: "/CommunityHub/Dashboard" },
      { label: "Profile", path: "/CommunityHub/Profile" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Help Center", path: "/CommunityHub/About" },
      { label: "API Docs", path: "/CommunityHub/About" },
      { label: "Status", path: "/CommunityHub/About" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", path: "/CommunityHub/About" },
      { label: "Terms of Use", path: "/CommunityHub/About" },
      { label: "Cookies", path: "/CommunityHub/About" },
    ],
  },
] as const;

// ─── Seeded RNG for deterministic particles ──────────────────────────────────

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ─── Subcomponents ───────────────────────────────────────────────────────────

function FloatingParticles() {
  const particles = useMemo(() => {
    const rand = seededRandom(0xcafebabe);
    return Array.from({ length: 55 }, (_, i) => ({
      id: i,
      x: rand() * 100,
      y: rand() * 100,
      delay: rand() * 12,
      duration: 9 + rand() * 12,
      size: 1.5 + rand() * 2,
      opacity: 0.2 + rand() * 0.3,
    }));
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            background: "white",
            opacity: p.opacity,
            animation: `ch-float-particle ${p.duration}s ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, marginTop: "2px" }}
      aria-hidden="true"
    >
      <circle cx="9" cy="9" r="9" fill="var(--ch-success-bg)" />
      <path
        d="M5.5 9l2.5 2.5 4.5-5"
        stroke="var(--ch-success)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarRow() {
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="var(--ch-gold)"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <div
      className="ch-glass"
      style={{
        borderRadius: "16px",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        transition:
          "transform var(--dur-base) var(--ease-smooth), border-color var(--dur-base) var(--ease-smooth), box-shadow var(--dur-base) var(--ease-smooth)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(-4px)";
        el.style.borderColor = "var(--ch-border-hover)";
        el.style.boxShadow = "0 8px 32px var(--ch-border-glow)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = "";
        el.style.borderColor = "";
        el.style.boxShadow = "";
      }}
    >
      <StarRow />
      <blockquote
        className="font-cormorant"
        style={{
          fontStyle: "italic",
          fontSize: "1.1rem",
          color: "var(--ch-text-primary)",
          lineHeight: 1.75,
          flexGrow: 1,
          margin: 0,
        }}
      >
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span style={{ fontSize: "1.5rem" }}>{t.country}</span>
        <div>
          <div
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "var(--ch-text-primary)",
            }}
          >
            {t.name}
          </div>
          <div
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.75rem",
              color: "var(--ch-text-secondary)",
              marginTop: "1px",
            }}
          >
            {t.role}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Smooth RAF counter ───────────────────────────────────────────────────────

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - 2 ** (-10 * t);
}

function useRAFCounter(target: number, started: boolean, duration = 1800) {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!started) return;
    startTimeRef.current = null;

    function step(ts: number) {
      if (startTimeRef.current === null) startTimeRef.current = ts;
      const elapsed = ts - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    }

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [started, target, duration]);

  return count;
}

function StatCounter({
  label,
  value,
  suffix,
  started,
}: {
  label: string;
  value: number;
  suffix: string;
  started: boolean;
}) {
  const count = useRAFCounter(value, started);
  return (
    <div style={{ marginBottom: "2.5rem" }}>
      <div
        className="font-cormorant"
        style={{
          fontSize: "clamp(3rem, 5vw, 4.5rem)",
          fontWeight: 300,
          color: "var(--ch-text-primary)",
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {count.toLocaleString()}
        <span style={{ color: "var(--ch-accent)", marginLeft: "2px" }}>
          {suffix}
        </span>
      </div>
      <div
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "0.72rem",
          color: "var(--ch-text-secondary)",
          marginTop: "0.5rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase" as const,
        }}
      >
        {label}
      </div>
    </div>
  );
}

// ─── useInView hook ───────────────────────────────────────────────────────────

function useInView(threshold = 0.25) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// ─── SectionReveal: fade+slide up on scroll enter ────────────────────────────

function SectionReveal({
  children,
  delay = 0,
  className,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { ref, inView } = useInView(0.15);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s var(--ease-reveal) ${delay}ms, transform 0.7s var(--ease-reveal) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CHHome() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [testimonialsActive, setTestimonialsActive] = useState(0);
  const { ref: statsRef, inView: statsInView } = useInView(0.2);

  // Scroll tracker
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobile check
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Testimonials auto-advance (mobile)
  useEffect(() => {
    if (!isMobile) return;
    const t = setInterval(
      () => setTestimonialsActive((p) => (p + 1) % TESTIMONIALS.length),
      4000,
    );
    return () => clearInterval(t);
  }, [isMobile]);

  const earthSize = isMobile ? 300 : 540;

  return (
    <div
      style={{
        background: "var(--ch-bg-base)",
        color: "var(--ch-text-primary)",
        fontFamily: "DM Sans, sans-serif",
        overflowX: "hidden",
      }}
    >
      <InvitationGate />
      {/* ──────────────────── HERO ──────────────────── */}
      <section
        data-ocid="ch.home.hero_section"
        style={{
          height: "100vh",
          minHeight: "640px",
          position: "relative",
          overflow: "hidden",
          background: "var(--ch-bg-base)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FloatingParticles />

        {/* Under-earth ambient glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "200px",
            background:
              "radial-gradient(ellipse at center, rgba(42,94,255,0.12) 0%, transparent 70%)",
            filter: "blur(48px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Earth — absolute center, behind text */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            opacity: 0.88,
          }}
        >
          <EarthGlobe
            size={earthSize}
            rotationSpeed={0.0007}
            interactive={false}
          />
        </div>

        {/* Gradient overlay: bottom fade so text reads cleanly */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(7,9,14,0.15) 0%, rgba(7,9,14,0.05) 40%, rgba(7,9,14,0.55) 80%, var(--ch-bg-base) 100%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Hero text block — layered above earth */}
        <div
          style={{
            position: "relative",
            zIndex: 3,
            textAlign: "center",
            padding: isMobile ? "0 1.25rem" : "0 2rem",
            maxWidth: "820px",
            paddingTop: "64px",
          }}
        >
          {/* Label */}
          <p
            className="ch-label animate-ch-hero"
            style={{
              animationDelay: "0ms",
              marginBottom: "1.75rem",
              letterSpacing: "0.14em",
            }}
          >
            [ Global Collaboration Network ]
          </p>

          {/* H1 */}
          <h1
            className="font-cormorant animate-ch-hero"
            style={{
              fontSize: "var(--ch-text-hero)",
              fontWeight: 400,
              lineHeight: 1.0,
              marginBottom: "1.75rem",
              letterSpacing: "-0.01em",
              animationDelay: "80ms",
            }}
          >
            The Future of Collaboration. <br />
            <span style={{ color: "var(--ch-text-accent)" }}>
              By Invitation Only.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="animate-ch-hero"
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: isMobile ? "0.95rem" : "1.1rem",
              color: "var(--ch-text-secondary)",
              maxWidth: "520px",
              margin: "0 auto 2.75rem",
              lineHeight: 1.75,
              animationDelay: "160ms",
            }}
          >
            Request early access and be among the first to experience Vestra
            Hub.
          </p>

          {/* CTA row */}
          <div
            className="animate-ch-hero"
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
              animationDelay: "240ms",
            }}
          >
            <Link
              to="/CommunityHub/Explore"
              className="ch-btn-primary"
              data-ocid="ch.home.explore_cta"
            >
              Explore Community
            </Link>
            <Link
              to="/CommunityHub/Onboarding"
              className="ch-btn-outlined"
              data-ocid="ch.home.join_cta"
            >
              Join the Network
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          aria-hidden="true"
          className="animate-ch-bounce"
          style={{
            position: "absolute",
            bottom: "2.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            color: "var(--ch-text-tertiary)",
            zIndex: 4,
            opacity: scrollY < 100 ? 1 : 0,
            transition: "opacity 0.5s ease",
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontFamily: "DM Sans, sans-serif",
              color: "var(--ch-text-tertiary)",
            }}
          >
            Scroll
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M8 3v10M4 9l4 4 4-4" />
          </svg>
        </div>
      </section>

      {/* ──────────────────── HOW IT WORKS ──────────────────── */}
      <section
        data-ocid="ch.home.how_section"
        style={{
          padding: isMobile ? "5rem 1.25rem" : "7rem 2rem",
          background: "var(--ch-bg-surface)",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <SectionReveal
            style={{ textAlign: "center", marginBottom: "3.5rem" }}
          >
            <p className="ch-label" style={{ marginBottom: "0.875rem" }}>
              Simple Process
            </p>
            <h2
              className="font-cormorant"
              style={{
                fontSize: "var(--ch-text-h1)",
                fontWeight: 400,
                color: "var(--ch-text-primary)",
                marginBottom: "0.875rem",
                lineHeight: 1.1,
              }}
            >
              How It Works
            </h2>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--ch-text-secondary)",
                maxWidth: "440px",
                margin: "0 auto",
                lineHeight: 1.75,
              }}
            >
              Three elegant steps from intent to global collaboration.
            </p>
          </SectionReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: "1.5rem",
            }}
          >
            {HOW_IT_WORKS.map((item, i) => (
              <SectionReveal key={item.step} delay={i * 100}>
                <div
                  className="ch-glass"
                  style={{
                    borderRadius: "16px",
                    padding: "2.25rem 2rem 2.75rem",
                    position: "relative",
                    overflow: "hidden",
                    height: "100%",
                    transition:
                      "transform var(--dur-base) var(--ease-smooth), border-color var(--dur-base) var(--ease-smooth), box-shadow var(--dur-base) var(--ease-smooth)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = "translateY(-4px)";
                    el.style.borderColor = "var(--ch-border-hover)";
                    el.style.boxShadow = "0 12px 40px var(--ch-border-glow)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = "";
                    el.style.borderColor = "";
                    el.style.boxShadow = "";
                  }}
                  data-ocid={`ch.home.how.item.${i + 1}`}
                >
                  {/* Number watermark */}
                  <div
                    className="font-cormorant"
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: "-1rem",
                      right: "1.25rem",
                      fontSize: "6rem",
                      fontWeight: 300,
                      color: "var(--ch-accent-muted)",
                      lineHeight: 1,
                      pointerEvents: "none",
                      userSelect: "none",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {item.step}
                  </div>

                  {/* Icon */}
                  <div
                    style={{
                      color: "var(--ch-text-accent)",
                      marginBottom: "1.5rem",
                      width: "44px",
                      height: "44px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--ch-accent-muted)",
                      borderRadius: "10px",
                      border: "1px solid var(--ch-border-glow)",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {item.icon}
                  </div>

                  <h3
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontWeight: 600,
                      fontSize: "1rem",
                      color: "var(--ch-text-primary)",
                      marginBottom: "0.75rem",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--ch-text-secondary)",
                      lineHeight: 1.75,
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── GLOBAL REACH ──────────────────── */}
      <section
        ref={statsRef}
        data-ocid="ch.home.stats_section"
        style={{
          padding: isMobile ? "5rem 1.25rem" : "7rem 2rem",
          background: "var(--ch-bg-base)",
          borderTop: "1px solid var(--ch-border)",
          borderBottom: "1px solid var(--ch-border)",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? "4rem" : "6rem",
            alignItems: "center",
          }}
        >
          {/* Stat counters */}
          <div>
            <p className="ch-label" style={{ marginBottom: "1.25rem" }}>
              By the Numbers
            </p>
            {STATS.map((s) => (
              <StatCounter key={s.label} {...s} started={statsInView} />
            ))}
          </div>

          {/* Right copy */}
          <SectionReveal>
            <p className="ch-label" style={{ marginBottom: "0.875rem" }}>
              Our Network
            </p>
            <h2
              className="font-cormorant"
              style={{
                fontSize: "var(--ch-text-h2)",
                fontWeight: 400,
                color: "var(--ch-text-primary)",
                marginBottom: "1.25rem",
                lineHeight: 1.2,
              }}
            >
              A Truly Global Ecosystem
            </h2>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--ch-text-secondary)",
                lineHeight: 1.85,
                marginBottom: "2rem",
              }}
            >
              From Silicon Valley to Singapore, we connect the builders,
              innovators, and investors shaping the future of global business.
              Every connection here is intentional.
            </p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {CATEGORY_PILLS.map((cat) => (
                <span
                  key={cat}
                  style={{
                    padding: "0.4rem 1.1rem",
                    borderRadius: "100px",
                    fontSize: "0.78rem",
                    fontFamily: "DM Sans, sans-serif",
                    border: "1px solid var(--ch-border)",
                    color: "var(--ch-text-secondary)",
                    background: "var(--ch-glass)",
                    backdropFilter: "blur(8px)",
                    cursor: "default",
                    transition:
                      "border-color var(--dur-base) var(--ease-smooth), color var(--dur-base) var(--ease-smooth)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "var(--ch-border-hover)";
                    e.currentTarget.style.color = "var(--ch-text-primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--ch-border)";
                    e.currentTarget.style.color = "var(--ch-text-secondary)";
                  }}
                >
                  {cat}
                </span>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ──────────────────── FEATURED COUNTRIES ──────────────────── */}
      <section
        data-ocid="ch.home.countries_section"
        style={{
          padding: isMobile ? "5rem 0 4rem" : "7rem 0 5rem",
          background: "var(--ch-bg-surface)",
        }}
      >
        <SectionReveal
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 2rem",
            marginBottom: "2.5rem",
          }}
        >
          <p className="ch-label" style={{ marginBottom: "0.875rem" }}>
            Global Network
          </p>
          <h2
            className="font-cormorant"
            style={{
              fontSize: "var(--ch-text-h1)",
              fontWeight: 400,
              color: "var(--ch-text-primary)",
              marginBottom: "0.75rem",
              lineHeight: 1.1,
            }}
          >
            Featured Countries
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--ch-text-secondary)",
              maxWidth: "440px",
            }}
          >
            Explore talent and opportunities across eight major hubs.
          </p>
        </SectionReveal>

        {/* Horizontal scrollable row */}
        <div
          className="scrollbar-none"
          style={{
            display: "flex",
            gap: "1.25rem",
            overflowX: "auto",
            padding: "0.5rem 2rem 1.5rem",
          }}
        >
          {FEATURED_COUNTRIES.map((c, idx) => (
            <div
              key={c.name}
              className="ch-card"
              style={{
                flexShrink: 0,
                width: "280px",
                padding: "1.75rem",
                display: "flex",
                flexDirection: "column",
              }}
              data-ocid={`ch.home.country.item.${idx + 1}`}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
                {c.flag}
              </div>
              <h3
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "var(--ch-text-primary)",
                  marginBottom: "0.375rem",
                }}
              >
                {c.name}
              </h3>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "var(--ch-text-secondary)",
                  lineHeight: 1.65,
                  marginBottom: "0.75rem",
                  flexGrow: 1,
                }}
              >
                {c.description}
              </p>
              <p
                style={{
                  fontSize: "0.72rem",
                  fontFamily: "JetBrains Mono, monospace",
                  color: "var(--ch-text-accent)",
                  marginBottom: "1.25rem",
                  letterSpacing: "0.04em",
                }}
              >
                {c.memberCount.toLocaleString()} members
              </p>
              <Link
                to="/CommunityHub/Explore"
                style={{
                  fontSize: "0.8rem",
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 500,
                  color: "var(--ch-text-secondary)",
                  textDecoration: "none",
                  border: "1px solid var(--ch-border)",
                  borderRadius: "100px",
                  padding: "0.5rem 1.25rem",
                  display: "inline-block",
                  transition:
                    "border-color var(--dur-base) var(--ease-smooth), color var(--dur-base) var(--ease-smooth), background var(--dur-base) var(--ease-smooth)",
                }}
                data-ocid={`ch.home.country.view.${idx + 1}`}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--ch-border-hover)";
                  e.currentTarget.style.color = "var(--ch-text-primary)";
                  e.currentTarget.style.background = "var(--ch-glass)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--ch-border)";
                  e.currentTarget.style.color = "var(--ch-text-secondary)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                View Network →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────────── WHO IT'S FOR ──────────────────── */}
      <section
        data-ocid="ch.home.benefits_section"
        style={{
          background: "var(--ch-bg-base)",
          padding: isMobile ? "5rem 1.25rem" : "7rem 2rem",
          borderTop: "1px solid var(--ch-border)",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <SectionReveal
            style={{ textAlign: "center", marginBottom: "3.5rem" }}
          >
            <p className="ch-label" style={{ marginBottom: "0.875rem" }}>
              Built for Everyone
            </p>
            <h2
              className="font-cormorant"
              style={{
                fontSize: "var(--ch-text-h1)",
                fontWeight: 400,
                color: "var(--ch-text-primary)",
                marginBottom: "0.875rem",
                lineHeight: 1.1,
              }}
            >
              Who It&rsquo;s For
            </h2>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--ch-text-secondary)",
                maxWidth: "440px",
                margin: "0 auto",
                lineHeight: 1.75,
              }}
            >
              Whether you&rsquo;re hiring or available for hire, this is your
              platform.
            </p>
          </SectionReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              border: "1px solid var(--ch-border)",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            {/* For Companies */}
            <SectionReveal
              style={{
                padding: isMobile ? "2.5rem" : "3rem 3rem 3.5rem",
                borderRight: isMobile ? "none" : "1px solid var(--ch-border)",
                borderBottom: isMobile ? "1px solid var(--ch-border)" : "none",
                background: "var(--ch-bg-card)",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "3px",
                  background: "var(--ch-accent)",
                  borderRadius: "2px",
                  marginBottom: "1.75rem",
                }}
              />
              <p className="ch-label" style={{ marginBottom: "0.75rem" }}>
                For Companies & Startups
              </p>
              <h3
                className="font-cormorant"
                style={{
                  fontSize: "var(--ch-text-h2)",
                  fontWeight: 400,
                  color: "var(--ch-text-primary)",
                  marginBottom: "2rem",
                  lineHeight: 1.2,
                }}
              >
                Build your global team
              </h3>
              {COMPANY_BENEFITS.map((b) => (
                <div
                  key={b}
                  style={{
                    display: "flex",
                    gap: "0.875rem",
                    marginBottom: "1rem",
                    alignItems: "flex-start",
                  }}
                >
                  <CheckIcon />
                  <span
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--ch-text-secondary)",
                      lineHeight: 1.65,
                    }}
                  >
                    {b}
                  </span>
                </div>
              ))}
            </SectionReveal>

            {/* For Freelancers */}
            <SectionReveal
              delay={100}
              style={{
                padding: isMobile ? "2.5rem" : "3rem 3rem 3.5rem",
                background: "var(--ch-bg-surface)",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "3px",
                  background: "var(--ch-gold)",
                  borderRadius: "2px",
                  marginBottom: "1.75rem",
                }}
              />
              <p className="ch-label" style={{ marginBottom: "0.75rem" }}>
                For Freelancers & Professionals
              </p>
              <h3
                className="font-cormorant"
                style={{
                  fontSize: "var(--ch-text-h2)",
                  fontWeight: 400,
                  color: "var(--ch-text-primary)",
                  marginBottom: "2rem",
                  lineHeight: 1.2,
                }}
              >
                Own your global career
              </h3>
              {FREELANCE_BENEFITS.map((b) => (
                <div
                  key={b}
                  style={{
                    display: "flex",
                    gap: "0.875rem",
                    marginBottom: "1rem",
                    alignItems: "flex-start",
                  }}
                >
                  <CheckIcon />
                  <span
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--ch-text-secondary)",
                      lineHeight: 1.65,
                    }}
                  >
                    {b}
                  </span>
                </div>
              ))}
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ──────────────────── TESTIMONIALS ──────────────────── */}
      <section
        data-ocid="ch.home.testimonials_section"
        style={{
          padding: isMobile ? "5rem 1.25rem" : "7rem 2rem",
          background: "var(--ch-bg-surface)",
          borderTop: "1px solid var(--ch-border)",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <SectionReveal
            style={{ textAlign: "center", marginBottom: "3.5rem" }}
          >
            <p className="ch-label" style={{ marginBottom: "0.875rem" }}>
              Member Stories
            </p>
            <h2
              className="font-cormorant"
              style={{
                fontSize: "var(--ch-text-h1)",
                fontWeight: 400,
                color: "var(--ch-text-primary)",
                marginBottom: "0.875rem",
                lineHeight: 1.1,
              }}
            >
              What Our Members Say
            </h2>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--ch-text-secondary)",
                maxWidth: "380px",
                margin: "0 auto",
              }}
            >
              Real professionals, real results.
            </p>
          </SectionReveal>

          {/* Desktop: 3-col */}
          {!isMobile && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1.5rem",
              }}
            >
              {TESTIMONIALS.map((t, i) => (
                <SectionReveal key={t.name} delay={i * 80}>
                  <TestimonialCard t={t} />
                </SectionReveal>
              ))}
            </div>
          )}

          {/* Mobile: auto-advance carousel */}
          {isMobile && (
            <div>
              <TestimonialCard t={TESTIMONIALS[testimonialsActive]} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "0.5rem",
                  marginTop: "1.75rem",
                }}
              >
                {TESTIMONIALS.map((t, idx) => (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => setTestimonialsActive(idx)}
                    data-ocid={`ch.home.testimonial.dot.${idx + 1}`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                    style={{
                      width: idx === testimonialsActive ? "18px" : "6px",
                      height: "6px",
                      borderRadius: "3px",
                      background:
                        idx === testimonialsActive
                          ? "var(--ch-accent)"
                          : "var(--ch-border)",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s var(--ease-smooth)",
                      padding: 0,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ──────────────────── FINAL CTA ──────────────────── */}
      <section
        data-ocid="ch.home.cta_section"
        style={{
          padding: isMobile ? "5rem 1.25rem 4rem" : "8rem 2rem 6rem",
          background: "var(--ch-bg-base)",
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
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "700px",
            height: "350px",
            background:
              "radial-gradient(ellipse at center, rgba(42,94,255,0.08) 0%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />
        <SectionReveal style={{ position: "relative", zIndex: 1 }}>
          <p className="ch-label" style={{ marginBottom: "1.25rem" }}>
            Your Journey Starts Here
          </p>
          <h2
            className="font-cormorant"
            style={{
              fontSize: "var(--ch-text-h1)",
              fontWeight: 400,
              color: "var(--ch-text-primary)",
              marginBottom: "1.25rem",
              lineHeight: 1.1,
            }}
          >
            Ready to go global?
          </h2>
          <p
            style={{
              fontSize: "0.95rem",
              color: "var(--ch-text-secondary)",
              maxWidth: "480px",
              margin: "0 auto 2.75rem",
              lineHeight: 1.75,
            }}
          >
            Join thousands of professionals who have already found their next
            opportunity through Community Hub.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/CommunityHub/Onboarding"
              className="ch-btn-primary"
              data-ocid="ch.home.final_cta"
            >
              Join the Network
            </Link>
            <Link
              to="/CommunityHub/Opportunities"
              className="ch-btn-outlined"
              data-ocid="ch.home.opportunities_cta"
            >
              Browse Opportunities
            </Link>
          </div>
        </SectionReveal>
      </section>

      {/* ──────────────────── FOOTER ──────────────────── */}
      <footer
        style={{
          borderTop: "1px solid var(--ch-border)",
          padding: isMobile ? "3.5rem 1.25rem 2rem" : "4.5rem 2rem 2.5rem",
          background: "var(--ch-bg-base)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Brand + CTA */}
          <div
            style={{
              marginBottom: "3.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "1.5rem",
            }}
          >
            <div>
              <div
                className="font-cormorant"
                style={{
                  fontSize: "1.625rem",
                  fontWeight: 400,
                  color: "var(--ch-text-primary)",
                  marginBottom: "0.375rem",
                  letterSpacing: "-0.01em",
                }}
              >
                Vestra Hub
              </div>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--ch-text-tertiary)",
                  fontStyle: "italic",
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                }}
              >
                Where Global Talent Meets Opportunity
              </p>
            </div>
            <Link
              to="/CommunityHub/Onboarding"
              className="ch-btn-primary"
              style={{ fontSize: "0.82rem", padding: "0.625rem 1.5rem" }}
              data-ocid="ch.home.footer_join_button"
            >
              Join Free
            </Link>
          </div>

          {/* 4-column links */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "repeat(2, 1fr)"
                : "repeat(4, 1fr)",
              gap: "2rem",
              marginBottom: "3rem",
              paddingBottom: "3rem",
              borderBottom: "1px solid var(--ch-border)",
            }}
          >
            {FOOTER_COLS.map((col) => (
              <div key={col.heading}>
                <p
                  className="ch-label"
                  style={{
                    marginBottom: "1.125rem",
                    color: "var(--ch-text-tertiary)",
                    letterSpacing: "0.12em",
                  }}
                >
                  {col.heading}
                </p>
                {col.links.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path as "/CommunityHub/About"}
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      color: "var(--ch-text-secondary)",
                      marginBottom: "0.625rem",
                      textDecoration: "none",
                      transition: "color var(--dur-micro) var(--ease-smooth)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--ch-text-primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--ch-text-secondary)";
                    }}
                    data-ocid={`ch.home.footer.${item.label.toLowerCase().replace(/\s+/g, "_")}_link`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.75rem",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--ch-text-tertiary)",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              © {new Date().getFullYear()} Vestra Hub · All rights reserved ·
              Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.hostname : "",
                )}`}
                style={{ color: "var(--ch-gold)", textDecoration: "none" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                caffeine.ai
              </a>
            </p>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--ch-text-tertiary)",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              Privacy · Terms · Cookies
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
