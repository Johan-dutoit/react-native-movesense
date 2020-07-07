import { Callback } from '../types';

export interface ReactMdsNativeModule {
  scan: () => void;
  stopScan: () => void;
  connect: (address: string) => void;
  disconnect: (address: string) => void;

  get: (
    address: string,
    contract: any,
    successCallback: Callback,
    errorCallback: Callback
  ) => void;

  put: (
    address: string,
    contract: any,
    successCallback: Callback,
    errorCallback: Callback
  ) => void;

  post: (
    address: string,
    contract: any,
    successCallback: Callback,
    errorCallback: Callback
  ) => void;

  delete: (
    address: string,
    contract: any,
    successCallback: Callback,
    errorCallback: Callback
  ) => void;

  subscribe: (address: string, contract: any, subsKey: string) => void;
  unsubscribe: (subsKey: string) => void;
}
