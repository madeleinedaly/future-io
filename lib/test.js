var Task = require('data.task');
var R = require('ramda');
var daggy = require('daggy');
var Task = require('data.task');
var parallel = require('parallel-future')(Task);

var _Test = daggy.tagged('description', 'result');
var toFuture = R.curryN(2, _toFuture);


var Test = function(desc, deps, testFn) {
  var body = toFuture(testFn);
  var result = resolveDependencies(deps).chain(body)
  return new _Test(desc, result);
};

_Test.of = Test;

_Test.prototype.fork = function(errCb, cb) {
  return this.result.fork(errCb, cb);
};

_Test.prototype.fold = function (onRejected, onSuccess) {
  return this.result.fold(onRejected, onSuccess);
};

_Test.prototype.map = function(f) {
  return _Test.of(this.description, this.result.map(f));
};

//TODO chain/of/...

//TODO allow this to handle promises, observables and futures.
function _toFuture (fn, arg) {
  return new Task(function (reject, resolve) {
    try {
      var result = fn.call(null, arg);
      return resolve(result);
    } catch (err) {
      return reject(err);
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
