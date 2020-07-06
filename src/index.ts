export { default } from './MDS';

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
