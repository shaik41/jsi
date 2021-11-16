#ifndef react_native_jsi_poc_h
#define react_native_jsi_poc_h

#include <jsi/jsi.h>
#include <jsi/jsilib.h>

using namespace facebook;

void installJsiPoc(jsi::Runtime &rt);

void cleanUpJsiPoc();

#endif /* EXAMPLE_H */
