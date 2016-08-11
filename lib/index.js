import {handleConfig} from './app';
import {parse} from './config';

handleConfig(parse(process.argv))
    .then(v => {})
    .catch(err => {
        console.log(err.message);
        console.log(`see 'csvutil --help' for usage details`)
    });