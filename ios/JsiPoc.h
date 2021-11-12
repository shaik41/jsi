#import <React/RCTBridgeModule.h>
#import "react-native-jsi-poc.h"

@interface JsiPoc : NSObject <RCTBridgeModule>

// We are adding a property here, setBridgeOnMainQueue which tells React to set the bridge on main queue. 
// This results in setBridge being called in our module with the bridge.
@property(nonatomic, assign) BOOL setBridgeOnMainQueue;

@end
