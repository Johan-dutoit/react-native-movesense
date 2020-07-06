import { Platform } from 'react-native';

import ReactMds from './internal/nativeInterfaces';
import { ErrorCallback, SuccessCallback } from './internal/privateTypes';

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

class MDS {
  private subscriptionKey: number = 0;
  private subscriptionKeys: number[] = [];
  private subscriptionSuccessCallbacks: SuccessCallback[] = [];
  private subscriptionErrorCallbacks: ErrorCallback[] = [];

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
      (notification) => {
        if (notification == null) {
          // is this possible?
          return;
        }

        const notificationString =
          typeof notification === 'string'
            ? notification
            : JSON.stringify(notification);

        const data = JSON.parse(notificationString) as Notification;

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
    this.executeCallback(
      this.subscriptionSuccessCallbacks,
      Number(key),
      notification
    );
  };

  handleNewNotificationError = ({ key, error }: MDSError) => {
    this.executeCallback(this.subscriptionErrorCallbacks, Number(key), error);
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

  get = (
    serial: string,
    uri: string,
    contract: any,
    successCallback: SuccessCallback,
    errorCallback: ErrorCallback
  ) => {
    this.gaurd(serial, uri, contract, successCallback, errorCallback);

    if (Platform.OS === 'android') {
      ReactMds.get(
        `${URI_PROTOCOL}${serial}${uri}`,
        JSON.stringify(contract),
        successCallback,
        errorCallback
      );
    } else {
      ReactMds.get(
        `${URI_PROTOCOL}${serial}${uri}`,
        contract,
        (_, r) => successCallback(r),
        (_, r) => errorCallback(r)
      );
    }
    return true;
  };

  put = (
    serial: string,
    uri: string,
    contract: any,
    successCallback: SuccessCallback,
    errorCallback: ErrorCallback
  ) => {
    this.gaurd(serial, uri, contract, successCallback, errorCallback);

    //! TODO: keep an eye
    // This seems the opposite to get

    if (Platform.OS === 'android') {
      ReactMds.put(
        `${URI_PROTOCOL}${serial}${uri}`,
        JSON.stringify(contract),
        (_, r) => successCallback(r),
        (_, r) => errorCallback(r)
      );
    } else {
      ReactMds.put(
        `${URI_PROTOCOL}${serial}${uri}`,
        contract,
        successCallback,
        errorCallback
      );
    }
  };

  post = (
    serial: string,
    uri: string,
    contract: any,
    successCallback: SuccessCallback,
    errorCallback: ErrorCallback
  ) => {
    this.gaurd(serial, uri, contract, successCallback, errorCallback);

    if (Platform.OS === 'android') {
      ReactMds.post(
        `${URI_PROTOCOL}${serial}${uri}`,
        JSON.stringify(contract),
        successCallback,
        errorCallback
      );
    } else {
      ReactMds.post(
        `${URI_PROTOCOL}${serial}${uri}`,
        contract,
        successCallback,
        errorCallback
      );
    }
  };

  delete = (
    serial: string,
    uri: string,
    contract: any,
    successCallback: SuccessCallback,
    errorCallback: ErrorCallback
  ) => {
    this.gaurd(serial, uri, contract, successCallback, errorCallback);

    if (Platform.OS === 'android') {
      ReactMds.delete(
        `${URI_PROTOCOL}${serial}${uri}`,
        JSON.stringify(contract),
        successCallback,
        errorCallback
      );
    } else {
      ReactMds.delete(
        `${URI_PROTOCOL}${serial}${uri}`,
        contract,
        successCallback,
        errorCallback
      );
    }
  };

  subscribe = (
    serial: string,
    uri: string,
    contract: any,
    successCallback: SuccessCallback,
    errorCallback: ErrorCallback
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

  private gaurd = (
    serial: string,
    uri: string,
    contract: any,
    successCallback: SuccessCallback,
    errorCallback: ErrorCallback
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

  private executeCallback = (
    callbacks: SuccessCallback[] | ErrorCallback[],
    key: number,
    notification: string | undefined
  ) => {
    if (callbacks == null || callbacks.length === 0) {
      return false;
    }

    const id = this.subscriptionKeys.indexOf(key);
    if (id === -1) {
      return false;
    }

    const callback = callbacks[id];
    if (callback != null) {
      callback(notification);
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
}

export default new MDS();
