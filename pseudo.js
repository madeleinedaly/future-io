const daggy = require('daggy')
const Task = require('data.task')

// Executor :: name -> (*Args -> Task err res) -> [Args] -> Task err res
// interpret :: Executor -> Task
const IO = daggy.tagged('interpret')

IO.prototype.chain = function (g) {
  return new IO(
    (executor) => this.interpret(executor).chain(
      (x) => g(x).interpret(executor)
    )
  )
}

function unsafePerform (io) {
  const executor = (name, run, args) => {
    return run.apply(null, args)
  }
  const noop = () => {}
  return io.interpret(executor).fork(noop, noop)
}

// 1. Example with real IO.
const log = (x) => IO(
  (executor) => executor(
    'log',
    (x) => { console.log(x); return Task.of(null) },
    [x]
  )
)

const cwd = () => IO(
  (executor) => executor(
    'cwd',
    () => Task.of(process.cwd()),
    []
  )
)

const io = cwd().chain(log)

unsafePerform(io)
// => <your cwd>

// 2. Example using a custom executor for testing.
function fakePerform (io) {
  const executor = (name, run, args) => {
    // Log the action being called along with its arguments.
    console.log(`CALLED: ${name}(${args.map(JSON.stringify).join(', ')})`)
    // For the purposes of this example, have every action return the string 'foo'.
    // In a real test scenario, the test would sit here, reading the args and returning some value.
    return Task.of('foo')
  }
  const noop = () => {}
  io.interpret(executor).fork(noop, noop)
}

fakePerform(io)
// => CALLED: cwd()
// => CALLED: log("foo")
