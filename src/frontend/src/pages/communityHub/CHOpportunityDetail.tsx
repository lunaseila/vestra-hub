import OpportunityCard from "@/components/communityHub/OpportunityCard";
import { MOCK_OPPORTUNITIES } from "@/types/communityHub";
import type { CHOpportunityType } from "@/types/communityHub";
import { Link, useParams } from "@tanstack/react-router";
import type React from "react";
import { useState } from "react";

// ─── Type meta ────────────────────────────────────────────────────────────────────
const TYPE_META: Record<
  CHOpportunityType,
  { bg: string; color: string; border: string; label: string }
> = {
  Job: {
    bg: "rgba(42,94,255,0.10)",
    color: "#99B8FF",
    border: "rgba(153,184,255,0.25)",
    label: "Job",
  },
  Partnership: {
    bg: "rgba(196,169,125,0.10)",
    color: "#C4A97D",
    border: "rgba(196,169,125,0.30)",
    label: "Partnership",
  },
  Freelance: {
    bg: "rgba(46,204,142,0.10)",
    color: "#2ECC8E",
    border: "rgba(46,204,142,0.30)",
    label: "Freelance",
  },
  Startup: {
    bg: "rgba(153,184,255,0.08)",
    color: "#99B8FF",
    border: "rgba(153,184,255,0.20)",
    label: "Startup Collab",
  },
  Investment: {
    bg: "rgba(255,180,50,0.10)",
    color: "#FFB432",
    border: "rgba(255,180,50,0.25)",
    label: "Investment",
  },
};

const STATUS_META: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  Active: {
    bg: "rgba(46,204,142,0.08)",
    color: "#2ECC8E",
    border: "rgba(46,204,142,0.25)",
  },
  Filled: {
    bg: "rgba(255,255,255,0.05)",
    color: "#7A8499",
    border: "rgba(255,255,255,0.1)",
  },
  Paused: {
    bg: "rgba(255,180,50,0.08)",
    color: "#FFB432",
    border: "rgba(255,180,50,0.2)",
  },
};

const REQUIREMENTS: Record<CHOpportunityType, string[]> = {
  Job: [
    "3+ years of directly relevant experience",
    "Strong communication and async collaboration skills",
    "Ability to operate in a fast-moving, high-trust environment",
    "Demonstrated ownership mentality and outcome focus",
    "Portfolio or case studies that speak for themselves",
  ],
  Partnership: [
    "Established track record in the target industry",
    "Network or distribution relevant to the partnership scope",
    "Clear value proposition and aligned commercial terms",
    "Willingness to commit to a 6–12 month engagement",
    "References from past strategic collaborations",
  ],
  Freelance: [
    "Strong portfolio demonstrating the required skill set",
    "Availability within the stated project timeline",
    "Responsive and structured working style",
    "Experience delivering at a professional / agency level",
    "Clear deliverables communication from day one",
  ],
  Startup: [
    "Technical or domain expertise in the startup's focus area",
    "Prior founding or early-stage startup experience preferred",
    "High risk tolerance and entrepreneurial mindset",
    "Able to commit meaningful time from the outset",
    "Aligned on long-term vision and equity-first compensation",
  ],
  Investment: [
    "Accredited investor status or institutional mandate",
    "Relevant sector experience to add strategic value",
    "Comfortable with early-stage illiquidity and timelines",
    "Capacity to lead or participate in future rounds",
    "Track record of supporting founders beyond the cheque",
  ],
};

