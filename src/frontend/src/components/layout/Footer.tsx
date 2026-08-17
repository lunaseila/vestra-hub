import { Link } from "@tanstack/react-router";

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
      { label: "Collection", to: "/Collection" },
      { label: "Submit Item", to: "/SubmitItem" },
      { label: "Submit an Art Piece", to: "/SubmitItem?type=art" },
    ],
  },
  {
    heading: "Discover",
    isWordmark: false,
    links: [
      { label: "Digital Passport", to: "/DigitalPassport" },
      { label: "Personality Test", to: "/PersonalityTest" },
      { label: "Sage Purification", to: "/SagePurification" },
    ],
  },
  {
    heading: "Legal",
    isWordmark: false,
    links: [
      { label: "About", to: "/About" },
      { label: "Contact", to: "/Contact" },
      { label: "Privacy", to: "/Contact" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const utm = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;

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
          Built with love using{" "}
          <a
            href={utm}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--vestra-gold)", textDecoration: "none" }}
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
