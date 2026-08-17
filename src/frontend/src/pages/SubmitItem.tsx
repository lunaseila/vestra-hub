import { Switch } from "@/components/ui/switch";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  Check,
  ChevronDown,
  Image as ImageIcon,
  Palette,
  ShoppingBag,
  TrendingUp,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

const SECTIONS = [
  "Item Details",
  "Condition",
  "Images",
  "Pricing",
  "Review & Submit",
];
const BRAND_SUGGESTIONS = [
  "Chanel",
  "Hermès",
  "Louis Vuitton",
  "Gucci",
  "Prada",
  "Bottega Veneta",
  "Dior",
  "Saint Laurent",
  "Balenciaga",
  "Valentino",
  "Givenchy",
  "Celine",
];
const FASHION_CATEGORIES = [
  "Bags",
  "Ready-to-Wear",
  "Shoes",
  "Jewellery",
  "Accessories",
  "Outerwear",
];
const ART_CATEGORIES = [
  "Painting",
  "Sculpture",
  "Photography",
  "Print & Edition",
  "Mixed Media",
  "Textile Art",
  "Digital Art",
  "Installation",
  "Other",
];
const FASHION_CONDITIONS = [
  { id: "Pristine", label: "Pristine", desc: "As new, never worn" },
  {
    id: "Excellent",
    label: "Excellent",
    desc: "Lightly worn, no visible marks",
  },
  { id: "Very Good", label: "Very Good", desc: "Some signs of use" },
  { id: "Good", label: "Good", desc: "Visible wear, priced accordingly" },
];
const ART_CONDITIONS = [
  {
    id: "Pristine",
    label: "Pristine",
    desc: "Never displayed, museum quality",
  },
  {
    id: "Excellent",
    label: "Excellent",
    desc: "Minor signs of age, no damage",
  },
  {
    id: "Very Good",
    label: "Very Good",
    desc: "Light wear or patina consistent with age",
  },
  { id: "Good", label: "Good", desc: "Visible wear, priced accordingly" },
];
const TIMELINE_STEPS = [
  "Submitted",
  "Under Review",
  "Authenticated",
  "Listed",
  "Sold",
];
const PRICE_RANGES: Record<string, Record<string, string>> = {
  Chanel: { Bags: "€3,200–€8,500", "Ready-to-Wear": "€1,800–€4,200" },
  Hermès: { Bags: "€8,000–€25,000" },
  "Louis Vuitton": { Bags: "€900–€3,500" },
  Gucci: { Bags: "€1,200–€3,800", "Ready-to-Wear": "€1,500–€4,000" },
  Prada: { Bags: "€850–€2,800" },
  "Bottega Veneta": { Bags: "€1,400–€4,200" },
};

interface UploadedImage {
  id: string;
  url: string;
  name: string;
  file: File;
}
type SubmissionType = "fashion" | "art";

interface FormState {
  submissionType: SubmissionType;
  name: string;
  brand: string;
  category: string;
  season: string;
  year: string;
  medium: string;
  condition: string;
  restored: boolean;
  askingPrice: string;
  acceptOffers: boolean;
  minOffer: string;
  requestValuation: boolean;
  terms: boolean;
  provenance: string;
}

const EMPTY_FORM: FormState = {
  submissionType: "fashion",
  name: "",
  brand: "",
  category: "",
  season: "",
  year: "",
  medium: "",
  condition: "",
  restored: false,
  askingPrice: "",
  acceptOffers: false,
  minOffer: "",
  requestValuation: false,
  terms: false,
  provenance: "",
};

