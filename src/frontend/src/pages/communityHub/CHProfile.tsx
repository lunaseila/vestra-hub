import { useAuth } from "@/hooks/useAuth";
import {
  useConnections,
  useUpdateUserProfile,
} from "@/hooks/useCommunityHubBackend";
import {
  type CHExperienceLevel,
  type CHUserRole,
  CH_EXPERIENCE_LEVELS,
  CH_INDUSTRIES,
  CH_INTENT_OPTIONS,
} from "@/types/communityHub";
import {
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  Clock,
  Globe2,
  MessageCircle,
  Settings,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

const TABS = [
  "About",
  "Experience",
  "Trusted Network",
  "Activity",
  "Settings",
] as const;
type TabType = (typeof TABS)[number];

interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  description: string;
  flag: string;
}

interface ActivityEntry {
  icon: "apply" | "connect" | "view";
  text: string;
  time: string;
}

const MOCK_PROFILE = {
  name: "Alexandra Chen",
  role: "Senior Product Designer",
  roleType: "Freelancer" as CHUserRole,
  country: "United Kingdom",
  flag: "🇬🇧",
  bio: "Building thoughtful digital products at the intersection of design and strategy. Previously at Monzo and Deliveroo. Now consulting for ambitious startups globally — from Series A product revamps to zero-to-one design systems.",
  skills: [
    "Product Strategy",
    "Design Systems",
    "User Research",
    "Figma",
    "Prototyping",
    "Brand Identity",
  ],
  industries: ["Design", "SaaS", "Finance"],
  experienceLevel: "Expert" as CHExperienceLevel,
  intent: "Freelance Services",
  connections: 142,
  opportunities: 8,
  memberSince: "March 2025",
  isVerified: true,
  experience: [
    {
      role: "Lead Product Designer",
      company: "Monzo",
      period: "2021 – 2024",
      description:
        "Owned the end-to-end design of Monzo's Business Banking suite, growing from 0 to 140k accounts. Led a team of 5 designers.",
      flag: "🇬🇧",
    },
    {
      role: "Product Designer",
      company: "Deliveroo",
      period: "2018 – 2021",
      description:
        "Redesigned the restaurant partner portal used by 80,000+ restaurants globally. Reduced onboarding time by 42%.",
      flag: "🇬🇧",
    },
    {
      role: "UX Designer",
      company: "Fjord / Accenture Interactive",
      period: "2016 – 2018",
      description:
        "Delivered UX strategy for enterprise clients across banking, healthcare, and retail in London and Barcelona.",
      flag: "🇪🇸",
    },
  ] as ExperienceEntry[],
  activity: [
    {
      icon: "apply" as const,
      text: "Applied to Strategic Design Partner — B2B SaaS at Flowspace",
      time: "2 hours ago",
    },
    {
      icon: "connect" as const,
      text: "Connected with Marcus Weber, Co-Founder at Flowspace",
      time: "Yesterday",
    },
    {
      icon: "view" as const,
      text: "Viewed opportunity: Head of Growth Marketing at Kairn Health",
      time: "2 days ago",
    },
    {
      icon: "apply" as const,
      text: "Applied to Freelance Brand Identity Designer at Casa Vivo Milano",
      time: "3 days ago",
    },
    {
      icon: "connect" as const,
      text: "Connected with Iñigo Alonso, Community Lead at Prism Network",
      time: "5 days ago",
    },
  ] as ActivityEntry[],
};

const MOCK_CONNECTIONS = [
  {
    id: "u1",
    name: "Marcus Weber",
    role: "Co-Founder",
    company: "Flowspace",
    country: "Germany",
    flag: "🇩🇪",
    initials: "MW",
    status: "Accepted",
  },
  {
    id: "u2",
    name: "Yuki Tanaka",
    role: "AI Engineer",
    company: "NeuralStack AI",
    country: "Singapore",
    flag: "🇸🇬",
    initials: "YT",
    status: "Accepted",
  },
  {
    id: "u3",
    name: "Sofia Marchetti",
    role: "Creative Director",
    company: "Casa Vivo Milano",
    country: "Italy",
    flag: "🇮🇹",
    initials: "SM",
    status: "Accepted",
  },
  {
    id: "u4",
    name: "James Okafor",
    role: "Investor",
    company: "Verde Capital",
    country: "United Kingdom",
    flag: "🇬🇧",
    initials: "JO",
    status: "Pending",
  },
  {
    id: "u5",
    name: "Iñigo Alonso",
    role: "Community Lead",
    company: "Prism Network",
    country: "Spain",
    flag: "🇪🇸",
    initials: "IA",
    status: "Accepted",
  },
  {
    id: "u6",
    name: "Priya Nair",
    role: "Head of Growth",
    company: "Kairn Health",
    country: "France",
    flag: "🇫🇷",
    initials: "PN",
    status: "Accepted",
  },
];

function ActivityIcon({ type }: { type: ActivityEntry["icon"] }) {
  const base: React.CSSProperties = {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };
  if (type === "apply")
    return (
      <div
        style={{
          ...base,
          background: "var(--ch-accent-muted)",
          border: "1px solid var(--ch-border-glow)",
        }}
      >
        <Briefcase size={14} color="var(--ch-text-accent)" />
      </div>
    );
  if (type === "connect")
    return (
      <div
        style={{
          ...base,
          background: "var(--ch-success-bg)",
          border: "1px solid rgba(46,204,142,0.2)",
        }}
      >
        <UserPlus size={14} color="var(--ch-success)" />
      </div>
    );
  return (
    <div
      style={{
        ...base,
        background: "rgba(196,169,125,0.08)",
        border: "1px solid rgba(196,169,125,0.2)",
      }}
    >
      <Globe2 size={14} color="var(--ch-gold)" />
    </div>
  );
}

function TabPanel({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div
      data-ocid={id}
      style={{ animation: "ch-tab-in 240ms var(--ease-smooth) both" }}
    >
      {children}
    </div>
  );
}

