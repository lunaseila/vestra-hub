import Map "mo:core/Map";
import Time "mo:core/Time";
import ConnectionTypes "../types/ch_connection";
import ConnectionLib "../lib/ch_connection";

mixin (
  connections : Map.Map<Nat, ConnectionTypes.Connection>,
  chConnState : { var nextConnectionId : Nat },
) {
  public shared ({ caller }) func createConnection(receiverId : Text) : async ConnectionTypes.Connection {
    ConnectionLib.createConnection(
      connections,
      chConnState,
      caller.toText(),
      receiverId,
      Time.now(),
    );
  };

  public query func getConnection(id : Nat) : async ?ConnectionTypes.Connection {
    ConnectionLib.getConnection(connections, id);
  };

  public query func listConnections() : async [ConnectionTypes.Connection] {
    ConnectionLib.listConnections(connections);
  };

  public shared func updateConnectionStatus(
    id : Nat,
    status : ConnectionTypes.ConnectionStatus,
  ) : async Bool {
    ConnectionLib.updateConnectionStatus(connections, id, status);
  };

  public query func getConnectionsByUser(userId : Text) : async [ConnectionTypes.Connection] {
    ConnectionLib.getConnectionsByUser(connections, userId);
  };
};
