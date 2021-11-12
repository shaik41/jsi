cmake_minimum_required(VERSION 3.9.0)

set (CMAKE_VERBOSE_MAKEFILE ON)
set (CMAKE_CXX_STANDARD 11)

add_library(jsi-poc
            SHARED
            ../example/node_modules//react-native/ReactCommon/jsi/jsi/jsi.cpp
            ../cpp/react-native-jsi-poc.cpp
            ./cpp-adapter.cpp
)

include_directories(
            ../example/node_modules/react-native/React
            ../example/node_modules/react-native/React/Base
            ../example/node_modules/react-native/ReactCommon/jsi
            ../cpp
)

set_target_properties(
        jsi-poc PROPERTIES
        CXX_STANDARD 17
        CXX_EXTENSIONS OFF
        POSITION_INDEPENDENT_CODE ON
)

target_link_libraries(
        jsi-poc
        android
)
