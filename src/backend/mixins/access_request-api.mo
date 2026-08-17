import Map "mo:core/Map";
import Time "mo:core/Time";
import AccessRequestTypes "../types/access_request";
import AccessRequestLib "../lib/access_request";
import Email "mo:caffeineai-email/emailClient";

mixin (
  accessRequests : Map.Map<Nat, AccessRequestTypes.AccessRequest>,
  accessRequestState : { var nextAccessRequestId : Nat },
) {
  public shared func storeAccessRequest(email : Text) : async () {
    ignore AccessRequestLib.storeAccessRequest(accessRequests, accessRequestState, email, Time.now());
    ignore await Email.sendServiceEmail(
      "noreply",
      ["2ndvestra@gmail.com"],
      "New Vestra Hub Access Request",
      "New access request received from: " # email,
    );
  };
};
