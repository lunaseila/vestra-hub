import Common "common";

module {
  public type User = {
    id : Common.UserId;
    name : Text;
    email : Text;
    avatar_url : Text;
    member_since : Common.Timestamp;
    tier : Text;
    shipping_addresses : [Text];
    stripe_customer_id : Text;
    style_profile_id : ?Common.StyleProfileId;
    created_at : Common.Timestamp;
  };

  public type UserUpdate = {
    name : Text;
    email : Text;
    avatar_url : Text;
    tier : Text;
    shipping_addresses : [Text];
    stripe_customer_id : Text;
    style_profile_id : ?Common.StyleProfileId;
  };
};
