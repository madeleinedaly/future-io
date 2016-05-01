const io = require('../')
const ioConsole = require('../node/console')

const logPenguins = ioConsole.log('Emperor, Gentoo, Royal')

io.unsafePerform(logPenguins)
