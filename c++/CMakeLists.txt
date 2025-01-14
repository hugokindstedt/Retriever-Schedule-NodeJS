cmake_minimum_required(VERSION 3.10)

project(schema-app)

set(CMAKE_CXX_STANDARD 17)

# Add all your source files
set(SOURCES
    IcalParser.cpp
    IcalEvent.cpp
)

# Add an executable target
add_executable(main ${SOURCES})
