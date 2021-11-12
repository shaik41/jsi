import * as React from 'react';

import {
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  TouchableHighlight,
  NativeModules,
  Alert,
} from 'react-native';
import Reactotron from 'reactotron-react-native';
import jsonData from './home.json';

export default function App() {
  if (__DEV__) {
    import('./ReactotronConfig')
  }
  const [spValue, setSpValue] = React.useState('');
  const [asyncValue, setAsyncValue] = React.useState('');
  const [spBValue, setBSpValue] = React.useState('');
  const [jsiMessage, setjsiMessage] = React.useState('');
  const [mativeModuleMessage, setnativeModuleMessage] = React.useState('');

  const [timeInMilli, setTimeinMilli] = React.useState(0);
  const [lastOperation, setLastOperation] = React.useState('');
  let timeInMs = 0;

  const setItemSP = () => {
    // setSpValue('');
    // setAsyncValue('');
    // setBSpValue('');

    setItemToSharedPrefs('JSI_Fetch', JSON.stringify(jsonData));
  };
  const getItemFromSP = () => {
    getItemFromSharedPref('JSI_Fetch');
  };

  const setBItemSP = () => {
    // setSpValue('');
    // setAsyncValue('');
    // setBSpValue('');
    setItemToSharedPrefsBridge('Bridge_Fetch', JSON.stringify(jsonData));
  };
  const getBItemFromSP = () => {
    getItemFromSharedPrefBridge('Bridge_Fetch');
  };

  const setItemAsyncStorage = () => {
    // setSpValue('');
    // setAsyncValue('');
    // setBSpValue('');
    setItemToAsyncStorage('Async_Fetch', JSON.stringify(jsonData));
  };

  const getItemFromAsynStorage = () => {
    getItemFromAsyncStorage('Async_Fetch');
  };

  const setItemToSharedPrefs = (key: string, value: string) => {
    const bench = Reactotron.benchmark('setItemToSharedPref');
    const timeStart = Date.now();

    //-----
    setItem(key, value);
    //-----
    const timeEnd = Date.now();
    timeInMs = timeEnd - timeStart;
    setTimeinMilli(timeInMs);
    setLastOperation('Set To SP JSI');
    bench.stop();
  };

  const getItemFromSharedPref = (key: string) => {
    const bench = Reactotron.benchmark('getItemFromSharedPref');
    const timeStart = Date.now();

    //-----
    getItem(key, (value) => {
      const timeEnd = Date.now();
      timeInMs = timeEnd - timeStart;

      setTimeinMilli(timeInMs);
      setLastOperation('get From SP JSI');
      bench.stop();
      //setSpValue(value);
      console.log(value);
    });
    //-----
  };

  const setItemToAsyncStorage = (key: string, value: string) => {
    const bench = Reactotron.benchmark('setItemToAsyncStorage');
    const timeStart = Date.now();
    //-----
    AsyncStorage.setItem(key, value);
    //-----

    const timeEnd = Date.now();
    timeInMs = timeEnd - timeStart;
    setTimeinMilli(timeInMs);
    setLastOperation('set To Async Storage');
    bench.stop();
  };

  const getItemFromAsyncStorage = (key: string) => {
    const bench = Reactotron.benchmark('getItemFromAsyncStorage');
    const timeStart = Date.now();
    //-----
    AsyncStorage.getItem(key).then((res) => {
      //-----
      const timeEnd = Date.now();
      timeInMs = timeEnd - timeStart;
      setTimeinMilli(timeInMs);
      setLastOperation('get From Async Storage');
      bench.stop();
      //setAsyncValue(res ? res : '');
      console.log(res);
    });
  };

  const setItemToSharedPrefsBridge = (key: string, value: string) => {
    const bench = Reactotron.benchmark('setItemToSharedPrefBridge');
    const timeStart = Date.now();

    //-----
    NativeModules.SharedPreferences.setItem(key, value);
    //-----
    const timeEnd = Date.now();
    timeInMs = timeEnd - timeStart;
    setTimeinMilli(timeInMs);
    setLastOperation('Set To SP Bridge');
    bench.stop();
  };

  const getItemFromSharedPrefBridge = (key: string) => {
    const bench = Reactotron.benchmark('getItemFromSharedPrefBridge');
    const timeStart = Date.now();

    //-----
    NativeModules.SharedPreferences.getItem(key, (value) => {
      const timeEnd = Date.now();
      timeInMs = timeEnd - timeStart;
      setTimeinMilli(timeInMs);
      setLastOperation('get From SP Bridge');
      bench.stop();
      console.log(value);
    });

    //-----
  };

  const getMessageFromJSIImp = (key: string) => {
    const bench = Reactotron.benchmark('getMessageFromJSI');
    const timeStart = Date.now();

    const message = getMessageFromJSI();
    //-----
    //-----

    const timeEnd = Date.now();
    timeInMs = timeEnd - timeStart;
    setTimeinMilli(timeInMs);
    setLastOperation('get Message from JSI');
    bench.stop();
    console.log(message);
  };

  const getMessageFromNativeModule = (key: string) => {
    const bench = Reactotron.benchmark('getMessageFromNativeModule');
    const timeStart = Date.now();

    //-----
    NativeModules.SharedPreferences.getBridgeMessage((value) => {
      const timeEnd = Date.now();
      timeInMs = timeEnd - timeStart;
      setTimeinMilli(timeInMs);
      setLastOperation('get Message from NativeModule ');
      bench.stop();
      console.log(value);
    });
    //-----
  };

  const getObjectFromJavaAndroid = () => {
    const bench = Reactotron.benchmark('getObjectFromJavaAndroid');
    const timeStart = Date.now();

    //-----
    const a = getObjectFromJava();
    const timeEnd = Date.now();
    timeInMs = timeEnd - timeStart;
    setTimeinMilli(timeInMs);
    setLastOperation('getObjectFromJavaAndroid');
    bench.stop();
    console.log(JSON.stringify(a));

    //-----
  };

  const getObjectFromJavaAndroidBridge = () => {
    const bench = Reactotron.benchmark('getObjectFromJavaAndroidBridge');
    const timeStart = Date.now();

    //-----
    NativeModules.SharedPreferences.getObjectFromJava((a) => {
      const timeEnd = Date.now();
      timeInMs = timeEnd - timeStart;
      setTimeinMilli(timeInMs);
      setLastOperation('getObjectFromJavaAndroidBridge');
      bench.stop();
      console.log(JSON.stringify(a));
    });
    //-----
  };

  return (
    <View style={styles.container}>
      <Text>
        Last operation : {lastOperation} time: {timeInMilli} MS{' '}
      </Text>

      <View style={styles.subContainer}>
        <TouchableHighlight style={styles.backgroundButton} onPress={setItemSP}>
          <Text style={styles.textButton}> Set To Shared Prefs JSI</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.backgroundButton}
          onPress={getItemFromSP}
        >
          <Text style={styles.textButton}>
            {' '}
            Get From Shared Prefs JSI (Async){' '}
          </Text>
        </TouchableHighlight>
        {spValue ? (
          <Text numberOfLines={2}>Value from SP: {spValue}</Text>
        ) : null}
      </View>
      <Text>---------------------------------</Text>
      <View style={styles.subContainer}>
        <TouchableHighlight
          style={styles.backgroundButton}
          onPress={setItemAsyncStorage}
        >
          <Text style={styles.textButton}> Set To Async Storage</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.backgroundButton}
          onPress={getItemFromAsynStorage}
        >
          <Text style={styles.textButton}> Get From Async Storage (Async)</Text>
        </TouchableHighlight>
        {asyncValue ? (
          <Text numberOfLines={2}>Value from Async Storage: {asyncValue}</Text>
        ) : null}
      </View>
      <Text>---------------------------------</Text>
      <View style={styles.subContainer}>
        <TouchableHighlight
          style={styles.backgroundButton}
          onPress={setBItemSP}
        >
          <Text style={styles.textButton}> Set To SP Bridge</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.backgroundButton}
          onPress={getBItemFromSP}
        >
          <Text style={styles.textButton}> Get From SP Bridge (Async) </Text>
        </TouchableHighlight>
        {spBValue ? (
          <Text numberOfLines={2}>Value from SP Bridge SP: {spBValue}</Text>
        ) : null}
      </View>

      <Text>---------------------------------</Text>
      <View style={styles.subContainer}>
        <TouchableHighlight
          style={styles.backgroundButton}
          onPress={getMessageFromNativeModule}
        >
          <Text style={styles.textButton}>
            {' '}
            Load Android String From Bridge (Async)
          </Text>
        </TouchableHighlight>
        {mativeModuleMessage ? (
          <Text>Message From Bridge : {mativeModuleMessage}</Text>
        ) : null}
        <TouchableHighlight
          style={styles.backgroundButton}
          onPress={getMessageFromJSIImp}
        >
          <Text style={styles.textButton}>
            {' '}
            Load Android String From JSI (Sync)
          </Text>
        </TouchableHighlight>
        {jsiMessage ? <Text> Message From JSI : {jsiMessage}</Text> : null}
      </View>
      <Text>---------------------------------</Text>
    
      <TouchableHighlight
        style={styles.backgroundButton}
        onPress={getObjectFromJavaAndroidBridge}
      >
        <Text style={styles.textButton}>
          Get Object from Java Bridge (Async)
        </Text>
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.backgroundButton}
        onPress={getObjectFromJavaAndroid}
      >
        <Text style={styles.textButton}>Get Object from Java JSI (Sync)</Text>
      </TouchableHighlight>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  backgroundButton: {
    backgroundColor: 'grey',
    padding: 8,
    margin: 8,
  },
  textButton: {
    color: 'white',
  },
});
