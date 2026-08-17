import type {
  CHApplication,
  CHConnection,
  CHExperienceLevel,
  CHOnboardingSubmission,
  CHOpportunity,
  CHOpportunityFilter,
} from "@/types/communityHub";
import { MOCK_OPPORTUNITIES } from "@/types/communityHub";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ---------------------------------------------------------------------------
// Opportunities
// ---------------------------------------------------------------------------

export function useOpportunities(filter?: CHOpportunityFilter) {
  return useQuery<CHOpportunity[]>({
    queryKey: ["ch-opportunities", filter],
    queryFn: async () => {
      // In production this would call actor.getOpportunities(filter)
      // Fallback to mock data for demo
      let opps = [...MOCK_OPPORTUNITIES];

      if (filter?.type && filter.type !== "All") {
        opps = opps.filter((o) => o.type === filter.type);
      }
      if (filter?.country) {
        opps = opps.filter((o) => o.country === filter.country);
      }
      if (filter?.industry) {
        opps = opps.filter((o) => o.industry === filter.industry);
      }

      if (filter?.sort === "recent") {
        opps = [...opps].sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
      } else if (filter?.sort === "popular") {
        opps = [...opps].sort(
          (a, b) => b.applications.length - a.applications.length,
        );
      }
      // "match" sort: no-op on mock data — in production would use ML scoring

      return opps;
    },
    staleTime: 60_000,
  });
}

export function useOpportunity(id: string) {
  return useQuery<CHOpportunity | null>({
    queryKey: ["ch-opportunity", id],
    queryFn: async () => MOCK_OPPORTUNITIES.find((o) => o.id === id) ?? null,
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useCreateOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      data: Omit<
        CHOpportunity,
        "id" | "createdAt" | "applications" | "postedDaysAgo"
      >,
    ): Promise<CHOpportunity> => {
      // In production: return actor.createOpportunity(data)
      const opp: CHOpportunity = {
        ...data,
        id: `opp-${Date.now()}`,
        applications: [],
        postedDaysAgo: 0,
        createdAt: new Date().toISOString(),
      };
      return opp;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ch-opportunities"] });
    },
  });
}

// ---------------------------------------------------------------------------
// Applications
// ---------------------------------------------------------------------------

export function useCreateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      data: Pick<CHApplication, "opportunityId" | "applicantId" | "message">,
    ): Promise<CHApplication> => {
      // In production: return actor.createApplication(data)
      const app: CHApplication = {
        ...data,
        id: `app-${Date.now()}`,
        status: "Pending",
        createdAt: new Date().toISOString(),
      };
      return app;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ch-applications"] });
    },
  });
}

export function useMyApplications(userId: string) {
  return useQuery<CHApplication[]>({
    queryKey: ["ch-applications", userId],
    queryFn: async () => {
      // In production: return actor.getApplicationsByUser(userId)
      return [];
    },
    enabled: !!userId,
    staleTime: 30_000,
  });
}

// ---------------------------------------------------------------------------
// Connections
// ---------------------------------------------------------------------------

export function useConnections(userId: string) {
  return useQuery<CHConnection[]>({
    queryKey: ["ch-connections", userId],
    queryFn: async () => {
      // In production: return actor.getConnections(userId)
      return [];
    },
    enabled: !!userId,
    staleTime: 30_000,
  });
}

export function useCreateConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      data: Pick<CHConnection, "requesterId" | "receiverId">,
    ): Promise<CHConnection> => {
      // In production: return actor.createConnection(data)
      const conn: CHConnection = {
        ...data,
        id: `conn-${Date.now()}`,
        status: "Pending",
        connectedAt: new Date().toISOString(),
      };
      return conn;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["ch-connections", variables.requesterId],
      });
    },
  });
}

// ---------------------------------------------------------------------------
// Onboarding
// ---------------------------------------------------------------------------

export function useSubmitOnboarding() {
  return useMutation({
    mutationFn: async (
      data: Omit<CHOnboardingSubmission, "id" | "createdAt">,
    ): Promise<CHOnboardingSubmission> => {
      // In production: return actor.submitOnboarding(data)
      return {
        ...data,
        id: `onb-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
    },
  });
}

// ---------------------------------------------------------------------------
// User profile helpers
// ---------------------------------------------------------------------------

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ["ch-user", userId],
    queryFn: async () => {
      // In production: return actor.getUser(userId)
      return null;
    },
    enabled: !!userId,
    staleTime: 120_000,
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      userId: string;
      name?: string;
      bio?: string;
      role?: string;
      industries?: string[];
      country?: string;
      experienceLevel?: CHExperienceLevel;
    }): Promise<void> => {
      // In production: return actor.updateUser(data)
      void data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["ch-user", variables.userId],
      });
    },
  });
}

// ---------------------------------------------------------------------------
// Access Requests
// ---------------------------------------------------------------------------

export function useStoreAccessRequest() {
  return useMutation({
    mutationFn: async (email: string): Promise<void> => {
      // In production: await actor.storeAccessRequest(email)
      // Stub — resolves successfully for demo
      void email;
      await new Promise<void>((resolve) => setTimeout(resolve, 600));
    },
  });
}
