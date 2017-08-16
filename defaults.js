module.exports = {
  PORT: 3004,
  nbWorkers: 1,
  outgoingHttpMaxSockets: 5,
  appname: 'api-elk-stats',
  log: {
    level: 'info',
    format: 'simple'
  },
  raven: {
    activate: false,
    dsn: ''
  },
  mongoDbUrl: 'mongodb://localhost:27017/api-particulier',
  tokensPath: './tokens',
  tokenService: 'db'
}
