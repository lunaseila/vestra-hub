import Map "mo:core/Map";
import OpportunityTypes "../types/ch_opportunity";

module {
  public type Opportunity = OpportunityTypes.Opportunity;
  public type OpportunityType = OpportunityTypes.OpportunityType;
  public type OpportunityStatus = OpportunityTypes.OpportunityStatus;
  public type OpportunityStorage = Map.Map<Nat, Opportunity>;
  public type AppState = { var nextOpportunityId : Nat };

  public func createOpportunity(
    storage : OpportunityStorage,
    state : AppState,
    title : Text,
    description : Text,
    opportunityType : OpportunityType,
    postedBy : Text,
    country : Text,
    industry : Text,
    experienceRequired : Text,
    createdAt : Int,
  ) : Opportunity {
    let id = state.nextOpportunityId;
    state.nextOpportunityId += 1;
    let op : Opportunity = {
      id;
      title;
      description;
      opportunityType;
      postedBy;
      country;
      industry;
      experienceRequired;
      status = #Active;
      applications = [];
      createdAt;
    };
    storage.add(id, op);
    op;
  };

  public func getOpportunity(storage : OpportunityStorage, id : Nat) : ?Opportunity {
    storage.get(id);
  };

  public func listOpportunities(storage : OpportunityStorage) : [Opportunity] {
    storage.values().toArray();
  };

  public func updateOpportunityStatus(
    storage : OpportunityStorage,
    id : Nat,
    status : OpportunityStatus,
  ) : Bool {
    switch (storage.get(id)) {
      case null false;
      case (?op) {
        storage.add(id, { op with status });
        true;
      };
    };
  };

  public func getOpportunitiesByCountry(storage : OpportunityStorage, country : Text) : [Opportunity] {
    storage.values().filter(func(op) { op.country == country }).toArray();
  };

  public func getOpportunitiesByIndustry(storage : OpportunityStorage, industry : Text) : [Opportunity] {
    storage.values().filter(func(op) { op.industry == industry }).toArray();
  };

  public func getOpportunitiesByType(storage : OpportunityStorage, opportunityType : OpportunityType) : [Opportunity] {
    storage.values().filter(func(op) { op.opportunityType == opportunityType }).toArray();
  };
};
