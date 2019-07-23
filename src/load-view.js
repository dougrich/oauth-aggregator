function loadView(
  dirname,
  filename = 'view.hbs',
  path = require('path'),
  fs = require('fs'),
  hbs = require('handlebars')
) {
  return hbs.compile(fs.readFileSync(path.join(dirname, filename), 'utf8'))
}

module.exports = loadView