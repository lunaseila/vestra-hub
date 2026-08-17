import ItemCard from "@/components/shared/ItemCard";
import VerifiedBadge from "@/components/shared/VerifiedBadge";
import { useMarketplace } from "@/context/MarketplaceContext";
import { Link, useSearch } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  ChevronDown,
  ChevronUp,
  Heart,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";

function formatPrice(cents: number) {
  return `€${(cents / 100).toLocaleString("en-EU", { minimumFractionDigits: 0 })}`;
}

const ACCORDION_SECTIONS = [
  { key: "description", label: "Description" },
  { key: "material", label: "Material & Care" },
  { key: "measurements", label: "Measurements" },
  { key: "passport", label: "Item ID" },
];

export default function ItemDetail() {
  const search = useSearch({ from: "/Item" }) as { id?: string };
  const {
    products,
    getItem,
    getPassportForItem,
    isWishlisted,
    toggleWishlist,
    addToBag,
    bag,
  } = useMarketplace();
  const item = getItem(search.id) ?? products[0];
  const passport = getPassportForItem(item.id);

  const [mainImg, setMainImg] = useState(0);
  const [openSection, setOpenSection] = useState<string | null>("description");
  const [bagMessage, setBagMessage] = useState("");

  const related = products
    .filter((i) => i.category === item.category && i.id !== item.id)
    .slice(0, 4);
  const wishlisted = isWishlisted(item.id);
  const inBag = bag.some((line) => line.itemId === item.id);

  const toggleSection = (key: string) =>
    setOpenSection((s) => (s === key ? null : key));

  const accordionContent: Record<string, string> = {
    description: item.description,
    material: item.material,
    measurements: item.measurements,
    passport: passport
      ? passport.certificate_code || passport.id
      : "No Digital Fashion Passport has been issued for this item yet.",
  };

  return (
    <div
      data-ocid="item_detail.page"
      style={{
        background: "var(--vestra-ink)",
        color: "var(--vestra-white)",
        minHeight: "100vh",
      }}
    >
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 2rem" }}
      >
        {/* Breadcrumb */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "2.5rem",
            fontFamily: "DM Sans",
            fontSize: "0.8rem",
            color: "var(--vestra-grey)",
          }}
          aria-label="Breadcrumb"
        >
          <Link
            to="/Home"
            style={{ color: "var(--vestra-grey)", textDecoration: "none" }}
          >
            Home
          </Link>
          <span>/</span>
          <Link
            to="/Archive"
            style={{ color: "var(--vestra-grey)", textDecoration: "none" }}
          >
            Collection
          </Link>
          <span>/</span>
          <span style={{ color: "var(--vestra-grey-light)" }}>{item.name}</span>
        </nav>

        {/* Two-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "3fr 2fr",
            gap: "3.5rem",
            alignItems: "start",
          }}
        >
          {/* Left — Gallery */}
          <div data-ocid="item_detail.gallery">
            <div
              style={{
                aspectRatio: "1/1",
                borderRadius: "8px",
                overflow: "hidden",
                background: "var(--vestra-graphite)",
                marginBottom: "1rem",
                border: "1px solid var(--vestra-border)",
                cursor: "zoom-in",
              }}
              className="img-zoom-container"
            >
              <img
                src={item.images[mainImg] ?? item.images[0]}
                alt={item.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            {/* Thumbnails */}
            {item.images.length > 1 && (
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {item.images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    aria-label={`View image ${i + 1}`}
                    data-ocid={`item_detail.thumbnail.${i + 1}`}
                    onClick={() => setMainImg(i)}
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "4px",
                      overflow: "hidden",
                      border: `2px solid ${
                        mainImg === i
                          ? "var(--vestra-gold)"
                          : "var(--vestra-border)"
                      }`,
                      padding: 0,
                      cursor: "pointer",
                      transition:
                        "border-color var(--dur-base) var(--ease-luxury)",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={img}
                      alt={`${item.name} view ${i + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Info */}
          <div data-ocid="item_detail.info">
            {/* Brand */}
            <p
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--vestra-gold)",
                marginBottom: "0.5rem",
              }}
            >
              {item.brand}
            </p>
            {/* Item name */}
            <h1
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "var(--text-h1)",
                fontWeight: 400,
                color: "var(--vestra-white)",
                lineHeight: 1.2,
                marginBottom: "1rem",
              }}
            >
              {item.name}
            </h1>

            {/* Condition + Verified row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1.25rem",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  padding: "0.25rem 0.875rem",
                  borderRadius: "100px",
                  background: "var(--vestra-graphite)",
                  border: "1px solid var(--vestra-border)",
                  fontFamily: "DM Sans",
                  fontSize: "0.8rem",
                  color: "var(--vestra-grey-light)",
                }}
              >
                {item.condition}
              </span>
              {passport ? (
                <VerifiedBadge />
              ) : (
                <span
                  style={{
                    padding: "0.25rem 0.875rem",
                    borderRadius: "100px",
                    background: "var(--vestra-gold-muted)",
                    border: "1px solid var(--vestra-border)",
                    fontFamily: "DM Sans",
                    fontSize: "0.8rem",
                    color: "var(--vestra-gold)",
                  }}
                >
                  Authentication pending
                </span>
              )}
            </div>

            {/* Price */}
            {item.price_buy && (
              <p
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontStyle: "italic",
                  fontSize: "2rem",
                  color: "var(--vestra-gold)",
                  marginBottom: "0.5rem",
                }}
              >
                {formatPrice(item.price_buy)}
              </p>
            )}
            {/* Action buttons */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                marginBottom: "2rem",
              }}
            >
              {item.price_buy && (
                <button
                  type="button"
                  className="btn-gold"
                  data-ocid="item_detail.add_to_bag_button"
                  style={{ width: "100%", padding: "0.875rem" }}
                  onClick={() => {
                    addToBag(item.id);
                    setBagMessage(
                      inBag
                        ? "This piece is already in your bag."
                        : "Added to your bag.",
                    );
                  }}
                >
                  <ShoppingBag size={16} className="mr-2" />
                  {inBag ? "In Bag" : "Add to Bag"}
                </button>
              )}
              {item.price_buy && (
                <Link
                  to="/Checkout"
                  search={{ id: item.id }}
                  style={{ display: "block" }}
                >
                  <button
                    type="button"
                    className="btn-outlined"
                    data-ocid="item_detail.checkout_now_button"
                    style={{ width: "100%", padding: "0.875rem" }}
                  >
                    Checkout This Piece
                  </button>
                </Link>
              )}
              <button
                type="button"
                data-ocid="item_detail.wishlist_button"
                onClick={() => toggleWishlist(item.id)}
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  borderRadius: "100px",
                  background: "transparent",
                  border: "1px solid var(--vestra-border)",
                  color: wishlisted
                    ? "var(--vestra-gold)"
                    : "var(--vestra-grey-light)",
                  fontFamily: "DM Sans",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  transition: "all var(--dur-base) var(--ease-luxury)",
                }}
              >
                <Heart
                  size={16}
                  fill={wishlisted ? "var(--vestra-gold)" : "none"}
                  color={wishlisted ? "var(--vestra-gold)" : "currentColor"}
                />
                {wishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
              </button>
              {bagMessage && (
                <p
                  style={{
                    color: "var(--vestra-grey-light)",
                    fontSize: "0.82rem",
                  }}
                >
                  {bagMessage}{" "}
                  <Link to="/Bag" style={{ color: "var(--vestra-gold)" }}>
                    View bag
                  </Link>
                </p>
              )}
            </div>

            <div
              style={{
                border: "1px solid var(--vestra-border)",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1.5rem",
                color: "var(--vestra-grey-light)",
                fontFamily: "DM Sans",
                fontSize: "0.85rem",
                lineHeight: 1.7,
              }}
            >
              <p>
                <span style={{ color: "var(--vestra-white)" }}>Seller:</span>{" "}
                {item.seller_id || "Not provided"}
              </p>
              <p>
                <span style={{ color: "var(--vestra-white)" }}>Era:</span>{" "}
                {Math.floor(item.year / 10) * 10}s
              </p>
              <p>
                <span style={{ color: "var(--vestra-white)" }}>Shipping:</span>{" "}
                Calculated by configured shipping provider at checkout.
              </p>
              <p>
                <span style={{ color: "var(--vestra-white)" }}>Returns:</span>{" "}
                Governed by final Returns & Refunds policy.
              </p>
            </div>

            <div
              style={{
                borderTop: "1px solid var(--vestra-border)",
                paddingTop: "1.5rem",
              }}
            >
              {/* Accordion */}
              {ACCORDION_SECTIONS.map(({ key, label }) => (
                <div
                  key={key}
                  style={{ borderBottom: "1px solid var(--vestra-border)" }}
                >
                  <button
                    type="button"
                    data-ocid={`item_detail.accordion_${key}`}
                    onClick={() => toggleSection(key)}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1rem 0",
                      background: "none",
                      border: "none",
                      color: "var(--vestra-white)",
                      fontFamily: "DM Sans",
                      fontSize: "0.9rem",
                      cursor: "pointer",
                    }}
                  >
                    {label}
                    {openSection === key ? (
                      <ChevronUp size={16} color="var(--vestra-grey)" />
                    ) : (
                      <ChevronDown size={16} color="var(--vestra-grey)" />
                    )}
                  </button>
                  {openSection === key && (
                    <div
                      style={{
                        paddingBottom: "1rem",
                        fontFamily:
                          key === "passport"
                            ? "JetBrains Mono, monospace"
                            : "DM Sans",
                        fontSize: "0.875rem",
                        color:
                          key === "passport"
                            ? "var(--vestra-gold)"
                            : "var(--vestra-grey-light)",
                        lineHeight: 1.7,
                      }}
                    >
                      {accordionContent[key]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Digital Passport Preview */}
        {passport && (
          <section
            data-ocid="item_detail.passport_preview"
            style={{ marginTop: "4rem" }}
          >
            <h2
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "var(--text-h2)",
                fontWeight: 400,
                color: "var(--vestra-white)",
                marginBottom: "1.5rem",
              }}
            >
              Digital Passport
            </h2>
            <div
              className="animate-holo"
              style={{
                background:
                  "linear-gradient(135deg, var(--vestra-graphite) 0%, rgba(196,169,125,0.08) 50%, var(--vestra-graphite) 100%)",
                border: "1px solid var(--vestra-gold)",
                borderRadius: "12px",
                padding: "2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1.5rem",
                boxShadow: "0 0 32px var(--vestra-gold-glow)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.25rem",
                }}
              >
                <Award
                  size={40}
                  style={{ color: "var(--vestra-gold)", flexShrink: 0 }}
                  strokeWidth={1}
                />
                <div>
                  <p
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "1.1rem",
                      color: "var(--vestra-gold)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {passport.certificate_code}
                  </p>
                  <p
                    style={{
                      fontFamily: "DM Sans",
                      fontSize: "0.85rem",
                      color: "var(--vestra-grey-light)",
                      marginBottom: "0.2rem",
                    }}
                  >
                    Inspected by {passport.inspector_name}
                  </p>
                  <p
                    style={{
                      fontFamily: "DM Sans",
                      fontSize: "0.8rem",
                      color: "var(--vestra-grey)",
                    }}
                  >
                    {new Date(passport.authentication_date).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                    {" · "}
                    {passport.condition_verified}
                  </p>
                </div>
              </div>
              <Link to="/Passport" search={{ id: passport.id }}>
                <button
                  type="button"
                  className="btn-gold"
                  data-ocid="item_detail.view_passport_button"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  View Full Passport <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </section>
        )}

        {/* Related Items */}
        {related.length > 0 && (
          <section
            data-ocid="item_detail.related_items"
            style={{ marginTop: "4rem" }}
          >
            <h2
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "var(--text-h2)",
                fontWeight: 400,
                color: "var(--vestra-white)",
                marginBottom: "1.5rem",
              }}
            >
              You May Also Like
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {related.map((itm, i) => (
                <ItemCard key={itm.id} item={itm} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
