import Map "mo:core/Map";
import Time "mo:core/Time";
import PassportLib "../lib/passport";
import PassportTypes "../types/passport";
import Common "../types/common";

mixin (
  passports : Map.Map<Common.PassportId, PassportTypes.DigitalPassport>,
  passportState : { var nextPassportId : Nat; var nextItemId : Nat; var nextOrderId : Nat },
) {
  public shared func createPassport(input : { item_id : Common.ItemId; inspector_name : Text; condition_verified : Text }) : async PassportTypes.DigitalPassport {
    let id = passportState.nextPassportId.toText();
    let cert = "VTR-" # (10000000 + passportState.nextPassportId).toText();
    passportState.nextPassportId += 1;
    let passport : PassportTypes.DigitalPassport = {
      id;
      item_id = input.item_id;
      authentication_date = Time.now();
      inspector_name = input.inspector_name;
      certificate_code = cert;
      condition_verified = input.condition_verified;
      qr_code_url = "https://vestra.io/verify/" # cert;
      blockchain_hash = "0x" # id;
      created_at = Time.now();
    };
    PassportLib.createPassport(passports, passport)
  };

  public query func getPassport(id : Common.PassportId) : async ?PassportTypes.DigitalPassport {
    PassportLib.getPassport(passports, id)
  };

  public query func getPassportByItem(item_id : Common.ItemId) : async ?PassportTypes.DigitalPassport {
    PassportLib.getPassportByItem(passports, item_id)
  };
};
