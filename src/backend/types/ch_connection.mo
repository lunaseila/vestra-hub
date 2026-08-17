module {
  public type ConnectionStatus = {
    #Pending;
    #Accepted;
    #Declined;
  };

  public type Connection = {
    id : Nat;
    requesterId : Text;
    receiverId : Text;
    status : ConnectionStatus;
    connectedAt : Int;
  };
};
