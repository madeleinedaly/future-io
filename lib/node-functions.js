const fs = require('fs')
const R = require('ramda')

const fsMethodNames = [
  'access',
  'appendFile',
  'chmod',
  'chown',
  'close',
  'createReadStream',
  'createWriteStream',
  'exists',
  'fchmod',
  'fchown',
  'fdatasync',
  'fstat',
  'fsync',
  'ftruncate',
  'futimes',
  'lchmod',
  'lchown',
  'link',
  'lstat',
  'mkdir',
  'mkdtemp',
  'open',
  'read',
  'readdir',
  'readFile',
  'readlink',
  'realpath',
  'rename',
  'rmdir',
  'stat',
  'symlink',
  'truncate',
  'unlink',
  'unwatchFile',
  'utimes',
  'watch',
  'watchFile',
  'write',
  'write',
  'writeFile'
]

const fsMethodLengths = R.compose(
  R.fromPairs,
  R.map((methodName) => [
    methodName,
    fs[methodName].length - 1
  ]),
  R.filter((methodName) => !!fs[methodName])
)(fsMethodNames)

// Filter out functions not present in this version of node.
exports.fs = fsMethodLengths
