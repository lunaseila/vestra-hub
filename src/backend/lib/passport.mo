import Map "mo:core/Map";
import Types "../types/passport";
import Common "../types/common";

module {
  public func createPassport(
    passports : Map.Map<Common.PassportId, Types.DigitalPassport>,
    passport : Types.DigitalPassport,
  ) : Types.DigitalPassport {
    passports.add(passport.id, passport);
    passport
  };

  public func getPassport(
    passports : Map.Map<Common.PassportId, Types.DigitalPassport>,
    id : Common.PassportId,
  ) : ?Types.DigitalPassport {
    passports.get(id)
  };

  public func getPassportByItem(
    passports : Map.Map<Common.PassportId, Types.DigitalPassport>,
    item_id : Common.ItemId,
  ) : ?Types.DigitalPassport {
    passports.values().find(func(p) { p.item_id == item_id })
  };
};
