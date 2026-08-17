// ============================================================
//  Community Hub — TypeScript Types & Mock Data
// ============================================================

export type CHOpportunityType =
  | "Job"
  | "Partnership"
  | "Freelance"
  | "Startup"
  | "Investment";

export type CHApplicationStatus =
  | "Pending"
  | "Viewed"
  | "Accepted"
  | "Declined";

export type CHConnectionStatus = "Pending" | "Accepted" | "Declined";

export type CHExperienceLevel =
  | "Beginner"
  | "Intermediate"
  | "Expert"
  | "Enterprise";

export type CHUserRole = "Company" | "Freelancer" | "Startup" | "Investor";

export interface CHOpportunity {
  id: string;
  title: string;
  description: string;
  type: CHOpportunityType;
  postedBy: string;
  postedByAvatar?: string;
  company: string;
  country: string;
  countryFlag: string;
  industry: string;
  experienceRequired: CHExperienceLevel;
  status: "Active" | "Filled" | "Paused";
  applications: string[];
  postedDaysAgo: number;
  createdAt: string;
}

export interface CHApplication {
  id: string;
  opportunityId: string;
  applicantId: string;
  message: string;
  status: CHApplicationStatus;
  createdAt: string;
}

export interface CHConnection {
  id: string;
  requesterId: string;
  receiverId: string;
  status: CHConnectionStatus;
  connectedAt: string;
}

export interface CHOnboardingSubmission {
  id: string;
  userId: string;
  country: string;
  intent: string;
  industry: string;
  experienceLevel: CHExperienceLevel;
  projectDescription: string;
  createdAt: string;
}

export interface CHUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: CHUserRole;
  industries: string[];
  country: string;
  countryFlag: string;
  experienceLevel: CHExperienceLevel;
  intent: string;
  bio: string;
  connections: string[];
  memberSince: string;
  isVerified: boolean;
}

export interface CHCountry {
  name: string;
  flag: string;
  memberCount: number;
  description: string;
  lat: number;
  lng: number;
}

export interface CHNavItem {
  label: string;
  path: string;
  isAccent?: boolean;
}

export interface CHOpportunityFilter {
  type?: CHOpportunityType | "All";
  country?: string;
  industry?: string;
  sort?: "recent" | "match" | "popular";
}

// ============================================================
//  Mock Data
// ============================================================

export const FEATURED_COUNTRIES: CHCountry[] = [
  {
    name: "United States",
    flag: "🇺🇸",
    memberCount: 3420,
    description:
      "Silicon Valley to New York — the world's largest startup ecosystem.",
    lat: 38,
    lng: -97,
  },
  {
    name: "Italy",
    flag: "🇮🇹",
    memberCount: 1240,
    description:
      "Design, fashion, and deep industrial expertise from Milan to Rome.",
    lat: 42,
    lng: 12,
  },
  {
    name: "Germany",
    flag: "🇩🇪",
    memberCount: 1870,
    description:
      "Engineering precision meets digital transformation in Europe's powerhouse.",
    lat: 51,
    lng: 10,
  },
  {
    name: "United Kingdom",
    flag: "🇬🇧",
    memberCount: 2180,
    description:
      "London's fintech hub and creative industries spanning the globe.",
    lat: 54,
    lng: -2,
  },
  {
    name: "Spain",
    flag: "🇪🇸",
    memberCount: 980,
    description:
      "Barcelona's tech scene and Madrid's thriving startup community.",
    lat: 40,
    lng: -4,
  },
  {
    name: "France",
    flag: "🇫🇷",
    memberCount: 1560,
    description: "Station F and Paris's world-class innovation ecosystem.",
    lat: 46,
    lng: 2,
  },
  {
    name: "UAE",
    flag: "🇦🇪",
    memberCount: 890,
    description: "Dubai's ambition meets Abu Dhabi's investment appetite.",
    lat: 24,
    lng: 54,
  },
  {
    name: "Singapore",
    flag: "🇸🇬",
    memberCount: 740,
    description: "Asia-Pacific's gateway — where East meets West in business.",
    lat: 1,
    lng: 104,
  },
];

