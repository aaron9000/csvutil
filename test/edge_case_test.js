import {expect, assert} from 'chai';
import R from 'ramda';
import fs from 'fs';
import path from 'path';

import {handleConfig} from '../es5/app';

function fail(err) {
    console.log(err);
    expect(false).to.be.ok;
}

function textFromFile(relativePath:String):String {
    return fs.readFileSync(path.join(__dirname, relativePath), 'utf8');
}

describe("edge cases", () => {

    const messy_md = textFromFile('./data/messy_md.txt');
    const messy_csv = textFromFile('./data/messy_csv.txt');
    const messy_csv_diff = textFromFile('./data/messy_csv_diff.txt');
    const messy_pretty = textFromFile('./data/messy_pretty.txt');

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
                pathB: 'test/data/messy_header.csv',
                rows: 0,
                output: 'csv',
                width: 16,
                buildStringBuffer: true
            })
                .then(v => {
                    console.log(v);
                    expect(v.stringBuffer).to.be.equal(messy_csv_diff);
                    done();
                })
                .catch(done);
        });

    });

    describe("files with newlines", () => {

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


    });

});