import movesense from '../src/MDS';
import ReactMds from '../src/internal/nativeInterfaces';

jest.mock('react-native', () => {
  return {
    Platform: {
      OS: 'android',
    },
    NativeEventEmitter: jest.fn(),
  };
});

jest.mock('../src/internal/nativeInterfaces', () => {
  return {
    default: {
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
      scan: jest.fn(),
      stopScan: jest.fn(),
      connect: jest.fn(),
      disconnect: jest.fn(),
      eventEmitter: {
        addListener: jest.fn(),
        removeAllListeners: jest.fn(),
      },
    },
  };
});

describe('movesense tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('handles scans', () => {
    const scanHandler = jest.fn();
    movesense.scan(scanHandler);

    expect(ReactMds.eventEmitter.addListener).toBeCalledTimes(1);
    expect(ReactMds.scan).toBeCalledTimes(1);
  });

  it('handles the stopping of scans', () => {
    const scanHandler = jest.fn();
    movesense.scan(scanHandler);

    expect(ReactMds.eventEmitter.addListener).toBeCalledTimes(1);
    expect(ReactMds.scan).toBeCalledTimes(1);

    movesense.stopScan();

    expect(ReactMds.eventEmitter.removeAllListeners).toBeCalledTimes(1);
    expect(ReactMds.stopScan).toBeCalledTimes(1);
  });

  it('handles subscriptions', () => {
    // expect(true).toBeTruthy();

    const successCb = jest.fn(() => {});
    const errorCb = jest.fn(() => {});

    const subKey = movesense.subscribe('test', 'test', {}, successCb, errorCb);
    expect(subKey).toBe(1);
    expect(successCb).toHaveBeenCalledTimes(0);
    expect(errorCb).toHaveBeenCalledTimes(0);
    expect(ReactMds.subscribe).toBeCalledTimes(1);
    expect(ReactMds.eventEmitter.addListener).toBeCalledTimes(2);

    expect(movesense.unsubscribe(123)).toBeFalsy();
    expect(movesense.unsubscribe(subKey)).toBeTruthy();
    expect(ReactMds.unsubscribe).toBeCalledTimes(1);
    expect(ReactMds.eventEmitter.removeAllListeners).toBeCalledTimes(2);
  });

  it('handles callbacks', () => {
    const successCb = jest.fn(() => {});
    const errorCb = jest.fn(() => {});

    const subKey = movesense.subscribe('test', 'test', {}, successCb, errorCb);

    movesense.handleNewNotification({
      key: subKey.toString(),
      notification: 'test',
    });

    movesense.handleNewNotificationError({
      key: subKey.toString(),
      error: 'test',
    });

    expect(successCb).toHaveBeenCalledTimes(1);
    expect(errorCb).toHaveBeenCalledTimes(1);
  });

  it('handles setConnectionHandlers', () => {
    const deviceConnected = jest.fn();
    const deviceDisconnected = jest.fn();

    // @ts-ignore
    movesense.subscribedToConnectedDevices = true;
    movesense.setConnectionHandlers(deviceConnected, deviceDisconnected);

    expect(ReactMds.subscribe).toBeCalledTimes(0);

    // @ts-ignore
    movesense.subscribedToConnectedDevices = false;
    movesense.setConnectionHandlers(deviceConnected, deviceDisconnected);

    expect(ReactMds.subscribe).toBeCalledTimes(1);
  });

  it('handles connect', () => {
    movesense.connect('test');
    expect(ReactMds.connect).toBeCalledTimes(1);
  });

  it('handles disconnect', () => {
    movesense.disconnect('test');
    expect(ReactMds.disconnect).toBeCalledTimes(1);
  });

  it('guards undefined callbacks from being called', () => {
    // @ts-ignore
    expect(movesense.executeCallback(null, 12, 'test')).toBeFalsy();

    // @ts-ignore
    expect(movesense.executeCallback([jest.fn()], 0, 'test')).toBeFalsy();
  });
});
