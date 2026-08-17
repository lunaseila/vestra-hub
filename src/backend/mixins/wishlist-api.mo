import Map "mo:core/Map";
import Set "mo:core/Set";
import Runtime "mo:core/Runtime";
import WishlistLib "../lib/wishlist";
import Common "../types/common";

mixin (
  wishlists : Map.Map<Common.UserId, Set.Set<Common.ItemId>>,
) {
  public shared ({ caller }) func addToWishlist(item_id : Common.ItemId) : async () {
    if (caller.isAnonymous()) { Runtime.trap("Anonymous not allowed") };
    WishlistLib.addToWishlist(wishlists, caller.toText(), item_id)
  };

  public shared ({ caller }) func removeFromWishlist(item_id : Common.ItemId) : async () {
    if (caller.isAnonymous()) { Runtime.trap("Anonymous not allowed") };
    WishlistLib.removeFromWishlist(wishlists, caller.toText(), item_id)
  };

  public shared ({ caller }) func getWishlist() : async [Common.ItemId] {
    if (caller.isAnonymous()) { Runtime.trap("Anonymous not allowed") };
    WishlistLib.getWishlist(wishlists, caller.toText())
  };
};
