/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  StatusBar,
  PermissionsAndroid,
  NativeModules, 
  NativeEventEmitter
} from 'react-native';

import { bytesToString } from "convert-string";

// import { BleManager } from 'react-native-ble-plx';
import BleManager from 'react-native-ble-manager';
 


class App extends React.Component {

  constructor() {
    super();
    // this.manager = new BleManager();

    this.BleManagerModule = NativeModules.BleManager;
    this.bleManagerEmitter = new NativeEventEmitter(this.BleManagerModule);
  }

  componentDidMount() {
    
    // this.connectAndPrepare("D8:A0:1D:6A:83:DE", "6e400001-b5a3-f393-e0a9-e50e24dcca9e", "6e400003-b5a3-f393-e0a9-e50e24dcca9e");

    // const subscription = this.manager.onStateChange((state) => {
    //     if (state === 'PoweredOn') {
    //         console.log(state);
    //         this.scanAndConnect();
    //         subscription.remove();
    //     }
    // }, true);

    this.connect();

  }

  // async connectAndPrepare(peripheral, service, characteristic) {
  //   // Connect to device
  //   await BleManager.connect(peripheral);
  //   console.log("connected");
  //   // Before startNotification you need to call retrieveServices
  //   await BleManager.retrieveServices(peripheral);
  //   console.log("retrieving services");
  //   // To enable BleManagerDidUpdateValueForCharacteristic listener
  //   await BleManager.startNotification(peripheral, service, characteristic);
  //   console.log("starting notification");
  //   // Add event listener
  //   this.bleManagerEmitter.addListener(
  //     "BleManagerDidUpdateValueForCharacteristic",
  //     ({ value, peripheral, characteristic, service }) => {
  //       // Convert bytes array to string
  //       const data = bytesToString(value);
  //       console.log(`Received ${data} for characteristic ${characteristic}`);
  //     }
  //   );
  //   // Actions triggereng BleManagerDidUpdateValueForCharacteristic event
  // }

  // scanAndConnect() {
  //     this.manager.startDeviceScan(null, null, (error, device) => {
  //         if (error) {
  //             // Handle error (scanning will be stopped automatically)
  //             console.log(error);
  //             return
  //         }

  //         // Check if it is a device you are looking for based on advertisement data
  //         // or other criteria.
  //         if (device.name === 'TI BLE Sensor Tag' || 
  //             device.name === 'MQP') {
              
  //             // Stop scanning as it's not necessary if you are scanning for one device.
  //             this.manager.stopDeviceScan();

  //             // Proceed with connection.
  //             device.connect()
  //             .then((device) => {
  //                 console.log("discovering all services and characteristics");
  //                 return device.discoverAllServicesAndCharacteristics()
  //             })
  //             .then((device) => {
  //               // Do work on device with services and characteristics
  //               console.log("connecting to service...")
  //             })
  //             .catch((error) => {
  //                 // Handle errors
  //                 console.log("Error:" + error);
  //             });
  //         }
  //     });
  // }

  connect() {

    // const subscription = this.manager.onStateChange((state) => {
    //     console.log(state)
    //     if (state === 'PoweredOn') {
    //       console.log("powered on")
    //       this.scanAndConnect();
    //       subscription.remove();
    //     }
    // }, true);

    // Init the module. Returns a Promise object. Don't call this multiple times.
    BleManager.start({ showAlert: false }).then(() => {
      // Success code
      console.log("Module initialized");

      // scan(array of strings: serviceUUIDs, seconds, allowDuplicates, scanningOptions)
      BleManager.scan([], 5, true).then(() => {
        
        console.log("Scan started");

        // output the UUIDs


        // THIS WORKS!
        BleManager.connect("D8:A0:1D:6A:83:DE")
        .then(() => {
          // Success code
          console.log("Connected");

          BleManager.stopScan().then(() => {
            // Success code
            console.log("Scan stopped");

            BleManager.retrieveServices("D8:A0:1D:6A:83:DE").then(
              (peripheralInfo) => {
                // Success code
                console.log("Peripheral info:", peripheralInfo);

                BleManager.startNotification(
                  "D8:A0:1D:6A:83:DE",
                  "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
                  "6e400003-b5a3-f393-e0a9-e50e24dcca9e"
                )
                  .then(() => {

                    console.log("Notifications started");

                    // Call read() to get the current value of the specified characteristic
                    // BleManager.read(
                    //   "D8:A0:1D:6A:83:DE",
                    //   "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
                    //   "6e400003-b5a3-f393-e0a9-e50e24dcca9e"
                    // )
                    //   .then((readData) => {
                        
                    //     console.log("Read: " + readData);

                    //     // const buffer = Buffer.Buffer.from(readData);
                    //     // const sensorData = buffer.readUInt8(1, true);

                    //   })
                    //   .catch((error) => {

                    //     console.log(error);

                    //   });

                    this.bleManagerEmitter.addListener(
                      "BleManagerDidUpdateValueForCharacteristic",
                      ({ value, peripheral, characteristic, service }) => {
                        // Convert bytes array to string
                        const data = bytesToString(value);
                        console.log(`Recieved ${data} for characteristic ${characteristic}`);
                      }
                    );

                  })
                  .catch((error) => {

                    console.log(error);

                  });


              }
            );
          });


        })
        .catch((error) => {
          // Failure code
          console.log(error);
        });

        // BleManager.connect("4fafc201-1fb5-459e-8fcc-c5c9c331914b")
        // .then(() => {
        //   // Success code
        //   console.log("Connected");
        // })
        // .catch((error) => {
        //   // Failure code
        //   console.log(error);
        // });
      });

      
    });

  }

  // scanAndConnect() {
  //     this.manager.startDeviceScan(null, null, (error, device) => {
  //         if (error) {
  //             // Handle error (scanning will be stopped automatically)
  //             console.log(error)
  //             return
  //         }

  //         // Check if it is a device you are looking for based on advertisement data
  //         // or other criteria.

  //         console.log(device.name)

  //         if (device.name === 'TI BLE Sensor Tag' || 
  //             device.name === 'SensorTag') {
              
  //             // Stop scanning as it's not necessary if you are scanning for one device.
  //             this.manager.stopDeviceScan();

  //             // Proceed with connection.
  //         }
  //     });
  // }

  render() {
    return (
      <View>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <Text>BLE APP</Text>
        </SafeAreaView>
      </View>
    );
  }
  
};

const styles = StyleSheet.create({
  
});

export default App;
