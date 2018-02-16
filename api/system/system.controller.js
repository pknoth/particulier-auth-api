const StandardError = require('standard-error')
const DbTokenService = require('../auth/db-tokens.service')

class SystemController {
  constructor (options) {
    this.dbTokenService = new DbTokenService(options)
  }

  ping (req, res, next) {
    res.data = 'pong'
    return next()
  }

  swagger (req, res) {
    // return res.send(definition)
  }

  introspect (req, res, next) {
    return this.dbTokenService.getToken(req.query['token']).then((result) => {
      if (result) {
        res.data = result
        next()
      } else {
        next(new StandardError('Token not found', {code: 404}))
      }
    })
  }
}

module.exports = SystemController
