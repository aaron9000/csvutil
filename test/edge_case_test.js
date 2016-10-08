import {expect, assert} from 'chai';
import R from 'ramda';
import fs from 'fs';
import path from 'path';

import {handleConfig} from '../es5/app';

function fail(err) {
    expect(false).to.be.ok;
}

function textFromFile(relativePath:String):String{
    return fs.readFileSync(path.join(__dirname, relativePath), 'utf8');
}

describe("edge cases", () => {

    const messy_md = textFromFile('./data/messy_md.txt');

    describe.only("diff", () => {

        it("compares renders messy file with escaped string (md)", (done) => {
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
                .catch(() => done('fail'));
        });

        //it("returns error for two nonexistent files", (done) => {
        //    handleConfig({
        //        pathA: 'foo.csv',
        //        pathB: 'bar.csv',
        //        rows: 0,
        //        output: 'none',
        //        width: 16
        //
        //    })
        //        .then(x => done('fail'))
        //        .catch(err => {
        //            expect(err).to.be.ok;
        //            done();
        //        });
        //});

    });

});