export const idlFactory = ({ IDL }) => {
  const Building = IDL.Record({
    'cost' : IDL.Nat,
    'position' : IDL.Tuple(IDL.Nat, IDL.Nat),
    'buildingType' : IDL.Text,
    'orientation' : IDL.Text,
  });
  const Car = IDL.Record({
    'direction' : IDL.Text,
    'position' : IDL.Tuple(IDL.Nat, IDL.Nat),
  });
  const Street = IDL.Record({
    'direction' : IDL.Text,
    'position' : IDL.Tuple(IDL.Nat, IDL.Nat),
  });
  return IDL.Service({
    'addBuilding' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat, IDL.Nat, IDL.Text],
        [IDL.Bool],
        [],
      ),
    'getAllBuildings' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, Building))],
        ['query'],
      ),
    'getCarPosition' : IDL.Func([], [Car], ['query']),
    'getStreets' : IDL.Func([], [IDL.Vec(Street)], ['query']),
    'initializeStreets' : IDL.Func([], [], []),
    'removeBuilding' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'updateCarPosition' : IDL.Func([IDL.Nat, IDL.Nat, IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
