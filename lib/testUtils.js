exports.FakeWorld = FakeWorld;

const Ramda = require('ramda');
const Writable = require('stream').Writable;

function FakeWorld (options) {

  const fakeWorld = {
    //Mock implementations of world functions.
    require: () => ({}),
    process: {
      cwd: () => '/',
      argv: ['/bin/node'],
      stdout: new MockStream(() => {})
    },
    //Helper methods for running tests using this fake world.
    $onRequire: f => {
      fakeWorld.require = f;
      return fakeWorld;
    },
    $onCwd: f => {
      fakeWorld.process.cwd = f;
      return fakeWorld;
    },
    $setArgv: argv => {
      fakeWorld.process.argv = argv;
      return fakeWorld;
    },
    $onLog: f => {
      fakeWorld.process.stdout = new MockStream(f)
      return fakeWorld;
    }
  }
  return fakeWorld;
}

function MockStream (onWrite) {
  var output = '';
  const stream = new Writable({
    write: (chunk, enc, next) => {
      output += chunk.toString();
      onWrite(output);
      next();
    }
  });
  return stream;
}
