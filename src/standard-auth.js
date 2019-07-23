const assert = require('assert')
const querystring = require('query-string')
const axios = require('axios')
const path = require('path')
const PluginBase = require('./plugin-base')
const Cache = require('@dougrich/read-cache')
const jwt = require('jsonwebtoken')

const fetchcache = new Cache(async (url) => {
  const response = await axios.get(url)
  return response.data
}, 8.64e+7, Cache.concat)

class StandardOauth2 extends PluginBase {
  constructor(name, href, parameters, view) {
    super(name)
    this.href = href
    this.parameters = parameters
    this.view = view
  }

  isValid(config) {
    if (!config[this.name]) return true
    const subconfig = config[this.name]
    assert(!!config['jwt-secret'], '"jwt-secret" must be populated')
    assert(!!subconfig.id, '"id" field must exist and contain the client id')
    assert(!!subconfig.secret, '"secret" field must exist and contain the client secret')
    return true
  }

  redirecturi(req, config) {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol
    const host = req.headers['x-forwarded-host'] || req.hostname
    return protocol + '://' + host + path.join(config.base || '/', 'login', this.name, 'return')
  }

  getLoginLink(req, config) {
    const qs = querystring.stringify({
      client_id: config[this.name].id,
      response_type: 'code',
      redirect_uri: this.redirecturi(req, config),
      ...this.parameters
    }, {
      arrayFormat: 'comma'
    })
    return this.href.login + '?' + qs
  }

  signResponse(res, config, id, name) {
    res.cookie(
      'auth',
      jwt.sign({
        sub: this.name + '/' + id,
        iss: this.name,
        name
      }, config['jwt-secret']),
      {
        expires: new Date(Date.now() + 8.64e+7)
      }
    )
  }

  returnHandler(config) {
    return async (req, res, next) => {
      const code = req.query.code
      const qs = querystring.stringify({
        grant_type: 'authorization_code',
        redirect_uri: this.redirecturi(req, config),
        client_id: config[this.name].id,
        client_secret: config[this.name].secret,
        code
      }, {
        arrayFormat: 'comma'
      })
      try {
        const certificates = await fetchcache(this.href.certificates)
        const response = await axios.post(this.href.exchange, qs)
        const { id_token } = response.data
        const verified = await new Promise((resolve, reject) => {
          jwt.verify(id_token, (header, cb) => {
            if (certificates[header.kid]) {
              return cb(null, certificates[header.kid])
            } else if (certificates.keys) {
              for (const key of certificates.keys) {
                if (key.kid === header.kid) {
                  return cb(null, `-----BEGIN CERTIFICATE-----\n${key.x5c}\n-----END CERTIFICATE-----\n`)
                }
              }
    
              return cb(new Error('No keys matched the certificates'))
            } else {
              cb(new Error('No known approach for matching certificates and header'))
            }
          }, (err, value) => {
            if (err) reject(err)
            else resolve(value)
          })
        })
        this.signResponse(res, config, verified.sub, verified.name)
        res.redirect(302, '../../complete')
      } catch (err) {
        next(err)
      }
    }
  }

  bootstrap(config, app) {
    const providers = app.locals.providers || (app.locals.providers = {})
    providers[this.name] = this
    app.use('/login/' + this.name + '/return', this.returnHandler(config))
    app.use('/login/' + this.name, (req, res) => res.redirect(302, this.getLoginLink(req, config)))
  }
}

module.exports = StandardOauth2