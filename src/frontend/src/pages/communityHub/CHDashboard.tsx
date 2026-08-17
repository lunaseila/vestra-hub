import OpportunityCard from "@/components/communityHub/OpportunityCard";
import { useAuth } from "@/hooks/useAuth";
import {
  useConnections,
  useMyApplications,
  useOpportunities,
} from "@/hooks/useCommunityHubBackend";
import type { CHOpportunity } from "@/types/communityHub";
import { MOCK_OPPORTUNITIES } from "@/types/communityHub";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Menu,
  Settings,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_USER = {
  name: "Alexandra Chen",
  initials: "AC",
  role: "Product Designer",
  country: "🇬🇧",
  industry: "Design",
  connections: 142,
  applications: 8,
};

const MOCK_PEOPLE = [
  {
    name: "Marco Ferretti",
    role: "AI Engineer",
    country: "🇮🇹",
    initials: "MF",
    color: "rgba(42,94,255,0.18)",
  },
  {
    name: "Sarah Okonkwo",
    role: "Startup Founder",
    country: "🇬🇧",
    initials: "SO",
    color: "rgba(46,204,142,0.18)",
  },
  {
    name: "Lars Eriksen",
    role: "VC Analyst",
    country: "🇩🇪",
    initials: "LE",
    color: "rgba(196,169,125,0.18)",
  },
  {
    name: "Priya Nair",
    role: "UX Lead",
    country: "🇸🇬",
    initials: "PN",
    color: "rgba(153,184,255,0.18)",
  },
  {
    name: "James Whitfield",
    role: "SaaS Founder",
    country: "🇺🇸",
    initials: "JW",
    color: "rgba(42,94,255,0.14)",
  },
  {
    name: "Aiko Tanaka",
    role: "Marketing Director",
    country: "🇫🇷",
    initials: "AT",
    color: "rgba(46,204,142,0.12)",
  },
];

const TRENDING_OPPS = MOCK_OPPORTUNITIES.slice(0, 3);

const MOCK_CONNECTIONS = [
  {
    id: "c1",
    name: "Marco Ferretti",
    role: "AI Engineer",
    country: "🇮🇹",
    initials: "MF",
    status: "Accepted" as const,
  },
  {
    id: "c2",
    name: "Lars Eriksen",
    role: "VC Analyst",
    country: "🇩🇪",
    initials: "LE",
    status: "Pending" as const,
  },
  {
    id: "c3",
    name: "Sarah Okonkwo",
    role: "Startup Founder",
    country: "🇬🇧",
    initials: "SO",
    status: "Accepted" as const,
  },
  {
    id: "c4",
    name: "Priya Nair",
    role: "UX Lead",
    country: "🇸🇬",
    initials: "PN",
    status: "Accepted" as const,
  },
];

const MOCK_APPLICATIONS = [
  {
    id: "a1",
    title: "Strategic Design Partner — B2B SaaS",
    company: "Flowspace",
    country: "🇬🇧",
    status: "Viewed" as const,
    date: "May 11, 2026",
  },
  {
    id: "a2",
    title: "Freelance Brand Identity Designer",
    company: "Casa Vivo Milano",
    country: "🇮🇹",
    status: "Pending" as const,
    date: "May 13, 2026",
  },
  {
    id: "a3",
    title: "Freelance Motion Designer — Brand Video",
    company: "Horologe Collective",
    country: "🇩🇪",
    status: "Accepted" as const,
    date: "May 10, 2026",
  },
];

const MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    initials: "MF",
    color: "rgba(42,94,255,0.2)",
    message: "Marco Ferretti sent you a connection request",
    time: "2m ago",
    read: false,
  },
  {
    id: "n2",
    initials: "CH",
    color: "rgba(46,204,142,0.2)",
    message: "Your application to Flowspace was viewed",
    time: "1h ago",
    read: false,
  },
  {
    id: "n3",
    initials: "AI",
    color: "rgba(196,169,125,0.2)",
    message: "New opportunity matching your profile in Germany",
    time: "3h ago",
    read: true,
  },
  {
    id: "n4",
    initials: "PN",
    color: "rgba(153,184,255,0.2)",
    message: "Priya Nair accepted your connection request",
    time: "Yesterday",
    read: true,
  },
  {
    id: "n5",
    initials: "CH",
    color: "rgba(42,94,255,0.15)",
    message: "3 new Design opportunities posted in UK",
    time: "Yesterday",
    read: true,
  },
];

