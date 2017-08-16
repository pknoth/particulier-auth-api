module.exports = {
  PORT: 3004,
  nbWorkers: 1,
  outgoingHttpMaxSockets: 5,
  appname: 'api-elk-stats',
  log: {
    level: 'info',
    format: 'simple'
  },
  es: {
    host: 'http://localhost:9200',
    index: 'filebeat-*'
  },
  raven: {
    activate: false,
    dsn: ''
  }
}
