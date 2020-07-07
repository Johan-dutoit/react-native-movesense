import { TimeResponse } from './types';
import MDS from './MDS';

export async function getTime(serial: string) {
  const time = await MDS.get<null, TimeResponse>(serial, '/Time');
  return time;
}

export async function setTime(serial: string, value: number) {
  const time = await MDS.put(serial, '/Time', { value });
  return time;
}

export async function getBattery(serial: string) {
  const batt = await MDS.get(serial, '/System/Energy/Level');
  return batt;
}
