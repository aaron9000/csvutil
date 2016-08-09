import {handleConfig} from './lib/index';
import {parse} from './lib/config';

handleConfig(parse(process.argv))
    .then(v => {})
    .catch(err => {
        console.log(err.message);
        console.log(`see 'csvutil --help' for usage details`)
    });