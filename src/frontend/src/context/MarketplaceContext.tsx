import { MOCK_ITEMS, MOCK_PASSPORTS } from "@/types";
import type { DigitalPassport, Item } from "@/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEYS = {
  wishlist: "vestra.marketplace.wishlist",
  bag: "vestra.marketplace.bag",
  orders: "vestra.marketplace.orders",
  addresses: "vestra.marketplace.addresses",
  submissions: "vestra.marketplace.submissions",
  captures: "vestra.marketplace.captures",
  pendingCheckout: "vestra.marketplace.pendingCheckout",
} as const;

export type PaymentStatus =
  | "configuration_required"
  | "pending"
  | "succeeded"
  | "failed"
  | "cancelled";

export type OrderStatus =
  | "pending_payment"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface BagLine {
  itemId: string;
  quantity: number;
  addedAt: string;
}

export interface VestraAddress {
  id: string;
  fullName: string;
  email: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface MarketplaceOrder {
  id: string;
  orderNumber: string;
  items: Array<{
    itemId: string;
    name: string;
    brand: string;
    price: number;
    passportId: string | null;
  }>;
  subtotal: number;
  shippingCost: number | null;
  total: number;
  currency: "EUR";
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentProvider: "stripe";
  stripePaymentId?: string;
  shippingAddress: VestraAddress;
  billingAddress: VestraAddress;
  shippingMethod: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  emailsQueued: string[];
}

export interface PendingCheckout {
  id: string;
  itemId?: string;
  itemIds: string[];
  subtotal: number;
  total: number;
  currency: "EUR";
  shippingAddress: VestraAddress;
  billingAddress: VestraAddress;
  shippingMethod: string;
  createdAt: string;
}

export interface SellerSubmission {
  id: string;
  submissionType: "fashion" | "art";
  name: string;
  brand: string;
  category: string;
  season?: string;
  year?: string;
  medium?: string;
  condition: string;
  askingPrice?: string;
  provenance?: string;
  imageNames: string[];
  status: "Submitted" | "Under Review" | "Authentication Pending";
  createdAt: string;
}

export interface InquiryCapture {
  id: string;
  type: "newsletter" | "contact" | "seller" | "general";
  email: string;
  name?: string;
  subject?: string;
  message?: string;
  createdAt: string;
}

interface CreateOrderInput {
  shippingAddress: Omit<VestraAddress, "id">;
  billingAddress?: Omit<VestraAddress, "id">;
  itemId?: string;
  itemIds?: string[];
  paymentOutcome?: PaymentStatus;
  stripePaymentId?: string;
  clearBagOnSuccess?: boolean;
}

interface CreateCheckoutDraftInput {
  shippingAddress: Omit<VestraAddress, "id">;
  billingAddress?: Omit<VestraAddress, "id">;
  itemId?: string;
}

interface MarketplaceContextValue {
  products: Item[];
  passports: DigitalPassport[];
  wishlist: string[];
  bag: BagLine[];
  orders: MarketplaceOrder[];
  addresses: VestraAddress[];
  submissions: SellerSubmission[];
  captures: InquiryCapture[];
  pendingCheckout: PendingCheckout | null;
  bagCount: number;
  bagItems: Item[];
  subtotal: number;
  getItem: (id?: string | null) => Item | null;
  getPassportForItem: (itemId?: string | null) => DigitalPassport | null;
  isWishlisted: (itemId: string) => boolean;
  toggleWishlist: (itemId: string) => void;
  addToBag: (itemId: string) => void;
  removeFromBag: (itemId: string) => void;
  clearBag: () => void;
  createOrder: (input: CreateOrderInput) => MarketplaceOrder;
  createCheckoutDraft: (input: CreateCheckoutDraftInput) => PendingCheckout;
  completeCheckoutDraft: (input: {
    sessionId: string;
    paymentStatus: Extract<PaymentStatus, "succeeded" | "failed" | "cancelled">;
  }) => MarketplaceOrder | null;
  cancelOrder: (orderId: string) => void;
  saveAddress: (address: Omit<VestraAddress, "id">) => VestraAddress;
  submitSellerItem: (
    submission: Omit<SellerSubmission, "id" | "status" | "createdAt">,
  ) => SellerSubmission;
  captureInquiry: (
    capture: Omit<InquiryCapture, "id" | "createdAt">,
  ) => InquiryCapture;
}

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`.toUpperCase();
}

function createOrderNumber() {
  return `VTR-${Date.now().toString(36).toUpperCase().slice(-6)}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}

function inferPassport(item: Item): DigitalPassport | null {
  const existing = MOCK_PASSPORTS.find(
    (passport) => passport.item_id === item.id,
  );
  if (existing) return existing;
  if (!item.passport_id) return null;
  const created = item.created_at || new Date().toISOString();
  return {
    id: item.passport_id,
    item_id: item.id,
    authentication_date: created,
    inspector_name: "",
    certificate_code: item.passport_id,
    condition_verified: item.condition,
    qr_code_url: "",
    blockchain_hash: "",
    created_at: created,
  };
}

