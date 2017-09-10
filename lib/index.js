const IO = require('./io')
const unsafePerform = require('./unsafe-perform')
const fakePerform = require('./fake-perform')
const wrapFunction = require('./wrap-function')

function create (Task, methodMap) {
  return {
    IO : IO.create(Task, methodMap),
    unsafePerform : unsafePerform,
    fakePerform : fakePerform.create(Task, methodMap),
    wrapFunction : wrapFunction.create(Task, methodMap)
  }
}

module.exports = {
  IO : IO,
  unsafePerform : unsafePerform,
  fakePerform : fakePerform,
  wrapFunction : wrapFunction,
  create : create
}
