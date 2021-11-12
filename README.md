# react-native-jsi-poc

Myntra POC for JSI

Benchmark between
1. Get String from KV store: 
    a.Android Shared Prefs over JSI
    b.Async Storage 
    c.Android Shared Pref over Bridge
2. Retrieve a Java String 
    a.JSI
    b.Bridge
3. Retrieve a Java Object 
    a.JSI
    b.Bridge
4. Query 100 Rows from Table 
    a.JSI
    b.Bridge    

RN version: 0.63.4
NDK Version: 22.0.x
CMake Version: 3.10.x
Test Device : Samsung S10

Results:
1. Get a JSON string of 212148 characters from KV Store 
    1. JSI = ~ 5 MS (Min 2 MS - Max 8 MS)
    2. Async Storage = ~ 15 MS (Min 12 - Max 35 MS))
    3. Bridge = ~ 10 MS (Min 8 MS - Max 20 MS)

2. Get a Java String to JS through JNI and JSI
    1. JSI = <= 1 MS (Min 0 MS - Max 1 MS)
    2. Bridge = ~ 8 MS (Min 6 MS - Max 15 MS)

3. Get a Java Object (Two String properties) to JS through JNI and JSI 
    1. JSI = <= 1 MS (Min 0 MS - Max 1 MS)
    2. Bridge = ~ 10 MS (Min 10 MS - Max 18 MS)

4. Query a row of students in a class table 
    1. JSI - WIP
    2. Bridge - WIP    
## License

MIT
