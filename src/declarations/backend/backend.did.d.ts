import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Building {
  'cost' : bigint,
  'position' : [bigint, bigint],
  'buildingType' : string,
}
export interface _SERVICE {
  'addBuilding' : ActorMethod<[string, string, bigint, bigint], boolean>,
  'getAllBuildings' : ActorMethod<[], Array<[string, Building]>>,
  'removeBuilding' : ActorMethod<[string], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
