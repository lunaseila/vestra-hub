import { useStoreAccessRequest } from "@/hooks/useCommunityHubBackend";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type GatePhase = "hidden" | "form" | "confirmation" | "dismissed";

// ─── InvitationGate ──────────────────────────────────────────────────────────

export default function InvitationGate() {
  const [phase, setPhase] = useState<GatePhase>("hidden");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { mutateAsync: storeAccessRequest, isPending } =
    useStoreAccessRequest();
  const navigate = useNavigate();

  // ── Session gate check ────────────────────────────────────────────────────
  useEffect(() => {
    const stored = sessionStorage.getItem("vestra_hub_access");
    if (stored === "granted") {
      setPhase("dismissed");
      return;
    }

    // Show overlay after 5 seconds
    showTimerRef.current = setTimeout(() => {
      setPhase("form");
    }, 5000);

    return () => {
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
    };
  }, []);

  // ── Redirect after confirmation ────────────────────────────────────────────
  useEffect(() => {
    if (phase === "confirmation") {
      redirectTimerRef.current = setTimeout(() => {
        navigate({ to: "/Home" });
      }, 1800);
    }
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, [phase, navigate]);

  // ── Email validation ──────────────────────────────────────────────────────
  function validateEmail(value: string): boolean {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value.trim());
  }

  // ── Submit handler ────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");

    try {
      await storeAccessRequest(email.trim());
    } catch {
      // Stub — resolves successfully even on error
    }

    setPhase("confirmation");

    // After 2.5s show confirmation → fade out overlay
    setTimeout(() => {
      setPhase("dismissed");
      sessionStorage.setItem("vestra_hub_access", "granted");
    }, 2500);
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
    if (emailError) setEmailError("");
  }

  // ── Render nothing if dismissed or hidden ─────────────────────────────────
  if (phase === "hidden" || phase === "dismissed") return null;

  const isVisible = phase === "form" || phase === "confirmation";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="gate-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeIn" }}
          data-ocid="invitation_gate.dialog"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // Radial vignette
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(8,8,10,0.82) 0%, rgba(0,0,0,0.97) 100%)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          {/* Inner card */}
          <div
            style={{
              maxWidth: "480px",
              width: "90%",
              textAlign: "center",
              padding: "0 1.5rem",
            }}
          >
            <AnimatePresence mode="wait">
              {phase === "form" && (
                <motion.div
                  key="form-content"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {/* Decorative top line */}
                  <div
                    style={{
                      width: "40px",
                      height: "1px",
                      background: "rgba(196,169,125,0.6)",
                      margin: "0 auto 2rem",
                    }}
                  />

                  {/* Headline */}
                  <h2
                    style={{
                      fontFamily: "Playfair Display, serif",
                      fontStyle: "italic",
                      fontWeight: 400,
                      fontSize: "clamp(2rem, 6vw, 3rem)",
                      color: "#F5F0E8",
                      lineHeight: 1.2,
                      marginBottom: "1.25rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    You&rsquo;ve had a taste.
                  </h2>

                  {/* Subline */}
                  <p
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "1.0625rem",
                      color: "rgba(245,240,232,0.65)",
                      maxWidth: "380px",
                      margin: "0 auto 2.5rem",
                      lineHeight: 1.7,
                    }}
                  >
                    Request full access to explore the complete Vestra Hub
                    experience.
                  </p>

                  {/* Form */}
                  <form
                    onSubmit={handleSubmit}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                      alignItems: "center",
                    }}
                    noValidate
                  >
                    <div style={{ width: "100%", maxWidth: "360px" }}>
                      <input
                        data-ocid="invitation_gate.input"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Your email address"
                        autoComplete="email"
                        aria-label="Email address"
                        aria-describedby={
                          emailError ? "gate-email-error" : undefined
                        }
                        style={{
                          width: "100%",
                          background: "transparent",
                          border: "none",
                          borderBottom: emailError
                            ? "1px solid rgba(220,60,60,0.7)"
                            : "1px solid rgba(196,169,125,0.4)",
                          borderRadius: 0,
                          padding: "0.75rem 0",
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "1rem",
                          color: "#F5F0E8",
                          outline: "none",
                          textAlign: "center",
                          transition: "border-color 0.25s ease",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderBottomColor =
                            "rgba(196,169,125,0.85)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderBottomColor = emailError
                            ? "rgba(220,60,60,0.7)"
                            : "rgba(196,169,125,0.4)";
                        }}
                      />
                      {emailError && (
                        <p
                          id="gate-email-error"
                          data-ocid="invitation_gate.field_error"
                          style={{
                            fontFamily: "DM Sans, sans-serif",
                            fontSize: "0.78rem",
                            color: "rgba(220,100,100,0.9)",
                            marginTop: "0.5rem",
                            textAlign: "center",
                          }}
                        >
                          {emailError}
                        </p>
                      )}
                    </div>

                    <button
                      data-ocid="invitation_gate.submit_button"
                      type="submit"
                      disabled={isPending}
                      style={{
                        background: "#C4A97D",
                        color: "#0D0D0F",
                        border: "none",
                        borderRadius: 0,
                        padding: "0.875rem 2.5rem",
                        fontFamily: "DM Sans, sans-serif",
                        fontWeight: 600,
                        fontSize: "0.78rem",
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        cursor: isPending ? "wait" : "pointer",
                        marginTop: "0.5rem",
                        transition: "background 0.25s ease, opacity 0.2s ease",
                        opacity: isPending ? 0.7 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!isPending)
                          e.currentTarget.style.background = "#B8975F";
                      }}
                      onMouseLeave={(e) => {
                        if (!isPending)
                          e.currentTarget.style.background = "#C4A97D";
                      }}
                    >
                      {isPending ? "Requesting…" : "Request Access"}
                    </button>
                  </form>

                  {/* Decorative bottom line */}
                  <div
                    style={{
                      width: "40px",
                      height: "1px",
                      background: "rgba(196,169,125,0.3)",
                      margin: "2.5rem auto 0",
                    }}
                  />
                </motion.div>
              )}

              {phase === "confirmation" && (
                <motion.div
                  key="confirmation-content"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  data-ocid="invitation_gate.success_state"
                >
                  {/* Gold check mark */}
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      border: "1px solid rgba(196,169,125,0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 2rem",
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 10l4.5 4.5 8-8"
                        stroke="#C4A97D"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <p
                    style={{
                      fontFamily: "Playfair Display, serif",
                      fontStyle: "italic",
                      fontSize: "clamp(1.5rem, 4vw, 2rem)",
                      color: "#F5F0E8",
                      lineHeight: 1.4,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    You&rsquo;re on the list. We&rsquo;ll be in touch.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
