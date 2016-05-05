import test from 'ava'
import ioProcess from '../node/process'
import fakePerform from '../lib/fake-perform'
import extract from './helpers/extract'

test('fs.argv', async (t) => {
  const io = ioProcess.argv

  // Fake perform.
  const { take } = fakePerform(io)
  const args = await take('process.argv')
  t.deepEqual(args, [])

  // Real perform.
  const value = await extract(io)
  t.deepEqual(value, process.argv)
})
