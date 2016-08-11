'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.getLogger = getLogger;

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _safe = require('colors/safe');

var _safe2 = _interopRequireDefault(_safe);

var _pad = require('pad');

var _pad2 = _interopRequireDefault(_pad);

var _tcombValidation = require('tcomb-validation');

var _tcombValidation2 = _interopRequireDefault(_tcombValidation);

var _config = require('./config');

var _logger_helpers = require('./logger_helpers');

var _string_helpers = require('./string_helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Csv
function logCsvRowNames(args) {
    var showRowIndex = args.showRowIndex;
    var rowA = args.rowA;

    var t = _ramda2.default.join(',', showRowIndex ? _ramda2.default.prepend('row', rowA) : rowA);
    (0, _logger_helpers.logComponents)([{ text: t, color: _logger_helpers.Color.GREY }]);
}

function logCsvRowValues(args) {
    var showRowIndex = args.showRowIndex;
    var rowIndex = args.rowIndex;
    var rowA = args.rowA;

    var t = _ramda2.default.join(',', showRowIndex ? _ramda2.default.prepend(rowIndex, rowA) : rowA);
    (0, _logger_helpers.logComponents)([{ text: t, color: _logger_helpers.Color.GREY }]);
}

function logCsvRowDiff(args) {
    var rowA = args.rowA;
    var rowB = args.rowB;
    var rowIndex = args.rowIndex;
    var showRowIndex = args.showRowIndex;

    var reduceWithIndex = _ramda2.default.addIndex(_ramda2.default.reduce);
    _ramda2.default.pipe(_ramda2.default.zip(rowA), reduceWithIndex(function (accum, pair, index) {
        var _pair = _slicedToArray(pair, 2);

        var a = _pair[0];
        var b = _pair[1];

        var c = _ramda2.default.equals(a, b) ? [] : [{ text: b, color: _logger_helpers.Color.RED }];
        if (index < rowA.length - 1) c.push({ text: ',', color: _logger_helpers.Color.GREY });
        return _ramda2.default.concat(accum, c);
    }, []), showRowIndex ? _ramda2.default.prepend({ text: '' + rowIndex, color: _logger_helpers.Color.GREY }) : _ramda2.default.identity, _logger_helpers.logComponents)(rowB);
}

// Pretty
function logPrettyRowDiff(args) {
    var width = args.width;

    var full = (0, _string_helpers.padOrTruncate)(width);
    var half = (0, _string_helpers.padOrTruncate)(width / 2);
    var equal = function equal(a, b) {
        return [{ text: ' | ', color: _logger_helpers.Color.GREY }, { text: full(a), color: _logger_helpers.Color.GREY }];
    };
    var notEqual = function notEqual(a, b) {
        return [{ text: ' | ', color: _logger_helpers.Color.GREY }, { text: half(a), color: _logger_helpers.Color.GREEN }, { text: half(b), color: _logger_helpers.Color.RED }];
    };
    logFormattedRowDiff(args, equal, notEqual);
}

function logPrettySummary(summary) {
    var differentRows = summary.differentRows;
    var processedRows = summary.processedRows;
    var fileA = summary.fileA;
    var fileB = summary.fileB;

    (0, _logger_helpers.logComponents)([{ text: ' ', color: _logger_helpers.Color.GREY }]);
    (0, _logger_helpers.logComponents)([{ text: 'found', color: _logger_helpers.Color.GREY }, { text: ' ' + differentRows + ' ', color: differentRows ? _logger_helpers.Color.RED : _logger_helpers.Color.GREEN }, { text: 'different rows between ', color: _logger_helpers.Color.GREY }, { text: '' + fileA, color: _logger_helpers.Color.GREEN }, { text: ' and ', color: _logger_helpers.Color.GREY }, { text: '' + fileB, color: _logger_helpers.Color.RED }, { text: ' (' + processedRows + ' processed)', color: _logger_helpers.Color.GREY }]);
}

// MD
function logMarkdownRowDiff(args) {
    var width = args.width;

    var full = (0, _string_helpers.padOrTruncate)(width);
    var equal = function equal(a, b) {
        return [{ text: ' | ', color: _logger_helpers.Color.GREY }, { text: full(' '), color: _logger_helpers.Color.GREY }];
    };
    var notEqual = function notEqual(a, b) {
        return [{ text: ' | ', color: _logger_helpers.Color.GREY }, { text: full(b), color: _logger_helpers.Color.RED }];
    };
    logFormattedRowDiff(args, equal, notEqual);
}

// Helpers
function logFormattedRowDiff(args, equal, notEqual) {
    var rowA = args.rowA;
    var rowB = args.rowB;
    var width = args.width;
    var rowIndex = args.rowIndex;
    var showRowIndex = args.showRowIndex;

    var full = (0, _string_helpers.padOrTruncate)(width);
    _ramda2.default.pipe(_ramda2.default.zip(rowA), _ramda2.default.reduce(function (accum, pair) {
        var _pair2 = _slicedToArray(pair, 2);

        var a = _pair2[0];
        var b = _pair2[1];

        var c = _ramda2.default.equals(a, b) ? equal(a, b) : notEqual(a, b);
        return _ramda2.default.concat(accum, c);
    }, []), showRowIndex ? _ramda2.default.prepend({ text: ' ' + full(rowIndex), color: _logger_helpers.Color.GREY }) : _ramda2.default.identity, _logger_helpers.logComponents)(rowB);
}

function logFormattedValuesWithDivider(args) {
    var rowA = args.rowA;
    var showRowIndex = args.showRowIndex;
    var width = args.width;

    logFormattedValues(args);
    (0, _logger_helpers.logDivider)(width, showRowIndex ? _ramda2.default.prepend('row', rowA) : rowA);
}

function logFormattedValues(args) {
    var rowA = args.rowA;
    var showRowIndex = args.showRowIndex;
    var width = args.width;

    _ramda2.default.pipe(showRowIndex ? _ramda2.default.prepend('row') : _ramda2.default.identity, (0, _logger_helpers.logArray)(width))(rowA);
}

function getLogger(format) {
    switch (format) {
        case _config.OutputFormat.CSV:
            return {
                logNames: logCsvRowNames,
                logDiff: logCsvRowDiff,
                logValues: logCsvRowValues,
                logSummary: _ramda2.default.T
            };
        case _config.OutputFormat.PRETTY:
            return {
                logNames: logFormattedValuesWithDivider,
                logDiff: logPrettyRowDiff,
                logValues: logFormattedValues,
                logSummary: logPrettySummary
            };
        case _config.OutputFormat.MD:
            return {
                logNames: logFormattedValuesWithDivider,
                logDiff: logMarkdownRowDiff,
                logValues: logFormattedValues,
                logSummary: _ramda2.default.T
            };
        case _config.OutputFormat.NONE:
        default:
            return {
                logNames: _ramda2.default.T,
                logDiff: _ramda2.default.T,
                logValues: _ramda2.default.T,
                logSummary: _ramda2.default.T
            };
    }
}