package com.reactnativejsipoc.jsi;

import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Build;
import android.preference.PreferenceManager;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.JavaScriptContextHolder;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.module.annotations.ReactModule;
import com.reactnativejsipoc.db.DatabaseHelper;
import com.reactnativejsipoc.db.Student;
import com.reactnativejsipoc.db.StudentNames;

import java.util.ArrayList;
import java.util.List;

@ReactModule(name = JsiPocModule.NAME)
public class JsiPocModule extends ReactContextBaseJavaModule {
  public static final String NAME = "JsiPoc";

  static {
    try {
      System.loadLibrary("jsi-poc");

    } catch (Exception ignored) {
    }
  }

  private DatabaseHelper db;

  public JsiPocModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  private native void nativeInstall(long jsi);

  private native void setMessage(String message);


  public void installLib(JavaScriptContextHolder reactContext) {

    if (reactContext.get() != 0) {
      this.nativeInstall(
        reactContext.get()
      );
    } else {
      Log.e("JsiPocModule", "JSI Runtime is not available in debug mode");
    }

    db = new DatabaseHelper(getReactApplicationContext());

  }

  public String getModel() {
    String manufacturer = Build.MANUFACTURER;
    String model = Build.MODEL;
    if (model.startsWith(manufacturer)) {
      return model;
    } else {
      return manufacturer + " " + model;
    }
  }

  public void setItem(final String key, final String value) {
    SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this.getReactApplicationContext());
    SharedPreferences.Editor editor = preferences.edit();
    editor.putString(key, value);
    editor.apply();
  }

  public String getItem(final String key) {
    new FetchFromSharedPref().execute(key);
    return "";
  }

  public String getItemSync(final String key) {
    SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(getReactApplicationContext());
    return preferences.getString(key, "");
  }

  public String getJSIMessage() {
    return "HI I'M JSI ";
  }

  private Person getObjectFromJava() {
    return new Person("Myntra", "7");
  }


  public void createStudents() {
    for (int i = 0; i < 100; i++) {
      db.insertStudent(StudentNames.names[i]);
    }
  }

  //TODO remove .toArray()
  public Student[] getAllStudents() {
    List<Student> students = db.getAllStudents();
    Student[] students1 = new Student[students.size()];
    return students.toArray(students1);
  }


  private final class FetchFromSharedPref extends AsyncTask<String, String, String> {


    @Override
    protected String doInBackground(String... strings) {
      SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(getReactApplicationContext());
      return preferences.getString(strings[0], "");
    }

    @Override
    protected void onPostExecute(String result) {
      setMessage(result);
    }
  }

  public class Person {
    public String Name;
    public String Age;

    Person(String name, String age) {
      Name = name;
      Age = age;
    }
  }


}


