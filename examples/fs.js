const io = require('../')
const fs = require('../fs')

const penguinFile = '/tmp/penguins'
const newPenguins = 'Emperor, Gentoo, Royal'

const ensurePenquins = fs.exists(penguinFile).chain(
  fileExists => fileExists
    ? fs.appendFile(penguinFile, ', ' + newPenguins)
    : fs.writeFile(penguinFile, newPenguins)
)

io.unsafePerform(ensurePenquins)
