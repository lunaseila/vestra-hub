import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import UserLib "../lib/user";
import UserTypes "../types/user";
import Common "../types/common";

mixin (
  users : Map.Map<Common.UserId, UserTypes.User>,
) {
  public shared ({ caller }) func createUser(name : Text, email : Text) : async UserTypes.User {
    if (caller.isAnonymous()) { Runtime.trap("Anonymous not allowed") };
    let id = caller.toText();
    switch (users.get(id)) {
      case (?existing) existing;
      case null {
        let user : UserTypes.User = {
          id;
          name;
          email;
          avatar_url = "";
          member_since = Time.now();
          tier = "Member";
          shipping_addresses = [];
          stripe_customer_id = "";
          style_profile_id = null;
          created_at = Time.now();
        };
        UserLib.createUser(users, user)
      }
    }
  };

  public query func getUser(id : Common.UserId) : async ?UserTypes.User {
    UserLib.getUser(users, id)
  };

  public shared ({ caller }) func updateUser(update : UserTypes.UserUpdate) : async ?UserTypes.User {
    if (caller.isAnonymous()) { Runtime.trap("Anonymous not allowed") };
    UserLib.updateUser(users, caller.toText(), update)
  };

  public shared ({ caller }) func getUserByPrincipal() : async ?UserTypes.User {
    if (caller.isAnonymous()) { Runtime.trap("Anonymous not allowed") };
    UserLib.getUserByPrincipal(users, caller)
  };
};
