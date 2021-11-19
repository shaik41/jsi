#include <jni.h>
#include "react-native-jsi-poc.h"
#include "jsi/jsi.h"
#include "pthread.h"
#include <sys/types.h>
#include "thread"
#include <chrono>

using namespace facebook::jsi;
using namespace std;

JavaVM *java_vm;
jclass java_class;
jobject java_object;
jobject cursorObject;
jclass cursor_object_class;

JNIEnv *jniEnvTest;
jmethodID getMoveToFirstMethodID;
jmethodID getMoveToNextMethodID;
jmethodID getIntMethodID;
jmethodID getStringMethodID;
jmethodID getColumnIndexMethodID;
jmethodID closeMethodID;
Runtime *runT;

/**
* A simple callback function that allows us to detach current JNI Environment
* when the thread
* See https://stackoverflow.com/a/30026231 for detailed explanation
*/

void DeferThreadDetach(JNIEnv *env) {
    static pthread_key_t thread_key;

    // Set up a Thread Specific Data key, and a callback that
    // will be executed when a thread is destroyed.
    // This is only done once, across all threads, and the value
    // associated with the key for any given thread will initially
    // be NULL.
    static auto run_once = [] {
        const auto err = pthread_key_create(&thread_key, [](void *ts_env) {
            if (ts_env) {
                java_vm->DetachCurrentThread();
            }
        });
        if (err) {
            // Failed to create TSD key. Throw an exception if you want to.
        }
        return 0;
    }();

    // For the callback to actually be executed when a thread exits
    // we need to associate a non-NULL value with the key on that thread.
    // We can use the JNIEnv* as that value.
    const auto ts_env = pthread_getspecific(thread_key);
    if (!ts_env) {
        if (pthread_setspecific(thread_key, env)) {
            // Failed to set thread-specific value for key. Throw an exception if you
            // want to.
        }
    }
}

/**
* Get a JNIEnv* valid for this thread, regardless of whether
* we're on a native thread or a Java thread.
* If the calling thread is not currently attached to the JVM
* it will be attached, and then automatically detached when the
* thread is destroyed.
*
* See https://stackoverflow.com/a/30026231 for detailed explanation
*/
JNIEnv *GetJniEnv() {
    JNIEnv *env = nullptr;
    // We still call GetEnv first to detect if the thread already
    // is attached. This is done to avoid setting up a DetachCurrentThread
    // call on a Java thread.

    // g_vm is a global.
    auto get_env_result = java_vm->GetEnv((void **) &env, JNI_VERSION_1_6);
    if (get_env_result == JNI_EDETACHED) {
        if (java_vm->AttachCurrentThread(&env, NULL) == JNI_OK) {
            DeferThreadDetach(env);
        } else {
            // Failed to attach thread. Throw an exception if you want to.
        }
    } else if (get_env_result == JNI_EVERSION) {
        // Unsupported JNI version. Throw an exception if you want to.
    }
    return env;
}


static jstring string2jstring(JNIEnv *env, const string &str) {
    return (*env).NewStringUTF(str.c_str());
}

