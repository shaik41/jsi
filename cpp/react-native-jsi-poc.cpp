#include "react-native-jsi-poc.h"
#include <iostream>

using namespace facebook;
using namespace std;

void installJsiPoc(jsi::Runtime &rt) {
    auto multiplyNumber = [](jsi::Runtime &rt, const jsi::Value &thisValue, const jsi::Value *args,
                             size_t count) -> jsi::Value {

        // Check if we have proper args
        if (count > 2) {
            jsi::detail::throwJSError(rt, "Too many enough arguments");
            //Send a null value
            return jsi::Value(nullptr);
        }

        // Check if we have proper args
        if (!args[0].isNumber() || !args[1].isNumber()) {
            jsi::detail::throwJSError(rt, "Please pass a valid argument. Expected Number");
            return jsi::Value::undefined();
        }

        int a = args[0].asNumber();
        int b = args[1].asNumber();


        return jsi::Value(a * b);

    };


    jsi::Function displayNumber = jsi::Function::createFromHostFunction(rt,
                                                                        jsi::PropNameID::forAscii(
                                                                                rt,
                                                                                "displayNumber"), 0,
                                                                        [](jsi::Runtime &rt,
                                                                           const jsi::Value &thisValue,
                                                                           const jsi::Value *args,
                                                                           size_t count) -> jsi::Value {
                                                                            return jsi::Value(7);
                                                                        });

    jsi::Function multiply = jsi::Function::createFromHostFunction(rt, jsi::PropNameID::forAscii(rt,
                                                                                                 "multiply"),
                                                                   2, multiplyNumber);

    rt.global().setProperty(rt, "jsiDisplayValue", move(displayNumber));
    rt.global().setProperty(rt, "jsiMultiply", move(multiply));
};

void cleanUpJsiPoc() {

};

