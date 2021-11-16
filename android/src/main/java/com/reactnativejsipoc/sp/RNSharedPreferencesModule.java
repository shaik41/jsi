package com.reactnativejsipoc.sp;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.*;

import android.bluetooth.BluetoothAdapter;
import com.facebook.react.bridge.Callback;
import com.reactnativejsipoc.db.DatabaseHelper;
import com.reactnativejsipoc.db.Student;
import com.reactnativejsipoc.db.StudentNames;

import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.os.AsyncTask;
import android.os.Bundle;
import android.widget.ListView;

import java.util.ArrayList;
import java.util.List;

public class RNSharedPreferencesModule  extends ReactContextBaseJavaModule {

  private String shared_name = "wit_player_shared_preferences";

  private DatabaseHelper db;


  private void initSharedHandler() {
    SharedHandler.init(getReactApplicationContext(), shared_name);
  }

  public RNSharedPreferencesModule(ReactApplicationContext reactContext) {
    super(reactContext);
    db = new DatabaseHelper(getReactApplicationContext());

  }

  @Override
  public String getName() {
    return "SharedPreferences";
  }

  @ReactMethod
  public void setName(String name) {
    shared_name = name;
  }


  @ReactMethod
  public void setItem(String key, String value) {

    initSharedHandler();
    SharedDataProvider.putSharedValue(key, value);

  }

  @ReactMethod
  public void getItem(String key, Callback successCallback) {

    initSharedHandler();
    String value = SharedDataProvider.getSharedValue(key);
    successCallback.invoke(value);

  }


  @ReactMethod
  public void getBridgeMessage(Callback successCallback) {
    successCallback.invoke("HI I'M BRIDGE");
  }


  @ReactMethod
  public void getItems(ReadableArray keys, Callback successCallback) {
    initSharedHandler();
    String[] keysArray = new String[keys.size()];
    for (int i = 0; i < keys.size(); i++) {
      keysArray[i] = keys.getString(i);
    }
    String[][] values = SharedDataProvider.getMultiSharedValues(keysArray);
    WritableNativeArray data = new WritableNativeArray();
    for (int i = 0; i < keys.size(); i++) {
      data.pushString(values[i][1]);
    }
    successCallback.invoke(data);
  }

  @ReactMethod
  public void getAll(Callback successCallback) {
    initSharedHandler();
    String[][] values = SharedDataProvider.getAllSharedValues();
    WritableNativeArray data = new WritableNativeArray();
    for (int i = 0; i < values.length; i++) {
      WritableArray arr = new WritableNativeArray();
      arr.pushString(values[i][0]);
      arr.pushString(values[i][1]);
      data.pushArray(arr);
    }
    successCallback.invoke(data);
  }

  @ReactMethod
  public void getAllKeys(Callback successCallback) {
    initSharedHandler();
    String[] keys = SharedDataProvider.getAllKeys();
    WritableNativeArray data = new WritableNativeArray();
    for (int i = 0; i < keys.length; i++) {
      data.pushString(keys[i]);
    }
    successCallback.invoke(data);
  }

  @ReactMethod
  public void clear() {
    initSharedHandler();
    SharedDataProvider.clear();
  }


  @ReactMethod
  public void removeItem(String key) {
    initSharedHandler();
    SharedDataProvider.deleteSharedValue(key);
  }


  @ReactMethod
  public void getObjectFromJava(Callback successCallback) {
    WritableMap map = new WritableNativeMap();
    map.putString("Name", "Shaik");
    map.putString("Age", "28");
    successCallback.invoke(map);
  }

  /**
   * Inserting new note in db
   * and refreshing the list
   */
  @ReactMethod
  public void createStudents(Callback successCallback) {
    // inserting note in db and getting
    // newly inserted note id
    for (int i = 0; i < 100; i++) {
      db.insertStudent(StudentNames.names[i]);
    }
    successCallback.invoke(true);
  }

  @ReactMethod
  public void getAllStudents(Callback successCallback) {
    List<Student> students = db.getAllStudents();
    WritableArray array = arrayOfObjectToWritableArray(students);
    successCallback.invoke(array);
  }

  public static WritableArray arrayOfObjectToWritableArray(List<Student> studentList) {
    WritableArray writableArray = Arguments.createArray();
    for (int i = 0; i < studentList.size(); i++) {
      Student value = studentList.get(i);
      WritableMap writableMap = new WritableNativeMap();
      writableMap.putString("name", value.name);
      writableMap.putString("timestamp", value.timestamp);
      writableMap.putInt("id", value.id);
      writableArray.pushMap(writableMap);
    }
    return writableArray;
  }

}
