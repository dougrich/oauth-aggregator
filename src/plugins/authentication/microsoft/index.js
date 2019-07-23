const StandardOauth2 = require('../../../standard-auth')
const loadView = require('../../../load-view')

module.exports = new StandardOauth2(
  'microsoft',
  {
    login: 'https://login.live.com/oauth20_authorize.srf',
    exchange: 'https://login.live.com/oauth20_token.srf',
    certificates: 'https://nexus.passport.com/public/partner/discovery/key'
  },
  {
    scope: ['profile', 'openid']
  },
  loadView(__dirname)
)