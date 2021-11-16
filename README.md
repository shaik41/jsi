# What is JSI?

It's an interface which enables JavaScript (whether it's JSC or Hermes) to communicate with native (C++) and vice versa. 

Hence using this we can eliminate the bridge. Instead we can take the following route.

# Android : Java <-> JNI <-> JSI <-> Javascript 
# iOS : ObjC <-> JSI <-> Javascript
# Benchmarking JSI

1. RN version: 0.63.4
2. NDK Version: 22.0.x
3. CMake Version: 3.10.x
4. Test Device : Samsung S10

# Operations
1. Get String from KV store: 
    1. Android Shared Prefs over JSI
    2. Async Storage 
    3. Android Shared Pref over Bridge
2. Retrieve a Java String 
    1. JSI
    2. Bridge
3. Retrieve a Java Object 
    1. JSI
    2. Bridge
4. Query 100 Rows from Table 
    1. JSI
    2. Bridge    


# Results:
1. Get a JSON string of 212148 characters from KV Store 
    1. JSI (Async - Spawn a thread on Java)= ~ 5 MS (Min 2 MS - Max 8 MS)
    2. JSI (Sync)= ~ 2 MS (Min 1 MS - Max 3 MS)
    3. Async Storage = ~ 22 MS (Min 12 - Max 35 MS))
    4. Bridge = ~ 14 MS (Min 8 MS - Max 20 MS)

2. Get a Java String to JS through JNI and JSI
    1. JSI = <= 1 MS (Min 0 MS - Max 1 MS)
    2. Bridge = ~ 8 MS (Min 6 MS - Max 15 MS)

3. Get a Java Object (Two String properties) to JS through JNI and JSI 
    1. JSI = <= 1 MS (Min 0 MS - Max 1 MS)
    2. Bridge = ~ 14 MS (Min 10 MS - Max 18 MS)

4. Query 100 rows of students in a class table 
    1. JSI = ~ 27 MS (Min 10 MS -  Max 44 MS )
    2. Bridge = ~ 145 MS (Min 110 MS - Max 170 MS)

## License

MIT
