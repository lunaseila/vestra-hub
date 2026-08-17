import type {
  CHOpportunityFilter,
  CHOpportunityType,
} from "@/types/communityHub";
import { CH_INDUSTRIES, FEATURED_COUNTRIES } from "@/types/communityHub";
import { ChevronDown } from "lucide-react";

const TYPE_FILTERS: Array<{ label: string; value: CHOpportunityType | "All" }> =
  [
    { label: "All", value: "All" },
    { label: "Jobs", value: "Job" },
    { label: "Partnerships", value: "Partnership" },
    { label: "Freelance", value: "Freelance" },
    { label: "Startup Collab", value: "Startup" },
    { label: "Investment", value: "Investment" },
  ];

interface FilterBarProps {
  filters: CHOpportunityFilter;
  onFilterChange: (filters: CHOpportunityFilter) => void;
  totalCount?: number;
}

function SelectWrapper({
  value,
  onChange,
  children,
  "data-ocid": dataOcid,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  "data-ocid": string;
}) {
  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-ocid={dataOcid}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          background: "var(--ch-bg-card)",
          border: "1px solid var(--ch-border)",
          borderRadius: "8px",
          padding: "0.4375rem 2.25rem 0.4375rem 0.75rem",
          fontSize: "0.8rem",
          fontFamily: "DM Sans, sans-serif",
          color: "var(--ch-text-secondary)",
          cursor: "pointer",
          outline: "none",
          lineHeight: 1,
          transition:
            "border-color var(--dur-micro) var(--ease-smooth), color var(--dur-micro) var(--ease-smooth)",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--ch-border-hover)";
          e.target.style.color = "var(--ch-text-primary)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "var(--ch-border)";
          e.target.style.color = "var(--ch-text-secondary)";
        }}
      >
        {children}
      </select>
      <ChevronDown
        size={13}
        style={{
          position: "absolute",
          right: "0.6rem",
          pointerEvents: "none",
          color: "var(--ch-text-tertiary)",
        }}
      />
    </div>
  );
}

export default function FilterBar({
  filters,
  onFilterChange,
  totalCount,
}: FilterBarProps) {
  return (
    <div
      data-ocid="ch.filter_bar"
      style={{
        position: "sticky",
        top: "64px",
        zIndex: 50,
        background: "rgba(7,9,14,0.94)",
        backdropFilter: "blur(24px) saturate(160%)",
        WebkitBackdropFilter: "blur(24px) saturate(160%)",
        borderBottom: "1px solid var(--ch-border)",
        padding: "0.75rem max(1.5rem, calc((100vw - 1200px) / 2))",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          flexWrap: "wrap",
        }}
      >
        {/* Type filter pills */}
        <div
          style={{
            display: "flex",
            gap: "0.375rem",
            overflowX: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            flexShrink: 0,
          }}
          className="scrollbar-none"
        >
          {TYPE_FILTERS.map((f) => {
            const isActive = (filters.type ?? "All") === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => onFilterChange({ ...filters, type: f.value })}
                data-ocid={`ch.filter.type.${f.value.toLowerCase()}`}
                style={{
                  padding: "0.375rem 0.875rem",
                  borderRadius: "100px",
                  fontSize: "0.8rem",
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  border: isActive
                    ? "1px solid var(--ch-accent)"
                    : "1px solid var(--ch-border)",
                  background: isActive
                    ? "var(--ch-accent-muted)"
                    : "transparent",
                  color: isActive
                    ? "var(--ch-text-accent)"
                    : "var(--ch-text-secondary)",
                  transition: "all var(--dur-micro) var(--ease-smooth)",
                  boxShadow: isActive
                    ? "0 0 12px var(--ch-accent-glow)"
                    : "none",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, minWidth: "0.5rem" }} />

        {/* Dropdowns */}
        <SelectWrapper
          value={filters.country ?? ""}
          onChange={(v) =>
            onFilterChange({ ...filters, country: v || undefined })
          }
          data-ocid="ch.filter.country_select"
        >
          <option value="">All Countries</option>
          {FEATURED_COUNTRIES.map((c) => (
            <option key={c.name} value={c.name}>
              {c.flag} {c.name}
            </option>
          ))}
        </SelectWrapper>

        <SelectWrapper
          value={filters.industry ?? ""}
          onChange={(v) =>
            onFilterChange({ ...filters, industry: v || undefined })
          }
          data-ocid="ch.filter.industry_select"
        >
          <option value="">All Industries</option>
          {CH_INDUSTRIES.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </SelectWrapper>

        <SelectWrapper
          value={filters.sort ?? "recent"}
          onChange={(v) =>
            onFilterChange({
              ...filters,
              sort: v as CHOpportunityFilter["sort"],
            })
          }
          data-ocid="ch.filter.sort_select"
        >
          <option value="recent">Most Recent</option>
          <option value="match">Best Match</option>
          <option value="popular">Most Popular</option>
        </SelectWrapper>

        {/* Count badge */}
        {totalCount !== undefined && (
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--ch-text-tertiary)",
              fontFamily: "JetBrains Mono, monospace",
              background: "rgba(255,255,255,0.04)",
              padding: "0.3rem 0.6rem",
              borderRadius: "6px",
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
              border: "1px solid var(--ch-border)",
            }}
          >
            {totalCount} results
          </span>
        )}
      </div>
    </div>
  );
}
