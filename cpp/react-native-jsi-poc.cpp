#include "react-native-jsi-poc.h"
#include <iostream>

using namespace facebook;
using namespace std;

void installJsiPoc(jsi::Runtime &rt){
    // Generic type in JSI. Now you got to cast it based on requirement
    // jsi::Value val
    //manuplating JS using C++
    //Have validations on runtime.
    auto multipliyNumber =[] (jsi::Runtime &rt, const jsi::Value &thisValue, const jsi::Value *args, size_t count) -> jsi::Value{

        // Check if we have proper argumennts
        if(count> 2) {
            jsi::detail::throwJSError(rt, "Too many enough arguments");
            //Send a null value
            return jsi::Value(nullptr);
        }

        // Check if we have proper argumennts
        if(!args[0].isNumber() || !args[1].isNumber()) {
            jsi::detail::throwJSError(rt, "Please pass a valid argument. Expected Number");
            return jsi::Value::undefined();
        }

        int a = args[0].asNumber();
        int b = args[1].asNumber();



        //Sample casting to string
        //string exampleString = args[0].asString(rt).utf8(rt)

        //Sample to get an object property
        //jsi::Object obj =args[0].asObject(rt);
        //string value1 = obj.getProperty(rt, "test");


        return jsi::Value(a * b);

    };



    // Look at JSI.h in react-native library code. To see avaiable methods, etc.
    // Also look at jsi.cpp to see implementation. Transaltion to an instance etc.
    // createFromHost. Creates a JSI fucntion based on laungaue your using to code. Here its c++
    // here we created a function to add()
    // implementations are lamda functions
    jsi::Function displayNumber  = jsi::Function::createFromHostFunction(rt, jsi::PropNameID::forAscii(rt, "displayNumber"), 0,[](jsi::Runtime &rt, const jsi::Value &thisValue, const jsi::Value *args, size_t count) -> jsi::Value{
        return jsi::Value(7);
    });

    jsi::Function multiply = jsi::Function::createFromHostFunction(rt, jsi::PropNameID::forAscii(rt, "multiply"), 2, multipliyNumber);



    //Global scope of javascript. here we can add properties
    // Can be called from anywhere in the app.
    // Here we are adding a property to  global
    // jisAddition: number/function/object.
    // move to JS context
    // the context of add fucntion was install
    // we need to move it JS context. Why?
    // When ever c++ finshes runnign its mem gets deallocated.
    // if you don't tell compiler or manage peropery the function will disappear.
    // Hence the function is lost
    // Hence to fix this we need to move. This will move to JS memory space.
    rt.global().setProperty(rt, "jsiDisplayValue", move(displayNumber));
    rt.global().setProperty(rt, "jsiMultiply", move(multiply));
};

void cleanUpJsiPoc(){

};

int multiplyFromiOS(int a, int b) {
    return a * b ;
};
