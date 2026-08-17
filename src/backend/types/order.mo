import Common "common";

module {
  public type Order = {
    id : Common.OrderId;
    item_id : Common.ItemId;
    buyer_id : Common.UserId;
    order_type : Text;
    rent_start : ?Common.Timestamp;
    rent_end : ?Common.Timestamp;
    total_price : Nat;
    deposit_paid : Nat;
    status : Text;
    stripe_payment_id : Text;
    created_at : Common.Timestamp;
  };

  public type CreateOrderInput = {
    item_id : Common.ItemId;
    order_type : Text;
    rent_start : ?Common.Timestamp;
    rent_end : ?Common.Timestamp;
    total_price : Nat;
    deposit_paid : Nat;
    stripe_payment_id : Text;
  };
};
