var functor = require('fantasy-check/src/laws/functor');
var applicative = require('fantasy-check/src/laws/applicative');
var monad = require('fantasy-check/src/laws/monad');
var obey = require('./obey');
var IO = require('../').IO;

var run = function (io) {
  return io.unsafePerform({});
};

describe('#IO', function () {
  // Applicative Functor tests
  obey('All (Applicative)', applicative.laws, [IO, run]);
  obey('Identity (Applicative)', applicative.identity, [IO, run]);
  obey('Composition (Applicative)', applicative.composition, [IO, run]);
  obey('Homomorphism (Applicative)', applicative.homomorphism, [IO, run]);
  obey('Interchange (Applicative)', applicative.interchange, [IO, run]);

  // Functor tests
  obey('All (Functor)', functor.laws, [IO.of, run]);
  obey('Identity (Functor)', functor.identity, [IO.of, run]);
  obey('Composition (Functor)', functor.composition, [IO.of, run]);

  // Monad tests
  obey('All (Monad)', monad.laws, [IO, run]);
  obey('Left Identity (Monad)', monad.leftIdentity, [IO, run]);
  obey('Right Identity (Monad)', monad.rightIdentity, [IO, run]);
  obey('Associativity (Monad)', monad.associativity, [IO, run]);
});
