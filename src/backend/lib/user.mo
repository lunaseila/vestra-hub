import Map "mo:core/Map";
import Types "../types/user";
import Common "../types/common";
import Principal "mo:core/Principal";

module {
  public func createUser(
    users : Map.Map<Common.UserId, Types.User>,
    user : Types.User,
  ) : Types.User {
    users.add(user.id, user);
    user
  };

  public func getUser(
    users : Map.Map<Common.UserId, Types.User>,
    id : Common.UserId,
  ) : ?Types.User {
    users.get(id)
  };

  public func updateUser(
    users : Map.Map<Common.UserId, Types.User>,
    id : Common.UserId,
    update : Types.UserUpdate,
  ) : ?Types.User {
    switch (users.get(id)) {
      case (?user) {
        let updated : Types.User = {
          user with
          name = update.name;
          email = update.email;
          avatar_url = update.avatar_url;
          tier = update.tier;
          shipping_addresses = update.shipping_addresses;
          stripe_customer_id = update.stripe_customer_id;
          style_profile_id = update.style_profile_id;
        };
        users.add(id, updated);
        ?updated
      };
      case null null
    }
  };

  public func getUserByPrincipal(
    users : Map.Map<Common.UserId, Types.User>,
    caller : Principal,
  ) : ?Types.User {
    let callerId = caller.toText();
    users.get(callerId)
  };
};
