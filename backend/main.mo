import Bool "mo:base/Bool";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

actor {
    // Building types and their costs
    public type Building = {
        buildingType: Text;  // house, shop, factory
        position: (Nat, Nat);
        cost: Nat;
    };

    // Store buildings in a stable variable
    private stable var buildingsEntries : [(Text, Building)] = [];
    private var buildings = HashMap.HashMap<Text, Building>(10, Text.equal, Text.hash);

    // Initialize buildings from stable storage
    system func preupgrade() {
        buildingsEntries := Iter.toArray(buildings.entries());
    };

    system func postupgrade() {
        buildings := HashMap.fromIter<Text, Building>(buildingsEntries.vals(), 10, Text.equal, Text.hash);
    };

    // Add a new building
    public func addBuilding(id: Text, buildingType: Text, x: Nat, y: Nat) : async Bool {
        let cost = switch(buildingType) {
            case "house" 100;
            case "shop" 200;
            case "factory" 500;
            case _ 0;
        };

        if (cost == 0) return false;

        let newBuilding : Building = {
            buildingType = buildingType;
            position = (x, y);
            cost = cost;
        };

        buildings.put(id, newBuilding);
        true
    };

    // Remove a building
    public func removeBuilding(id: Text) : async Bool {
        switch (buildings.remove(id)) {
            case null { false };
            case (?_) { true };
        }
    };

    // Get all buildings
    public query func getAllBuildings() : async [(Text, Building)] {
        Iter.toArray(buildings.entries())
    };
}
