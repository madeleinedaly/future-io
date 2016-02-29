#!/usr/bin/env node

var path = require('path');
var minimist = require('minimist');
var runner = require('./lib/runner');

var argv = minimist(process.argv.slice(2));

const file = path.join(process.cwd(), argv._[0]);

runner(file);