export const MOCK_OPPORTUNITIES: CHOpportunity[] = [
  {
    id: "opp-001",
    title: "Senior AI Engineer — LLM Infrastructure",
    description:
      "We're building the next generation of enterprise AI tooling and need a seasoned engineer to architect our LLM pipeline. You'll work closely with our research team on cutting-edge model fine-tuning and deployment.",
    type: "Job",
    postedBy: "user-ch-001",
    company: "NeuralStack AI",
    country: "United States",
    countryFlag: "🇺🇸",
    industry: "AI",
    experienceRequired: "Expert",
    status: "Active",
    applications: [],
    postedDaysAgo: 2,
    createdAt: "2026-05-13T10:00:00Z",
  },
  {
    id: "opp-002",
    title: "Strategic Design Partner — B2B SaaS",
    description:
      "Looking for a world-class design partner to own our product design language from the ground up. Remote-first, equity-bearing engagement with a fast-growing Series A company.",
    type: "Partnership",
    postedBy: "user-ch-002",
    company: "Flowspace",
    country: "United Kingdom",
    countryFlag: "🇬🇧",
    industry: "SaaS",
    experienceRequired: "Expert",
    status: "Active",
    applications: [],
    postedDaysAgo: 4,
    createdAt: "2026-05-11T14:00:00Z",
  },
  {
    id: "opp-003",
    title: "Freelance Brand Identity Designer",
    description:
      "Milan-based luxury lifestyle brand seeks a senior brand designer for a full rebrand. 3-month project, high creative autonomy, premium rates.",
    type: "Freelance",
    postedBy: "user-ch-003",
    company: "Casa Vivo Milano",
    country: "Italy",
    countryFlag: "🇮🇹",
    industry: "Design",
    experienceRequired: "Expert",
    status: "Active",
    applications: [],
    postedDaysAgo: 1,
    createdAt: "2026-05-14T09:00:00Z",
  },
  {
    id: "opp-004",
    title: "Co-Founder — Fintech Infrastructure Startup",
    description:
      "Technical co-founder sought for a B2B payments infrastructure startup. Idea validated, first pilot signed. Looking for a CTO-profile who can build and lead.",
    type: "Startup",
    postedBy: "user-ch-004",
    company: "Stealth / Pre-launch",
    country: "Germany",
    countryFlag: "🇩🇪",
    industry: "Finance",
    experienceRequired: "Enterprise",
    status: "Active",
    applications: [],
    postedDaysAgo: 6,
    createdAt: "2026-05-09T11:00:00Z",
  },
  {
    id: "opp-005",
    title: "Seed Investor — Climate Tech Portfolio",
    description:
      "Family office actively deploying capital into early-stage climate technology. Seeking founders with pre-revenue traction and a differentiated technical approach.",
    type: "Investment",
    postedBy: "user-ch-005",
    company: "Verde Capital",
    country: "Spain",
    countryFlag: "🇪🇸",
    industry: "E-commerce",
    experienceRequired: "Intermediate",
    status: "Active",
    applications: [],
    postedDaysAgo: 3,
    createdAt: "2026-05-12T16:00:00Z",
  },
  {
    id: "opp-006",
    title: "Head of Growth Marketing",
    description:
      "Scale our user acquisition from 10k to 100k. Own paid, organic, and partnership channels. Equity-heavy compensation package.",
    type: "Job",
    postedBy: "user-ch-006",
    company: "Kairn Health",
    country: "France",
    countryFlag: "🇫🇷",
    industry: "Healthcare",
    experienceRequired: "Expert",
    status: "Active",
    applications: [],
    postedDaysAgo: 5,
    createdAt: "2026-05-10T08:00:00Z",
  },
  {
    id: "opp-007",
    title: "Freelance Backend Engineer — Node.js",
    description:
      "6-week project: build scalable API infrastructure for a high-growth marketplace. TypeScript, PostgreSQL, microservices architecture.",
    type: "Freelance",
    postedBy: "user-ch-007",
    company: "Souk Digital",
    country: "UAE",
    countryFlag: "🇦🇪",
    industry: "Engineering",
    experienceRequired: "Intermediate",
    status: "Active",
    applications: [],
    postedDaysAgo: 2,
    createdAt: "2026-05-13T12:00:00Z",
  },
  {
    id: "opp-008",
    title: "Strategic Distribution Partner — SEA",
    description:
      "Singapore-based SaaS company seeking a regional distribution partner for the South-East Asia market. Revenue share model, established product.",
    type: "Partnership",
    postedBy: "user-ch-008",
    company: "Meridian SaaS",
    country: "Singapore",
    countryFlag: "🇸🇬",
    industry: "SaaS",
    experienceRequired: "Expert",
    status: "Active",
    applications: [],
    postedDaysAgo: 7,
    createdAt: "2026-05-08T15:00:00Z",
  },
  {
    id: "opp-009",
    title: "Product Manager — Developer Tools",
    description:
      "We're redefining the developer workflow. Seeking a PM who can translate deep technical insight into product decisions at the intersection of AI and DevEx.",
    type: "Job",
    postedBy: "user-ch-009",
    company: "Codeform",
    country: "United States",
    countryFlag: "🇺🇸",
    industry: "Engineering",
    experienceRequired: "Intermediate",
    status: "Active",
    applications: [],
    postedDaysAgo: 1,
    createdAt: "2026-05-14T07:00:00Z",
  },
  {
    id: "opp-010",
    title: "Freelance Motion Designer — Brand Video",
    description:
      "Two-week sprint: craft a 90-second brand film for a luxury watch company's digital launch. Exceptional creative brief provided.",
    type: "Freelance",
    postedBy: "user-ch-010",
    company: "Horologe Collective",
    country: "Germany",
    countryFlag: "🇩🇪",
    industry: "Design",
    experienceRequired: "Expert",
    status: "Active",
    applications: [],
    postedDaysAgo: 3,
    createdAt: "2026-05-12T10:00:00Z",
  },
  {
    id: "opp-011",
    title: "Legal Tech Startup — Pre-Seed Raise",
    description:
      "Raising £400k to automate contract review for SMEs. MVP live, 12 design partners, seeking angels with legal or enterprise software backgrounds.",
    type: "Investment",
    postedBy: "user-ch-011",
    company: "Lexify",
    country: "United Kingdom",
    countryFlag: "🇬🇧",
    industry: "Legal",
    experienceRequired: "Beginner",
    status: "Active",
    applications: [],
    postedDaysAgo: 8,
    createdAt: "2026-05-07T14:00:00Z",
  },
  {
    id: "opp-012",
    title: "Community Lead — Web3 Media Platform",
    description:
      "Own and grow our global creator community across Discord, Twitter and IRL events. Deep knowledge of Web3 culture essential.",
    type: "Job",
    postedBy: "user-ch-012",
    company: "Prism Network",
    country: "Spain",
    countryFlag: "🇪🇸",
    industry: "Media",
    experienceRequired: "Intermediate",
    status: "Active",
    applications: [],
    postedDaysAgo: 4,
    createdAt: "2026-05-11T11:00:00Z",
  },
];

