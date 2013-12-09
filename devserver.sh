#!/bin/bash

#mvn -q clean package

java -cp src/main/resources/:target/schlagdenprof-2.0.0-SNAPSHOT.jar:src/main/resources/ eu.wltr.schlagdenprof.SchlagDenProf example_data
