/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import "JSIInterfaceCxx.h"

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>

@property (nonatomic, strong) UIWindow *window;

@end

// An Objective-C class that needs to be accessed from C++
@interface MyObject : NSObject
{
    int someVar;
}

// The Objective-C member function you want to call from C++
- (int) doSomethingWith:(void *) aParameter;
@end
