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

  const getStudentsFromDBBridge = () => {
    const bench = Reactotron.benchmark(
      'get_Students_From_DB_Over_Bridge : Java (Get Array of Students from DB ) -> Bridge (Serialization  / Deserialization ) -> JS (Get Array of Students)'
    );
    const timeStart = Date.now();
    NativeModules.SharedPreferences.getAllStudents((result) => {
      const timeEnd = Date.now();
      timeInMs = timeEnd - timeStart;
      setTimeinMilli(timeInMs);
      setLastOperation(
        'get_Students_From_DB_Over_Bridge : Java (Get Array of Students from DB ) -> Bridge (Serialization  / Deserialization ) -> JS (Get Array of Students)'
      );
      bench.stop();
      console.log(JSON.stringify(result));
    });
  };

  const getStudentsFromDB = () => {
    const bench = Reactotron.benchmark(
      'get_Students_From_DB_Over_JSI : Java (Get Array of Students from DB ) -> C++ (Convert Java Array to JSI Array) -> JS (Get Array of Students)'
    );
    const timeStart = Date.now();
    const students = getStudents();
    const timeEnd = Date.now();
    timeInMs = timeEnd - timeStart;
    setTimeinMilli(timeInMs);
    setLastOperation(
      'get_Students_From_DB_Over_JSI : Java (Get Array of Students from DB ) -> C++ (Convert Java Array to JSI Object Array) -> JS (Get Array of Students)'
    );
    bench.stop();
    console.log(JSON.stringify(students));
    console.log(students.length);
  };

  const getStudentsFromDBAsList = () => {
    const bench = Reactotron.benchmark(
      'get_Students_From_DB_Over_JSI_as_list : Java (Get List of Students from DB ) -> C++ (Convert ArrayList to JSI Array) -> JS (Get Array of Students)'
    );
    const timeStart = Date.now();
    const students = getStudentsLists();
    const timeEnd = Date.now();
    timeInMs = timeEnd - timeStart;
    setTimeinMilli(timeInMs);
    setLastOperation(
      'get_Students_From_DB_Over_JSI_as_list : Java (Get List of Students from DB ) -> C++ (Convert ArrayList to JSI Object Array) -> JS (Get Array of Students)'
    );
    bench.stop();
    console.log(JSON.stringify(students));
    console.log(students.length);
  };

  const getStudentsFromDBJavaAndCPlusPlus = () => {
    const bench = Reactotron.benchmark(
      'get_Rows_As_List_Of_Map_From_DB_Over_JSI : Java (Get List of Map Objects from DB ) -> C++ (Convert List of Map Objects to JSI Object Array) -> JS (Get Array of Students)'
    );
    const timeStart = Date.now();
    const students = getMapForQuery('SELECT * from students');
    const timeEnd = Date.now();
    timeInMs = timeEnd - timeStart;
    setTimeinMilli(timeInMs);
    setLastOperation(
      'get_Rows_As_List_Of_Map_From_DB_Over_JSI : Java (Get List of Map Objects from DB ) -> C++ (Convert List of Map Objects to JSI Object Array) -> JS (Get Array of Students)'
    );
    bench.stop();
    console.log(JSON.stringify(students));
    console.log(students.length);
  };

  const getStudentsAsDoubleArrayFromJSI = () => {
    const bench = Reactotron.benchmark(
      'get_Rows_As_Double_Array_From_DB_Over_JSI : Java (Get 2D array Objects from DB ) -> C++ (Convert 2D array  Objects to JSI Object Array) -> JS (Get Array of Students)'
    );
    const timeStart = Date.now();
    const students = getStudentsAsDoubleArray();
    const timeEnd = Date.now();
    timeInMs = timeEnd - timeStart;
    setTimeinMilli(timeInMs);
    setLastOperation(
      'get_Rows_As_Double_Array_From_DB_Over_JSI : Java (Get 2D array Objects from DB ) -> C++ (Convert 2D array Objects to JSI Object Array) -> JS (Get Array of Students)'
    );
    bench.stop();
    console.log(JSON.stringify(students));
    console.log(students.length);
  };

  const getCursorOfQuery = () => {
    const bench = Reactotron.benchmark(
      'get_Cursor_Object_From_DB_Over_JSI_Iterate_JS : Java (Get Cursor Object from DB Query ) -> C++ (Convert Cursor Object to JSI Object) -> JS (Use JSI Cursor Object to iterate over the DB and get Array of Students)'
    );
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
    setLastOperation(
      'get_Cursor_Object_From_DB_Over_JSI_Iterate_JS : Java (Get Cursor Object from DB Query ) -> C++ (Convert Cursor Object to JSI Object) -> JS (Use JSI Cursor Object to iterate over the DB and get Array of Students)'
    );
    bench.stop();
    console.log(studentArray);
    console.log(studentArray.length);
  };

  const getStudentsFromCPlusPlus = () => {
    const bench = Reactotron.benchmark(
      'get_Cursor_Object_From_DB_Over_JSI_Iterate_C++ : Java (Get Cursor Object from DB Query ) -> C++ (Use Java Cursor Object to iterate over the DB and get Array of Students) -> JS (Get Array of Students)'
    );
    const timeStart = Date.now();
    const students = getAllColumsForQuery('SELECT * from students');
    const timeEnd = Date.now();
    timeInMs = timeEnd - timeStart;
    setTimeinMilli(timeInMs);

    setLastOperation(
      'get_Cursor_Object_From_DB_Over_JSI_Iterate_C++ : Java (Get Cursor Object from DB Query ) -> C++ (Use Java Cursor Object to iterate over the DB and get Array of Students) -> JS (Get Array of Students)'
    );
    bench.stop();
    console.log(students);
    console.log(students.length)
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
            onPress={addStudentsToDBBridge}
          >
            <Text style={styles.textButton}>Add Students to DB Bridge </Text>
          </TouchableHighlight>
          <Text>---------------------------------</Text>
          <TouchableHighlight
            style={styles.backgroundButton}
            onPress={getStudentsFromDBBridge}
          >
            <Text style={styles.textButton}>
              Get Students from DB Bridge,Cursor Iteration on Java.
            </Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.backgroundButton}
            onPress={getStudentsFromDB}
          >
            <Text style={styles.textButton}>
              Get Students from DB JSI,Cursor Iteration on Java. Returned As
              Array.
            </Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.backgroundButton}
            onPress={getStudentsFromDBAsList}
          >
            <Text style={styles.textButton}>
              Get Students from DB JSI,Cursor Iteration on Java. Returned As
              List.
            </Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.backgroundButton}
            onPress={getCursorOfQuery}
          >
            <Text style={styles.textButton}>
              Get Students from DB JSI, Cursor Iteration on JS.
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.backgroundButton}
            onPress={getStudentsFromCPlusPlus}
          >
            <Text style={styles.textButton}>
              Get Students from DB JSI, Cursor Iteration on C++.
            </Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.backgroundButton}
            onPress={getStudentsFromDBJavaAndCPlusPlus}
          >
            <Text style={styles.textButton}>
              Get Students from DB JSI, Cursor Iteration on Java and Map
              Iteration on C++.
            </Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.backgroundButton}
            onPress={getStudentsAsDoubleArrayFromJSI}
          >
            <Text style={styles.textButton}>
              Get Students from DB JSI, Cursor Iteration on Java and Array elements from c++
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
