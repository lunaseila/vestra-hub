import Map "mo:core/Map";
import Set "mo:core/Set";
import Common "../types/common";

module {
  public func addToWishlist(
    wishlists : Map.Map<Common.UserId, Set.Set<Common.ItemId>>,
    user_id : Common.UserId,
    item_id : Common.ItemId,
  ) : () {
    let set = switch (wishlists.get(user_id)) {
      case (?s) s;
      case null {
        let s = Set.empty<Common.ItemId>();
        wishlists.add(user_id, s);
        s
      }
    };
    set.add(item_id)
  };

  public func removeFromWishlist(
    wishlists : Map.Map<Common.UserId, Set.Set<Common.ItemId>>,
    user_id : Common.UserId,
    item_id : Common.ItemId,
  ) : () {
    switch (wishlists.get(user_id)) {
      case (?s) { s.remove(item_id) };
      case null {}
    }
  };

  public func getWishlist(
    wishlists : Map.Map<Common.UserId, Set.Set<Common.ItemId>>,
    user_id : Common.UserId,
  ) : [Common.ItemId] {
    switch (wishlists.get(user_id)) {
      case (?s) s.toArray();
      case null []
    }
  };
};
