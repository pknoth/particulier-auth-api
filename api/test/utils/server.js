const supertest = require('supertest')
const nock = require('nock')
const options = require('../../../defaults')

const Server = require('../../server')

module.exports = function () {
  let server
  const serverPort = process.env['SERVER_PORT_TEST']
  if (serverPort) {
    options.port = serverPort
  }

  nock.enableNetConnect('localhost')

  beforeEach((done) => {
    server = new Server(options)
    server.start(done)
  })
  afterEach((done) => {
    server.stop(done)
  })

  const api = function () {
    return supertest
      .agent('http://localhost:' + server.port)
  }
  return {
    api: api
  }
}
