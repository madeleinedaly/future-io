# future-io

An fantasyland compliant IO monad library for Node.js.

# API

## IO-returning functions
To get you going quickly, this library seeks to implement the complete set of node IO operations,
exposing them on modules mimicking those found in the standard library.

At the moment the following methods are supported.
All take the same arguments as their standard counterparts, but no callbacks.

### global
```
```

### fs
```
```

## performing IO actions

### `unsafePerform :: IO e a -> ()`
This will execute the IO.
If the IO represents an error value, this function will throw.
If this is not what you want, use `IO.prototype.catch`.

## IO methods
IO implements the [fantasy-land](https://github.com/fantasyland/fantasy-land#monad) Functor, Apply and Monad specifications.

### `IO.of :: a -> IO e a`
Wrap a value in an IO.

### `IO.error :: e -> IO e a`
Wrap a value in an IO error.

### `IO.prototype.map :: IO e a ~> (a -> b) -> IO e b`
Map over an IO.

### `IO.prototype.ap :: IO e (a -> b) ~> IO e a -> IO e b`
Apply a function in an IO to a value in another IO, returning the result in an IO.

### `IO.prototype.chain :: IO e a ~> (a -> IO e b) -> IO e b`
Take a value in an IO and apply a function returning an new IO to it.

### `IO.prototype.catch :: IO e a ~> (e -> IO f a) -> IO f a`
jike `IO.prototype.chain`, but working on the error value in an IO.


## Wrapping custom IO functions
Often you'll find the need to define your own IO functions, or wrap those provided by a library.
Luckily, this is very simple:

```js
  // Wrapping a function performing some side effects in an IO.
  // The `customOperation` function should return a promise, task or plan value.
  const customIO = wrapMethod(
    'customOperation',
    customOperation
  )
```

# Testing
Testing code performing a lot of IO is usually pretty hard and involves a lot of mocks.
Not so when using IO!
Simply use `fakePerform` instead of `unsafePerform` to execute your IO actions in tests.
Now you can step through your IO calls step by step,
checking which arguments they are being called with and returning mock values.

`fakePerform()` return an object with three methods:
- `take(actionName)`: Proceed until the next action call.
  Assert it has type `actionName`.
  Returns a promise containg the arguments the action is being called with as an array
- `put(returnValue)`: Call after a `take` resolves to send a return value.
  Also call this when not returning a value, to ensure execution of the IO continues.
- `error(ioError)`: Like `put`, but returns an error value.

When the IO execution finishes, fakePerform triggers a last `end` action.
This action is passed an `ioError`, if one exists, in the first-argument position.


## Example using [ava](https://github.com/sindresorhus/ava#assertions) and async/await
```js
import test from 'ava'
import io from 'future-io'

test('logging the current working directory', async t => {
  const logCwd = io.cwd().chain(io.log)
  const { put, take } = io.fakePerform(logCwd)
  const cwd = '/home/foo'

  await take('cwd')
  put(cwd)

  const [ loggedCwd ] = await take('log')
  t.is(loggedCwd, cwd)
  await put()

  const [ ioError ] = await take('end')
  t.falsy(ioError)
})
```

## Example using [mocha](https://github.com/sindresorhus/ava#assertions) and [co](https://github.com/tj/co)
```js
import co from 'co'
import io from 'future-io'
import assert from 'assert'

it('logs the current working directory', co.wrap(function* () {
  const logCwd = io.cwd().chain(io.log)
  const { put, take } = fakePerform(logCwd)
  const cwd = '/home/foo'

  yield take('cwd')
  yield put(cwd)

  const [ loggedCwd ] = yield take('log')
  assert.equal(loggedCwd, cwd)
  put()

  const [ ioError ] = yield take('end')
  assert.ifError(ioError)
}))
```

