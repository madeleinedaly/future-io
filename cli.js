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
var pathJoin = R.liftN(2, path.join);
var withBasePath = path => pathJoin(node.cwd(), IO.of(path));
var loadTestsFromFile = path => node.require(path).map(R.values);
var runTests = tests => IO.task(
  resolve => run(tests).fork(
    error => resolve('Macho imploded!\n' + error),
    resolve
  )
);

var cli = R.composeK(
  node.log,
  R.compose(IO.of, report),
  runTests,
  loadTestsFromFile,
  withBasePath,
  R.compose(IO.of, firstCliArg)
)(node.argv())

// UNSAFECODE
// ===============================
// TODO: move this line to a separate file. Test everything above with a fake world.
cli.unsafePerform(node.realWorld);
