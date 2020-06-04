"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactNative = require("react-native");

var _nativeInterfaces = _interopRequireDefault(require("./internal/nativeInterfaces"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const URI_PREFIX = 'suunto://';
const NEW_SCANNED_DEVICE = 'newScannedDevice';
const NEW_NOTIFICATION = 'newNotification';
const NEW_NOTIFICATION_ERROR = 'newNotificationError';

class MDS {
  constructor() {
    _defineProperty(this, "subscriptionKey", 0);

    _defineProperty(this, "subscriptionKeys", []);

    _defineProperty(this, "subscriptionSuccessCallbacks", []);

    _defineProperty(this, "subscriptionErrorCallbacks", []);

    _defineProperty(this, "subscribedToConnectedDevices", false);

    _defineProperty(this, "connectedDevicesSubscription", -1);

    _defineProperty(this, "onDeviceConnected", null);

    _defineProperty(this, "onDeviceDisonnected", null);
  }

  getIdxFromKey(key) {
    var idx = -1;

    for (var i = 0; i < this.subscriptionKeys.length; i++) {
      if (this.subscriptionKeys[i] === key) {
        idx = i;
        break;
      }
    }

    return idx;
  }

  subscribeToConnectedDevices() {
    this.subscribedToConnectedDevices = true;
    this.connectedDevicesSubscription = this.subscribe('', 'MDS/ConnectedDevices', {}, notification => {
      if (notification == null) {
        // is this possible?
        return;
      }

      var data = JSON.parse(notification);

      if (data.Method === 'POST') {
        var _data$Body, _data$Body$DeviceInfo, _data$Body2;

        if ((data === null || data === void 0 ? void 0 : (_data$Body = data.Body) === null || _data$Body === void 0 ? void 0 : (_data$Body$DeviceInfo = _data$Body.DeviceInfo) === null || _data$Body$DeviceInfo === void 0 ? void 0 : _data$Body$DeviceInfo.Serial) != null) {
          this.onDeviceConnected && this.onDeviceConnected(data.Body.DeviceInfo.Serial);
        } else if ((data === null || data === void 0 ? void 0 : (_data$Body2 = data.Body) === null || _data$Body2 === void 0 ? void 0 : _data$Body2.Serial) != null) {
          this.onDeviceConnected && this.onDeviceConnected(data.Body.Serial);
        }
      } else if (data.Method === 'DEL') {
        var _data$Body3;

        if ((data === null || data === void 0 ? void 0 : (_data$Body3 = data.Body) === null || _data$Body3 === void 0 ? void 0 : _data$Body3.Serial) != null) {
          this.onDeviceDisonnected && this.onDeviceDisonnected(data.Body.Serial);
        }
      }
    }, error => {
      console.log('MDS subscribe error', error);
      this.unsubscribe(this.connectedDevicesSubscription);
      this.subscribedToConnectedDevices = false;
    });
  }

  scan(scanHandler) {
    _nativeInterfaces.default.eventEmitter.addListener(NEW_SCANNED_DEVICE, ({
      name,
      address
    }) => {
      scanHandler(name, address);
    });

    _nativeInterfaces.default.eventEmitter.addListener(NEW_NOTIFICATION, this.handleNewNotification);

    _nativeInterfaces.default.eventEmitter.addListener(NEW_NOTIFICATION_ERROR, this.handleNewNotificationError);

    _nativeInterfaces.default.scan();
  }

  handleNewNotification(e) {
    this.subscriptionSuccessCallbacks[this.getIdxFromKey(e.key)](e.notification);
  }

  handleNewNotificationError(e) {
    this.subscriptionErrorCallbacks[this.getIdxFromKey(e.key)](e.notification);
  }

  stopScan() {
    _nativeInterfaces.default.eventEmitter.removeAllListeners(NEW_SCANNED_DEVICE);

    _nativeInterfaces.default.eventEmitter.removeAllListeners(NEW_NOTIFICATION);

    _nativeInterfaces.default.eventEmitter.removeAllListeners(NEW_NOTIFICATION_ERROR);

    _nativeInterfaces.default.stopScan();
  }

  setHandlers(deviceConnected, deviceDisconnected) {
    this.onDeviceConnected = deviceConnected;
    this.onDeviceDisonnected = deviceDisconnected;

    if (!this.subscribedToConnectedDevices) {
      this.subscribedToConnectedDevices = true;
      this.subscribeToConnectedDevices();
    }
  }

  connect(address) {
    _nativeInterfaces.default.connect(address);
  }

  disconnect(address) {
    _nativeInterfaces.default.disconnect(address);
  }

  get(serial, uri, contract, successCallback, errorCallback) {
    this.gaurd(serial, uri, contract, successCallback, errorCallback);

    if (_reactNative.Platform.OS === 'android') {
      _nativeInterfaces.default.get(URI_PREFIX + serial + uri, JSON.stringify(contract), successCallback, errorCallback);
    } else {
      _nativeInterfaces.default.get(URI_PREFIX + serial + uri, contract, (_, r) => successCallback(r), (_, r) => errorCallback(r));
    }

    return true;
  }

  put(serial, uri, contract, successCallback, errorCallback) {
    this.gaurd(serial, uri, contract, successCallback, errorCallback); //! TODO: keep an eye
    // This seems the opposite to get

    if (_reactNative.Platform.OS === 'android') {
      _nativeInterfaces.default.put(URI_PREFIX + serial + uri, JSON.stringify(contract), (_, r) => successCallback(r), (_, r) => errorCallback(r));
    } else {
      _nativeInterfaces.default.put(URI_PREFIX + serial + uri, contract, successCallback, errorCallback);
    }
  }

  post(serial, uri, contract, successCallback, errorCallback) {
    this.gaurd(serial, uri, contract, successCallback, errorCallback);

    if (_reactNative.Platform.OS === 'android') {
      _nativeInterfaces.default.post(URI_PREFIX + serial + uri, JSON.stringify(contract), successCallback, errorCallback);
    } else {
      _nativeInterfaces.default.post(URI_PREFIX + serial + uri, contract, successCallback, errorCallback);
    }
  }

  delete(serial, uri, contract, successCallback, errorCallback) {
    this.gaurd(serial, uri, contract, successCallback, errorCallback);

    if (_reactNative.Platform.OS === 'android') {
      _nativeInterfaces.default.delete(URI_PREFIX + serial + uri, JSON.stringify(contract), successCallback, errorCallback);
    } else {
      _nativeInterfaces.default.delete(URI_PREFIX + serial + uri, contract, successCallback, errorCallback);
    }
  }

  subscribe(serial, uri, contract, successCallback, errorCallback) {
    this.gaurd(serial, uri, contract, successCallback, errorCallback);
    this.subscriptionKey++;
    this.subscriptionKeys.push(this.subscriptionKey);
    this.subscriptionSuccessCallbacks.push(successCallback);
    this.subscriptionErrorCallbacks.push(errorCallback);
    const subscriptionKeyStr = this.subscriptionKey.toString();

    if (_reactNative.Platform.OS === 'android') {
      contract.Uri = serial + uri;

      _nativeInterfaces.default.subscribe('suunto://MDS/EventListener', JSON.stringify(contract), subscriptionKeyStr);
    } else {
      _nativeInterfaces.default.subscribe(URI_PREFIX + serial + uri, contract, subscriptionKeyStr);
    }

    return this.subscriptionKey;
  }

  unsubscribe(key) {
    var idx = this.subscriptionKeys.indexOf(key);

    if (idx === -1) {
      return false;
    }

    _nativeInterfaces.default.unsubscribe(key.toString());

    this.subscriptionKeys.splice(idx, 0);
    this.subscriptionSuccessCallbacks.splice(idx, 0);
    this.subscriptionErrorCallbacks.splice(idx, 0);
    return true;
  }

  gaurd(serial, uri, contract, successCallback, errorCallback) {
    if (serial == null || uri == null || contract == null || successCallback == null || errorCallback == null) {
      throw new Error('Arguments missing');
    }
  }

}

var _default = new MDS();

exports.default = _default;
//# sourceMappingURL=MDS.js.map