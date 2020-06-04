import { ErrorCallback, SuccessCallback } from './internal/privateTypes';
export declare type Notification = {
    Method: 'POST' | 'DEL';
    Body?: {
        Serial: any;
        DeviceInfo?: {
            Serial: any;
        };
    };
};
export declare type MDSEvent = {
    key: number;
    name: string;
    address: string;
    notification: string;
};
export declare type ScanHandler = (name: string, address: string) => void;
export declare type DeviceConnectedHandler = (serial: string) => void;
declare class MDS {
    private subscriptionKey;
    private subscriptionKeys;
    private subscriptionSuccessCallbacks;
    private subscriptionErrorCallbacks;
    private subscribedToConnectedDevices;
    private connectedDevicesSubscription;
    private onDeviceConnected;
    private onDeviceDisonnected;
    getIdxFromKey(key: number): number;
    subscribeToConnectedDevices(): void;
    scan(scanHandler: ScanHandler): void;
    handleNewNotification(e: MDSEvent): void;
    handleNewNotificationError(e: MDSEvent): void;
    stopScan(): void;
    setHandlers(deviceConnected: DeviceConnectedHandler, deviceDisconnected: DeviceConnectedHandler): void;
    connect(address: string): void;
    disconnect(address: string): void;
    get(serial: string, uri: string, contract: any, successCallback: SuccessCallback, errorCallback: ErrorCallback): boolean;
    put(serial: string, uri: string, contract: any, successCallback: SuccessCallback, errorCallback: ErrorCallback): void;
    post(serial: string, uri: string, contract: any, successCallback: SuccessCallback, errorCallback: ErrorCallback): void;
    delete(serial: string, uri: string, contract: any, successCallback: SuccessCallback, errorCallback: ErrorCallback): void;
    subscribe(serial: string, uri: string, contract: any, successCallback: SuccessCallback, errorCallback: ErrorCallback): number;
    unsubscribe(key: number): boolean;
    gaurd(serial: string, uri: string, contract: any, successCallback: SuccessCallback, errorCallback: ErrorCallback): void;
}
declare const _default: MDS;
export default _default;
