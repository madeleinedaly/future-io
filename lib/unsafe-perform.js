const $ = require('./types')

function unsafePerform (io) {
  const interpreter = (name, run, args) => {
    return run.apply(null, args)
  }
  io.run(interpreter)
}

module.exports = $.def(
  'unsafePerform',
  {},
  [$.$IO($.a), $.Undefined],
  unsafePerform
)
