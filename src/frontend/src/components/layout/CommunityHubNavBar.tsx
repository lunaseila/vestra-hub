import { CH_NAV_ITEMS } from "@/types/communityHub";
import { Link, useRouter } from "@tanstack/react-router";
import { Menu, Search, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const CH_NAV_ITEMS_NO_VESTRA = CH_NAV_ITEMS.filter(
  (item) => item.label !== "Vestra Space",
);

export default function CommunityHubNavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [linksVisible, setLinksVisible] = useState(false);
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    // stagger links reveal on mount
    timerRef.current = setTimeout(() => setLinksVisible(true), 120);
    return () => {
      window.removeEventListener("scroll", handler);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header
        data-ocid="ch.navbar"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: "64px",
          display: "flex",
          alignItems: "center",
          padding: "0 max(1.5rem, calc((100vw - 1200px) / 2))",
          background: "rgba(7, 9, 14, 0.88)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          borderBottom: scrolled
            ? "1px solid var(--ch-border)"
            : "1px solid transparent",
          boxShadow: scrolled
            ? "0 1px 0 var(--ch-border), 0 4px 24px rgba(0,0,0,0.3)"
            : "none",
          transition:
            "border-color var(--dur-base) var(--ease-smooth), box-shadow var(--dur-base) var(--ease-smooth)",
        }}
      >
        {/* Wordmark */}
        <Link
          to="/CommunityHub/Home"
          style={{
            textDecoration: "none",
            flexShrink: 0,
            marginRight: "2.5rem",
          }}
          data-ocid="ch.nav.logo_link"
        >
          <span
            className="font-cormorant"
            style={{
              fontSize: "1.35rem",
              fontWeight: 500,
              fontStyle: "italic",
              color: "var(--ch-gold)",
              letterSpacing: "-0.01em",
              display: "block",
              lineHeight: 1,
            }}
          >
            Vestra Hub
          </span>
        </Link>

        {/* Center nav — desktop */}
        <nav
          aria-label="Main navigation"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
          className="hidden md:flex"
        >
          {CH_NAV_ITEMS_NO_VESTRA.map((item, i) => (
            <Link
              key={item.path}
              to={item.path as "/CommunityHub/Home"}
              data-ocid={`ch.nav.${item.label.toLowerCase().replace(/\s+/g, "_")}_link`}
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.875rem",
                fontWeight: 500,
                textDecoration: "none",
                padding: item.isAccent
                  ? "0.375rem 0.875rem"
                  : "0.375rem 0.875rem",
                borderRadius: "8px",
                color: item.isAccent
                  ? "var(--ch-gold)"
                  : isActive(item.path)
                    ? "var(--ch-text-primary)"
                    : "var(--ch-text-secondary)",
                background: item.isAccent
                  ? "rgba(196,169,125,0.06)"
                  : isActive(item.path)
                    ? "rgba(255,255,255,0.06)"
                    : "transparent",
                border: item.isAccent
                  ? "1px solid rgba(196,169,125,0.35)"
                  : "none",
                transition:
                  "color var(--dur-micro) var(--ease-smooth), background var(--dur-micro) var(--ease-smooth), border-color var(--dur-micro) var(--ease-smooth), opacity 0.4s ease",
                opacity: linksVisible ? 1 : 0,
                transform: linksVisible ? "translateY(0)" : "translateY(-8px)",
                transitionDelay: `${i * 60}ms`,
                letterSpacing: item.isAccent ? "0.02em" : undefined,
              }}
              onMouseEnter={
                item.isAccent
                  ? (e) => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.background = "rgba(196,169,125,0.14)";
                      el.style.borderColor = "rgba(196,169,125,0.6)";
                    }
                  : undefined
              }
              onMouseLeave={
                item.isAccent
                  ? (e) => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.background = "rgba(196,169,125,0.06)";
                      el.style.borderColor = "rgba(196,169,125,0.35)";
                    }
                  : undefined
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flexShrink: 0,
            marginLeft: "auto",
          }}
        >
          <button
            type="button"
            aria-label="Search"
            data-ocid="ch.nav.search_button"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--ch-text-secondary)",
              padding: "0.4rem",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              transition:
                "color var(--dur-micro) var(--ease-smooth), background var(--dur-micro) var(--ease-smooth)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--ch-text-primary)";
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--ch-text-secondary)";
              e.currentTarget.style.background = "none";
            }}
            className="hidden md:flex"
          >
            <Search size={17} />
          </button>

          <Link
            to="/CommunityHub/Profile"
            aria-label="Profile"
            data-ocid="ch.nav.profile_button"
            style={{
              background: "none",
              border: "1px solid var(--ch-border)",
              cursor: "pointer",
              color: "var(--ch-text-secondary)",
              padding: "0.4rem",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              transition:
                "color var(--dur-micro) var(--ease-smooth), border-color var(--dur-micro) var(--ease-smooth), background var(--dur-micro) var(--ease-smooth)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.color = "var(--ch-text-primary)";
              el.style.borderColor = "var(--ch-border-hover)";
              el.style.background = "rgba(255,255,255,0.04)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.color = "var(--ch-text-secondary)";
              el.style.borderColor = "var(--ch-border)";
              el.style.background = "none";
            }}
          >
            <User size={17} />
          </Link>

          <Link
            to="/CommunityHub/Onboarding"
            data-ocid="ch.nav.join_button"
            className="ch-btn-primary hidden md:inline-flex"
            style={{
              padding: "0.5rem 1.25rem",
              fontSize: "0.8rem",
              borderRadius: "8px",
            }}
          >
            Join Network
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            data-ocid="ch.nav.menu_toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--ch-text-secondary)",
              padding: "0.4rem",
              display: "flex",
              alignItems: "center",
              borderRadius: "8px",
            }}
            className="flex md:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile fullscreen overlay */}
      {menuOpen && (
        <div
          data-ocid="ch.nav.mobile_menu"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99,
            background: "var(--ch-bg-base)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
            animation: "ch-hero-reveal 0.3s var(--ease-smooth) both",
          }}
        >
          {/* Close button top-right */}
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            style={{
              position: "absolute",
              top: "1.25rem",
              right: "1.5rem",
              background: "none",
              border: "none",
              color: "var(--ch-text-secondary)",
              cursor: "pointer",
              padding: "0.5rem",
            }}
          >
            <X size={22} />
          </button>

          {/* Brand */}
          <span
            className="font-cormorant"
            style={{
              fontSize: "1.2rem",
              fontStyle: "italic",
              color: "var(--ch-gold)",
              marginBottom: "2rem",
              opacity: 0.7,
            }}
          >
            Vestra Hub
          </span>

          {CH_NAV_ITEMS_NO_VESTRA.map((item) => (
            <Link
              key={item.path}
              to={item.path as "/CommunityHub/Home"}
              onClick={() => setMenuOpen(false)}
              data-ocid={`ch.nav.mobile_${item.label.toLowerCase().replace(/\s+/g, "_")}_link`}
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "2.25rem",
                fontWeight: 400,
                fontStyle: "italic",
                textDecoration: "none",
                lineHeight: 1.5,
                color: item.isAccent
                  ? "var(--ch-gold)"
                  : isActive(item.path)
                    ? "var(--ch-text-primary)"
                    : "var(--ch-text-secondary)",
                transition: "color var(--dur-micro) var(--ease-smooth)",
              }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/CommunityHub/Onboarding"
            onClick={() => setMenuOpen(false)}
            className="ch-btn-primary"
            data-ocid="ch.nav.mobile_join_button"
            style={{ marginTop: "2rem" }}
          >
            Join the Network
          </Link>
        </div>
      )}
    </>
  );
}
