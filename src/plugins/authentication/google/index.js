const StandardOauth2 = require('../../../standard-auth')
const loadView = require('../../../load-view')

module.exports = new StandardOauth2(
  'google',
  {
    login: 'https://accounts.google.com/o/oauth2/v2/auth',
    exchange: 'https://www.googleapis.com/oauth2/v4/token',
    certificates: 'https://www.googleapis.com/oauth2/v1/certs'
  },
  {
    scope: 'profile',
    access_type: 'offline'
  },
  loadView(__dirname)
)