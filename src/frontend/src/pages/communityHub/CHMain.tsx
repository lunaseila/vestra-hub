import CountryPanel from "@/components/communityHub/CountryPanel";
import EarthGlobe from "@/components/communityHub/EarthGlobe";
import type { CHCountry } from "@/types/communityHub";
import { FEATURED_COUNTRIES } from "@/types/communityHub";
import { useEffect, useMemo, useRef, useState } from "react";

// ── Deterministic pseudo-random helper ────────────────────────────────────────
const seeded = (n: number) => Math.abs(Math.sin(n * 9301 + 49297) * 233280) % 1;

// ── Particle layer (CSS-only, no canvas) ──────────────────────────────────────
interface Particle {
  id: number;
  x: number; // % from left
  size: number; // px
  opacity: number;
  duration: number;
  delay: number;
  xDrift: number; // px
}

function useParticles(count: number): Particle[] {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: seeded(i) * 100,
        size: 1 + seeded(i + 1) * 2,
        opacity: 0.2 + seeded(i + 2) * 0.35,
        duration: 14 + seeded(i + 3) * 22,
        delay: seeded(i + 4) * -30,
        xDrift: -30 + seeded(i + 5) * 60,
      })),
    [count],
  );
}

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  useEffect(() => {
    function handle() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handle, { passive: true });
    return () => window.removeEventListener("resize", handle);
  }, []);
  return width;
}

// ── Bottom stats strip data ───────────────────────────────────────────────────
const BOTTOM_STATS = [
  { id: "us", flag: "🇺🇸", label: "3,240 Members in US" },
  { id: "uk", flag: "🇬🇧", label: "2,840 Members in UK" },
  { id: "de", flag: "🇩🇪", label: "2,140 in Germany" },
];

// ── Left-side vertical country list (5 primary markets) ──────────────────────
const LEFT_COUNTRIES = FEATURED_COUNTRIES.slice(0, 5);

