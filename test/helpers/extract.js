// extract :: IO e a -> Promise { name :: String, args :: Array *, error :: e, value :: a }
function extract (io) {
  const result = {}
  const interpreter = (name, f, args) => {
    // The interpreter is not always called. When it is called, we want to store its arguments.
    Object.assign(result, { name, args })
    return f.apply(null, args)
  }
  return new Promise((resolve) => io.interpret(interpreter).fork(
    (error) => resolve(Object.assign(result, { error })),
    (value) => resolve(Object.assign(result, { value }))
  ))
}

module.exports = extract
