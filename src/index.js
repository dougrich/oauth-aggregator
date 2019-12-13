const fs = require('fs')
const bootstrap = require('./bootstrap')
const verify = require('./verify-config')
const loadview = require('./load-view')

const plugins = [
  ...require('./plugins/authentication').list,
  require('./plugins/signout'),
  require('./plugins/signin'),
]

const config = JSON.parse(fs.readFileSync(process.env.AUTH_CONFIG || './config.json', 'utf8'))

const { isValid, warnings, errors } = verify(plugins, config)
for (const w of warnings) {
  console.warn(`[${w.plugin}]: ${w.message}`)
}
for (const e of errors) {
  console.error(`[${e.plugin}]: ${e.error.message}`)
}
if (!isValid) return process.exit(-1)

const app = bootstrap(plugins, config)
app.locals.layout = loadview(__dirname, 'layout.hbs')

app.listen(80, () => { console.log('listening') })