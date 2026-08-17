import { useUpdateUserProfile } from "@/hooks/useCommunityHubBackend";
import {
  CH_EXPERIENCE_LEVELS,
  CH_INDUSTRIES,
  CH_INTENT_OPTIONS,
  FEATURED_COUNTRIES,
} from "@/types/communityHub";
import type {
  CHCountry,
  CHExperienceLevel,
  CHUserRole,
} from "@/types/communityHub";
import { useNavigate } from "@tanstack/react-router";
import { Check, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ─── Particles ─────────────────────────────────────────────────────────────
const PARTICLE_COUNT = 30;
const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  top: 20 + Math.random() * 75,
  size: 1 + Math.random() * 2,
  opacity: 0.2 + Math.random() * 0.35,
  duration: 8 + Math.random() * 12,
  delay: Math.random() * 8,
}));

// ─── Constants ──────────────────────────────────────────────────────────────
const TOTAL_STEPS = 6;

const ROLE_OPTIONS: {
  value: CHUserRole;
  emoji: string;
  label: string;
  description: string;
}[] = [
  {
    value: "Company",
    emoji: "🏢",
    label: "Company / Startup",
    description: "Building products & teams",
  },
  {
    value: "Freelancer",
    emoji: "💼",
    label: "Freelancer",
    description: "Independent professional",
  },
  {
    value: "Startup",
    emoji: "🚀",
    label: "Startup Founder",
    description: "Early-stage venture",
  },
  {
    value: "Investor",
    emoji: "💡",
    label: "Investor",
    description: "Funding the future",
  },
];

// Extended country list
const ALL_COUNTRIES = [
  ...FEATURED_COUNTRIES,
  {
    name: "Australia",
    flag: "🇦🇺",
    memberCount: 620,
    description: "",
    lat: -25,
    lng: 133,
  },
  {
    name: "Canada",
    flag: "🇨🇦",
    memberCount: 1100,
    description: "",
    lat: 56,
    lng: -96,
  },
  {
    name: "Japan",
    flag: "🇯🇵",
    memberCount: 850,
    description: "",
    lat: 36,
    lng: 138,
  },
  {
    name: "South Korea",
    flag: "🇰🇷",
    memberCount: 540,
    description: "",
    lat: 36,
    lng: 128,
  },
  {
    name: "Netherlands",
    flag: "🇳🇱",
    memberCount: 720,
    description: "",
    lat: 52,
    lng: 5,
  },
  {
    name: "Sweden",
    flag: "🇸🇪",
    memberCount: 490,
    description: "",
    lat: 60,
    lng: 18,
  },
  {
    name: "Switzerland",
    flag: "🇨🇭",
    memberCount: 380,
    description: "",
    lat: 47,
    lng: 8,
  },
  {
    name: "Brazil",
    flag: "🇧🇷",
    memberCount: 960,
    description: "",
    lat: -15,
    lng: -47,
  },
  {
    name: "India",
    flag: "🇮🇳",
    memberCount: 2200,
    description: "",
    lat: 20,
    lng: 78,
  },
  {
    name: "Israel",
    flag: "🇮🇱",
    memberCount: 430,
    description: "",
    lat: 31,
    lng: 35,
  },
];

interface FormData {
  name: string;
  role: CHUserRole | null;
  industries: string[];
  country: CHCountry | null;
  experienceLevel: CHExperienceLevel | null;
  intent: string | null;
  bio: string;
  avatarFile: File | null;
  avatarPreview: string;
}

// ─── Step Header ────────────────────────────────────────────────────────────
function StepHeader({
  stepNum,
  title,
  subtitle,
  canSkip,
  onSkip,
}: {
  stepNum: number;
  title: string;
  subtitle: string;
  canSkip?: boolean;
  onSkip?: () => void;
}) {
  return (
    <div style={{ marginBottom: "2.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.75rem",
        }}
      >
        <p
          style={{
            fontSize: "0.72rem",
            fontFamily: "DM Sans, sans-serif",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--ch-gold)",
            margin: 0,
          }}
        >
          Step {stepNum} of {TOTAL_STEPS}
        </p>
        {canSkip && (
          <button
            type="button"
            onClick={onSkip}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--ch-text-tertiary)",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.8rem",
              textDecoration: "underline",
              padding: 0,
              transition: "color var(--dur-micro) var(--ease-smooth)",
            }}
          >
            Skip for now
          </button>
        )}
      </div>
      <h2
        style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: "clamp(1.9rem, 4vw, 2.8rem)",
          fontWeight: 400,
          color: "var(--ch-text-primary)",
          lineHeight: 1.15,
          marginBottom: "0.6rem",
          margin: "0 0 0.6rem",
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontSize: "1rem",
          color: "var(--ch-text-secondary)",
          fontFamily: "DM Sans, sans-serif",
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}

