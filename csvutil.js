#!/usr/bin/env node
require('babel-register')({
    presets: ["es2015", "stage-0", "react"]
});
require("./lib/index.js");