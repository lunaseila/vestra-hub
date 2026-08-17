import { useMarketplace } from "@/context/MarketplaceContext";
import type { Item } from "@/types";
import { Link } from "@tanstack/react-router";
import { Eye, Heart } from "lucide-react";
import { useState } from "react";
import VerifiedBadge from "./VerifiedBadge";

interface ItemCardProps {
  item: Item;
  onWishlist?: () => void;
  onQuickView?: () => void;
  className?: string;
  index?: number;
}

function formatPrice(cents: number) {
  return `€${(cents / 100).toLocaleString("en-EU", { minimumFractionDigits: 0 })}`;
}

export default function ItemCard({
  item,
  onWishlist,
  onQuickView,
  className,
  index = 0,
}: ItemCardProps) {
  const [hovered, setHovered] = useState(false);
  const { isWishlisted, toggleWishlist } = useMarketplace();
  // const [imgLoaded, setImgLoaded] = useState(false);

  const displayPrice = item.price_buy ? formatPrice(item.price_buy) : null;
  const saved = isWishlisted(item.id);

  return (
    <div
      data-ocid={`item_card.item.${index + 1}`}
      className={className}
      style={{
        position: "relative",
        aspectRatio: "3/4",
        borderRadius: "0px",
        overflow: "hidden",
        border: `1px solid ${hovered ? "#111111" : "#e0e0e0"}`,
        background: "#ffffff",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
        transition:
          "transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Cover Image */}
      {item.images && item.images.length > 0 ? (
        <img
          src={item.images[0]}
          alt={item.name}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            zIndex: 0,
          }}
          onError={(e) => {
            const img = e.currentTarget as HTMLImageElement;
            if (!img.src.endsWith("/assets/images/placeholder.svg")) {
              img.src = "/assets/images/placeholder.svg";
            }
          }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#1a1a1a",
            zIndex: 0,
          }}
        />
      )}
      <Link
        to="/Item"
        search={{ id: item.id }}
        style={{ display: "block", height: "100%", textDecoration: "none" }}
      >
        {/* Bottom Overlay */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background:
              "linear-gradient(to top, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.85) 50%, transparent 100%)",
            padding: "2.5rem 0.875rem 0.875rem",
            zIndex: 1,
          }}
        >
          <p
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "0.62rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#888888",
              marginBottom: "0.2rem",
            }}
          >
            {item.category === "Art" && item.artist ? item.artist : item.brand}
          </p>
          <p
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "0.9rem",
              color: "#111111",
              marginBottom: "0.3rem",
              lineHeight: 1.3,
            }}
          >
            {item.name}
          </p>
          {displayPrice && (
            <p
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontStyle: "normal",
                fontSize: "0.85rem",
                color: "#111111",
                marginBottom: "0.4rem",
              }}
            >
              {displayPrice}
            </p>
          )}
          <VerifiedBadge />
        </div>
      </Link>

      {/* Quick Actions */}
      <div
        style={{
          position: "absolute",
          top: "0.75rem",
          right: "0.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateX(0)" : "translateX(8px)",
          transition:
            "opacity 250ms var(--ease-luxury), transform 250ms var(--ease-luxury)",
        }}
      >
        <button
          type="button"
          aria-label="Add to wishlist"
          data-ocid={`item_card.wishlist_button.${index + 1}`}
          onClick={(e) => {
            e.preventDefault();
            if (onWishlist) onWishlist();
            else toggleWishlist(item.id);
          }}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.9)",
            border: "1px solid #e0e0e0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: saved ? "#C4A97D" : "#111111",
          }}
        >
          <Heart size={14} fill={saved ? "#C4A97D" : "none"} />
        </button>
        <button
          type="button"
          aria-label="Quick view"
          data-ocid={`item_card.quick_view_button.${index + 1}`}
          onClick={(e) => {
            e.preventDefault();
            onQuickView?.();
          }}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.9)",
            border: "1px solid #e0e0e0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#111111",
          }}
        >
          <Eye size={14} />
        </button>
      </div>
    </div>
  );
}
