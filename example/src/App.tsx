import * as React from 'react';

import {
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  TouchableHighlight,
  NativeModules,
  ScrollView,
} from 'react-native';
import Reactotron from 'reactotron-react-native';
import jsonData from './home.json';

export default function App() {
  if (__DEV__) {
    import('./ReactotronConfig');
  }

  const [timeInMilli, setTimeinMilli] = React.useState(0);
  const [lastOperation, setLastOperation] = React.useState('');
  let timeInMs = 0;

  const setItemSP = () => {
    setItemToSharedPrefs('JSI_Fetch', JSON.stringify(jsonData));
  };
  const getItemFromSP = () => {
    getItemFromSharedPref('JSI_Fetch');
  };

  const setBItemSP = () => {
    setItemToSharedPrefsBridge('Bridge_Fetch', JSON.stringify(jsonData));
  };
  const getBItemFromSP = () => {
    getItemFromSharedPrefBridge('Bridge_Fetch');
  };

  const getItemFromSPSync = () => {
    getItemFromSharedPrefJSISync('JSI_Fetch');
  };

  const setItemAsyncStorage = () => {
    setItemToAsyncStorage('Async_Fetch', JSON.stringify(jsonData));
  };

  const getItemFromAsynStorage = () => {
    getItemFromAsyncStorage('Async_Fetch');
  };

  const setItemToSharedPrefs = (key: string, value: string) => {
    const bench = Reactotron.benchmark('setItemToSharedPref');
    const timeStart = Date.now();
    setItem(key, value);
    const timeEnd = Date.now();
    timeInMs = timeEnd - timeStart;
    setTimeinMilli(timeInMs);
    setLastOperation('Set To SP JSI');
    bench.stop();
  };

  const getItemFromSharedPref = (key: string) => {
    const bench = Reactotron.benchmark('getItemFromSharedPref');
    const timeStart = Date.now();
    getItem(key, (value) => {
      const timeEnd = Date.now();
      timeInMs = timeEnd - timeStart;
      setTimeinMilli(timeInMs);
      setLastOperation('get From SP JSI');
      bench.stop();
      //setSpValue(value);
      console.log(value);
    });
  };

  const setItemToAsyncStorage = (key: string, value: string) => {
    const bench = Reactotron.benchmark('setItemToAsyncStorage');
    const timeStart = Date.now();
    AsyncStorage.setItem(key, value);
    const timeEnd = Date.now();
    timeInMs = timeEnd - timeStart;
    setTimeinMilli(timeInMs);
    setLastOperation('set To Async Storage');
    bench.stop();
  };

  const getItemFromAsyncStorage = (key: string) => {
    const bench = Reactotron.benchmark('getItemFromAsyncStorage');
    const timeStart = Date.now();
    AsyncStorage.getItem(key).then((res) => {
      const timeEnd = Date.now();
      timeInMs = timeEnd - timeStart;
      setTimeinMilli(timeInMs);
      setLastOperation('get From Async Storage');
      bench.stop();
      console.log(res);
    });
  };

  const setItemToSharedPrefsBridge = (key: string, value: string) => {
    const bench = Reactotron.benchmark('setItemToSharedPrefBridge');
    const timeStart = Date.now();
    NativeModules.SharedPreferences.setItem(key, value);
    const timeEnd = Date.now();
    timeInMs = timeEnd - timeStart;
    setTimeinMilli(timeInMs);
    setLastOperation('Set To SP Bridge');
    bench.stop();
  };

  const getItemFromSharedPrefBridge = (key: string) => {
    const bench = Reactotron.benchmark('getItemFromSharedPrefBridge');
    const timeStart = Date.now();
    NativeModules.SharedPreferences.getItem(key, (value) => {
      const timeEnd = Date.now();
      timeInMs = timeEnd - timeStart;
      setTimeinMilli(timeInMs);
      setLastOperation('get From SP Bridge');
      bench.stop();
      console.log(value);
    });
  };

  const getItemFromSharedPrefJSISync = (key: string) => {
    const bench = Reactotron.benchmark('getItemFromSharedPrefJSISync');
    const timeStart = Date.now();
    const value = getItemSync(key);
    const timeEnd = Date.now();
    timeInMs = timeEnd - timeStart;
    setTimeinMilli(timeInMs);
    setLastOperation('get From SP JSI Sync');
    bench.stop();
    console.log(value);
  };

  const getMessageFromJSIImp = (key: string) => {
    const bench = Reactotron.benchmark('getMessageFromJSI');
    const timeStart = Date.now();
    const message = getMessageFromJSI();
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
    NativeModules.SharedPreferences.getBridgeMessage((value) => {
      const timeEnd = Date.now();
      timeInMs = timeEnd - timeStart;
      setTimeinMilli(timeInMs);
      setLastOperation('get Message from NativeModule ');
      bench.stop();
      console.log(value);
    });
  };

  const getObjectFromJavaAndroid = () => {
    const bench = Reactotron.benchmark('getObjectFromJavaAndroid');
    const timeStart = Date.now();
    const a = getObjectFromJava();
    const timeEnd = Date.now();
    timeInMs = timeEnd - timeStart;
    setTimeinMilli(timeInMs);
    setLastOperation('getObjectFromJavaAndroid');
    bench.stop();
    console.log(JSON.stringify(a));
  };

  const getObjectFromJavaAndroidBridge = () => {
    const bench = Reactotron.benchmark('getObjectFromJavaAndroidBridge');
    const timeStart = Date.now();
    NativeModules.SharedPreferences.getObjectFromJava((a) => {
      const timeEnd = Date.now();
      timeInMs = timeEnd - timeStart;
      setTimeinMilli(timeInMs);
      setLastOperation('getObjectFromJavaAndroidBridge');
      bench.stop();
      console.log(JSON.stringify(a));
    });
  };

  const addStudentsToDB = () => {
    const bench = Reactotron.benchmark('addStudentsToDB');
    const timeStart = Date.now();
    addStudentsToTable();
    const timeEnd = Date.now();
    timeInMs = timeEnd - timeStart;
    setTimeinMilli(timeInMs);
    setLastOperation('addStudentsToDB');
    bench.stop();
  };

  const getStudentsFromDB = () => {
    const bench = Reactotron.benchmark('getStudentsFromDB');
    const timeStart = Date.now();
    const students = getStudents();
    const timeEnd = Date.now();
    timeInMs = timeEnd - timeStart;
    setTimeinMilli(timeInMs);
    setLastOperation('getStudentsFromDB');
    bench.stop();
    console.log(JSON.stringify(students));
  };

  const addStudentsToDBBridge = () => {
    const bench = Reactotron.benchmark('addStudentsToDBBridge');
    const timeStart = Date.now();

    NativeModules.SharedPreferences.createStudents((value) => {
      const timeEnd = Date.now();
      timeInMs = timeEnd - timeStart;
      setTimeinMilli(timeInMs);
      setLastOperation('addStudentsToDBBridge');
      bench.stop();
    });
  };

  const getStudentsFromDBBridge = () => {
    const bench = Reactotron.benchmark('getStudentsFromDBBridge');
    const timeStart = Date.now();
    NativeModules.SharedPreferences.getAllStudents((result) => {
      const timeEnd = Date.now();
      timeInMs = timeEnd - timeStart;
      setTimeinMilli(timeInMs);
      setLastOperation('getStudentsFromDBBridge');
      bench.stop();
      console.log(JSON.stringify(result));
    });
  };

  const getCursorOfQuery = () => {
    const bench = Reactotron.benchmark('getCursorOfQuery');
    const timeStart = Date.now();
    const cursor = getCursorForQuery('SELECT * from students');
    const studentArray = [];
    cursor.moveToFirst();
    do {
      const student = {
        id: cursor.getInt('id'),
        name: cursor.getString('note'),
        timestamp: cursor.getString('timestamp'),
      };
      studentArray.push(student);
    } while (cursor.moveToNext());
    cursor.close();
    const timeEnd = Date.now();
    timeInMs = timeEnd - timeStart;
    setTimeinMilli(timeInMs);
    setLastOperation('get Students using cursor from JSI');
    bench.stop();
    console.log(studentArray);
  };

  return (
    <View style={{ flex: 1 }}>
      <Text>
        Last operation : {lastOperation} time: {timeInMilli} MS{' '}
      </Text>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.subContainer}>
            <TouchableHighlight
              style={styles.backgroundButton}
              onPress={setItemSP}
            >
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
            <TouchableHighlight
              style={styles.backgroundButton}
              onPress={getItemFromSPSync}
            >
              <Text style={styles.textButton}>
                {' '}
                Get From Shared Prefs JSI (Sync){' '}
              </Text>
            </TouchableHighlight>
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
              <Text style={styles.textButton}>
                {' '}
                Get From Async Storage (Async)
              </Text>
            </TouchableHighlight>
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
              <Text style={styles.textButton}>Get From SP Bridge (Async) </Text>
            </TouchableHighlight>
          </View>

          <Text>---------------------------------</Text>
          <View style={styles.subContainer}>
            <TouchableHighlight
              style={styles.backgroundButton}
              onPress={getMessageFromNativeModule}
            >
              <Text style={styles.textButton}>
                Load Android String From Bridge (Async)
              </Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={styles.backgroundButton}
              onPress={getMessageFromJSIImp}
            >
              <Text style={styles.textButton}>
                Load Android String From JSI (Sync)
              </Text>
            </TouchableHighlight>
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
            <Text style={styles.textButton}>
              Get Object from Java JSI (Sync)
            </Text>
          </TouchableHighlight>
          <Text>---------------------------------</Text>
          <TouchableHighlight
            style={styles.backgroundButton}
            onPress={addStudentsToDB}
          >
            <Text style={styles.textButton}>Add Students to DB JSI </Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.backgroundButton}
            onPress={getStudentsFromDB}
          >
            <Text style={styles.textButton}>Get Students from DB JSI </Text>
          </TouchableHighlight>

          <Text>---------------------------------</Text>
          <TouchableHighlight
            style={styles.backgroundButton}
            onPress={addStudentsToDBBridge}
          >
            <Text style={styles.textButton}>Add Students to DB Bridge </Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.backgroundButton}
            onPress={getStudentsFromDBBridge}
          >
            <Text style={styles.textButton}>Get Students from DB Bridge </Text>
          </TouchableHighlight>

          <Text>---------------------------------</Text>
          <TouchableHighlight
            style={styles.backgroundButton}
            onPress={getCursorOfQuery}
          >
            <Text style={styles.textButton}>
              Get Students from DB JSI using Cursor
            </Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    flex: 1,
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
