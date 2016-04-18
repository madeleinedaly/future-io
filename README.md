# future-io

An fantasyland compliant IO monad for Node.js.

## Supported Operations
At the moment only a limited set of operations is supported.
- `node.log :: String -> IO ()`
- `node.require :: Path -> IO Module`
- `node.cwd :: () -> IO Path`
- `node.argv :: () -> IO [Arg]`
- `node.readFile :: Options -> Path -> IO String`
- `node.writeFile :: Options -> Path -> Content -> IO ()`

Contributions adding more operations are welcomed!

## Usage
```js
const node = require('io').node;

const logCwd = node.cwd().chain(node.log);
const onIOError = (error) => console.log(error);

//Run the program.
logCwd.unsafePerform(node.realWorld, onIOError);
```

## Testing your application
If you export the IO monad representing your app it becomes really easy to test it.
future-io provides a `fakeWorld` object to help out!

```js
const FakeWorld = require('io').testUtils.FakeWorld;
const logCwd = node.cwd().chain(node.log);

it('logs the current workding directory', done => {
  const cwd = '/foo/bar';

  const fakeWorld = new FakeWorld()
    .$onCwd(() => cwd)
    .$onLog(output => {
      if (output.trim() === cwd) {
        done();
      }
    });

  logCwd.unsafePerform(fakeWorld, done);
});
```

Note that your application won't actually write anything to stdout during your test, so your test output stays clean!

## Creating your own IO operations
Use the constructors exported from `require('io').IO`.
Take a look in `lib/node.js` for examples on how it's done.