// ─── Apply Modal ─────────────────────────────────────────────────────────────────────
function ApplyModal({
  opportunityTitle,
  company,
  onClose,
}: {
  opportunityTitle: string;
  company: string;
  onClose: () => void;
}) {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <dialog
      open
      aria-modal="true"
      aria-label={`Apply to ${opportunityTitle}`}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(7,9,14,0.90)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        border: "none",
        margin: 0,
        maxWidth: "100vw",
        maxHeight: "100vh",
        width: "100%",
        height: "100%",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-ocid="ch.opportunity.modal"
    >
      <div
        style={{
          maxWidth: 520,
          width: "100%",
          background: "var(--ch-bg-elevated)",
          border: "1px solid var(--ch-border-glow)",
          borderRadius: 20,
          padding: "2.25rem",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px var(--ch-border-glow)",
          animation: "ch-modal-reveal 480ms var(--ease-panel) both",
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          data-ocid="ch.opportunity.close_button"
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "none",
            border: "1px solid var(--ch-border)",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--ch-text-tertiary)",
            fontSize: "1rem",
            lineHeight: 1,
            transition: "all var(--dur-micro) var(--ease-smooth)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--ch-border-hover)";
            e.currentTarget.style.color = "var(--ch-text-primary)";
            e.currentTarget.style.background = "var(--ch-glass)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--ch-border)";
            e.currentTarget.style.color = "var(--ch-text-tertiary)";
            e.currentTarget.style.background = "none";
          }}
        >
          ×
        </button>

        {!submitted ? (
          <>
            <h2
              className="font-cormorant"
              style={{
                fontSize: "clamp(1.4rem, 2.5vw, 1.85rem)",
                fontWeight: 400,
                color: "var(--ch-text-primary)",
                marginTop: 0,
                marginBottom: "0.25rem",
                lineHeight: 1.25,
                paddingRight: "2rem",
              }}
            >
              Apply to {opportunityTitle}
            </h2>
            <p
              style={{
                fontSize: "0.82rem",
                color: "var(--ch-text-secondary)",
                fontFamily: "DM Sans, sans-serif",
                marginTop: 0,
                marginBottom: "1.75rem",
              }}
            >
              Posted by {company}
            </p>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 500))}
              placeholder="Describe what you're building, what you're looking for, or what you have to offer..."
              rows={6}
              data-ocid="ch.opportunity.textarea"
              style={{
                width: "100%",
                minHeight: 140,
                background: "var(--ch-bg-card)",
                border: "1px solid var(--ch-border)",
                borderRadius: 12,
                color: "var(--ch-text-primary)",
                padding: "1rem",
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.9rem",
                lineHeight: 1.65,
                resize: "vertical",
                outline: "none",
                transition:
                  "border-color var(--dur-micro) var(--ease-smooth), box-shadow var(--dur-micro) var(--ease-smooth)",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--ch-gold)";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px var(--ch-gold-muted)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--ch-border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <p
              style={{
                textAlign: "right",
                fontSize: "0.75rem",
                color:
                  message.length > 450
                    ? "var(--ch-gold)"
                    : "var(--ch-text-tertiary)",
                fontFamily: "JetBrains Mono, monospace",
                marginTop: "0.35rem",
                marginBottom: "1.5rem",
                transition: "color var(--dur-micro) var(--ease-smooth)",
              }}
            >
              {message.length} / 500
            </p>

            <button
              type="button"
              className="ch-btn-primary"
              style={{ width: "100%", borderRadius: 12, padding: "0.875rem" }}
              onClick={() => setSubmitted(true)}
              data-ocid="ch.opportunity.submit_button"
            >
              Submit Application
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                width: "100%",
                marginTop: "0.75rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--ch-text-secondary)",
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.875rem",
                padding: "0.5rem",
                transition: "color var(--dur-micro) var(--ease-smooth)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--ch-text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--ch-text-secondary)";
              }}
              data-ocid="ch.opportunity.cancel_button"
            >
              Cancel
            </button>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              padding: "2rem 0",
              animation: "ch-hero-reveal 600ms var(--ease-reveal) both",
            }}
            data-ocid="ch.opportunity.success_state"
          >
            {/* Animated checkmark */}
            <svg
              width="72"
              height="72"
              viewBox="0 0 72 72"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="36"
                cy="36"
                r="30"
                stroke="var(--ch-gold)"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="188"
                strokeDashoffset="188"
                style={{ animation: "ch-draw-check 1.5s ease-out 0.1s both" }}
              />
              <path
                d="M22 36l10 11 18-20"
                stroke="var(--ch-gold)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                strokeDasharray="44"
                strokeDashoffset="44"
                style={{ animation: "ch-draw-check 1s ease-out 0.9s both" }}
              />
            </svg>
            <h2
              className="font-cormorant"
              style={{
                fontSize: "1.8rem",
                fontWeight: 400,
                color: "var(--ch-text-primary)",
                margin: 0,
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              Application sent.
            </h2>
            <p
              style={{
                color: "var(--ch-text-secondary)",
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.9rem",
                textAlign: "center",
                maxWidth: 300,
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              We’ll notify you when{" "}
              <span style={{ color: "var(--ch-text-primary)" }}>{company}</span>{" "}
              responds.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="ch-btn-outlined"
              style={{ marginTop: "0.75rem", borderRadius: 12 }}
              data-ocid="ch.opportunity.close_button"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────────────
export default function CHOpportunityDetail() {
  const { id } = useParams({ strict: false }) as { id?: string };
  const [showModal, setShowModal] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const opportunity = MOCK_OPPORTUNITIES.find((o) => o.id === id);

  // Related: same type, exclude current, up to 3
  const related = MOCK_OPPORTUNITIES.filter(
    (o) => o.id !== id && o.type === opportunity?.type,
  ).slice(0, 3);

  // Fallback: if not enough same-type, add others
  const relatedFilled =
    related.length >= 3
      ? related
      : [
          ...related,
          ...MOCK_OPPORTUNITIES.filter(
            (o) => o.id !== id && o.type !== opportunity?.type,
          ).slice(0, 3 - related.length),
        ];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // —— Not found ————————————————————————————————————————————————————————————————
  if (!opportunity) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--ch-bg-surface)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          paddingTop: "64px",
          fontFamily: "DM Sans, sans-serif",
        }}
        data-ocid="ch.opportunity.error_state"
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "var(--ch-accent-muted)",
            border: "1px solid var(--ch-border-glow)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="14"
              cy="14"
              r="9"
              stroke="var(--ch-text-tertiary)"
              strokeWidth="1.5"
            />
            <path
              d="M21 21l5 5"
              stroke="var(--ch-text-tertiary)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1
          className="font-cormorant"
          style={{
            fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
            fontWeight: 400,
            color: "var(--ch-text-primary)",
            margin: 0,
            textAlign: "center",
          }}
        >
          Opportunity not found
        </h1>
        <p
          style={{
            color: "var(--ch-text-secondary)",
            margin: 0,
            fontSize: "0.9rem",
          }}
        >
          This listing may have been filled or removed.
        </p>
        <Link
          to="/CommunityHub/Opportunities"
          style={{
            color: "var(--ch-text-accent)",
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.875rem",
            textDecoration: "none",
            padding: "0.625rem 1.5rem",
            border: "1px solid var(--ch-border)",
            borderRadius: 100,
            transition: "all var(--dur-base) var(--ease-smooth)",
          }}
          data-ocid="ch.opportunity.back_button"
        >
          ← Back to Opportunities
        </Link>
      </div>
    );
  }

  const meta = TYPE_META[opportunity.type];
  const statusMeta = STATUS_META[opportunity.status] ?? STATUS_META.Active;
  const requirements = REQUIREMENTS[opportunity.type];
  const postedLabel =
    opportunity.postedDaysAgo === 0
      ? "Today"
      : opportunity.postedDaysAgo === 1
        ? "Yesterday"
        : `${opportunity.postedDaysAgo} days ago`;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--ch-bg-surface)",
        fontFamily: "DM Sans, sans-serif",
        color: "var(--ch-text-primary)",
      }}
      data-ocid="ch.opportunity.page"
    >
      {showModal && (
        <ApplyModal
          opportunityTitle={opportunity.title}
          company={opportunity.company}
          onClose={() => setShowModal(false)}
        />
      )}

      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "7rem 2rem 5rem",
        }}
      >
        {/* ── Breadcrumb ──────────────────────────────────────────────────────────────── */}
        <div
          style={{
            marginBottom: "2.5rem",
            animation: "ch-hero-reveal 0.6s var(--ease-reveal) both",
          }}
        >
          <Link
            to="/CommunityHub/Opportunities"
            style={{
              display: "inline-flex" as React.CSSProperties["display"],
              alignItems: "center",
              gap: "0.4rem",
              color: "var(--ch-text-secondary)",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.875rem",
              textDecoration: "none",
              marginBottom: "1.5rem",
              transition: "color var(--dur-micro) var(--ease-smooth)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color =
                "var(--ch-text-primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color =
                "var(--ch-text-secondary)";
            }}
            data-ocid="ch.opportunity.back_button"
          >
            ← Back to Opportunities
          </Link>

          {/* Category pill + status */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1rem",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.3rem 0.9rem",
                borderRadius: 100,
                fontSize: "0.72rem",
                fontFamily: "JetBrains Mono, monospace",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                background: meta.bg,
                color: meta.color,
                border: `1px solid ${meta.border}`,
              }}
            >
              {meta.label}
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                padding: "0.3rem 0.9rem",
                borderRadius: 100,
                fontSize: "0.72rem",
                fontFamily: "JetBrains Mono, monospace",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: statusMeta.bg,
                color: statusMeta.color,
                border: `1px solid ${statusMeta.border}`,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: statusMeta.color,
                  flexShrink: 0,
                }}
              />
              {opportunity.status}
            </span>
          </div>

          {/* Title */}
          <h1
            className="font-cormorant"
            style={{
              fontSize: "clamp(2rem, 3.5vw, 3.5rem)",
              fontWeight: 400,
              color: "var(--ch-text-primary)",
              margin: "0 0 1.25rem",
              lineHeight: 1.12,
            }}
          >
            {opportunity.title}
          </h1>

          {/* Meta row */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "0.5rem",
              paddingBottom: "2rem",
              borderBottom: "1px solid var(--ch-border)",
            }}
          >
            <span
              style={{
                fontSize: "0.875rem",
                color: "var(--ch-text-secondary)",
              }}
            >
              {opportunity.countryFlag} {opportunity.country}
            </span>
            <span
              style={{ color: "var(--ch-text-tertiary)", fontSize: "0.6rem" }}
            >
              •
            </span>
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.06em",
                color: "var(--ch-text-accent)",
                background: "var(--ch-accent-muted)",
                padding: "3px 10px",
                borderRadius: 6,
              }}
            >
              {opportunity.industry}
            </span>
            <span
              style={{ color: "var(--ch-text-tertiary)", fontSize: "0.6rem" }}
            >
              •
            </span>
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.72rem",
                color: "var(--ch-text-tertiary)",
                background: "rgba(255,255,255,0.04)",
                padding: "3px 10px",
                borderRadius: 6,
              }}
            >
              {opportunity.experienceRequired}
            </span>
            <span
              style={{ color: "var(--ch-text-tertiary)", fontSize: "0.6rem" }}
            >
              •
            </span>
            <span
              style={{ fontSize: "0.875rem", color: "var(--ch-text-tertiary)" }}
            >
              Posted {postedLabel}
            </span>
          </div>
        </div>

        {/* ── Two-column layout ───────────────────────────────────────────────────────── */}
        <div
          className="ch-detail-layout"
          style={{
            display: "flex",
            gap: "2.5rem",
            alignItems: "flex-start",
            animation: "ch-hero-reveal 0.6s var(--ease-reveal) both",
            animationDelay: "100ms",
          }}
        >
          {/* Left: main content — 60% */}
          <div style={{ flex: "0 0 60%", minWidth: 0 }}>
            {/* About section */}
            <p
              style={{
                fontSize: "0.72rem",
                fontFamily: "DM Sans, sans-serif",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 500,
                color: "var(--ch-text-tertiary)",
                marginBottom: "0.875rem",
                marginTop: 0,
              }}
            >
              About this Opportunity
            </p>
            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "1rem",
                lineHeight: 1.75,
                color: "var(--ch-text-secondary)",
                margin: 0,
              }}
            >
              {opportunity.description}
            </p>

            {/* What we’re looking for */}
            <h3
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 500,
                fontSize: "1rem",
                color: "var(--ch-text-primary)",
                marginTop: "2.5rem",
                marginBottom: "1rem",
              }}
            >
              What We’re Looking For
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.65rem",
              }}
            >
              {requirements.map((req) => (
                <li
                  key={req}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.65rem",
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.9rem",
                    color: "var(--ch-text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--ch-accent)",
                      marginTop: "0.5rem",
                      flexShrink: 0,
                    }}
                  />
                  {req}
                </li>
              ))}
            </ul>

            {/* Tags */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                marginTop: "2rem",
              }}
            >
              <span
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.72rem",
                  letterSpacing: "0.06em",
                  color: "var(--ch-text-accent)",
                  background: "var(--ch-accent-muted)",
                  border: "1px solid var(--ch-border)",
                  borderRadius: 8,
                  padding: "0.25rem 0.7rem",
                }}
              >
                {opportunity.industry}
              </span>
              <span
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.72rem",
                  letterSpacing: "0.06em",
                  color: "var(--ch-text-tertiary)",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--ch-border)",
                  borderRadius: 8,
                  padding: "0.25rem 0.7rem",
                }}
              >
                {opportunity.experienceRequired}
              </span>
              <span
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.72rem",
                  letterSpacing: "0.06em",
                  color: meta.color,
                  background: meta.bg,
                  border: `1px solid ${meta.border}`,
                  borderRadius: 8,
                  padding: "0.25rem 0.7rem",
                }}
              >
                {opportunity.type}
              </span>
            </div>
          </div>

          {/* Right: sidebar action card — 40% */}
          <div
            style={{
              flex: "0 0 calc(40% - 2.5rem)",
              width: "calc(40% - 2.5rem)",
              flexShrink: 0,
              position: "sticky",
              top: "6rem",
            }}
          >
            {/* Posted by card */}
            <div
              style={{
                background: "var(--ch-bg-elevated)",
                border: "1px solid var(--ch-border)",
                borderRadius: 16,
                padding: "1.5rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "1.25rem",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, var(--ch-accent-muted), var(--ch-bg-card))",
                    border: "2px solid var(--ch-accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "DM Sans, sans-serif",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    color: "var(--ch-text-accent)",
                    flexShrink: 0,
                  }}
                >
                  {opportunity.company.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      color: "var(--ch-text-primary)",
                      margin: "0 0 0.2rem",
                      lineHeight: 1.3,
                    }}
                  >
                    {opportunity.company}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "var(--ch-success)",
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "0.68rem",
                        color: "var(--ch-success)",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Verified Member
                    </span>
                  </div>
                </div>
              </div>

              <p
                style={{
                  fontSize: "0.82rem",
                  color: "var(--ch-text-secondary)",
                  fontFamily: "DM Sans, sans-serif",
                  margin: "0 0 1.25rem",
                }}
              >
                {opportunity.countryFlag} {opportunity.country}
              </p>

              {/* Match score */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "var(--ch-success-bg)",
                  border: "1px solid rgba(46,204,142,0.20)",
                  borderRadius: 10,
                  padding: "0.625rem 0.875rem",
                  marginBottom: "1.25rem",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontWeight: 600,
                      fontSize: "1rem",
                      color: "var(--ch-success)",
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    87% Match
                  </p>
                  <p
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "0.72rem",
                      color: "var(--ch-text-tertiary)",
                      margin: 0,
                      marginTop: "0.15rem",
                    }}
                  >
                    Based on your profile
                  </p>
                </div>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    stroke="var(--ch-success)"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    d="M6.5 10l2.5 2.5 4-5"
                    stroke="var(--ch-success)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Apply button */}
              <button
                type="button"
                onClick={() => setShowModal(true)}
                data-ocid="ch.opportunity.primary_button"
                style={{
                  width: "100%",
                  padding: "0.9375rem",
                  borderRadius: 100,
                  background: "var(--ch-accent)",
                  border: "none",
                  color: "#fff",
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 500,
                  fontSize: "0.9375rem",
                  cursor: "pointer",
                  transition:
                    "background var(--dur-base) var(--ease-smooth), box-shadow var(--dur-base) var(--ease-smooth), transform var(--dur-micro) var(--ease-smooth)",
                  marginBottom: "0.75rem",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--ch-accent-hover)";
                  e.currentTarget.style.boxShadow =
                    "0 0 24px var(--ch-accent-glow)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--ch-accent)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "scale(0.97)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Apply / Connect
              </button>

              {/* Save button */}
              <button
                type="button"
                onClick={() => setSaved((s) => !s)}
                data-ocid="ch.opportunity.secondary_button"
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  borderRadius: 100,
                  background: saved ? "var(--ch-gold-muted)" : "transparent",
                  border: `1px solid ${saved ? "var(--ch-gold)" : "var(--ch-border)"}`,
                  color: saved ? "var(--ch-gold)" : "var(--ch-text-secondary)",
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 400,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  transition: "all var(--dur-base) var(--ease-smooth)",
                }}
                onMouseEnter={(e) => {
                  if (!saved) {
                    e.currentTarget.style.borderColor =
                      "var(--ch-border-hover)";
                    e.currentTarget.style.color = "var(--ch-text-primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!saved) {
                    e.currentTarget.style.borderColor = "var(--ch-border)";
                    e.currentTarget.style.color = "var(--ch-text-secondary)";
                  }
                }}
              >
                {saved ? "♥ Saved" : "♡ Save Opportunity"}
              </button>
            </div>

            {/* Quick details card */}
            <div
              style={{
                background: "var(--ch-bg-card)",
                border: "1px solid var(--ch-border)",
                borderRadius: 16,
                padding: "1.25rem 1.5rem",
                marginBottom: "1rem",
              }}
            >
              {(
                [
                  {
                    label: "Country",
                    value: `${opportunity.countryFlag} ${opportunity.country}`,
                  },
                  {
                    label: "Type",
                    value: opportunity.type,
                    mono: true,
                    accent: true,
                  },
                  {
                    label: "Experience",
                    value: opportunity.experienceRequired,
                    mono: true,
                  },
                  { label: "Posted", value: postedLabel },
                  { label: "Applicants", value: "24 applicants" },
                ] as {
                  label: string;
                  value: string;
                  mono?: boolean;
                  accent?: boolean;
                }[]
              ).map(({ label, value, mono, accent }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.5rem 0",
                    borderBottom: "1px solid var(--ch-border)",
                    fontSize: "0.82rem",
                  }}
                >
                  <span
                    style={{
                      color: "var(--ch-text-tertiary)",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: mono
                        ? "JetBrains Mono, monospace"
                        : "DM Sans, sans-serif",
                      color: accent
                        ? "var(--ch-text-accent)"
                        : "var(--ch-text-primary)",
                      fontWeight: 500,
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
              <button
                type="button"
                onClick={handleShare}
                data-ocid="ch.opportunity.share_button"
                style={{
                  display: "block",
                  width: "100%",
                  marginTop: "1rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: copied ? "var(--ch-gold)" : "var(--ch-text-tertiary)",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.78rem",
                  textAlign: "center",
                  transition: "color var(--dur-micro) var(--ease-smooth)",
                  padding: "0.25rem",
                }}
                onMouseEnter={(e) => {
                  if (!copied) e.currentTarget.style.color = "var(--ch-gold)";
                }}
                onMouseLeave={(e) => {
                  if (!copied)
                    e.currentTarget.style.color = "var(--ch-text-tertiary)";
                }}
              >
                {copied ? "✓ Link copied" : "↗ Share this opportunity"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Related Opportunities ───────────────────────────────────────────────────────── */}
        {relatedFilled.length > 0 && (
          <div
            style={{
              marginTop: "4.5rem",
              animation: "ch-hero-reveal 0.6s var(--ease-reveal) both",
              animationDelay: "200ms",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "0.75rem",
                marginBottom: "1.75rem",
              }}
            >
              <h2
                className="font-cormorant"
                style={{
                  fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
                  fontWeight: 400,
                  color: "var(--ch-text-primary)",
                  margin: 0,
                }}
              >
                Related Opportunities
              </h2>
              <span
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.72rem",
                  color: "var(--ch-text-tertiary)",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--ch-border)",
                  padding: "2px 8px",
                  borderRadius: 6,
                }}
              >
                {relatedFilled.length} listed
              </span>
            </div>

            <div className="ch-related-grid">
              {relatedFilled.map((opp, i) => (
                <Link
                  key={opp.id}
                  to="/CommunityHub/Opportunities/$id"
                  params={{ id: opp.id }}
                  style={{ display: "block", textDecoration: "none" }}
                  data-ocid={`ch.opportunity.related.item.${i + 1}`}
                >
                  <OpportunityCard opportunity={opp} index={i} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .ch-detail-layout {
          flex-wrap: nowrap;
        }
        .ch-related-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 700px) {
          .ch-detail-layout {
            flex-direction: column !important;
          }
          .ch-detail-layout > div:last-child {
            width: 100% !important;
            flex: 1 !important;
            position: static !important;
          }
          .ch-related-grid {
            grid-template-columns: 1fr;
          }
        }
        @keyframes ch-modal-reveal {
          from { transform: translateY(32px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes ch-draw-check {
          from { stroke-dashoffset: var(--dash-len, 200); }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
