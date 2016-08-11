'use strict';

var _app = require('./app');

var _config = require('./config');

(0, _app.handleConfig)((0, _config.parse)(process.argv)).then(function (v) {}).catch(function (err) {
    console.log(err.message);
    console.log('see \'csvutil --help\' for usage details');
});