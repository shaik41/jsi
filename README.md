# JSI (JavaScript Interface)

JSI is an interface that enables JavaScript (whether it's JSC or Hermes) to communicate with native code written in C++ and vice versa. It provides a direct communication channel between JavaScript and native code, eliminating the need for a bridge.

## Usage

Using JSI, you can establish the following communication routes:

- **Android**:
  - Java <-> JNI <-> JSI <-> JavaScript.
- **iOS**:
  - ObjC <-> JSI <-> JavaScript.

## Benchmarking (Test Environment)

- React Native (RN) version: 0.63.4
- NDK Version: 22.0.x
- CMake Version: 3.10.x
- Test Device: Samsung S10

## Operations and Results

### Get String from KV Store:

- Android Shared Prefs over JSI:
  - JSI (Async - Spawn a thread on Java): ~5 MS (Min 2 MS - Max 8 MS)
  - JSI (Sync): ~2 MS (Min 1 MS - Max 3 MS)
- Async Storage: ~22 MS (Min 12 MS - Max 35 MS)
- Android Shared Pref over Bridge: ~14 MS (Min 8 MS - Max 20 MS)

### Get a Java String to JS through JNI and JSI:

- JSI: <=1 MS (Min 0 MS - Max 1 MS)
- Bridge: ~8 MS (Min 6 MS - Max 15 MS)

### Get a Java Object (Two String properties) to JS through JNI and JSI:

- JSI: <=1 MS (Min 0 MS - Max 1 MS)
- Bridge: ~14 MS (Min 10 MS - Max 18 MS)

### Query 100 Rows from Table:

- JSI (Cursor iteration on Java): ~15 MS (Min 10 MS - Max 20 MS)
- JSI (Cursor iteration on JS): ~22 MS (Min 15 MS - Max 30 MS)
- Bridge: ~45 MS (Min 30 MS - Max 60 MS)

## License

This project is licensed under the MIT License.
