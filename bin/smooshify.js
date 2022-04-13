#!/usr/bin/env node
'use strict';

const fs = require('fs');
const getopt = require('posix-getopt');

const smooshify = require('../lib/smooshify');
const { config } = smooshify;

function main() {
    const cliOptions = [
        'a:(max-array-items)',
        'o:(max-object-keys)',
        'w:(width)',
        'h(help)',
    ].join('');
    const parser = new getopt.BasicParser(cliOptions, process.argv);
    let option;
    while ((option = parser.getopt()) !== undefined) {
        switch (option.option) {
        case 'a':
            {
                let x = Math.round(Number(option.optarg));
                if (isNaN(x) || x < 0) {
                    throw new Error(`invalid number of array items: ${option.optarg}`);
                }
                if (x === 0) {
                    x = Infinity;
                }
                config.maxArrayItems = x;
            }
            break;
        case 'o':
            {
                let x = Math.round(Number(option.optarg));
                if (isNaN(x) || x < 0) {
                    throw new Error(`invalid number of object keys: ${option.optarg}`);
                }
                if (x === 0) {
                    x = Infinity;
                }
                config.maxObjectKeys = x;
            }
            break;
        case 'w':
            {
                let x = Math.round(Number(option.optarg));
                if (isNaN(x) || x < 0) {
                    throw new Error(`invalid number of columns: ${option.optarg}`);
                }
                if (x === 0) {
                    x = Infinity;
                }
                config.maxColumn = x;
            }
            break;
        case 'h':
            //           0                   20                  40                  60             76
            //           |---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
            console.log(`usage:`);
            console.log(`    smooshify [<option> ...] [<filename> ...]`);
            console.log(`options:`);
            console.log(`    -h, --help`);
            console.log(`    -a, --max-array-items=<int>     max array items before newline`);
            console.log(`    -o, --max-object-keys=<int>     max object keys before newline`);
            console.log(`    -w, --max-width=<int>           max columns before newline`);
            console.log(`Specify -a0, -o0, or -w0 if you want no maximum`);
            console.log(`Specify -a1 or -o1 to force a newline after every array or object item`);
            process.exit(0);
            break;
        default:
            process.exit(1);
        }
    }
    const params = process.argv.slice(parser.optind());
    if (params.length === 0) {
        smooshifyStdin();
    } else {
        for (const filename of params) {
            smooshifyFile(filename);
        }
    }
}

function smooshifyStdin() {
    console.log(smooshify(JSON.parse(fs.readFileSync(0, 'utf-8'))));
}

function smooshifyFile(filename) {
    console.log(smooshify(JSON.parse(fs.readFileSync(filename, 'utf-8'))));
}

try {
    main();
} catch (error) {
    console.error(error.message);
    process.exit(1);
}
