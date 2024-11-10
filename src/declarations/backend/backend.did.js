export const idlFactory = ({ IDL }) => {
  const Building = IDL.Record({
    'cost' : IDL.Nat,
    'position' : IDL.Tuple(IDL.Nat, IDL.Nat),
    'buildingType' : IDL.Text,
  });
  return IDL.Service({
    'addBuilding' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat, IDL.Nat],
        [IDL.Bool],
        [],
      ),
    'getAllBuildings' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, Building))],
        ['query'],
      ),
    'removeBuilding' : IDL.Func([IDL.Text], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
