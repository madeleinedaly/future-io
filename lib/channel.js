/**
 * Simple csp style channel.
 * `put` passes a value into the channel and `take` retrieves one.
 * Both return promises that resolve as soon as both methods have been called.
 *
 * Both methods expect execution to be 'blocked' until the returned promise resolves.
 * Calling either method again before that will throw an error.
 */
function Channel () {
  var putResolver = null
  var takeResolver = null
  var value = null

  function checkReady () {
    if (putResolver && takeResolver) {
      putResolver()
      takeResolver(value)
      putResolver = null
      takeResolver = null
      value = null
    }
  }

  function take () {
    if (takeResolver) {
      throw new Error('Take was already called.')
    }
    return new Promise((resolve) => {
      takeResolver = resolve
      checkReady()
    })
  }

  function put (_value) {
    if (putResolver) {
      throw new Error('Put was already called.')
    }
    value = _value
    return new Promise((resolve) => {
      putResolver = resolve
      checkReady()
    })
  }

  return { put, take }
}

module.exports = Channel
