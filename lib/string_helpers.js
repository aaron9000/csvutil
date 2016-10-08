import R from 'ramda';
import pad from 'pad';

export const isNilOrWhitespace = function(str:String):Boolean{
    return !str || !str.replace(/\s/g, '').length;
};

export const repeatString = R.curry((str:String, repetitions:Number):String => {
    return R.repeat(str, repetitions).join('');
});

const ELIPSIS_LENGTH = 3;
const ELIPSIS = repeatString('.', ELIPSIS_LENGTH);
export const truncate = R.curry((length:Number, s:String):String => {
    const l = Math.max(length, ELIPSIS_LENGTH);
    const substring = s.substring(0, (l - ELIPSIS_LENGTH));
    return `${substring}${ELIPSIS}`;
});

export const padOrTruncatePretty = R.curry((length:Number, str:String):String => {
    const l = Math.max(length, ELIPSIS_LENGTH);
    const s = String(str).replace(/(?:\r\n|\r|\n)/g, ' ');
    return (!s || s.length < l) ? pad(l, s) : truncate(l, s);
});

export const padOrTruncateMarkdown = R.curry((length:Number, str:String):String => {
    if (isNilOrWhitespace(str)){
        return repeatString(' ', length);
    }
    return "`" + padOrTruncatePretty(length - 2, str) + "`";
});
