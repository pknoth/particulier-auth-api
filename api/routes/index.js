const system = require('../system')
const auth = require('../auth')

exports.configure = function (app, options) {
  app.use('/api', system(options))
  app.use('/api/auth', auth(options))
}
