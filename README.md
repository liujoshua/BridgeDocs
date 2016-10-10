Bridge (Sage Bionetworks)
=========================================

[![Build Status](https://travis-ci.org/Sage-Bionetworks/BridgeDocs.svg?branch=release)](https://travis-ci.org/Sage-Bionetworks/BridgeDocs)

Bridge developer portal website.

This is a jekyll-based site, see: https://jekyllrb.com/ for further instructions. To view the output of any changes, you can run the following command (Ruby and bundler must be installed), and then open a web browser:

```
bundler exec jekyll server
```

## Swagger API documentation

We're documenting our API using Swagger, and planning on generating the base Java REST SDK from the 
Swagger documentation. Consequently, additions to the bridge-api/ folder are checked during the 
Travis build to ensure the swagger.json is valid and the file can produce compilable Java files.

The `build.sh` Bash script will convert the YAML files to the JSON file and then perform all these 
validations. It is similar to what happens during the Travis build.

## Valid Swagger

There are a few limitations on the use of Swagger since we are generating Java class files from it (not all valid Swagger definitions are valid Java definitions);

### Super types

A type can only include one super-type, which is expressed with the `allOf` annotation. There can only be one `$ref` to another type (the super-type), and then whatever additions the type makes.

### Sub types

Sub-types are needed to deserialize JSON correctly. The super type defines a `discriminator` property pointing out a field that defines the sub-type (we use `type` everwhere except UploadFieldDefinition, where the value was used for something else... it's too late to fix this, but that type isn't sub-classed so this is only a problem for systems needing this type information). **Then the property itself should be defined in all the sub-types, not the parent type.**

```yml
Constraints:
    type: object
    discriminator: type

BooleanConstraints:
    allOf:
        - $ref: ./constraints.yml
        - properties:
            type:
                type: string
                enum: [BooleanConstraints]
```

Note above that Swagger defines a fixed type through the use of an enum with only one value.
