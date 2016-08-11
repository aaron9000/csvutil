'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.render = render;
exports.diff = diff;
exports.handleConfig = handleConfig;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _rx = require('rx');

var _rx2 = _interopRequireDefault(_rx);

var _rxNode = require('rx-node');

var _rxNode2 = _interopRequireDefault(_rxNode);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _csv = require('csv');

var _csv2 = _interopRequireDefault(_csv);

var _logger = require('./logger');

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function observableForFile(filePath) {
    return _ramda2.default.pipe(_fs2.default.createReadStream, function (s) {
        return s.pipe(_csv2.default.parse({ delimiter: ',' }));
    }, _rxNode2.default.fromReadableStream.bind(_rxNode2.default))(filePath);
}

function observableForFiles(filePathA, filePathB) {
    var count = 0;
    return _rx2.default.Observable.zip(observableForFile(filePathA), observableForFile(filePathB), function (rowA, rowB) {
        if (count === 0 && !_ramda2.default.equals(rowA, rowB)) {
            throw new Error('header rows do not match');
        }
        count++;
        return { rowA: rowA, rowB: rowB };
    });
}

function fileExists(filePath, argumentName) {
    var f = filePath || '';
    return new _bluebird2.default(function (resolve, reject) {
        _fs2.default.access(f, _fs2.default.F_OK, function (err) {
            if (err) {
                reject(new Error(argumentName + ': file at \'' + f + '\' not accessible'));
            } else {
                resolve(true);
            }
        });
    });
}

function render(config) {
    var pathA = config.pathA;
    var rows = config.rows;
    var output = config.output;
    var width = config.width;

    // State

    var rowCount = 0;
    var renderCount = 0;

    // Handlers

    var _getLogger = (0, _logger.getLogger)(output);

    var logNames = _getLogger.logNames;
    var logValues = _getLogger.logValues;

    var shouldTake = function shouldTake() {
        return renderCount < rows || rows <= 0;
    };
    var handleRow = function handleRow(rowA) {
        var args = {
            rowA: rowA,
            width: width,
            rowIndex: rowCount,
            showRowIndex: false
        };
        if (rowCount === 0) {
            logNames(args);
        } else {
            logValues(args);
            renderCount++;
        }
        rowCount++;
        return rowA;
    };

    return fileExists(pathA, 'path-a').then(function () {
        return new _bluebird2.default(function (resolve, reject) {
            var handleError = function handleError(err) {
                reject(err);
            };
            var handleCompletion = function handleCompletion() {
                resolve({
                    success: true,
                    rendered_rows: renderCount,
                    fileA: pathA
                });
            };
            observableForFile(pathA).takeWhile(shouldTake).subscribe(handleRow, handleError, handleCompletion);
        });
    });
}

function diff(config) {
    var pathA = config.pathA;
    var pathB = config.pathB;
    var rows = config.rows;
    var output = config.output;
    var width = config.width;

    // State

    var rowCount = 0;
    var diffCount = 0;

    // Handlers

    var _getLogger2 = (0, _logger.getLogger)(output);

    var logNames = _getLogger2.logNames;
    var logDiff = _getLogger2.logDiff;
    var logSummary = _getLogger2.logSummary;

    var shouldTake = function shouldTake() {
        return diffCount < rows || rows <= 0;
    };
    var handleTuple = function handleTuple(tuple) {
        var rowA = tuple.rowA;
        var rowB = tuple.rowB;

        var rowsAreEqual = _ramda2.default.equals(rowA, rowB);
        var args = {
            rowA: rowA,
            rowB: rowB,
            width: width,
            rowIndex: rowCount,
            showRowIndex: true
        };
        if (rowCount === 0) {
            logNames(args);
        } else if (!rowsAreEqual) {
            logDiff(args);
            diffCount++;
        }
        rowCount++;
        return tuple;
    };

    return _bluebird2.default.join(fileExists(pathA, 'path-a'), fileExists(pathB, 'path-b')).then(function () {
        return new _bluebird2.default(function (resolve, reject) {
            var handleError = function handleError(err) {
                reject(err);
            };
            var handleCompletion = function handleCompletion() {
                var summary = {
                    success: true,
                    processedRows: rowCount,
                    differentRows: diffCount,
                    fileA: pathA,
                    fileB: pathB
                };
                logSummary(summary);
                resolve(summary);
            };
            observableForFiles(pathA, pathB).takeWhile(shouldTake).subscribe(handleTuple, handleError, handleCompletion);
        });
    });
}

function handleConfig(config) {
    if (!(0, _config.configIsValid)(config)) return _bluebird2.default.reject(new Error('invalid config'));
    return config.pathB ? diff(config) : render(config);
}