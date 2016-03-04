#!/usr/bin/env node

var path = require('path');
var R = require('ramda');
var fork = require('fork-future');
var run = require('./lib/runner');
var report = require('./lib/reporter');
var IO = require('./lib/IO');

var firstCliArg = R.compose(
  R.head,
  R.drop(2)
);
var pathJoin = R.curryN(2, path.join);
var withBasePath = path => IO.of(pathJoin).ap(IO.cwd()).ap(IO.of(path));
var loadTestsFromFile = path => IO.require(path).map(R.values);
var runTests = tests => IO.async(
  resolve => run(tests).fork(
    error => resolve('Macho imploded!\n' + error),
    resolve
  )
);

var cli = R.composeK(
  IO.log,
  output => IO.of(report(output)),
  runTests,
  loadTestsFromFile,
  withBasePath,
  args => IO.of(firstCliArg(args))
)(IO.argv())

// UNSAFECODE
// ===============================
// TODO: move this line to a separate file. Test everything above with a fake world.
IO.run(cli, IO.realWorld);
