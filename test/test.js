const test = require('tap').test;
const RF = require('ramda-fantasy');
const node = require('../').node;
const FakeWorld = require('../').testUtils.FakeWorld;

const Just = RF.Maybe.Just;

test('node.cwd', t => {
  const cwd = '/foo';
  const fakeWorld = new FakeWorld().$onCwd(() => cwd)
  const io = node.cwd();
  io
    .map(x => {
      t.equal(x, cwd);
      t.end();
    })
    .unsafePerform(fakeWorld);
});


test('node.argv', t => {
  const argv = ['/env/node'];
  const fakeWorld = new FakeWorld().$setArgv(argv)
  const io = node.argv();
  io
    .map(x => {
      t.same(x, argv);
      t.end();
    })
    .unsafePerform(fakeWorld);
});


test('node.require', t => {
  const modulePath = '/my/module';
  const module = {};
  const fakeWorld = new FakeWorld().$onRequire(_modulePath => {
    t.equal(_modulePath, modulePath);
    return module;
  })
  const io = node.require(modulePath);
  io
    .map(x => {
      t.same(x, Just(module));
      t.end();
    })
    .unsafePerform(fakeWorld);
});


test('node.log', t => {
  const line1 = 'foo';
  const line2 = 'bar';
  const fakeWorld = new FakeWorld().$onLog(output => {
    console.log(output);
    if (output === 'foo\nbar\n') {
      t.ok(true);
      t.end();
    }
  })
  const io = node.log(line1)
    .chain(() => node.log(line2))
    .unsafePerform(fakeWorld);
});
