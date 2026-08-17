import Map "mo:core/Map";
import Types "../types/styleprofile";
import Common "../types/common";
import Time "mo:core/Time";

module {
  public func saveStyleProfile(
    profiles : Map.Map<Common.UserId, Types.StyleProfile>,
    user_id : Common.UserId,
    input : Types.StyleProfileInput,
  ) : Types.StyleProfile {
    let profile : Types.StyleProfile = {
      id = user_id;
      user_id;
      archetype = input.archetype;
      decade = input.decade;
      palette = input.palette;
      occasion = input.occasion;
      created_at = Time.now();
    };
    profiles.add(user_id, profile);
    profile
  };

  public func getStyleProfile(
    profiles : Map.Map<Common.UserId, Types.StyleProfile>,
    user_id : Common.UserId,
  ) : ?Types.StyleProfile {
    profiles.get(user_id)
  };
};
