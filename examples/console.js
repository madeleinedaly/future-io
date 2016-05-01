const io = require('../')
const ioConsole = require('../console')

const logPenguins = ioConsole.log('Emperor, Gentoo, Royal')

io.unsafePerform(logPenguins)
