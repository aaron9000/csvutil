#!/usr/bin/env node
require('babel-register')({
    presets: ["es2015", "stage-0", "react"],
    ignore: /node_modules/
});
require("./lib/index.js");