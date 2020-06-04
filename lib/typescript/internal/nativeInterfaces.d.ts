import { NativeEventEmitter } from 'react-native';
declare const _default: {
    eventEmitter: NativeEventEmitter;
    /**
     * We export the native interface in this way to give easy shared access to it between the
     * JavaScript code and the tests
     */
    scan: () => void;
    stopScan: () => void;
    connect: (address: string) => void;
    disconnect: (address: string) => void;
    get: (address: string, contract: string, successCallback: import("./privateTypes").SuccessCallback, errorCallback: import("./privateTypes").ErrorCallback) => void;
    put: (address: string, contract: string, successCallback: import("./privateTypes").SuccessCallback, errorCallback: import("./privateTypes").ErrorCallback) => void;
    post: (address: string, contract: string, successCallback: import("./privateTypes").SuccessCallback, errorCallback: import("./privateTypes").ErrorCallback) => void;
    delete: (address: string, contract: string, successCallback: import("./privateTypes").SuccessCallback, errorCallback: import("./privateTypes").ErrorCallback) => void;
    subscribe: (address: string, contract: string, subsKey: string) => void;
    unsubscribe: (subsKey: string) => void;
};
export default _default;
