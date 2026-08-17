import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import OrderLib "../lib/order";
import OrderTypes "../types/order";
import Common "../types/common";

mixin (
  orders : Map.Map<Common.OrderId, OrderTypes.Order>,
  state : { var nextOrderId : Nat; var nextItemId : Nat; var nextPassportId : Nat },
) {
  public shared ({ caller }) func createOrder(input : OrderTypes.CreateOrderInput) : async OrderTypes.Order {
    if (caller.isAnonymous()) { Runtime.trap("Anonymous not allowed") };
    OrderLib.createOrder(orders, input, caller.toText(), state)
  };

  public query func getOrder(id : Common.OrderId) : async ?OrderTypes.Order {
    OrderLib.getOrder(orders, id)
  };

  public shared ({ caller }) func getUserOrders() : async [OrderTypes.Order] {
    if (caller.isAnonymous()) { Runtime.trap("Anonymous not allowed") };
    OrderLib.getUserOrders(orders, caller.toText())
  };

  public shared func updateOrderStatus(id : Common.OrderId, status : Text) : async ?OrderTypes.Order {
    OrderLib.updateOrderStatus(orders, id, status)
  };
};
