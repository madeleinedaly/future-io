# future-io
An [fantasy-land](https://github.com/fantasyland/fantasy-land) compliant monadic IO library for Node.js.

Example of building a simple cli app that tells you if a number is even:

```js
#!/usr/bin/node

const io = require('future-io')
const ioProcess = require('future-io/process')

const even = ioProcess.argv
  .map(argv => (parseInt(argv[2]) % 2) === 0)
  .chain(even => ioProcess.stdout.write('Is even: ' + even))

io.unsafePerform(even)
```

# API

## IO-returning functions
To get you going quickly, this library seeks to implement the complete set of node IO operations,
exposing them on modules mimicking those found in the standard library.
This is still a work in progress.
If you're missing, please feel free to open an issue or pull request.

At the moment the following modules are exported.
For some recipes check out the examples directory.

### `future-io/console`

### `future-io/fs`

### `future-io/module`

### `future-io/process`

## performing IO actions

### `unsafePerform :: IO e a -> ()`
This will execute the IO.
If the IO represents an error value, this function will throw.
If this is not what you want, use `IO.prototype.catch`.

## IO methods
IO implements the [fantasy-land](https://github.com/fantasyland/fantasy-land) Functor, Apply and Monad specifications.

### `IO.of :: a -> IO e a`

### `IO.error :: e -> IO e a`

### `IO.prototype.map :: IO e a ~> (a -> b) -> IO e b`

### `IO.prototype.ap :: IO e (a -> b) ~> IO e a -> IO e b`

### `IO.prototype.chain :: IO e a ~> (a -> IO e b) -> IO e b`

### `IO.prototype.catch :: IO e a ~> (e -> IO f a) -> IO f a`

## Wrapping custom IO functions
Often you'll find the need to define your own IO functions, or wrap those provided by a library.
Luckily, this is very simple:

```js
  const io = require('future-io')

  // Wrapping a function performing some side effects in an IO.
  // The `customOperation` function should return a promise, task or plan value.
  const customIO = io.wrapMethod(
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


## Example using [ava](https://github.com/sindresorhus/ava) and async/await
```js
import test from 'ava'
import io from 'future-io'
import ioProcess from 'future-io/process'

test('logging the current working directory', async t => {
  const io = ioProcess.cwd().chain(ioProcess.stdout.write)
  const { put, take } = fakePerform(io)
  const cwd = '/home/foo'

  await take('process.cwd')
  put(cwd)

  const [ loggedCwd ] = await take('process.stdout.write')
  t.is(loggedCwd, cwd)
  put()

  const [ ioError ] = await take('end')
  t.falsy(ioError)
})
```

## Example using [mocha](https://github.com/sindresorhus/ava) and [co](https://github.com/tj/co)
```js
import co from 'co'
import io from 'future-io'
import assert from 'assert'

it('logs the current working directory', co.wrap(function* () {
  const io = ioProcess.cwd().chain(ioProcess.stdout.write)
  const { put, take } = fakePerform(io)
  const cwd = '/home/foo'

  yield take('process.cwd')
  yield put(cwd)

  const [ loggedCwd ] = yield take('process.stdout.write')
  assert.equal(loggedCwd, cwd)
  put()

  const [ ioError ] = yield take('end')
  assert.ifError(ioError)
}))
```

