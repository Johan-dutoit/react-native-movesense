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
