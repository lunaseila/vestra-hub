import { useMarketplace } from "@/context/MarketplaceContext";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

const COLUMNS = [
  {
    heading: "Vestra",
    isWordmark: true,
    links: [] as { label: string; to: string }[],
  },
  {
    heading: "Shop",
    isWordmark: false,
    links: [
      { label: "Archive", to: "/Archive" },
      { label: "Search", to: "/Search" },
      { label: "Bag", to: "/Bag" },
    ],
  },
  {
    heading: "Discover",
    isWordmark: false,
    links: [
      { label: "Sell on Vestra", to: "/Sell" },
      { label: "Digital Passport", to: "/Passport" },
      { label: "Community Preview", to: "/CommunityHub" },
    ],
  },
  {
    heading: "Legal",
    isWordmark: false,
    links: [
      { label: "Privacy", to: "/PrivacyPolicy" },
      { label: "Terms", to: "/Terms" },
      { label: "Returns", to: "/Returns" },
      { label: "Shipping", to: "/ShippingPolicy" },
      { label: "Seller Terms", to: "/SellerTerms" },
      { label: "Authentication", to: "/AuthenticationPolicy" },
      { label: "FAQ", to: "/FAQ" },
      { label: "Contact", to: "/Contact" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const { captureInquiry } = useMarketplace();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSaved, setNewsletterSaved] = useState(false);

  const handleNewsletterSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newsletterEmail.trim()) return;
    captureInquiry({ type: "newsletter", email: newsletterEmail.trim() });
    setNewsletterSaved(true);
    setNewsletterEmail("");
  };

  return (
    <footer
      data-ocid="footer"
      style={{
        position: "relative",
        background: "var(--vestra-black)",
        borderTop: "1px solid var(--vestra-border)",
        paddingTop: "4rem",
        overflow: "hidden",
      }}
    >
      {/* Noise texture overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "2.5rem",
        }}
      >
        {COLUMNS.map((col) => (
          <div key={col.heading}>
            {col.isWordmark ? (
              <>
                <img
                  src="/assets/images/vestra-logo.png"
                  alt="Vestra"
                  style={{
                    height: "24px",
                    width: "auto",
                    marginBottom: "0.75rem",
                    display: "block",
                  }}
                />
                <p
                  style={{
                    fontFamily:
                      "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontSize: "0.8rem",
                    color: "var(--vestra-grey)",
                    lineHeight: 1.7,
                    maxWidth: "180px",
                  }}
                >
                  Wear the Past.
                  <br />
                  Own the Future.
                </p>
                <form
                  onSubmit={handleNewsletterSubmit}
                  style={{
                    marginTop: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.65rem",
                    maxWidth: "240px",
                  }}
                  data-ocid="footer.newsletter_form"
                >
                  <label
                    htmlFor="footer-newsletter"
                    style={{
                      fontFamily:
                        "'Helvetica Neue', Helvetica, Arial, sans-serif",
                      fontSize: "0.65rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--vestra-grey)",
                    }}
                  >
                    Private archive notes
                  </label>
                  <input
                    id="footer-newsletter"
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(event) => {
                      setNewsletterEmail(event.target.value);
                      setNewsletterSaved(false);
                    }}
                    placeholder="email@example.com"
                    style={{
                      background: "transparent",
                      border: "1px solid var(--vestra-border)",
                      color: "var(--vestra-white)",
                      padding: "0.65rem 0.75rem",
                      fontSize: "0.82rem",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: "transparent",
                      border: "1px solid var(--vestra-gold)",
                      color: "var(--vestra-gold)",
                      padding: "0.6rem 0.75rem",
                      fontSize: "0.72rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    Subscribe
                  </button>
                  {newsletterSaved && (
                    <p
                      style={{
                        color: "var(--vestra-verified)",
                        fontSize: "0.75rem",
                      }}
                    >
                      Saved for CRM/email sync.
                    </p>
                  )}
                </form>
              </>
            ) : (
              <>
                <p
                  style={{
                    fontFamily:
                      "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontSize: "0.65rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--vestra-grey)",
                    marginBottom: "1rem",
                    fontWeight: 500,
                  }}
                >
                  {col.heading}
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.625rem",
                  }}
                >
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        data-ocid={`footer.${link.label.toLowerCase().replace(/ /g, "_")}_link`}
                        style={{
                          fontFamily:
                            "'Helvetica Neue', Helvetica, Arial, sans-serif",
                          fontSize: "0.875rem",
                          color: "var(--vestra-grey-light)",
                          textDecoration: "none",
                          transition: "color 250ms var(--ease-luxury)",
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
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          borderTop: "1px solid var(--vestra-border)",
          marginTop: "3rem",
          padding: "1.25rem 2rem",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <p
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: "0.8rem",
            color: "var(--vestra-grey)",
            letterSpacing: "0.02em",
          }}
        >
          All items are digitally verified. © {year} Vestra.
        </p>
        <p
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: "0.75rem",
            color: "var(--vestra-grey)",
          }}
        >
          Community is an experimental preview. Commerce services require
          production credentials before launch.
        </p>
      </div>
    </footer>
  );
}
