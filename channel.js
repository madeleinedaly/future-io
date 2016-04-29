module.exports = Channel

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

var c = Channel()
var put = c.put
var take = c.take

put(4)
take().then(console.log)
take().then(console.log)
put('foo')
