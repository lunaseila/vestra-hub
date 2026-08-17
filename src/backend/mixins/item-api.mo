import Map "mo:core/Map";
import Time "mo:core/Time";
import ItemLib "../lib/item";
import ItemTypes "../types/item";
import Common "../types/common";
import Runtime "mo:core/Runtime";

mixin (
  items : Map.Map<Common.ItemId, ItemTypes.Item>,
  state : { var nextItemId : Nat; var nextOrderId : Nat; var nextPassportId : Nat },
) {
  public shared func createItem(item : ItemTypes.Item) : async ItemTypes.Item {
    let id = state.nextItemId.toText();
    state.nextItemId += 1;
    let newItem : ItemTypes.Item = {
      item with
      id;
      status = "Listed";
      created_at = Time.now();
    };
    ItemLib.createItem(items, newItem)
  };

  public query func getItem(id : Common.ItemId) : async ?ItemTypes.Item {
    ItemLib.getItem(items, id)
  };

  public query func listItems() : async [ItemTypes.Item] {
    ItemLib.listItems(items)
  };

  public shared func updateItemStatus(id : Common.ItemId, status : Text) : async ?ItemTypes.Item {
    ItemLib.updateItemStatus(items, id, status)
  };

  public query func getItemsByCategory(category : Text) : async [ItemTypes.Item] {
    ItemLib.getItemsByCategory(items, category)
  };

  public query func getFeaturedItems() : async [ItemTypes.Item] {
    ItemLib.getFeaturedItems(items)
  };

  public query func getItemsByFilter(filter : ItemTypes.ItemFilter) : async [ItemTypes.Item] {
    ItemLib.getItemsByFilter(items, filter)
  };
};
