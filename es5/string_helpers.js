'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.padOrTruncate = exports.truncate = exports.repeatString = undefined;

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _pad = require('pad');

var _pad2 = _interopRequireDefault(_pad);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var repeatString = exports.repeatString = _ramda2.default.curry(function (str, repetitions) {
    return _ramda2.default.repeat(str, repetitions).join('');
});

var ELIPSIS_LENGTH = 3;
var ELIPSIS = repeatString('.', ELIPSIS_LENGTH);
var truncate = exports.truncate = _ramda2.default.curry(function (length, s) {
    var l = Math.max(length, ELIPSIS_LENGTH);
    var substring = s.substring(0, l - ELIPSIS_LENGTH);
    return '' + substring + ELIPSIS;
});

var padOrTruncate = exports.padOrTruncate = _ramda2.default.curry(function (length, str) {
    var l = Math.max(length, ELIPSIS_LENGTH);
    var s = String(str);
    return !s || s.length < l ? (0, _pad2.default)(l, s) : truncate(l, s);
});