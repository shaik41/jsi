//
//  JSIInterfaceCxx.h
//  JsiPocExample
//
//  Created by Shaik Atif on 27/10/21.
//

#ifndef JSIInterfaceCxx_h
#define JSIInterfaceCxx_h

// This is the C "trampoline" function that will be used
// to invoke a specific Objective-C method FROM C++
int MyObjectDoSomethingWith (void *myObjectInstance, void *parameter);

#endif /* JSIInterfaceCxx_h */
