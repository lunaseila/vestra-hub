import ItemCard from "@/components/shared/ItemCard";
import { MOCK_ITEMS, PERSONALITY_ARCHETYPES } from "@/types";
import type { PersonalityArchetype } from "@/types";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const QUESTIONS = [
  {
    id: "wardrobe",
    text: "Which word describes your ideal wardrobe?",
    options: ["Minimal", "Classic", "Bold", "Eclectic", "Timeless"],
  },
  {
    id: "decade",
    text: "Choose your decade.",
    options: ["'60s", "'70s", "'80s", "'90s", "'00s"],
  },
  {
    id: "occasion",
    text: "Your occasion.",
    options: ["Everyday", "Evening", "Work", "Weekend", "Red Carpet"],
  },
  {
    id: "icon",
    text: "Choose your style icon.",
    options: [
      { label: "The Minimalist", emoji: "◻", desc: "Clean lines. Pure form." },
      { label: "The Icon", emoji: "⭐", desc: "Timeless and magnetic." },
      { label: "The Rebel", emoji: "⚡", desc: "Rules were made for others." },
      { label: "The Romantic", emoji: "🌹", desc: "Soft power. Quiet beauty." },
      {
        label: "The Power Dresser",
        emoji: "◆",
        desc: "Structure. Presence. Control.",
      },
    ],
  },
  {
    id: "palette",
    text: "Your colour world.",
    options: [
      { label: "Neutral Tone", colors: ["#D4C5B0", "#C8B89A", "#B8A080"] },
      { label: "Dark Power", colors: ["#0A0A0E", "#1A1A2E", "#4A0010"] },
      { label: "Vibrant Pop", colors: ["#CC2222", "#C4A97D", "#1A7A3A"] },
      { label: "Earth Modern", colors: ["#C4703A", "#7A8A3A", "#A09080"] },
      { label: "Icy Cool", colors: ["#F0F2F5", "#C0C8D4", "#A8B8C8"] },
    ],
  },
];

function getArchetype(answers: string[]): PersonalityArchetype {
  const [wardrobe, decade, , icon] = answers;
  if (icon === "The Minimalist" || wardrobe === "Minimal")
    return PERSONALITY_ARCHETYPES[4];
  if (icon === "The Power Dresser" || wardrobe === "Bold")
    return PERSONALITY_ARCHETYPES[2];
  if (icon === "The Rebel" || wardrobe === "Eclectic")
    return PERSONALITY_ARCHETYPES[5];
  if (decade === "'70s" || decade === "'80s") return PERSONALITY_ARCHETYPES[3];
  if (wardrobe === "Classic" || wardrobe === "Timeless")
    return PERSONALITY_ARCHETYPES[0];
  return PERSONALITY_ARCHETYPES[1];
}

