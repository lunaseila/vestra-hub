import Common "common";

module {
  public type StyleProfile = {
    id : Common.StyleProfileId;
    user_id : Common.UserId;
    archetype : Text;
    decade : Text;
    palette : Text;
    occasion : Text;
    created_at : Common.Timestamp;
  };

  public type StyleProfileInput = {
    archetype : Text;
    decade : Text;
    palette : Text;
    occasion : Text;
  };
};