function SignInGate({ onLogin }: { onLogin: () => void }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--ch-bg-surface)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
      data-ocid="ch.profile.auth_gate"
    >
      <div style={{ textAlign: "center", maxWidth: "420px" }}>
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "var(--ch-accent-muted)",
            border: "1.5px solid var(--ch-border-glow)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}
        >
          <Users size={28} color="var(--ch-text-accent)" />
        </div>
        <h2
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontWeight: 400,
            fontSize: "var(--ch-text-h2)",
            color: "var(--ch-text-primary)",
            marginBottom: "0.75rem",
          }}
        >
          View your profile
        </h2>
        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.95rem",
            color: "var(--ch-text-secondary)",
            lineHeight: 1.7,
            marginBottom: "2rem",
          }}
        >
          Sign in with Internet Identity to access your Community Hub profile,
          manage connections, and track your opportunities.
        </p>
        <button
          type="button"
          onClick={onLogin}
          data-ocid="ch.profile.sign_in_button"
          style={{
            background: "var(--ch-accent)",
            color: "#fff",
            border: "none",
            borderRadius: "100px",
            padding: "0.875rem 2rem",
            fontFamily: "DM Sans, sans-serif",
            fontWeight: 500,
            fontSize: "0.95rem",
            cursor: "pointer",
            transition:
              "background var(--dur-micro) var(--ease-smooth), box-shadow var(--dur-micro) var(--ease-smooth)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--ch-accent-hover)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 24px var(--ch-accent-glow)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--ch-accent)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

function SettingsTab({ userId }: { userId: string | null }) {
  const [name, setName] = useState(MOCK_PROFILE.name);
  const [bio, setBio] = useState(MOCK_PROFILE.bio);
  const [country, setCountry] = useState(MOCK_PROFILE.country);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(
    MOCK_PROFILE.industries,
  );
  const [expLevel, setExpLevel] = useState<CHExperienceLevel>(
    MOCK_PROFILE.experienceLevel,
  );
  const [intent, setIntent] = useState(MOCK_PROFILE.intent);
  const [visible, setVisible] = useState(true);
  const [saved, setSaved] = useState(false);
  const updateProfile = useUpdateUserProfile();
  const COUNTRIES = [
    "United States",
    "United Kingdom",
    "Germany",
    "Italy",
    "Spain",
    "France",
    "UAE",
    "Singapore",
  ];
  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--ch-bg-elevated)",
    border: "1px solid var(--ch-border)",
    borderRadius: "10px",
    padding: "0.75rem 1rem",
    fontFamily: "DM Sans, sans-serif",
    fontSize: "0.9rem",
    color: "var(--ch-text-primary)",
    outline: "none",
    transition:
      "border-color var(--dur-micro) var(--ease-smooth), box-shadow var(--dur-micro) var(--ease-smooth)",
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "DM Sans, sans-serif",
    fontSize: "0.72rem",
    fontWeight: 500,
    letterSpacing: "0.10em",
    textTransform: "uppercase",
    color: "var(--ch-text-secondary)",
    marginBottom: "0.5rem",
  };
  function toggleIndustry(ind: string) {
    setSelectedIndustries((p) =>
      p.includes(ind) ? p.filter((i) => i !== ind) : [...p, ind],
    );
  }
  function onFocus(
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    e.currentTarget.style.borderColor = "var(--ch-gold)";
    e.currentTarget.style.boxShadow = "0 0 0 3px var(--ch-gold-muted)";
  }
  function onBlur(
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    e.currentTarget.style.borderColor = "var(--ch-border)";
    e.currentTarget.style.boxShadow = "none";
  }
  function handleSave() {
    if (userId)
      updateProfile.mutate({
        userId,
        name,
        bio,
        country,
        industries: selectedIndustries,
        experienceLevel: expLevel,
      });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }
  return (
    <TabPanel id="ch.profile.settings_panel">
      <div
        style={{
          maxWidth: "640px",
          display: "flex",
          flexDirection: "column",
          gap: "1.75rem",
        }}
      >
        <div>
          <label style={labelStyle} htmlFor="pname">
            Full Name
          </label>
          <input
            id="pname"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
            data-ocid="ch.profile.name_input"
          />
        </div>
        <div>
          <label style={labelStyle} htmlFor="pbio">
            Bio
          </label>
          <textarea
            id="pbio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Tell the network who you are..."
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }}
            onFocus={onFocus}
            onBlur={onBlur}
            data-ocid="ch.profile.bio_textarea"
          />
        </div>
        <div>
          <label style={labelStyle} htmlFor="pcountry">
            Country
          </label>
          <select
            id="pcountry"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{ ...inputStyle, cursor: "pointer" }}
            onFocus={onFocus}
            onBlur={onBlur}
            data-ocid="ch.profile.country_select"
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c} style={{ background: "#161b28" }}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span style={labelStyle}>Industries</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {CH_INDUSTRIES.map((ind) => (
              <button
                key={ind}
                type="button"
                onClick={() => toggleIndustry(ind)}
                data-ocid={`ch.profile.industry_toggle.${ind.toLowerCase()}`}
                style={{
                  padding: "0.35rem 0.875rem",
                  borderRadius: "100px",
                  fontSize: "0.8rem",
                  fontFamily: "JetBrains Mono, monospace",
                  cursor: "pointer",
                  transition: "all var(--dur-micro) var(--ease-smooth)",
                  background: selectedIndustries.includes(ind)
                    ? "var(--ch-accent-muted)"
                    : "transparent",
                  border: selectedIndustries.includes(ind)
                    ? "1px solid var(--ch-accent)"
                    : "1px solid var(--ch-border)",
                  color: selectedIndustries.includes(ind)
                    ? "var(--ch-text-accent)"
                    : "var(--ch-text-secondary)",
                }}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span style={labelStyle}>Experience Level</span>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {CH_EXPERIENCE_LEVELS.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => setExpLevel(level.value)}
                data-ocid={`ch.profile.exp_level.${level.value.toLowerCase()}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.875rem",
                  padding: "0.875rem 1rem",
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "all var(--dur-micro) var(--ease-smooth)",
                  background:
                    expLevel === level.value
                      ? "var(--ch-accent-muted)"
                      : "var(--ch-bg-elevated)",
                  border:
                    expLevel === level.value
                      ? "1px solid var(--ch-accent)"
                      : "1px solid var(--ch-border)",
                  borderLeft:
                    expLevel === level.value
                      ? "3px solid var(--ch-accent)"
                      : "1px solid var(--ch-border)",
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>{level.icon}</span>
                <div>
                  <div
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      color:
                        expLevel === level.value
                          ? "var(--ch-text-primary)"
                          : "var(--ch-text-secondary)",
                    }}
                  >
                    {level.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.72rem",
                      color: "var(--ch-text-tertiary)",
                    }}
                  >
                    {level.subtitle}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={labelStyle} htmlFor="pintent">
            What are you here for?
          </label>
          <select
            id="pintent"
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            style={{ ...inputStyle, cursor: "pointer" }}
            onFocus={onFocus}
            onBlur={onBlur}
            data-ocid="ch.profile.intent_select"
          >
            {CH_INTENT_OPTIONS.map((opt) => (
              <option key={opt} value={opt} style={{ background: "#161b28" }}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.25rem",
            background: "var(--ch-bg-elevated)",
            border: "1px solid var(--ch-border)",
            borderRadius: "10px",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 500,
                fontSize: "0.9rem",
                color: "var(--ch-text-primary)",
                marginBottom: "0.2rem",
              }}
            >
              Profile visible to the network
            </div>
            <div
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.8rem",
                color: "var(--ch-text-tertiary)",
              }}
            >
              Others can discover and connect with you
            </div>
          </div>
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            data-ocid="ch.profile.visibility_toggle"
            aria-label="Toggle profile visibility"
            style={{
              width: "44px",
              height: "24px",
              borderRadius: "100px",
              border: "none",
              cursor: "pointer",
              background: visible
                ? "var(--ch-accent)"
                : "rgba(255,255,255,0.12)",
              position: "relative",
              transition: "background var(--dur-micro) var(--ease-smooth)",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "3px",
                left: visible ? "23px" : "3px",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: "#fff",
                transition: "left var(--dur-micro) var(--ease-smooth)",
              }}
            />
          </button>
        </div>
        {saved ? (
          <div
            data-ocid="ch.profile.save_success_state"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "0.875rem 2rem",
              borderRadius: "10px",
              background: "var(--ch-success-bg)",
              border: "1px solid rgba(46,204,142,0.25)",
            }}
          >
            <CheckCircle2 size={16} color="var(--ch-success)" />
            <span
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "var(--ch-success)",
              }}
            >
              Changes saved
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            data-ocid="ch.profile.save_button"
            style={{
              background: "var(--ch-accent)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "0.875rem 1.5rem",
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 500,
              fontSize: "0.9rem",
              cursor: "pointer",
              transition:
                "background var(--dur-micro) var(--ease-smooth), transform var(--dur-micro) var(--ease-smooth)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--ch-accent-hover)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--ch-accent)";
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(0.97)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1)";
            }}
          >
            Save Changes
          </button>
        )}
        <div
          style={{
            marginTop: "1rem",
            paddingTop: "2rem",
            borderTop: "1px solid var(--ch-border)",
          }}
        >
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.72rem",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "var(--ch-text-tertiary)",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <AlertTriangle size={12} color="var(--ch-text-tertiary)" /> Danger
            Zone
          </p>
          <button
            type="button"
            data-ocid="ch.profile.disconnect_button"
            style={{
              background: "transparent",
              color: "rgba(239,68,68,0.7)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "8px",
              padding: "0.625rem 1.25rem",
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 400,
              fontSize: "0.875rem",
              cursor: "pointer",
              transition: "all var(--dur-micro) var(--ease-smooth)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(239,68,68,0.06)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(239,68,68,0.4)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgb(239,68,68)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(239,68,68,0.2)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(239,68,68,0.7)";
            }}
          >
            Disconnect from {MOCK_PROFILE.country}
          </button>
        </div>
      </div>
    </TabPanel>
  );
}

export default function CHProfile() {
  const { isAuthenticated, login, principal } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("About");
  const [showAllSkills, setShowAllSkills] = useState(false);
  const { data: connections } = useConnections(principal ?? "");
  useEffect(() => {
    void connections;
  }, [connections]);

  if (!isAuthenticated) return <SignInGate onLogin={login} />;

  const initials = MOCK_PROFILE.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--ch-bg-surface)",
        paddingTop: "64px",
      }}
      data-ocid="ch.profile.page"
    >
      {/* ═══════════════ HERO ═══════════════ */}
      <div
        style={{
          background: "var(--ch-bg-elevated)",
          borderBottom: "1px solid var(--ch-border)",
          position: "relative",
          overflow: "hidden",
        }}
        data-ocid="ch.profile.hero_card"
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(42,94,255,0.06) 0%, rgba(99,184,255,0.03) 40%, transparent 65%, rgba(42,94,255,0.04) 100%)",
            animation: "ch-profile-shimmer 8s ease-in-out infinite alternate",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "3rem 2rem 2.5rem",
            position: "relative",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("Settings")}
            data-ocid="ch.profile.edit_button"
            style={{
              position: "absolute",
              top: "2rem",
              right: "2rem",
              background: "transparent",
              border: "1px solid var(--ch-border)",
              borderRadius: "8px",
              padding: "0.5rem 1rem",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.8rem",
              color: "var(--ch-text-secondary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              transition: "all var(--dur-micro) var(--ease-smooth)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "var(--ch-border-hover)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--ch-text-primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "var(--ch-border)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--ch-text-secondary)";
            }}
          >
            <Settings size={13} /> Edit Profile
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "1.75rem",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: "88px",
                height: "88px",
                borderRadius: "50%",
                background: "var(--ch-accent-muted)",
                border: "2px solid var(--ch-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 600,
                fontSize: "1.5rem",
                color: "var(--ch-text-accent)",
                flexShrink: 0,
                boxShadow:
                  "0 0 0 4px var(--ch-accent-muted), 0 8px 24px rgba(42,94,255,0.15)",
                animation: "ch-profile-avatar-in 600ms var(--ease-reveal) both",
              }}
            >
              {initials}
            </div>
            <div
              style={{
                flex: 1,
                minWidth: 0,
                animation:
                  "ch-profile-info-in 700ms var(--ease-reveal) 80ms both",
              }}
            >
              {/* Name + Verified */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.25rem",
                  flexWrap: "wrap",
                }}
              >
                <h1
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(2rem, 4vw, 2.5rem)",
                    color: "var(--ch-text-primary)",
                    margin: 0,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.15,
                  }}
                >
                  {MOCK_PROFILE.name}
                </h1>
                {MOCK_PROFILE.isVerified && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "100px",
                      background: "var(--ch-success-bg)",
                      border: "1px solid rgba(46,204,142,0.25)",
                    }}
                  >
                    <CheckCircle2 size={11} color="var(--ch-success)" />
                    <span
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "0.65rem",
                        color: "var(--ch-success)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      VERIFIED
                    </span>
                  </span>
                )}
              </div>
              {/* Role — gold dominant */}
              <div
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 500,
                  fontSize: "1.15rem",
                  color: "#C4A97D",
                  marginBottom: "0.5rem",
                  letterSpacing: "0.01em",
                }}
              >
                {MOCK_PROFILE.role}
              </div>
              {/* Location */}
              <div
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.88rem",
                  color: "var(--ch-text-secondary)",
                  marginBottom: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                <span>📍</span>
                <span>{MOCK_PROFILE.country}</span>
              </div>
              {/* Availability pills */}
              <div
                style={{
                  display: "flex",
                  gap: "0.4rem",
                  flexWrap: "wrap",
                  marginBottom: "1.25rem",
                }}
              >
                {["Freelance", "Remote", "Collaborations"].map((pill) => (
                  <span
                    key={pill}
                    style={{
                      padding: "0.2rem 0.65rem",
                      borderRadius: "100px",
                      fontSize: "0.72rem",
                      fontFamily: "DM Sans, sans-serif",
                      color: "#C4A97D",
                      background: "rgba(196,169,125,0.06)",
                      border: "1px solid rgba(196,169,125,0.35)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {pill}
                  </span>
                ))}
              </div>
              {/* Stats — reduced emphasis */}
              <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                {(
                  [
                    {
                      value: String(MOCK_PROFILE.connections),
                      label: "Network",
                    },
                    {
                      value: String(MOCK_PROFILE.opportunities),
                      label: "Opportunities",
                    },
                    {
                      value: MOCK_PROFILE.experienceLevel,
                      label: "Level",
                      gold: true,
                    },
                  ] as { value: string; label: string; gold?: boolean }[]
                ).map(({ value, label, gold }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.1rem",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontWeight: 500,
                        fontSize: "0.95rem",
                        color: gold
                          ? "var(--ch-gold)"
                          : "var(--ch-text-secondary)",
                      }}
                    >
                      {value}
                    </span>
                    <span
                      style={{
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "0.68rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "var(--ch-text-tertiary)",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ TABS ═══════════════ */}
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem 4rem" }}
      >
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--ch-border)",
            marginBottom: "2.5rem",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
          data-ocid="ch.profile.tabs_bar"
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              data-ocid={`ch.profile.${tab.toLowerCase().replace(" ", "_")}_tab`}
              style={{
                background: "none",
                border: "none",
                borderBottom:
                  activeTab === tab
                    ? "2px solid var(--ch-accent)"
                    : "2px solid transparent",
                padding: "1rem 1.25rem",
                cursor: "pointer",
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.875rem",
                fontWeight: activeTab === tab ? 500 : 400,
                color:
                  activeTab === tab
                    ? "var(--ch-text-primary)"
                    : "var(--ch-text-secondary)",
                transition:
                  "color var(--dur-micro) var(--ease-smooth), border-color var(--dur-micro) var(--ease-smooth)",
                marginBottom: "-1px",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ABOUT */}
        {activeTab === "About" && (
          <TabPanel id="ch.profile.about_panel">
            {/* ── FEATURED WORK GALLERY ── */}
            <div
              style={{ marginBottom: "3rem" }}
              data-ocid="ch.profile.featured_work_section"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                <h2
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontWeight: 400,
                    fontSize: "var(--ch-text-h3)",
                    color: "var(--ch-text-primary)",
                    margin: 0,
                  }}
                >
                  Featured Work
                </h2>
                <span
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--ch-gold)",
                    opacity: 0.7,
                  }}
                >
                  Portfolio
                </span>
              </div>
              {/* Desktop 2×2 grid */}
              <div
                className="ch-gallery-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "1rem",
                }}
                data-ocid="ch.profile.gallery_grid"
              >
                {(
                  [
                    {
                      seed: "portfolio1",
                      caption: "Brand Identity — Milano Studio",
                    },
                    { seed: "portfolio2", caption: "Product Design System" },
                    {
                      seed: "portfolio3",
                      caption: "UX Research — Kairn Health",
                    },
                    {
                      seed: "portfolio4",
                      caption: "Creative Direction — Flowspace",
                    },
                  ] as { seed: string; caption: string }[]
                ).map((item, i) => (
                  <div
                    key={item.seed}
                    data-ocid={`ch.profile.gallery.item.${i + 1}`}
                    className="ch-gallery-item"
                    style={{
                      position: "relative",
                      borderRadius: "12px",
                      overflow: "hidden",
                      aspectRatio: "3/4",
                      background: "var(--ch-bg-elevated)",
                      boxShadow:
                        "0 8px 32px rgba(0,0,0,0.35), 0 1px 0 rgba(196,169,125,0.08)",
                      cursor: "pointer",
                      transition: "box-shadow 0.35s ease, transform 0.35s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform =
                        "scale(1.03)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        "0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(196,169,125,0.25)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform =
                        "scale(1)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        "0 8px 32px rgba(0,0,0,0.35), 0 1px 0 rgba(196,169,125,0.08)";
                    }}
                  >
                    <img
                      src={`https://picsum.photos/seed/${item.seed}/600/800`}
                      alt={item.caption}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        transition: "opacity 0.4s ease",
                      }}
                      loading="lazy"
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(8,8,10,0.72) 0%, transparent 55%)",
                        pointerEvents: "none",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "0.875rem",
                        left: "1rem",
                        right: "1rem",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          color: "rgba(255,255,255,0.85)",
                          margin: 0,
                          letterSpacing: "0.02em",
                        }}
                      >
                        {item.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Mobile snap carousel — hidden on desktop via inline media */}
              <div
                className="ch-gallery-carousel"
                style={
                  {
                    display: "none",
                    overflowX: "auto",
                    scrollSnapType: "x mandatory",
                    gap: "0.875rem",
                    paddingBottom: "0.5rem",
                    scrollbarWidth: "none",
                    WebkitOverflowScrolling: "touch",
                  } as React.CSSProperties
                }
                data-ocid="ch.profile.gallery_carousel"
              >
                {(
                  [
                    {
                      seed: "portfolio1",
                      caption: "Brand Identity — Milano Studio",
                    },
                    { seed: "portfolio2", caption: "Product Design System" },
                    {
                      seed: "portfolio3",
                      caption: "UX Research — Kairn Health",
                    },
                    {
                      seed: "portfolio4",
                      caption: "Creative Direction — Flowspace",
                    },
                  ] as { seed: string; caption: string }[]
                ).map((item, i) => (
                  <div
                    key={`mob-${item.seed}`}
                    data-ocid={`ch.profile.gallery_carousel.item.${i + 1}`}
                    style={{
                      flexShrink: 0,
                      width: "72vw",
                      maxWidth: "260px",
                      borderRadius: "12px",
                      overflow: "hidden",
                      aspectRatio: "3/4",
                      background: "var(--ch-bg-elevated)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                      scrollSnapAlign: "start",
                      position: "relative",
                    }}
                  >
                    <img
                      src={`https://picsum.photos/seed/${item.seed}/600/800`}
                      alt={item.caption}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      loading="lazy"
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(8,8,10,0.72) 0%, transparent 55%)",
                        pointerEvents: "none",
                      }}
                    />
                    <p
                      style={{
                        position: "absolute",
                        bottom: "0.875rem",
                        left: "1rem",
                        right: "1rem",
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.85)",
                        margin: 0,
                      }}
                    >
                      {item.caption}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── ABOUT CONTENT + SIDEBAR ── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr min(320px, 100%)",
                gap: "3rem",
                alignItems: "start",
              }}
            >
              <div>
                {/* Editorial About Blocks */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                    marginBottom: "2.5rem",
                  }}
                >
                  {(
                    [
                      {
                        label: "Who I Am",
                        content:
                          "A product designer with a decade of experience crafting digital products that sit at the intersection of clarity and emotion. I move between strategy and execution — equally comfortable in a boardroom defining vision and in Figma building the system.",
                      },
                      {
                        label: "What I Do",
                        content:
                          "End-to-end product design — from discovery and research to design systems and production-ready specs. I've shipped at Monzo and Deliveroo. I now consult for ambitious Series A startups navigating their first design challenges.",
                      },
                      {
                        label: "What I'm Looking For",
                        content:
                          "Long-term collaborations with founders and product teams who care deeply about craft. Roles where design is a strategic function, not an afterthought. Global projects that stretch perspectives.",
                      },
                      {
                        label: "What I Can Offer",
                        content:
                          "Design leadership without the overhead. A sharp creative perspective, fast execution, and a track record of shipping products people actually use. Multilingual across design, strategy and engineering conversations.",
                      },
                    ] as { label: string; content: string }[]
                  ).map((block, i) => (
                    <div
                      key={block.label}
                      data-ocid={`ch.profile.about_block.${i + 1}`}
                      style={{
                        background: "var(--ch-bg-card)",
                        border: "1px solid var(--ch-border)",
                        borderRadius: "12px",
                        padding: "1.5rem",
                        transition: "border-color 0.25s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor =
                          "rgba(196,169,125,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor =
                          "var(--ch-border)";
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "JetBrains Mono, monospace",
                          fontSize: "0.62rem",
                          fontWeight: 500,
                          letterSpacing: "0.16em",
                          textTransform: "uppercase",
                          color: "var(--ch-gold)",
                          marginBottom: "0.75rem",
                          margin: "0 0 0.75rem",
                        }}
                      >
                        {block.label}
                      </p>
                      <p
                        style={{
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "0.9rem",
                          color: "var(--ch-text-secondary)",
                          lineHeight: 1.85,
                          margin: 0,
                        }}
                      >
                        {block.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Skills — 3-level hierarchy */}
                <div
                  style={{ marginBottom: "2rem" }}
                  data-ocid="ch.profile.skills_section"
                >
                  <h3
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontWeight: 500,
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: "var(--ch-text-tertiary)",
                      marginBottom: "1rem",
                    }}
                  >
                    Expertise
                  </h3>
                  {/* Level 1 — Primary Identity */}
                  <div style={{ marginBottom: "0.875rem" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.45rem 1.25rem",
                        borderRadius: "100px",
                        fontSize: "0.92rem",
                        fontFamily: "DM Sans, sans-serif",
                        fontWeight: 600,
                        color: "#C4A97D",
                        background: "rgba(196,169,125,0.12)",
                        border: "1px solid rgba(196,169,125,0.45)",
                        letterSpacing: "0.01em",
                      }}
                    >
                      Creative Director
                    </span>
                  </div>
                  {/* Level 2 — Category badges */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.4rem",
                      marginBottom: "0.875rem",
                    }}
                  >
                    {[
                      "Design",
                      "Business",
                      "Creative",
                      "Marketing",
                      "Technology",
                      "Fashion",
                      "Media",
                    ].map((cat) => (
                      <span
                        key={cat}
                        style={{
                          padding: "0.25rem 0.65rem",
                          borderRadius: "100px",
                          fontSize: "0.75rem",
                          fontFamily: "DM Sans, sans-serif",
                          color: "var(--ch-text-secondary)",
                          background: "var(--ch-bg-elevated)",
                          border: "1px solid var(--ch-border)",
                        }}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  {/* Level 3 — Detailed skills (expandable) */}
                  {showAllSkills && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.4rem",
                        marginBottom: "0.75rem",
                        animation: "ch-tab-in 240ms var(--ease-smooth) both",
                      }}
                    >
                      {[
                        "Product Strategy",
                        "Design Systems",
                        "User Research",
                        "Figma",
                        "Prototyping",
                        "Brand Identity",
                        "Art Direction",
                        "Motion Design",
                        "Design Ops",
                      ].map((s) => (
                        <span
                          key={s}
                          style={{
                            padding: "0.2rem 0.65rem",
                            borderRadius: "6px",
                            fontSize: "0.72rem",
                            fontFamily: "JetBrains Mono, monospace",
                            color: "var(--ch-text-accent)",
                            background: "var(--ch-accent-muted)",
                            border: "1px solid var(--ch-border-glow)",
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowAllSkills((v) => !v)}
                    data-ocid="ch.profile.show_skills_toggle"
                    style={{
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      color: "#C4A97D",
                      cursor: "pointer",
                      letterSpacing: "0.02em",
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    {showAllSkills
                      ? "Hide Full Expertise"
                      : "Show Full Expertise"}
                  </button>
                </div>

                {/* Traits section */}
                <div
                  style={{ marginBottom: "2rem" }}
                  data-ocid="ch.profile.traits_section"
                >
                  <h3
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontWeight: 500,
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: "var(--ch-text-tertiary)",
                      marginBottom: "0.875rem",
                    }}
                  >
                    Traits
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.45rem",
                    }}
                  >
                    {[
                      "Strategic Thinker",
                      "Fast Learner",
                      "Empathic",
                      "Leadership",
                      "Problem Solver",
                      "Visionary",
                      "Reliable",
                      "Business Driven",
                      "Adaptable",
                    ].map((trait) => (
                      <span
                        key={trait}
                        style={{
                          padding: "0.3rem 0.875rem",
                          borderRadius: "20px",
                          fontSize: "0.8rem",
                          fontFamily: "DM Sans, sans-serif",
                          color: "var(--ch-text-secondary)",
                          background: "rgba(196,169,125,0.04)",
                          border: "1px solid rgba(196,169,125,0.25)",
                          letterSpacing: "0.01em",
                        }}
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.78rem",
                    color: "var(--ch-text-tertiary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <Clock size={12} /> Member since {MOCK_PROFILE.memberSince}
                </p>
              </div>
              {/* ── SIDEBAR: Personal Snapshot + Languages ── */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {/* Personal Snapshot Card */}
                <div
                  data-ocid="ch.profile.personal_snapshot_card"
                  style={{
                    background: "#111527",
                    border: "1px solid rgba(196,169,125,0.4)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                    borderRadius: "16px",
                    padding: "1.5rem",
                  }}
                >
                  {/* Card header label */}
                  <p
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.65rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "#C4A97D",
                      margin: "0 0 1rem",
                    }}
                  >
                    Personal Snapshot
                  </p>
                  {/* Role */}
                  <p
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "var(--ch-text-primary)",
                      margin: "0 0 0.35rem",
                    }}
                  >
                    Creative Director
                  </p>
                  {/* Location */}
                  <p
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "0.82rem",
                      color: "var(--ch-text-secondary)",
                      margin: "0 0 0.35rem",
                    }}
                  >
                    📍 Milan
                  </p>
                  {/* Rating */}
                  <p
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "0.82rem",
                      color: "#C4A97D",
                      margin: "0 0 1.25rem",
                    }}
                  >
                    ⭐ 4.9
                  </p>
                  <div
                    style={{
                      height: "1px",
                      background: "rgba(196,169,125,0.15)",
                      marginBottom: "1rem",
                    }}
                  />
                  {/* Available For */}
                  <p
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "0.68rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: "var(--ch-text-tertiary)",
                      margin: "0 0 0.5rem",
                    }}
                  >
                    Available For
                  </p>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: "0 0 1.25rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.3rem",
                    }}
                  >
                    {["Freelance", "Remote", "Travel", "Collaborations"].map(
                      (avail) => (
                        <li
                          key={avail}
                          style={{
                            fontFamily: "DM Sans, sans-serif",
                            fontSize: "0.85rem",
                            color: "var(--ch-text-secondary)",
                            paddingLeft: "0.875rem",
                            position: "relative",
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              left: 0,
                              color: "#C4A97D",
                              fontSize: "0.55rem",
                              top: "0.3rem",
                            }}
                          >
                            ◆
                          </span>
                          {avail}
                        </li>
                      ),
                    )}
                  </ul>
                  <div
                    style={{
                      height: "1px",
                      background: "rgba(196,169,125,0.15)",
                      marginBottom: "1rem",
                    }}
                  />
                  {/* Top Traits */}
                  <p
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "0.68rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: "var(--ch-text-tertiary)",
                      margin: "0 0 0.5rem",
                    }}
                  >
                    Top Traits
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.35rem",
                      marginBottom: "1.25rem",
                    }}
                  >
                    {[
                      "Creative",
                      "Strategic",
                      "Multilingual",
                      "Entrepreneurial",
                    ].map((t) => (
                      <span
                        key={t}
                        style={{
                          padding: "0.2rem 0.55rem",
                          borderRadius: "4px",
                          fontSize: "0.72rem",
                          fontFamily: "DM Sans, sans-serif",
                          color: "#C4A97D",
                          background: "rgba(196,169,125,0.07)",
                          border: "1px solid rgba(196,169,125,0.3)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div
                    style={{
                      height: "1px",
                      background: "rgba(196,169,125,0.15)",
                      marginBottom: "1rem",
                    }}
                  />
                  {/* Profile Strength */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "0.4rem",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "0.68rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        color: "var(--ch-text-tertiary)",
                      }}
                    >
                      Profile Strength
                    </span>
                    <span
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        color: "#C4A97D",
                      }}
                    >
                      98%
                    </span>
                  </div>
                  <div
                    style={{
                      height: "3px",
                      borderRadius: "2px",
                      background: "rgba(196,169,125,0.15)",
                      overflow: "hidden",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div
                      style={{
                        width: "98%",
                        height: "100%",
                        background: "rgba(196,169,125,0.8)",
                        borderRadius: "2px",
                      }}
                    />
                  </div>
                  {/* CTA Buttons */}
                  <button
                    type="button"
                    data-ocid="ch.profile.connect_button"
                    style={{
                      width: "100%",
                      background: "var(--ch-accent)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "0.75rem",
                      fontFamily: "DM Sans, sans-serif",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      cursor: "pointer",
                      transition:
                        "background var(--dur-micro) var(--ease-smooth), transform var(--dur-micro)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "var(--ch-accent-hover)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "var(--ch-accent)";
                    }}
                    onMouseDown={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "scale(0.97)";
                    }}
                    onMouseUp={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "scale(1)";
                    }}
                  >
                    <UserPlus size={15} /> Connect
                  </button>
                  <button
                    type="button"
                    data-ocid="ch.profile.message_button"
                    style={{
                      width: "100%",
                      marginTop: "0.625rem",
                      background: "transparent",
                      color: "var(--ch-text-secondary)",
                      border: "1px solid var(--ch-border)",
                      borderRadius: "8px",
                      padding: "0.75rem",
                      fontFamily: "DM Sans, sans-serif",
                      fontWeight: 400,
                      fontSize: "0.875rem",
                      cursor: "pointer",
                      transition: "all var(--dur-micro) var(--ease-smooth)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "var(--ch-border-hover)";
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "var(--ch-text-primary)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "var(--ch-border)";
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "var(--ch-text-secondary)";
                    }}
                  >
                    <MessageCircle size={15} /> Message
                  </button>
                </div>

                {/* Languages Card */}
                <div
                  data-ocid="ch.profile.languages_card"
                  style={{
                    background: "#111527",
                    border: "1px solid rgba(196,169,125,0.4)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                    borderRadius: "16px",
                    padding: "1.5rem",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.65rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "#C4A97D",
                      margin: "0 0 1rem",
                    }}
                  >
                    Languages
                  </p>
                  {[
                    { flag: "🇬🇧", lang: "English" },
                    { flag: "🇮🇹", lang: "Italian" },
                    { flag: "🇪🇸", lang: "Spanish" },
                    { flag: "🇫🇷", lang: "French" },
                    { flag: "🇩🇪", lang: "German" },
                    { flag: "🇸🇦", lang: "Arabic" },
                    { flag: "🇨🇳", lang: "Chinese" },
                  ].map((item, idx, arr) => (
                    <div
                      key={item.lang}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        padding: "0.6rem 0",
                        borderBottom:
                          idx < arr.length - 1
                            ? "1px solid rgba(196,169,125,0.1)"
                            : "none",
                      }}
                    >
                      <span style={{ fontSize: "1rem" }}>{item.flag}</span>
                      <span
                        style={{
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "0.85rem",
                          color: "var(--ch-text-secondary)",
                        }}
                      >
                        {item.lang}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabPanel>
        )}

        {/* EXPERIENCE */}
        {activeTab === "Experience" && (
          <TabPanel id="ch.profile.experience_panel">
            <h2
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontWeight: 400,
                fontSize: "var(--ch-text-h3)",
                color: "var(--ch-text-primary)",
                marginBottom: "2rem",
              }}
            >
              Work Experience
            </h2>
            <div
              style={{
                paddingLeft: "1.25rem",
                borderLeft: "1px solid var(--ch-border)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {MOCK_PROFILE.experience.map((exp, i) => (
                <div
                  key={`${exp.company}-${i}`}
                  style={{
                    position: "relative",
                    paddingBottom:
                      i < MOCK_PROFILE.experience.length - 1 ? "2.5rem" : 0,
                  }}
                  data-ocid={`ch.profile.experience.item.${i + 1}`}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: "-1.5rem",
                      top: "0.25rem",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background:
                        i === 0 ? "var(--ch-accent)" : "var(--ch-bg-elevated)",
                      border: "1.5px solid var(--ch-accent)",
                      boxShadow:
                        i === 0 ? "0 0 0 3px var(--ch-accent-muted)" : "none",
                    }}
                  />
                  <div
                    style={{
                      background: "var(--ch-bg-card)",
                      border: "1px solid var(--ch-border)",
                      borderRadius: "12px",
                      padding: "1.25rem 1.5rem",
                      transition:
                        "border-color var(--dur-micro) var(--ease-smooth), transform var(--dur-base) var(--ease-smooth)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "var(--ch-border-hover)";
                      (e.currentTarget as HTMLDivElement).style.transform =
                        "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "var(--ch-border)";
                      (e.currentTarget as HTMLDivElement).style.transform =
                        "translateX(0)";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "1rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontFamily: "DM Sans, sans-serif",
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            color: "var(--ch-text-primary)",
                            marginBottom: "0.2rem",
                          }}
                        >
                          {exp.role}
                        </div>
                        <div
                          style={{
                            fontFamily: "DM Sans, sans-serif",
                            fontSize: "0.85rem",
                            color: "var(--ch-text-accent)",
                          }}
                        >
                          {exp.company} {exp.flag}
                        </div>
                      </div>
                      <span
                        style={{
                          fontFamily: "JetBrains Mono, monospace",
                          fontSize: "0.72rem",
                          color: "var(--ch-text-tertiary)",
                          background: "var(--ch-bg-elevated)",
                          padding: "0.2rem 0.6rem",
                          borderRadius: "4px",
                          border: "1px solid var(--ch-border)",
                          flexShrink: 0,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {exp.period}
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "0.875rem",
                        color: "var(--ch-text-secondary)",
                        lineHeight: 1.75,
                        margin: 0,
                      }}
                    >
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabPanel>
        )}

        {/* TRUSTED NETWORK */}
        {activeTab === "Trusted Network" && (
          <TabPanel id="ch.profile.connections_panel">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.75rem",
              }}
            >
              <h2
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontWeight: 400,
                  fontSize: "var(--ch-text-h3)",
                  color: "var(--ch-text-primary)",
                  margin: 0,
                }}
              >
                Trusted Network
              </h2>
              <span
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.78rem",
                  color: "var(--ch-text-tertiary)",
                  padding: "0.2rem 0.6rem",
                  background: "var(--ch-bg-elevated)",
                  border: "1px solid var(--ch-border)",
                  borderRadius: "4px",
                }}
              >
                {MOCK_PROFILE.connections} total
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1rem",
              }}
            >
              {MOCK_CONNECTIONS.map((conn, i) => (
                <div
                  key={conn.id}
                  data-ocid={`ch.profile.connection.item.${i + 1}`}
                  style={{
                    background: "var(--ch-bg-card)",
                    border: "1px solid var(--ch-border)",
                    borderRadius: "12px",
                    padding: "1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.875rem",
                    transition:
                      "border-color var(--dur-base) var(--ease-smooth), transform var(--dur-base) var(--ease-smooth)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "var(--ch-border-hover)";
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "var(--ch-border)";
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.875rem",
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        background: "var(--ch-accent-muted)",
                        border: "1.5px solid var(--ch-border-glow)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "DM Sans, sans-serif",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        color: "var(--ch-text-accent)",
                        flexShrink: 0,
                      }}
                    >
                      {conn.initials}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "DM Sans, sans-serif",
                          fontWeight: 500,
                          fontSize: "0.9rem",
                          color: "var(--ch-text-primary)",
                          marginBottom: "0.15rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {conn.name}
                      </div>
                      <div
                        style={{
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "0.78rem",
                          color: "var(--ch-text-secondary)",
                        }}
                      >
                        {conn.role} · {conn.company}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "0.75rem",
                        color: "var(--ch-text-tertiary)",
                      }}
                    >
                      {conn.flag} {conn.country}
                    </span>
                    <span
                      style={{
                        padding: "0.15rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.65rem",
                        fontFamily: "JetBrains Mono, monospace",
                        background:
                          conn.status === "Accepted"
                            ? "var(--ch-success-bg)"
                            : "var(--ch-gold-muted)",
                        border:
                          conn.status === "Accepted"
                            ? "1px solid rgba(46,204,142,0.2)"
                            : "1px solid rgba(196,169,125,0.2)",
                        color:
                          conn.status === "Accepted"
                            ? "var(--ch-success)"
                            : "var(--ch-gold)",
                      }}
                    >
                      {conn.status}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      type="button"
                      data-ocid={`ch.profile.connection.message_button.${i + 1}`}
                      style={{
                        flex: 1,
                        background: "transparent",
                        border: "1px solid var(--ch-border)",
                        borderRadius: "6px",
                        padding: "0.45rem",
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "0.78rem",
                        color: "var(--ch-text-secondary)",
                        cursor: "pointer",
                        transition: "all var(--dur-micro) var(--ease-smooth)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.35rem",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.borderColor = "var(--ch-border-hover)";
                        (e.currentTarget as HTMLButtonElement).style.color =
                          "var(--ch-text-primary)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.borderColor = "var(--ch-border)";
                        (e.currentTarget as HTMLButtonElement).style.color =
                          "var(--ch-text-secondary)";
                      }}
                    >
                      <MessageCircle size={12} /> Message
                    </button>
                    <button
                      type="button"
                      data-ocid={`ch.profile.connection.view_button.${i + 1}`}
                      style={{
                        flex: 1,
                        background: "var(--ch-accent-muted)",
                        border: "1px solid var(--ch-border-glow)",
                        borderRadius: "6px",
                        padding: "0.45rem",
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "0.78rem",
                        color: "var(--ch-text-accent)",
                        cursor: "pointer",
                        transition: "all var(--dur-micro) var(--ease-smooth)",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "rgba(42,94,255,0.18)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "var(--ch-accent-muted)";
                      }}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TabPanel>
        )}

        {/* ACTIVITY */}
        {activeTab === "Activity" && (
          <TabPanel id="ch.profile.activity_panel">
            <h2
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontWeight: 400,
                fontSize: "var(--ch-text-h3)",
                color: "var(--ch-text-primary)",
                marginBottom: "1.75rem",
              }}
            >
              Recent Activity
            </h2>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {MOCK_PROFILE.activity.map((item, i) => (
                <div
                  key={`act-${item.icon}-${item.time}`}
                  data-ocid={`ch.profile.activity.item.${i + 1}`}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                    padding: "1.125rem 0",
                    borderBottom:
                      i < MOCK_PROFILE.activity.length - 1
                        ? "1px solid var(--ch-border)"
                        : "none",
                  }}
                >
                  <ActivityIcon type={item.icon} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "0.875rem",
                        color: "var(--ch-text-secondary)",
                        lineHeight: 1.6,
                        margin: "0 0 0.25rem",
                      }}
                    >
                      {item.text}
                    </p>
                    <span
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "0.7rem",
                        color: "var(--ch-text-tertiary)",
                      }}
                    >
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabPanel>
        )}

        {/* SETTINGS */}
        {activeTab === "Settings" && <SettingsTab userId={principal} />}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .ch-gallery-grid { display: none !important; }
          .ch-gallery-carousel { display: flex !important; }
        }
        .ch-gallery-item { will-change: transform; }
        @keyframes ch-profile-shimmer {
          0%   { filter: hue-rotate(0deg); opacity: 0.08; }
          50%  { opacity: 0.12; }
          100% { filter: hue-rotate(40deg); opacity: 0.08; }
        }
        @keyframes ch-profile-avatar-in {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes ch-profile-info-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ch-tab-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
