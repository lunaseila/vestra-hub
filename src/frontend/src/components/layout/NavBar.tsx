import { Link } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Vestra Home", to: "/Home" },
  { label: "Collection", to: "/Collection" },
  { label: "Community Hub", to: "/CommunityHub" },
  { label: "Submit an Item", to: "/SubmitItem" },
  { label: "Digital Passport", to: "/DigitalPassport" },
  { label: "About", to: "/About" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
        {/* Logo placeholder — wordmark removed */}
        <div style={{ flexShrink: 0, width: "24px" }} />

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
                color: "var(--vestra-grey-light)",
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
            { icon: Search, ocid: "nav.search_button", label: "Search" },
            { icon: Heart, ocid: "nav.wishlist_button", label: "Wishlist" },
            { icon: User, ocid: "nav.profile_button", label: "Profile" },
            { icon: ShoppingBag, ocid: "nav.cart_button", label: "Cart" },
          ].map(({ icon: Icon, ocid, label }) => (
            <button
              key={ocid}
              type="button"
              aria-label={label}
              data-ocid={ocid}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--vestra-grey-light)",
                display: "flex",
                alignItems: "center",
                padding: "4px",
                transition: "color 300ms var(--ease-luxury)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "var(--vestra-white)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "var(--vestra-grey-light)";
              }}
            >
              <Icon size={20} />
            </button>
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
                  color: "var(--vestra-gold)",
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
