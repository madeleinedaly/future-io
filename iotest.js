var IO = require('./lib/IO');
var path = require('path');

var app = IO
  .cwd()
  .map(base => path.join(base, 'foo'))
  .chain(IO.log);

IO.run(app, IO.realWorld)
