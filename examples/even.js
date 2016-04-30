#!/usr/bin/node

const lib = require('../lib/lib-node')
const unsafePerform = require('../lib/unsafe-perform')

const even = lib.argv()
  .map(argv => (parseInt(argv[2]) % 2) === 0)
  .chain(lib.log)

unsafePerform(even)
