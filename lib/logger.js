import R from 'ramda';
import colors from 'colors/safe';
import pad from 'pad';
import t from 'tcomb-validation';
import {OutputFormat, DEFAULT_COLUMN_WIDTH} from './config';
import {
    Color,
    logComponents, logArray, logDivider,
    logComponentsToString, logArrayToString, logDividerToString
} from './logger_helpers';
import {padOrTruncateMarkdown, padOrTruncatePretty} from './string_helpers';

// Csv
function escapeCsvValue(value:String):String{
    return value.indexOf(',') === -1 ? value : `"${value}"`;
}

function logCsvValues(args:Object, values:Array<String>) {
    const {bufferFunction} = args;
    const escapedValues = R.map(escapeCsvValue, values);
    const t = R.join(',', escapedValues);
    const components = [{text: t, color: Color.GREY}];
    if (bufferFunction){
        bufferFunction(logComponentsToString(components));
    } else {
        logComponents(components);
    }
}

function logCsvRowNames(args:Object) {
    const {showRowIndex, rowA} = args;
    logCsvValues(args, showRowIndex ? R.prepend('row', rowA) : rowA);
}

function logCsvRowValues(args:Object) {
    const {showRowIndex, rowIndex, rowA} = args;
    logCsvValues(args, showRowIndex ? R.prepend(rowIndex, rowA) : rowA);
}

function logCsvRowDiff(args:Object) {
    const {rowA, rowB, rowIndex, showRowIndex, bufferFunction} = args;
    const reduceWithIndex = R.addIndex(R.reduce);
    R.pipe(
        R.zip(rowA),
        reduceWithIndex((accum, pair, index) => {
            const [a, b] = pair;
            let c = R.equals(a, b) ? [] : [{text: escapeCsvValue(b), color: Color.RED}];
            if (index < rowA.length - 1) c.push({text: ',', color: Color.GREY});
            return R.concat(accum, c);
        }, []),
        showRowIndex ? R.prepend({text: `${rowIndex},`, color: Color.GREY}) : R.identity,
        components => {
            if (bufferFunction){
                bufferFunction(logComponentsToString(components));
            } else {
                logComponents(components);
            }
        }
    )(rowB);
}

// Pretty
function logPrettyRowDiff(args:Object) {
    const {width} = args;
    const full = padOrTruncatePretty(width);
    const half = padOrTruncatePretty(width / 2);
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
    const {differentRows, processedRows, fileA, fileB, bufferFunction} = summary;
    if (bufferFunction){
        return;
    }
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

function logPrettyValuesWithDivider(args:Object) {
    const {rowA, showRowIndex, width, bufferFunction} = args;
    const row = showRowIndex ? R.prepend('row', rowA) : rowA;
    logPrettyValues(args);
    if (bufferFunction){
        bufferFunction(logDividerToString(width, row))
    }else{
        logDivider(width, row);
    }

}

function logPrettyValues(args:Object) {
    const {rowA, showRowIndex, width, bufferFunction} = args;
    R.pipe(
        showRowIndex ? R.prepend('row') : R.identity,
        array => {
            if (bufferFunction){
                bufferFunction(logArrayToString(width, false, array));
            }else{
                logArray(width, false, array);
            }
            return array;
        }
    )(rowA);
}

// MD
function logMarkdownRowDiff(args:Object) {
    const {width} = args;
    const full = padOrTruncateMarkdown(width);
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

function logMarkdownValues(args:Object) {
    const {rowA, showRowIndex, width, bufferFunction} = args;
    R.pipe(
        showRowIndex ? R.prepend('row') : R.identity,
        array => {
            if (bufferFunction){
                bufferFunction(logArrayToString(width, true, array));
            }else{
                logArray(width, true, array);
            }
            return array;
        }
    )(rowA);
}

// Helpers
function logFormattedRowDiff(args:Object, equal:Function, notEqual:Function) {
    const {rowA, rowB, width, rowIndex, showRowIndex, bufferFunction} = args;
    const full = padOrTruncatePretty(width);
    R.pipe(
        R.zip(rowA),
        R.reduce((accum, pair) => {
            const [a, b] = pair;
            const c = R.equals(a, b) ? equal(a, b) : notEqual(a, b);
            return R.concat(accum, c);
        }, []),
        showRowIndex ? R.prepend({text: ` ${full(rowIndex)}`, color: Color.GREY}) : R.identity,
        components => {
            if (bufferFunction){
                bufferFunction(logComponentsToString(components));
            }else{
                logComponents(components);
            }
        }
    )(rowB);
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
                logNames: logPrettyValuesWithDivider,
                logDiff: logPrettyRowDiff,
                logValues: logPrettyValues,
                logSummary: logPrettySummary
            };
        case OutputFormat.MD:
            return {
                logNames: logPrettyValuesWithDivider,
                logDiff: logMarkdownRowDiff,
                logValues: logMarkdownValues,
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
