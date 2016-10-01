import {handleConfig} from './app';
import {parse} from './config';

handleConfig(parse(process.argv))
    .then(v => {
        process.exit();
    })
    .catch(err => {
        console.log(err.message);
        console.log(`see 'csvutil --help' for usage details`)
    });