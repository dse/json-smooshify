/*!
 * smooshify - a more vertically compact JSON stringifier.
 *
 * I wrote this because I hated slogging through large JSON documents
 * where half the lines only have an opening or closing bracket.
 *
 * Smooshify relies on JSON.stringify for strings, numbers, booleans,
 * the value null, and any object with a toJSON() method.  Its real
 * work is walking through array and object structures.
 *
 * NOTES:
 *
 * smooshify does not take a replacer argument, and does not have
 * configurable indentation.
 *
 * Smooshify does not stringify values that JSON.stringify will not
 * stringify.
 */

/*jshint esversion: 2020, strict: implied, node: true */

/**
 * Certain object and array structures deemed "simple" can be
 * stringified into one line.  This more compact smooshification
 * applies at all levels (within the limitations listed below).
 *
 * An array or object can be more compactly smooshified if all of the
 * following conditions are satisfied:
 *
 * - The array contains no more than four items (or maxArrayItems),
 *   or the object contains no more than two key-value pairs (or
 *   maxObjectKeys);
 *
 * - Each and every one of its values is a string, number, boolean,
 *   null, or an object with a toJSON() method;
 *
 * - no toJSON() calls return a string containing `\r` or `\n`
 *   or starting with `[` or `{`; and
 *
 * - The stringification will not go past the 76th column
 *   (or maxColumn).
 */
const config = {
    maxColumn: 76,
    maxArrayItems: 4,
    maxObjectKeys: 2,
};

/**
 * Given a JSON-encodable value, return a more vertically
 * compact JSON string.
 *
 * @param   {object} value    The value to stringify.
 * @param   {object} options  Reserved for future use.
 * @return  {string}          The smooshified JSON string.
 *
 * NOTE: this function accepts additional arguments intended
 * for internal use.
 */
function smooshify(value, options) {
    const column = arguments[2] ?? 0;
    const after = arguments[3] ?? 0;

    switch (typeof value) {
    case 'string':
    case 'number':
    case 'boolean':
        return JSON.stringify(value);
    case 'object':
        if (!value) {
            return 'null';
        }
        return smooshifyObject(value, options, column, after);
    }
    // returns undefined for other types
}

/** Function dedicated for smooshifying objects. */
function smooshifyObject(value, options) {
    const column = arguments[2] ?? 0;
    const after = arguments[3] ?? 0;

    if (Object.prototype.toString.apply(value) === '[object Array]') { // it's an array
        return smooshifyArray(value, options, column, after);
    }

    const keys = Object.keys(value);
    if (!keys.length) {
        return '{}';
    }

    let smooshier = config.maxObjectKeys && keys.length <= config.maxObjectKeys;
    if (smooshier && keys.some(k => !isCompactStage1(value[k]))) {
        smooshier = false;
    }
    if (smooshier) {
        const strs = [];
        for (const k of keys) {
            const kStr = JSON.stringify(k);
            const vStr = JSON.stringify(value[k]);
            if (!isCompactStage2(vStr)) {
                smooshier = false;
                break;
            }
            strs.push(kStr + ': ' + vStr);
        }
        if (smooshier) {
            const result = '{ ' + strs.join(', ') + ' }';
            if ((column + result.length + after) <= config.maxColumn) {
                return result;
            }
        }
    }
    const sep = ',\n' + ' '.repeat(column + 2);
    return '{ ' + keys.map(
        (k, i) => {
            const prefix = JSON.stringify(k) + ': ';
            const a = (i === keys.length - 1) ? (after + 2) : 1;
            return prefix + smooshify(value[k], options, column + 2 + prefix.length, a);
        }
    ).join(sep) + ' }';
}

/** Function dedicated for smooshifying arrays. */
function smooshifyArray(value, options) {
    const column = arguments[2] ?? 0;
    const after = arguments[3] ?? 0;

    if (!value.length) {
        return '[]';
    }

    let smooshier = config.maxArrayItems && value.length <= config.maxArrayItems;
    if (smooshier && value.some(v => !isCompactStage1(v))) {
        smooshier = false;
    }
    if (smooshier) {
        const strs = [];
        for (const v of value) {
            const vStr = JSON.stringify(v);
            if (!isCompactStage2(vStr)) {
                smooshier = false;
                break;
            }
            strs.push(vStr);
        }
        if (smooshier) {
            const result = '[ ' + strs.join(', ') + ' ]';
            if ((column + result.length + after) <= config.maxColumn) {
                return result;
            }
        }
    }
    const sep = ',\n' + ' '.repeat(column + 2);
    return '[ ' + value.map(
        (v, i) => {
            const a = (i === value.length - 1) ? (after + 2) : 1;
            return smooshify(v, options, column + 2, a);
        }
    ).join(sep) + ' ]';
}

function isCompactStage1(v) {
    return (typeof v === 'string' ||
            typeof v === 'number' ||
            typeof v === 'boolean' ||
            (typeof v === 'object' &&
             (!v || typeof v.toJSON === 'function')));
}

function isCompactStage2(s) {
    return !/^[\[\{]|[\r\n]/.test(s);
}

Object.assign(smooshify, {
    config,
});

module.exports = smooshify;
