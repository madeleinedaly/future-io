function unsafePerform (io) {
  const interpreter = (name, run, args) => {
    return run.apply(null, args)
  }
  io.run(interpreter)
}

module.exports = unsafePerform
