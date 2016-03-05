#!/usr/bin/env node

var path = require('path');
var R = require('ramda');
var fork = require('fork-future');
var run = require('./lib/runner');
var report = require('./lib/reporter');
var IO = require('./lib/io');
var node = require('./lib/io/node');

var firstCliArg = R.compose(
  R.head,
  R.drop(2)
);
var pathJoin = R.curryN(2, path.join);
var withBasePath = path => IO.of(pathJoin).ap(node.cwd()).ap(IO.of(path));
var loadTestsFromFile = path => node.require(path).map(R.values);
var runTests = tests => IO.task(
  resolve => run(tests).fork(
    error => resolve('Macho imploded!\n' + error),
    resolve
  )
);

var cli = R.composeK(
  node.log,
  output => IO.of(report(output)),
  runTests,
  loadTestsFromFile,
  withBasePath,
  args => IO.of(firstCliArg(args))
)(node.argv())

// UNSAFECODE
// ===============================
// TODO: move this line to a separate file. Test everything above with a fake world.
cli.run(node.realWorld);
