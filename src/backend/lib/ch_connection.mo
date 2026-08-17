import Map "mo:core/Map";
import ConnectionTypes "../types/ch_connection";

module {
  public type Connection = ConnectionTypes.Connection;
  public type ConnectionStatus = ConnectionTypes.ConnectionStatus;
  public type ConnectionStorage = Map.Map<Nat, Connection>;
  public type AppState = { var nextConnectionId : Nat };

  public func createConnection(
    storage : ConnectionStorage,
    state : AppState,
    requesterId : Text,
    receiverId : Text,
    createdAt : Int,
  ) : Connection {
    let id = state.nextConnectionId;
    state.nextConnectionId += 1;
    let conn : Connection = {
      id;
      requesterId;
      receiverId;
      status = #Pending;
      connectedAt = createdAt;
    };
    storage.add(id, conn);
    conn;
  };

  public func getConnection(storage : ConnectionStorage, id : Nat) : ?Connection {
    storage.get(id);
  };

  public func listConnections(storage : ConnectionStorage) : [Connection] {
    storage.values().toArray();
  };

  public func updateConnectionStatus(
    storage : ConnectionStorage,
    id : Nat,
    status : ConnectionStatus,
  ) : Bool {
    switch (storage.get(id)) {
      case null false;
      case (?conn) {
        storage.add(id, { conn with status });
        true;
      };
    };
  };

  public func getConnectionsByUser(storage : ConnectionStorage, userId : Text) : [Connection] {
    storage.values().filter(func(conn) { conn.requesterId == userId or conn.receiverId == userId }).toArray();
  };
};