type TabId = "feed" | "connections" | "applications" | "settings";

const NAV_TABS: { id: TabId; icon: typeof BarChart3; label: string }[] = [
  { id: "feed", icon: BarChart3, label: "Feed" },
  { id: "connections", icon: Users, label: "My Trusted Network" },
  { id: "applications", icon: Briefcase, label: "My Applications" },
  { id: "settings", icon: Settings, label: "Settings" },
];

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Pending: { bg: "rgba(196,169,125,0.10)", color: "#C4A97D" },
  Viewed: { bg: "rgba(153,184,255,0.10)", color: "#99B8FF" },
  Accepted: { bg: "rgba(46,204,142,0.10)", color: "#2ECC8E" },
  Declined: { bg: "rgba(255,80,80,0.10)", color: "#FF5050" },
  Connected: { bg: "rgba(46,204,142,0.10)", color: "#2ECC8E" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function AuthGuard({ onLogin }: { onLogin: () => void }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--ch-bg-base)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        paddingTop: "96px",
        gap: "1.5rem",
        textAlign: "center",
      }}
      data-ocid="ch.dashboard.auth_guard"
    >
      {/* Globe glow */}
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(42,94,255,0.08)",
          border: "1px solid rgba(42,94,255,0.20)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "0.5rem",
          boxShadow: "0 0 40px var(--ch-accent-glow)",
        }}
      >
        <Users size={32} color="var(--ch-text-accent)" />
      </div>

      <h1
        className="font-cormorant"
        style={{
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: 400,
          color: "var(--ch-text-primary)",
          letterSpacing: "-0.01em",
          lineHeight: 1.15,
          maxWidth: "480px",
          animation: "ch-hero-reveal 0.7s var(--ease-reveal) both",
        }}
      >
        Your Global Network Awaits
      </h1>

      <p
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "1rem",
          color: "var(--ch-text-secondary)",
          maxWidth: "380px",
          lineHeight: 1.65,
          animation: "ch-hero-reveal 0.7s var(--ease-reveal) 100ms both",
        }}
      >
        Sign in to access your personalised dashboard, connections, and curated
        opportunities.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          width: "100%",
          maxWidth: "280px",
          animation: "ch-hero-reveal 0.7s var(--ease-reveal) 200ms both",
        }}
      >
        <button
          type="button"
          className="ch-btn-primary"
          onClick={onLogin}
          data-ocid="ch.dashboard.sign_in_button"
          style={{ width: "100%", padding: "0.875rem 2rem" }}
        >
          Sign In with Internet Identity
        </button>
        <Link
          to="/CommunityHub/Onboarding"
          data-ocid="ch.dashboard.join_link"
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.875rem",
            color: "var(--ch-text-tertiary)",
            textDecoration: "none",
            textAlign: "center",
          }}
        >
          New here?{" "}
          <span style={{ color: "var(--ch-text-accent)" }}>
            Join the network →
          </span>
        </Link>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      style={{
        background: "var(--ch-bg-card)",
        border: "1px solid var(--ch-border)",
        borderRadius: "14px",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      {["60%", "40%", "80%", "55%"].map((w, i) => (
        <div
          key={`sk-${w}`}
          style={{
            height: i === 0 ? "14px" : "10px",
            width: w,
            borderRadius: "6px",
            background:
              "linear-gradient(90deg, var(--ch-bg-elevated) 25%, rgba(255,255,255,0.05) 50%, var(--ch-bg-elevated) 75%)",
            backgroundSize: "200% 100%",
            animation: `shimmer-sweep 1.6s infinite ${i * 120}ms`,
          }}
        />
      ))}
    </div>
  );
}

function NotificationsDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [notes, setNotes] = useState(MOCK_NOTIFICATIONS);

  const markRead = (id: string) =>
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

  const unread = notes.filter((n) => !n.read).length;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close notifications"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 149,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(2px)",
            cursor: "default",
          }}
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Enter") onClose();
          }}
        />
      )}

      {/* Drawer */}
      <div
        data-ocid="ch.dashboard.notifications.panel"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "360px",
          maxWidth: "100vw",
          zIndex: 150,
          background: "rgba(12,15,23,0.97)",
          backdropFilter: "blur(32px) saturate(180%)",
          borderLeft: "1px solid var(--ch-border)",
          display: "flex",
          flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform var(--dur-panel) var(--ease-panel)",
          willChange: "transform",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.5rem",
            borderBottom: "1px solid var(--ch-border)",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}
          >
            <Bell size={16} color="var(--ch-text-accent)" />
            <span
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 600,
                fontSize: "0.9375rem",
                color: "var(--ch-text-primary)",
              }}
            >
              Notifications
            </span>
            {unread > 0 && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: "var(--ch-accent)",
                  fontSize: "0.65rem",
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {unread}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notifications"
            data-ocid="ch.dashboard.notifications.close_button"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--ch-text-secondary)",
              padding: "0.25rem",
              borderRadius: "6px",
              display: "flex",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0.75rem" }}>
          {notes.map((n) => (
            <div
              key={n.id}
              data-ocid={`ch.dashboard.notification.item.${n.id}`}
              style={{
                display: "flex",
                gap: "0.75rem",
                padding: "1rem",
                borderRadius: "10px",
                background: n.read ? "transparent" : "rgba(42,94,255,0.04)",
                border: n.read
                  ? "1px solid transparent"
                  : "1px solid rgba(42,94,255,0.10)",
                marginBottom: "0.375rem",
                transition: "background var(--dur-micro) var(--ease-smooth)",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: n.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  color: "var(--ch-text-accent)",
                  flexShrink: 0,
                }}
              >
                {n.initials}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.8125rem",
                    color: n.read
                      ? "var(--ch-text-secondary)"
                      : "var(--ch-text-primary)",
                    margin: "0 0 0.25rem",
                    lineHeight: 1.45,
                  }}
                >
                  {n.message}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.65rem",
                      color: "var(--ch-text-tertiary)",
                    }}
                  >
                    {n.time}
                  </span>
                  {!n.read && (
                    <button
                      type="button"
                      onClick={() => markRead(n.id)}
                      data-ocid={`ch.dashboard.notification.mark_read.${n.id}`}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "0.7rem",
                        color: "var(--ch-text-accent)",
                        padding: 0,
                      }}
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>

              {!n.read && (
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--ch-accent)",
                    flexShrink: 0,
                    marginTop: "4px",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Feed Tab ─────────────────────────────────────────────────────────────────

function FeedTab(_: { principal: string | null }) {
  const { data: opps, isLoading } = useOpportunities();
  const feedOpps: CHOpportunity[] = opps?.slice(0, 6) ?? [];
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      {/* People You May Know */}
      <section data-ocid="ch.dashboard.people_section">
        <SectionHeader title="People you may know" />
        <div
          className="scrollbar-none"
          style={{
            display: "flex",
            gap: "0.75rem",
            overflowX: "auto",
            paddingBottom: "0.5rem",
          }}
        >
          {MOCK_PEOPLE.map((person, i) => (
            <div
              key={person.name}
              className="ch-card"
              style={{
                flexShrink: 0,
                width: "160px",
                padding: "1.25rem 1rem",
                textAlign: "center",
                animation: `ch-hero-reveal 0.5s var(--ease-reveal) ${i * 60}ms both`,
              }}
              data-ocid={`ch.dashboard.person.item.${i + 1}`}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: person.color,
                  border: "2px solid rgba(42,94,255,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  color: "var(--ch-text-accent)",
                  margin: "0 auto 0.625rem",
                }}
              >
                {person.initials}
              </div>
              <div
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 500,
                  fontSize: "0.78rem",
                  color: "var(--ch-text-primary)",
                  marginBottom: "0.2rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {person.name}
              </div>
              <div
                style={{
                  fontSize: "0.68rem",
                  color: "var(--ch-text-secondary)",
                  marginBottom: "0.875rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {person.role} {person.country}
              </div>
              <button
                type="button"
                data-ocid={`ch.dashboard.person.connect_button.${i + 1}`}
                style={{
                  width: "100%",
                  padding: "0.35rem 0.5rem",
                  borderRadius: "100px",
                  background: "transparent",
                  border: "1px solid var(--ch-border)",
                  color: "var(--ch-text-accent)",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition:
                    "border-color var(--dur-micro) var(--ease-smooth), background var(--dur-micro) var(--ease-smooth)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--ch-border-hover)";
                  e.currentTarget.style.background = "var(--ch-accent-muted)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--ch-border)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Active in Your Industry */}
      <section data-ocid="ch.dashboard.trending_section">
        <SectionHeader
          title="Active in Your Industry"
          subtitle="Trending opportunities in Design"
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {TRENDING_OPPS.map((opp, i) => (
            <button
              key={opp.id}
              type="button"
              style={{
                padding: "1.25rem",
                cursor: "pointer",
                animation: `ch-hero-reveal 0.5s var(--ease-reveal) ${i * 80}ms both`,
                textAlign: "left",
                width: "100%",
                background: "var(--ch-bg-card)",
                border: "1px solid var(--ch-border)",
                borderRadius: "14px",
                transition:
                  "border-color var(--dur-base) var(--ease-smooth), transform var(--dur-base) var(--ease-smooth)",
              }}
              data-ocid={`ch.dashboard.trending.item.${i + 1}`}
              onClick={() => navigate({ to: "/CommunityHub/Opportunities" })}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--ch-border-hover)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--ch-border)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                  gap: "0.5rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.65rem",
                    background: "rgba(42,94,255,0.10)",
                    color: "var(--ch-text-accent)",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    letterSpacing: "0.06em",
                  }}
                >
                  {opp.type}
                </span>
                <span
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.65rem",
                    fontWeight: 500,
                    background: "var(--ch-gold-muted)",
                    color: "var(--ch-gold)",
                    padding: "2px 8px",
                    borderRadius: "100px",
                    border: "1px solid rgba(196,169,125,0.18)",
                    flexShrink: 0,
                  }}
                >
                  Trending
                </span>
              </div>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "var(--ch-text-primary)",
                  margin: "0 0 0.25rem",
                  lineHeight: 1.35,
                }}
              >
                {opp.title}
              </p>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.75rem",
                  color: "var(--ch-text-secondary)",
                  margin: 0,
                }}
              >
                {opp.countryFlag} {opp.country} · {opp.industry}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Opportunities Feed */}
      <section data-ocid="ch.dashboard.feed_section">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <div>
            <h2
              className="font-cormorant"
              style={{
                fontSize: "var(--ch-text-h2)",
                fontWeight: 400,
                color: "var(--ch-text-primary)",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Your Feed
            </h2>
            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.8125rem",
                color: "var(--ch-text-secondary)",
                margin: "0.25rem 0 0",
              }}
            >
              Opportunities matched to your profile
            </p>
          </div>
          <Link
            to="/CommunityHub/Opportunities"
            data-ocid="ch.dashboard.view_all_link"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.8125rem",
              color: "var(--ch-text-accent)",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            View all <ChevronRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1rem",
            }}
            data-ocid="ch.dashboard.feed.loading_state"
          >
            {(["a", "b", "c", "d"] as const).map((k) => (
              <SkeletonCard key={k} />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {feedOpps.map((opp, i) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                index={i}
                onClick={() => navigate({ to: "/CommunityHub/Opportunities" })}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ─── Connections Tab ──────────────────────────────────────────────────────────

function ConnectionsTab(_: { principal: string | null }) {
  return (
    <div data-ocid="ch.dashboard.connections_section">
      <SectionHeader
        title="My Trusted Network"
        subtitle={`${MOCK_CONNECTIONS.length} connections`}
      />
      <div
        style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}
      >
        {MOCK_CONNECTIONS.map((conn, i) => (
          <div
            key={conn.id}
            data-ocid={`ch.dashboard.connection.item.${i + 1}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem 1.25rem",
              background: "var(--ch-bg-card)",
              border: "1px solid var(--ch-border)",
              borderRadius: "12px",
              transition: "border-color var(--dur-micro) var(--ease-smooth)",
              animation: `ch-hero-reveal 0.4s var(--ease-reveal) ${i * 60}ms both`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor =
                "var(--ch-border-hover)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor =
                "var(--ch-border)";
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "rgba(42,94,255,0.14)",
                border: "2px solid rgba(42,94,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 700,
                fontSize: "0.8rem",
                color: "var(--ch-text-accent)",
                flexShrink: 0,
              }}
            >
              {conn.initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "var(--ch-text-primary)",
                  margin: 0,
                }}
              >
                {conn.name}
              </p>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.78rem",
                  color: "var(--ch-text-secondary)",
                  margin: "2px 0 0",
                }}
              >
                {conn.role} {conn.country}
              </p>
            </div>
            <StatusBadge status={conn.status} />
            <button
              type="button"
              data-ocid={`ch.dashboard.connection.message_button.${i + 1}`}
              style={{
                flexShrink: 0,
                padding: "0.4rem 0.875rem",
                borderRadius: "100px",
                background: "transparent",
                border: "1px solid var(--ch-border)",
                color: "var(--ch-text-secondary)",
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.75rem",
                cursor: "pointer",
                transition:
                  "border-color var(--dur-micro) var(--ease-smooth), color var(--dur-micro) var(--ease-smooth)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--ch-border-hover)";
                e.currentTarget.style.color = "var(--ch-text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--ch-border)";
                e.currentTarget.style.color = "var(--ch-text-secondary)";
              }}
            >
              Message
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Applications Tab ─────────────────────────────────────────────────────────

function ApplicationsTab(_: { principal: string | null }) {
  return (
    <div data-ocid="ch.dashboard.applications_section">
      <SectionHeader
        title="My Applications"
        subtitle={`${MOCK_APPLICATIONS.length} submitted`}
      />
      <div
        style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}
      >
        {MOCK_APPLICATIONS.map((app, i) => (
          <div
            key={app.id}
            data-ocid={`ch.dashboard.application.item.${i + 1}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem 1.25rem",
              background: "var(--ch-bg-card)",
              border: "1px solid var(--ch-border)",
              borderRadius: "12px",
              transition: "border-color var(--dur-micro) var(--ease-smooth)",
              animation: `ch-hero-reveal 0.4s var(--ease-reveal) ${i * 60}ms both`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor =
                "var(--ch-border-hover)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor =
                "var(--ch-border)";
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(42,94,255,0.08)",
                border: "1px solid var(--ch-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Briefcase size={16} color="var(--ch-text-accent)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "var(--ch-text-primary)",
                  margin: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {app.title}
              </p>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.75rem",
                  color: "var(--ch-text-secondary)",
                  margin: "2px 0 0",
                }}
              >
                {app.company} {app.country}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "0.25rem",
                flexShrink: 0,
              }}
            >
              <StatusBadge status={app.status} />
              <span
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.65rem",
                  color: "var(--ch-text-tertiary)",
                }}
              >
                {app.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab({ onLogout }: { onLogout: () => void }) {
  return (
    <div
      data-ocid="ch.dashboard.settings_section"
      style={{ maxWidth: "520px" }}
    >
      <SectionHeader
        title="Settings"
        subtitle="Manage your account and preferences"
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {[
          {
            label: "Edit Profile",
            desc: "Update your name, bio, and professional details",
            icon: <Users size={16} />,
          },
          {
            label: "Notification Preferences",
            desc: "Control how and when you receive alerts",
            icon: <Bell size={16} />,
          },
          {
            label: "Privacy & Connections",
            desc: "Manage who can find and connect with you",
            icon: <CheckCircle2 size={16} />,
          },
          {
            label: "Opportunities Feed",
            desc: "Tune what types of opportunities appear in your feed",
            icon: <TrendingUp size={16} />,
          },
        ].map((item, i) => (
          <button
            key={item.label}
            type="button"
            data-ocid={`ch.dashboard.settings.item.${i + 1}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem 1.25rem",
              background: "var(--ch-bg-card)",
              border: "1px solid var(--ch-border)",
              borderRadius: "12px",
              cursor: "pointer",
              textAlign: "left",
              transition: "border-color var(--dur-micro) var(--ease-smooth)",
              width: "100%",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--ch-border-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--ch-border)";
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: "rgba(42,94,255,0.08)",
                border: "1px solid var(--ch-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--ch-text-accent)",
                flexShrink: 0,
              }}
            >
              {item.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "var(--ch-text-primary)",
                  margin: 0,
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.75rem",
                  color: "var(--ch-text-secondary)",
                  margin: "2px 0 0",
                }}
              >
                {item.desc}
              </p>
            </div>
            <ChevronRight size={16} color="var(--ch-text-tertiary)" />
          </button>
        ))}

        {/* Sign out */}
        <button
          type="button"
          onClick={onLogout}
          data-ocid="ch.dashboard.sign_out_button"
          style={{
            marginTop: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.875rem",
            background: "transparent",
            border: "1px solid rgba(255,80,80,0.18)",
            borderRadius: "12px",
            cursor: "pointer",
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "rgba(255,100,100,0.8)",
            transition:
              "border-color var(--dur-micro) var(--ease-smooth), color var(--dur-micro) var(--ease-smooth), background var(--dur-micro) var(--ease-smooth)",
            width: "100%",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,80,80,0.4)";
            e.currentTarget.style.color = "rgba(255,100,100,1)";
            e.currentTarget.style.background = "rgba(255,80,80,0.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,80,80,0.18)";
            e.currentTarget.style.color = "rgba(255,100,100,0.8)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function SectionHeader({
  title,
  subtitle,
}: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <h2
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontWeight: 600,
          fontSize: "0.9375rem",
          color: "var(--ch-text-primary)",
          margin: 0,
          letterSpacing: "0.01em",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.78rem",
            color: "var(--ch-text-secondary)",
            margin: "0.2rem 0 0",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.Pending;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.2rem 0.625rem",
        borderRadius: "100px",
        fontSize: "0.7rem",
        fontFamily: "JetBrains Mono, monospace",
        letterSpacing: "0.06em",
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.color}33`,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  useEffect(() => {
    function handle() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener("resize", handle, { passive: true });
    return () => window.removeEventListener("resize", handle);
  }, []);
  return isMobile;
}

export default function CHDashboard() {
  const { isAuthenticated, login, logout, principal } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("feed");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  useEffect(() => {
    setSidebarOpen(false);
  }, []);

  if (!isAuthenticated) {
    return <AuthGuard onLogin={login} />;
  }

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12
      ? "Good morning"
      : greetingHour < 17
        ? "Good afternoon"
        : "Good evening";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--ch-bg-surface)",
        paddingTop: "64px",
        display: "flex",
        position: "relative",
      }}
      data-ocid="ch.dashboard.page"
    >
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 89,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(2px)",
            cursor: "default",
          }}
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Enter") setSidebarOpen(false);
          }}
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside
        data-ocid="ch.dashboard.sidebar"
        style={{
          width: "240px",
          flexShrink: 0,
          borderRight: "1px solid var(--ch-border)",
          padding: "1.75rem 0.875rem",
          position: "fixed",
          top: "64px",
          left: 0,
          bottom: 0,
          background: "var(--ch-bg-card)",
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          zIndex: 90,
          transform: sidebarOpen ? "translateX(0)" : undefined,
          transition: "transform var(--dur-panel) var(--ease-panel)",
        }}
        className="hidden md:flex"
      >
        {/* User card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.5rem 0.625rem 1.25rem",
            borderBottom: "1px solid var(--ch-border)",
            marginBottom: "0.5rem",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(42,94,255,0.14)",
              border: "2px solid var(--ch-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 700,
              fontSize: "0.875rem",
              color: "var(--ch-text-accent)",
              flexShrink: 0,
              boxShadow: "0 0 16px rgba(42,94,255,0.15)",
            }}
          >
            {MOCK_USER.initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "var(--ch-text-primary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {MOCK_USER.name}
            </div>
            <div
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.65rem",
                color: "var(--ch-text-tertiary)",
                letterSpacing: "0.08em",
                marginTop: "2px",
              }}
            >
              MEMBER
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "0.125rem",
          }}
        >
          {NAV_TABS.map(({ id, icon: Icon, label }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                data-ocid={`ch.dashboard.nav.${id}_tab`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.625rem 0.875rem",
                  borderRadius: "8px",
                  border: "none",
                  background: isActive
                    ? "var(--ch-accent-muted)"
                    : "transparent",
                  color: isActive
                    ? "var(--ch-text-accent)"
                    : "var(--ch-text-secondary)",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: isActive ? 500 : 400,
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  position: "relative",
                  transition:
                    "background var(--dur-micro) var(--ease-smooth), color var(--dur-micro) var(--ease-smooth)",
                  borderLeft: isActive
                    ? "2px solid var(--ch-accent)"
                    : "2px solid transparent",
                  paddingLeft: "calc(0.875rem - 2px)",
                }}
              >
                <Icon size={15} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Bottom stats */}
        <div
          style={{
            borderTop: "1px solid var(--ch-border)",
            paddingTop: "1rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.5rem",
            padding: "1rem 0.625rem 0",
          }}
        >
          <div
            style={{
              background: "var(--ch-bg-elevated)",
              borderRadius: "8px",
              padding: "0.625rem 0.5rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "var(--ch-text-primary)",
              }}
            >
              {MOCK_USER.connections}
            </div>
            <div
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.65rem",
                color: "var(--ch-text-tertiary)",
                marginTop: "2px",
              }}
            >
              Trusted Network
            </div>
          </div>
          <div
            style={{
              background: "var(--ch-bg-elevated)",
              borderRadius: "8px",
              padding: "0.625rem 0.5rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "var(--ch-text-primary)",
              }}
            >
              {MOCK_USER.applications}
            </div>
            <div
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.65rem",
                color: "var(--ch-text-tertiary)",
                marginTop: "2px",
              }}
            >
              Applied
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile sidebar (slide in) ─────────────────────────── */}
      <aside
        style={{
          width: "240px",
          position: "fixed",
          top: "64px",
          left: 0,
          bottom: 0,
          background: "var(--ch-bg-card)",
          borderRight: "1px solid var(--ch-border)",
          padding: "1.5rem 0.875rem",
          zIndex: 90,
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform var(--dur-panel) var(--ease-panel)",
        }}
        className="flex md:hidden"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <span
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "var(--ch-text-primary)",
            }}
          >
            {MOCK_USER.name}
          </span>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--ch-text-secondary)",
              padding: "0.25rem",
            }}
          >
            <X size={18} />
          </button>
        </div>
        <nav
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "0.125rem",
          }}
        >
          {NAV_TABS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              data-ocid={`ch.dashboard.mobile_nav.${id}_tab`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.625rem 0.875rem",
                borderRadius: "8px",
                border: "none",
                background:
                  activeTab === id ? "var(--ch-accent-muted)" : "transparent",
                color:
                  activeTab === id
                    ? "var(--ch-text-accent)"
                    : "var(--ch-text-secondary)",
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.875rem",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                borderLeft:
                  activeTab === id
                    ? "2px solid var(--ch-accent)"
                    : "2px solid transparent",
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main content ─────────────────────────────────────── */}
      <main
        ref={mainRef}
        style={{
          flex: 1,
          marginLeft: isMobile ? "0" : "240px",
          padding: "2rem 2rem 4rem",
          minHeight: "calc(100vh - 64px)",
          overflowX: "hidden",
        }}
        className="main-dashboard-content"
      >
        {/* Page header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "2rem",
            gap: "1rem",
          }}
        >
          <div
            style={{
              animation: "ch-hero-reveal 0.6s var(--ease-reveal) both",
            }}
          >
            <h1
              className="font-cormorant"
              style={{
                fontSize: "var(--ch-text-h2)",
                fontWeight: 400,
                color: "var(--ch-text-primary)",
                margin: 0,
                lineHeight: 1.15,
              }}
            >
              {greeting}, {MOCK_USER.name.split(" ")[0]}
            </h1>
            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.8125rem",
                color: "var(--ch-text-secondary)",
                margin: "0.3rem 0 0",
              }}
            >
              Your personalised dashboard —{" "}
              <span style={{ color: "var(--ch-text-accent)" }}>
                {MOCK_USER.industry}
              </span>{" "}
              · {MOCK_USER.role}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              flexShrink: 0,
            }}
          >
            {/* Mobile menu toggle */}
            <button
              type="button"
              aria-label="Open sidebar"
              data-ocid="ch.dashboard.mobile_menu_button"
              onClick={() => setSidebarOpen(true)}
              className="flex md:hidden"
              style={{
                background: "var(--ch-bg-card)",
                border: "1px solid var(--ch-border)",
                borderRadius: "8px",
                padding: "0.5rem",
                cursor: "pointer",
                color: "var(--ch-text-secondary)",
                display: "none",
              }}
            >
              <Menu size={18} />
            </button>

            {/* Bell / notifications */}
            <button
              type="button"
              aria-label="Notifications"
              data-ocid="ch.dashboard.notifications_button"
              onClick={() => setNotifOpen(true)}
              style={{
                position: "relative",
                background: "var(--ch-bg-card)",
                border: "1px solid var(--ch-border)",
                borderRadius: "8px",
                padding: "0.5rem",
                cursor: "pointer",
                color: "var(--ch-text-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition:
                  "border-color var(--dur-micro) var(--ease-smooth), color var(--dur-micro) var(--ease-smooth)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--ch-border-hover)";
                e.currentTarget.style.color = "var(--ch-text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--ch-border)";
                e.currentTarget.style.color = "var(--ch-text-secondary)";
              }}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-4px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: "var(--ch-accent)",
                    fontSize: "0.55rem",
                    fontFamily: "DM Sans, sans-serif",
                    fontWeight: 700,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile CTA */}
            <Link
              to="/CommunityHub/Profile"
              data-ocid="ch.dashboard.profile_link"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                background: "transparent",
                border: "1px solid var(--ch-border)",
                borderRadius: "8px",
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.8rem",
                fontWeight: 500,
                color: "var(--ch-text-secondary)",
                textDecoration: "none",
                transition:
                  "border-color var(--dur-micro) var(--ease-smooth), color var(--dur-micro) var(--ease-smooth)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "var(--ch-border-hover)";
                el.style.color = "var(--ch-text-primary)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "var(--ch-border)";
                el.style.color = "var(--ch-text-secondary)";
              }}
            >
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: "rgba(42,94,255,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  color: "var(--ch-text-accent)",
                }}
              >
                {MOCK_USER.initials}
              </div>
              Profile
            </Link>
          </div>
        </div>

        {/* Tab content */}
        <div
          key={activeTab}
          style={{ animation: "ch-hero-reveal 0.35s var(--ease-smooth) both" }}
        >
          {activeTab === "feed" && <FeedTab principal={principal} />}
          {activeTab === "connections" && (
            <ConnectionsTab principal={principal} />
          )}
          {activeTab === "applications" && (
            <ApplicationsTab principal={principal} />
          )}
          {activeTab === "settings" && <SettingsTab onLogout={logout} />}
        </div>
      </main>

      {/* Notifications drawer */}
      <NotificationsDrawer
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
      />

      {/* Responsive sidebar margin fix */}
      <style>{`
        @media (max-width: 768px) {
          .main-dashboard-content {
            margin-left: 0 !important;
            padding: 1.25rem 1rem 3rem;
          }
        }
      `}</style>
    </div>
  );
}
