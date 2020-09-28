## Getting started
Install packages
```
npm install
```

## Run on Android device
This will run the app on the connected device or the emulator (if no device is connected)
```
react-native run-android
```

## List Android devices connected
```
adb devices
```

## Run on iOS device
Install CocoaPods
```
sudo gem install cocoapods
```

Install packages using CocoaPods
```
cd ios && pod install
```

To run locally:
```
react-native run-ios
```

To run on connected device:
* Open Xcode
* Click on Product > Destination > Connected Device Name
* Click on Run to build and install the app on the device

## Known Issues
* Missing Jetifier
    * ``` npm install jetifier --save ```