void installFromAndroid(facebook::jsi::Runtime &jsiRuntime) {

    auto getDeviceName = Function::createFromHostFunction(
            jsiRuntime, PropNameID::forAscii(jsiRuntime, "getDeviceName"), 0,
            [](Runtime &runtime, const Value &thisValue, const Value *arguments,
               size_t count) -> Value {

                JNIEnv *jniEnv = GetJniEnv();

                java_class = jniEnv->GetObjectClass(java_object);
                jmethodID getModel =
                        jniEnv->GetMethodID(java_class, "getModel", "()Ljava/lang/String;");
                jobject result = jniEnv->CallObjectMethod(java_object, getModel);
                const char *str = jniEnv->GetStringUTFChars((jstring) result, NULL);

                return Value(runtime, String::createFromUtf8(runtime, str));

            });


    jsiRuntime.global().setProperty(jsiRuntime, "getDeviceName",
                                    move(getDeviceName));

    auto setItem = Function::createFromHostFunction(jsiRuntime,
                                                    PropNameID::forAscii(jsiRuntime,
                                                                         "setItem"),
                                                    2,
                                                    [](Runtime &runtime,
                                                       const Value &thisValue,
                                                       const Value *arguments,
                                                       size_t count) -> Value {

                                                        string key = arguments[0].getString(
                                                                runtime).utf8(runtime);
                                                        string value = arguments[1].getString(
                                                                runtime).utf8(runtime);

                                                        JNIEnv *jniEnv = GetJniEnv();

                                                        java_class = jniEnv->GetObjectClass(
                                                                java_object);


                                                        jmethodID set = jniEnv->GetMethodID(
                                                                java_class, "setItem",
                                                                "(Ljava/lang/String;Ljava/lang/String;)V");

                                                        jstring jstr1 = string2jstring(jniEnv,
                                                                                       key);
                                                        jstring jstr2 = string2jstring(jniEnv,
                                                                                       value);
                                                        jvalue params[2];
                                                        params[0].l = jstr1;
                                                        params[1].l = jstr2;

                                                        jniEnv->CallVoidMethodA(
                                                                java_object, set, params);

                                                        return Value(true);

                                                    });

    jsiRuntime.global().setProperty(jsiRuntime, "setItem", move(setItem));


    auto getItem = Function::createFromHostFunction(jsiRuntime,
                                                    PropNameID::forAscii(jsiRuntime,
                                                                         "getItem"),
                                                    2,
                                                    [](Runtime &runtime,
                                                       const Value &thisValue,
                                                       const Value *arguments,
                                                       size_t count) -> Value {

                                                        string key = arguments[0].getString(
                                                                        runtime)
                                                                .utf8(
                                                                        runtime);

                                                        JNIEnv *jniEnv = GetJniEnv();

                                                        auto obj = arguments[1].getObject(runtime);



                                                        runtime.global().setProperty(runtime,
                                                                                     "callback",
                                                                                     move(obj));

                                                        java_class = jniEnv->GetObjectClass(
                                                                java_object);
                                                        jmethodID get = jniEnv->GetMethodID(
                                                                java_class, "getItem",
                                                                "(Ljava/lang/String;)Ljava/lang/String;");

                                                        jstring jstr1 = string2jstring(jniEnv,
                                                                                       key);
                                                        jvalue params[2];
                                                        params[0].l = jstr1;

                                                        jniEnv->CallObjectMethodA(
                                                                java_object, get, params);

                                                        return Value();

                                                    });

    jsiRuntime.global().setProperty(jsiRuntime, "getItem", move(getItem));


    auto getMessageFromJSI = Function::createFromHostFunction(
            jsiRuntime, PropNameID::forAscii(jsiRuntime, "getMessageFromJSI"), 0,
            [](Runtime &runtime, const Value &thisValue, const Value *arguments,
               size_t count) -> Value {

                JNIEnv *jniEnv = GetJniEnv();

                java_class = jniEnv->GetObjectClass(java_object);
                jmethodID getModel =
                        jniEnv->GetMethodID(java_class, "getJSIMessage", "()Ljava/lang/String;");
                jobject result = jniEnv->CallObjectMethod(java_object, getModel);
                const char *str = jniEnv->GetStringUTFChars((jstring) result, NULL);

                return Value(runtime, String::createFromUtf8(runtime, str));

            });

    jsiRuntime.global().setProperty(jsiRuntime, "getMessageFromJSI", move(getMessageFromJSI));


    auto getObjectFromJava = Function::createFromHostFunction(
            jsiRuntime, PropNameID::forAscii(jsiRuntime, "getObjectFromJava"), 0,
            [](Runtime &runtime, const Value &thisValue, const Value *arguments,
               size_t count) -> Value {

                JNIEnv *jniEnv = GetJniEnv();

                java_class = jniEnv->GetObjectClass(java_object);
                jmethodID getModel =
                        jniEnv->GetMethodID(java_class, "getObjectFromJava",
                                            "()Lcom/reactnativejsipoc/jsi/JsiPocModule$Person;");
                jobject result = jniEnv->CallObjectMethod(java_object, getModel);

                jclass myJclass = jniEnv->GetObjectClass(result);

                //For name
                jfieldID name = jniEnv->GetFieldID(myJclass, "Name", "Ljava/lang/String;");
                jobject nameVal = jniEnv->GetObjectField(result, name);
                const char *strNameValue = jniEnv->GetStringUTFChars((jstring) nameVal, NULL);
                //For Age
                jfieldID age = jniEnv->GetFieldID(myJclass, "Age", "Ljava/lang/String;");
                jobject ageVal = jniEnv->GetObjectField(result, age);
                const char *strAgeValue = jniEnv->GetStringUTFChars((jstring) ageVal, NULL);


                Object obj = Object(runtime);
                obj.setProperty(runtime, "Name", String::createFromUtf8(runtime, strNameValue));
                obj.setProperty(runtime, "Age", String::createFromUtf8(runtime, strAgeValue));
                return Value(runtime, obj);

            });

    jsiRuntime.global().setProperty(jsiRuntime, "getObjectFromJava", move(getObjectFromJava));


    auto getItemSync = Function::createFromHostFunction(jsiRuntime,
                                                        PropNameID::forAscii(jsiRuntime,
                                                                             "getItemSync"),
                                                        1,
                                                        [](Runtime &runtime,
                                                           const Value &thisValue,
                                                           const Value *arguments,
                                                           size_t count) -> Value {

                                                            string key = arguments[0].getString(
                                                                            runtime)
                                                                    .utf8(
                                                                            runtime);

                                                            JNIEnv *jniEnv = GetJniEnv();

                                                            java_class = jniEnv->GetObjectClass(
                                                                    java_object);
                                                            jmethodID get = jniEnv->GetMethodID(
                                                                    java_class, "getItemSync",
                                                                    "(Ljava/lang/String;)Ljava/lang/String;");

                                                            jstring jstr1 = string2jstring(jniEnv,
                                                                                           key);
                                                            jvalue params[1];
                                                            params[0].l = jstr1;

                                                            jobject result = jniEnv->CallObjectMethodA(
                                                                    java_object, get, params);

                                                            const char *str = jniEnv->GetStringUTFChars(
                                                                    (jstring) result, NULL);

                                                            return Value(runtime,
                                                                         String::createFromUtf8(
                                                                                 runtime, str));
                                                        });

    jsiRuntime.global().setProperty(jsiRuntime, "getItemSync", move(getItemSync));

    auto addStudentsToTable = Function::createFromHostFunction(jsiRuntime,
                                                               PropNameID::forAscii(jsiRuntime,
                                                                                    "addStudentsToTable"),
                                                               1,
                                                               [](Runtime &runtime,
                                                                  const Value &thisValue,
                                                                  const Value *arguments,
                                                                  size_t count) -> Value {

                                                                   JNIEnv *jniEnv = GetJniEnv();

                                                                   java_class = jniEnv->GetObjectClass(
                                                                           java_object);


                                                                   jmethodID set = jniEnv->GetMethodID(
                                                                           java_class,
                                                                           "createStudents",
                                                                           "()V");

                                                                   jniEnv->CallVoidMethod(
                                                                           java_object, set);

                                                                   return Value(true);

                                                               });

    jsiRuntime.global().setProperty(jsiRuntime, "addStudentsToTable", move(addStudentsToTable));


    auto getStudents = Function::createFromHostFunction(jsiRuntime,
                                                        PropNameID::forAscii(jsiRuntime,
                                                                             "getStudent"),
                                                        0,
                                                        [](Runtime &runtime,
                                                           const Value &thisValue,
                                                           const Value *arguments,
                                                           size_t count) -> Value {

                                                            Array objectArray = Array(runtime, 100);

                                                            JNIEnv *jniEnv = GetJniEnv();

                                                            java_class = jniEnv->GetObjectClass(
                                                                    java_object);

                                                            jmethodID methodID = jniEnv->GetMethodID(
                                                                    java_class, "getAllStudents",
                                                                    "()[Lcom/reactnativejsipoc/db/Student;");


                                                            jobjectArray studentObjectArray = (jobjectArray) jniEnv->CallObjectMethod(
                                                                    java_object, methodID);

                                                            for (int i = 0; i < 100; i++) {
                                                                jvalue paramsForStudent[1];
                                                                paramsForStudent[0].i = i;
                                                                jobject studentObject = jniEnv->GetObjectArrayElement(
                                                                        studentObjectArray, i);

                                                                jclass studentClass = jniEnv->GetObjectClass(
                                                                        studentObject);

                                                                //For name
                                                                jfieldID name = jniEnv->GetFieldID(
                                                                        studentClass, "name",
                                                                        "Ljava/lang/String;");
                                                                jobject nameVal = jniEnv->GetObjectField(
                                                                        studentObject, name);
                                                                const char *strNameValue = jniEnv->GetStringUTFChars(
                                                                        (jstring) nameVal, NULL);
                                                                //For timestamp
                                                                jfieldID timeStamp = jniEnv->GetFieldID(
                                                                        studentClass, "timestamp",
                                                                        "Ljava/lang/String;");
                                                                jobject timeStampVal = jniEnv->GetObjectField(
                                                                        studentObject, timeStamp);
                                                                const char *strTimestampValue = jniEnv->GetStringUTFChars(
                                                                        (jstring) timeStampVal,
                                                                        NULL);
                                                                //For id
                                                                jfieldID id = jniEnv->GetFieldID(
                                                                        studentClass, "id", "I");
                                                                jint idValue = jniEnv->GetIntField(
                                                                        studentObject, id);


                                                                Object obj = Object(runtime);
                                                                obj.setProperty(runtime, "name",
                                                                                String::createFromUtf8(
                                                                                        runtime,
                                                                                        strNameValue));
                                                                obj.setProperty(runtime,
                                                                                "timestamp",
                                                                                String::createFromUtf8(
                                                                                        runtime,
                                                                                        strTimestampValue));
                                                                obj.setProperty(runtime, "id",
                                                                                Value(idValue));

                                                                objectArray.setValueAtIndex(runtime,
                                                                                            i, obj);
                                                            }

                                                            return Value(runtime, objectArray);
                                                        });

    jsiRuntime.global().setProperty(jsiRuntime, "getStudents", move(getStudents));




    auto getStudentsCursor = Function::createFromHostFunction(jsiRuntime,
                                                        PropNameID::forAscii(jsiRuntime,
                                                                             "getStudentsCursor"),
                                                        0,
                                                        [](Runtime &runtime,
                                                           const Value &thisValue,
                                                           const Value *arguments,
                                                           size_t count) -> Value {

                                                            Array objectArray = Array(runtime, 100);

                                                            JNIEnv *jniEnv = GetJniEnv();
                                                            jniEnvTest = jniEnv;

                                                            java_class = jniEnv->GetObjectClass(
                                                                    java_object);

                                                            jmethodID methodID = jniEnv->GetMethodID(
                                                                    java_class, "getAllStudentsCursor",
                                                                    "()Landroid/database/Cursor;");


                                                            cursorObject =  jniEnv->CallObjectMethod(
                                                                    java_object, methodID);

                                                            cursor_object_class = jniEnv->GetObjectClass(
                                                                    cursorObject);

                                                            getMoveToFirstMethodID = jniEnvTest->GetMethodID(
                                                                    cursor_object_class, "moveToFirst",
                                                                    "()Z");

                                                            getMoveToNextMethodID = jniEnvTest->GetMethodID(
                                                                    cursor_object_class, "moveToNext",
                                                                    "()Z");

                                                            getIntMethodID = jniEnvTest->GetMethodID(
                                                                    cursor_object_class, "getInt",
                                                                    "(I)I");

                                                            getStringMethodID = jniEnvTest->GetMethodID(
                                                                    cursor_object_class, "getString",
                                                                    "(I)Ljava/lang/String;");

                                                            getColumnIndexMethodID = jniEnvTest->GetMethodID(
                                                                    cursor_object_class, "getColumnIndex",
                                                                    "(Ljava/lang/String;)I");

                                                            closeMethodID = jniEnvTest->GetMethodID(
                                                                    cursor_object_class, "close",
                                                                    "()V");

                                                            auto moveToFirst = Function::createFromHostFunction(runtime,
                                                                                                                      PropNameID::forAscii(runtime,
                                                                                                                                           "moveToFirst"),
                                                                                                                      0,
                                                                                                                      [](Runtime &runtime,
                                                                                                                         const Value &thisValue,
                                                                                                                         const Value *arguments,
                                                                                                                         size_t count) -> Value{


                                                                                                                          jboolean moveToFirst = jniEnvTest->CallBooleanMethod(cursorObject,getMoveToFirstMethodID);
                                                                                                                          bool moveToFirstJNI =  (bool)(moveToFirst == JNI_TRUE);
                                                                                                                          return Value(moveToFirstJNI);
                                                                                                                      });

                                                            auto moveToNext = Function::createFromHostFunction(runtime,
                                                                                                                PropNameID::forAscii(runtime,
                                                                                                                                     "moveToNext"),
                                                                                                                0,
                                                                                                                [](Runtime &runtime,
                                                                                                                   const Value &thisValue,
                                                                                                                   const Value *arguments,
                                                                                                                   size_t count) -> Value{


                                                                                                                    jboolean moveToNext = jniEnvTest->CallBooleanMethod(cursorObject,getMoveToNextMethodID);
                                                                                                                   bool moveToNextJNI =  (bool)(moveToNext == JNI_TRUE);
                                                                                                                    return Value(moveToNextJNI);
                                                                                                                });


                                                            auto getInt = Function::createFromHostFunction(runtime,
                                                                                                                PropNameID::forAscii(runtime,
                                                                                                                                     "getInt"),
                                                                                                                1,
                                                                                                                [](Runtime &runtime,
                                                                                                                   const Value &thisValue,
                                                                                                                   const Value *arguments,
                                                                                                                   size_t count) -> Value{


                                                                                                                    string key = arguments[0].getString(
                                                                                                                                    runtime)
                                                                                                                            .utf8(
                                                                                                                                    runtime);

                                                                                                                    jstring jstr1 = string2jstring(jniEnvTest,
                                                                                                                                                   key);
                                                                                                                    jvalue params2[1];
                                                                                                                    params2[0].l = jstr1;

                                                                                                                    jint columnIndex = jniEnvTest->CallIntMethodA(cursorObject,getColumnIndexMethodID,params2);


                                                                                                                    jvalue params[1];
                                                                                                                    params[0].i = columnIndex;

                                                                                                                    jint intValue = jniEnvTest->CallIntMethodA(cursorObject,getIntMethodID,params);

                                                                                                                    return Value(intValue);
                                                                                                                });

                                                            auto getString = Function::createFromHostFunction(runtime,
                                                                                                           PropNameID::forAscii(runtime,
                                                                                                                                "getString"),
                                                                                                           1,
                                                                                                           [](Runtime &runtime,
                                                                                                              const Value &thisValue,
                                                                                                              const Value *arguments,
                                                                                                              size_t count) -> Value{
                                                                                                               string key = arguments[0].getString(
                                                                                                                               runtime)
                                                                                                                       .utf8(
                                                                                                                               runtime);

                                                                                                               jstring jstr1 = string2jstring(jniEnvTest,
                                                                                                                                              key);
                                                                                                               jvalue params2[1];
                                                                                                               params2[0].l = jstr1;

                                                                                                               jint columnIndex = jniEnvTest->CallIntMethodA(cursorObject,getColumnIndexMethodID,params2);


                                                                                                               jvalue params[1];
                                                                                                               params[0].i = columnIndex;

                                                                                                               jobject stringValueJNI = jniEnvTest->CallObjectMethodA(cursorObject,getStringMethodID,params);
                                                                                                               const char *stringVal = jniEnvTest->GetStringUTFChars(
                                                                                                                       (jstring) stringValueJNI,
                                                                                                                       NULL);

                                                                                                               return Value(runtime, String::createFromUtf8(
                                                                                                                       runtime, stringVal));
                                                                                                           });



                                                            auto getColumnIndex = Function::createFromHostFunction(runtime,
                                                                                                           PropNameID::forAscii(runtime,
                                                                                                                                "getColumnIndex"),
                                                                                                           1,
                                                                                                           [](Runtime &runtime,
                                                                                                              const Value &thisValue,
                                                                                                              const Value *arguments,
                                                                                                              size_t count) -> Value{

                                                                                                               string key = arguments[0].getString(
                                                                                                                               runtime)
                                                                                                                       .utf8(
                                                                                                                               runtime);

                                                                                                               jstring jstr1 = string2jstring(jniEnvTest,
                                                                                                                                              key);
                                                                                                               jvalue params[1];
                                                                                                               params[0].l = jstr1;

                                                                                                               jint columnIndex = jniEnvTest->CallIntMethodA(cursorObject,getColumnIndexMethodID,params);

                                                                                                               return Value(columnIndex);
                                                                                                           });
                                                            auto close = Function::createFromHostFunction(runtime,
                                                                                                               PropNameID::forAscii(runtime,
                                                                                                                                    "close"),
                                                                                                               0,
                                                                                                               [](Runtime &runtime,
                                                                                                                  const Value &thisValue,
                                                                                                                  const Value *arguments,
                                                                                                                  size_t count) -> Value{


                                                                                                                   jniEnvTest->CallVoidMethod(cursorObject,closeMethodID);
                                                                                                                   return Value();
                                                                                                               });

                                                            Object obj = Object(runtime);
                                                            obj.setProperty(runtime,"moveToFirst",move(moveToFirst));
                                                            obj.setProperty(runtime,"getColumnIndex",move(getColumnIndex));
                                                            obj.setProperty(runtime,"getInt",move(getInt));
                                                            obj.setProperty(runtime,"getString",move(getString));
                                                            obj.setProperty(runtime,"moveToNext",move(moveToNext));
                                                            obj.setProperty(runtime,"close",move(close));

                                                            return Value(runtime, obj);
                                                        });

    jsiRuntime.global().setProperty(jsiRuntime, "getStudentsCursor", move(getStudentsCursor));




}

using namespace std::chrono;

void sendValueToJS(jsi::Runtime &rt, jstring message) {
    JNIEnv *jniEnv = GetJniEnv();
    const char *str = jniEnv->GetStringUTFChars((jstring) message, NULL);
    rt.global().getProperty(rt, "callback").getObject(rt).getFunction(rt).call(rt, Value(rt,
                                                                                         String::createFromUtf8(
                                                                                                 rt,
                                                                                                 str)));
}

extern "C"
JNIEXPORT void JNICALL
Java_com_reactnativejsipoc_jsi_JsiPocModule_nativeInstall(JNIEnv *env, jobject thiz, jlong jsi) {
    auto runtime = reinterpret_cast<facebook::jsi::Runtime *>(jsi);
    runT = runtime;
    if (runtime) {
        installJsiPoc(*runtime);
        installFromAndroid(*runtime);
    }

    env->GetJavaVM(&java_vm);
    java_object = env->NewGlobalRef(thiz);
}
extern "C"
JNIEXPORT void JNICALL
Java_com_reactnativejsipoc_jsi_JsiPocModule_setMessage(JNIEnv *env, jobject thiz, jstring message) {
    sendValueToJS(*runT, message);
}
