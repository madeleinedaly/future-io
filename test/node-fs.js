import test from 'ava'
import fs from '../node/fs'
import fakePerform from '../lib/fake-perform'
import extract from './helpers/extract'

// librarization of `fs` is generic, so we're just testing a single module here.
test('fs.exists', async (t) => {
  const io = fs.exists(__filename)

  // Fake perform.
  const { take } = fakePerform(io)
  const [ filename ] = await take('fs.exists')
  t.is(filename, __filename)

  // Real perform.
  const value = await extract(io)
  t.is(value, true)
})
