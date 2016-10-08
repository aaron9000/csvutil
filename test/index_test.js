import {expect, assert} from 'chai';
import R from 'ramda';

import {handleConfig} from '../es5/app';

describe("index", () => {

    describe("diff", () => {

        describe('functionality', () => {

            it("return error for invalid config", (done) => {
                handleConfig({
                    a: 'asdf'
                })
                    .then(x => done('fail'))
                    .catch(err => {
                        expect(err.message).to.be.equal(`invalid config`);
                        expect(err).to.be.ok;
                        done();
                    });
            });

            it("compares two valid files", (done) => {
                handleConfig({
                    pathA: 'test/data/sample_a.csv',
                    pathB: 'test/data/sample_b.csv',
                    rows: 0,
                    output: 'none',
                    width: 16
                })
                    .then(v => {
                        expect(v).to.be.ok;
                        done();
                    })
                    .catch(done);
            });

            it("returns error for two nonexistent files", (done) => {
                handleConfig({
                    pathA: 'foo.csv',
                    pathB: 'bar.csv',
                    rows: 0,
                    output: 'none',
                    width: 16

                })
                    .then(x => done('fail'))
                    .catch(err => {
                        expect(err).to.be.ok;
                        done();
                    });
            });

            it("return error for badly ordered columns", (done) => {
                handleConfig({
                    pathA: 'test/data/sample_a.csv',
                    pathB: 'test/data/reordered_columns.csv',
                    rows: 0,
                    output: 'none',
                    width: 16
                })
                    .then(x => done('fail'))
                    .catch(err => {
                        expect(err.message).to.be.equal('header rows do not match');
                        expect(err).to.be.ok;
                        done();
                    });
            });

            it("return error for badly named columns", (done) => {
                handleConfig({
                    pathA: 'test/data/sample_a.csv',
                    pathB: 'test/data/wrong_columns.csv',
                    rows: 0,
                    output: 'none',
                    width: 16
                })
                    .then(x => done('fail'))
                    .catch(err => {
                        expect(err.message).to.be.equal('header rows do not match');
                        expect(err).to.be.ok;
                        done();
                    });
            });

            it("return error for invalid file", (done) => {
                handleConfig({
                    pathA: 'test/data/not_a_csv.csv',
                    pathB: 'test/data/sample_b.csv',
                    rows: 0,
                    output: 'none',
                    width: 16
                })
                    .then(x => done('fail'))
                    .catch(err => {
                        expect(err.message).to.be.equal('header rows do not match');
                        expect(err).to.be.ok;
                        done();
                    });
            });

            it("return error for file with inconsistent columns", (done) => {
                handleConfig({
                    pathA: 'test/data/sample_a_corrupt.csv',
                    pathB: 'test/data/sample_b.csv',
                    rows: 0,
                    output: 'none',
                    width: 16
                })
                    .then(x => done('fail'))
                    .catch(err => {
                        expect(err.message).to.be.equal('Number of columns is inconsistent on line 4');
                        expect(err).to.be.ok;
                        done();
                    });
            });

            it("processes the smallest number of rows between different length files", (done) => {
                handleConfig({
                    pathA: 'test/data/long.csv',
                    pathB: 'test/data/sample_b.csv',
                    rows: 0,
                    output: 'none',
                    width: 16
                })
                    .then(v => {
                        expect(v).to.be.ok;
                        expect(v.processedRows).to.equal(9);
                        expect(v.differentRows).to.equal(3);
                        done();
                    })
                    .catch(done);
            });

            it("respects max lines", (done) => {
                handleConfig({
                    pathA: 'test/data/sample_a.csv',
                    pathB: 'test/data/sample_b.csv',
                    rows: 2,
                    output: 'none',
                    width: 16
                })
                    .then(v => {
                        expect(v).to.be.ok;
                        expect(v.differentRows).to.equal(2);
                        done();
                    })
                    .catch(done);
            });
        });

        describe('output', function () {
            it("renders a csv diff (2 differences)", (done) => {
                handleConfig({
                    pathA: 'test/data/sample_a.csv',
                    pathB: 'test/data/sample_b.csv',
                    rows: 2,
                    output: 'csv',
                    width: 16
                })
                    .then(v => {
                        expect(v).to.be.ok;
                        done();
                    })
                    .catch(done);
            });
            it("renders a csv diff (0 differences)", (done) => {
                handleConfig({
                    pathA: 'test/data/sample_a.csv',
                    pathB: 'test/data/sample_a.csv',
                    rows: 2,
                    output: 'csv',
                    width: 16
                })
                    .then(v => {
                        expect(v).to.be.ok;
                        done();
                    })
                    .catch(done);
            });
            it("renders a pretty diff (2 differences)", (done) => {
                handleConfig({
                    pathA: 'test/data/sample_a.csv',
                    pathB: 'test/data/sample_b.csv',
                    rows: 2,
                    output: 'pretty',
                    width: 14
                })
                    .then(v => {
                        expect(v).to.be.ok;
                        done();
                    })
                    .catch(done);
            });

            it("renders a pretty diff (0 differences)", (done) => {
                handleConfig({
                    pathA: 'test/data/sample_a.csv',
                    pathB: 'test/data/sample_a.csv',
                    rows: 2,
                    output: 'pretty',
                    width: 12
                })
                    .then(v => {
                        expect(v).to.be.ok;
                        done();
                    })
                    .catch(done);
            });

            it("renders a md diff (2 differences)", (done) => {
                handleConfig({
                    pathA: 'test/data/sample_a.csv',
                    pathB: 'test/data/sample_b.csv',
                    rows: 2,
                    output: 'md',
                    width: 14
                })
                    .then(v => {
                        expect(v).to.be.ok;
                        done();
                    })
                    .catch(done);
            });

            it("renders a md diff (0 differences)", (done) => {
                handleConfig({
                    pathA: 'test/data/sample_a.csv',
                    pathB: 'test/data/sample_a.csv',
                    rows: 2,
                    output: 'md',
                    width: 12
                })
                    .then(v => {
                        expect(v).to.be.ok;
                        done();
                    })
                    .catch(done);
            });
        });
    });

    describe("render", () => {

        describe('functionality', () => {

            it("return error for invalid config", (done) => {
                handleConfig({
                    a: 'asdf'
                })
                    .then(x => done('fail'))
                    .catch(err => {
                        expect(err.message).to.be.equal(`invalid config`);
                        expect(err).to.be.ok;
                        done();
                    });
            });

            it("renders a valid file", (done) => {
                handleConfig({
                    pathA: 'test/data/sample_a.csv',
                    pathB: null,
                    rows: 0,
                    output: 'none',
                    width: 16
                })
                    .then(v => {
                        expect(v).to.be.ok;
                        done();
                    })
                    .catch(done);
            });

            it("renders a large valid file", (done) => {
                handleConfig({
                    pathA: 'test/data/huge.csv',
                    pathB: null,
                    rows: 10,
                    output: 'none',
                    width: 16
                })
                    .then(v => {
                        expect(v).to.be.ok;
                        done();
                    })
                    .catch(done);
            });

            it("returns error for nonexistent file", (done) => {
                handleConfig({
                    pathA: 'foo.csv',
                    pathB: null,
                    rows: 0,
                    output: 'none',
                    width: 16

                })
                    .then(x => done('fail'))
                    .catch(err => {
                        expect(err.message).to.be.equal(`path-a: file at 'foo.csv' not accessible`);
                        expect(err).to.be.ok;
                        done();
                    });
            });

            it("return error for file with inconsistent columns", (done) => {
                handleConfig({
                    pathA: 'test/data/sample_a_corrupt.csv',
                    pathB: null,
                    rows: 0,
                    output: 'none',
                    width: 16
                })
                    .then(x => done('fail'))
                    .catch(err => {
                        expect(err.message).to.be.equal('Number of columns is inconsistent on line 4');
                        expect(err).to.be.ok;
                        done();
                    });
            });

            it("respects max lines", (done) => {
                handleConfig({
                    pathA: 'test/data/sample_a.csv',
                    pathB: null,
                    rows: 2,
                    output: 'none',
                    width: 16
                })
                    .then(v => {
                        expect(v).to.be.ok;
                        expect(v.rendered_rows).to.equal(2);
                        done();
                    })
                    .catch(done);
            });
        });

        describe('output', function(){

            it("renders csv output", (done) => {
                handleConfig({
                    pathA: 'test/data/sample_a.csv',
                    pathB: null,
                    rows: 2,
                    output: 'csv',
                    width: 16
                })
                    .then(v => {
                        expect(v).to.be.ok;
                        done();
                    })
                    .catch(done);
            });
            it("renders pretty output", (done) => {
                handleConfig({
                    pathA: 'test/data/sample_a.csv',
                    pathB: null,
                    rows: 2,
                    output: 'pretty',
                    width: 14
                })
                    .then(v => {
                        expect(v).to.be.ok;
                        done();
                    })
                    .catch(done);
            });
            it("renders markdown output", (done) => {
                handleConfig({
                    pathA: 'test/data/sample_a.csv',
                    pathB: null,
                    rows: 2,
                    output: 'md',
                    width: 12
                })
                    .then(v => {
                        expect(v).to.be.ok;
                        done();
                    })
                    .catch(done);
            });

        });

    });

});