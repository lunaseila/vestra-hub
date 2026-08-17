import Map "mo:core/Map";
import Types "../types/item";
import Common "../types/common";
import Int "mo:core/Int";

module {
  public func createItem(
    items : Map.Map<Common.ItemId, Types.Item>,
    item : Types.Item,
  ) : Types.Item {
    items.add(item.id, item);
    item
  };

  public func getItem(
    items : Map.Map<Common.ItemId, Types.Item>,
    id : Common.ItemId,
  ) : ?Types.Item {
    items.get(id)
  };

  public func listItems(
    items : Map.Map<Common.ItemId, Types.Item>,
  ) : [Types.Item] {
    items.values().filter(func(i) { i.status == "Listed" }).toArray()
  };

  public func updateItemStatus(
    items : Map.Map<Common.ItemId, Types.Item>,
    id : Common.ItemId,
    status : Text,
  ) : ?Types.Item {
    switch (items.get(id)) {
      case (?item) {
        let updated = { item with status = status };
        items.add(id, updated);
        ?updated
      };
      case null null
    }
  };

  public func getItemsByCategory(
    items : Map.Map<Common.ItemId, Types.Item>,
    category : Text,
  ) : [Types.Item] {
    items.values().filter(func(i) { i.category == category and i.status == "Listed" }).toArray()
  };

  public func getFeaturedItems(
    items : Map.Map<Common.ItemId, Types.Item>,
  ) : [Types.Item] {
    let listed = items.values().filter(func(i) { i.status == "Listed" }).toArray();
    let sorted = listed.sort(func(a, b) { Int.compare(b.created_at, a.created_at) });
    if (sorted.size() <= 8) { sorted } else { sorted.sliceToArray(0, 8) }
  };

  public func getItemsByFilter(
    items : Map.Map<Common.ItemId, Types.Item>,
    filter : Types.ItemFilter,
  ) : [Types.Item] {
    items.values().filter(func(i) {
      if (i.status != "Listed") { return false };
      switch (filter.category) { case (?c) { if (i.category != c) { return false } }; case null {} };
      switch (filter.brand) { case (?b) { if (i.brand != b) { return false } }; case null {} };
      switch (filter.condition) { case (?c) { if (i.condition != c) { return false } }; case null {} };
      switch (filter.availability) { case (?a) { if (i.availability != a) { return false } }; case null {} };
      switch (filter.min_price) {
        case (?minP) {
          switch (i.price_buy) {
            case (?p) { if (p < minP) { return false } };
            case null { return false }
          }
        };
        case null {}
      };
      switch (filter.max_price) {
        case (?maxP) {
          switch (i.price_buy) {
            case (?p) { if (p > maxP) { return false } };
            case null { return false }
          }
        };
        case null {}
      };
      true
    }).toArray()
  };
};
