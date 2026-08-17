import Map "mo:core/Map";
import Time "mo:core/Time";
import ApplicationTypes "../types/ch_application";
import ApplicationLib "../lib/ch_application";

mixin (
  applications : Map.Map<Nat, ApplicationTypes.Application>,
  chAppState : { var nextApplicationId : Nat },
) {
  public shared ({ caller }) func createApplication(
    opportunityId : Nat,
    message : Text,
  ) : async ApplicationTypes.Application {
    ApplicationLib.createApplication(
      applications,
      chAppState,
      opportunityId,
      caller.toText(),
      message,
      Time.now(),
    );
  };

  public query func getApplication(id : Nat) : async ?ApplicationTypes.Application {
    ApplicationLib.getApplication(applications, id);
  };

  public query func listApplicationsByOpportunity(opportunityId : Nat) : async [ApplicationTypes.Application] {
    ApplicationLib.listApplicationsByOpportunity(applications, opportunityId);
  };

  public shared func updateApplicationStatus(
    id : Nat,
    status : ApplicationTypes.ApplicationStatus,
  ) : async Bool {
    ApplicationLib.updateApplicationStatus(applications, id, status);
  };

  public query func listApplicationsByUser(applicantId : Text) : async [ApplicationTypes.Application] {
    ApplicationLib.listApplicationsByUser(applications, applicantId);
  };
};
