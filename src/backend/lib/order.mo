import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/order";
import Common "../types/common";

module {
  public func createOrder(
    orders : Map.Map<Common.OrderId, Types.Order>,
    input : Types.CreateOrderInput,
    buyer_id : Common.UserId,
    counter : { var nextOrderId : Nat; var nextItemId : Nat; var nextPassportId : Nat },
  ) : Types.Order {
    let id = counter.nextOrderId.toText();
    counter.nextOrderId += 1;
    let order : Types.Order = {
      id;
      item_id = input.item_id;
      buyer_id;
      order_type = input.order_type;
      rent_start = input.rent_start;
      rent_end = input.rent_end;
      total_price = input.total_price;
      deposit_paid = input.deposit_paid;
      status = "Pending";
      stripe_payment_id = input.stripe_payment_id;
      created_at = Time.now();
    };
    orders.add(id, order);
    order
  };

  public func getOrder(
    orders : Map.Map<Common.OrderId, Types.Order>,
    id : Common.OrderId,
  ) : ?Types.Order {
    orders.get(id)
  };

  public func getUserOrders(
    orders : Map.Map<Common.OrderId, Types.Order>,
    buyer_id : Common.UserId,
  ) : [Types.Order] {
    orders.values().filter(func(o) { o.buyer_id == buyer_id }).toArray()
  };

  public func updateOrderStatus(
    orders : Map.Map<Common.OrderId, Types.Order>,
    id : Common.OrderId,
    status : Text,
  ) : ?Types.Order {
    switch (orders.get(id)) {
      case (?order) {
        let updated = { order with status = status };
        orders.add(id, updated);
        ?updated
      };
      case null null
    }
  };
};
