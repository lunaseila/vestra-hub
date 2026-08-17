import { MOCK_ITEMS, MOCK_PASSPORTS } from "@/types";
import type { DigitalPassport, Item, ItemFilter, Order } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ---------------------------------------------------------------------------
// Items
// ---------------------------------------------------------------------------

export function useItems(filter?: ItemFilter) {
  return useQuery<Item[]>({
    queryKey: ["items", filter],
    queryFn: async () => {
      let items = [...MOCK_ITEMS];
      if (filter?.category && filter.category !== "All") {
        items = items.filter((i) => i.category === filter.category);
      }
      if (filter?.brand) {
        items = items.filter((i) =>
          i.brand.toLowerCase().includes(filter.brand!.toLowerCase()),
        );
      }
      if (filter?.condition) {
        items = items.filter((i) => i.condition === filter.condition);
      }
      if (filter?.minPrice !== undefined) {
        items = items.filter((i) => (i.price_buy ?? 0) >= filter.minPrice!);
      }
      if (filter?.maxPrice !== undefined) {
        items = items.filter(
          (i) => (i.price_buy ?? Number.POSITIVE_INFINITY) <= filter.maxPrice!,
        );
      }
      return items;
    },
    staleTime: 60_000,
  });
}

export function useFeaturedItems() {
  return useQuery<Item[]>({
    queryKey: ["featured-items"],
    queryFn: async () => MOCK_ITEMS.slice(0, 8),
    staleTime: 120_000,
  });
}

export function useItem(id: string) {
  return useQuery<Item | null>({
    queryKey: ["item", id],
    queryFn: async () => MOCK_ITEMS.find((i) => i.id === id) ?? null,
    enabled: !!id,
  });
}

// ---------------------------------------------------------------------------
// Digital Passports
// ---------------------------------------------------------------------------

export function usePassport(itemId: string) {
  return useQuery<DigitalPassport | null>({
    queryKey: ["passport", itemId],
    queryFn: async () =>
      MOCK_PASSPORTS.find((p) => p.item_id === itemId) ?? null,
    enabled: !!itemId,
  });
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export function useUserOrders() {
  return useQuery<Order[]>({
    queryKey: ["user-orders"],
    queryFn: async () => [],
    staleTime: 30_000,
  });
}

// ---------------------------------------------------------------------------
// Wishlist
// ---------------------------------------------------------------------------

const WISHLIST_KEY = "vestra_wishlist";

export function useWishlist() {
  return useQuery<string[]>({
    queryKey: ["wishlist"],
    queryFn: () => {
      const stored = localStorage.getItem(WISHLIST_KEY);
      return stored ? (JSON.parse(stored) as string[]) : [];
    },
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (itemId: string) => {
      const stored = localStorage.getItem(WISHLIST_KEY);
      const list: string[] = stored ? JSON.parse(stored) : [];
      const next = list.includes(itemId)
        ? list.filter((x) => x !== itemId)
        : [...list, itemId];
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
      return next;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}

// ---------------------------------------------------------------------------
// Style Profile
// ---------------------------------------------------------------------------

export function useSaveStyleProfile() {
  return useMutation({
    mutationFn: async (profile: {
      archetype: string;
      decade: string;
      palette: string;
      occasion: string;
    }) => {
      return profile;
    },
  });
}
