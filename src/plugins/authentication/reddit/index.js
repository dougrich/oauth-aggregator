const assert = require('assert')
const querystring = require('query-string')
const axios = require('axios')
const StandardOauth2 = require('../../../standard-auth')
const loadView = require('../../../load-view')

class RedditOauth2 extends StandardOauth2 {
  constructor() {
    super(
      'reddit',
      {
        login: 'https://www.reddit.com/api/v1/authorize.compact',
        exchange: 'https://www.reddit.com/api/v1/access_token',
        profile: 'https://oauth.reddit.com/api/v1/me'
      },
      {
        scope: 'identity',
        duration: 'temporary',
        state: 'void'
      },
      loadView(__dirname)
    )
  }

  isValid(config, logger) {
    super.isValid(config)
    if (config[this.name]) {
      assert(!!config[this.name].useragent, '"useragent" is a required field: see Reddit documentation')
    }
  }

  returnHandler(config) {
    return async (req, res, next) => {
      const code = req.query.code
      const qs = querystring.stringify({
        grant_type: 'authorization_code',
        redirect_uri: this.redirecturi(req, config),
        code
      }, {
        arrayFormat: 'comma'
      })
      try {
        /**
         * This flow differs from the standard flow in the following ways:
         * - exchanging auth code for access token requires basic authentication with id/secret
         * - no id_token returned from exchange; instead of verifying the JWT in the id_token, fetch the profile
         * - profile name needs syntactic sugar to match expectations
         */
        const response = await axios.post(this.href.exchange, qs, {
          auth: {
            username: config[this.name].id,
            password: config[this.name].secret
          }
        })
        const { token_type, access_token } = response.data
        const profile = await axios.get(this.href.profile, {
          headers: {
            Authorization: [token_type, access_token].join(' '),
            'User-Agent': config[this.name].useragent
          }
        })
        this.signResponse(res, config, profile.id, '/u/' + profile.name)
        res.redirect(302, '../../complete')
      } catch (err) {
        next(err)
      }
    }
  }
}

module.exports = new RedditOauth2()