const PluginBase = require('../../plugin-base')
const loadView = require('../../load-view')
const staticRender = require('../../static-render')

class SignOutPlugin extends PluginBase {
  constructor() {
    super('signout')
    this.view = loadView(__dirname)
  }
  bootstrap(config, app) {

    app.use('/sign-out',
      (req, res, next) => {
        res.clearCookie('auth')
        next()
      },
      staticRender(() => {
        return app.locals.layout({
          config,
          title: 'Sign Out Complete',
          body: this.view()
        })
      })
    )
  }
}

module.exports = new SignOutPlugin()