import Map "mo:core/Map";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Common "types/common";
import ItemTypes "types/item";
import PassportTypes "types/passport";
import UserTypes "types/user";
import OrderTypes "types/order";
import StyleTypes "types/styleprofile";
import ChOpportunityTypes "types/ch_opportunity";
import ChApplicationTypes "types/ch_application";
import ChConnectionTypes "types/ch_connection";
import ChOnboardingTypes "types/ch_onboarding";
import ItemApi "mixins/item-api";
import PassportApi "mixins/passport-api";
import UserApi "mixins/user-api";
import OrderApi "mixins/order-api";
import StyleApi "mixins/styleprofile-api";
import WishlistApi "mixins/wishlist-api";
import ChOpportunityApi "mixins/ch_opportunity-api";
import ChApplicationApi "mixins/ch_application-api";
import ChConnectionApi "mixins/ch_connection-api";
import ChOnboardingApi "mixins/ch_onboarding-api";
import AccessRequestTypes "types/access_request";
import AccessRequestApi "mixins/access_request-api";

actor {
  // --- Stable state ---
  let items = Map.empty<Common.ItemId, ItemTypes.Item>();
  let passports = Map.empty<Common.PassportId, PassportTypes.DigitalPassport>();
  let users = Map.empty<Common.UserId, UserTypes.User>();
  let orders = Map.empty<Common.OrderId, OrderTypes.Order>();
  let profiles = Map.empty<Common.UserId, StyleTypes.StyleProfile>();
  let wishlists = Map.empty<Common.UserId, Set.Set<Common.ItemId>>();
  let appState = {
    var nextItemId : Nat = 0;
    var nextOrderId : Nat = 0;
    var nextPassportId : Nat = 0;
  };

  // --- Community Hub state ---
  let opportunities = Map.empty<Nat, ChOpportunityTypes.Opportunity>();
  let chApplications = Map.empty<Nat, ChApplicationTypes.Application>();
  let connections = Map.empty<Nat, ChConnectionTypes.Connection>();
  let onboardings = Map.empty<Nat, ChOnboardingTypes.OnboardingSubmission>();
  let chState = {
    var nextOpportunityId : Nat = 0;
    var nextApplicationId : Nat = 0;
    var nextConnectionId : Nat = 0;
    var nextOnboardingId : Nat = 0;
  };

  let accessRequests = Map.empty<Nat, AccessRequestTypes.AccessRequest>();
  let accessRequestState = { var nextAccessRequestId : Nat = 0 };

  // --- Vestra mixins ---
  include ItemApi(items, appState);
  include PassportApi(passports, appState);
  include UserApi(users);
  include OrderApi(orders, appState);
  include StyleApi(profiles);
  include WishlistApi(wishlists);

  // --- Community Hub mixins ---
  include ChOpportunityApi(opportunities, chState);
  include ChApplicationApi(chApplications, chState);
  include ChConnectionApi(connections, chState);
  include ChOnboardingApi(onboardings, chState);
  // --- Access Request mixin ---
  include AccessRequestApi(accessRequests, accessRequestState);

  // --- Seed data ---
  do {
    if (items.size() == 0) {
      let seed : [ItemTypes.Item] = [
        { id = appState.nextItemId.toText(); name = "Classic Flap Bag"; brand = "Chanel"; category = "Bags"; season = "Timeless"; year = 2019; condition = "Excellent"; availability = "Both"; price_buy = ?4500; price_rent_day = ?85; deposit = ?500; images = ["https://images.unsplash.com/photo-1584917865442-de89be371e05?w=800"]; description = "Iconic Chanel Classic Flap in black caviar leather with gold hardware. Timeless elegance in pristine condition."; material = "Caviar leather"; measurements = "25.5 x 15.5 x 6.5 cm"; passport_id = null; seller_id = "system"; status = "Listed"; created_at = 0 },
        { id = (appState.nextItemId + 1).toText(); name = "Birkin 30"; brand = "Hermès"; category = "Bags"; season = "Timeless"; year = 2020; condition = "Pristine"; availability = "Buy"; price_buy = ?18500; price_rent_day = null; deposit = null; images = ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800"]; description = "Hermès Birkin 30 in Togo leather, Gold colourway with palladium hardware. Full set with dust bag, box, and authentication card."; material = "Togo leather"; measurements = "30 x 22 x 16 cm"; passport_id = null; seller_id = "system"; status = "Listed"; created_at = 0 },
        { id = (appState.nextItemId + 2).toText(); name = "Neverfull MM"; brand = "Louis Vuitton"; category = "Bags"; season = "SS2021"; year = 2021; condition = "Very Good"; availability = "Both"; price_buy = ?1200; price_rent_day = ?35; deposit = ?200; images = ["https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800"]; description = "Louis Vuitton Neverfull MM in classic Monogram canvas with beige interior. Practical yet luxurious everyday tote."; material = "Monogram canvas"; measurements = "31 x 28 x 14 cm"; passport_id = null; seller_id = "system"; status = "Listed"; created_at = 0 },
        { id = (appState.nextItemId + 3).toText(); name = "GG Marmont Small"; brand = "Gucci"; category = "Bags"; season = "FW2020"; year = 2020; condition = "Excellent"; availability = "Both"; price_buy = ?1350; price_rent_day = ?40; deposit = ?200; images = ["https://images.unsplash.com/photo-1614179818511-1e63d6bc2ebc?w=800"]; description = "Gucci GG Marmont small matelassé shoulder bag in black leather with antique gold hardware."; material = "Matelassé chevron leather"; measurements = "26 x 15 x 7 cm"; passport_id = null; seller_id = "system"; status = "Listed"; created_at = 0 },
        { id = (appState.nextItemId + 4).toText(); name = "Saffiano Leather Tote"; brand = "Prada"; category = "Bags"; season = "SS2022"; year = 2022; condition = "Pristine"; availability = "Buy"; price_buy = ?2200; price_rent_day = null; deposit = null; images = ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800"]; description = "Prada large Saffiano leather tote in nero. Structured silhouette with gold triangle logo plaque."; material = "Saffiano leather"; measurements = "36 x 26 x 14 cm"; passport_id = null; seller_id = "system"; status = "Listed"; created_at = 0 },
        { id = (appState.nextItemId + 5).toText(); name = "Intrecciato Shoulder Bag"; brand = "Bottega Veneta"; category = "Bags"; season = "FW2021"; year = 2021; condition = "Excellent"; availability = "Both"; price_buy = ?3200; price_rent_day = ?65; deposit = ?350; images = ["https://images.unsplash.com/photo-1584917865442-de89be371e05?w=800"]; description = "Bottega Veneta medium intrecciato woven leather shoulder bag. Understated luxury at its finest."; material = "Intrecciato nappa leather"; measurements = "28 x 18 x 10 cm"; passport_id = null; seller_id = "system"; status = "Listed"; created_at = 0 },
        { id = (appState.nextItemId + 6).toText(); name = "Tweed Bouclé Jacket"; brand = "Chanel"; category = "Ready-to-Wear"; season = "FW2019"; year = 2019; condition = "Excellent"; availability = "Both"; price_buy = ?3800; price_rent_day = ?95; deposit = ?400; images = ["https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800"]; description = "Chanel iconic tweed bouclé jacket in ivory and gold. Four-pocket design with CC button closures."; material = "Wool bouclé tweed"; measurements = "FR 38 / UK 10"; passport_id = null; seller_id = "system"; status = "Listed"; created_at = 0 },
        { id = (appState.nextItemId + 7).toText(); name = "Silk Slip Dress"; brand = "Gucci"; category = "Ready-to-Wear"; season = "SS2020"; year = 2020; condition = "Very Good"; availability = "Rent"; price_buy = null; price_rent_day = ?75; deposit = ?300; images = ["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800"]; description = "Gucci ivory silk slip dress with floral embroidery and side slits. Resort glamour reimagined."; material = "100% silk"; measurements = "IT 40 / UK 8"; passport_id = null; seller_id = "system"; status = "Listed"; created_at = 0 },
        { id = (appState.nextItemId + 8).toText(); name = "Patent Leather Pumps"; brand = "Christian Louboutin"; category = "Shoes"; season = "Timeless"; year = 2018; condition = "Very Good"; availability = "Both"; price_buy = ?550; price_rent_day = ?25; deposit = ?150; images = ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800"]; description = "Christian Louboutin So Kate 120 patent leather pumps in nude. The elongating classic, barely worn."; material = "Patent leather"; measurements = "EU 38"; passport_id = null; seller_id = "system"; status = "Listed"; created_at = 0 },
        { id = (appState.nextItemId + 9).toText(); name = "Logo Belt"; brand = "Gucci"; category = "Accessories"; season = "Timeless"; year = 2020; condition = "Excellent"; availability = "Both"; price_buy = ?420; price_rent_day = ?15; deposit = ?100; images = ["https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=800"]; description = "Gucci GG Supreme canvas belt with double G buckle. The signature piece that elevates any outfit."; material = "GG Supreme canvas with leather trim"; measurements = "85 cm / Size 32"; passport_id = null; seller_id = "system"; status = "Listed"; created_at = 0 },
        { id = (appState.nextItemId + 10).toText(); name = "Coco Crush Ring"; brand = "Chanel"; category = "Jewellery"; season = "Timeless"; year = 2021; condition = "Pristine"; availability = "Both"; price_buy = ?2800; price_rent_day = ?55; deposit = ?300; images = ["https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800"]; description = "Chanel Coco Crush ring in 18K yellow gold with quilted motif. Fine jewellery with iconic design language."; material = "18K yellow gold"; measurements = "Size 52 (EU)"; passport_id = null; seller_id = "system"; status = "Listed"; created_at = 0 },
        { id = (appState.nextItemId + 11).toText(); name = "Kelly 28"; brand = "Hermès"; category = "Bags"; season = "Timeless"; year = 2017; condition = "Very Good"; availability = "Buy"; price_buy = ?14000; price_rent_day = null; deposit = null; images = ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800"]; description = "Hermès Kelly 28 in Epsom leather, Etain grey with palladium hardware. Retourne construction. Complete with lock, keys, clochette, dust bag and box."; material = "Epsom leather"; measurements = "28 x 22 x 10 cm"; passport_id = null; seller_id = "system"; status = "Listed"; created_at = 0 },
      ];
      for (item in seed.vals()) {
        items.add(item.id, item);
      };
      appState.nextItemId := 12;
    };

    // --- Community Hub seed opportunities ---
    if (opportunities.size() == 0) {
      let seedOps : [ChOpportunityTypes.Opportunity] = [
        { id = 0; title = "Senior AI Engineer"; description = "We are looking for an experienced AI engineer to lead our ML infrastructure at a fast-growing SaaS company."; opportunityType = #Job; postedBy = "system"; country = "United States"; industry = "AI"; experienceRequired = "Expert"; status = #Active; applications = []; createdAt = 0 },
        { id = 1; title = "Fintech Partnership Opportunity"; description = "Established fintech seeking integration partners in the European market to expand payment solutions."; opportunityType = #Partnership; postedBy = "system"; country = "Germany"; industry = "Finance"; experienceRequired = "Intermediate"; status = #Active; applications = []; createdAt = 0 },
        { id = 2; title = "Brand Identity Design"; description = "Early-stage startup seeking a freelance designer to craft brand identity, logo, and UI design system."; opportunityType = #Freelance; postedBy = "system"; country = "Italy"; industry = "Design"; experienceRequired = "Intermediate"; status = #Active; applications = []; createdAt = 0 },
        { id = 3; title = "SaaS Co-Founder — CTO"; description = "Non-technical founder with strong market traction seeking a technical co-founder to lead product development."; opportunityType = #Startup; postedBy = "system"; country = "United Kingdom"; industry = "SaaS"; experienceRequired = "Expert"; status = #Active; applications = []; createdAt = 0 },
        { id = 4; title = "Seed Investor Wanted"; description = "EdTech startup raising pre-seed round. Looking for angel investors with education sector experience."; opportunityType = #Investment; postedBy = "system"; country = "Spain"; industry = "E-commerce"; experienceRequired = "Enterprise"; status = #Active; applications = []; createdAt = 0 },
        { id = 5; title = "Growth Marketing Lead"; description = "Scale-up in the UAE hiring a senior growth marketer with experience in B2B SaaS acquisition funnels."; opportunityType = #Job; postedBy = "system"; country = "UAE"; industry = "Marketing"; experienceRequired = "Expert"; status = #Active; applications = []; createdAt = 0 },
        { id = 6; title = "Full-Stack Engineer — Contract"; description = "6-month contract for a full-stack engineer to build internal tooling for a Singapore-based enterprise."; opportunityType = #Freelance; postedBy = "system"; country = "Singapore"; industry = "Engineering"; experienceRequired = "Intermediate"; status = #Active; applications = []; createdAt = 0 },
        { id = 7; title = "Healthcare AI Research Partnership"; description = "Research institute seeking tech partner to develop AI diagnostic tooling for radiology workflows."; opportunityType = #Partnership; postedBy = "system"; country = "Germany"; industry = "Healthcare"; experienceRequired = "Expert"; status = #Active; applications = []; createdAt = 0 },
        { id = 8; title = "Legal Tech Platform Co-Founder"; description = "Practicing solicitor seeking technical co-founder to build an AI-powered contract review SaaS product."; opportunityType = #Startup; postedBy = "system"; country = "United Kingdom"; industry = "Legal"; experienceRequired = "Expert"; status = #Active; applications = []; createdAt = 0 },
        { id = 9; title = "Content & Media Strategist"; description = "Boutique media agency in France looking for a freelance strategist to lead content campaigns for luxury clients."; opportunityType = #Freelance; postedBy = "system"; country = "France"; industry = "Media"; experienceRequired = "Intermediate"; status = #Active; applications = []; createdAt = 0 },
      ];
      for (op in seedOps.vals()) {
        opportunities.add(op.id, op);
      };
      chState.nextOpportunityId := 10;
    };
  };
};
