var daggy = require('daggy');

var Test = daggy.tagged('description', 'requirements', 'body');
Test.of = Test;

Test.prototype.run = function(input) {
  return this.body(input);
};

Test.prototype.map = function(f) {
  return Test.of(this.description, this.requirements, f(this.body));
};

//TODO chain/of/...

module.exports = Test;