export default function CHMain() {
  const [selectedCountry, setSelectedCountry] = useState<CHCountry | null>(
    null,
  );
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Staggered entrance visibility states
  const [vis, setVis] = useState({
    header: false,
    topRight: false,
    leftList: false,
    bottomStrip: false,
  });

  const scrolled = useRef(false);
  const [scrolledDown, setScrolledDown] = useState(false);

  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;
  const earthSize = isMobile ? 320 : 560;
  const rotationSpeed = isPanelOpen ? 0.00025 : 0.0006;

  const particles = useParticles(40);

  // Staggered fade-in on mount — 80 ms increments
  useEffect(() => {
    const timers = [
      setTimeout(() => setVis((v) => ({ ...v, header: true })), 80),
      setTimeout(() => setVis((v) => ({ ...v, topRight: true })), 160),
      setTimeout(() => setVis((v) => ({ ...v, leftList: true })), 320),
      setTimeout(() => setVis((v) => ({ ...v, bottomStrip: true })), 480),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Fade-out scroll indicator after 100 px scroll
  useEffect(() => {
    function onScroll() {
      if (!scrolled.current && window.scrollY > 100) {
        scrolled.current = true;
        setScrolledDown(true);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleCountryClick(country: CHCountry) {
    setSelectedCountry(country);
    setIsPanelOpen(true);
  }

  function handleClose() {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedCountry(null), 500);
  }

  // Base entrance style helper
  function entranceStyle(
    visible: boolean,
    delayOverride?: string,
  ): React.CSSProperties {
    return {
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(12px)",
      transition: `opacity 0.6s var(--ease-reveal) ${delayOverride ?? "0s"}, transform 0.6s var(--ease-reveal) ${delayOverride ?? "0s"}`,
    };
  }

  return (
    <div
      data-ocid="ch.main.page"
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "var(--ch-bg-base)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        paddingTop: "64px",
        boxSizing: "border-box",
      }}
    >
      {/* ── Deep-space ambient gradient ─────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 85% 65% at 50% 55%, rgba(42,94,255,0.08) 0%, rgba(42,94,255,0.025) 45%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Particle layer ───────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        {particles.map((p) => (
          <div
            key={p.id}
            style={
              {
                position: "absolute",
                bottom: "-4px",
                left: `${p.x}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.9)",
                opacity: p.opacity,
                animation: `ch-main-particle-rise ${p.duration}s linear ${p.delay}s infinite`,
                "--x-drift": `${p.xDrift}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          TOP-LEFT  ── Brand label + hint
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        data-ocid="ch.main.header_label"
        style={{
          position: "absolute",
          top: "calc(64px + 1.5rem)",
          left: "2rem",
          zIndex: 10,
          ...entranceStyle(vis.header),
        }}
      >
        {/* Eyebrow label */}
        <div
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--ch-gold)",
            marginBottom: "0.3rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {/* Live dot */}
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "var(--ch-gold)",
              flexShrink: 0,
              boxShadow: "0 0 6px var(--ch-gold)",
            }}
          />
          Community Hub Explore
        </div>

        {/* Hint text */}
        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.875rem",
            color: "var(--ch-text-secondary)",
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          Click any country to connect
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          TOP-RIGHT  ── Stats readout (hidden when panel is open)
      ═══════════════════════════════════════════════════════════════════ */}
      {!isPanelOpen && (
        <div
          data-ocid="ch.main.stats_readout"
          style={{
            position: "absolute",
            top: "calc(64px + 1.5rem)",
            right: "2rem",
            zIndex: 10,
            ...entranceStyle(vis.topRight, "0.08s"),
            textAlign: "right",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.75rem",
              color: "var(--ch-text-accent)",
              letterSpacing: "0.04em",
            }}
          >
            12,400+ opportunities
          </span>
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.75rem",
              color: "var(--ch-text-tertiary)",
              letterSpacing: "0.04em",
            }}
          >
            47 countries
          </span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          LEFT SIDE  ── Vertical country shortcut list (desktop only)
      ═══════════════════════════════════════════════════════════════════ */}
      {!isMobile && (
        <div
          data-ocid="ch.main.countries_list"
          style={{
            position: "absolute",
            left: "2rem",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 6,
            display: "flex",
            flexDirection: "column",
            gap: "0.875rem",
            ...entranceStyle(vis.leftList, "0.16s"),
          }}
        >
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.65rem",
              color: "var(--ch-text-tertiary)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontWeight: 600,
              margin: "0 0 0.25rem",
            }}
          >
            Active Markets
          </p>

          {LEFT_COUNTRIES.map((c) => {
            const isActive = selectedCountry?.name === c.name;
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => handleCountryClick(c)}
                data-ocid={`ch.main.country.${c.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}_button`}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive
                    ? "var(--ch-text-accent)"
                    : "var(--ch-text-secondary)",
                  transition: "color 0.2s var(--ease-smooth)",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    e.currentTarget.style.color = "var(--ch-text-primary)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.color = "var(--ch-text-secondary)";
                }}
                aria-pressed={isActive}
              >
                {/* Accent bar for active */}
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    width: isActive ? "14px" : "6px",
                    height: "1px",
                    background: isActive
                      ? "var(--ch-text-accent)"
                      : "var(--ch-border)",
                    flexShrink: 0,
                    transition:
                      "width 0.25s var(--ease-smooth), background 0.25s",
                  }}
                />
                <span style={{ fontSize: "0.85rem" }}>{c.flag}</span>
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          EARTH — centered
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "relative",
          zIndex: 4,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <EarthGlobe
          size={earthSize}
          rotationSpeed={rotationSpeed}
          interactive
          onCountryClick={handleCountryClick}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BOTTOM STRIP  ── glassmorphism pill stats
          Desktop: 3 pills centered · Mobile: 2 pills
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        data-ocid="ch.main.stats_strip"
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 6,
          display: "flex",
          gap: "0.625rem",
          flexWrap: "nowrap",
          ...entranceStyle(vis.bottomStrip, "0.24s"),
        }}
      >
        {(isMobile ? BOTTOM_STATS.slice(0, 2) : BOTTOM_STATS).map((stat) => (
          <div
            key={stat.id}
            data-ocid={`ch.main.stat_pill.${stat.id}`}
            style={{
              background: "var(--ch-glass)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid var(--ch-border)",
              borderRadius: "100px",
              padding: "0.5rem 1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              whiteSpace: "nowrap",
              transition: "border-color var(--dur-base) var(--ease-smooth)",
            }}
          >
            <span style={{ fontSize: "0.85rem" }}>{stat.flag}</span>
            <span
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.8rem",
                color: "var(--ch-text-secondary)",
                lineHeight: 1,
              }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SCROLL INDICATOR  ── fades out after 100 px
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: isMobile ? "4.5rem" : "5.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 5,
          opacity: scrolledDown ? 0 : vis.bottomStrip ? 0.4 : 0,
          transition: "opacity 0.5s ease",
          animation:
            vis.bottomStrip && !scrolledDown
              ? "ch-scroll-bounce 2s ease-in-out infinite"
              : "none",
          pointerEvents: "none",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--ch-text-tertiary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <title>Scroll down</title>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          COUNTRY PANEL
      ═══════════════════════════════════════════════════════════════════ */}
      {selectedCountry && (
        <CountryPanel
          country={selectedCountry}
          isOpen={isPanelOpen}
          onClose={handleClose}
        />
      )}

      {/* ── Keyframes injected inline to avoid global namespace collisions ── */}
      <style>{`
        @keyframes ch-main-particle-rise {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          5%   { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(-110vh) translateX(var(--x-drift, 20px)); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
