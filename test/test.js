const test = require('tap').test
const node = require('../').node
const FakeWorld = require('../').testUtils.FakeWorld

// TODO: add tests for IO error handling.

test('node.cwd', (t) => {
  const cwd = '/foo'
  const fakeWorld = new FakeWorld().$onCwd(() => cwd)
  const io = node.cwd()
  io
    .map((x) => {
      t.equal(x, cwd)
      t.end()
    })
    .unsafePerform(fakeWorld, t.notOk)
})

test('node.argv', (t) => {
  const argv = ['/env/node']
  const fakeWorld = new FakeWorld().$setArgv(argv)
  const io = node.argv()
  io
    .map((x) => {
      t.same(x, argv)
      t.end()
    })
    .unsafePerform(fakeWorld, t.notOk)
})

test('node.exit', (t) => {
  const fakeWorld = new FakeWorld()
  const io = node.exit(1)
  io
    .map((x) => {
      t.equal(x, 1)
      t.end()
    })
    .unsafePerform(fakeWorld, t.notOk)
})

test('node.require', (t) => {
  const modulePath = '/my/module'
  const module = {}
  const fakeWorld = new FakeWorld().$onRequire((_modulePath) => {
    t.equal(_modulePath, modulePath)
    return module
  })
  const io = node.require(modulePath)
  io
    .map((x) => {
      t.same(x, module)
      t.end()
    })
    .unsafePerform(fakeWorld, t.notOk)
})

test('node.log', (t) => {
  const line1 = 'foo'
  const line2 = 'bar'
  const fakeWorld = new FakeWorld().$onLog((output) => {
    if (output === 'foo\nbar\n') {
      t.ok(true)
      t.end()
    }
  })
  const io = node.log(line1)
  io
    .chain(() => node.log(line2))
    .unsafePerform(fakeWorld, t.notOk)
})

test('node.readFile', (t) => {
  const filePath = '/my/file'
  const options = {}
  const contents = new Buffer('Foobar!')
  const fakeWorld = new FakeWorld().$onReadFile((_filePath, _options, callback) => {
    t.equal(_filePath, filePath)
    t.same(_options, options)
    return callback(null, contents)
  })
  const io = node.readFile(options, filePath)
  io
    .map((x) => {
      t.same(x, contents)
      t.end()
    })
    .unsafePerform(fakeWorld, t.notOk)
})

test('node.writeFile', (t) => {
  const filePath = '/my/file'
  const options = {}
  const contents = 'Foobar\n'
  const fakeWorld = new FakeWorld().$onWriteFile((_filePath, _contents, _options, callback) => {
    t.equal(_filePath, filePath)
    t.same(_options, options)
    t.equal(_contents, contents)
    return callback()
  })
  const io = node.writeFile(options, filePath, contents)
  io
    .map((x) => {
      t.end()
    })
    .unsafePerform(fakeWorld, t.notOk)
})

test('node.stat', (t) => {
  const filePath = '/my/file'
  const stat = {}
  const fakeWorld = new FakeWorld().$onStat((_filePath, callback) => {
    t.equal(_filePath, filePath)
    return callback(null, stat)
  })
  const io = node.stat(filePath)
  io
    .map((x) => {
      t.same(x, stat)
      t.end()
    })
    .unsafePerform(fakeWorld, t.notOk)
})

