const IO = require('./io')
const Task = require('data.task')

const log = (x) => IO(
  (interpreter) => interpreter(
    'log',
    (x) => {
      console.log(x)
      return Task.of(null)
    },
    [x]
  )
)
exports.log = log

const cwd = () => IO(
  (interpreter) => interpreter(
    'cwd',
    () => Task.of(process.cwd()),
    []
  )
)
exports.cwd = cwd
