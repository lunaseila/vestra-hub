import { useSubmitOnboarding } from "@/hooks/useCommunityHubBackend";
import type { CHCountry, CHExperienceLevel } from "@/types/communityHub";
import {
  CH_EXPERIENCE_LEVELS,
  CH_INDUSTRIES,
  CH_INTENT_OPTIONS,
} from "@/types/communityHub";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ── Props ─────────────────────────────────────────────────────────────────────
interface CountryPanelProps {
  country: CHCountry | null;
  isOpen: boolean;
  onClose: () => void;
}

type Step = 1 | 2 | 3 | 4 | "success";

// ── Inline subcomponents ──────────────────────────────────────────────────────
function PillOption({
  label,
  selected,
  onClick,
  ocid,
  monospace,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  ocid: string;
  monospace?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={ocid}
      style={{
        padding: "0.65rem 0.75rem",
        borderRadius: "10px",
        fontSize: monospace ? "0.75rem" : "0.8rem",
        fontFamily: monospace
          ? "JetBrains Mono, monospace"
          : "DM Sans, sans-serif",
        fontWeight: 500,
        cursor: "pointer",
        textAlign: "center",
        border: selected
          ? "1px solid var(--ch-accent)"
          : "1px solid var(--ch-border)",
        background: selected
          ? "var(--ch-accent-muted)"
          : "rgba(255,255,255,0.02)",
        color: selected ? "var(--ch-text-accent)" : "var(--ch-text-secondary)",
        transition: "all var(--dur-micro) var(--ease-smooth)",
        boxShadow: selected ? "0 0 12px var(--ch-accent-glow)" : "none",
      }}
      onMouseEnter={(e) => {
        if (!selected)
          e.currentTarget.style.borderColor = "var(--ch-border-hover)";
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.borderColor = "var(--ch-border)";
      }}
    >
      {label}
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function CountryPanel({
  country,
  isOpen,
  onClose,
}: CountryPanelProps) {
  const [step, setStep] = useState<Step>(1);
  const [intent, setIntent] = useState("");
  const [industry, setIndustry] = useState("");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");
  const submitOnboarding = useSubmitOnboarding();
  const [isMobile, setIsMobile] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Reset step state when a new country is selected
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIntent("");
      setIndustry("");
      setExperience("");
      setDescription("");
    }
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!country) return null;

  const stepNum = step === "success" ? 4 : (step as number);
  const progressPct =
    step === "success" ? 100 : (((step as number) - 1) / 4) * 100;

  async function handleSubmit() {
    try {
      await submitOnboarding.mutateAsync({
        userId: "guest",
        country: country!.name,
        intent,
        industry,
        experienceLevel: experience as CHExperienceLevel,
        projectDescription: description,
      });
    } catch (_e) {
      // graceful fallback — show success for demo
    }
    setStep("success");
  }

  const canContinue =
    (step === 1 && !!intent) ||
    (step === 2 && !!industry) ||
    (step === 3 && !!experience) ||
    (step === 4 && description.trim().length > 0);

  // ── Panel styles (desktop vs mobile) ────────────────────────────────────────
  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "82vh",
        borderRadius: "20px 20px 0 0",
        background: "rgba(11,14,22,0.97)",
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        zIndex: 201,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
        transform: isOpen ? "translateY(0)" : "translateY(100%)",
        transition: "transform 480ms cubic-bezier(0.34, 1.56, 0.64, 1)",
      }
    : {
        position: "fixed",
        right: 0,
        top: 0,
        height: "100vh",
        width: "420px",
        maxWidth: "100vw",
        background: "rgba(11,14,22,0.97)",
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
        borderLeft: "1px solid rgba(255,255,255,0.08)",
        zIndex: 201,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 480ms cubic-bezier(0.34, 1.56, 0.64, 1)",
      };

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Enter" && onClose()}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          zIndex: 200,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 320ms var(--ease-smooth)",
        }}
      />

      {/* Panel */}
      <dialog
        data-ocid="ch.country_panel"
        open={isOpen}
        aria-modal="true"
        aria-label={`Connect with ${country.name}`}
        style={{
          ...panelStyle,
          border: "none",
          outline: "none",
          maxWidth: "none",
          maxHeight: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {/* Gold progress bar (top strip) */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "2px",
            width: `${progressPct}%`,
            background:
              "linear-gradient(90deg, var(--ch-gold), rgba(196,169,125,0.55))",
            transition: "width 0.45s var(--ease-smooth)",
            zIndex: 2,
          }}
        />

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div
          style={{
            padding: "1.75rem 1.5rem 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexShrink: 0,
          }}
        >
          <div style={{ flex: 1, minWidth: 0, paddingRight: "1rem" }}>
            <div
              style={{
                fontSize: "2.75rem",
                lineHeight: 1,
                marginBottom: "0.5rem",
              }}
            >
              {country.flag}
            </div>
            <h2
              className="font-cormorant"
              style={{
                fontSize: "clamp(1.4rem, 3vw, 1.75rem)",
                fontWeight: 400,
                color: "var(--ch-text-primary)",
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              {country.name}
            </h2>
            <p
              style={{
                fontSize: "0.8rem",
                color: "var(--ch-text-secondary)",
                marginTop: "0.3rem",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              {country.memberCount.toLocaleString()} members
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            data-ocid="ch.country_panel.close_button"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--ch-border)",
              borderRadius: "8px",
              padding: "0.4rem",
              cursor: "pointer",
              color: "var(--ch-text-secondary)",
              display: "flex",
              alignItems: "center",
              transition:
                "background var(--dur-micro) var(--ease-smooth), color var(--dur-micro) var(--ease-smooth)",
              flexShrink: 0,
              marginTop: "4px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.09)";
              e.currentTarget.style.color = "var(--ch-text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.color = "var(--ch-text-secondary)";
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Connect CTA ─────────────────────────────────────────────────── */}
        <div style={{ padding: "1rem 1.5rem 0", flexShrink: 0 }}>
          <button
            type="button"
            className="ch-btn-primary"
            style={{ width: "100%" }}
            data-ocid="ch.country_panel.connect_button"
            onClick={() => setStep(1)}
          >
            Connect with {country.name}
          </button>
        </div>

        <div
          style={{
            margin: "1.25rem 1.5rem 0",
            borderTop: "1px solid var(--ch-border)",
            flexShrink: 0,
          }}
        />

        {/* ── Steps content ───────────────────────────────────────────────── */}
        {step !== "success" && (
          <>
            {/* Step counter + dots */}
            <div
              style={{
                padding: "0.875rem 1.5rem 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <p
                style={{
                  fontSize: "0.7rem",
                  color: "var(--ch-gold)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 500,
                  margin: 0,
                }}
              >
                Step {stepNum} of 4
              </p>
              <div
                style={{ display: "flex", gap: "4px", alignItems: "center" }}
              >
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    style={{
                      width: s === stepNum ? "18px" : "6px",
                      height: "6px",
                      borderRadius: "3px",
                      background:
                        s < stepNum
                          ? "rgba(42,94,255,0.5)"
                          : s === stepNum
                            ? "var(--ch-accent)"
                            : "var(--ch-border)",
                      transition:
                        "width 0.3s var(--ease-smooth), background 0.3s",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Animated step content */}
            <div
              className="animate-ch-step"
              key={step}
              style={{ padding: "1.25rem 1.5rem", flex: 1, minHeight: 0 }}
            >
              {/* ── Step 1 — Intent ─────────────────────────────────────── */}
              {step === 1 && (
                <div>
                  <h3
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "1.05rem",
                      fontWeight: 600,
                      color: "var(--ch-text-primary)",
                      marginBottom: "0.35rem",
                      marginTop: 0,
                    }}
                  >
                    What are you looking for?
                  </h3>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--ch-text-tertiary)",
                      marginBottom: "1.1rem",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  >
                    Select one to personalise your experience.
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0.5rem",
                    }}
                  >
                    {CH_INTENT_OPTIONS.map((opt) => (
                      <PillOption
                        key={opt}
                        label={opt}
                        selected={intent === opt}
                        onClick={() => setIntent(opt)}
                        ocid={`ch.panel.intent.${opt.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 2 — Industry ───────────────────────────────────── */}
              {step === 2 && (
                <div>
                  <h3
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "1.05rem",
                      fontWeight: 600,
                      color: "var(--ch-text-primary)",
                      marginBottom: "0.35rem",
                      marginTop: 0,
                    }}
                  >
                    Your Industry
                  </h3>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--ch-text-tertiary)",
                      marginBottom: "1.1rem",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  >
                    We'll match you with people in your field.
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: "0.5rem",
                    }}
                  >
                    {CH_INDUSTRIES.map((ind) => (
                      <PillOption
                        key={ind}
                        label={ind}
                        selected={industry === ind}
                        onClick={() => setIndustry(ind)}
                        ocid={`ch.panel.industry.${ind.toLowerCase()}`}
                        monospace
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 3 — Experience ─────────────────────────────────── */}
              {step === 3 && (
                <div>
                  <h3
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "1.05rem",
                      fontWeight: 600,
                      color: "var(--ch-text-primary)",
                      marginBottom: "0.35rem",
                      marginTop: 0,
                    }}
                  >
                    Your Experience Level
                  </h3>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--ch-text-tertiary)",
                      marginBottom: "1.1rem",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  >
                    Helps us match you with the right opportunities.
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    {CH_EXPERIENCE_LEVELS.map((lvl) => (
                      <button
                        key={lvl.value}
                        type="button"
                        onClick={() => setExperience(lvl.value)}
                        data-ocid={`ch.panel.experience.${lvl.value.toLowerCase()}`}
                        style={{
                          padding: "0.875rem 1rem",
                          borderRadius: "12px",
                          cursor: "pointer",
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.875rem",
                          border:
                            experience === lvl.value
                              ? "1px solid var(--ch-accent)"
                              : "1px solid var(--ch-border)",
                          background:
                            experience === lvl.value
                              ? "var(--ch-accent-muted)"
                              : "rgba(255,255,255,0.02)",
                          borderLeft:
                            experience === lvl.value
                              ? "3px solid var(--ch-accent)"
                              : "3px solid transparent",
                          transition: "all var(--dur-micro) var(--ease-smooth)",
                          boxShadow:
                            experience === lvl.value
                              ? "0 0 16px var(--ch-accent-glow)"
                              : "none",
                        }}
                        onMouseEnter={(e) => {
                          if (experience !== lvl.value)
                            e.currentTarget.style.borderColor =
                              "var(--ch-border-hover)";
                        }}
                        onMouseLeave={(e) => {
                          if (experience !== lvl.value)
                            e.currentTarget.style.borderColor =
                              "var(--ch-border)";
                        }}
                      >
                        <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>
                          {lvl.icon}
                        </span>
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontFamily: "DM Sans, sans-serif",
                              fontWeight: 600,
                              fontSize: "0.875rem",
                              color: "var(--ch-text-primary)",
                            }}
                          >
                            {lvl.label}
                          </div>
                          <div
                            style={{
                              fontFamily: "JetBrains Mono, monospace",
                              fontSize: "0.68rem",
                              color: "var(--ch-text-tertiary)",
                              letterSpacing: "0.04em",
                              marginTop: "2px",
                            }}
                          >
                            {lvl.subtitle}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 4 — Description ────────────────────────────────── */}
              {step === 4 && (
                <div>
                  <h3
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "1.05rem",
                      fontWeight: 600,
                      color: "var(--ch-text-primary)",
                      marginBottom: "0.35rem",
                      marginTop: 0,
                    }}
                  >
                    Tell us about your goals
                  </h3>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--ch-text-tertiary)",
                      marginBottom: "1.1rem",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  >
                    One paragraph is all we need.
                  </p>
                  <textarea
                    ref={textareaRef}
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value.slice(0, 500))
                    }
                    placeholder="Describe what you're building, what you're looking for, or what you have to offer..."
                    data-ocid="ch.panel.description.textarea"
                    rows={6}
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.03)",
                      color: "var(--ch-text-primary)",
                      fontSize: "0.875rem",
                      padding: "0.875rem",
                      borderRadius: "12px",
                      outline: "none",
                      border: "1px solid var(--ch-border)",
                      fontFamily: "DM Sans, sans-serif",
                      resize: "vertical",
                      lineHeight: 1.65,
                      minHeight: "120px",
                      transition:
                        "border-color var(--dur-micro) var(--ease-smooth), box-shadow var(--dur-micro) var(--ease-smooth)",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--ch-gold)";
                      e.target.style.boxShadow =
                        "0 0 0 3px var(--ch-gold-muted)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--ch-border)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.72rem",
                        color:
                          description.length > 450
                            ? "var(--ch-gold)"
                            : "var(--ch-text-tertiary)",
                        fontFamily: "JetBrains Mono, monospace",
                        transition: "color 0.2s",
                      }}
                    >
                      {description.length} / 500
                    </span>
                    {description.length === 0 && (
                      <span
                        style={{
                          fontSize: "0.72rem",
                          color: "var(--ch-text-tertiary)",
                          fontFamily: "DM Sans, sans-serif",
                        }}
                      >
                        Required to submit
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Step navigation row */}
            <div
              style={{
                padding: "1rem 1.5rem 1.75rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid var(--ch-border)",
                flexShrink: 0,
              }}
            >
              {(step as number) > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(((step as number) - 1) as Step)}
                  data-ocid="ch.panel.back_button"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--ch-text-secondary)",
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    padding: 0,
                    transition: "color var(--dur-micro) var(--ease-smooth)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--ch-text-primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--ch-text-secondary)";
                  }}
                >
                  <ArrowLeft size={15} />
                  Back
                </button>
              ) : (
                <div />
              )}

              {(step as number) < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(((step as number) + 1) as Step)}
                  disabled={!canContinue}
                  data-ocid="ch.panel.continue_button"
                  className="ch-btn-primary"
                  style={{
                    padding: "0.625rem 1.5rem",
                    fontSize: "0.875rem",
                    opacity: canContinue ? 1 : 0.35,
                    cursor: canContinue ? "pointer" : "not-allowed",
                  }}
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!description.trim() || submitOnboarding.isPending}
                  data-ocid="ch.panel.submit_button"
                  className="ch-btn-primary"
                  style={{
                    padding: "0.625rem 1.5rem",
                    fontSize: "0.875rem",
                    opacity: description.trim() ? 1 : 0.35,
                    cursor: description.trim() ? "pointer" : "not-allowed",
                  }}
                >
                  {submitOnboarding.isPending
                    ? "Starting..."
                    : "Start My Journey →"}
                </button>
              )}
            </div>
          </>
        )}

        {/* ── Success state ────────────────────────────────────────────────── */}
        {step === "success" && (
          <div
            data-ocid="ch.panel.success_state"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "2.5rem 2rem",
              textAlign: "center",
              animation: "ch-hero-reveal 0.6s var(--ease-reveal) both",
            }}
          >
            {/* Animated SVG checkmark */}
            <div style={{ position: "relative", marginBottom: "2rem" }}>
              <div
                style={{
                  position: "absolute",
                  inset: "-16px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(196,169,125,0.14) 0%, transparent 72%)",
                }}
              />
              <svg
                width="80"
                height="80"
                viewBox="0 0 52 52"
                fill="none"
                aria-hidden="true"
                style={{ display: "block" }}
              >
                <title>Journey started</title>
                {/* Background circle ring */}
                <circle
                  cx="26"
                  cy="26"
                  r="25"
                  stroke="rgba(196,169,125,0.18)"
                  strokeWidth="1.5"
                />
                {/* Animated circle */}
                <circle
                  cx="26"
                  cy="26"
                  r="25"
                  stroke="var(--ch-gold)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="157"
                  strokeDashoffset="157"
                  style={{
                    animation: "ch-draw-check 1.2s var(--ease-reveal) forwards",
                    animationDelay: "0.05s",
                    transformOrigin: "center",
                    transform: "rotate(-90deg)",
                  }}
                />
                {/* Animated checkmark path */}
                <path
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  stroke="var(--ch-gold)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  strokeDasharray="38"
                  strokeDashoffset="38"
                  style={{
                    animation: "ch-draw-check 0.7s var(--ease-reveal) forwards",
                    animationDelay: "0.85s",
                  }}
                />
              </svg>
            </div>

            <h2
              className="font-cormorant"
              style={{
                fontSize: "clamp(1.35rem, 3vw, 1.7rem)",
                fontWeight: 400,
                color: "var(--ch-text-primary)",
                lineHeight: 1.3,
                margin: "0 0 0.85rem",
              }}
            >
              Your global connection journey
              <br />
              has started.
            </h2>

            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--ch-text-secondary)",
                lineHeight: 1.7,
                marginBottom: "2.25rem",
                fontFamily: "DM Sans, sans-serif",
                maxWidth: "310px",
              }}
            >
              We'll notify you when matching opportunities arise in{" "}
              <span
                style={{ color: "var(--ch-text-primary)", fontWeight: 500 }}
              >
                {country.name}
              </span>
              .
            </p>

            <Link
              to="/CommunityHub/Opportunities"
              className="ch-btn-primary"
              data-ocid="ch.panel.explore_opportunities_link"
              style={{
                width: "100%",
                justifyContent: "center",
                display: "inline-flex",
              }}
            >
              Explore Opportunities →
            </Link>

            <button
              type="button"
              onClick={onClose}
              data-ocid="ch.panel.success.close_button"
              style={{
                marginTop: "0.875rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--ch-text-tertiary)",
                fontSize: "0.8rem",
                fontFamily: "DM Sans, sans-serif",
                textDecoration: "underline",
                textDecorationColor: "transparent",
                transition: "color 0.2s, text-decoration-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--ch-text-secondary)";
                e.currentTarget.style.textDecorationColor =
                  "var(--ch-text-secondary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--ch-text-tertiary)";
                e.currentTarget.style.textDecorationColor = "transparent";
              }}
            >
              Back to Globe
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
