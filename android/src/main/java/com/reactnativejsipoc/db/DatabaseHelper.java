package com.reactnativejsipoc.db;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

import java.util.ArrayList;
import java.util.List;



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


}
