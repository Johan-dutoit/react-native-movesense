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
    [key: string]: number | number[] | Axis[] | undefined;
  };
  Uri: string;
  Method: string;
};

export type Callback = (key: string, response: string) => any;
export type MethodCallback = (response: string) => any;

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
export type DeviceConnectFailedHandler = (error: string) => void;

export type Request<T> = {
  value: T;
};
export type ContentResponse<T> = {
  Content: T;
};

export type UriTypes =
  | '/Comm/Ble'
  | '/Comm/Ble/Addr'
  | '/Comm/Ble/Adv'
  | '/Comm/Ble/Adv/Settings'
  | '/Component/Led'
  | '/Info'
  | '/Meas/Acc'
  | '/Meas/Acc/Config'
  | '/Meas/Acc/Info'
  | '/Meas/Acc/13'
  | '/Meas/Acc/26'
  | '/Meas/Acc/52'
  | '/Meas/Acc/104'
  | '/Meas/Acc/208'
  | '/Meas/Acc/416'
  | '/Meas/Acc/833'
  | '/Meas/Acc/1666'
  | '/Meas/ECG/128'
  | '/Meas/ECG/256'
  | '/Meas/ECG/512'
  | '/Meas/Gyro'
  | '/Meas/Gyro/Info'
  | '/Meas/Gyro/Config'
  | '/Meas/Gyro/13'
  | '/Meas/Gyro/26'
  | '/Meas/Gyro/52'
  | '/Meas/Gyro/104'
  | '/Meas/Gyro/208'
  | '/Meas/Gyro/416'
  | '/Meas/Gyro/833'
  | '/Meas/Gyro/1666'
  | '/Meas/HR'
  | '/Meas/Magn'
  | '/Meas/Magn/Info'
  | '/Meas/Magn/Config'
  | '/Meas/Magn/13'
  | '/Meas/Magn/26'
  | '/Meas/Magn/52'
  | '/Meas/Magn/104'
  | '/Meas/Magn/208'
  | '/Meas/Magn/416'
  | '/Meas/Magn/833'
  | '/Meas/Magn/1666'
  | '/Meas/Temp'
  | '/Meas/Temp/Info'
  | '/Mem/DataLogger/Config'
  | '/Mem/DataLogger/State'
  | '/Mem/Logbook'
  | '/Mem/Logbook/Entries'
  | '/Mem/Logbook/IsFull'
  | '/Mem/Logbook/IsOpen'
  | '/Mem/Logbook/Log'
  | '/Mem/Logbook/Logging'
  | '/Mem/Logbook/UnsynchronisedLogs'
  | '/Misc/Gear/Id'
  | '/Misc/Manufacturing/CalibrationData'
  | '/Misc/Manufacturing/ProductData'
  | '/System/Energy/Level'
  | '/System/Mode'
  | '/System/Settings/UartOn'
  | '/System/Settings/PowerOffAfterReset'
  | '/Time'
  | 'MDS/ConnectedDevices';
