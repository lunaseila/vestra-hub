import ItemCard from "@/components/shared/ItemCard";
import VerifiedBadge from "@/components/shared/VerifiedBadge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { MOCK_ITEMS, MOCK_PASSPORTS } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  Heart,
  LogOut,
  Package,
  Plus,
  Settings,
  Shield,
  Tag,
} from "lucide-react";
import { useState } from "react";

const MOCK_USER = {
  name: "Isabelle Laurent",
  email: "isabelle@vestra.com",
  member_since: "2023",
  tier: "Founding Member" as const,
  items_purchased: 4,
  items_rented: 7,
  items_sold: 2,
  avatar_initials: "IL",
};

const MOCK_LISTINGS = MOCK_ITEMS.slice(0, 4).map((item, i) => ({
  ...item,
  listing_status: ["Listed", "In Review", "Listed", "Draft"][i] as string,
  submitted_at: `2024-03-${String(10 + i).padStart(2, "0")}`,
}));

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    Draft: { bg: "rgba(100,100,110,0.15)", color: "var(--vestra-grey-light)" },
    "In Review": {
      bg: "var(--vestra-gold-muted)",
      color: "var(--vestra-gold)",
    },
    Listed: {
      bg: "var(--vestra-verified-bg)",
      color: "var(--vestra-verified)",
    },
    Sold: { bg: "rgba(42,94,255,0.12)", color: "#99B8FF" },
    Rented: { bg: "rgba(42,94,255,0.12)", color: "#99B8FF" },
  };
  const s = map[status] ?? map.Draft;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.2rem 0.65rem",
        borderRadius: "100px",
        background: s.bg,
        color: s.color,
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "0.65rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      {status}
    </span>
  );
}

