import Footer from "@/components/layout/Footer";
import NavBar from "@/components/layout/NavBar";
import { MarketplaceProvider } from "@/context/MarketplaceContext";
import { ToastProvider } from "@/context/ToastContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  useRouterState,
} from "@tanstack/react-router";

import About from "@/pages/About";
import Bag from "@/pages/Bag";
import BuyItem from "@/pages/BuyItem";
import Collection from "@/pages/Collection";
import Contact from "@/pages/Contact";
import DigitalPassport from "@/pages/DigitalPassport";
import Home from "@/pages/Home";
import ItemDetail from "@/pages/ItemDetail";
import LegalPage from "@/pages/LegalPage";
import PersonalityTest from "@/pages/PersonalityTest";
import Profile from "@/pages/Profile";
import SagePurification from "@/pages/SagePurification";
import SearchPage from "@/pages/SearchPage";
import SubmitItem from "@/pages/SubmitItem";
import VirtualFittingRoom from "@/pages/VirtualFittingRoom";
import WhatIsVestra from "@/pages/WhatIsVestra";

import CommunityHubLayout from "@/components/layout/CommunityHubLayout";

// ---------------------------------------------------------------------------
// Placeholder pages for Community Hub (to be replaced by dedicated pages)
// ---------------------------------------------------------------------------
const _CHPlaceholder = ({ name }: { name: string }) => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--ch-text-secondary)",
      fontFamily: "DM Sans, sans-serif",
      fontSize: "1rem",
      paddingTop: "64px",
    }}
  >
    {name}
  </div>
);

import { CookieConsent } from "@/components/CookieConsent";
import CookiePolicy from "@/pages/CookiePolicy";
import CHAboutPage from "@/pages/communityHub/CHAbout";
import CHDashboardPage from "@/pages/communityHub/CHDashboard";
import CHHomePage from "@/pages/communityHub/CHHome";
import CHMainPage from "@/pages/communityHub/CHMain";
import CHOnboardingPage from "@/pages/communityHub/CHOnboarding";
import CHOpportunitiesPage from "@/pages/communityHub/CHOpportunities";
import CHOpportunityDetail from "@/pages/communityHub/CHOpportunityDetail";
import CHProfilePage from "@/pages/communityHub/CHProfile";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 60_000 } },
});

function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isCH = pathname.startsWith("/CommunityHub");
  if (isCH) {
    return (
      <ToastProvider>
        <Outlet />
      </ToastProvider>
    );
  }
  return (
    <ToastProvider>
      <NavBar />
      <main
        style={{
          paddingTop: "64px",
          minHeight: "100vh",
          background: "var(--vestra-ink)",
        }}
      >
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
    </ToastProvider>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/Home" });
  },
  component: () => null,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/Home",
  component: Home,
});
const collectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/Collection",
  component: Collection,
});
const archiveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/Archive",
  component: Collection,
});
const discoverRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/Discover",
  component: Collection,
});
const itemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/Item",
  component: ItemDetail,
});
const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/Search",
  component: SearchPage,
});
const passportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/DigitalPassport",
  component: DigitalPassport,
});
const passportAliasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/Passport",
  component: DigitalPassport,
});
const buyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/BuyItem",
  component: BuyItem,
});
const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/Checkout",
  component: BuyItem,
});
const bagRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/Bag",
  component: Bag,
});
const submitItemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/SubmitItem",
  component: SubmitItem,
});
const sellRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/Sell",
  component: SubmitItem,
});
const personalityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/PersonalityTest",
  component: PersonalityTest,
});
const fittingRoomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/VirtualFittingRoom",
  component: VirtualFittingRoom,
});
const sageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/SagePurification",
  component: SagePurification,
});
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/Profile",
  component: Profile,
});
const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/Account",
  component: Profile,
});
const whatIsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/WhatIsVestra",
  component: WhatIsVestra,
});
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/About",
  component: About,
});
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/Contact",
  component: Contact,
});
const cookiePolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/CookiePolicy",
  component: CookiePolicy,
});
const privacyPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/PrivacyPolicy",
  component: () => <LegalPage type="privacy" />,
});
const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/Terms",
  component: () => <LegalPage type="terms" />,
});
const returnsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/Returns",
  component: () => <LegalPage type="returns" />,
});
const shippingPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ShippingPolicy",
  component: () => <LegalPage type="shipping" />,
});
const sellerTermsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/SellerTerms",
  component: () => <LegalPage type="seller" />,
});
const authenticationPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/AuthenticationPolicy",
  component: () => <LegalPage type="authentication" />,
});
const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/FAQ",
  component: () => <LegalPage type="faq" />,
});
// ---------------------------------------------------------------------------
// Community Hub — separate layout, no Vestra NavBar/Footer
// ---------------------------------------------------------------------------
const chParentRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "ch-layout",
  component: CommunityHubLayout,
});

const chRedirectRoute = createRoute({
  getParentRoute: () => chParentRoute,
  path: "/CommunityHub",
  beforeLoad: () => {
    throw redirect({ to: "/CommunityHub/Home" });
  },
  component: () => null,
});

const chHomeRoute = createRoute({
  getParentRoute: () => chParentRoute,
  path: "/CommunityHub/Home",
  component: CHHomePage,
});

const chMainRoute = createRoute({
  getParentRoute: () => chParentRoute,
  path: "/CommunityHub/Explore",
  component: CHMainPage,
});

const chOpportunitiesRoute = createRoute({
  getParentRoute: () => chParentRoute,
  path: "/CommunityHub/Opportunities",
  component: CHOpportunitiesPage,
});

const chOpportunityDetailRoute = createRoute({
  getParentRoute: () => chParentRoute,
  path: "/CommunityHub/Opportunities/$id",
  component: CHOpportunityDetail,
});

const chDashboardRoute = createRoute({
  getParentRoute: () => chParentRoute,
  path: "/CommunityHub/Dashboard",
  component: CHDashboardPage,
});

const chProfileRoute = createRoute({
  getParentRoute: () => chParentRoute,
  path: "/CommunityHub/Profile",
  component: CHProfilePage,
});

const chOnboardingRoute = createRoute({
  getParentRoute: () => chParentRoute,
  path: "/CommunityHub/Onboarding",
  component: CHOnboardingPage,
});

const chAboutRoute = createRoute({
  getParentRoute: () => chParentRoute,
  path: "/CommunityHub/About",
  component: CHAboutPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  homeRoute,
  collectionRoute,
  archiveRoute,
  discoverRoute,
  itemRoute,
  searchRoute,
  passportRoute,
  passportAliasRoute,
  buyRoute,
  checkoutRoute,
  bagRoute,
  submitItemRoute,
  sellRoute,
  personalityRoute,
  fittingRoomRoute,
  sageRoute,
  profileRoute,
  accountRoute,
  whatIsRoute,
  aboutRoute,
  contactRoute,
  cookiePolicyRoute,
  privacyPolicyRoute,
  termsRoute,
  returnsRoute,
  shippingPolicyRoute,
  sellerTermsRoute,
  authenticationPolicyRoute,
  faqRoute,
  // Community Hub routes (separate namespace, separate layout)
  chParentRoute.addChildren([
    chRedirectRoute,
    chHomeRoute,
    chMainRoute,
    chOpportunitiesRoute,
    chOpportunityDetailRoute,
    chDashboardRoute,
    chProfileRoute,
    chOnboardingRoute,
    chAboutRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MarketplaceProvider>
        <RouterProvider router={router} />
      </MarketplaceProvider>
    </QueryClientProvider>
  );
}
