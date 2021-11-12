#import "JsiPoc.h"
#import "react-native-jsi-poc.h"
#import <React/RCTBridge+Private.h>
#import <jsi/jsi.h>
#import <React/RCTUtils.h>
#import <ReactCommon/CallInvoker.h>
#import <memory>
#import <sys/utsname.h>
#import "JSIUtils.h"

@implementation JsiPoc

using namespace facebook::jsi;
using namespace std;

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()

//We are telling React that our module requires setup on Main Queue.
+ (BOOL) requiresMainQueueSetup {
    return YES;
}

//We are getting an instance of bridge which we will use to get the runtime and install our jsi bindings. 
// Inside it we are checking if bridge.runtime exists or not. 
// If it does not, we are waiting for sometime and then trying again until the bridge.runtime becomes available.
- (void)setBridge:(RCTBridge *)bridge{
    _bridge = bridge;
    _setBridgeOnMainQueue = RCTIsMainQueue();

    RCTCxxBridge *cxxBridge = (RCTCxxBridge *) self.bridge;

    if(!cxxBridge.runtime){
        return;
    }

    installJsiPoc(*(facebook::jsi::Runtime *)cxxBridge.runtime);
    
    installOSMethods(*(facebook::jsi::Runtime *)cxxBridge.runtime, self);
}

- (void) invalidate {
    cleanUpJsiPoc();
}


- (NSString *) getModel {
    struct utsname systemInfo;
    uname(&systemInfo);
    
    return [NSString stringWithCString:systemInfo.machine encoding:NSUTF8StringEncoding];
}

- (void) setItem:(NSString * )key :(NSString *)value {
    NSUserDefaults *standardUserDefaults = [NSUserDefaults standardUserDefaults];
    [standardUserDefaults setObject:value forKey:key];
    [standardUserDefaults synchronize];
}

- (NSString *)getItem:(NSString *)key {
    NSUserDefaults *standardUserDefaults = [NSUserDefaults standardUserDefaults];
    return [standardUserDefaults stringForKey:key];
}

void installOSMethods(jsi::Runtime &jsiRuntime, JsiPoc *jsiPoc) {
    auto getDeviceName = Function::createFromHostFunction(jsiRuntime,
                                                          PropNameID::forAscii(jsiRuntime,
                                                                               "getDeviceName"),
                                                          0, 
                                                          [jsiPoc](Runtime &runtime,
                                                                   const Value &thisValue,
                                                                   const Value *arguments,
                                                                   size_t count) -> Value {
        
        jsi::String deviceName = convertNSStringToJSIString(runtime, [jsiPoc getModel]);
        
        return Value(runtime, deviceName);
    });
    
    jsiRuntime.global().setProperty(jsiRuntime, "getDeviceName", move(getDeviceName));
    
    auto setItem = Function::createFromHostFunction(jsiRuntime,
                                                    PropNameID::forAscii(jsiRuntime,
                                                                         "setItem"),
                                                    2,
                                                    [jsiPoc](Runtime &runtime,
                                                             const Value &thisValue,
                                                             const Value *arguments,
                                                             size_t count) -> Value {
        
        NSString *key = convertJSIStringToNSString(runtime, arguments[0].getString(runtime));
        NSString *value = convertJSIStringToNSString(runtime, arguments[1].getString(runtime));
        
        [jsiPoc setItem:key :value];
        
        return Value(true);
    });
    
    jsiRuntime.global().setProperty(jsiRuntime, "setItem", move(setItem));
    
    
    auto getItem = Function::createFromHostFunction(jsiRuntime,
                                                    PropNameID::forAscii(jsiRuntime,
                                                                         "getItem"),
                                                    0,
                                                    [jsiPoc](Runtime &runtime,
                                                             const Value &thisValue,
                                                             const Value *arguments,
                                                             size_t count) -> Value {
        
        NSString *key = convertJSIStringToNSString(runtime, arguments[0].getString(runtime));
        
        NSString *value = [jsiPoc getItem:key];
        
        return Value(runtime, convertNSStringToJSIString(runtime, value));
    });
    
    jsiRuntime.global().setProperty(jsiRuntime, "getItem", move(getItem));
    
    
    
}



@end
