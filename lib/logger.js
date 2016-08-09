import R from 'ramda';
import colors from 'colors/safe';
import pad from 'pad';
import t from 'tcomb-validation';
import {OutputFormat, DEFAULT_COLUMN_WIDTH} from './config';
import {Color, logComponents, logArray, logDivider} from './logger_helpers';
import {padOrTruncate} from './string_helpers';

// Csv
function logCsvRowNames(args:Object) {
    const {showRowIndex, rowA} = args;
    const t = R.join(',', showRowIndex ? R.prepend('row', rowA) : rowA);
    logComponents([{text: t, color: Color.GREY}]);
}

function logCsvRowValues(args:Object) {
    const {showRowIndex, rowIndex, rowA} = args;
    const t = R.join(',', showRowIndex ? R.prepend(rowIndex, rowA) : rowA);
    logComponents([{text: t, color: Color.GREY}]);
}

function logCsvRowDiff(args:Object) {
    const {rowA, rowB, rowIndex, showRowIndex} = args;
    const reduceWithIndex = R.addIndex(R.reduce);
    R.pipe(
        R.zip(rowA),
        reduceWithIndex((accum, pair, index) => {
            const [a, b] = pair;
            let c = R.equals(a, b) ? [] : [{text: b, color: Color.RED}];
            if (index < rowA.length - 1) c.push({text: ',', color: Color.GREY});
            return R.concat(accum, c);
        }, []),
        showRowIndex ? R.prepend({text: `${rowIndex}`, color: Color.GREY}) : R.identity,
        logComponents
    )(rowB);
}

// Pretty
function logPrettyRowDiff(args:Object) {
    const {width} = args;
    const full = padOrTruncate(width);
    const half = padOrTruncate(width / 2);
    const equal = (a, b) => ([
        {text: ' | ', color: Color.GREY},
        {text: full(a), color: Color.GREY}
    ]);
    const notEqual = (a, b) => ([
        {text: ' | ', color: Color.GREY},
        {text: half(a), color: Color.GREEN},
        {text: half(b), color: Color.RED}
    ]);
    logFormattedRowDiff(args, equal, notEqual);
}

function logPrettySummary(summary:Object) {
    const {differentRows, processedRows, fileA, fileB} = summary;
    logComponents([{text: ' ', color: Color.GREY}]);
    logComponents([
        {text: `found`, color: Color.GREY},
        {text: ` ${differentRows} `, color: differentRows ? Color.RED : Color.GREEN},
        {text: `different rows between `, color: Color.GREY},
        {text: `${fileA}`, color: Color.GREEN},
        {text: ` and `, color: Color.GREY},
        {text: `${fileB}`, color: Color.RED},
        {text: ` (${processedRows} processed)`, color: Color.GREY}
    ]);
}

// MD
function logMarkdownRowDiff(args:Object) {
    const {width} = args;
    const full = padOrTruncate(width);
    const equal = (a, b) => ([
        {text: ' | ', color: Color.GREY},
        {text: full(' '), color: Color.GREY}
    ]);
    const notEqual = (a, b) => ([
        {text: ' | ', color: Color.GREY},
        {text: full(b), color: Color.RED}
    ]);
    logFormattedRowDiff(args, equal, notEqual);
}

// Helpers
function logFormattedRowDiff(args:Object, equal:Function, notEqual:Function) {
    const {rowA, rowB, width, rowIndex, showRowIndex} = args;
    const full = padOrTruncate(width);
    R.pipe(
        R.zip(rowA),
        R.reduce((accum, pair) => {
            const [a, b] = pair;
            const c = R.equals(a, b) ? equal(a, b) : notEqual(a, b);
            return R.concat(accum, c);
        }, []),
        showRowIndex ? R.prepend({text: ` ${full(rowIndex)}`, color: Color.GREY}) : R.identity,
        logComponents
    )(rowB);
}

function logFormattedValuesWithDivider(args:Object) {
    const {rowA, showRowIndex, width} = args;
    logFormattedValues(args);
    logDivider(width, showRowIndex ? R.prepend('row', rowA) : rowA);
}

function logFormattedValues(args:Object) {
    const {rowA, showRowIndex, width} = args;
    R.pipe(
        showRowIndex ? R.prepend('row') : R.identity,
        logArray(width)
    )(rowA);
}

export function getLogger(format:String):Object {
    switch (format) {
        case OutputFormat.CSV:
            return {
                logNames: logCsvRowNames,
                logDiff: logCsvRowDiff,
                logValues: logCsvRowValues,
                logSummary: R.T
            };
        case OutputFormat.PRETTY:
            return {
                logNames: logFormattedValuesWithDivider,
                logDiff: logPrettyRowDiff,
                logValues: logFormattedValues,
                logSummary: logPrettySummary
            };
        case OutputFormat.MD:
            return {
                logNames: logFormattedValuesWithDivider,
                logDiff: logMarkdownRowDiff,
                logValues: logFormattedValues,
                logSummary: R.T
            };
        case OutputFormat.NONE:
        default:
            return {
                logNames: R.T,
                logDiff: R.T,
                logValues: R.T,
                logSummary: R.T
            };
    }
}
