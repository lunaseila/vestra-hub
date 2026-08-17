import Map "mo:core/Map";
import Time "mo:core/Time";
import OpportunityTypes "../types/ch_opportunity";
import OpportunityLib "../lib/ch_opportunity";

mixin (
  opportunities : Map.Map<Nat, OpportunityTypes.Opportunity>,
  chState : { var nextOpportunityId : Nat },
) {
  public shared ({ caller }) func createOpportunity(
    title : Text,
    description : Text,
    opportunityType : OpportunityTypes.OpportunityType,
    country : Text,
    industry : Text,
    experienceRequired : Text,
  ) : async OpportunityTypes.Opportunity {
    OpportunityLib.createOpportunity(
      opportunities,
      chState,
      title,
      description,
      opportunityType,
      caller.toText(),
      country,
      industry,
      experienceRequired,
      Time.now(),
    );
  };

  public query func getOpportunity(id : Nat) : async ?OpportunityTypes.Opportunity {
    OpportunityLib.getOpportunity(opportunities, id);
  };

  public query func listOpportunities() : async [OpportunityTypes.Opportunity] {
    OpportunityLib.listOpportunities(opportunities);
  };

  public shared func updateOpportunityStatus(
    id : Nat,
    status : OpportunityTypes.OpportunityStatus,
  ) : async Bool {
    OpportunityLib.updateOpportunityStatus(opportunities, id, status);
  };

  public query func getOpportunitiesByCountry(country : Text) : async [OpportunityTypes.Opportunity] {
    OpportunityLib.getOpportunitiesByCountry(opportunities, country);
  };

  public query func getOpportunitiesByIndustry(industry : Text) : async [OpportunityTypes.Opportunity] {
    OpportunityLib.getOpportunitiesByIndustry(opportunities, industry);
  };

  public query func getOpportunitiesByType(
    opportunityType : OpportunityTypes.OpportunityType
  ) : async [OpportunityTypes.Opportunity] {
    OpportunityLib.getOpportunitiesByType(opportunities, opportunityType);
  };
};
