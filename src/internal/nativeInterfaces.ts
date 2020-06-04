import { NativeEventEmitter } from 'react-native';
import ReactMds from './nativeModule';

// Produce an error if we don't have the native module
if (!ReactMds) {
  throw new Error('ReactMds has not linked successfull');
}

/**
 * We export the native interface in this way to give easy shared access to it between the
 * JavaScript code and the tests
 */
let nativeEventEmitter: NativeEventEmitter | null = null;
export default {
  ...ReactMds,
  get eventEmitter(): NativeEventEmitter {
    if (!nativeEventEmitter) {
      /// @ts-ignore
      nativeEventEmitter = new NativeEventEmitter(ReactMds);
    }
    /// @ts-ignore
    return nativeEventEmitter;
  },
};
