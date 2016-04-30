import test from 'ava'
import wrapFunction from '../lib/wrap-function'
import Task from 'data.task'
import extract from './helpers/extract'

test('wrapped function returns resolving future', async (t) => {
  const f = wrapFunction('foo', (x) => Task.of(x * 2))
  const io = f(4)
  const { name, args, value, error } = await extract(io)
  t.is(name, 'foo')
  t.deepEqual(args, [4])
  t.is(value, 8)
  t.falsy(error)
})

test('wrapped function returns rejecting future', async (t) => {
  const f = wrapFunction('foo', (x) => Task.rejected(new Error(x * 2)))
  const io = f(4)
  const { name, args, value, error } = await extract(io)
  t.is(name, 'foo')
  t.deepEqual(args, [4])
  t.is(error.message, '8')
  t.falsy(value)
})

test('wrapped function returns plain values', async (t) => {
  const f = wrapFunction('foo', (x) => x * 2)
  const io = f(4)
  const { name, args, value, error } = await extract(io)
  t.is(name, 'foo')
  t.deepEqual(args, [4])
  t.is(value, 8)
  t.falsy(error)
})

test('wrapped function throws', async (t) => {
  const f = wrapFunction('foo', (x) => { throw new Error(x * 2) })
  const io = f(4)
  const { name, args, value, error } = await extract(io)
  t.is(name, 'foo')
  t.deepEqual(args, [4])
  t.is(error.message, '8')
  t.falsy(value)
})

test('wrapped function returns resolved promise', async (t) => {
  const f = wrapFunction('foo', (x) => Promise.resolve(x * 2))
  const io = f(4)
  const { name, args, value, error } = await extract(io)
  t.is(name, 'foo')
  t.deepEqual(args, [4])
  t.is(value, 8)
  t.falsy(error)
})

test('wrapped function returns rejected promise', async (t) => {
  const f = wrapFunction('foo', (x) => Promise.reject(new Error(x * 2)))
  const io = f(4)
  const { name, args, value, error } = await extract(io)
  t.is(name, 'foo')
  t.deepEqual(args, [4])
  t.is(error.message, '8')
  t.falsy(value)
})
