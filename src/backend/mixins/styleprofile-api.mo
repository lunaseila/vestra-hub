import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import StyleLib "../lib/styleprofile";
import StyleTypes "../types/styleprofile";
import Common "../types/common";

mixin (
  profiles : Map.Map<Common.UserId, StyleTypes.StyleProfile>,
) {
  public shared ({ caller }) func saveStyleProfile(input : StyleTypes.StyleProfileInput) : async StyleTypes.StyleProfile {
    if (caller.isAnonymous()) { Runtime.trap("Anonymous not allowed") };
    StyleLib.saveStyleProfile(profiles, caller.toText(), input)
  };

  public shared ({ caller }) func getStyleProfile() : async ?StyleTypes.StyleProfile {
    if (caller.isAnonymous()) { Runtime.trap("Anonymous not allowed") };
    StyleLib.getStyleProfile(profiles, caller.toText())
  };
};
