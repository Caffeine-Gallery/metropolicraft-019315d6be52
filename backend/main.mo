import Bool "mo:base/Bool";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor {
    public type Building = {
        buildingType: Text;
        position: (Nat, Nat);
        cost: Nat;
        orientation: Text; // "north", "south", "east", "west"
    };

    public type Street = {
        position: (Nat, Nat);
        direction: Text; // "horizontal" or "vertical"
    };

    public type Car = {
        position: (Nat, Nat);
        direction: Text;
    };

    private stable var buildingsEntries : [(Text, Building)] = [];
    private var buildings = HashMap.HashMap<Text, Building>(10, Text.equal, Text.hash);
    
    private stable var streetsArray : [Street] = [];
    private stable var car : Car = {
        position = (0, 0);
        direction = "east";
    };

    system func preupgrade() {
        buildingsEntries := Iter.toArray(buildings.entries());
    };

    system func postupgrade() {
        buildings := HashMap.fromIter<Text, Building>(buildingsEntries.vals(), 10, Text.equal, Text.hash);
    };

    public func addBuilding(id: Text, buildingType: Text, x: Nat, y: Nat, orientation: Text) : async Bool {
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
            orientation = orientation;
        };

        buildings.put(id, newBuilding);
        true
    };

    public func removeBuilding(id: Text) : async Bool {
        switch (buildings.remove(id)) {
            case null { false };
            case (?_) { true };
        }
    };

    public query func getAllBuildings() : async [(Text, Building)] {
        Iter.toArray(buildings.entries())
    };

    public func initializeStreets() : async () {
        // Create horizontal streets
        streetsArray := Array.append(
            Array.map<Nat, Street>([2, 5, 8], func (y) : Street = {
                position = (0, y);
                direction = "horizontal";
            }),
            // Create vertical streets
            Array.map<Nat, Street>([2, 5, 8], func (x) : Street = {
                position = (x, 0);
                direction = "vertical";
            })
        );
    };

    public query func getStreets() : async [Street] {
        streetsArray
    };

    public func updateCarPosition(x: Nat, y: Nat, direction: Text) : async () {
        car := {
            position = (x, y);
            direction = direction;
        };
    };

    public query func getCarPosition() : async Car {
        car
    };
}
