interface VerifiedBadgeProps {
  className?: string;
}

export default function VerifiedBadge({ className }: VerifiedBadgeProps) {
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.375rem",
        padding: "0.2rem 0.5rem",
        borderRadius: "100px",
        background: "var(--vestra-verified-bg)",
        border: "1px solid var(--vestra-verified)",
        color: "var(--vestra-verified)",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "0.65rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "var(--vestra-verified)",
          flexShrink: 0,
        }}
      />
      Verified
    </span>
  );
}
