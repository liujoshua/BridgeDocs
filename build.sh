#!/bin/bash

./node_modules/.bin/swagger bundle bridge-api/index.yml > _site/swagger.json
./node_modules/.bin/swagger validate _site/swagger.json
rm -rf java/
java -jar swagger-codegen-cli.jar generate -i _site/swagger.json -l java --library retrofit2 -o java/
cd java
mvn compile
