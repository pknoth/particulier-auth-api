const serverTest = require('./../../test/utils/server')
const proxyrequire = require('proxyquire')

describe('System API', () => {
  var server = serverTest()
  var api = server.api

  describe('When requesting /api/ping', () => {
    it('replies json with pong in json', () => {
      return api()
        .get('/api/ping')
        .expect('content-type', /json/)
        .expect(200, '"pong"')
    })

    it('replies json with pong in xml', () => {
      return api()
        .get('/api/ping')
        .set('Accept', 'application/xml')
        .expect('content-type', /xml/)
        .expect(200, /pong/)
    })
  })

  describe('when forcing the format in url', () => {
    it('the response format is correct', () => {
      return api()
        .get('/api/ping')
        .query({'format': 'xml'})
        .expect('content-type', /xml/)
        .expect(200, /pong/)
    })
  })

  describe('When requesting a bad route', () => {
    it('replies 404', function () {
      return api()
        .get('/api/not-existing')
        .expect(404)
    })
  })

  describe('/api/introspect', () => {
    describe('I have a bad token', () => {
      beforeEach(() => {
        proxyrequire('../system.controller', {
          './db-tokens.service': class FakeTokenService {
            initialize () {
              return Promise.resolve(this)
            }
            getToken () {
              return Promise.resolve(null)
            }
          }
        })
      })

      it('should set consumer on req', () => {
        return api()
          .get('/api/introspect')
          .query({'token': 'token-nok'})
          .expect(404)
      })
    })
  })
})