export default function SubmitItem() {
  const { submitSellerItem } = useMarketplace();
  const navigate = useNavigate();
  const search = useSearch({ from: "/SubmitItem" });
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [form, setForm] = useState<FormState>(() => {
    const preselect = (search as Record<string, unknown>)?.type;
    if (preselect === "art") {
      return { ...EMPTY_FORM, submissionType: "art" };
    }
    return EMPTY_FORM;
  });
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isArt = form.submissionType === "art";
  const CONDITIONS = isArt ? ART_CONDITIONS : FASHION_CONDITIONS;

  const setField = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleFiles = (files: File[]) => {
    setUploadError(null);
    const toProcess = files.slice(0, 8 - images.length);
    for (const file of toProcess) {
      try {
        const url = URL.createObjectURL(file);
        setImages((prev) => [
          ...prev,
          { id: `${Date.now()}-${file.name}`, url, name: file.name, file },
        ]);
      } catch {
        setUploadError(
          "Failed to process one or more images. Please try again.",
        );
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(
      Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/"),
      ),
    );
  };

  const priceHint = (() => {
    const brd = PRICE_RANGES[form.brand];
    if (!brd) return null;
    return brd[form.category] ?? Object.values(brd)[0] ?? null;
  })();

  const advanceSection = () => {
    setCompletedSections((prev) => [...new Set([...prev, currentSection])]);
    setCurrentSection((prev) => Math.min(prev + 1, SECTIONS.length - 1));
  };

  const canAdvanceSection = () => {
    if (currentSection === 0) {
      if (isArt) return form.name && form.brand && form.category && form.year;
      return form.name && form.brand && form.category;
    }
    if (currentSection === 1) return form.condition;
    if (currentSection === 2) return images.length >= (isArt ? 2 : 4);
    if (currentSection === 3) return form.requestValuation || form.askingPrice;
    if (currentSection === 4) return form.terms;
    return false;
  };

  const handleSubmitForAuthentication = () => {
    submitSellerItem({
      submissionType: form.submissionType,
      name: form.name,
      brand: form.brand,
      category: form.category,
      season: form.season,
      year: form.year,
      medium: form.medium,
      condition: form.condition,
      askingPrice: form.requestValuation ? undefined : form.askingPrice,
      provenance: form.provenance,
      imageNames: images.map((image) => image.name),
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen" style={{ background: "var(--vestra-ink)" }}>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-10">
          <div className="flex justify-center animate-luxury-reveal">
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              role="img"
              aria-label="Submission complete"
            >
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="var(--vestra-gold)"
                strokeWidth="2"
                opacity="0.25"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="var(--vestra-gold)"
                strokeWidth="2"
                strokeDasharray="226"
                strokeDashoffset="0"
                style={{
                  animation: "draw-check 1.5s var(--ease-reveal) forwards",
                }}
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
              />
              <path
                d="M24 41L35 52L57 28"
                stroke="var(--vestra-gold)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="55"
                strokeDashoffset="55"
                style={{
                  animation: "draw-check 0.8s 0.6s var(--ease-reveal) forwards",
                }}
              />
            </svg>
          </div>
          <div
            className="space-y-3 animate-luxury-reveal"
            style={{ animationDelay: "0.2s" }}
          >
            <h1 className="font-playfair text-3xl text-vestra-white">
              Your item is in review.
            </h1>
            <p
              className="text-sm max-w-md mx-auto"
              style={{ color: "var(--vestra-grey-light)" }}
            >
              Our authentication team will physically inspect your {form.brand}{" "}
              {form.name} within 48 hours.
            </p>
          </div>
          <div
            className="vestra-card p-6 animate-luxury-reveal"
            style={{ animationDelay: "0.4s" }}
          >
            <h3 className="text-label text-vestra-grey-light mb-5">
              What happens next
            </h3>
            <div className="relative">
              <div
                className="absolute left-[13px] top-0 bottom-0 w-px"
                style={{ background: "var(--vestra-border)" }}
              />
              <div className="space-y-5">
                {TIMELINE_STEPS.map((step, i) => (
                  <div key={step} className="flex items-center gap-4 relative">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center z-10 flex-shrink-0 text-xs font-mono-vestra"
                      style={{
                        background:
                          i === 0
                            ? "var(--vestra-gold)"
                            : "var(--vestra-graphite)",
                        border: `1px solid ${i === 0 ? "var(--vestra-gold)" : "var(--vestra-border)"}`,
                        color:
                          i === 0
                            ? "var(--vestra-black)"
                            : "var(--vestra-grey)",
                      }}
                    >
                      {i === 0 ? <Check size={12} /> : i + 1}
                    </div>
                    <span
                      className="text-sm"
                      style={{
                        color:
                          i === 0
                            ? "var(--vestra-white)"
                            : "var(--vestra-grey)",
                      }}
                    >
                      {step}
                      {i === 0 && (
                        <span
                          className="ml-2 text-xs font-mono-vestra"
                          style={{ color: "var(--vestra-verified)" }}
                        >
                          ✓ Complete
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn-gold"
            onClick={() => navigate({ to: "/Archive" })}
            data-ocid="submit.continue_button"
          >
            Back to Archive
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--vestra-ink)" }}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-10">
          <p className="text-label text-gold mb-2">Sell Your Piece</p>
          <h1 className="font-playfair text-4xl text-vestra-white">
            Submit an Item
          </h1>
          <div className="flex gap-2 mt-6" data-ocid="submit.progress">
            {SECTIONS.map((label, i) => (
              <div key={label} className="flex-1 space-y-1.5">
                <div
                  className="h-0.5 rounded-full transition-luxury"
                  style={{
                    background: completedSections.includes(i)
                      ? "var(--vestra-gold)"
                      : i === currentSection
                        ? "rgba(196,169,125,0.4)"
                        : "var(--vestra-border)",
                  }}
                />
                <p
                  className="text-[10px] uppercase tracking-wider hidden sm:block"
                  style={{
                    color:
                      i === currentSection
                        ? "var(--vestra-gold)"
                        : "var(--vestra-grey)",
                  }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {currentSection === 0 && (
          <div
            className="space-y-5 animate-luxury-reveal"
            data-ocid="submit.section_details"
          >
            <h2 className="font-playfair text-2xl text-vestra-white">
              Item Details
            </h2>

            {/* Fashion / Art Selection Cards */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setField("submissionType", "fashion")}
                className="rounded-lg p-5 flex flex-col items-center gap-3 transition-luxury text-center"
                style={{
                  background:
                    form.submissionType === "fashion"
                      ? "var(--vestra-gold-muted)"
                      : "var(--vestra-graphite)",
                  border: `1px solid ${form.submissionType === "fashion" ? "var(--vestra-gold)" : "var(--vestra-border)"}`,
                }}
                data-ocid="submit.fashion_card"
              >
                <ShoppingBag
                  size={24}
                  style={{ color: "var(--vestra-gold)" }}
                />
                <span className="text-vestra-white font-dm-sans font-medium text-sm">
                  Fashion
                </span>
              </button>
              <button
                type="button"
                onClick={() => setField("submissionType", "art")}
                className="rounded-lg p-5 flex flex-col items-center gap-3 transition-luxury text-center"
                style={{
                  background:
                    form.submissionType === "art"
                      ? "var(--vestra-gold-muted)"
                      : "var(--vestra-graphite)",
                  border: `1px solid ${form.submissionType === "art" ? "var(--vestra-gold)" : "var(--vestra-border)"}`,
                }}
                data-ocid="submit.art_card"
              >
                <Palette size={24} style={{ color: "var(--vestra-gold)" }} />
                <span className="text-vestra-white font-dm-sans font-medium text-sm">
                  Art
                </span>
              </button>
            </div>

            {form.submissionType && (
              <div className="space-y-4 animate-luxury-reveal">
                <Field label={isArt ? "Artwork Title" : "Item Name"} id="name">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    placeholder={
                      isArt ? "e.g. Untitled No. 7" : "e.g. Birkin 30 Togo"
                    }
                    className="vestra-input"
                    data-ocid="submit.name_input"
                  />
                </Field>
                <Field label={isArt ? "Artist Name" : "Brand"} id="brand">
                  <div className="relative">
                    <input
                      type="text"
                      value={form.brand}
                      onChange={(e) => {
                        setField("brand", e.target.value);
                        if (!isArt) setShowBrandSuggestions(true);
                      }}
                      onBlur={() =>
                        setTimeout(() => setShowBrandSuggestions(false), 150)
                      }
                      placeholder={
                        isArt ? "e.g. Unknown / Anonymous" : "e.g. Hermès"
                      }
                      className="vestra-input w-full"
                      data-ocid="submit.brand_input"
                    />
                    {!isArt && showBrandSuggestions && form.brand && (
                      <div
                        className="absolute top-full left-0 right-0 z-20 rounded-lg overflow-hidden mt-1"
                        style={{
                          background: "var(--vestra-graphite)",
                          border: "1px solid var(--vestra-border)",
                        }}
                      >
                        {BRAND_SUGGESTIONS.filter((b) =>
                          b.toLowerCase().includes(form.brand.toLowerCase()),
                        ).map((b) => (
                          <button
                            key={b}
                            type="button"
                            className="w-full text-left px-4 py-2.5 text-sm text-vestra-white hover:bg-vestra-gold-muted transition-luxury"
                            onClick={() => {
                              setField("brand", b);
                              setShowBrandSuggestions(false);
                            }}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </Field>
                <Field label="Category" id="category">
                  <div className="relative">
                    <select
                      value={form.category}
                      onChange={(e) => setField("category", e.target.value)}
                      className="vestra-input w-full appearance-none"
                      data-ocid="submit.category_select"
                      style={{ background: "var(--vestra-graphite)" }}
                    >
                      <option value="" disabled>
                        Select category
                      </option>
                      {(isArt ? ART_CATEGORIES : FASHION_CATEGORIES).map(
                        (c) => (
                          <option
                            key={c}
                            value={c}
                            style={{ background: "var(--vestra-graphite)" }}
                          >
                            {c}
                          </option>
                        ),
                      )}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "var(--vestra-grey)" }}
                    />
                  </div>
                </Field>
                {isArt ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Year of Creation" id="year">
                        <input
                          type="number"
                          value={form.year}
                          onChange={(e) => setField("year", e.target.value)}
                          placeholder="2022"
                          min="1800"
                          max={new Date().getFullYear()}
                          className="vestra-input"
                          data-ocid="submit.year_input"
                        />
                      </Field>
                    </div>
                    <Field label="Medium" id="medium">
                      <input
                        type="text"
                        value={form.medium}
                        onChange={(e) => setField("medium", e.target.value)}
                        placeholder="e.g. Oil on canvas, Bronze, C-print"
                        className="vestra-input"
                        data-ocid="submit.medium_input"
                      />
                    </Field>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Season" id="season">
                      <input
                        type="text"
                        value={form.season}
                        onChange={(e) => setField("season", e.target.value)}
                        placeholder="e.g. FW2022"
                        className="vestra-input"
                        data-ocid="submit.season_input"
                      />
                    </Field>
                    <Field label="Year" id="year">
                      <input
                        type="number"
                        value={form.year}
                        onChange={(e) => setField("year", e.target.value)}
                        placeholder="2022"
                        min="1980"
                        max={new Date().getFullYear()}
                        className="vestra-input"
                        data-ocid="submit.year_input"
                      />
                    </Field>
                  </div>
                )}
                <Field label="Provenance / Ownership Notes" id="provenance">
                  <textarea
                    value={form.provenance}
                    onChange={(e) => setField("provenance", e.target.value)}
                    placeholder="Optional: original receipt, previous ownership, atelier, archive references, restoration notes..."
                    className="vestra-input"
                    rows={4}
                    data-ocid="submit.provenance_textarea"
                    style={{ resize: "vertical" }}
                  />
                </Field>
              </div>
            )}
            <SectionNav
              onContinue={advanceSection}
              canContinue={!!canAdvanceSection()}
              ocid="submit"
            />
          </div>
        )}

        {currentSection === 1 && (
          <div
            className="space-y-5 animate-luxury-reveal"
            data-ocid="submit.section_condition"
          >
            <h2 className="font-playfair text-2xl text-vestra-white">
              Item Condition
            </h2>
            <div className="space-y-3">
              {CONDITIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setField("condition", c.id)}
                  className="w-full text-left rounded-lg p-4 flex items-center gap-4 transition-luxury"
                  style={{
                    background:
                      form.condition === c.id
                        ? "var(--vestra-gold-muted)"
                        : "var(--vestra-graphite)",
                    border: `1px solid ${form.condition === c.id ? "var(--vestra-gold)" : "var(--vestra-border)"}`,
                    borderLeft:
                      form.condition === c.id
                        ? "3px solid var(--vestra-gold)"
                        : "1px solid var(--vestra-border)",
                  }}
                  data-ocid={`submit.condition_${c.id.toLowerCase().replace(" ", "_")}`}
                >
                  <div className="flex-1">
                    <p className="text-vestra-white font-dm-sans font-medium">
                      {c.label}
                    </p>
                    <p
                      className="text-sm mt-0.5"
                      style={{ color: "var(--vestra-grey-light)" }}
                    >
                      {c.desc}
                    </p>
                  </div>
                  {form.condition === c.id && (
                    <Check size={16} className="text-gold flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
            {isArt && (
              <div className="vestra-card p-4 flex items-center justify-between animate-luxury-reveal">
                <div>
                  <p className="text-sm text-vestra-white font-dm-sans font-medium">
                    Restored?
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--vestra-grey-light)" }}
                  >
                    Has this piece been professionally restored?
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setField("restored", true)}
                    className="px-4 py-1.5 rounded-full text-xs font-dm-sans font-medium transition-luxury"
                    style={{
                      background: form.restored
                        ? "var(--vestra-gold)"
                        : "var(--vestra-graphite)",
                      color: form.restored
                        ? "var(--vestra-black)"
                        : "var(--vestra-white)",
                      border: `1px solid ${form.restored ? "var(--vestra-gold)" : "var(--vestra-border)"}`,
                    }}
                    data-ocid="submit.restored_yes"
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setField("restored", false)}
                    className="px-4 py-1.5 rounded-full text-xs font-dm-sans font-medium transition-luxury"
                    style={{
                      background: !form.restored
                        ? "var(--vestra-gold)"
                        : "var(--vestra-graphite)",
                      color: !form.restored
                        ? "var(--vestra-black)"
                        : "var(--vestra-white)",
                      border: `1px solid ${!form.restored ? "var(--vestra-gold)" : "var(--vestra-border)"}`,
                    }}
                    data-ocid="submit.restored_no"
                  >
                    No
                  </button>
                </div>
              </div>
            )}
            <SectionNav
              onContinue={advanceSection}
              canContinue={!!canAdvanceSection()}
              onBack={() => setCurrentSection(0)}
              ocid="submit"
            />
          </div>
        )}

        {currentSection === 2 && (
          <div
            className="space-y-5 animate-luxury-reveal"
            data-ocid="submit.section_images"
          >
            <div>
              <h2 className="font-playfair text-2xl text-vestra-white">
                Upload Photos
              </h2>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--vestra-grey-light)" }}
              >
                {isArt
                  ? "Minimum 2 photos required. Up to 8 total. Include: front view, detail shots, signature or stamp, and certificate if available."
                  : "Minimum 4 photos required. Up to 8 total."}
              </p>
            </div>
            {images.length < 8 && (
              <button
                type="button"
                className="rounded-xl border-2 border-dashed p-10 flex flex-col items-center gap-3 cursor-pointer transition-luxury"
                style={{
                  borderColor: isDragging
                    ? "var(--vestra-gold)"
                    : "var(--vestra-border)",
                  background: isDragging
                    ? "var(--vestra-gold-muted)"
                    : "transparent",
                  width: "100%",
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                aria-label="Upload item photos"
                data-ocid="submit.dropzone"
              >
                <Upload size={28} style={{ color: "var(--vestra-gold)" }} />
                <p className="text-vestra-white font-dm-sans text-sm">
                  Drop up to 8 photos here
                </p>
                <p className="text-xs" style={{ color: "var(--vestra-grey)" }}>
                  or click to browse — JPG, PNG, WebP
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) handleFiles(Array.from(e.target.files));
                  }}
                  data-ocid="submit.upload_button"
                />
              </button>
            )}
            {uploadError && (
              <p className="text-sm" style={{ color: "#ff6b6b" }}>
                {uploadError}
              </p>
            )}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <div
                    key={img.id}
                    className="relative group aspect-square rounded-lg overflow-hidden"
                    style={{ border: "1px solid var(--vestra-border)" }}
                  >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setImages((prev) => prev.filter((p) => p.id !== img.id))
                      }
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-luxury w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(8,8,10,0.85)" }}
                      data-ocid={`submit.remove_image.${i + 1}`}
                    >
                      <X size={12} className="text-vestra-white" />
                    </button>
                  </div>
                ))}
                {[0, 1, 2, 3]
                  .filter((n) => n >= images.length)
                  .map((n) => (
                    <div
                      key={`ph-slot-${n}`}
                      className="aspect-square rounded-lg flex items-center justify-center"
                      style={{ border: "1px dashed var(--vestra-border)" }}
                    >
                      <ImageIcon
                        size={20}
                        style={{ color: "var(--vestra-grey)" }}
                      />
                    </div>
                  ))}
              </div>
            )}
            <p
              className="text-xs"
              style={{
                color:
                  images.length >= (isArt ? 2 : 4)
                    ? "var(--vestra-verified)"
                    : "var(--vestra-grey)",
              }}
            >
              {images.length}/{isArt ? 2 : 4} minimum{" "}
              {images.length >= (isArt ? 2 : 4) ? "✓" : "required"}
            </p>
            <SectionNav
              onContinue={advanceSection}
              canContinue={!!canAdvanceSection()}
              onBack={() => setCurrentSection(1)}
              ocid="submit"
            />
          </div>
        )}

        {currentSection === 3 && (
          <div
            className="space-y-5 animate-luxury-reveal"
            data-ocid="submit.section_pricing"
          >
            <h2 className="font-playfair text-2xl text-vestra-white">
              Pricing
            </h2>
            <div className="space-y-4">
              <div className="vestra-card p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-vestra-white font-dm-sans font-medium">
                    Request Valuation instead
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--vestra-grey-light)" }}
                  >
                    Not sure of the price? Our team will assess your piece.
                  </p>
                </div>
                <Switch
                  checked={form.requestValuation}
                  onCheckedChange={(v) => setField("requestValuation", v)}
                  data-ocid="submit.request_valuation_toggle"
                />
              </div>
              {!form.requestValuation && (
                <>
                  <Field label="Asking Price (€)" id="askingPrice">
                    <div className="relative">
                      <span
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-sm"
                        style={{ color: "var(--vestra-grey)" }}
                      >
                        €
                      </span>
                      <input
                        type="number"
                        value={form.askingPrice}
                        min="1"
                        onChange={(e) =>
                          setField("askingPrice", e.target.value)
                        }
                        placeholder="0"
                        className="vestra-input w-full pl-8"
                        data-ocid="submit.asking_price_input"
                      />
                    </div>
                  </Field>
                  {priceHint && !isArt && (
                    <div
                      className="flex items-start gap-3 rounded-lg p-4"
                      style={{
                        background: "var(--vestra-gold-muted)",
                        border: "1px solid var(--vestra-border-hover)",
                      }}
                    >
                      <TrendingUp
                        size={14}
                        className="text-gold mt-0.5 flex-shrink-0"
                      />
                      <p
                        className="text-sm"
                        style={{ color: "var(--vestra-gold)" }}
                      >
                        Similar {form.brand} {form.category} items sold for{" "}
                        <strong>{priceHint}</strong> on Vestra
                      </p>
                    </div>
                  )}
                </>
              )}
              <div className="vestra-card p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-vestra-white font-dm-sans font-medium">
                    Accept Offers?
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--vestra-grey-light)" }}
                  >
                    Allow buyers to negotiate a price
                  </p>
                </div>
                <Switch
                  checked={form.acceptOffers}
                  onCheckedChange={(v) => setField("acceptOffers", v)}
                  data-ocid="submit.accept_offers_toggle"
                />
              </div>
              {form.acceptOffers && !form.requestValuation && (
                <Field label="Minimum Offer (€)" id="minOffer">
                  <div className="relative">
                    <span
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-sm"
                      style={{ color: "var(--vestra-grey)" }}
                    >
                      €
                    </span>
                    <input
                      type="number"
                      value={form.minOffer}
                      min="1"
                      onChange={(e) => setField("minOffer", e.target.value)}
                      placeholder="Lowest offer you'll consider"
                      className="vestra-input w-full pl-8"
                      data-ocid="submit.min_offer_input"
                    />
                  </div>
                </Field>
              )}
            </div>
            <SectionNav
              onContinue={advanceSection}
              canContinue={!!canAdvanceSection()}
              onBack={() => setCurrentSection(2)}
              ocid="submit"
            />
          </div>
        )}

        {currentSection === 4 && (
          <div
            className="space-y-5 animate-luxury-reveal"
            data-ocid="submit.section_review"
          >
            <h2 className="font-playfair text-2xl text-vestra-white">
              Review & Submit
            </h2>
            <div className="vestra-card p-5 space-y-3">
              {(
                [
                  [isArt ? "Artwork" : "Item", form.name],
                  [isArt ? "Artist" : "Brand", form.brand],
                  ["Category", form.category],
                  [
                    isArt ? "Medium / Year" : "Season / Year",
                    isArt
                      ? `${form.medium ? `${form.medium} / ` : ""}${form.year}`
                      : `${form.season} ${form.year}`,
                  ],
                  ["Condition", form.condition],
                  ...(isArt && form.restored
                    ? [["Restored", "Yes"] as [string, string]]
                    : []),
                  [
                    "Asking Price",
                    form.requestValuation
                      ? "Requesting Valuation"
                      : form.askingPrice
                        ? `€${form.askingPrice}`
                        : "—",
                  ],
                  [
                    "Accept Offers",
                    form.acceptOffers
                      ? `Yes${form.minOffer ? ` (min. €${form.minOffer})` : ""}`
                      : "No",
                  ],
                  [
                    "Provenance",
                    form.provenance.trim()
                      ? form.provenance.trim()
                      : "Not provided",
                  ],
                  ["Photos", `${images.length} uploaded`],
                ] as [string, string][]
              ).map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between text-sm py-1 section-divider first:border-t-0 first:pt-0"
                >
                  <span style={{ color: "var(--vestra-grey-light)" }}>
                    {label}
                  </span>
                  <span className="text-vestra-white">{value}</span>
                </div>
              ))}
            </div>
            <label
              className="flex items-start gap-3 cursor-pointer"
              htmlFor="submit-terms"
              data-ocid="submit.terms_checkbox"
            >
              <div
                className="w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center transition-luxury cursor-pointer"
                style={{
                  background: form.terms ? "var(--vestra-gold)" : "transparent",
                  border: `1px solid ${form.terms ? "var(--vestra-gold)" : "var(--vestra-border)"}`,
                }}
                onClick={() => setField("terms", !form.terms)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    setField("terms", !form.terms);
                }}
                role="presentation"
              >
                {form.terms && (
                  <Check size={12} style={{ color: "var(--vestra-black)" }} />
                )}
              </div>
              <input
                type="checkbox"
                id="submit-terms"
                checked={form.terms}
                onChange={(e) => setField("terms", e.target.checked)}
                className="sr-only"
              />
              <span
                className="text-sm"
                style={{ color: "var(--vestra-grey-light)" }}
              >
                I confirm this item is authentic and in the described condition,
                and I agree to Vestra's seller terms.
              </span>
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                className="btn-outlined"
                onClick={() => setCurrentSection(3)}
                data-ocid="submit.back_button"
              >
                ← Back
              </button>
              <button
                type="button"
                className="btn-gold flex-1"
                disabled={!form.terms}
                style={{ opacity: form.terms ? 1 : 0.45 }}
                onClick={handleSubmitForAuthentication}
                data-ocid="submit.submit_button"
              >
                Submit for Authentication
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  id,
  children,
}: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-label text-vestra-grey-light block mb-1.5"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function SectionNav({
  onContinue,
  canContinue,
  onBack,
  ocid,
}: {
  onContinue: () => void;
  canContinue: boolean;
  onBack?: () => void;
  ocid: string;
}) {
  return (
    <div className="flex gap-3 pt-2">
      {onBack && (
        <button
          type="button"
          className="btn-outlined"
          onClick={onBack}
          data-ocid={`${ocid}.back_button`}
        >
          ← Back
        </button>
      )}
      <button
        type="button"
        className="btn-gold flex-1"
        onClick={onContinue}
        disabled={!canContinue}
        style={{ opacity: canContinue ? 1 : 0.45 }}
        data-ocid={`${ocid}.continue_button`}
      >
        Continue →
      </button>
    </div>
  );
}
