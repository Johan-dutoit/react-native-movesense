function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { NativeEventEmitter } from 'react-native';
import ReactMds from './nativeModule'; // Produce an error if we don't have the native module

if (!ReactMds) {
  throw new Error('ReactMds has not linked successfull');
}
/**
 * We export the native interface in this way to give easy shared access to it between the
 * JavaScript code and the tests
 */


let nativeEventEmitter = null;
export default _objectSpread(_objectSpread({}, ReactMds), {}, {
  get eventEmitter() {
    if (!nativeEventEmitter) {
      /// @ts-ignore
      nativeEventEmitter = new NativeEventEmitter(ReactMds);
    } /// @ts-ignore


    return nativeEventEmitter;
  }

});
//# sourceMappingURL=nativeInterfaces.js.map