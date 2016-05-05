import test from 'ava'
import IO from '../lib/io'
import functor from 'fantasy-land/laws/functor'
import apply from 'fantasy-land/laws/apply'
import applicative from 'fantasy-land/laws/applicative'
import chain from 'fantasy-land/laws/chain'
import monad from 'fantasy-land/laws/monad'
import extract from './helpers/extract'

test('functor', async (t) => {
  await testLaw(t, (x, eq) => functor.identity(IO.of)(eq)(x))
  await testLaw(t, (x, eq) => functor.composition(IO.of)(eq)(x))
})

test('applicative', async (t) => {
  await testLaw(t, (x, eq) => applicative.identity(IO)(eq)(x))
  await testLaw(t, (x, eq) => applicative.homomorphism(IO)(eq)(x))
  await testLaw(t, (x, eq) => applicative.interchange(IO)(eq)(x))
})

test('apply', async (t) => {
  await testLaw(t, (x, eq) => apply.composition(IO)(eq)(x))
})

test('chain', async (t) => {
  await testLaw(t, (x, eq) => chain.associativity(IO)(eq)(x))
})

test('monad', async (t) => {
  // Skipped because of a bug in fantasy-land specification: fantasy-land#136
  // await testLaw(t, (x, eq) => monad.leftIdentity(IO)(eq)(x))
  await testLaw(t, (x, eq) => monad.rightIdentity(IO)(eq)(x))
})

function testLaw (t, tester) {
  return new Promise((resolve) => {
    const equality = async (x, y) => {
      const xValue = await extract(x)
      const yValue = await extract(y)
      t.deepEqual(xValue, yValue)
      resolve()
    }
    tester('X', equality)
  })
}
