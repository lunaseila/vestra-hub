// ============================================================
//  Vestra — Shared TypeScript Types
// ============================================================

export type ItemCondition = "Pristine" | "Excellent" | "Very Good" | "Good";
export type ItemAvailability = "Buy";
export type ItemStatus = "Draft" | "In Review" | "Listed" | "Sold";
export type OrderType = "Buy";
export type SubmissionType = "fashion" | "art";
export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Shipped"
  | "Delivered"
  | "Returned";
export type UserTier = "Member" | "Gold Member" | "Founding Member";

export interface Item {
  id: string;
  name: string;
  brand: string;
  artist?: string;
  category: string;
  season?: string;
  year: number;
  condition: ItemCondition;
  availability: ItemAvailability;
  price_buy: number | null;
  images: string[];
  description: string;
  material: string;
  measurements: string;
  passport_id: string | null;
  seller_id: string;
  status: ItemStatus;
  created_at: string;
  submissionType?: SubmissionType;
}

export interface DigitalPassport {
  id: string;
  item_id: string;
  authentication_date: string;
  inspector_name: string;
  certificate_code: string;
  condition_verified: ItemCondition;
  qr_code_url: string;
  blockchain_hash: string;
  created_at: string;
}

export interface ShippingAddress {
  id: string;
  line1: string;
  city: string;
  postcode: string;
  country: string;
  is_default: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  member_since: string;
  tier: UserTier;
  shipping_addresses: ShippingAddress[];
  stripe_customer_id: string | null;
  style_profile_id: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  item_id: string;
  buyer_id: string;
  order_type: OrderType;
  total_price: number;
  status: OrderStatus;
  stripe_payment_id: string | null;
  created_at: string;
}

export interface StyleProfile {
  id: string;
  user_id: string;
  archetype: string;
  decade: string;
  palette: string;
  occasion: string;
  created_at: string;
}

