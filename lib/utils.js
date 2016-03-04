var R = require('ramda');


var dispatch = R.curry(function(method, obj) {
  return obj[method].call(obj);
});

module.exports = {
  dispatch: dispatch
};
