import fs from 'fs';
import R from 'ramda';
import Rx from 'rx';
import RxNode from 'rx-node';
import Promise from 'bluebird';
import csv from 'csv';
import eol from 'eol';

import {getLogger} from './logger';
import {parse, configIsValid} from './config';

function observableForReadstream(readStream:String):Object {
    return R.pipe(
        s => s.pipe(csv.parse({delimiter: ','})),
        RxNode.fromReadableStream.bind(RxNode)
    )(readStream);
}

function observableTupleForFile(filePath:String):Object {
    const readStream = fs.createReadStream(filePath);
    return {
        observable: observableForReadstream(readStream),
        closeStream: () => {
            readStream.push('');
        }
    };
}

function twoRowsAreEqualIgnoringLineEndings(rowA:Object, rowB:Object):Boolean{
    const mapper = R.map(v => {
       return eol.auto(v.toString());
    });
    const a = mapper(rowA);
    const b = mapper(rowB);
    return R.equals(a, b);
}

function observableTupleForFiles(filePathA:String, filePathB:String):Object {
    let count = 0;
    const a = observableTupleForFile(filePathA);
    const b = observableTupleForFile(filePathB);
    const observable = Rx.Observable.zip(
        a.observable,
        b.observable,
        (rowA, rowB) => {
            if (count === 0 && !twoRowsAreEqualIgnoringLineEndings(rowA, rowB)) {
                throw new Error('header rows do not match');
            }
            count++;
            return {rowA, rowB};
        }
    );
    return {
        observable,
        closeStream: () => {
            a.closeStream();
            b.closeStream();
        }
    };
}

function fileExists(filePath:String, argumentName:String):Promise<Boolean> {
    const f = filePath || ``;
    return new Promise((resolve, reject) => {
        fs.access(f, fs.F_OK, (err) => {
            if (err) {
                reject(new Error(`${argumentName}: file at '${f}' not accessible`));
            } else {
                resolve(true);
            }
        });
    });
}

export function render(config:Object):Promise<Object> {

    const {pathA, rows, output, width, buildStringBuffer} = config;

    // State
    let rowCount = 0;
    let renderCount = 0;
    let stringBuffer = '';

    // Handlers
    const {logHeader, logValues} = getLogger(output);
    const handleRow = rowA => {
        const args = {
            rowA,
            width,
            bufferFunction: buildStringBuffer ? str => {
                stringBuffer += str + '\n';
            } : null,
            rowIndex: rowCount,
            showRowIndex: false
        };
        if (rowCount === 0) {
            logHeader(args);
        } else {
            logValues(args);
            renderCount++;
        }
        rowCount++;
        return rowA;
    };

    return fileExists(pathA, 'path-a')
        .then(() => new Promise((resolve, reject) => {
            const {observable, closeStream} = observableTupleForFile(pathA);
            const shouldTake = () => {
                const take = (rowCount < rows + 1 || rows <= 0);
                if (!take) {
                    closeStream();
                }
                return take;
            };
            const handleError = err => {
                reject(err)
            };
            const handleCompletion = () => {
                resolve({
                    success: true,
                    rendered_rows: renderCount,
                    fileA: pathA,
                    stringBuffer
                });
            };
            observable.takeWhile(shouldTake)
                .subscribe(handleRow, handleError, handleCompletion);
        }));
}

export function diff(config:Object):Promise<Object> {

    const {pathA, pathB, rows, output, width, buildStringBuffer} = config;

    // State
    let rowCount = 0;
    let diffCount = 0;
    let stringBuffer = '';

    // Handlers
    const {logHeader, logDiff, logSummary} = getLogger(output);
    const handleTuple = tuple => {
        const {rowA, rowB} = tuple;
        const rowsAreEqual = R.equals(rowA, rowB);
        const args = {
            rowA,
            rowB,
            width,
            bufferFunction: buildStringBuffer ? str => {
                stringBuffer += str + '\n';
            } : null,
            rowIndex: rowCount,
            showRowIndex: true
        };
        if (rowCount === 0) {
            logHeader(args);
        } else if (!rowsAreEqual) {
            logDiff(args);
            diffCount++;
        }
        rowCount++;
        return tuple;
    };

    return Promise.join(fileExists(pathA, 'path-a'), fileExists(pathB, 'path-b'))
        .then(() => new Promise((resolve, reject) => {
            const {observable, closeStream} = observableTupleForFiles(pathA, pathB);
            const handleError = err => {
                reject(err)
            };
            const shouldTake = () => {
                const take = (diffCount < rows || rows <= 0);
                if (!take) {
                    closeStream();
                }
                return take;
            };
            const handleCompletion = () => {
                const summary = {
                    success: true,
                    processedRows: rowCount,
                    differentRows: diffCount,
                    fileA: pathA,
                    fileB: pathB,
                    stringBuffer
                };
                logSummary(summary);
                resolve(summary);
            };
            observable
                .takeWhile(shouldTake)
                .subscribe(handleTuple, handleError, handleCompletion);
        }));
}

export function handleConfig(config:Object):Promise {
    if (!configIsValid(config)) return Promise.reject(new Error(`invalid config`));
    return config.pathB ? diff(config) : render(config);
}