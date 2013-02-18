#!/usr/bin/env node

var cli = require('cli').enable('glob');

//Running `./glob.js *.js` will output a list of .js files in this directory
console.log(cli.args);