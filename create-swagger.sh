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