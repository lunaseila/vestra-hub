import Common "common";

module {
  public type Item = {
    id : Common.ItemId;
    name : Text;
    brand : Text;
    category : Text;
    season : Text;
    year : Nat;
    condition : Text;
    availability : Text;
    price_buy : ?Nat;
    price_rent_day : ?Nat;
    deposit : ?Nat;
    images : [Text];
    description : Text;
    material : Text;
    measurements : Text;
    passport_id : ?Common.PassportId;
    seller_id : Common.UserId;
    status : Text;
    created_at : Common.Timestamp;
  };

  public type ItemFilter = {
    category : ?Text;
    brand : ?Text;
    condition : ?Text;
    availability : ?Text;
    min_price : ?Nat;
    max_price : ?Nat;
  };
};
