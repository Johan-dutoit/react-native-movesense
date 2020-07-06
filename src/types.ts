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

export type Callback = (key: string, response: string) => any;

export type NewScannedDeviceCallbackProps = {
  name: string;
  address: string;
};

export type MDSEvent = {
  key: string;
  notification: string;
};

export type MDSError = {
  key: string;
  error: string;
};

export type ScanHandler = (name: string, address: string) => void;
export type DeviceConnectedHandler = (serial: string) => void;