export default function PersonalityTest() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [sliding, setSliding] = useState(false);
  const [slideDir, setSlideDir] = useState<"in" | "out">("in");
  const [showResult, setShowResult] = useState(false);
  const [bgPhase, setBgPhase] = useState(0);

  const bgColors = [
    "linear-gradient(135deg, #0A0A1A 0%, #0F0F12 100%)",
    "linear-gradient(135deg, #0F0F12 0%, #120810 100%)",
    "linear-gradient(135deg, #120810 0%, #0A0A1A 100%)",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgPhase((p) => (p + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  function handleSelect(option: string) {
    setSelected(option);
  }

  function handleNext() {
    if (!selected) return;
    const newAnswers = [...answers, selected];
    setSlideDir("out");
    setSliding(true);
    setTimeout(() => {
      setAnswers(newAnswers);
      setSelected(null);
      if (currentQ + 1 >= QUESTIONS.length) {
        setShowResult(true);
      } else {
        setCurrentQ((q) => q + 1);
      }
      setSlideDir("in");
      setTimeout(() => setSliding(false), 50);
    }, 350);
  }

  function handleRetake() {
    setCurrentQ(0);
    setAnswers([]);
    setSelected(null);
    setShowResult(false);
    setSliding(false);
  }

  const archetype = showResult ? getArchetype(answers) : null;
  const progress = ((currentQ + (selected ? 1 : 0)) / QUESTIONS.length) * 100;
  const q = QUESTIONS[currentQ];

  const slideStyle: React.CSSProperties = {
    transform: sliding
      ? slideDir === "out"
        ? "translateX(-60px)"
        : "translateX(60px)"
      : "translateX(0)",
    opacity: sliding ? 0 : 1,
    transition:
      "transform 350ms var(--ease-luxury), opacity 350ms var(--ease-luxury)",
  };

  if (showResult && archetype) {
    const resultItems = MOCK_ITEMS.slice(0, 6);
    return (
      <div
        data-ocid="personality_test.result.page"
        style={{
          minHeight: "100vh",
          background: bgColors[bgPhase],
          transition: "background 4s ease-in-out",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "5rem 1.5rem",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "4rem",
            maxWidth: "640px",
          }}
        >
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "1rem",
              color: "var(--vestra-grey)",
              marginBottom: "0.5rem",
              animation: "luxury-reveal 0.8s var(--ease-reveal) both",
            }}
          >
            You are
          </p>
          <h1
            style={{
              fontFamily: "Playfair Display, Georgia, serif",
              fontSize: "clamp(2.8rem, 6vw, 6rem)",
              fontWeight: 400,
              color: "var(--vestra-gold)",
              lineHeight: 1.1,
              marginBottom: "1.5rem",
              animation: "luxury-reveal 0.9s 0.15s var(--ease-reveal) both",
            }}
          >
            {archetype.name}
          </h1>
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "1.1rem",
              color: "var(--vestra-grey-light)",
              lineHeight: 1.8,
              marginBottom: "1rem",
              animation: "luxury-reveal 0.9s 0.3s var(--ease-reveal) both",
            }}
          >
            {archetype.description}
          </p>
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "1rem",
              color: "var(--vestra-grey)",
              lineHeight: 1.75,
              animation: "luxury-reveal 0.9s 0.45s var(--ease-reveal) both",
            }}
          >
            Your aesthetic is defined by a deep understanding of what endures.
            You invest in pieces that transcend seasons — objects that speak of
            taste rather than trend, of restraint rather than excess.
          </p>
        </div>

        <div
          style={{ width: "100%", maxWidth: "1200px", marginBottom: "4rem" }}
        >
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.75rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--vestra-gold)",
              textAlign: "center",
              marginBottom: "2rem",
              animation: "luxury-reveal 0.9s 0.6s var(--ease-reveal) both",
            }}
          >
            Your curated picks
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            {resultItems.map((item, i) => (
              <ItemCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link
            to="/Archive"
            data-ocid="personality_test.shop_cta.link"
            className="btn-gold"
          >
            Shop Your Style
          </Link>
          <button
            type="button"
            onClick={handleRetake}
            data-ocid="personality_test.retake.button"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--vestra-grey-light)",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.875rem",
              cursor: "pointer",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            Retake Test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      data-ocid="personality_test.page"
      style={{
        minHeight: "100vh",
        background: bgColors[bgPhase],
        transition: "background 4s ease-in-out",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Progress bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "var(--vestra-graphite)",
          zIndex: 100,
        }}
      >
        <div
          data-ocid="personality_test.progress_bar"
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "var(--vestra-gold)",
            transition: "width 600ms var(--ease-reveal)",
          }}
        />
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "6rem 1.5rem 4rem",
          ...slideStyle,
        }}
      >
        {/* Step label */}
        <p
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--vestra-gold)",
            marginBottom: "1.5rem",
          }}
        >
          {currentQ + 1} / {QUESTIONS.length}
        </p>

        {/* Question */}
        <h2
          style={{
            fontFamily: "Playfair Display, Georgia, serif",
            fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
            fontWeight: 400,
            color: "var(--vestra-white)",
            textAlign: "center",
            marginBottom: "3rem",
            maxWidth: "680px",
            lineHeight: 1.2,
          }}
        >
          {q.text}
        </h2>

        {/* Q4 — style icons */}
        {q.id === "icon" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "1rem",
              width: "100%",
              maxWidth: "900px",
              marginBottom: "3rem",
            }}
          >
            {(
              q.options as { label: string; emoji: string; desc: string }[]
            ).map((opt) => (
              <button
                key={opt.label}
                type="button"
                data-ocid={`personality_test.option.${opt.label.toLowerCase().replace(/\s+/g, "_")}`}
                onClick={() => handleSelect(opt.label)}
                style={{
                  padding: "1.5rem 1rem",
                  borderRadius: "12px",
                  background:
                    selected === opt.label
                      ? "var(--vestra-gold-muted)"
                      : "var(--vestra-graphite)",
                  border: `1px solid ${
                    selected === opt.label
                      ? "var(--vestra-gold)"
                      : "var(--vestra-border)"
                  }`,
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all var(--dur-base) var(--ease-luxury)",
                  boxShadow:
                    selected === opt.label
                      ? "0 0 24px var(--vestra-gold-glow)"
                      : "none",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>
                  {opt.emoji}
                </div>
                <p
                  style={{
                    fontFamily: "Playfair Display, Georgia, serif",
                    fontSize: "1rem",
                    color: "var(--vestra-white)",
                    marginBottom: "0.4rem",
                  }}
                >
                  {opt.label}
                </p>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.8rem",
                    color: "var(--vestra-grey-light)",
                  }}
                >
                  {opt.desc}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Q5 — colour palettes */}
        {q.id === "palette" && (
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "3rem",
              maxWidth: "900px",
            }}
          >
            {(q.options as { label: string; colors: string[] }[]).map((opt) => (
              <button
                key={opt.label}
                type="button"
                data-ocid={`personality_test.palette.${opt.label.toLowerCase().replace(/\s+/g, "_")}`}
                onClick={() => handleSelect(opt.label)}
                style={{
                  padding: "0",
                  borderRadius: "12px",
                  border: `2px solid ${
                    selected === opt.label
                      ? "var(--vestra-gold)"
                      : "var(--vestra-border)"
                  }`,
                  cursor: "pointer",
                  overflow: "hidden",
                  width: "140px",
                  transition: "all var(--dur-base) var(--ease-luxury)",
                  boxShadow:
                    selected === opt.label
                      ? "0 0 24px var(--vestra-gold-glow)"
                      : "none",
                }}
              >
                <div style={{ display: "flex", height: "72px" }}>
                  {opt.colors.map((c) => (
                    <div key={c} style={{ flex: 1, background: c }} />
                  ))}
                </div>
                <div
                  style={{
                    padding: "0.6rem",
                    background: "var(--vestra-graphite)",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "0.75rem",
                      color:
                        selected === opt.label
                          ? "var(--vestra-gold)"
                          : "var(--vestra-white)",
                    }}
                  >
                    {opt.label}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Default pill options */}
        {q.id !== "icon" && q.id !== "palette" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "0.875rem",
              width: "100%",
              maxWidth: "720px",
              marginBottom: "3rem",
            }}
          >
            {(q.options as string[]).map((opt) => (
              <button
                key={opt}
                type="button"
                data-ocid={`personality_test.option.${opt.toLowerCase().replace(/\s+/g, "_")}`}
                onClick={() => handleSelect(opt)}
                style={{
                  padding: "1.1rem 1.5rem",
                  borderRadius: "100px",
                  background:
                    selected === opt
                      ? "var(--vestra-gold-muted)"
                      : "transparent",
                  border: `1px solid ${
                    selected === opt
                      ? "var(--vestra-gold)"
                      : "var(--vestra-border)"
                  }`,
                  cursor: "pointer",
                  fontFamily: "Playfair Display, Georgia, serif",
                  fontSize: "1.05rem",
                  color:
                    selected === opt
                      ? "var(--vestra-gold)"
                      : "var(--vestra-white)",
                  transition: "all var(--dur-base) var(--ease-luxury)",
                  boxShadow:
                    selected === opt
                      ? "0 0 20px var(--vestra-gold-glow)"
                      : "none",
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleNext}
          disabled={!selected}
          data-ocid="personality_test.next.button"
          className="btn-gold"
          style={{
            opacity: selected ? 1 : 0.4,
            cursor: selected ? "pointer" : "not-allowed",
            minWidth: "180px",
          }}
        >
          {currentQ + 1 === QUESTIONS.length ? "See My Style" : "Next →"}
        </button>
      </div>
    </div>
  );
}
