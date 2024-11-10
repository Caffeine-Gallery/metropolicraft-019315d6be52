import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Building {
  'cost' : bigint,
  'position' : [bigint, bigint],
  'buildingType' : string,
  'orientation' : string,
}
export interface Car { 'direction' : string, 'position' : [bigint, bigint] }
export interface Street { 'direction' : string, 'position' : [bigint, bigint] }
export interface _SERVICE {
  'addBuilding' : ActorMethod<
    [string, string, bigint, bigint, string],
    boolean
  >,
  'getAllBuildings' : ActorMethod<[], Array<[string, Building]>>,
  'getCarPosition' : ActorMethod<[], Car>,
  'getStreets' : ActorMethod<[], Array<Street>>,
  'initializeStreets' : ActorMethod<[], undefined>,
  'removeBuilding' : ActorMethod<[string], boolean>,
  'updateCarPosition' : ActorMethod<[bigint, bigint, string], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
