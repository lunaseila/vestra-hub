module {
  public type ApplicationStatus = {
    #Pending;
    #Viewed;
    #Accepted;
    #Declined;
  };

  public type Application = {
    id : Nat;
    opportunityId : Nat;
    applicantId : Text;
    message : Text;
    status : ApplicationStatus;
    createdAt : Int;
  };
};
