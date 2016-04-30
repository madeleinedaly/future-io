const lib = require('../lib/lib-node')
const unsafePerform = require('../lib/unsafe-perform')

const io = lib.cwd().chain(lib.log)

unsafePerform(io) // => outputs your current working directory on stdout.