export function MarketplaceProvider({
  children,
}: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>(() =>
    readStorage(STORAGE_KEYS.wishlist, []),
  );
  const [bag, setBag] = useState<BagLine[]>(() =>
    readStorage(STORAGE_KEYS.bag, []),
  );
  const [orders, setOrders] = useState<MarketplaceOrder[]>(() =>
    readStorage(STORAGE_KEYS.orders, []),
  );
  const [addresses, setAddresses] = useState<VestraAddress[]>(() =>
    readStorage(STORAGE_KEYS.addresses, []),
  );
  const [submissions, setSubmissions] = useState<SellerSubmission[]>(() =>
    readStorage(STORAGE_KEYS.submissions, []),
  );
  const [captures, setCaptures] = useState<InquiryCapture[]>(() =>
    readStorage(STORAGE_KEYS.captures, []),
  );
  const [pendingCheckout, setPendingCheckout] =
    useState<PendingCheckout | null>(() =>
      readStorage(STORAGE_KEYS.pendingCheckout, null),
    );

  useEffect(() => writeStorage(STORAGE_KEYS.wishlist, wishlist), [wishlist]);
  useEffect(() => writeStorage(STORAGE_KEYS.bag, bag), [bag]);
  useEffect(() => writeStorage(STORAGE_KEYS.orders, orders), [orders]);
  useEffect(() => writeStorage(STORAGE_KEYS.addresses, addresses), [addresses]);
  useEffect(
    () => writeStorage(STORAGE_KEYS.submissions, submissions),
    [submissions],
  );
  useEffect(() => writeStorage(STORAGE_KEYS.captures, captures), [captures]);
  useEffect(
    () => writeStorage(STORAGE_KEYS.pendingCheckout, pendingCheckout),
    [pendingCheckout],
  );

  const products = useMemo(() => MOCK_ITEMS, []);
  const passports = useMemo(
    () => products.map(inferPassport).filter(Boolean) as DigitalPassport[],
    [products],
  );

  const getItem = useCallback(
    (id?: string | null) => products.find((item) => item.id === id) ?? null,
    [products],
  );

  const getPassportForItem = useCallback(
    (itemId?: string | null) =>
      passports.find((passport) => passport.item_id === itemId) ?? null,
    [passports],
  );

  const bagItems = useMemo(
    () =>
      bag
        .map((line) => products.find((item) => item.id === line.itemId))
        .filter(Boolean) as Item[],
    [bag, products],
  );

  const subtotal = useMemo(
    () => bagItems.reduce((sum, item) => sum + (item.price_buy ?? 0), 0),
    [bagItems],
  );

  const isWishlisted = useCallback(
    (itemId: string) => wishlist.includes(itemId),
    [wishlist],
  );

  const toggleWishlist = useCallback((itemId: string) => {
    setWishlist((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId],
    );
  }, []);

  const addToBag = useCallback((itemId: string) => {
    setBag((current) => {
      if (current.some((line) => line.itemId === itemId)) return current;
      return [
        ...current,
        { itemId, quantity: 1, addedAt: new Date().toISOString() },
      ];
    });
  }, []);

  const removeFromBag = useCallback((itemId: string) => {
    setBag((current) => current.filter((line) => line.itemId !== itemId));
  }, []);

  const clearBag = useCallback(() => setBag([]), []);

  const saveAddress = useCallback((address: Omit<VestraAddress, "id">) => {
    const saved: VestraAddress = { ...address, id: createId("ADDR") };
    setAddresses((current) => [
      saved,
      ...current.map((existing) =>
        saved.isDefault ? { ...existing, isDefault: false } : existing,
      ),
    ]);
    return saved;
  }, []);

  const createOrder = useCallback(
    (input: CreateOrderInput) => {
      const selectedItems = input.itemIds
        ? (input.itemIds
            .map((itemId) => products.find((item) => item.id === itemId))
            .filter(Boolean) as Item[])
        : input.itemId
          ? products.filter((item) => item.id === input.itemId)
          : bagItems;
      if (selectedItems.length === 0) {
        throw new Error("Cannot create an order without items.");
      }

      const shippingAddress = saveAddress(input.shippingAddress);
      const billingAddress = input.billingAddress
        ? { ...input.billingAddress, id: createId("ADDR") }
        : shippingAddress;
      const orderSubtotal = selectedItems.reduce(
        (sum, item) => sum + (item.price_buy ?? 0),
        0,
      );
      const paymentStatus = input.paymentOutcome ?? "configuration_required";
      const status: OrderStatus =
        paymentStatus === "succeeded"
          ? "confirmed"
          : paymentStatus === "cancelled"
            ? "cancelled"
            : "pending_payment";
      const now = new Date().toISOString();

      const order: MarketplaceOrder = {
        id: createId("ORD"),
        orderNumber: createOrderNumber(),
        items: selectedItems.map((item) => ({
          itemId: item.id,
          name: item.name,
          brand: item.brand,
          price: item.price_buy ?? 0,
          passportId: getPassportForItem(item.id)?.id ?? item.passport_id,
        })),
        subtotal: orderSubtotal,
        shippingCost: null,
        total: orderSubtotal,
        currency: "EUR",
        status,
        paymentStatus,
        paymentProvider: "stripe",
        stripePaymentId: input.stripePaymentId,
        shippingAddress,
        billingAddress,
        shippingMethod: "Provider configuration required",
        createdAt: now,
        updatedAt: now,
        emailsQueued: [
          "order_confirmation",
          "payment_confirmation",
          "seller_notification",
        ],
      };

      setOrders((current) => [order, ...current]);
      if (
        (input.clearBagOnSuccess || !input.itemId) &&
        paymentStatus !== "failed" &&
        paymentStatus !== "cancelled"
      ) {
        clearBag();
      }
      return order;
    },
    [bagItems, clearBag, getPassportForItem, products, saveAddress],
  );

  const createCheckoutDraft = useCallback(
    (input: CreateCheckoutDraftInput) => {
      const selectedItems = input.itemId
        ? products.filter((item) => item.id === input.itemId)
        : bagItems;
      if (selectedItems.length === 0) {
        throw new Error("Cannot start checkout without items.");
      }
      const shippingAddress = saveAddress(input.shippingAddress);
      const billingAddress = input.billingAddress
        ? { ...input.billingAddress, id: createId("ADDR") }
        : shippingAddress;
      const subtotal = selectedItems.reduce(
        (sum, item) => sum + (item.price_buy ?? 0),
        0,
      );
      const draft: PendingCheckout = {
        id: createId("CHK"),
        itemId: input.itemId,
        itemIds: selectedItems.map((item) => item.id),
        subtotal,
        total: subtotal,
        currency: "EUR",
        shippingAddress,
        billingAddress,
        shippingMethod: "Provider configuration required",
        createdAt: new Date().toISOString(),
      };
      setPendingCheckout(draft);
      return draft;
    },
    [bagItems, products, saveAddress],
  );

  const completeCheckoutDraft = useCallback(
    (input: {
      sessionId: string;
      paymentStatus: Extract<
        PaymentStatus,
        "succeeded" | "failed" | "cancelled"
      >;
    }) => {
      if (!pendingCheckout) return null;
      const order = createOrder({
        itemId: pendingCheckout.itemId,
        itemIds: pendingCheckout.itemIds,
        shippingAddress: pendingCheckout.shippingAddress,
        billingAddress: pendingCheckout.billingAddress,
        paymentOutcome: input.paymentStatus,
        stripePaymentId: input.sessionId,
        clearBagOnSuccess: input.paymentStatus === "succeeded",
      });
      setPendingCheckout(null);
      return order;
    },
    [createOrder, pendingCheckout],
  );

  const cancelOrder = useCallback((orderId: string) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "cancelled",
              paymentStatus: "cancelled",
              updatedAt: new Date().toISOString(),
            }
          : order,
      ),
    );
  }, []);

  const submitSellerItem = useCallback(
    (submission: Omit<SellerSubmission, "id" | "status" | "createdAt">) => {
      const saved: SellerSubmission = {
        ...submission,
        id: createId("SUB"),
        status: "Submitted",
        createdAt: new Date().toISOString(),
      };
      setSubmissions((current) => [saved, ...current]);
      return saved;
    },
    [],
  );

  const captureInquiry = useCallback(
    (capture: Omit<InquiryCapture, "id" | "createdAt">) => {
      const saved: InquiryCapture = {
        ...capture,
        id: createId("CAP"),
        createdAt: new Date().toISOString(),
      };
      setCaptures((current) => [saved, ...current]);
      return saved;
    },
    [],
  );

  const value = useMemo<MarketplaceContextValue>(
    () => ({
      products,
      passports,
      wishlist,
      bag,
      orders,
      addresses,
      submissions,
      captures,
      pendingCheckout,
      bagCount: bag.length,
      bagItems,
      subtotal,
      getItem,
      getPassportForItem,
      isWishlisted,
      toggleWishlist,
      addToBag,
      removeFromBag,
      clearBag,
      createOrder,
      createCheckoutDraft,
      completeCheckoutDraft,
      cancelOrder,
      saveAddress,
      submitSellerItem,
      captureInquiry,
    }),
    [
      products,
      passports,
      wishlist,
      bag,
      orders,
      addresses,
      submissions,
      captures,
      pendingCheckout,
      bagItems,
      subtotal,
      getItem,
      getPassportForItem,
      isWishlisted,
      toggleWishlist,
      addToBag,
      removeFromBag,
      clearBag,
      createOrder,
      createCheckoutDraft,
      completeCheckoutDraft,
      cancelOrder,
      saveAddress,
      submitSellerItem,
      captureInquiry,
    ],
  );

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const value = useContext(MarketplaceContext);
  if (!value) {
    throw new Error("useMarketplace must be used within MarketplaceProvider");
  }
  return value;
}
