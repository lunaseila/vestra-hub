import ItemCard from "@/components/shared/ItemCard";
import { useMarketplace } from "@/context/MarketplaceContext";
import type { ItemCondition } from "@/types";
import { useSearch } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

const CATEGORIES = [
  "All",
  "Bags",
  "Ready-to-Wear",
  "Shoes",
  "Accessories",
  "Jewellery",
  "Art",
];
const BRANDS = [
  "Chanel",
  "Hermès",
  "Louis Vuitton",
  "Gucci",
  "Prada",
  "Bottega Veneta",
  "Roberto Cavalli",
  "MM6",
  "Casadei",
  "Versace",
];
const CONDITIONS: ItemCondition[] = [
  "Pristine",
  "Excellent",
  "Very Good",
  "Good",
];
const SIZES = ["All", "XS", "S", "M", "L", "EU 38", "EU 39", "EU 40"];
const ERAS = ["All", "2010s", "2020s"];
const SORT_OPTIONS = ["Newest", "Price ↑", "Price ↓"];
const PAGE_SIZE = 8;

interface Filters {
  category: string;
  brands: string[];
  conditions: ItemCondition[];
  size: string;
  era: string;
  minPrice: number;
  maxPrice: number;
  query: string;
}

const defaultFilters: Filters = {
  category: "All",
  brands: [],
  conditions: [],
  size: "All",
  era: "All",
  minPrice: 0,
  maxPrice: 25000,
  query: "",
};

function getEra(year: number) {
  const decade = Math.floor(year / 10) * 10;
  return `${decade}s`;
}

