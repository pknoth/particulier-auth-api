const serverTest = require('./../../test/utils/server')

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
})
