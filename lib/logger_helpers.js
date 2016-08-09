import R from 'ramda';
import colors from 'colors/safe';
import {padOrTruncate, repeatString} from './string_helpers';

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

export const logDivider = R.curry((width:Number, row:Array) => {
    const separator = repeatString('-', width + 2);
    return R.pipe(
        R.length,
        R.repeat(separator),
        R.join('|'),
        r => logComponents([{text:r, color:Color.GREY}])
    )(row);
});

export const logArray = R.curry((width:Number, row:Array):Array => {
    const reduceWithIndex = R.addIndex(R.reduce);
    return R.pipe(
        reduceWithIndex((accum, value, index) => {
            return `${accum}${index > 0 ? ' | ' : ' '}${padOrTruncate(width, value)}`;
        }, ''),
        log(Color.GREY),
        () => row
    )(row);
});

