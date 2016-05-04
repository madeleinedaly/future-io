import test from 'ava'

import Channel from '../lib/channel'

test('put then take', async (t) => {
  const channel = new Channel()
  const value = 'foo'
  channel.put(value)
  const result = await channel.take()
  t.is(result, value)
})

test('take then put', async (t) => {
  const channel = new Channel()
  const value = 'foo'
  const takePromise = channel.take()
  channel.put(value)
  const result = await takePromise
  t.is(result, value)
})

test('calling put twice consecutively throws', async (t) => {
  const channel = new Channel()
  channel.put()
  t.throws(
    () => channel.put()
  )
})

test('calling take twice consecutively throws', async (t) => {
  const channel = new Channel()
  channel.take()
  t.throws(
    () => channel.take()
  )
})
