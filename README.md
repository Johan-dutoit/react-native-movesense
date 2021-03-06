# react-native-movesense

## Getting started

`yarn add react-native-movesense`

then

`cd ios && pod install`

### Additional steps

#### iOS

1. Intall Movesense iOS library using CocoaPods by adding this line to your app's Podfile:

```
pod 'Movesense', :git => 'ssh://git@altssh.bitbucket.org:443/suunto/movesense-mobile-lib.git'
```

2. Add 'libmds.a' from Movesense pod to your list of linked libraries. You may need to also add library search path for it.

#### Android

1. Download 'mdslib-x.x.x-release.aar' from movesense-mobile-lib repository and put it somewhere under 'android' folder of your app. Preferably create a new folder named 'android/libs' and put it there. Minimum supported version is 1.6.0.

2. In 'build.gradle' of your android project, add the following lines (assuming .aar file is in android/libs):

```
allprojects {
    repositories {
        ...
        flatDir{
            dirs "$rootDir/libs"
        }
    }
}
```

### Troubleshoot

#### Android

1. 'minSdkVersion' needs to be at least 18.

#### iOS

1. You may need to set "Swift Language Version" for Movesense Pod to 5.0. This setting can be found in "Build Settings" of Movesense pod in XCode project of your app.

2. If you get the following error while building your app:

```
ld: library not found for -lswiftSwiftOnoneSupport for architecture arm64
```

then you need to add library search path for that library. One of the common places is:

```
-L/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/lib/swift/iphoneos
```

However, the correct answer may depend on XCode version.

3. Movesense library doesn't have bitcode support at the moment. You need to disable it for your app as well.

## Usage

```javascript
import movesense from 'react-native-movesense';

// Scan for bluetooth devices
movesense.scan((name, address) => {
  this.scanHandler(name, address);
});

// Stop scanning
movesense.stopScan();

// Set handlers
movesense.setConnectionHandlers(
  (serial) => {
    this.deviceConnected(serial);
  },
  (serial) => {
    this.deviceDisconnected(serial);
  },
  () => {
    this.deviceConnectFailed();
  }
);

// Connect to a device using address
movesense.connect(address);

// Disconnect from a device using address
movesense.disconnect(address);

// Get a resource
const response = await movesense.get(serial, resource, contract);

// Put a resource
const response = await movesense.put(serial, resource, contract);

// Post a resource
const response = await movesense.post(serial, resource, contract);

// Del a resource
const response = await movesense.del(serial, resource, contract);

// Subscribes to movesense notifications
movesense.setNotificationHandlers();

// Subscribe to a resource
var key = movesense.subscribe(
  serial,
  resource,
  contract,
  (notification) => {
    this.onResponse(notification);
  },
  (error) => {
    this.onError(error);
  }
);

// Unsubscribe from a subsciption
movesense.unsubscribe(key);

// Remove native event handlers (generally called once you're done with everything - i.e. no longer subscribed to events)
movesense.removeNotificationHandlers();
```