export interface ItemFilter {
  category?: string;
  brand?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface PersonalityArchetype {
  name: string;
  description: string;
  color: string;
}

// ============================================================
//  Mock Data
// ============================================================

export const MOCK_ITEMS: Item[] = [
  {
    id: "vtr-001",
    name: "Silver Glitter Booties",
    brand: "MM6 Maison Margiela",
    category: "Shoes",
    year: 2024,
    condition: "Pristine",
    availability: "Buy",
    price_buy: 55000,
    images: [
      "/assets/mm6-booties-1.jpg",
      "/assets/mm6-booties-2.jpg",
      "/assets/mm6-booties-3.jpg",
    ],
    description:
      "MM6 Maison Margiela Silver Glitter Booties. New without tags. Signature Margiela anatomical square/round toe shape with round block heel. Rear zipper closure. EU 40 / US 8. Silver glitter and metallic textured finish.",
    material: "Silver glitter / metallic textured finish",
    measurements: "EU 40 / US 8",
    passport_id: "VP-001",
    seller_id: "system",
    status: "Listed",
    created_at: new Date().toISOString(),
    submissionType: "fashion",
  },
  {
    id: "vtr-002",
    name: "Leopard Print Handbag",
    brand: "Just Cavalli",
    category: "Bags",
    year: 2024,
    condition: "Good",
    availability: "Buy",
    price_buy: 22000,
    images: [
      "/assets/just-cavalli-leopard-1.jpg",
      "/assets/just-cavalli-leopard-2.jpg",
    ],
    description:
      "Just Cavalli Leopard Print Handbag. Satchel / Top-handle bowling bag. Medium size. Leopard animal print with coral-red leather handles and gold-tone hardware. Perforated texture design on printed panels, double top handles, zippered main compartment.",
    material:
      "Leopard animal print with coral-red leather handles and gold-tone hardware",
    measurements: "Medium",
    passport_id: "VP-002",
    seller_id: "system",
    status: "Listed",
    created_at: new Date().toISOString(),
    submissionType: "fashion",
  },
  {
    id: "casadei-dark-purple-strappy-heels",
    name: "Dark Purple Strappy Heels",
    brand: "Casadei",
    category: "Shoes",
    year: 2023,
    condition: "Good",
    availability: "Buy",
    price_buy: 35000,
    images: [
      "/assets/casadei1.jpg",
      "/assets/casadei2.jpg",
      "/assets/casadei3.jpg",
      "/assets/casadei3_1.jpg",
    ],
    description:
      "Casadei Dark Purple Strappy Heels. Strappy slingback pumps in deep purple / plum textured leather. Pointed slightly squared toe box, fine asymmetric ankle straps with side buckle, high stiletto heel. Made in Italy. EU 39 / US 7.",
    material: "Deep purple / plum textured leather",
    measurements: "EU 39 / US 7",
    passport_id: null,
    seller_id: "system",
    status: "Listed",
    created_at: new Date().toISOString(),
    submissionType: "fashion",
  },
  {
    id: "versace-jeans-couture-pants",
    name: "Black & White Patterned Pants",
    brand: "Versace Jeans Couture",
    category: "Clothing",
    year: 2022,
    condition: "Good",
    availability: "Buy",
    price_buy: 12000,
    images: [
      "/assets/versace-pants-1.jpg",
      "/assets/versace-pants-2.jpg",
      "/assets/versace-pants-3.jpg",
      "/assets/versace-pants-4.jpg",
    ],
    description:
      "Versace Jeans Couture Black & White Patterned Pants. Patterned jeans / trousers in high-contrast black and white abstract mosaic print. Classic 5-pocket construction, Medusa-head hardware on back pocket, metal-stamped Versace Jeans Couture back waist patch. EU 42 / Medium.",
    material: "High-contrast black and white abstract mosaic print",
    measurements: "EU 42 / Medium",
    passport_id: null,
    seller_id: "system",
    status: "Listed",
    created_at: new Date().toISOString(),
    submissionType: "fashion",
  },
];

export const MOCK_PASSPORTS: DigitalPassport[] = [
  {
    id: "VP-001",
    item_id: "vtr-001",
    authentication_date: "2026-06-15T10:00:00Z",
    inspector_name: "Isabelle Moreau",
    certificate_code: "VTR-10000000",
    condition_verified: "Pristine",
    qr_code_url:
      "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=VP-001",
    blockchain_hash: "0x7f3a9c2e1d4b8f6a0e5c3d2b1a9f8e7d6c5b4a3",
    created_at: "2026-06-15T10:00:00Z",
  },
];

export const PERSONALITY_ARCHETYPES: PersonalityArchetype[] = [
  {
    name: "Quiet Luxury Purist",
    description:
      "You speak fluent logoless. Your wardrobe is a meditation on quality, proportion, and the kind of confidence that needs no announcement.",
    color: "#C4A97D",
  },
  {
    name: "The Archive Hunter",
    description:
      "You know that the best pieces were made decades ago. Your eye for provenance and patina sets you apart from every room you enter.",
    color: "#A09070",
  },
  {
    name: "Power Dressing Icon",
    description:
      "Structure is your language. Sharp shoulders, considered tailoring, and a presence that commands without saying a word.",
    color: "#8B9DC3",
  },
  {
    name: "Boho Aristocrat",
    description:
      "You mix eras effortlessly — a 1970s Gucci belt with a Bottega bag. Your style has soul, history, and just enough rebellion.",
    color: "#C4956A",
  },
  {
    name: "Minimalist Modernist",
    description:
      "Less is not a compromise — it's a conviction. Clean lines, neutral palette, and the radical courage to let the cut do all the talking.",
    color: "#9EA3A8",
  },
  {
    name: "The Fashion Rebel",
    description:
      "Rules were made for other people. You mix high and low, new and archive, expected and shocking — and somehow it's always right.",
    color: "#CC7B8A",
  },
];
