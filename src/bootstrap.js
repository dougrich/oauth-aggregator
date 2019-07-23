function bootstrap(
  plugins,
  config,
  express = require('express')
) {
  const app = express()
  for (const p of plugins) {
    p.bootstrap(config, app)
  }
  return app
}

module.exports = bootstrap