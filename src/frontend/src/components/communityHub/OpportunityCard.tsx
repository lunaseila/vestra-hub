import type { CHOpportunity, CHOpportunityType } from "@/types/communityHub";

const TYPE_META: Record<
  CHOpportunityType,
  { bg: string; color: string; label: string }
> = {
  Job: { bg: "rgba(42,94,255,0.12)", color: "#99B8FF", label: "Job" },
  Partnership: {
    bg: "rgba(196,169,125,0.12)",
    color: "#C4A97D",
    label: "Partnership",
  },
  Freelance: {
    bg: "rgba(46,204,142,0.12)",
    color: "#2ECC8E",
    label: "Freelance",
  },
  Startup: {
    bg: "rgba(153,184,255,0.10)",
    color: "#99B8FF",
    label: "Startup Collab",
  },
  Investment: {
    bg: "rgba(255,180,50,0.10)",
    color: "#FFB432",
    label: "Investment",
  },
};

interface OpportunityCardProps {
  opportunity: CHOpportunity;
  onClick?: () => void;
  index?: number;
}

export default function OpportunityCard({
  opportunity,
  onClick,
  index = 0,
}: OpportunityCardProps) {
  const daysLabel =
    opportunity.postedDaysAgo === 0
      ? "Today"
      : opportunity.postedDaysAgo === 1
        ? "Yesterday"
        : `${opportunity.postedDaysAgo}d ago`;

  const meta = TYPE_META[opportunity.type];

  return (
    <article
      className="ch-card"
      style={{
        padding: "1.5rem",
        cursor: onClick ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        animation: "ch-hero-reveal 0.5s var(--ease-reveal) both",
        animationDelay: `${index * 60}ms`,
      }}
      onClick={onClick}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && onClick) onClick();
      }}
      role={onClick ? "button" : "article"}
      tabIndex={onClick ? 0 : undefined}
      data-ocid={`ch.opportunity.item.${index + 1}`}
    >
      {/* Category pill + posted meta */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.875rem",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "0.2rem 0.65rem",
            borderRadius: "100px",
            fontSize: "0.66rem",
            fontFamily: "JetBrains Mono, monospace",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            background: meta.bg,
            color: meta.color,
            border: `1px solid ${meta.color}33`,
            fontWeight: 500,
          }}
        >
          {meta.label}
        </span>
        <span
          style={{
            fontSize: "0.72rem",
            color: "var(--ch-text-tertiary)",
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          {daysLabel}
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontWeight: 600,
          fontSize: "0.9375rem",
          color: "var(--ch-text-primary)",
          marginBottom: "0.3rem",
          lineHeight: 1.4,
          marginTop: 0,
        }}
      >
        {opportunity.title}
      </h3>

      {/* Company */}
      <p
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "0.8125rem",
          color: "var(--ch-text-secondary)",
          marginBottom: "1rem",
          marginTop: 0,
          fontWeight: 400,
        }}
      >
        {opportunity.company}
      </p>

      {/* Meta tags row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.375rem",
          marginBottom: "1.25rem",
          alignItems: "center",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            fontSize: "0.78rem",
            color: "var(--ch-text-secondary)",
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          {opportunity.countryFlag} {opportunity.country}
        </span>
        <span
          style={{
            fontSize: "0.6rem",
            color: "var(--ch-text-tertiary)",
            padding: "0 2px",
          }}
        >
          •
        </span>
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.68rem",
            color: "var(--ch-text-accent)",
            letterSpacing: "0.04em",
            background: "rgba(153,184,255,0.08)",
            padding: "2px 8px",
            borderRadius: "4px",
          }}
        >
          {opportunity.industry}
        </span>
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.68rem",
            color: "var(--ch-text-tertiary)",
            letterSpacing: "0.04em",
            background: "rgba(255,255,255,0.04)",
            padding: "2px 8px",
            borderRadius: "4px",
          }}
        >
          {opportunity.experienceRequired}
        </span>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Action */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        style={{
          background: "rgba(42,94,255,0.06)",
          border: "1px solid var(--ch-border)",
          borderRadius: "8px",
          padding: "0.5rem 1rem",
          fontSize: "0.8rem",
          color: "var(--ch-text-accent)",
          cursor: "pointer",
          fontFamily: "DM Sans, sans-serif",
          fontWeight: 500,
          transition:
            "border-color var(--dur-micro) var(--ease-smooth), background var(--dur-micro) var(--ease-smooth), color var(--dur-micro) var(--ease-smooth)",
          width: "100%",
          textAlign: "center",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--ch-border-hover)";
          e.currentTarget.style.background = "rgba(42,94,255,0.12)";
          e.currentTarget.style.color = "var(--ch-text-primary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--ch-border)";
          e.currentTarget.style.background = "rgba(42,94,255,0.06)";
          e.currentTarget.style.color = "var(--ch-text-accent)";
        }}
        data-ocid="ch.opportunity.view_button"
      >
        View Details →
      </button>
    </article>
  );
}
