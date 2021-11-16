package com.reactnativejsipoc.db;

public class Student {
  public static final String TABLE_NAME = "notes";

  public static final String COLUMN_ID = "id";
  public static final String COLUMN_NOTE = "note";
  public static final String COLUMN_TIMESTAMP = "timestamp";

  public int id;
  public String name;
  public String timestamp;


  // Create table SQL query
  public static final String CREATE_TABLE =
    "CREATE TABLE " + TABLE_NAME + "("
      + COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT,"
      + COLUMN_NOTE + " TEXT,"
      + COLUMN_TIMESTAMP + " DATETIME DEFAULT CURRENT_TIMESTAMP"
      + ")";

  public Student() {
  }

  public Student(int id, String name, String timestamp) {
    this.id = id;
    this.name = name;
    this.timestamp = timestamp;
  }

  public int getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getTimestamp() {
    return timestamp;
  }

  public void setId(int id) {
    this.id = id;
  }

  public void setTimestamp(String timestamp) {
    this.timestamp = timestamp;
  }
}
