// extract :: IO e a -> Promise { name :: String, args :: Array *, error :: e, value :: a }
function extract (io) {
  return new Promise((resolve) => {
    io.interpret((name, f, args) => {
      f.apply(null, args).fork(
        (error) => resolve({ name, args, error }),
        (value) => resolve({ name, args, value })
      )
    })
  })
}

module.exports = extract
