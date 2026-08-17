module {
  public type OpportunityType = {
    #Job;
    #Partnership;
    #Freelance;
    #Startup;
    #Investment;
  };

  public type OpportunityStatus = {
    #Active;
    #Filled;
    #Paused;
  };

  public type Opportunity = {
    id : Nat;
    title : Text;
    description : Text;
    opportunityType : OpportunityType;
    postedBy : Text;
    country : Text;
    industry : Text;
    experienceRequired : Text;
    status : OpportunityStatus;
    applications : [Nat];
    createdAt : Int;
  };
};
