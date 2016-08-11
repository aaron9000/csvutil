'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.logArray = exports.logDivider = exports.logComponents = exports.log = exports.Color = undefined;

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _safe = require('colors/safe');

var _safe2 = _interopRequireDefault(_safe);

var _string_helpers = require('./string_helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Color = exports.Color = {
    RED: 'red',
    GREY: 'grey',
    GREEN: 'green'
};

var log = exports.log = _ramda2.default.curry(function (color, text) {
    console.log(_safe2.default[color](text));
});

function methodForColor(color) {
    switch (color) {
        case Color.GREEN:
            return _safe2.default.green.bold;
        case Color.RED:
            return _safe2.default.red.bold;
        case Color.GREY:
        default:
            return _safe2.default.grey;
    }
}

var logComponents = exports.logComponents = _ramda2.default.curry(function (components) {
    _ramda2.default.forEach(function (c) {
        var m = methodForColor(c.color);
        process.stdout.write(m(c.text));
    }, components);
    console.log();
});

var logDivider = exports.logDivider = _ramda2.default.curry(function (width, row) {
    var separator = (0, _string_helpers.repeatString)('-', width + 2);
    return _ramda2.default.pipe(_ramda2.default.length, _ramda2.default.repeat(separator), _ramda2.default.join('|'), function (r) {
        return logComponents([{ text: r, color: Color.GREY }]);
    })(row);
});

var logArray = exports.logArray = _ramda2.default.curry(function (width, row) {
    var reduceWithIndex = _ramda2.default.addIndex(_ramda2.default.reduce);
    return _ramda2.default.pipe(reduceWithIndex(function (accum, value, index) {
        return '' + accum + (index > 0 ? ' | ' : ' ') + (0, _string_helpers.padOrTruncate)(width, value);
    }, ''), log(Color.GREY), function () {
        return row;
    })(row);
});