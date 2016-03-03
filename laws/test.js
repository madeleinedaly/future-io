var functor = require('fantasy-check/src/laws/functor');
var obey = require('./obey');
var Test = require('../lib/test');

var run = function (m) {
  return m.body;
};

describe('#Test', function () {
  // Functor tests
  obey('All (Functor)', functor.laws, [ Test, run ]);
  obey('Identity (Functor)', functor.identity, [ Test, run ]);
  obey('Composition (Functor)', functor.composition, [ Test, run ]);
});
