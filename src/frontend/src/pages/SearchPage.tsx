import ItemCard from "@/components/shared/ItemCard";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useSearch } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

export default function SearchPage() {
  const search = useSearch({ strict: false }) as { q?: string };
  const [query, setQuery] = useState(search.q ?? "");
  const { products } = useMarketplace();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((item) =>
      [
        item.name,
        item.brand,
        item.category,
        item.condition,
        item.material,
        item.measurements,
        item.description,
        item.year.toString(),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [products, query]);

  return (
    <div
      data-ocid="search.page"
      style={{ minHeight: "100vh", background: "#ffffff", color: "#111111" }}
    >
      <section
        style={{
          padding: "clamp(3rem, 7vw, 6rem) clamp(1.25rem, 5vw, 5rem)",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#888888",
              marginBottom: "0.75rem",
            }}
          >
            Search the Archive
          </p>
          <h1
            style={{
              fontSize: "clamp(2.4rem, 5vw, 5rem)",
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            Discover by Story
          </h1>
        </div>
      </section>

      <section style={{ padding: "2rem clamp(1.25rem, 5vw, 5rem) 5rem" }}>
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          <label
            htmlFor="vestra-search"
            style={{
              display: "block",
              fontSize: "0.68rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#888888",
              marginBottom: "0.75rem",
            }}
          >
            Product, brand, material, era, condition
          </label>
          <div style={{ position: "relative", maxWidth: "680px" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#888888",
              }}
            />
            <input
              id="vestra-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Chanel, 1990s, leather, pristine..."
              style={{
                width: "100%",
                border: "1px solid #111111",
                padding: "1rem 1rem 1rem 3rem",
                fontSize: "1rem",
                outline: "none",
              }}
            />
          </div>

          <p style={{ margin: "2rem 0 1rem", color: "#666666" }}>
            {results.length} {results.length === 1 ? "piece" : "pieces"} found
          </p>

          {results.length === 0 ? (
            <div
              data-ocid="search.empty_state"
              style={{
                border: "1px solid #e0e0e0",
                padding: "4rem 1.5rem",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                No pieces match your search.
              </p>
              <p style={{ color: "#666666" }}>
                Try a brand, category, material, condition or year.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {results.map((item, index) => (
                <ItemCard key={item.id} item={item} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
