import { useMarketplace } from "@/context/MarketplaceContext";
import { Link } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Archive", to: "/Archive", secondary: false },
  { label: "Discover", to: "/Discover", secondary: false },
  { label: "Sell", to: "/Sell", secondary: false },
  { label: "Passport", to: "/Passport", secondary: false },
  { label: "Community", to: "/CommunityHub", secondary: true },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { bagCount, wishlist } = useMarketplace();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        data-ocid="nav"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "64px",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2rem",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: "rgba(8,8,10,0.88)",
          borderBottom: scrolled
            ? "1px solid var(--vestra-border)"
            : "1px solid transparent",
          transition: "border-color 350ms var(--ease-luxury)",
        }}
      >
        <Link
          to="/Home"
          aria-label="Vestra home"
          data-ocid="nav.logo_link"
          style={{
            flexShrink: 0,
            color: "var(--vestra-white)",
            textDecoration: "none",
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: "0.9rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            width: "86px",
          }}
        >
          VESTRA
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex" style={{ gap: "2.5rem" }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-ocid={`nav.${link.label.toLowerCase()}_link`}
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: "0.875rem",
                letterSpacing: "0.02em",
                color: link.secondary
                  ? "var(--vestra-grey)"
                  : "var(--vestra-grey-light)",
                textDecoration: "none",
                transition: "color 300ms var(--ease-luxury)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--vestra-white)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--vestra-grey-light)";
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Icons */}
        <div
          className="hidden md:flex"
          style={{ gap: "1.25rem", alignItems: "center" }}
        >
          {[
            {
              icon: Search,
              ocid: "nav.search_button",
              label: "Search",
              to: "/Search",
              count: 0,
            },
            {
              icon: Heart,
              ocid: "nav.wishlist_button",
              label: "Wishlist",
              to: "/Account",
              count: wishlist.length,
            },
            {
              icon: User,
              ocid: "nav.profile_button",
              label: "Account",
              to: "/Account",
              count: 0,
            },
            {
              icon: ShoppingBag,
              ocid: "nav.cart_button",
              label: "Bag",
              to: "/Bag",
              count: bagCount,
            },
          ].map(({ icon: Icon, ocid, label, to, count }) => (
            <Link
              key={ocid}
              to={to}
              aria-label={label}
              data-ocid={ocid}
              style={{
                position: "relative",
                background: "none",
                color: "var(--vestra-grey-light)",
                display: "flex",
                alignItems: "center",
                padding: "4px",
                transition: "color 300ms var(--ease-luxury)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--vestra-white)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--vestra-grey-light)";
              }}
            >
              <Icon size={20} />
              {count > 0 && (
                <span
                  aria-label={`${count} ${label.toLowerCase()} items`}
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-7px",
                    minWidth: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: "var(--vestra-gold)",
                    color: "var(--vestra-black)",
                    fontSize: "0.62rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {count}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          aria-label="Open menu"
          data-ocid="nav.menu_button"
          className="flex md:hidden"
          onClick={() => setMobileOpen(true)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--vestra-grey-light)",
            padding: "4px",
          }}
        >
          <Menu size={22} />
        </button>
      </nav>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          data-ocid="nav.mobile_menu"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "#0F0F12",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            animation: "luxury-fade 300ms ease both",
          }}
        >
          <button
            type="button"
            aria-label="Close menu"
            data-ocid="nav.close_button"
            onClick={() => setMobileOpen(false)}
            style={{
              position: "absolute",
              top: "1.25rem",
              right: "2rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--vestra-grey-light)",
            }}
          >
            <X size={24} />
          </button>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              textAlign: "center",
            }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-ocid={`nav.mobile_${link.label.toLowerCase()}_link`}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontFamily: "Playfair Display",
                  fontSize: "2rem",
                  color: link.secondary
                    ? "var(--vestra-grey-light)"
                    : "var(--vestra-gold)",
                  textDecoration: "none",
                  letterSpacing: "0.04em",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
