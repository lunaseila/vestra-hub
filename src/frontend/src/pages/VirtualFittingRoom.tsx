import VerifiedBadge from "@/components/shared/VerifiedBadge";
import { MOCK_ITEMS } from "@/types";
import type { Item } from "@/types";
import { Link } from "@tanstack/react-router";
import { Download, ImagePlus, RotateCcw } from "lucide-react";
import { useCallback, useRef, useState } from "react";

function formatPrice(cents: number) {
  return `€${(cents / 100).toLocaleString("en-EU", { minimumFractionDigits: 0 })}`;
}

export default function VirtualFittingRoom() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(MOCK_ITEMS[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setUploadedImage(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  const displayPrice = selectedItem
    ? selectedItem.price_buy
      ? formatPrice(selectedItem.price_buy)
      : null
    : null;

  return (
    <div
      data-ocid="virtual_fitting_room.page"
      style={{
        minHeight: "100vh",
        background: "var(--vestra-ink)",
        paddingTop: "80px",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid var(--vestra-border)",
          padding: "2rem 2rem 1.5rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--vestra-gold)",
            marginBottom: "0.5rem",
          }}
        >
          Virtual Experience
        </p>
        <h1
          style={{
            fontFamily: "Playfair Display, Georgia, serif",
            fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
            fontWeight: 400,
            color: "var(--vestra-white)",
          }}
        >
          Virtual Fitting Room
        </h1>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.4fr)",
          gap: "0",
          minHeight: "calc(100vh - 200px)",
        }}
        className="fitting-room-grid"
      >
        {/* LEFT — Item Selection */}
        <div
          style={{
            borderRight: "1px solid var(--vestra-border)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "1.5rem",
              borderBottom: "1px solid var(--vestra-border)",
            }}
          >
            <h2
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--vestra-grey-light)",
              }}
            >
              Select a piece to try on
            </h2>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1rem",
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "0.75rem",
              alignContent: "start",
            }}
          >
            {MOCK_ITEMS.slice(0, 8).map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  data-ocid={`fitting_room.item_select.${item.id}`}
                  onClick={() => setSelectedItem(item)}
                  style={{
                    padding: 0,
                    border: `2px solid ${
                      isSelected ? "var(--vestra-gold)" : "var(--vestra-border)"
                    }`,
                    borderRadius: "8px",
                    overflow: "hidden",
                    cursor: "pointer",
                    background: "var(--vestra-graphite)",
                    transition:
                      "border-color var(--dur-base) var(--ease-luxury)",
                    boxShadow: isSelected
                      ? "0 0 16px var(--vestra-gold-glow)"
                      : "none",
                  }}
                >
                  <div style={{ aspectRatio: "1", overflow: "hidden" }}>
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div style={{ padding: "0.5rem" }}>
                    <p
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "0.58rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--vestra-grey)",
                        marginBottom: "0.15rem",
                      }}
                    >
                      {item.brand}
                    </p>
                    <p
                      style={{
                        fontFamily: "Playfair Display, Georgia, serif",
                        fontSize: "0.8rem",
                        color: "var(--vestra-white)",
                        lineHeight: 1.2,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {item.name}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedItem && (
            <div
              data-ocid="fitting_room.selected_item.panel"
              style={{
                borderTop: "1px solid var(--vestra-border)",
                padding: "1.25rem",
                background: "var(--vestra-graphite)",
              }}
            >
              <p
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.62rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--vestra-grey)",
                  marginBottom: "0.2rem",
                }}
              >
                {selectedItem.brand}
              </p>
              <p
                style={{
                  fontFamily: "Playfair Display, Georgia, serif",
                  fontSize: "1rem",
                  color: "var(--vestra-white)",
                  marginBottom: "0.25rem",
                }}
              >
                {selectedItem.name}
              </p>
              {displayPrice && (
                <p
                  style={{
                    fontFamily: "Playfair Display, Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "0.95rem",
                    color: "var(--vestra-gold)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {displayPrice}
                </p>
              )}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {selectedItem.price_buy && (
                  <Link
                    to="/BuyItem"
                    search={{ id: selectedItem.id }}
                    data-ocid="fitting_room.buy.button"
                    className="btn-gold"
                    style={{ fontSize: "0.75rem", padding: "0.5rem 1rem" }}
                  >
                    Buy
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — Upload / Preview */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            background: "var(--vestra-black)",
          }}
        >
          {!uploadedImage ? (
            <button
              type="button"
              data-ocid="fitting_room.upload.dropzone"
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              style={{
                width: "100%",
                maxWidth: "480px",
                aspectRatio: "2/3",
                border: `2px dashed ${
                  isDragging ? "var(--vestra-gold)" : "var(--vestra-border)"
                }`,
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "2rem",
                gap: "1rem",
                transition: "border-color var(--dur-base) var(--ease-luxury)",
                background: isDragging
                  ? "var(--vestra-gold-muted)"
                  : "transparent",
                cursor: "pointer",
              }}
              onClick={() => fileRef.current?.click()}
              aria-label="Upload photo for virtual try-on"
            >
              <ImagePlus
                size={48}
                style={{ color: "var(--vestra-grey)", opacity: 0.6 }}
              />
              <div>
                <p
                  style={{
                    fontFamily: "Playfair Display, Georgia, serif",
                    fontSize: "1.1rem",
                    color: "var(--vestra-white)",
                    marginBottom: "0.4rem",
                  }}
                >
                  Upload a full-length photo
                </p>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.85rem",
                    color: "var(--vestra-grey-light)",
                  }}
                >
                  for best results
                </p>
              </div>
              <button
                type="button"
                className="btn-outlined"
                style={{
                  fontSize: "0.8rem",
                  padding: "0.6rem 1.5rem",
                  pointerEvents: "none",
                }}
              >
                Browse files
              </button>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.72rem",
                  color: "var(--vestra-grey)",
                  lineHeight: 1.5,
                  maxWidth: "280px",
                }}
              >
                Your photo is never stored. Processing happens locally.
              </p>
            </button>
          ) : (
            <div
              data-ocid="fitting_room.preview.panel"
              style={{
                width: "100%",
                maxWidth: "480px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.25rem",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "2/3",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid var(--vestra-border)",
                }}
              >
                <img
                  src={uploadedImage}
                  alt="Uploaded look"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {selectedItem && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "55%",
                      paddingBottom: "8%",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={selectedItem.images[0]}
                      alt={selectedItem.name}
                      style={{
                        width: "100%",
                        objectFit: "contain",
                        opacity: 0.85,
                        filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.6))",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                )}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background:
                      "linear-gradient(to top, rgba(8,8,10,0.85) 0%, transparent 100%)",
                    padding: "1.5rem 1rem 0.75rem",
                  }}
                >
                  {selectedItem && (
                    <>
                      <p
                        style={{
                          fontFamily: "Playfair Display, Georgia, serif",
                          fontSize: "0.95rem",
                          color: "var(--vestra-white)",
                          marginBottom: "0.2rem",
                        }}
                      >
                        {selectedItem.name}
                      </p>
                      {displayPrice && (
                        <p
                          style={{
                            fontFamily: "Playfair Display, Georgia, serif",
                            fontStyle: "italic",
                            fontSize: "0.875rem",
                            color: "var(--vestra-gold)",
                          }}
                        >
                          {displayPrice}
                        </p>
                      )}
                      <VerifiedBadge />
                    </>
                  )}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {selectedItem?.price_buy && (
                  <Link
                    to="/BuyItem"
                    search={{ id: selectedItem.id }}
                    data-ocid="fitting_room.preview_buy.button"
                    className="btn-gold"
                    style={{ fontSize: "0.85rem" }}
                  >
                    Buy This Piece
                  </Link>
                )}

                <button
                  type="button"
                  data-ocid="fitting_room.share.button"
                  className="btn-outlined"
                  style={{ fontSize: "0.85rem" }}
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = uploadedImage;
                    a.download = "vestra-fitting.jpg";
                    a.click();
                  }}
                >
                  <Download
                    size={14}
                    style={{ marginRight: "0.4rem", display: "inline" }}
                  />
                  Save Look
                </button>
                <button
                  type="button"
                  data-ocid="fitting_room.try_another.button"
                  onClick={() => setUploadedImage(null)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--vestra-grey-light)",
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <RotateCcw size={12} />
                  Try another photo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={onFileChange}
        aria-label="Upload image file"
      />

      <style>{`
        @media (max-width: 768px) {
          .fitting-room-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
