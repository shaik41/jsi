package com.reactnativejsipoc.db;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class DatabaseHelper extends SQLiteOpenHelper {

  // Database Version
  private static final int DATABASE_VERSION = 1;

  // Database Name
  private static final String DATABASE_NAME = "students_db";


  public DatabaseHelper(Context context) {
    super(context, DATABASE_NAME, null, DATABASE_VERSION);
  }

  // Creating Tables
  @Override
  public void onCreate(SQLiteDatabase db) {

    // create notes table
    db.execSQL(Student.CREATE_TABLE);
  }

  // Upgrading database
  @Override
  public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
    // Drop older table if existed
    db.execSQL("DROP TABLE IF EXISTS " + Student.TABLE_NAME);

    // Create tables again
    onCreate(db);
  }

  public void insertStudent(String student) {
    // get writable database as we want to write data
    SQLiteDatabase db = this.getWritableDatabase();

    ContentValues values = new ContentValues();
    // `id` and `timestamp` will be inserted automatically.
    // no need to add them
    values.put(Student.COLUMN_NOTE, student);

    // insert row
    db.insert(Student.TABLE_NAME, null, values);

    // close db connection
    db.close();

  }


  /**
   * Approach 1:
   * The aim here is to have full control on React Native side.
   * This returns a cursor which is exposed to React Native through JSI.
   * @param query
   * @return
   */
  public Cursor getCursorForQuery(String query){
    SQLiteDatabase db = this.getReadableDatabase();
    return db.rawQuery(query, null);
  }


  public List<Map<String, String>> getMapForQuery(String query) {
    List<Map<String, String>> maplist = new ArrayList<>();
    SQLiteDatabase db = this.getReadableDatabase();
    Cursor cursor = db.rawQuery(query, null);
    if (cursor.moveToFirst()) {
      do {
        HashMap<String, String> map = new HashMap<String, String>();
        for(int i=0; i<cursor.getColumnCount();i++)
        {
          map.put(cursor.getColumnName(i), cursor.getString(i));
        }

        maplist.add(map);
      } while (cursor.moveToNext());
    }
    db.close();
    return maplist;
  }

  /**
   * Approach 2:
   * The aim here is to keep control on Platform side.
   * The cursor iterates and provides a list of known objects to React Native through JSI.
   * @return
   */
  public List<Student> getAllStudents() {
    List<Student> students = new ArrayList<>();
    // Select All Query
    String selectQuery = "SELECT  * FROM " + Student.TABLE_NAME;
    long timestart = System.currentTimeMillis();
    SQLiteDatabase db = this.getWritableDatabase();
    Cursor cursor = db.rawQuery(selectQuery, null);
    long timeEnd = System.currentTimeMillis();
    Log.e("QUERY_TIME", String.valueOf(timeEnd-timestart));

    // looping through all rows and adding to list
    if (cursor.moveToFirst()) {
      do {
        Student student = new Student();
        student.setId(cursor.getInt(cursor.getColumnIndex(Student.COLUMN_ID)));
        student.setName(cursor.getString(cursor.getColumnIndex(Student.COLUMN_NOTE)));
        student.setTimestamp(cursor.getString(cursor.getColumnIndex(Student.COLUMN_TIMESTAMP)));

        students.add(student);
      } while (cursor.moveToNext());
    }

    // close the cursor
    cursor.close();

    // close db connection
    db.close();

    // return notes list
    return students;
  }


  /**
   * Approach 3:
   * The aim here is to keep control on Platform side.
   * The cursor iterates and provides a list of known objects to React Native through JSI.
   * @return
   */
  public String[][] getStudentArrays() {
    // Select All Query
    String selectQuery = "SELECT  * FROM " + Student.TABLE_NAME;
    SQLiteDatabase db = this.getWritableDatabase();
    Cursor cursor = db.rawQuery(selectQuery, null);
    String[][] studentsArray = new String[102][]; // replace with cursor.getCount
    // looping through all rows and adding to list
    int i=1;
    String[] columnNames = {Student.COLUMN_ID, Student.COLUMN_NOTE,Student.COLUMN_TIMESTAMP};
    studentsArray[0] = columnNames;
    if (cursor.moveToFirst()) {
      do {
        String[] columnValues = {String.valueOf(cursor.getInt(cursor.getColumnIndex(Student.COLUMN_ID))), cursor.getString(cursor.getColumnIndex(Student.COLUMN_NOTE)),cursor.getString(cursor.getColumnIndex(Student.COLUMN_TIMESTAMP))};
        studentsArray[i] = columnValues;
        i = i+1;
      } while (cursor.moveToNext() && i<101);
    }

    // close the cursor
    cursor.close();

    // close db connection
    db.close();

    // return notes list
    return studentsArray;
  }


}
