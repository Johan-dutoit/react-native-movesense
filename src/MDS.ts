import { Platform } from 'react-native';

import ReactMds from './internal/nativeInterfaces';
import {
  Callback,
  DeviceConnectedHandler,
  MDSError,
  MDSEvent,
  NewScannedDeviceCallbackProps,
  ScanHandler,
  MethodCallback,
  UriTypes,
} from './types';

const URI_PROTOCOL = 'suunto://';
const NEW_SCANNED_DEVICE = 'newScannedDevice';
const NEW_NOTIFICATION = 'newNotification';
const NEW_NOTIFICATION_ERROR = 'newNotificationError';

export type Notification = {
  Method: 'POST' | 'DEL';
  Body?: {
    Serial: any;
    DeviceInfo?: {
      Serial: any;
    };
  };
};

class MDS {
  private subscriptionKey: number = 0;
  private subscriptionKeys: number[] = [];
  private subscriptionSuccessCallbacks: Callback[] = [];
  private subscriptionErrorCallbacks: Callback[] = [];

  private subscribedToConnectedDevices = false;
  private connectedDevicesSubscription = -1;

  private onDeviceConnected: DeviceConnectedHandler | null = null;
  private onDeviceDisonnected: DeviceConnectedHandler | null = null;

  subscribeToConnectedDevices = () => {
    this.subscribedToConnectedDevices = true;
    this.connectedDevicesSubscription = this.subscribe(
      '',
      'MDS/ConnectedDevices',
      {},
      (key, notification) => {
        if (notification == null) {
          // is this possible?
          return;
        }

        const data = JSON.parse(notification) as Notification;

        if (data.Method === 'POST') {
          if (data?.Body?.DeviceInfo?.Serial != null) {
            this.onDeviceConnected &&
              this.onDeviceConnected(data.Body.DeviceInfo.Serial);
          } else if (data?.Body?.Serial != null) {
            this.onDeviceConnected && this.onDeviceConnected(data.Body.Serial);
          }
        } else if (data.Method === 'DEL') {
          if (data?.Body?.Serial != null) {
            this.onDeviceDisonnected &&
              this.onDeviceDisonnected(data.Body.Serial);
          }
        }
      },
      (error) => {
        console.log('MDS subscribe error', error);
        this.unsubscribe(this.connectedDevicesSubscription);
        this.subscribedToConnectedDevices = false;
      }
    );
  };

  scan = (scanHandler: ScanHandler) => {
    ReactMds.eventEmitter.addListener(
      NEW_SCANNED_DEVICE,
      ({ name, address }: NewScannedDeviceCallbackProps) => {
        scanHandler(name, address);
      }
    );

    ReactMds.scan();
  };

  handleNewNotification = ({ key, notification }: MDSEvent) => {
    this.executeCallback(this.subscriptionSuccessCallbacks, key, notification);
  };

  handleNewNotificationError = ({ key, error }: MDSError) => {
    this.executeCallback(this.subscriptionErrorCallbacks, key, error);
  };

  stopScan = () => {
    ReactMds.eventEmitter.removeAllListeners(NEW_SCANNED_DEVICE);

    ReactMds.stopScan();
  };

  setConnectionHandlers = (
    deviceConnected: DeviceConnectedHandler,
    deviceDisconnected: DeviceConnectedHandler
  ) => {
    this.onDeviceConnected = deviceConnected;
    this.onDeviceDisonnected = deviceDisconnected;
    if (!this.subscribedToConnectedDevices) {
      this.subscribedToConnectedDevices = true;
      this.subscribeToConnectedDevices();
    }
  };

  connect = (address: string) => {
    ReactMds.connect(address);
  };

  disconnect = (address: string) => {
    ReactMds.disconnect(address);
  };

  get<TRequest, TResponse>(
    serial: string,
    uri: UriTypes,
    contract?: TRequest
  ): Promise<TResponse> {
    return new Promise((resolve, reject) => {
      const invalid = this.newGaurd(serial, uri, contract);
      if (invalid != null) {
        reject(invalid);
        return;
      }

      if (Platform.OS === 'android') {
        ReactMds.get(
          `${URI_PROTOCOL}${serial}${uri}`,
          JSON.stringify(contract),
          (r) => this.resolveHandler(resolve, r),
          (r) => this.rejectHandler(reject, r)
        );
      } else {
        ReactMds.get(
          `${URI_PROTOCOL}${serial}${uri}`,
          contract,
          (_, r) => this.resolveHandler(resolve, r),
          (_, r) => this.rejectHandler(reject, r)
        );
      }
    });
  }

  put<TRequest, TResponse>(
    serial: string,
    uri: UriTypes,
    contract: TRequest
  ): Promise<TResponse> {
    return new Promise((resolve, reject) => {
      const invalid = this.newGaurd(serial, uri, contract);
      if (invalid != null) {
        reject(invalid);
        return;
      }

      if (Platform.OS === 'android') {
        ReactMds.put(
          `${URI_PROTOCOL}${serial}${uri}`,
          JSON.stringify(contract),
          (_, r) => this.resolveHandler(resolve, r),
          (_, r) => this.rejectHandler(reject, r)
        );
      } else {
        ReactMds.put(
          `${URI_PROTOCOL}${serial}${uri}`,
          contract,
          (r) => this.resolveHandler(resolve, r),
          (r) => this.rejectHandler(reject, r)
        );
      }
    });
  }

