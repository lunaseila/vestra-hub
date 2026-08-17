import FilterBar from "@/components/communityHub/FilterBar";
import OpportunityCard from "@/components/communityHub/OpportunityCard";
import { useOpportunities } from "@/hooks/useCommunityHubBackend";
import type { CHOpportunityFilter } from "@/types/communityHub";
import { useNavigate } from "@tanstack/react-router";
import type React from "react";
import { useCallback, useMemo, useState } from "react";

const PAGE_SIZE = 12;

// ─── Shimmer helpers ─────────────────────────────────────────────────────────────────
function shimmerStyle(delay = 0): React.CSSProperties {
  return {
    background:
      "linear-gradient(90deg, var(--ch-bg-elevated) 25%, rgba(255,255,255,0.04) 50%, var(--ch-bg-elevated) 75%)",
    backgroundSize: "200% 100%",
    animation: `ch-shimmer 1.8s infinite ${delay}s`,
  };
}

// ─── Skeleton card ──────────────────────────────────────────────────────────────────
function SkeletonCard({ index }: { index: number }) {
  return (
    <div
      style={{
        height: 248,
        borderRadius: 14,
        background: "var(--ch-bg-card)",
        border: "1px solid var(--ch-border)",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        overflow: "hidden",
        animation: "ch-hero-reveal 0.5s var(--ease-reveal) both",
        animationDelay: `${index * 80}ms`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 72,
            height: 20,
            borderRadius: 100,
            ...shimmerStyle(0),
          }}
        />
        <div
          style={{
            width: 40,
            height: 14,
            borderRadius: 6,
            ...shimmerStyle(0.1),
          }}
        />
      </div>
      <div
        style={{
          width: "85%",
          height: 18,
          borderRadius: 6,
          ...shimmerStyle(0.05),
        }}
      />
      <div
        style={{
          width: "60%",
          height: 14,
          borderRadius: 6,
          ...shimmerStyle(0.1),
        }}
      />
      <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.25rem" }}>
        {[60, 80, 70].map((w, i) => (
          <div
            key={`sk-tag-${index}-${w}`}
            style={{
              width: w,
              height: 20,
              borderRadius: 6,
              ...shimmerStyle(i * 0.08),
            }}
          />
        ))}
      </div>
      <div style={{ flex: 1 }} />
      <div
        style={{
          width: "100%",
          height: 36,
          borderRadius: 8,
          ...shimmerStyle(0.2),
        }}
      />
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────────────
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div
      data-ocid="ch.opportunities.empty_state"
      style={{
        textAlign: "center",
        padding: "8rem 2rem",
        animation: "ch-hero-reveal 0.5s var(--ease-reveal) both",
      }}
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
          margin: "0 auto 1.75rem",
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
          <path
            d="M10 14h8M14 10v8"
            stroke="var(--ch-text-tertiary)"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </div>
      <h2
        className="font-cormorant"
        style={{
          fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
          fontWeight: 400,
          fontStyle: "italic",
          color: "var(--ch-text-secondary)",
          marginBottom: "0.75rem",
          marginTop: 0,
          lineHeight: 1.3,
        }}
      >
        No opportunities match your filters
      </h2>
      <p
        style={{
          fontSize: "0.9rem",
          color: "var(--ch-text-tertiary)",
          fontFamily: "DM Sans, sans-serif",
          lineHeight: 1.65,
          maxWidth: 380,
          margin: "0 auto 2rem",
        }}
      >
        Try broadening your search — thousands of global builders are waiting to
        connect.
      </p>
      <button
        type="button"
        onClick={onReset}
        data-ocid="ch.opportunities.reset_filters_button"
        className="ch-btn-outlined"
        style={{ fontSize: "0.875rem", padding: "0.625rem 2rem" }}
      >
        Reset Filters
      </button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────────────
export default function CHOpportunities() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<CHOpportunityFilter>({
    sort: "recent",
  });
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);

  const { data: opportunities = [], isLoading } = useOpportunities(filters);

  const visibleOpps = useMemo(
    () => opportunities.slice(0, visibleCount),
    [opportunities, visibleCount],
  );
  const hasMore = visibleCount < opportunities.length;
  const remaining = opportunities.length - visibleCount;

  const handleLoadMore = useCallback(() => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((c) => Math.min(c + PAGE_SIZE, opportunities.length));
      setLoadingMore(false);
    }, 500);
  }, [opportunities.length]);

  const handleReset = useCallback(() => {
    setFilters({ sort: "recent" });
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleCardClick = useCallback(
    (id: string) => {
      navigate({ to: "/CommunityHub/Opportunities/$id", params: { id } });
    },
    [navigate],
  );

  return (
    <div
      data-ocid="ch.opportunities.page"
      style={{
        minHeight: "100vh",
        background: "var(--ch-bg-surface)",
        paddingTop: 64,
      }}
    >
      {/* Sticky filter bar */}
      <FilterBar
        filters={filters}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          setVisibleCount(PAGE_SIZE);
        }}
        totalCount={isLoading ? undefined : opportunities.length}
      />

      <main
        style={{ maxWidth: 1400, margin: "0 auto", padding: "3rem 2rem 6rem" }}
      >
        {/* Page heading */}
        <header
          style={{
            marginBottom: "2.5rem",
            animation: "ch-hero-reveal 0.6s var(--ease-reveal) both",
          }}
        >
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.72rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--ch-gold)",
              marginBottom: "0.5rem",
              marginTop: 0,
            }}
          >
            Global Collaboration Network
          </p>
          <h1
            className="font-cormorant"
            style={{
              fontSize: "clamp(2rem, 3.5vw, 3.5rem)",
              fontWeight: 400,
              color: "var(--ch-text-primary)",
              marginBottom: "0.5rem",
              marginTop: 0,
              lineHeight: 1.1,
            }}
          >
            Global Opportunities
          </h1>
          {!isLoading && (
            <p
              key={opportunities.length}
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.875rem",
                color: "var(--ch-text-secondary)",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Showing{" "}
              <strong
                style={{ color: "var(--ch-text-primary)", fontWeight: 600 }}
              >
                {opportunities.length}
              </strong>{" "}
              {opportunities.length === 1 ? "opportunity" : "opportunities"}
              {(filters.type && filters.type !== "All") ||
              filters.country ||
              filters.industry
                ? " matching your filters"
                : " from across the globe"}
            </p>
          )}
        </header>

        {/* Grid area */}
        {isLoading ? (
          <div
            data-ocid="ch.opportunities.loading_state"
            className="ch-opps-grid"
          >
            {Array.from({ length: 6 }, (_, i) => (
              <SkeletonCard
                key={`skel-${["a", "b", "c", "d", "e", "f"][i]}`}
                index={i}
              />
            ))}
          </div>
        ) : opportunities.length === 0 ? (
          <EmptyState onReset={handleReset} />
        ) : (
          <>
            <div data-ocid="ch.opportunities.list" className="ch-opps-grid">
              {visibleOpps.map((opp, index) => (
                <div
                  key={opp.id}
                  data-ocid={`ch.opportunities.item.${index + 1}`}
                >
                  <OpportunityCard
                    opportunity={opp}
                    index={index}
                    onClick={() => handleCardClick(opp.id)}
                  />
                </div>
              ))}
            </div>

            {hasMore && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginTop: "3.5rem",
                }}
              >
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  data-ocid="ch.opportunities.load_more_button"
                  style={{
                    padding: "0.875rem 3rem",
                    borderRadius: 100,
                    background: "transparent",
                    border: "1px solid var(--ch-accent)",
                    color: "var(--ch-text-accent)",
                    fontFamily: "DM Sans, sans-serif",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    cursor: loadingMore ? "default" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.625rem",
                    transition: "all var(--dur-base) var(--ease-smooth)",
                    opacity: loadingMore ? 0.65 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!loadingMore) {
                      e.currentTarget.style.background =
                        "var(--ch-accent-muted)";
                      e.currentTarget.style.boxShadow =
                        "0 0 24px var(--ch-accent-glow)";
                      e.currentTarget.style.color = "var(--ch-text-primary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.color = "var(--ch-text-accent)";
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = "scale(0.97)";
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  {loadingMore ? (
                    <>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        style={{ animation: "ch-spin 0.8s linear infinite" }}
                        aria-hidden="true"
                      >
                        <title>Loading</title>
                        <circle
                          cx="7"
                          cy="7"
                          r="5.5"
                          stroke="var(--ch-accent)"
                          strokeWidth="1.5"
                          strokeDasharray="16"
                          strokeDashoffset="8"
                          strokeLinecap="round"
                        />
                      </svg>
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More
                      <span
                        style={{
                          fontFamily: "JetBrains Mono, monospace",
                          fontSize: "0.7rem",
                          color: "var(--ch-text-tertiary)",
                          background: "rgba(255,255,255,0.05)",
                          padding: "2px 8px",
                          borderRadius: 4,
                          border: "1px solid var(--ch-border)",
                        }}
                      >
                        +{remaining}
                      </span>
                    </>
                  )}
                </button>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.78rem",
                    color: "var(--ch-text-tertiary)",
                    margin: 0,
                  }}
                >
                  Showing {visibleCount} of {opportunities.length}
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <style>{`
        .ch-opps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 1024px) and (min-width: 640px) {
          .ch-opps-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 639px) {
          .ch-opps-grid { grid-template-columns: 1fr; }
        }
        @keyframes ch-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes ch-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
