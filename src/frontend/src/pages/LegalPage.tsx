import { Link } from "@tanstack/react-router";

type LegalType =
  | "privacy"
  | "terms"
  | "returns"
  | "shipping"
  | "seller"
  | "authentication"
  | "faq";

const CONTENT: Record<
  LegalType,
  {
    eyebrow: string;
    title: string;
    sections: Array<{ heading: string; body: string }>;
  }
> = {
  privacy: {
    eyebrow: "Privacy",
    title: "Privacy Policy",
    sections: [
      {
        heading: "Legal copy required",
        body: "This page is a production placeholder. Vestra must provide jurisdiction-specific privacy language before launch, including data collection, processing purposes, retention, user rights, processors, international transfers, and contact details.",
      },
      {
        heading: "Implementation scope",
        body: "The application should connect this page to final analytics, email, authentication, payment, and CRM providers once credentials and legal review are complete.",
      },
    ],
  },
  terms: {
    eyebrow: "Terms",
    title: "Terms & Conditions",
    sections: [
      {
        heading: "Legal copy required",
        body: "Final customer marketplace terms must be supplied separately. They should define buyer obligations, seller obligations, authentication limitations, payment handling, order cancellation, dispute handling, account rules, and platform liability.",
      },
    ],
  },
  returns: {
    eyebrow: "Returns",
    title: "Returns & Refunds",
    sections: [
      {
        heading: "Policy required",
        body: "Final return windows, accepted reasons, condition requirements, refund timing, excluded categories, and cross-border return handling must be provided before launch.",
      },
    ],
  },
  shipping: {
    eyebrow: "Shipping",
    title: "Shipping Policy",
    sections: [
      {
        heading: "Provider configuration required",
        body: "Shipping rates, available countries, duties, taxes, insurance, carrier service levels, and tracking notifications should be generated from a shipping provider integration instead of hardcoded copy.",
      },
    ],
  },
  seller: {
    eyebrow: "Seller Terms",
    title: "Seller Terms",
    sections: [
      {
        heading: "Seller legal copy required",
        body: "Final seller terms should cover submission warranties, authenticity obligations, commission, payout timing, rejected items, consignment handling, prohibited goods, and dispute resolution.",
      },
    ],
  },
  authentication: {
    eyebrow: "Authentication",
    title: "Authentication Policy",
    sections: [
      {
        heading: "Authentication protocol required",
        body: "Vestra should publish a reviewed authentication policy explaining inspection standards, evidence requirements, Digital Fashion Passport issuance, limitations, and how disputes are handled.",
      },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Frequently Asked Questions",
    sections: [
      {
        heading: "How does Vestra authenticate pieces?",
        body: "Authentication workflow copy should be finalized with Vestra's authentication team. The current product architecture supports item status, passport issuance, and provenance records.",
      },
      {
        heading: "Can I sell on Vestra?",
        body: "Yes. The seller submission flow captures item information for review. Production launch requires image storage, review operations, seller terms, and notification services.",
      },
      {
        heading: "Are payments live?",
        body: "Stripe architecture is prepared through environment-based configuration requirements. Live payments require Stripe credentials and webhook deployment.",
      },
    ],
  },
};

export default function LegalPage({ type }: { type: LegalType }) {
  const page = CONTENT[type];

  return (
    <div
      data-ocid={`legal.${type}.page`}
      style={{ minHeight: "100vh", background: "#ffffff", color: "#111111" }}
    >
      <section
        style={{
          padding: "clamp(3rem, 7vw, 6rem) clamp(1.25rem, 5vw, 5rem)",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <div style={{ maxWidth: "980px", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#888888",
              marginBottom: "0.75rem",
            }}
          >
            {page.eyebrow}
          </p>
          <h1
            style={{
              fontSize: "clamp(2.2rem, 5vw, 4.5rem)",
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            {page.title}
          </h1>
        </div>
      </section>

      <section
        style={{ padding: "clamp(2rem, 5vw, 4rem) clamp(1.25rem, 5vw, 5rem)" }}
      >
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <div
            style={{
              border: "1px solid #111111",
              padding: "1rem",
              marginBottom: "2rem",
              fontSize: "0.92rem",
              lineHeight: 1.6,
            }}
          >
            Placeholder content only. Final legal text must be reviewed and
            supplied before production launch.
          </div>

          {page.sections.map((section) => (
            <section key={section.heading} style={{ marginBottom: "2rem" }}>
              <h2
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 400,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "0.75rem",
                }}
              >
                {section.heading}
              </h2>
              <p style={{ color: "#555555", lineHeight: 1.75 }}>
                {section.body}
              </p>
            </section>
          ))}

          <Link
            to="/Contact"
            style={{ color: "#111111", textUnderlineOffset: "4px" }}
          >
            Contact Vestra
          </Link>
        </div>
      </section>
    </div>
  );
}
