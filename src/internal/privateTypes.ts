import { Callback } from '../types';

export interface ReactMdsNativeModule {
  scan: () => void;
  stopScan: () => void;
  connect: (address: string) => void;
  disconnect: (address: string) => void;

  get: (
    address: string,
    contract: string,
    successCallback: Callback,
    errorCallback: Callback
  ) => void;

  put: (
    address: string,
    contract: string,
    successCallback: Callback,
    errorCallback: Callback
  ) => void;

  post: (
    address: string,
    contract: string,
    successCallback: Callback,
    errorCallback: Callback
  ) => void;

  delete: (
    address: string,
    contract: string,
    successCallback: Callback,
    errorCallback: Callback
  ) => void;

  subscribe: (address: string, contract: string, subsKey: string) => void;
  unsubscribe: (subsKey: string) => void;
}
