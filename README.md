Bridge (Sage Bionetworks)
=========================================

[![Build Status](https://travis-ci.org/Sage-Bionetworks/BridgeDocs.svg?branch=release)](https://travis-ci.org/Sage-Bionetworks/BridgeDocs)

Bridge developer portal website.

This is a jekyll-based site, see: https://jekyllrb.com/ for further instructions.

## Swagger API documentation

This CLI command will build the swagger JSON and then validate it to ensure it's correct.

```
./node_modules/.bin/swagger bundle bridge-api/index.yml > swagger.json; ./node_modules/.bin/swagger validate swagger.json
``` 

It can then be viewed through the site:

```
bundler exec jekyll server
```