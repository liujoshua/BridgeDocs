#!/bin/bash

./node_modules/.bin/swagger validate _site/swagger.json
if [ $? -eq 0 ]
then
  echo "Successfully validated swagger.json"
else
  echo "swagger.json invalid"
  exit 1
fi
rm -rf java/
java -jar swagger-codegen-cli.jar generate -i _site/swagger.json -l java --library retrofit2 -o java/
cd java
mvn compile
mvn javadoc:javadoc

