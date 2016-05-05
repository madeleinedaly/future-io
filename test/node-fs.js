import test from 'ava'
import fs from '../node/fs'
import extract from './helpers/extract'

// librarization of `fs` is generic, so we're just testing a single module here.
test('fs.exists', async (t) => {
  const io = fs.exists(__filename)
  const { name, args, value, error } = await extract(io)
  t.is(name, 'fs.exists')
  t.deepEqual(args, [__filename])
  t.falsy(error)
  t.is(value, true)
})
