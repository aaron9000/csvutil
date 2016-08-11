'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DefaultConfig = exports.OutputFormat = exports.DEFAULT_COLUMN_WIDTH = undefined;
exports.configIsValid = configIsValid;
exports.parse = parse;

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _tcombValidation = require('tcomb-validation');

var _tcombValidation2 = _interopRequireDefault(_tcombValidation);

var _clearRequire = require('clear-require');

var _clearRequire2 = _interopRequireDefault(_clearRequire);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_COLUMN_WIDTH = exports.DEFAULT_COLUMN_WIDTH = 16;
var OutputFormat = exports.OutputFormat = {
    PRETTY: 'pretty',
    CSV: 'csv',
    MD: 'md',
    NONE: 'none'
};
var OutputFormatEnum = _tcombValidation2.default.enums(_ramda2.default.invertObj(OutputFormat));
var OUTPUT_FORMAT_REGEX = /^(pretty|csv|md|none)$/i;

var Rows = _tcombValidation2.default.refinement(_tcombValidation2.default.Number, function (n) {
    return n % 1 === 0 && n >= 0;
}, 'Integer');

var COLUMN_MIN_WIDTH = 5;
var COLUMN_MAX_WIDTH = 50;
var ColumnWidth = _tcombValidation2.default.refinement(_tcombValidation2.default.Number, function (n) {
    return n % 1 === 0 && n > COLUMN_MIN_WIDTH && n <= COLUMN_MAX_WIDTH;
}, 'ColumnWidth');

var Config = _tcombValidation2.default.struct({
    pathA: _tcombValidation2.default.maybe(_tcombValidation2.default.String),
    pathB: _tcombValidation2.default.maybe(_tcombValidation2.default.String),
    rows: Rows,
    output: OutputFormatEnum,
    width: ColumnWidth
});

var DefaultConfig = exports.DefaultConfig = {
    pathA: null,
    pathB: null,
    rows: 10,
    output: 'pretty',
    width: 16
};

function stringEnumeration(enumObject) {
    return _ramda2.default.pipe(_ramda2.default.values, function (v) {
        return JSON.stringify(v);
    }, _ramda2.default.replace(/",/g, ', '), _ramda2.default.replace(/"/g, ''))(enumObject);
}

function configIsValid(config) {
    return _tcombValidation2.default.validate(config, Config).isValid();
}

function parse(args) {
    (0, _clearRequire2.default)('commander');
    var program = require('commander').version('0.0.1').option('-a, --path-a <path>', 'source csv path').option('-b, --path-b <path>', 'comparison csv path (for diff)').option('-r, --rows [n]', 'max rows to output (0 for unlimited)', parseInt).option('-o, --output [output]', 'output format ' + stringEnumeration(OutputFormat), OUTPUT_FORMAT_REGEX, DefaultConfig.format).option('-w, --width [n]', 'max width for pretty & md columns [' + COLUMN_MIN_WIDTH + ' - ' + COLUMN_MAX_WIDTH + ']', parseInt).parse(args);
    var keys = _ramda2.default.keys(Config.meta.props);
    return _ramda2.default.pipe(_ramda2.default.pickAll(keys), _ramda2.default.reduce(function (accum, value) {
        return _ramda2.default.isNil(accum[value]) ? _ramda2.default.assoc(value, DefaultConfig[value], accum) : accum;
    }, _ramda2.default.__, keys), function (c) {
        return configIsValid(c) ? c : null;
    })(program);
}