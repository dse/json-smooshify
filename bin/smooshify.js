#!/usr/bin/env node
'use strict';

const fs = require('fs');

const smooshify = require('../lib/smooshify');

const params = process.argv.slice(2);
if (params.length === 0) {
    smooshifyStdin();
} else {
    for (const filename of params) {
        smooshifyFile(filename);
    }
}

function smooshifyStdin() {
    console.log(smooshify(JSON.parse(fs.readFileSync(0, 'utf-8'))));
}

function smooshifyFile(filename) {
    console.log(smooshify(JSON.parse(fs.readFileSync(filename, 'utf-8'))));
}
