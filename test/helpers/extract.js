// extract :: IO e a -> Promise { name :: String, args :: Array *, error :: e, value :: a }
function extract (io) {
  const interpreter = (name, f, args) => f.apply(null, args)
  return new Promise((resolve, reject) => io.interpret(interpreter).fork(reject, resolve))
}

module.exports = extract
