# json-smooshify

A somewhat vertically compact JSON stringifier.

## Installation

    npm install --save @smallllama/json-smooshify

## Usage

    const smooshify = require('@smallllama/json-smooshify');

    console.log(smooshify(value));

## The smooshify function

    const smooshed = smooshify(value, options);

The `value` argument is any value that can be `JSON.stringify()`ed.

The `options` argument is reserved for future use.

The return value is a JSON-compatible string.

### Example

    const o = {
        "name": "@smallllama/json-smooshify",
        "version": "1.0.0",
        "description": "Compact JSON output.",
        "main": "lib/smooshify.js",
        "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1"
        },
        "bin": {
            "smooshify": "bin/smooshify.js"
        },
        "keywords": [
            "json",
            "stringify",
            "compact",
            "smooshify"
        ],
        "author": "dse@webonastick.com",
        "license": "ISC",
        "dependencies": {
            "posix-getopt": "^1.2.1"
        }
    };

    console.log(smooshify(o));

### Example Smooshified Output

    { "name": "@smallllama/json-smooshify",
      "version": "1.0.0",
      "description": "Compact JSON output.",
      "main": "lib/smooshify.js",
      "scripts": { "test": "echo \"Error: no test specified\" && exit 1" },
      "bin": { "smooshify": "bin/smooshify.js" },
      "keywords": [ "json", "stringify", "compact", "smooshify" ],
      "author": "dse@webonastick.com",
      "license": "ISC",
      "dependencies": { "posix-getopt": "^1.2.1" } }

## Command-Line Utility

Running the following will install a `smooshify` utility that takes
JSON in and re-stringifies it:

    npm install -g @smallllama/json-smooshify

To read JSON from stdin and re-stringify it to stdout, run `smooshify`
with no parameters:

    cat foo.js | smooshify 
    smooshify < foo.js

To read JSON from one or more files, concatenating each re-stringified
result to stdout:

    smooshify package.json package-lock.json
