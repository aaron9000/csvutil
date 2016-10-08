import {expect, assert} from 'chai';
import R from 'ramda';

import {handleConfig} from '../es5/app';

function fail(err) {
    expect(false).to.be.ok;
}

describe("edge cases", () => {

    describe("diff", () => {

        it("compares renders messy file with escaped string (md)", (done) => {
            handleConfig({
                pathA: 'test/data/sample_a.csv',
                rows: 0,
                output: 'none',
                width: 16,
                buildStringBuffer: true
            })
                .then(v => {
                    expect(v).to.be.ok;
                    done();
                })
                .catch(x => done('fail'));
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