// ─── Progress Bar ────────────────────────────────────────────────────────────
function ProgressIndicator({ current }: { current: number }) {
  return (
    <div
      aria-label={`Step ${current} of ${TOTAL_STEPS}`}
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={TOTAL_STEPS}
      tabIndex={0}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 2rem 2.5rem",
        position: "relative",
        zIndex: 10,
      }}
    >
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const num = i + 1;
        const completed = num < current;
        const active = num === current;
        return (
          <div
            key={`prog-${num}`}
            style={{ display: "flex", alignItems: "center" }}
          >
            <div
              style={{
                width: active ? "38px" : "30px",
                height: active ? "38px" : "30px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: completed
                  ? "var(--ch-success)"
                  : active
                    ? "var(--ch-accent)"
                    : "var(--ch-bg-elevated)",
                border: active
                  ? "2px solid var(--ch-accent)"
                  : completed
                    ? "none"
                    : "1px solid var(--ch-border)",
                color: completed || active ? "#fff" : "var(--ch-text-tertiary)",
                fontSize: "0.75rem",
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 600,
                transition: "all var(--dur-base) var(--ease-smooth)",
                flexShrink: 0,
                boxShadow: active ? "0 0 16px var(--ch-accent-glow)" : "none",
              }}
            >
              {completed ? <Check size={13} strokeWidth={2.5} /> : num}
            </div>
            {num < TOTAL_STEPS && (
              <div
                style={{
                  width: "clamp(20px, 4.5vw, 52px)",
                  height: "2px",
                  background: completed
                    ? "var(--ch-accent)"
                    : "var(--ch-border)",
                  transition: "background var(--dur-base) var(--ease-smooth)",
                  flexShrink: 0,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function CHOnboarding() {
  const navigate = useNavigate();
  const updateProfile = useUpdateUserProfile();

  const [step, setStep] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [isComplete, setIsComplete] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    role: null,
    industries: [],
    country: null,
    experienceLevel: null,
    intent: null,
    bio: "",
    avatarFile: null,
    avatarPreview: "",
  });

  const [countrySearch, setCountrySearch] = useState("");
  const [showCountryList, setShowCountryList] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);

  const filteredCountries = useMemo(
    () =>
      ALL_COUNTRIES.filter((c) =>
        c.name.toLowerCase().includes(countrySearch.toLowerCase()),
      ),
    [countrySearch],
  );

  // Close country dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        countryRef.current &&
        !countryRef.current.contains(e.target as Node)
      ) {
        setShowCountryList(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Auto-redirect after completion
  useEffect(() => {
    if (!isComplete) return;
    const timer = setTimeout(() => {
      navigate({ to: "/CommunityHub/Dashboard" });
    }, 2800);
    return () => clearTimeout(timer);
  }, [isComplete, navigate]);

  function toggleIndustry(ind: string) {
    setFormData((prev) => {
      if (prev.industries.includes(ind)) {
        return {
          ...prev,
          industries: prev.industries.filter((i) => i !== ind),
        };
      }
      if (prev.industries.length >= 3) return prev;
      return { ...prev, industries: [...prev.industries, ind] };
    });
  }

  const processFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) =>
      setFormData((prev) => ({
        ...prev,
        avatarFile: file,
        avatarPreview: e.target?.result as string,
      }));
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file?.type.startsWith("image/")) processFile(file);
    },
    [processFile],
  );

  function canProceed(): boolean {
    if (step === 1) return formData.name.trim().length > 0;
    if (step === 2) return formData.role !== null;
    return true;
  }

  function transitionTo(nextStep: number, dir: "forward" | "back") {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      setAnimating(false);
    }, 280);
  }

  function handleNext() {
    if (!canProceed()) return;
    if (step < TOTAL_STEPS) {
      transitionTo(step + 1, "forward");
    } else {
      handleComplete();
    }
  }

  function handleBack() {
    if (step > 1) transitionTo(step - 1, "back");
  }

  function handleSkip() {
    if (step < TOTAL_STEPS) {
      transitionTo(step + 1, "forward");
    } else {
      handleComplete();
    }
  }

  async function handleComplete() {
    try {
      await updateProfile.mutateAsync({
        userId: "current",
        name: formData.name,
        bio: formData.bio,
        role: formData.role ?? undefined,
        industries: formData.industries,
        country: formData.country?.name ?? "",
        experienceLevel: formData.experienceLevel ?? undefined,
      });
    } catch {
      // Best-effort — proceed regardless
    }
    setIsComplete(true);
  }

  const stepAnimation = animating
    ? direction === "forward"
      ? "ch-step-exit-left 280ms var(--ease-smooth) both"
      : "ch-step-exit-right 280ms var(--ease-smooth) both"
    : direction === "forward"
      ? "ch-step-in 320ms var(--ease-smooth) both"
      : "ch-step-in-right 320ms var(--ease-smooth) both";

  return (
    <div
      data-ocid="ch.onboarding.page"
      style={{
        minHeight: "100vh",
        background: "var(--ch-bg-base)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ── Ambient glow ──────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 50% at 50% 10%, rgba(42,94,255,0.07) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Floating particles ────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: "50%",
              background: "var(--ch-text-primary)",
              opacity: p.opacity,
              animation: `ch-float-particle ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ── Header wordmark ───────────────────────────── */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          padding: "1.5rem 2rem",
          position: "relative",
          zIndex: 10,
        }}
      >
        <a
          href="/CommunityHub/Home"
          data-ocid="ch.onboarding.back_home_link"
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontStyle: "italic",
            fontSize: "1.3rem",
            color: "var(--ch-gold)",
            letterSpacing: "0.02em",
            textDecoration: "none",
            transition: "opacity var(--dur-micro) var(--ease-smooth)",
          }}
        >
          Community Hub
        </a>
      </header>

      {/* ── Progress indicator ────────────────────────── */}
      {!isComplete && <ProgressIndicator current={step} />}

      {/* ── Main content ──────────────────────────────── */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "0 1.5rem 7rem",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ width: "100%", maxWidth: "560px" }}>
          {!isComplete ? (
            <div
              ref={stepRef}
              key={`step-${step}-${animating ? "out" : "in"}`}
              style={{ animation: stepAnimation }}
            >
              {/* ═══ STEP 1 — WELCOME ═════════════════════════ */}
              {step === 1 && (
                <div>
                  <StepHeader
                    stepNum={1}
                    title="Welcome to Community Hub"
                    subtitle="Let's personalize your experience in 6 quick steps."
                  />
                  <div>
                    <label
                      htmlFor="ch-name"
                      style={{
                        display: "block",
                        fontSize: "0.72rem",
                        fontFamily: "DM Sans, sans-serif",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--ch-text-tertiary)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Your Name
                    </label>
                    <input
                      id="ch-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="How should we call you?"
                      className="ch-input"
                      autoComplete="name"
                      data-ocid="ch.onboarding.name_input"
                      style={{ fontSize: "1rem", padding: "0.875rem 1rem" }}
                    />
                  </div>
                </div>
              )}

              {/* ═══ STEP 2 — ROLE ════════════════════════════ */}
              {step === 2 && (
                <div>
                  <StepHeader
                    stepNum={2}
                    title="What describes you best?"
                    subtitle="This helps us match you with the right opportunities."
                  />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0.875rem",
                    }}
                  >
                    {ROLE_OPTIONS.map((r) => {
                      const isSelected = formData.role === r.value;
                      return (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, role: r.value }))
                          }
                          data-ocid={`ch.onboarding.role.${r.value.toLowerCase()}_button`}
                          aria-pressed={isSelected}
                          style={{
                            padding: "1.375rem 1.25rem",
                            borderRadius: "16px",
                            border: isSelected
                              ? "2px solid var(--ch-accent)"
                              : "1px solid var(--ch-border)",
                            background: isSelected
                              ? "var(--ch-accent-muted)"
                              : "var(--ch-bg-card)",
                            cursor: "pointer",
                            textAlign: "left",
                            transition:
                              "all var(--dur-base) var(--ease-smooth)",
                            boxShadow: isSelected
                              ? "0 0 32px var(--ch-accent-glow)"
                              : "none",
                            borderLeft: isSelected
                              ? "3px solid var(--ch-accent)"
                              : undefined,
                            transform: isSelected
                              ? "translateY(-2px)"
                              : undefined,
                          }}
                        >
                          <div
                            style={{
                              fontSize: "2rem",
                              marginBottom: "0.625rem",
                              lineHeight: 1,
                            }}
                          >
                            {r.emoji}
                          </div>
                          <div
                            style={{
                              fontFamily: "DM Sans, sans-serif",
                              fontWeight: 500,
                              fontSize: "0.95rem",
                              color: isSelected
                                ? "var(--ch-text-primary)"
                                : "var(--ch-text-secondary)",
                              marginBottom: "0.25rem",
                            }}
                          >
                            {r.label}
                          </div>
                          <div
                            style={{
                              fontFamily: "DM Sans, sans-serif",
                              fontSize: "0.77rem",
                              color: "var(--ch-text-tertiary)",
                            }}
                          >
                            {r.description}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ═══ STEP 3 — INDUSTRIES ══════════════════════ */}
              {step === 3 && (
                <div>
                  <StepHeader
                    stepNum={3}
                    title="Your Industries"
                    subtitle="Select up to 3 industries you work in."
                    canSkip
                    onSkip={handleSkip}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.625rem",
                    }}
                  >
                    {CH_INDUSTRIES.map((ind) => {
                      const isSelected = formData.industries.includes(ind);
                      const maxReached =
                        formData.industries.length >= 3 && !isSelected;
                      return (
                        <button
                          key={ind}
                          type="button"
                          onClick={() => toggleIndustry(ind)}
                          disabled={maxReached}
                          data-ocid={`ch.onboarding.industry.${ind.toLowerCase()}_checkbox`}
                          aria-pressed={isSelected}
                          style={{
                            padding: "0.5rem 1.25rem",
                            borderRadius: "100px",
                            fontSize: "0.85rem",
                            fontFamily: "DM Sans, sans-serif",
                            cursor: maxReached ? "not-allowed" : "pointer",
                            border: isSelected
                              ? "1px solid var(--ch-accent)"
                              : "1px solid var(--ch-border)",
                            background: isSelected
                              ? "var(--ch-accent-muted)"
                              : "transparent",
                            color: isSelected
                              ? "var(--ch-text-accent)"
                              : "var(--ch-text-secondary)",
                            opacity: maxReached ? 0.4 : 1,
                            transition:
                              "all var(--dur-micro) var(--ease-smooth)",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.35rem",
                          }}
                        >
                          {isSelected && <Check size={11} strokeWidth={2.5} />}
                          {ind}
                        </button>
                      );
                    })}
                  </div>
                  {formData.industries.length === 3 && (
                    <p
                      style={{
                        marginTop: "0.875rem",
                        fontSize: "0.78rem",
                        color: "var(--ch-gold)",
                        fontFamily: "DM Sans, sans-serif",
                      }}
                    >
                      Maximum 3 selected
                    </p>
                  )}
                </div>
              )}

              {/* ═══ STEP 4 — COUNTRY ════════════════════════ */}
              {step === 4 && (
                <div>
                  <StepHeader
                    stepNum={4}
                    title="Where are you based?"
                    subtitle="We'll show you opportunities in your region first."
                    canSkip
                    onSkip={handleSkip}
                  />
                  <div ref={countryRef} style={{ position: "relative" }}>
                    {/* Search input */}
                    <div style={{ position: "relative" }}>
                      {formData.country && (
                        <span
                          style={{
                            position: "absolute",
                            left: "1rem",
                            top: "50%",
                            transform: "translateY(-50%)",
                            fontSize: "1.15rem",
                            pointerEvents: "none",
                            zIndex: 1,
                          }}
                        >
                          {formData.country.flag}
                        </span>
                      )}
                      <input
                        type="text"
                        value={countrySearch}
                        onChange={(e) => {
                          setCountrySearch(e.target.value);
                          setFormData((prev) => ({ ...prev, country: null }));
                          setShowCountryList(true);
                        }}
                        onFocus={() => setShowCountryList(true)}
                        placeholder={
                          formData.country
                            ? `${formData.country.flag} ${formData.country.name}`
                            : "Search country..."
                        }
                        className="ch-input"
                        data-ocid="ch.onboarding.country_search_input"
                        style={{
                          paddingLeft: formData.country ? "2.75rem" : "1rem",
                          fontSize: "1rem",
                          padding: formData.country
                            ? "0.875rem 2.75rem"
                            : "0.875rem 1rem",
                        }}
                      />
                      <ChevronDown
                        size={16}
                        style={{
                          position: "absolute",
                          right: "1rem",
                          top: "50%",
                          transform: `translateY(-50%) rotate(${showCountryList ? "180deg" : "0deg"})`,
                          color: "var(--ch-text-tertiary)",
                          transition:
                            "transform var(--dur-micro) var(--ease-smooth)",
                          pointerEvents: "none",
                        }}
                      />
                    </div>

                    {showCountryList && (
                      <div
                        // biome-ignore lint/a11y/useSemanticElements: custom-styled dropdown needs div not select
                        role="listbox"
                        aria-label="Country options"
                        tabIndex={-1}
                        style={{
                          position: "absolute",
                          top: "calc(100% + 8px)",
                          left: 0,
                          right: 0,
                          background: "var(--ch-bg-elevated)",
                          border: "1px solid var(--ch-border)",
                          borderRadius: "14px",
                          maxHeight: "240px",
                          overflowY: "auto",
                          zIndex: 50,
                          boxShadow: "0 12px 48px rgba(0,0,0,0.5)",
                          animation:
                            "ch-modal-reveal 200ms var(--ease-reveal) both",
                        }}
                      >
                        {filteredCountries.length === 0 ? (
                          <div
                            style={{
                              padding: "1.25rem",
                              fontFamily: "DM Sans, sans-serif",
                              fontSize: "0.85rem",
                              color: "var(--ch-text-tertiary)",
                              textAlign: "center",
                            }}
                          >
                            No countries found
                          </div>
                        ) : (
                          filteredCountries.map((c) => {
                            const isChosen = formData.country?.name === c.name;
                            return (
                              <button
                                key={c.name}
                                type="button"
                                aria-selected={isChosen}
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    country: c,
                                  }));
                                  setCountrySearch(c.name);
                                  setShowCountryList(false);
                                }}
                                data-ocid={`ch.onboarding.country.${c.name.toLowerCase().replace(/\s+/g, "_")}_button`}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.75rem",
                                  padding: "0.75rem 1rem",
                                  width: "100%",
                                  background: isChosen
                                    ? "var(--ch-accent-muted)"
                                    : "transparent",
                                  border: "none",
                                  cursor: "pointer",
                                  color: isChosen
                                    ? "var(--ch-text-primary)"
                                    : "var(--ch-text-secondary)",
                                  fontFamily: "DM Sans, sans-serif",
                                  fontSize: "0.88rem",
                                  textAlign: "left",
                                  transition: "background var(--dur-micro)",
                                }}
                              >
                                <span
                                  style={{ fontSize: "1.2rem", lineHeight: 1 }}
                                >
                                  {c.flag}
                                </span>
                                <span style={{ flex: 1 }}>{c.name}</span>
                                {"memberCount" in c && (
                                  <span
                                    style={{
                                      fontSize: "0.72rem",
                                      color: "var(--ch-text-tertiary)",
                                      fontFamily: "JetBrains Mono, monospace",
                                    }}
                                  >
                                    {(
                                      c as CHCountry
                                    ).memberCount.toLocaleString()}
                                  </span>
                                )}
                                {isChosen && (
                                  <Check
                                    size={14}
                                    style={{
                                      color: "var(--ch-accent)",
                                      flexShrink: 0,
                                    }}
                                  />
                                )}
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ═══ STEP 5 — INTENT ════════════════════════ */}
              {step === 5 && (
                <div>
                  <StepHeader
                    stepNum={5}
                    title="What are you here for?"
                    subtitle="What best describes your current goal?"
                    canSkip
                    onSkip={handleSkip}
                  />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0.75rem",
                    }}
                  >
                    {CH_INTENT_OPTIONS.map((opt) => {
                      const isSelected = formData.intent === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, intent: opt }))
                          }
                          data-ocid={`ch.onboarding.intent.${opt.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_button`}
                          aria-pressed={isSelected}
                          style={{
                            padding: "0.875rem 1rem",
                            borderRadius: "12px",
                            border: isSelected
                              ? "1px solid var(--ch-accent)"
                              : "1px solid var(--ch-border)",
                            background: isSelected
                              ? "var(--ch-accent-muted)"
                              : "transparent",
                            color: isSelected
                              ? "var(--ch-text-primary)"
                              : "var(--ch-text-secondary)",
                            fontFamily: "DM Sans, sans-serif",
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            textAlign: "left",
                            transition:
                              "all var(--dur-micro) var(--ease-smooth)",
                            boxShadow: isSelected
                              ? "0 0 16px var(--ch-accent-glow)"
                              : "none",
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ═══ STEP 6 — PROFILE PHOTO + BIO ════════════ */}
              {step === 6 && (
                <div>
                  <StepHeader
                    stepNum={6}
                    title="Almost there!"
                    subtitle="Add a photo and a quick intro."
                    canSkip
                    onSkip={handleSkip}
                  />

                  {/* Avatar upload */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      marginBottom: "2.5rem",
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) processFile(file);
                      }}
                      data-ocid="ch.onboarding.photo_upload_button"
                      aria-label="Upload profile photo"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragOver(true);
                      }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={handleDrop}
                      aria-label="Upload or drag a profile photo"
                      style={{
                        width: "108px",
                        height: "108px",
                        borderRadius: "50%",
                        border: isDragOver
                          ? "2px solid var(--ch-accent)"
                          : formData.avatarPreview
                            ? "2px solid var(--ch-accent)"
                            : "2px dashed var(--ch-border)",
                        background: isDragOver
                          ? "var(--ch-accent-muted)"
                          : formData.avatarPreview
                            ? "transparent"
                            : "var(--ch-bg-card)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        transition: "all var(--dur-base) var(--ease-smooth)",
                        flexShrink: 0,
                        boxShadow:
                          isDragOver || formData.avatarPreview
                            ? "0 0 24px var(--ch-accent-glow)"
                            : undefined,
                        padding: 0,
                        outline: "none",
                      }}
                    >
                      {formData.avatarPreview ? (
                        <img
                          src={formData.avatarPreview}
                          alt="Profile preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div style={{ textAlign: "center" }}>
                          {/* Camera icon SVG */}
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--ch-text-tertiary)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ margin: "0 auto 0.25rem" }}
                            aria-hidden="true"
                          >
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                            <circle cx="12" cy="13" r="4" />
                          </svg>
                          <div
                            style={{
                              fontSize: "0.65rem",
                              color: "var(--ch-text-tertiary)",
                              fontFamily: "DM Sans, sans-serif",
                              letterSpacing: "0.05em",
                            }}
                          >
                            Upload
                          </div>
                        </div>
                      )}
                    </button>
                    <p
                      style={{
                        marginTop: "0.75rem",
                        fontSize: "0.72rem",
                        color: "var(--ch-text-tertiary)",
                        fontFamily: "DM Sans, sans-serif",
                        textAlign: "center",
                      }}
                    >
                      JPG or PNG, max 2MB
                    </p>
                  </div>

                  {/* Bio textarea */}
                  <div>
                    <label
                      htmlFor="ch-bio"
                      style={{
                        display: "block",
                        fontSize: "0.72rem",
                        fontFamily: "DM Sans, sans-serif",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--ch-text-tertiary)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Short Bio
                    </label>
                    <textarea
                      id="ch-bio"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bio: e.target.value.slice(0, 200),
                        }))
                      }
                      placeholder="Tell people what you do and what you're building..."
                      rows={4}
                      className="ch-input"
                      style={{ resize: "none", minHeight: "100px" }}
                      data-ocid="ch.onboarding.bio_textarea"
                    />
                    <p
                      style={{
                        textAlign: "right",
                        fontSize: "0.72rem",
                        color:
                          formData.bio.length > 180
                            ? "var(--ch-gold)"
                            : "var(--ch-text-tertiary)",
                        marginTop: "0.375rem",
                        fontFamily: "JetBrains Mono, monospace",
                        transition: "color var(--dur-micro)",
                      }}
                    >
                      {formData.bio.length} / 200
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ═══ COMPLETION STATE ═══════════════════════════════ */
            <div
              data-ocid="ch.onboarding.success_state"
              style={{
                textAlign: "center",
                position: "fixed",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--ch-bg-base)",
                zIndex: 100,
                padding: "2rem",
              }}
            >
              {/* Radial gold glow */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "480px",
                  height: "480px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(196,169,125,0.12) 0%, transparent 70%)",
                  animation: "ch-hero-reveal 1s var(--ease-reveal) both",
                  pointerEvents: "none",
                }}
              />

              {/* Animated checkmark */}
              <svg
                width="96"
                height="96"
                viewBox="0 0 96 96"
                fill="none"
                aria-hidden="true"
                style={{
                  marginBottom: "2rem",
                  position: "relative",
                  zIndex: 1,
                  filter: "drop-shadow(0 0 20px rgba(196,169,125,0.4))",
                }}
              >
                <title>Profile complete</title>
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  stroke="var(--ch-gold)"
                  strokeWidth="1.5"
                  strokeDasharray={`${2 * Math.PI * 38}`}
                  strokeDashoffset={`${2 * Math.PI * 38}`}
                  style={{
                    animation:
                      "ch-draw-check 0.9s var(--ease-reveal) 0.1s forwards",
                    opacity: 0.5,
                  }}
                />
                <polyline
                  points="28,48 42,62 68,32"
                  stroke="var(--ch-gold)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  style={{
                    strokeDasharray: 68,
                    strokeDashoffset: 68,
                    animation:
                      "ch-draw-check 0.7s var(--ease-reveal) 0.8s forwards",
                  }}
                />
              </svg>

              <h2
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "clamp(2.4rem, 5vw, 4rem)",
                  fontWeight: 400,
                  color: "var(--ch-text-primary)",
                  marginBottom: "0.875rem",
                  lineHeight: 1.1,
                  position: "relative",
                  zIndex: 1,
                  opacity: 0,
                  animation:
                    "ch-hero-reveal 0.7s var(--ease-reveal) 0.9s forwards",
                }}
              >
                You're all set.
              </h2>

              <p
                style={{
                  fontSize: "1.05rem",
                  color: "var(--ch-text-secondary)",
                  fontFamily: "DM Sans, sans-serif",
                  lineHeight: 1.65,
                  maxWidth: "400px",
                  position: "relative",
                  zIndex: 1,
                  opacity: 0,
                  animation:
                    "ch-hero-reveal 0.7s var(--ease-reveal) 1.2s forwards",
                  marginBottom: "2.5rem",
                }}
              >
                Your profile is ready. Let's find your first opportunity.
              </p>

              <button
                type="button"
                onClick={() => navigate({ to: "/CommunityHub/Dashboard" })}
                className="ch-btn-primary"
                data-ocid="ch.onboarding.goto_dashboard_button"
                style={{
                  position: "relative",
                  zIndex: 1,
                  opacity: 0,
                  animation:
                    "ch-hero-reveal 0.7s var(--ease-reveal) 1.5s forwards",
                }}
              >
                Go to Dashboard →
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ── Fixed navigation footer ────────────────────── */}
      {!isComplete && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.25rem 2rem",
            background: "rgba(7,9,14,0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderTop: "1px solid var(--ch-border)",
            zIndex: 50,
          }}
        >
          {/* Back */}
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              data-ocid="ch.onboarding.back_button"
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
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          {/* Continue */}
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
            className="ch-btn-primary"
            data-ocid={
              step === TOTAL_STEPS
                ? "ch.onboarding.submit_button"
                : "ch.onboarding.continue_button"
            }
            style={{
              padding: "0.75rem 2rem",
              fontSize: "0.9rem",
              opacity: canProceed() ? 1 : 0.38,
              cursor: canProceed() ? "pointer" : "not-allowed",
            }}
          >
            {step === TOTAL_STEPS
              ? "Complete Setup →"
              : step === 1
                ? "Get Started →"
                : "Continue →"}
          </button>
        </div>
      )}
    </div>
  );
}
