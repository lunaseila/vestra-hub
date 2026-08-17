import Footer from "@/components/layout/Footer";
import NavBar from "@/components/layout/NavBar";
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
import BuyItem from "@/pages/BuyItem";
import Collection from "@/pages/Collection";
import Contact from "@/pages/Contact";
import DigitalPassport from "@/pages/DigitalPassport";
import Home from "@/pages/Home";
import ItemDetail from "@/pages/ItemDetail";
import PersonalityTest from "@/pages/PersonalityTest";
import Profile from "@/pages/Profile";
import SagePurification from "@/pages/SagePurification";
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
const itemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/Item",
  component: ItemDetail,
});
const passportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/DigitalPassport",
  component: DigitalPassport,
});
const buyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/BuyItem",
  component: BuyItem,
});
const submitItemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/SubmitItem",
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
  itemRoute,
  passportRoute,
  buyRoute,
  submitItemRoute,
  personalityRoute,
  fittingRoomRoute,
  sageRoute,
  profileRoute,
  whatIsRoute,
  aboutRoute,
  contactRoute,
  cookiePolicyRoute,
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
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
