var mochaAdapter = require('fantasy-check/src/adapters/mocha');

var obey = function (title, testFactory, factoryArgs, skipped) {
  var test = skipped ? it.skip : it;
  test(title, function () {
    testFactory(mochaAdapter).apply(null, factoryArgs)();
  });
};

obey.skip = function (title, testFactory, factoryArgs) {
  obey(title, testFactory, factoryArgs, true);
};

module.exports = obey;