export const CH_NAV_ITEMS: CHNavItem[] = [
  { label: "Home", path: "/CommunityHub/Home" },
  { label: "Explore", path: "/CommunityHub/Explore" },
  { label: "Opportunities", path: "/CommunityHub/Opportunities" },
  { label: "Dashboard", path: "/CommunityHub/Dashboard" },
  { label: "About", path: "/CommunityHub/About" },
];

export const CH_INTENT_OPTIONS = [
  "Offering a Job",
  "Looking for a Job",
  "Partnership Opportunity",
  "Startup Collaboration",
  "Freelance Services",
  "Investor / Funding",
];

export const CH_INDUSTRIES = [
  "AI",
  "SaaS",
  "Design",
  "Finance",
  "Marketing",
  "Engineering",
  "Media",
  "E-commerce",
  "Legal",
  "Healthcare",
];

export const CH_EXPERIENCE_LEVELS: {
  value: CHExperienceLevel;
  label: string;
  subtitle: string;
  icon: string;
}[] = [
  { value: "Beginner", label: "Beginner", subtitle: "0–2 years", icon: "🌱" },
  {
    value: "Intermediate",
    label: "Intermediate",
    subtitle: "2–5 years",
    icon: "⚡",
  },
  { value: "Expert", label: "Expert", subtitle: "5–10 years", icon: "🎯" },
  {
    value: "Enterprise",
    label: "Enterprise / Executive",
    subtitle: "10+ years",
    icon: "🏛️",
  },
];