export default function Collection() {
  const search = useSearch({ strict: false }) as { q?: string };
  const { products } = useMarketplace();
  const [filters, setFilters] = useState<Filters>({
    ...defaultFilters,
    query: search.q ?? "",
  });
  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];

    if (filters.category !== "All") {
      result = result.filter((i) => i.category === filters.category);
    }
    if (filters.brands.length) {
      result = result.filter((i) => filters.brands.includes(i.brand));
    }
    if (filters.conditions.length) {
      result = result.filter((i) => filters.conditions.includes(i.condition));
    }
    if (filters.size !== "All") {
      result = result.filter((i) =>
        i.measurements.toLowerCase().includes(filters.size.toLowerCase()),
      );
    }
    if (filters.era !== "All") {
      result = result.filter((i) => getEra(i.year) === filters.era);
    }
    if (filters.query.trim()) {
      const q = filters.query.trim().toLowerCase();
      result = result.filter((i) =>
        [
          i.name,
          i.brand,
          i.category,
          i.condition,
          i.material,
          i.measurements,
          i.description,
          i.year.toString(),
        ]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
    result = result.filter((i) => {
      const priceK = (i.price_buy ?? 0) / 100;
      return priceK >= filters.minPrice && priceK <= filters.maxPrice;
    });

    if (sort === "Price ↑")
      result.sort((a, b) => (a.price_buy ?? 0) - (b.price_buy ?? 0));
    if (sort === "Price ↓")
      result.sort((a, b) => (b.price_buy ?? 0) - (a.price_buy ?? 0));
    if (sort === "Newest")
      result.sort((a, b) => b.created_at.localeCompare(a.created_at));

    return result;
  }, [filters, products, sort]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const canLoadMore = visible.length < filtered.length;

  const clearAll = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  const toggleBrand = (brand: string) =>
    setFilters((f) => ({
      ...f,
      brands: f.brands.includes(brand)
        ? f.brands.filter((b) => b !== brand)
        : [...f.brands, brand],
    }));

  const toggleCondition = (cond: ItemCondition) =>
    setFilters((f) => ({
      ...f,
      conditions: f.conditions.includes(cond)
        ? f.conditions.filter((c) => c !== cond)
        : [...f.conditions, cond],
    }));

  const hasActiveFilters =
    filters.category !== "All" ||
    filters.brands.length > 0 ||
    filters.conditions.length > 0 ||
    filters.size !== "All" ||
    filters.era !== "All" ||
    filters.query.trim().length > 0;

  const sidebarContent = (
    <div
      style={{
        background: "var(--vestra-graphite)",
        borderRadius: "8px",
        padding: "2rem 1.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--vestra-grey-light)",
          }}
        >
          Filters
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            data-ocid="collection.clear_filters_button"
            onClick={clearAll}
            style={{
              fontFamily: "DM Sans",
              fontSize: "0.75rem",
              color: "var(--vestra-gold)",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div style={{ marginBottom: "2rem" }}>
        <p
          className="text-label"
          style={{ color: "var(--vestra-grey)", marginBottom: "0.75rem" }}
        >
          Category
        </p>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              data-ocid={`collection.category_filter.${cat.toLowerCase().replace(/ /g, "_")}`}
              onClick={() => {
                setFilters((f) => ({ ...f, category: cat }));
                setPage(1);
              }}
              style={{
                textAlign: "left",
                padding: "0.45rem 0.875rem",
                borderRadius: "6px",
                border: `1px solid ${filters.category === cat ? "var(--vestra-gold)" : "transparent"}`,
                background:
                  filters.category === cat
                    ? "var(--vestra-gold-muted)"
                    : "transparent",
                color:
                  filters.category === cat
                    ? "var(--vestra-gold)"
                    : "var(--vestra-grey-light)",
                fontFamily: "DM Sans",
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "all var(--dur-base) var(--ease-luxury)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div style={{ marginBottom: "2rem" }}>
        <p
          className="text-label"
          style={{ color: "var(--vestra-grey)", marginBottom: "0.75rem" }}
        >
          Brand
        </p>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          {BRANDS.map((brand) => (
            <label
              key={brand}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.625rem",
                cursor: "pointer",
                fontFamily: "DM Sans",
                fontSize: "0.875rem",
                color: "var(--vestra-grey-light)",
              }}
            >
              <input
                type="checkbox"
                data-ocid={`collection.brand_filter.${brand.toLowerCase().replace(/ /g, "_")}`}
                checked={filters.brands.includes(brand)}
                onChange={() => {
                  toggleBrand(brand);
                  setPage(1);
                }}
                style={{
                  accentColor: "var(--vestra-gold)",
                  width: "14px",
                  height: "14px",
                }}
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      {/* Size */}
      <div style={{ marginBottom: "2rem" }}>
        <p
          className="text-label"
          style={{ color: "var(--vestra-grey)", marginBottom: "0.75rem" }}
        >
          Size
        </p>
        <select
          value={filters.size}
          onChange={(e) => {
            setFilters((f) => ({ ...f, size: e.target.value }));
            setPage(1);
          }}
          data-ocid="collection.size_filter"
          style={{
            width: "100%",
            padding: "0.55rem 0.75rem",
            background: "var(--vestra-ink)",
            border: "1px solid var(--vestra-border)",
            color: "var(--vestra-white)",
            borderRadius: "6px",
            fontFamily: "DM Sans",
          }}
        >
          {SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Era */}
      <div style={{ marginBottom: "2rem" }}>
        <p
          className="text-label"
          style={{ color: "var(--vestra-grey)", marginBottom: "0.75rem" }}
        >
          Era
        </p>
        <select
          value={filters.era}
          onChange={(e) => {
            setFilters((f) => ({ ...f, era: e.target.value }));
            setPage(1);
          }}
          data-ocid="collection.era_filter"
          style={{
            width: "100%",
            padding: "0.55rem 0.75rem",
            background: "var(--vestra-ink)",
            border: "1px solid var(--vestra-border)",
            color: "var(--vestra-white)",
            borderRadius: "6px",
            fontFamily: "DM Sans",
          }}
        >
          {ERAS.map((era) => (
            <option key={era} value={era}>
              {era}
            </option>
          ))}
        </select>
      </div>

      {/* Condition */}
      <div style={{ marginBottom: "2rem" }}>
        <p
          className="text-label"
          style={{ color: "var(--vestra-grey)", marginBottom: "0.75rem" }}
        >
          Condition
        </p>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          {CONDITIONS.map((cond) => (
            <label
              key={cond}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.625rem",
                cursor: "pointer",
                fontFamily: "DM Sans",
                fontSize: "0.875rem",
                color: "var(--vestra-grey-light)",
              }}
            >
              <input
                type="checkbox"
                data-ocid={`collection.condition_filter.${cond.toLowerCase().replace(/ /g, "_")}`}
                checked={filters.conditions.includes(cond)}
                onChange={() => {
                  toggleCondition(cond);
                  setPage(1);
                }}
                style={{
                  accentColor: "var(--vestra-gold)",
                  width: "14px",
                  height: "14px",
                }}
              />
              {cond}
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <p
          className="text-label"
          style={{ color: "var(--vestra-grey)", marginBottom: "0.75rem" }}
        >
          Price Range
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
          }}
        >
          <span
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: "0.8rem",
              color: "var(--vestra-gold)",
            }}
          >
            €{filters.minPrice.toLocaleString()}
          </span>
          <span
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: "0.8rem",
              color: "var(--vestra-gold)",
            }}
          >
            €
            {filters.maxPrice === 25000
              ? "25,000+"
              : filters.maxPrice.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={25000}
          step={500}
          value={filters.maxPrice}
          data-ocid="collection.price_range_slider"
          onChange={(e) => {
            setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }));
            setPage(1);
          }}
          style={{ width: "100%", accentColor: "var(--vestra-gold)" }}
        />
      </div>
    </div>
  );

  return (
    <div
      data-ocid="collection.page"
      style={{
        background: "var(--vestra-ink)",
        minHeight: "100vh",
        color: "var(--vestra-white)",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "3rem 2rem",
        }}
      >
        {/* Page header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--vestra-gold)",
              marginBottom: "0.5rem",
            }}
          >
            The Archive
          </p>
          <h1
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "var(--text-h1)",
              fontWeight: 400,
              color: "var(--vestra-white)",
            }}
          >
            Archive
          </h1>
          <div style={{ marginTop: "1.5rem", maxWidth: "620px" }}>
            <label htmlFor="archive-search" className="sr-only">
              Search archive
            </label>
            <input
              id="archive-search"
              value={filters.query}
              onChange={(event) => {
                setFilters((f) => ({ ...f, query: event.target.value }));
                setPage(1);
              }}
              placeholder="Search brand, material, size, era, condition..."
              data-ocid="collection.search_input"
              style={{
                width: "100%",
                padding: "0.9rem 1rem",
                borderRadius: "0",
                background: "transparent",
                border: "1px solid var(--vestra-border)",
                color: "var(--vestra-white)",
                fontFamily: "DM Sans",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Mobile filter toggle — only visible on mobile */}
        <button
          type="button"
          data-ocid="collection.mobile_filter_toggle"
          onClick={() => setSidebarOpen(true)}
          className="flex md:hidden"
          style={{
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.6rem 1.25rem",
            borderRadius: "8px",
            background: "var(--vestra-graphite)",
            border: "1px solid var(--vestra-border)",
            color: "var(--vestra-white)",
            fontFamily: "DM Sans",
            fontSize: "0.875rem",
            cursor: "pointer",
            marginBottom: "1.5rem",
          }}
        >
          <SlidersHorizontal size={16} /> Filters
        </button>

        {/* Mobile sidebar overlay — full-screen dark drawer */}
        {sidebarOpen && (
          <div
            data-ocid="collection.mobile_filter_overlay"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: "#0F0F12",
              overflowY: "auto",
              padding: "5rem 1.5rem 2rem",
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setSidebarOpen(false);
            }}
            aria-modal="true"
            aria-label="Filters"
          >
            {/* Close button */}
            <button
              type="button"
              aria-label="Close filters"
              data-ocid="collection.close_filters_button"
              onClick={() => setSidebarOpen(false)}
              style={{
                position: "fixed",
                top: "1.25rem",
                right: "1.5rem",
                background: "none",
                border: "none",
                color: "var(--vestra-grey-light)",
                cursor: "pointer",
                zIndex: 201,
                padding: "8px",
              }}
            >
              <X size={24} />
            </button>
            {sidebarContent}
          </div>
        )}

        <div
          className="collection-layout"
          style={{ display: "flex", gap: "2.5rem", alignItems: "flex-start" }}
        >
          {/* Desktop sidebar — hidden on mobile */}
          <aside
            className="hidden md:block"
            style={{
              width: "280px",
              flexShrink: 0,
              position: "sticky",
              top: "80px",
            }}
          >
            {sidebarContent}
          </aside>

          {/* Product grid */}
          <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
            {/* Sort bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
                flexWrap: "wrap",
                gap: "0.75rem",
              }}
            >
              <p
                style={{
                  fontFamily: "DM Sans",
                  fontSize: "0.875rem",
                  color: "var(--vestra-grey)",
                }}
              >
                Showing{" "}
                <span style={{ color: "var(--vestra-white)", fontWeight: 500 }}>
                  {filtered.length}
                </span>{" "}
                pieces
              </p>
              <select
                data-ocid="collection.sort_select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{
                  padding: "0.45rem 2rem 0.45rem 0.875rem",
                  borderRadius: "8px",
                  background: "var(--vestra-graphite)",
                  border: "1px solid var(--vestra-border)",
                  color: "var(--vestra-white)",
                  fontFamily: "DM Sans",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            {/* Grid */}
            {visible.length === 0 ? (
              <div
                data-ocid="collection.empty_state"
                style={{
                  textAlign: "center",
                  padding: "6rem 2rem",
                  background: "var(--vestra-graphite)",
                  borderRadius: "12px",
                  border: "1px solid var(--vestra-border)",
                }}
              >
                <p
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontStyle: "italic",
                    fontSize: "1.25rem",
                    color: "var(--vestra-grey-light)",
                    marginBottom: "1.5rem",
                  }}
                >
                  No pieces match your filters.
                </p>
                <button
                  type="button"
                  className="btn-outlined"
                  data-ocid="collection.reset_filters_button"
                  onClick={clearAll}
                  style={{ padding: "0.6rem 1.5rem" }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div
                  className="collection-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "1.25rem",
                  }}
                >
                  {visible.map((item, i) => (
                    <ItemCard key={item.id} item={item} index={i} />
                  ))}
                </div>

                {canLoadMore && (
                  <div style={{ textAlign: "center", marginTop: "3rem" }}>
                    <button
                      type="button"
                      className="btn-outlined"
                      data-ocid="collection.load_more_button"
                      onClick={() => setPage((p) => p + 1)}
                      style={{ padding: "0.75rem 2.5rem" }}
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 1200px) {
          .collection-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .collection-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .collection-layout { display: block !important; }
        }
        @media (max-width: 480px) {
          .collection-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
