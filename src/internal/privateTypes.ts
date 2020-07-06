import { SuccessCallback, ErrorCallback } from '../types';

export interface ReactMdsNativeModule {
  scan: () => void;
  stopScan: () => void;
  connect: (address: string) => void;
  disconnect: (address: string) => void;

  get: (
    address: string,
    contract: string,
    successCallback: SuccessCallback,
    errorCallback: ErrorCallback
  ) => void;

  put: (
    address: string,
    contract: string,
    successCallback: SuccessCallback,
    errorCallback: ErrorCallback
  ) => void;

  post: (
    address: string,
    contract: string,
    successCallback: SuccessCallback,
    errorCallback: ErrorCallback
  ) => void;

  delete: (
    address: string,
    contract: string,
    successCallback: SuccessCallback,
    errorCallback: ErrorCallback
  ) => void;

  subscribe: (address: string, contract: string, subsKey: string) => void;
  unsubscribe: (subsKey: string) => void;
}
