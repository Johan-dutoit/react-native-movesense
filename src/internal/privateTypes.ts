export type Axis = {
  x: number;
  y: number;
  z: number;
};

export type Sample = {
  Body: {
    Timestamp: number;
    average?: number;
    Samples?: number[];
    Measurement?: number;
    ArrayAcc?: Axis[];
    ArrayGyro?: Axis[];
    ArrayMagn?: Axis[];
  };
  Uri: string;
  Method: string;
};

export type SuccessCallback = (
  errorOrResponse?: Sample | string,
  response?: string
) => any;
export type ErrorCallback = (
  errorOrResponse?: string,
  response?: string
) => any;

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
