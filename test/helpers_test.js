import {expect, assert} from 'chai';
import R from 'ramda';
import {repeatString, truncate, padOrTruncatePretty, padOrTruncateMarkdown} from '../es5/string_helpers';

describe("string_helper", () => {
    it("repeats strings", () => {
        expect(repeatString('*', 0)).to.equal('');
        expect(repeatString('*', 3)).to.equal('***');
        expect(repeatString('*a', 1)).to.equal('*a');
    });

    it("truncates strings and adds ...", () => {
        expect(truncate(5, 'aaaaaa')).to.equal('aa...');
        expect(truncate(2, 'aaaaaa')).to.equal('...');
        expect(truncate(4, 'abcdefg')).to.equal('a...');
    });

    it("normalizes any string (pretty)", () => {
        expect(padOrTruncatePretty(9, 'abcdefg')).to.equal('  abcdefg');
        expect(padOrTruncatePretty(3, 'abcdefg')).to.equal('...');
    });

    it("normalizes any string (markdown)", () => {
        expect(padOrTruncateMarkdown(9, 'abcdefg')).to.equal('`abcd...`');
        expect(padOrTruncateMarkdown(3, 'abcdefg')).to.equal('`...`');
        expect(padOrTruncateMarkdown(5, '')).to.equal('     ');
        expect(padOrTruncateMarkdown(5, '  ')).to.equal('     ');
        expect(padOrTruncateMarkdown(5, null)).to.equal('     ');
    });
});
