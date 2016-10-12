import {expect, assert} from 'chai';
import R from 'ramda';
import fs from 'fs';
import path from 'path';
import eol from 'eol';

import {handleConfig} from '../es5/app';

function textFromFile(relativePath:String):String {
    const file = fs.readFileSync(path.join(__dirname, relativePath), 'utf8');
    return eol.auto(file);
}

describe("edge cases", () => {

    const messy_md = textFromFile('./data/messy_md.txt');
    const messy_csv = textFromFile('./data/messy_csv.txt');
    const messy_pretty = textFromFile('./data/messy_pretty.txt');
    const messy_csv_diff = textFromFile('./data/messy_csv_diff.txt');

    const newlines_md = textFromFile('./data/newlines_md.txt');
    const newlines_csv = textFromFile('./data/newlines_csv.txt');
    const newlines_pretty = textFromFile('./data/newlines_pretty.txt');
    const newlines_csv_diff = textFromFile('./data/newlines_csv_diff.txt');
    const newlines_md_diff = textFromFile('./data/newlines_md_diff.txt');
    const newlines_pretty_diff = textFromFile('./data/newlines_pretty_diff.txt');

    describe("messy files with quotes", () => {

        it("renders messy file with escaped string (md)", (done) => {
            handleConfig({
                pathA: 'test/data/messy.csv',
                rows: 0,
                output: 'md',
                width: 16,
                buildStringBuffer: true
            })
                .then(v => {
                    expect(v.stringBuffer).to.be.equal(messy_md);
                    done();
                })
                .catch(done);
        });

        it("renders messy file with escaped string (pretty)", (done) => {
            handleConfig({
                pathA: 'test/data/messy.csv',
                rows: 0,
                output: 'pretty',
                width: 16,
                buildStringBuffer: true
            })
                .then(v => {
                    expect(v.stringBuffer).to.be.equal(messy_pretty);
                    done();
                })
                .catch(done);
        });

        it("renders messy file with escaped string (csv)", (done) => {
            handleConfig({
                pathA: 'test/data/messy.csv',
                rows: 0,
                output: 'csv',
                width: 16,
                buildStringBuffer: true
            })
                .then(v => {
                    expect(v.stringBuffer).to.be.equal(messy_csv);
                    done();
                })
                .catch(done);
        });

        it("diffs messy file with escaped string (csv)", (done) => {
            handleConfig({
                pathA: 'test/data/messy.csv',
                pathB: 'test/data/messy_different.csv',
                rows: 0,
                output: 'csv',
                width: 16,
                buildStringBuffer: true
            })
                .then(v => {
                    expect(v.stringBuffer).to.be.equal(messy_csv_diff);
                    done();
                })
                .catch(done);
        });

    });

    describe("files with newlines", () => {

        it("renders file with newlines (pretty)", (done) => {
            handleConfig({
                pathA: 'test/data/newlines.csv',
                rows: 0,
                output: 'pretty',
                width: 16,
                buildStringBuffer: true
            })
                .then(v => {
                    expect(v.stringBuffer).to.be.equal(newlines_pretty);
                    done();
                })
                .catch(done);
        });

        it("renders file with newlines (md)", (done) => {
            handleConfig({
                pathA: 'test/data/newlines.csv',
                rows: 0,
                output: 'md',
                width: 16,
                buildStringBuffer: true
            })
                .then(v => {
                    expect(v.stringBuffer).to.be.equal(newlines_md);
                    done();
                })
                .catch(done);
        });

        it("renders file with newlines (csv)", (done) => {
            handleConfig({
                pathA: 'test/data/newlines.csv',
                rows: 0,
                output: 'csv',
                width: 16,
                buildStringBuffer: true
            })
                .then(v => {
                    expect(eol.auto(v.stringBuffer)).to.be.equal(newlines_csv);
                    done();
                })
                .catch(done);
        });

        it("diffs files with newlines (csv)", (done) => {
            handleConfig({
                pathA: 'test/data/newlines.csv',
                pathB: 'test/data/newlines_different.csv',
                rows: 0,
                output: 'csv',
                width: 16,
                buildStringBuffer: true
            })
                .then(v => {
                    expect(eol.auto(v.stringBuffer)).to.be.equal(newlines_csv_diff);
                    done();
                })
                .catch(done);
        });

        it("diffs files with newlines (pretty)", (done) => {
            handleConfig({
                pathA: 'test/data/newlines.csv',
                pathB: 'test/data/newlines_different.csv',
                rows: 0,
                output: 'pretty',
                width: 16,
                buildStringBuffer: true
            })
                .then(v => {
                    expect(eol.auto(v.stringBuffer)).to.be.equal(newlines_pretty_diff);
                    done();
                })
                .catch(done);
        });

        it("diffs files with newlines (md)", (done) => {
            handleConfig({
                pathA: 'test/data/newlines.csv',
                pathB: 'test/data/newlines_different.csv',
                rows: 0,
                output: 'md',
                width: 16,
                buildStringBuffer: true
            })
                .then(v => {
                    expect(eol.auto(v.stringBuffer)).to.be.equal(newlines_md_diff);
                    done();
                })
                .catch(done);
        });
    });

});