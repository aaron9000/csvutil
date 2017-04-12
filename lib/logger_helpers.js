import R from 'ramda';
import colors from 'colors/safe';
import {padOrTruncatePretty, padOrTruncateMarkdown, repeatString} from './string_helpers';

export const Color = {
    RED: 'red',
    GREY: 'grey',
    GREEN: 'green'
};

export const log = R.curry((color:String, text:String) => {
    console.log(colors[color](text));
});

function methodForColor(color:String):Function {
    switch (color) {
        case Color.GREEN:
            return colors.green.bold;
        case Color.RED:
            return colors.red.bold;
        case Color.GREY:
        default:
            return colors.grey;
    }
}

export const logComponents = R.curry((components:Array<Object>) => {
    R.forEach(c => {
        const m = methodForColor(c.color);
        process.stdout.write(m(c.text));
    }, components);
    console.log();
});

export const logComponentsToString = R.curry((components:Array<Object>) => {
    return R.join('', R.pluck('text', components));
});

export const logDivider = R.curry((width:Number, row:Array, start:String, end:String) => {
    logComponents([{text:logDividerToString(width, row, start, end), color:Color.GREY}]);
});

export const logDividerToString = R.curry((width:Number, row:Array, start:String, end:String) => {
    const separator = repeatString('-', width + 2);
    return R.pipe(
        R.length,
        R.repeat(separator),
        R.join('|'),
        s => start + s + end,
    )(row);
});

export const logArrayToString = R.curry((width:Number, escapeValues:Boolean, start:String, end:String, row:Array):Array => {
    const reduceWithIndex = R.addIndex(R.reduce);
    const truncate = escapeValues ? padOrTruncateMarkdown : padOrTruncatePretty;
    return reduceWithIndex((accum, value, index) => {
        const a = truncate(width, value);
        return `${accum}${index > 0 ? ' | ' : ' '}${a}`;
    }, start, row) + end;
});

export const logArray = R.curry((width:Number, escapeValues:Boolean, start:String, end:String, row:Array):Array => {
    return R.pipe(
        logArrayToString(width, escapeValues, start, end),
        s => start + s + end,
        log(Color.GREY),
        () => row
    )(row);
});

