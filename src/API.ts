import MDS from './MDS';

export async function getTime(serial: string) {
  const { Content } = await MDS.get(serial, '/Time');
  return Content;
}

export async function setTime(serial: string, value: number) {
  await MDS.put(serial, '/Time', { value });
  const time = await getTime(serial);
  return time;
}

export async function getBattery(serial: string) {
  const { Content } = await MDS.get(serial, '/System/Energy/Level');
  return Content;
}
