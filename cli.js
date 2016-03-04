#!/usr/bin/env node

var R = require('ramda');
var fork = require('fork-future');
var run = require('./lib/runner');
var report = require('./lib/reporter');
var io = require('./lib/io');

var runFromPath = R.compose(run, loadTests);

function loadTests (path) {
  var tests = R.values(require(path));
  return tests;
}

// UNSAFECODE
// ===============================
var cli = R.compose(
  fork(
    R.compose(io.runIO, io.errorIO),
    R.compose(io.runIO, io.logIO)
  ),
  R.map(report),
  runFromPath
);

var app = R.compose(
  io.runIO,
  R.map(cli)
);

app(io.fileIO);
