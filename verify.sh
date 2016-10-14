#!/bin/bash

./node_modules/.bin/swagger bundle bridge-api/index.yml > swagger.json
./node_modules/.bin/swagger validate swagger.json
if [ $? -eq 0 ]
then
  echo "Successfully validated swagger.json"
else
  echo "swagger.json invalid"
  exit 1
fi
rm -rf java/
java -jar swagger-codegen-cli.jar generate -i swagger.json -l java --library retrofit2 -o java/
cd java
mvn compile
mvn javadoc:javadoc
if [ $? -eq 0 ]
then
  echo "Successfully validated swagger.json"
else
  echo "swagger.json invalid"
  exit 1
fi
cd ../
# rm -rf java/
# rm swagger-codegen-cli.jar
# rm -rf node_modules/
bundle exec jekyll build
