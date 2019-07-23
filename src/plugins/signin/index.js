const assert = require('assert')
const PluginBase = require('../../plugin-base')
const loadView = require('../../load-view')
const staticRender = require('../../static-render')
const authenticationPlugins = require('../authentication').names

class SignInPlugin extends PluginBase {
  constructor() {
    super('signin')
    this.view = loadView(__dirname)
    this.completeView = loadView(__dirname, 'complete.hbs')
  }
  
  isValid(config) {
    assert(!!config['display'], '"display" field must be provided')
    assert(!!config['brand'], '"brand" field must be provided')
    for (const d of config['display']) {
      assert(!!config[d], '"display" specifies a provider "' + d + '" but that provider is not configured')
      assert(authenticationPlugins.indexOf(d) >= 0, '"display" specifies a provider "' + d + '" that is not a recognized authentication plugin. Should be one of: ' + authenticationPlugins.join (', '))
    }
  }

  bootstrap(config, app) {

    app.use('/complete', staticRender(() => {
      return app.locals.layout({
        config,
        title: 'Sign In Complete',
        body: this.completeView()
      })
    }))
    
    app.use('/', staticRender(() => {
      const providers = app.locals.providers || {}
      const display = config.display || []
      const providerViews = display.map(x => providers[x].view()).join('')
      return app.locals.layout({
        config,
        title: 'Sign In',
        body: this.view({
          providerViews
        })
      })
    }))
  }
}

module.exports = new SignInPlugin()