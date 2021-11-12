package com.reactnativejsipoc;

import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Build;
import android.preference.PreferenceManager;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.JavaScriptContextHolder;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@ReactModule(name = JsiPocModule.NAME)
public class JsiPocModule extends ReactContextBaseJavaModule {
    public static final String NAME = "JsiPoc";
    public  JavaScriptContextHolder reactContextP;
  private List<Note> notesList = new ArrayList<>();
    public JsiPocModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
  private DatabaseHelper db;



    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    static {
        try {
            // Used to load the 'native-lib' library on application startup.
            System.loadLibrary("jsi-poc");

        } catch (Exception ignored) {
        }
    }

  private native void nativeInstall(long jsi);

  private native void setMessage(String message, long jsi);

  private native void setObject(Object object);

  public void installLib(JavaScriptContextHolder reactContext) {

    if (reactContext.get() != 0) {
      this.reactContextP = reactContext;
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

  public String getJSIMessage(){
    return "HI I'M JSI ";
  }

  public String startAsyncTaskJSI(){
    new LongOperation().execute();
    return "Working";
  }


  /**
   * Inserting new note in db
   * and refreshing the list
   */
  private void createNote(String note) {
    // inserting note in db and getting
    // newly inserted note id
    long id = db.insertNote(note);

    // get the newly inserted note from db
    Note n = db.getNote(id);

    if (n != null) {
      // adding new note to array list at 0 position
      notesList.add(0, n);

    }
  }

  /**
   * Updating note in db and updating
   * item in the list by its position
   */
  private void updateNote(String note, int position) {
    Note n = notesList.get(position);
    // updating note text
    n.setNote(note);

    // updating note in db
    db.updateNote(n);

    // refreshing the list
    notesList.set(position, n);

  }

  /**
   * Deleting note from SQLite and removing the
   * item from the list by its position
   */
  private void deleteNote(int position) {
    // deleting the note from db
    db.deleteNote(notesList.get(position));

    // removing the note from the list
    notesList.remove(position);
  }

  private Person getObjectFromJava(){
    return new Person("Atif","28");
  }


  private final class LongOperation extends AsyncTask<Void, Void, String> {

    @Override
    protected String doInBackground(Void... params) {
      for (int i = 0; i < 5; i++) {
        try {
          Thread.sleep(1000);
        } catch (InterruptedException e) {
          // We were cancelled; stop sleeping!
        }
      }
      return "Executed";
    }

    @Override
    protected void onPostExecute(String result) {
      setMessage(result,reactContextP.get());
    }
  }


  private final class FetchFromSharedPref extends AsyncTask<String, String, String> {



    @Override
    protected String doInBackground(String... strings) {
      SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(getReactApplicationContext());
      String value = preferences.getString(strings[0], "");
      return value;
    }

    @Override
    protected void onPostExecute(String result) {
      setMessage(result,reactContextP.get());
    }
  }

  public class Person{
    public String Name;
    public String Age;

    Person(String name, String age){
      Name = name;
      Age = age;
    }
  }

}


