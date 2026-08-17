import { Check, Clock, Copy, Instagram, MapPin, Twitter } from "lucide-react";
import { useState } from "react";
import { SiPinterest } from "react-icons/si";

const SUBJECTS = [
  "General Inquiry",
  "Authentication Question",
  "Selling on Vestra",
  "Technical Support",
  "Other",
];

const inputBase: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  background: "var(--vestra-graphite)",
  border: "1px solid var(--vestra-border)",
  borderRadius: "4px",
  color: "var(--vestra-white)",
  fontFamily: "DM Sans,sans-serif",
  fontSize: "0.95rem",
  outline: "none",
  transition:
    "border-color var(--dur-micro) var(--ease-luxury),box-shadow var(--dur-micro) var(--ease-luxury)",
  boxSizing: "border-box",
};

function focusGold(
  e: React.FocusEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >,
) {
  e.target.style.borderColor = "var(--vestra-gold)";
  e.target.style.boxShadow = "0 0 0 3px var(--vestra-gold-muted)";
}
function blurReset(
  e: React.FocusEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >,
) {
  e.target.style.borderColor = "var(--vestra-border)";
  e.target.style.boxShadow = "none";
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "JetBrains Mono,monospace",
  fontSize: "0.68rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--vestra-grey)",
  marginBottom: "0.5rem",
};

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  function handleCopy(text: string, key: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div
      data-ocid="contact.page"
      style={{
        background: "var(--vestra-ink)",
        color: "var(--vestra-white)",
        minHeight: "100vh",
      }}
    >
      {/* Hero strip */}
      <section
        style={{
          padding:
            "clamp(4rem,8vw,8rem) clamp(1.5rem,5vw,5rem) clamp(2rem,4vw,4rem)",
          background:
            "linear-gradient(160deg,#0c0c10 0%,var(--vestra-ink) 100%)",
          borderBottom: "1px solid var(--vestra-border)",
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
              marginBottom: "1rem",
            }}
          >
            Contact
          </p>
          <h1
            style={{
              fontFamily: "Playfair Display,serif",
              fontSize: "clamp(2rem,4vw,3.5rem)",
              fontWeight: 400,
              color: "var(--vestra-white)",
              lineHeight: 1.1,
            }}
          >
            Get in touch
          </h1>
        </div>
      </section>

      {/* Two-column */}
      <section
        style={{
          padding: "clamp(3rem,6vw,6rem) clamp(1.5rem,5vw,5rem)",
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: "clamp(3rem,6vw,6rem)",
          alignItems: "start",
        }}
      >
        {/* Left */}
        <div>
          <p
            style={{
              fontFamily: "DM Sans,sans-serif",
              fontSize: "1.05rem",
              color: "var(--vestra-grey-light)",
              lineHeight: 1.7,
              marginBottom: "2.5rem",
            }}
          >
            We\u2019d love to hear from you. Whether you have a question about
            an item, need help with authentication, or want to start selling on
            Vestra \u2014 our team is here.
          </p>

          {/* General email */}
          <div style={{ marginBottom: "1.25rem" }}>
            <p style={labelStyle}>General</p>
            <button
              type="button"
              data-ocid="contact.copy_email_button"
              onClick={() => handleCopy("hello@vestra.co", "general")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
                color:
                  copied === "general"
                    ? "var(--vestra-verified)"
                    : "var(--vestra-gold)",
                fontFamily: "DM Sans,sans-serif",
                fontSize: "1rem",
                transition: "color var(--dur-micro) var(--ease-luxury)",
              }}
            >
              hello@vestra.co
              {copied === "general" ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>

          {/* Auth email */}
          <div style={{ marginBottom: "2.5rem" }}>
            <p style={labelStyle}>Authentication Inquiries</p>
            <button
              type="button"
              data-ocid="contact.copy_auth_email_button"
              onClick={() => handleCopy("authenticate@vestra.co", "auth")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
                color:
                  copied === "auth"
                    ? "var(--vestra-verified)"
                    : "var(--vestra-gold)",
                fontFamily: "DM Sans,sans-serif",
                fontSize: "1rem",
                transition: "color var(--dur-micro) var(--ease-luxury)",
              }}
            >
              authenticate@vestra.co
              {copied === "auth" ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>

          {/* Social */}
          <div style={{ marginBottom: "2.5rem" }}>
            <p style={labelStyle}>Follow Us</p>
            <div style={{ display: "flex", gap: "1rem" }}>
              {(
                [
                  {
                    icon: <Instagram size={18} />,
                    label: "Instagram",
                    href: "https://instagram.com",
                  },
                  {
                    icon: <Twitter size={18} />,
                    label: "Twitter",
                    href: "https://x.com",
                  },
                  {
                    icon: <SiPinterest size={18} />,
                    label: "Pinterest",
                    href: "https://pinterest.com",
                  },
                ] as { icon: React.ReactNode; label: string; href: string }[]
              ).map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  data-ocid={`contact.social_${s.label.toLowerCase()}_link`}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "1px solid var(--vestra-border)",
                    background: "var(--vestra-graphite)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--vestra-grey-light)",
                    textDecoration: "none",
                    transition:
                      "border-color var(--dur-micro) var(--ease-luxury),color var(--dur-micro) var(--ease-luxury)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = "var(--vestra-gold)";
                    el.style.color = "var(--vestra-gold)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = "var(--vestra-border)";
                    el.style.color = "var(--vestra-grey-light)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Address */}
          <div
            style={{
              padding: "1.25rem",
              border: "1px solid var(--vestra-border)",
              borderRadius: "4px",
              background: "var(--vestra-graphite)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start",
                marginBottom: "0.875rem",
              }}
            >
              <MapPin
                size={16}
                color="var(--vestra-gold)"
                style={{ flexShrink: 0, marginTop: "2px" }}
              />
              <div>
                <p
                  style={{
                    fontFamily: "DM Sans,sans-serif",
                    fontSize: "0.88rem",
                    color: "var(--vestra-white)",
                    marginBottom: "0.15rem",
                  }}
                >
                  Vestra HQ
                </p>
                <p
                  style={{
                    fontFamily: "DM Sans,sans-serif",
                    fontSize: "0.85rem",
                    color: "var(--vestra-grey-light)",
                  }}
                >
                  Via della Moda 12, Milan, Italy
                </p>
              </div>
            </div>
            <div
              style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
            >
              <Clock
                size={16}
                color="var(--vestra-gold)"
                style={{ flexShrink: 0 }}
              />
              <p
                style={{
                  fontFamily: "DM Sans,sans-serif",
                  fontSize: "0.85rem",
                  color: "var(--vestra-grey-light)",
                }}
              >
                Monday\u2013Friday, 9am\u20136pm CET
              </p>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div
          style={{
            padding: "clamp(1.5rem,3vw,2.5rem)",
            border: "1px solid var(--vestra-border)",
            borderRadius: "4px",
            background: "var(--vestra-graphite)",
          }}
        >
          {submitted ? (
            <div
              data-ocid="contact.success_state"
              style={{ textAlign: "center", padding: "3rem 1.5rem" }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "var(--vestra-gold-muted)",
                  border: "2px solid var(--vestra-gold)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                }}
              >
                <Check size={24} color="var(--vestra-gold)" />
              </div>
              <h3
                style={{
                  fontFamily: "Playfair Display,serif",
                  fontSize: "1.4rem",
                  fontWeight: 400,
                  color: "var(--vestra-white)",
                  marginBottom: "0.75rem",
                }}
              >
                Message sent.
              </h3>
              <p
                style={{
                  fontFamily: "DM Sans,sans-serif",
                  fontSize: "0.9rem",
                  color: "var(--vestra-grey-light)",
                  lineHeight: 1.65,
                }}
              >
                Thank you. We\u2019ll be in touch within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                <div>
                  <label htmlFor="contact-name" style={labelStyle}>
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    data-ocid="contact.name_input"
                    style={inputBase}
                    onFocus={focusGold}
                    onBlur={blurReset}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" style={labelStyle}>
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    data-ocid="contact.email_input"
                    style={inputBase}
                    onFocus={focusGold}
                    onBlur={blurReset}
                  />
                </div>
                <div>
                  <label htmlFor="contact-subject" style={labelStyle}>
                    Subject
                  </label>
                  <select
                    id="contact-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    data-ocid="contact.subject_select"
                    style={{
                      ...inputBase,
                      cursor: "pointer",
                      appearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B6B74' strokeWidth='1.5' fill='none' strokeLinecap='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                      paddingRight: "2.5rem",
                    }}
                    onFocus={focusGold}
                    onBlur={blurReset}
                  >
                    <option value="" style={{ background: "#1A1A1F" }}>
                      Select a subject
                    </option>
                    {SUBJECTS.map((s) => (
                      <option
                        key={s}
                        value={s}
                        style={{ background: "#1A1A1F" }}
                      >
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="contact-message" style={labelStyle}>
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                    placeholder="Tell us how we can help..."
                    rows={5}
                    data-ocid="contact.message_textarea"
                    style={{
                      ...inputBase,
                      resize: "vertical",
                      minHeight: "120px",
                    }}
                    onFocus={focusGold}
                    onBlur={blurReset}
                  />
                  <p
                    style={{
                      fontFamily: "JetBrains Mono,monospace",
                      fontSize: "0.65rem",
                      color:
                        message.length > 450
                          ? "var(--vestra-gold)"
                          : "var(--vestra-grey)",
                      textAlign: "right",
                      marginTop: "0.4rem",
                    }}
                  >
                    {message.length} / 500
                  </p>
                </div>
                <button
                  type="submit"
                  data-ocid="contact.submit_button"
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    borderRadius: "4px",
                    background: "var(--vestra-gold)",
                    color: "var(--vestra-black)",
                    fontFamily: "DM Sans,sans-serif",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    border: "none",
                    cursor: "pointer",
                    letterSpacing: "0.02em",
                    transition:
                      "background var(--dur-micro) var(--ease-luxury),transform var(--dur-micro) var(--ease-luxury)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = "var(--vestra-gold-light)";
                    el.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = "var(--vestra-gold)";
                    el.style.transform = "translateY(0)";
                  }}
                >
                  Send Message
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
