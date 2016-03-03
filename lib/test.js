var Task = require('data.task');
var R = require('ramda');
var daggy = require('daggy');
var Task = require('data.task');
var parallel = require('parallel-future')(Task);

var _Test = daggy.tagged('description', 'result', 'id');
var Failure = daggy.tagged('error', 'failingTestId')
var toFuture = R.curryN(3, _toFuture);

var nextId = 0;

var Test = function(desc, deps, testFn) {
  var id = nextId++;
  var body = toFuture(id, testFn);
  var result = resolveDependencies(deps).chain(body);
  return new _Test(desc, result, id);
};

_Test.of = Test;

_Test.prototype.fork = function(errCb, cb) {
  return this.result.fork(errCb, cb);
};

_Test.prototype.fold = function (onRejected, onSuccess) {
  return this.result.fold(onRejected, onSuccess);
};

_Test.prototype.map = function(f) {
  return _Test.of(this.description, this.result.map(f), this.id);
};

//TODO chain/of/...

//TODO allow this to handle promises, observables and futures.
function _toFuture (id, fn, arg) {
  return new Task(function (reject, resolve) {
    try {
      var result = fn.call(null, arg);
      return resolve(result);
    } catch (error) {
      return reject(new Failure(error, id));
    }
  });
}

function resolveDependencies (dependencies) {
  var dependencyNames = R.keys(dependencies);
  var addBackKeys = R.zipObj(dependencyNames);
  var dependencyFutures = R.values(dependencies);
  return parallel(dependencyFutures).map(addBackKeys);
}

module.exports = Test;
