import test from 'ava'
import ioModule from '../node/module'
import fakePerform from '../lib/fake-perform'
import extract from './helpers/extract'

test('module.require.resolve', async (t) => {
  const modulePath = './fixtures/test-module'
  const io = ioModule.require.resolve(modulePath)

  // Fake perform.
  const { take } = fakePerform(io)
  const [ actualModulePath ] = await take('module.require.resolve')
  t.is(actualModulePath, modulePath)

  // Real perform.
  const value = await extract(io)
  t.is(value, require.resolve(modulePath))
})

test('module.require', async (t) => {
  const modulePath = './fixtures/test-module'
  const io = ioModule.require(modulePath)

  // Fake perform.
  const { take } = fakePerform(io)
  const [ actualModulePath ] = await take('module.require')
  t.is(actualModulePath, modulePath)

  // Real perform.
  const value = await extract(io)
  t.is(value, require(modulePath))
})
