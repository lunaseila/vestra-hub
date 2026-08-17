import Common "common";

module {
  public type DigitalPassport = {
    id : Common.PassportId;
    item_id : Common.ItemId;
    authentication_date : Common.Timestamp;
    inspector_name : Text;
    certificate_code : Text;
    condition_verified : Text;
    qr_code_url : Text;
    blockchain_hash : Text;
    created_at : Common.Timestamp;
  };
};
