import { useEffect, useRef, useState } from "react";

interface FounderSpotlightProps {
  ocidPrefix: string;
}

export function FounderSpotlight({ ocidPrefix }: FounderSpotlightProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-ocid={`${ocidPrefix}.founder_spotlight.section`}
      style={{
        padding: "clamp(4rem,8vw,8rem) clamp(1.5rem,5vw,5rem)",
        background: "var(--vestra-ink)",
        borderTop: "1px solid var(--vestra-border)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "800px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse,rgba(196,169,125,0.05) 0%,transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          position: "relative",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(32px)",
          transition:
            "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Section heading */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "clamp(2.5rem,5vw,4rem)",
          }}
        >
          <p
            style={{
              fontFamily: "JetBrains Mono,monospace",
              fontSize: "var(--text-label)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--vestra-gold)",
              marginBottom: "1rem",
            }}
          >
            Meet the Founder
          </p>
          <h2
            style={{
              fontFamily: "Playfair Display,serif",
              fontSize: "clamp(2rem,4vw,3.5rem)",
              fontWeight: 400,
              color: "var(--vestra-white)",
              lineHeight: 1.15,
              marginBottom: "0.875rem",
              position: "relative",
              display: "inline-block",
            }}
          >
            The creative force
            <br />
            <em
              style={{ fontStyle: "italic", color: "var(--vestra-gold-light)" }}
            >
              behind Vestra
            </em>
          </h2>
          {/* Gold accent underline */}
          <div
            style={{
              width: "64px",
              height: "2px",
              background:
                "linear-gradient(90deg,transparent,var(--vestra-gold),transparent)",
              margin: "1.5rem auto 0",
            }}
          />
        </div>

        {/* Founder card */}
        <div
          data-ocid={`${ocidPrefix}.founder_spotlight.card`}
          onMouseEnter={() => setCardHovered(true)}
          onMouseLeave={() => setCardHovered(false)}
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 3fr",
            gap: "clamp(2rem,4vw,4rem)",
            alignItems: "start",
            padding: "clamp(2rem,4vw,3.5rem)",
            border: cardHovered
              ? "1px solid var(--vestra-border-hover)"
              : "1px solid var(--vestra-border)",
            borderRadius: "12px",
            background: "var(--vestra-graphite)",
            boxShadow: cardHovered
              ? "0 24px 80px rgba(196,169,125,0.12), 0 8px 32px rgba(0,0,0,0.4)"
              : "0 8px 40px rgba(0,0,0,0.3)",
            transform: cardHovered ? "translateY(-4px)" : "translateY(0)",
            transition:
              "border-color 350ms cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 350ms cubic-bezier(0.25,0.46,0.45,0.94), transform 350ms cubic-bezier(0.25,0.46,0.45,0.94)",
          }}
        >
          {/* Image column */}
          <div style={{ position: "relative" }}>
            {/* Image collage: primary + accent thumbnails */}
            <div
              style={{
                position: "relative",
                aspectRatio: "3/4",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid rgba(196,169,125,0.25)",
                boxShadow:
                  "0 0 0 1px rgba(196,169,125,0.12), 0 12px 48px rgba(0,0,0,0.5)",
              }}
            >
              <img
                src="/assets/images/founder-vestra-copertina.png"
                alt="Luna Seila Timpani — Founder of Vestra"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  display: "block",
                }}
              />
              {/* Gold shimmer overlay at bottom */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "40%",
                  background:
                    "linear-gradient(to top,rgba(8,8,10,0.85) 0%,transparent 100%)",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Accent thumbnails — stacked bottom right */}
            <div
              style={{
                position: "absolute",
                bottom: "-16px",
                right: "-16px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "72px",
                  height: "90px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "2px solid var(--vestra-graphite)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
                }}
              >
                <img
                  src="/assets/images/founder-img4.png"
                  alt=""
                  aria-hidden="true"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div
                style={{
                  width: "72px",
                  height: "90px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "2px solid var(--vestra-graphite)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
                }}
              >
                <img
                  src="/assets/images/founder-abu.png"
                  alt=""
                  aria-hidden="true"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>

          {/* Content column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              paddingTop: "0.5rem",
            }}
          >
            {/* Name & title */}
            <div>
              <h3
                data-ocid={`${ocidPrefix}.founder_spotlight.name`}
                style={{
                  fontFamily: "Playfair Display,serif",
                  fontSize: "clamp(1.6rem,2.5vw,2.25rem)",
                  fontWeight: 400,
                  color: "var(--vestra-white)",
                  marginBottom: "0.625rem",
                  lineHeight: 1.2,
                }}
              >
                Luna Seila Timpani
              </h3>
              <p
                style={{
                  fontFamily: "JetBrains Mono,monospace",
                  fontSize: "0.68rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--vestra-gold)",
                  lineHeight: 1.6,
                }}
              >
                Founder &amp; CEO &nbsp;&middot;&nbsp; Creative Director
                &nbsp;&middot;&nbsp; Art Director
                <br />
                Professional Singer &amp; Model
              </p>
            </div>

            {/* Divider */}
            <div
              style={{
                height: "1px",
                background:
                  "linear-gradient(90deg,var(--vestra-gold) 0%,transparent 100%)",
                width: "100%",
                opacity: 0.35,
              }}
            />

            {/* Bio */}
            <p
              style={{
                fontFamily: "DM Sans,sans-serif",
                fontSize: "0.95rem",
                color: "var(--vestra-grey-light)",
                lineHeight: 1.8,
              }}
            >
              Luna Seila Timpani is the founder and visionary behind Vestra.
              Combining creativity, entrepreneurship, fashion, music, and
              digital innovation, she is building a platform where authenticated
              luxury meets storytelling and heritage. As a professional singer,
              model, creative director, and entrepreneur, Luna brings a unique
              multidisciplinary perspective that blends artistic excellence with
              forward-thinking curation. Her mission is to make provenance,
              authenticity, and meaning accessible to the next generation of
              collectors.
            </p>

            {/* Signature quote */}
            <blockquote
              style={{
                margin: 0,
                padding: "1rem 1.25rem",
                borderLeft: "3px solid var(--vestra-gold)",
                background: "var(--vestra-gold-muted)",
                borderRadius: "0 8px 8px 0",
              }}
            >
              <p
                style={{
                  fontFamily: "Playfair Display,serif",
                  fontStyle: "italic",
                  fontSize: "1.05rem",
                  color: "var(--vestra-gold-light)",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                &ldquo;Vintage, Pre Owned and Art is the New Luxury but you
                already know.&rdquo;
              </p>
            </blockquote>

            {/* Social links */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                alignItems: "center",
                marginTop: "0.25rem",
              }}
            >
              <SocialButton
                href="https://instagram.com"
                label="Instagram"
                ocid={`${ocidPrefix}.founder_spotlight.instagram_button`}
                hoverColor="#E1306C"
                hoverBg="rgba(225,48,108,0.12)"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  role="img"
                  aria-label="Instagram"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </SocialButton>

              <SocialButton
                href="https://linkedin.com"
                label="LinkedIn"
                ocid={`${ocidPrefix}.founder_spotlight.linkedin_button`}
                hoverColor="#0A66C2"
                hoverBg="rgba(10,102,194,0.12)"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  role="img"
                  aria-label="LinkedIn"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </SocialButton>

              <SocialButton
                href="https://vestra.space"
                label="Website"
                ocid={`${ocidPrefix}.founder_spotlight.website_button`}
                hoverColor="var(--vestra-gold)"
                hoverBg="var(--vestra-gold-muted)"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  role="img"
                  aria-label="Website"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </SocialButton>
            </div>
          </div>
        </div>

        {/* Bottom thumbnail strip */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "2rem",
            justifyContent: "center",
          }}
        >
          {[
            "/assets/images/founder-img1.jpg",
            "/assets/images/founder-vestra-copertina.png",
            "/assets/images/founder-img4.png",
            "/assets/images/founder-abu.png",
          ].map((src, i) => (
            <div
              key={src}
              style={{
                width: "80px",
                height: "100px",
                borderRadius: "8px",
                overflow: "hidden",
                border:
                  i === 1
                    ? "2px solid var(--vestra-gold)"
                    : "1px solid var(--vestra-border)",
                opacity: i === 1 ? 1 : 0.7,
                transition: "opacity 300ms, border-color 300ms",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.opacity = "1";
                el.style.borderColor = "var(--vestra-border-hover)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.opacity = i === 1 ? "1" : "0.7";
                el.style.borderColor =
                  i === 1 ? "var(--vestra-gold)" : "var(--vestra-border)";
              }}
            >
              <img
                src={src}
                alt=""
                aria-hidden="true"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface SocialButtonProps {
  href: string;
  label: string;
  ocid: string;
  hoverColor: string;
  hoverBg: string;
  children: React.ReactNode;
}

function SocialButton({
  href,
  label,
  ocid,
  hoverColor,
  hoverBg,
  children,
}: SocialButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      data-ocid={ocid}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        border: `1px solid ${hovered ? hoverColor : "var(--vestra-border)"}`,
        background: hovered ? hoverBg : "transparent",
        color: hovered ? hoverColor : "var(--vestra-grey-light)",
        textDecoration: "none",
        transition: "all 300ms cubic-bezier(0.25,0.46,0.45,0.94)",
        flexShrink: 0,
      }}
    >
      {children}
    </a>
  );
}
