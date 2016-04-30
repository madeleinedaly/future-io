import test from 'ava'
import Task from 'data.task'
import IO from '../lib/io'
import unsafePerform from '../lib/unsafe-perform'

test.cb('runs io functions', (t) => {
  t.plan(2)

  const ioFunction = () => IO(
    (interpreter) => interpreter(
      'foo',
      () => {
        t.pass()
        return Task.of()
      },
      []
    )
  )

  const ioFunction2 = () => IO(
    (interpreter) => interpreter(
      'bar',
      () => {
        t.pass()
        t.end()
        return Task.of()
      },
      []
    )
  )

  const io = ioFunction().chain(ioFunction2)

  unsafePerform(io)
})