export default function Profile() {
  const { isAuthenticated, login, logout } = useAuth();
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifDeals, setNotifDeals] = useState(false);
  const [notifPassport, setNotifPassport] = useState(true);

  if (!isAuthenticated) {
    return (
      <div
        data-ocid="profile.auth_gate.page"
        style={{
          minHeight: "100vh",
          background: "var(--vestra-ink)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "1.5rem",
          textAlign: "center",
          padding: "2rem",
          paddingTop: "80px",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            border: "2px solid var(--vestra-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "0.5rem",
          }}
        >
          <Shield size={28} style={{ color: "var(--vestra-grey)" }} />
        </div>
        <h1
          style={{
            fontFamily: "Playfair Display, Georgia, serif",
            fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
            fontWeight: 400,
            color: "var(--vestra-white)",
          }}
        >
          Members Only
        </h1>
        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "1rem",
            color: "var(--vestra-grey-light)",
            maxWidth: "360px",
          }}
        >
          Sign in to access your collection, wishlist, and digital passports.
        </p>
        <button
          type="button"
          onClick={login}
          data-ocid="profile.login.button"
          className="btn-gold"
          style={{ marginTop: "0.5rem" }}
        >
          Sign In with Internet Identity
        </button>
        <Link
          to="/Collection"
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.875rem",
            color: "var(--vestra-grey)",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
          }}
        >
          Browse without signing in
        </Link>
      </div>
    );
  }

  return (
    <div
      data-ocid="profile.page"
      style={{
        minHeight: "100vh",
        background: "var(--vestra-ink)",
        paddingTop: "80px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2.5rem 1.5rem",
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "2.5rem",
          alignItems: "start",
        }}
        className="profile-grid"
      >
        {/* SIDEBAR */}
        <aside
          data-ocid="profile.sidebar.panel"
          style={{
            background: "var(--vestra-graphite)",
            border: "1px solid var(--vestra-border)",
            borderRadius: "12px",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            position: "sticky",
            top: "90px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                border: "3px solid var(--vestra-gold)",
                background: "var(--vestra-graphite)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "Playfair Display, Georgia, serif",
                  fontSize: "1.5rem",
                  color: "var(--vestra-gold)",
                  fontWeight: 500,
                }}
              >
                {MOCK_USER.avatar_initials}
              </span>
            </div>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "Playfair Display, Georgia, serif",
                  fontSize: "1.1rem",
                  color: "var(--vestra-white)",
                  marginBottom: "0.2rem",
                }}
              >
                {MOCK_USER.name}
              </p>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.78rem",
                  color: "var(--vestra-grey)",
                }}
              >
                Member since {MOCK_USER.member_since}
              </p>
            </div>
            <span
              style={{
                padding: "0.3rem 0.875rem",
                borderRadius: "100px",
                background: "var(--vestra-gold-muted)",
                border: "1px solid var(--vestra-gold)",
                color: "var(--vestra-gold)",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.62rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {MOCK_USER.tier}
            </span>
          </div>

          <div
            style={{
              borderTop: "1px solid var(--vestra-border)",
              borderBottom: "1px solid var(--vestra-border)",
              padding: "1rem 0",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.5rem",
              textAlign: "center",
            }}
          >
            {[
              { label: "Purchased", value: MOCK_USER.items_purchased },
              { label: "Rented", value: MOCK_USER.items_rented },
              { label: "Sold", value: MOCK_USER.items_sold },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  style={{
                    fontFamily: "Playfair Display, Georgia, serif",
                    fontSize: "1.4rem",
                    fontWeight: 400,
                    color: "var(--vestra-white)",
                    marginBottom: "0.1rem",
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.65rem",
                    color: "var(--vestra-grey)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <nav
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            {[
              { icon: Package, label: "My Collection", tab: "collection" },
              { icon: Heart, label: "Wishlist", tab: "wishlist" },
              { icon: Tag, label: "My Listings", tab: "listings" },
              { icon: Shield, label: "Digital Passports", tab: "passports" },
              { icon: Settings, label: "Settings", tab: "settings" },
            ].map(({ icon: Icon, label, tab }) => (
              <button
                key={tab}
                type="button"
                data-ocid={`profile.nav_${tab}.button`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.625rem",
                  padding: "0.625rem 0.75rem",
                  borderRadius: "8px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--vestra-grey-light)",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.875rem",
                  width: "100%",
                  textAlign: "left",
                  transition:
                    "background var(--dur-micro) var(--ease-luxury), color var(--dur-micro) var(--ease-luxury)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "var(--vestra-glass)";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "var(--vestra-white)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "var(--vestra-grey-light)";
                }}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main data-ocid="profile.content.panel">
          <Tabs defaultValue="collection">
            <TabsList
              style={{
                background: "var(--vestra-graphite)",
                border: "1px solid var(--vestra-border)",
                borderRadius: "8px",
                marginBottom: "2rem",
                flexWrap: "wrap",
                height: "auto",
                padding: "0.3rem",
                gap: "0.2rem",
              }}
            >
              {[
                { value: "collection", label: "My Collection" },
                { value: "wishlist", label: "Wishlist" },
                { value: "listings", label: "My Listings" },
                { value: "passports", label: "Passports" },
                { value: "settings", label: "Settings" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  data-ocid={`profile.tab.${tab.value}`}
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.8rem",
                  }}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="collection">
              <h2
                style={{
                  fontFamily: "Playfair Display, Georgia, serif",
                  fontSize: "1.4rem",
                  fontWeight: 400,
                  color: "var(--vestra-white)",
                  marginBottom: "1.5rem",
                }}
              >
                My Collection
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: "1rem",
                }}
              >
                {MOCK_ITEMS.slice(0, 3).map((item, i) => (
                  <ItemCard key={item.id} item={item} index={i} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="wishlist">
              <h2
                style={{
                  fontFamily: "Playfair Display, Georgia, serif",
                  fontSize: "1.4rem",
                  fontWeight: 400,
                  color: "var(--vestra-white)",
                  marginBottom: "1.5rem",
                }}
              >
                Wishlist
              </h2>
              <div
                data-ocid="profile.wishlist.empty_state"
                style={{
                  padding: "4rem 2rem",
                  textAlign: "center",
                  border: "1px solid var(--vestra-border)",
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <Heart
                  size={36}
                  style={{ color: "var(--vestra-grey)", opacity: 0.5 }}
                />
                <p
                  style={{
                    fontFamily: "Playfair Display, Georgia, serif",
                    fontSize: "1.15rem",
                    fontWeight: 400,
                    color: "var(--vestra-white)",
                  }}
                >
                  Your wishlist is empty.
                </p>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.875rem",
                    color: "var(--vestra-grey)",
                  }}
                >
                  Save pieces you love to find them again easily.
                </p>
                <Link
                  to="/Collection"
                  className="btn-outlined"
                  style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}
                  data-ocid="profile.wishlist_browse.link"
                >
                  Explore Collection
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="listings">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.5rem",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <h2
                  style={{
                    fontFamily: "Playfair Display, Georgia, serif",
                    fontSize: "1.4rem",
                    fontWeight: 400,
                    color: "var(--vestra-white)",
                  }}
                >
                  My Listings
                </h2>
                <Link
                  to="/SubmitItem"
                  className="btn-gold"
                  style={{
                    fontSize: "0.8rem",
                    padding: "0.55rem 1.2rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                  data-ocid="profile.add_listing.button"
                >
                  <Plus size={14} /> New Listing
                </Link>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {MOCK_LISTINGS.map((item, i) => (
                  <div
                    key={item.id}
                    data-ocid={`profile.listing.item.${i + 1}`}
                    style={{
                      background: "var(--vestra-graphite)",
                      border: "1px solid var(--vestra-border)",
                      borderRadius: "10px",
                      padding: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      loading="lazy"
                      style={{
                        width: "52px",
                        height: "52px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontFamily: "Playfair Display, Georgia, serif",
                          fontSize: "0.95rem",
                          color: "var(--vestra-white)",
                          marginBottom: "0.2rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.name}
                      </p>
                      <p
                        style={{
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "0.75rem",
                          color: "var(--vestra-grey)",
                        }}
                      >
                        {item.brand} · {item.submitted_at}
                      </p>
                    </div>
                    <StatusBadge status={item.listing_status} />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="passports">
              <h2
                style={{
                  fontFamily: "Playfair Display, Georgia, serif",
                  fontSize: "1.4rem",
                  fontWeight: 400,
                  color: "var(--vestra-white)",
                  marginBottom: "1.5rem",
                }}
              >
                Digital Passports
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {MOCK_PASSPORTS.slice(0, 4).map((passport, i) => {
                  const item = MOCK_ITEMS.find(
                    (it) => it.id === passport.item_id,
                  );
                  return (
                    <div
                      key={passport.id}
                      data-ocid={`profile.passport.item.${i + 1}`}
                      style={{
                        background: "var(--vestra-graphite)",
                        border: "1px solid var(--vestra-border)",
                        borderRadius: "10px",
                        padding: "1rem 1.25rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "1rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <VerifiedBadge />
                        <div>
                          <p
                            style={{
                              fontFamily: "JetBrains Mono, monospace",
                              fontSize: "0.72rem",
                              color: "var(--vestra-gold)",
                              letterSpacing: "0.08em",
                            }}
                          >
                            {passport.certificate_code}
                          </p>
                          <p
                            style={{
                              fontFamily: "Playfair Display, Georgia, serif",
                              fontSize: "0.9rem",
                              color: "var(--vestra-white)",
                            }}
                          >
                            {item?.name ?? "Unknown Item"}
                          </p>
                          <p
                            style={{
                              fontFamily: "DM Sans, sans-serif",
                              fontSize: "0.75rem",
                              color: "var(--vestra-grey)",
                            }}
                          >
                            Authenticated{" "}
                            {new Date(
                              passport.authentication_date,
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <Link
                        to="/DigitalPassport"
                        search={{ id: passport.item_id }}
                        data-ocid={`profile.view_passport.link.${i + 1}`}
                        className="btn-outlined"
                        style={{ fontSize: "0.75rem", padding: "0.5rem 1rem" }}
                      >
                        View Passport
                      </Link>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <h2
                style={{
                  fontFamily: "Playfair Display, Georgia, serif",
                  fontSize: "1.4rem",
                  fontWeight: 400,
                  color: "var(--vestra-white)",
                  marginBottom: "2rem",
                }}
              >
                Account Settings
              </h2>

              <div
                style={{
                  background: "var(--vestra-graphite)",
                  border: "1px solid var(--vestra-border)",
                  borderRadius: "12px",
                  padding: "1.75rem",
                  marginBottom: "1.5rem",
                }}
              >
                <h3
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--vestra-grey)",
                    marginBottom: "1.25rem",
                  }}
                >
                  Profile
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                  className="settings-fields"
                >
                  {[
                    {
                      label: "Full Name",
                      value: MOCK_USER.name,
                      id: "name",
                      readonly: false,
                    },
                    {
                      label: "Email Address",
                      value: MOCK_USER.email,
                      id: "email",
                      readonly: true,
                    },
                  ].map((field) => (
                    <div key={field.id}>
                      <label
                        htmlFor={field.id}
                        style={{
                          display: "block",
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "0.75rem",
                          color: "var(--vestra-grey)",
                          marginBottom: "0.4rem",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                        }}
                      >
                        {field.label}
                      </label>
                      <input
                        id={field.id}
                        data-ocid={`profile.settings_${field.id}.input`}
                        type="text"
                        defaultValue={field.value}
                        readOnly={field.readonly}
                        style={{
                          width: "100%",
                          padding: "0.65rem 0.875rem",
                          background: field.readonly
                            ? "rgba(255,255,255,0.02)"
                            : "var(--vestra-graphite)",
                          border: "1px solid var(--vestra-border)",
                          borderRadius: "8px",
                          color: field.readonly
                            ? "var(--vestra-grey)"
                            : "var(--vestra-white)",
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "0.9rem",
                          outline: "none",
                          cursor: field.readonly ? "not-allowed" : "text",
                        }}
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  data-ocid="profile.save_profile.button"
                  className="btn-gold"
                  style={{ marginTop: "1.25rem", fontSize: "0.85rem" }}
                >
                  Save Changes
                </button>
              </div>

              <div
                style={{
                  background: "var(--vestra-graphite)",
                  border: "1px solid var(--vestra-border)",
                  borderRadius: "12px",
                  padding: "1.75rem",
                  marginBottom: "1.5rem",
                }}
              >
                <h3
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--vestra-grey)",
                    marginBottom: "1.25rem",
                  }}
                >
                  Notifications
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  {[
                    {
                      id: "notif_email",
                      label: "Order & shipping updates",
                      value: notifEmail,
                      setter: setNotifEmail,
                    },
                    {
                      id: "notif_deals",
                      label: "New arrivals & curated picks",
                      value: notifDeals,
                      setter: setNotifDeals,
                    },
                    {
                      id: "notif_passport",
                      label: "Digital passport updates",
                      value: notifPassport,
                      setter: setNotifPassport,
                    },
                  ].map((notif) => (
                    <div
                      key={notif.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Label
                        htmlFor={notif.id}
                        style={{
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "0.9rem",
                          color: "var(--vestra-white)",
                          cursor: "pointer",
                        }}
                      >
                        {notif.label}
                      </Label>
                      <Switch
                        id={notif.id}
                        data-ocid={`profile.${notif.id}.switch`}
                        checked={notif.value}
                        onCheckedChange={notif.setter}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  background: "rgba(180,40,40,0.05)",
                  border: "1px solid rgba(180,40,40,0.2)",
                  borderRadius: "12px",
                  padding: "1.75rem",
                }}
              >
                <h3
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(200,80,80,0.8)",
                    marginBottom: "1rem",
                  }}
                >
                  Account
                </h3>
                <button
                  type="button"
                  onClick={logout}
                  data-ocid="profile.logout.button"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.65rem 1.5rem",
                    borderRadius: "100px",
                    background: "transparent",
                    border: "1px solid rgba(200,80,80,0.4)",
                    color: "rgba(200,80,80,0.85)",
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    transition: "all var(--dur-micro) var(--ease-luxury)",
                  }}
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) { .profile-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 600px) { .settings-fields { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
