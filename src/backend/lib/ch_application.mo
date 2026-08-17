import Map "mo:core/Map";
import ApplicationTypes "../types/ch_application";

module {
  public type Application = ApplicationTypes.Application;
  public type ApplicationStatus = ApplicationTypes.ApplicationStatus;
  public type ApplicationStorage = Map.Map<Nat, Application>;
  public type AppState = { var nextApplicationId : Nat };

  public func createApplication(
    storage : ApplicationStorage,
    state : AppState,
    opportunityId : Nat,
    applicantId : Text,
    message : Text,
    createdAt : Int,
  ) : Application {
    let id = state.nextApplicationId;
    state.nextApplicationId += 1;
    let app : Application = {
      id;
      opportunityId;
      applicantId;
      message;
      status = #Pending;
      createdAt;
    };
    storage.add(id, app);
    app;
  };

  public func getApplication(storage : ApplicationStorage, id : Nat) : ?Application {
    storage.get(id);
  };

  public func listApplicationsByOpportunity(storage : ApplicationStorage, opportunityId : Nat) : [Application] {
    storage.values().filter(func(app) { app.opportunityId == opportunityId }).toArray();
  };

  public func updateApplicationStatus(
    storage : ApplicationStorage,
    id : Nat,
    status : ApplicationStatus,
  ) : Bool {
    switch (storage.get(id)) {
      case null false;
      case (?app) {
        storage.add(id, { app with status });
        true;
      };
    };
  };

  public func listApplicationsByUser(storage : ApplicationStorage, applicantId : Text) : [Application] {
    storage.values().filter(func(app) { app.applicantId == applicantId }).toArray();
  };
};
