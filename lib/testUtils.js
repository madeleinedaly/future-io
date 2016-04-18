exports.FakeWorld = FakeWorld

const Writable = require('stream').Writable

function FakeWorld (options) {
  const fakeWorld = {
    // Mock implementations of world functions.
    require: () => ({}),
    process: {
      cwd: () => '/',
      argv: ['/bin/node'],
      stdout: new MockStream(() => {}),
      exit: (code) => code
    },
    fs: {
      onReadFile: (_, _2, callback) => callback(null, new Buffer('test\n')),
      onWriteFile: (_, _2, _3, callback) => callback()
    },
    // Helper methods for running tests using this fake world.
    $onRequire: (f) => {
      fakeWorld.require = f
      return fakeWorld
    },
    $onCwd: (f) => {
      fakeWorld.process.cwd = f
      return fakeWorld
    },
    $setArgv: (argv) => {
      fakeWorld.process.argv = argv
      return fakeWorld
    },
    $onLog: (f) => {
      fakeWorld.process.stdout = new MockStream(f)
      return fakeWorld
    },
    $onReadFile: (f) => {
      fakeWorld.fs.readFile = f
      return fakeWorld
    },
    $onWriteFile: (f) => {
      fakeWorld.fs.writeFile = f
      return fakeWorld
    },
    $onStat: (f) => {
      fakeWorld.fs.stat = f
      return fakeWorld
    }
  }
  return fakeWorld
}

function MockStream (onWrite) {
  var output = ''
  const stream = new Writable({
    write: (chunk, enc, next) => {
      output += chunk.toString()
      onWrite(output)
      next()
    }
  })
  return stream
}
