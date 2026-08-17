import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export type StyleProfileId = string;
export interface Application {
    id: bigint;
    status: ApplicationStatus;
    applicantId: string;
    createdAt: bigint;
    opportunityId: bigint;
    message: string;
}
export interface User {
    id: UserId;
    member_since: Timestamp;
    style_profile_id?: StyleProfileId;
    shipping_addresses: Array<string>;
    avatar_url: string;
    name: string;
    tier: string;
    created_at: Timestamp;
    email: string;
    stripe_customer_id: string;
}
export interface ItemFilter {
    availability?: string;
    category?: string;
    brand?: string;
    max_price?: bigint;
    min_price?: bigint;
    condition?: string;
}
export interface OnboardingSubmission {
    id: bigint;
    experienceLevel: string;
    country: string;
    projectDescription: string;
    userId: string;
    createdAt: bigint;
    intent: string;
    industry: string;
}
export interface Order {
    id: OrderId;
    status: string;
    deposit_paid: bigint;
    total_price: bigint;
    stripe_payment_id: string;
    created_at: Timestamp;
    order_type: string;
    buyer_id: UserId;
    rent_start?: Timestamp;
    item_id: ItemId;
    rent_end?: Timestamp;
}
export interface Opportunity {
    id: bigint;
    status: OpportunityStatus;
    title: string;
    postedBy: string;
    country: string;
    createdAt: bigint;
    experienceRequired: string;
    description: string;
    opportunityType: OpportunityType;
    applications: Array<bigint>;
    industry: string;
}
export type UserId = string;
export interface Item {
    id: ItemId;
    status: string;
    price_rent_day?: bigint;
    passport_id?: PassportId;
    name: string;
    year: bigint;
    description: string;
    season: string;
    deposit?: bigint;
    created_at: Timestamp;
    availability: string;
    seller_id: UserId;
    measurements: string;
    category: string;
    brand: string;
    price_buy?: bigint;
    material: string;
    condition: string;
    images: Array<string>;
}
export interface StyleProfile {
    id: StyleProfileId;
    decade: string;
    created_at: Timestamp;
    palette: string;
    user_id: UserId;
    archetype: string;
    occasion: string;
}
export type ItemId = string;
export interface DigitalPassport {
    id: PassportId;
    authentication_date: Timestamp;
    qr_code_url: string;
    created_at: Timestamp;
    blockchain_hash: string;
    inspector_name: string;
    certificate_code: string;
    item_id: ItemId;
    condition_verified: string;
}
export interface UserUpdate {
    style_profile_id?: StyleProfileId;
    shipping_addresses: Array<string>;
    avatar_url: string;
    name: string;
    tier: string;
    email: string;
    stripe_customer_id: string;
}
export interface CreateOrderInput {
    deposit_paid: bigint;
    total_price: bigint;
    stripe_payment_id: string;
    order_type: string;
    rent_start?: Timestamp;
    item_id: ItemId;
    rent_end?: Timestamp;
}
export type PassportId = string;
export interface StyleProfileInput {
    decade: string;
    palette: string;
    archetype: string;
    occasion: string;
}
export interface Connection {
    id: bigint;
    status: ConnectionStatus;
    connectedAt: bigint;
    receiverId: string;
    requesterId: string;
}
export type OrderId = string;
export enum ApplicationStatus {
    Viewed = "Viewed",
    Accepted = "Accepted",
    Declined = "Declined",
    Pending = "Pending"
}
export enum ConnectionStatus {
    Accepted = "Accepted",
    Declined = "Declined",
    Pending = "Pending"
}
export enum OpportunityStatus {
    Paused = "Paused",
    Active = "Active",
    Filled = "Filled"
}
export enum OpportunityType {
    Job = "Job",
    Startup = "Startup",
    Partnership = "Partnership",
    Investment = "Investment",
    Freelance = "Freelance"
}
export interface backendInterface {
    addToWishlist(item_id: ItemId): Promise<void>;
    createApplication(opportunityId: bigint, message: string): Promise<Application>;
    createConnection(receiverId: string): Promise<Connection>;
    createItem(item: Item): Promise<Item>;
    createOpportunity(title: string, description: string, opportunityType: OpportunityType, country: string, industry: string, experienceRequired: string): Promise<Opportunity>;
    createOrder(input: CreateOrderInput): Promise<Order>;
    createPassport(input: {
        inspector_name: string;
        item_id: ItemId;
        condition_verified: string;
    }): Promise<DigitalPassport>;
    createUser(name: string, email: string): Promise<User>;
    getApplication(id: bigint): Promise<Application | null>;
    getConnection(id: bigint): Promise<Connection | null>;
    getConnectionsByUser(userId: string): Promise<Array<Connection>>;
    getFeaturedItems(): Promise<Array<Item>>;
    getItem(id: ItemId): Promise<Item | null>;
    getItemsByCategory(category: string): Promise<Array<Item>>;
    getItemsByFilter(filter: ItemFilter): Promise<Array<Item>>;
    getOnboardingByUser(userId: string): Promise<OnboardingSubmission | null>;
    getOpportunitiesByCountry(country: string): Promise<Array<Opportunity>>;
    getOpportunitiesByIndustry(industry: string): Promise<Array<Opportunity>>;
    getOpportunitiesByType(opportunityType: OpportunityType): Promise<Array<Opportunity>>;
    getOpportunity(id: bigint): Promise<Opportunity | null>;
    getOrder(id: OrderId): Promise<Order | null>;
    getPassport(id: PassportId): Promise<DigitalPassport | null>;
    getPassportByItem(item_id: ItemId): Promise<DigitalPassport | null>;
    getStyleProfile(): Promise<StyleProfile | null>;
    getUser(id: UserId): Promise<User | null>;
    getUserByPrincipal(): Promise<User | null>;
    getUserOrders(): Promise<Array<Order>>;
    getWishlist(): Promise<Array<ItemId>>;
    listApplicationsByOpportunity(opportunityId: bigint): Promise<Array<Application>>;
    listApplicationsByUser(applicantId: string): Promise<Array<Application>>;
    listConnections(): Promise<Array<Connection>>;
    listItems(): Promise<Array<Item>>;
    listOpportunities(): Promise<Array<Opportunity>>;
    removeFromWishlist(item_id: ItemId): Promise<void>;
    saveStyleProfile(input: StyleProfileInput): Promise<StyleProfile>;
    storeAccessRequest(email: string): Promise<void>;
    submitOnboarding(country: string, intent: string, industry: string, experienceLevel: string, projectDescription: string): Promise<OnboardingSubmission>;
    updateApplicationStatus(id: bigint, status: ApplicationStatus): Promise<boolean>;
    updateConnectionStatus(id: bigint, status: ConnectionStatus): Promise<boolean>;
    updateItemStatus(id: ItemId, status: string): Promise<Item | null>;
    updateOpportunityStatus(id: bigint, status: OpportunityStatus): Promise<boolean>;
    updateOrderStatus(id: OrderId, status: string): Promise<Order | null>;
    updateUser(update: UserUpdate): Promise<User | null>;
}
