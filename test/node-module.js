import test from 'ava'
import ioModule from '../node/module'
import extract from './helpers/extract'

test('module.require.resolve', async (t) => {
  const modulePath = './fixtures/test-module'
  const io = ioModule.require.resolve(modulePath)
  const { name, args, value, error } = await extract(io)
  t.is(name, 'module.require.resolve')
  t.deepEqual(args, [modulePath])
  t.falsy(error)
  t.is(value, require.resolve(modulePath))
})

test('module.require', async (t) => {
  const modulePath = './fixtures/test-module'
  const io = ioModule.require(modulePath)
  const { name, args, value, error } = await extract(io)
  t.is(name, 'module.require')
  t.deepEqual(args, [modulePath])
  t.falsy(error)
  t.is(value, require(modulePath))
})