  post<TRequest, TResponse>(
    serial: string,
    uri: UriTypes,
    contract: TRequest
  ): Promise<TResponse> {
    return new Promise((resolve, reject) => {
      const invalid = this.newGaurd(serial, uri, contract);
      if (invalid != null) {
        reject(invalid);
        return;
      }

      if (Platform.OS === 'android') {
        ReactMds.post(
          `${URI_PROTOCOL}${serial}${uri}`,
          JSON.stringify(contract),
          (r) => this.resolveHandler(resolve, r),
          (r) => this.rejectHandler(reject, r)
        );
      } else {
        ReactMds.post(
          `${URI_PROTOCOL}${serial}${uri}`,
          contract,
          (r) => this.resolveHandler(resolve, r),
          (r) => this.rejectHandler(reject, r)
        );
      }
    });
  }

  delete<TRequest, TResponse>(
    serial: string,
    uri: UriTypes,
    contract: TRequest
  ): Promise<TResponse> {
    return new Promise((resolve, reject) => {
      const invalid = this.newGaurd(serial, uri, contract);
      if (invalid != null) {
        reject(invalid);
        return;
      }

      if (Platform.OS === 'android') {
        ReactMds.delete(
          `${URI_PROTOCOL}${serial}${uri}`,
          JSON.stringify(contract),
          (r) => this.resolveHandler(resolve, r),
          (r) => this.rejectHandler(reject, r)
        );
      } else {
        ReactMds.delete(
          `${URI_PROTOCOL}${serial}${uri}`,
          contract,
          (r) => this.resolveHandler(resolve, r),
          (r) => this.rejectHandler(reject, r)
        );
      }
    });
  }

  subscribe = (
    serial: string,
    uri: UriTypes,
    contract: any,
    successCallback: Callback,
    errorCallback: Callback
  ) => {
    this.gaurd(serial, uri, contract, successCallback, errorCallback);

    if (this.subscriptionKeys.length === 0) {
      this.setNotificationHandlers();
    }

    this.subscriptionKey++;
    this.subscriptionKeys.push(this.subscriptionKey);
    this.subscriptionSuccessCallbacks.push(successCallback);
    this.subscriptionErrorCallbacks.push(errorCallback);

    const subscriptionKeyStr = this.subscriptionKey.toString();

    if (Platform.OS === 'android') {
      contract.Uri = serial + uri;
      ReactMds.subscribe(
        'suunto://MDS/EventListener',
        JSON.stringify(contract),
        subscriptionKeyStr
      );
    } else {
      ReactMds.subscribe(
        `${URI_PROTOCOL}${serial}${uri}`,
        contract,
        subscriptionKeyStr
      );
    }

    return this.subscriptionKey;
  };

  unsubscribe = (key: number) => {
    var index = this.subscriptionKeys.indexOf(key);
    if (index === -1) {
      return false;
    }

    ReactMds.unsubscribe(key.toString());
    this.subscriptionKeys.splice(index, 1);
    this.subscriptionSuccessCallbacks.splice(index, 1);
    this.subscriptionErrorCallbacks.splice(index, 1);

    if (this.subscriptionKeys.length === 0) {
      this.removeNotificationHandlers();
    }

    return true;
  };

  private resolveHandler<TResponse>(
    resolve: (response: TResponse) => void,
    response: string
  ) {
    const json = JSON.parse(response) as TResponse;
    resolve(json);
  }

  private rejectHandler(reject: (response: string) => void, response: string) {
    reject(response);
  }

  private executeCallback = (
    callbacks: Callback[],
    key: string,
    notification: string
  ) => {
    if (callbacks == null || callbacks.length === 0) {
      return false;
    }

    const id = this.subscriptionKeys.indexOf(Number(key));
    if (id === -1) {
      return false;
    }

    const callback = callbacks[id];
    if (callback != null) {
      callback(key, notification);
      return true;
    }

    return false;
  };

  private setNotificationHandlers = () => {
    ReactMds.eventEmitter.addListener(
      NEW_NOTIFICATION,
      this.handleNewNotification
    );
    ReactMds.eventEmitter.addListener(
      NEW_NOTIFICATION_ERROR,
      this.handleNewNotificationError
    );
  };

  private removeNotificationHandlers = () => {
    ReactMds.eventEmitter.removeAllListeners(NEW_NOTIFICATION);
    ReactMds.eventEmitter.removeAllListeners(NEW_NOTIFICATION_ERROR);
  };

  private newGaurd(serial: string, uri: string, contract?: any) {
    if (serial == null) {
      return 'Serial is invalid';
    } else if (uri == null) {
      return 'Uri is invalid';
    } else if (typeof contract !== 'undefined' && contract == null) {
      return 'Contact is invalid';
    }

    return null;
  }

  private gaurd = (
    serial: string,
    uri: string,
    contract: any,
    successCallback: Callback | MethodCallback,
    errorCallback: Callback | MethodCallback
  ) => {
    if (
      serial == null ||
      uri == null ||
      contract == null ||
      successCallback == null ||
      errorCallback == null
    ) {
      throw new Error('Arguments missing');
    }
  };
}

export default new MDS();
