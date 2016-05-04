import test from 'ava'
import ioProcess from '../node/process'
import extract from './helpers/extract'

test('fs.argv', async (t) => {
  const io = ioProcess.argv
  const { name, args, value, error } = await extract(io)
  t.is(name, 'process.argv')
  t.deepEqual(args, [])
  t.deepEqual(value, process.argv)
  t.falsy(error)
})
