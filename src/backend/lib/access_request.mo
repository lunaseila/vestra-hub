import Debug "mo:core/Debug";
import Map "mo:core/Map";
import AccessRequestTypes "../types/access_request";

module {
  public type AccessRequest = AccessRequestTypes.AccessRequest;
  public type AccessRequestStorage = Map.Map<Nat, AccessRequest>;
  public type AppState = { var nextAccessRequestId : Nat };

  public func storeAccessRequest(
    storage : AccessRequestStorage,
    state : AppState,
    email : Text,
    createdAt : Int,
  ) : AccessRequest {
    let id = state.nextAccessRequestId;
    state.nextAccessRequestId += 1;
    let request : AccessRequest = { id; email; createdAt };
    storage.add(id, request);
    request;
  };
};
