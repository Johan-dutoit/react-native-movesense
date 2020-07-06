import { TimeResponse } from './types';
import MDS from './MDS';

const URI_TIME = '/time';

export function getTime(serial: string) {
  return new Promise<TimeResponse>((resolve, reject) => {
    if (serial == null) {
      reject('Serial is missing');
    }

    MDS.get(
      serial,
      URI_TIME,
      {},
      (res) => {
        var jsonRes = JSON.parse(res) as TimeResponse;
        resolve(jsonRes);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

export function setTime(serial: string, value: number) {
  return new Promise<TimeResponse>((resolve, reject) => {
    if (serial == null) {
      reject('Serial is missing');
    }

    if (value == null || value < 0) {
      reject('Value is invalid');
    }

    MDS.put(
      serial,
      URI_TIME,
      {
        value,
      },
      async () => {
        const time = await getTime(serial);
        resolve(time);
      },
      (err) => {
        reject(err);
      }
    );
  });
}
