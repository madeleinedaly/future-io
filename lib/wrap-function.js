const IO = require('./io')

function wrapFunction (name, f) {
  return function wrapper (args) {
    return new IO(
      (interpreter) => interpreter(
        name,
        function wrapper (/* args */) {
          // TODO: handle promises and plain values.
          return f.apply(null, args)
        },
        Array.prototype.slice.call(arguments)
      )
    )
  }
}

module.exports = wrapFunction
