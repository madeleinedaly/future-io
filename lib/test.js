var Task = require('data.task');
var R = require('ramda');
var daggy = require('daggy');

var _Test = daggy.tagged('description', 'requirements', 'body');


var Test = function(desc, req, body) {
  return new _Test(desc, req, new Task(function(reject, resolve) {
      R.compose(resolve, doesThrow)(body);
    })
  );
};

_Test.of = Test;

_Test.prototype.fork = function(_, cb) {
  return this.body.fork(function() {}, cb);
};

_Test.prototype.map = function(f) {
  return _Test.of(this.description, this.requirements, this.body.map(f));
};

//TODO chain/of/...

function doesThrow (fn) {
  try {
    fn();
  } catch (err) {
    return false;
  }
  return true;
}

module.exports = Test;
