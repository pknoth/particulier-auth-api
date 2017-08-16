const serverTest = require('./../../test/utils/server')
// const {expect} = require('chai')

describe('auth API', function () {
  const server = serverTest()
  const api = server.api

  describe('/authorize', () => {
    it('replies a 401 with no credentials', () => {
      return api()
        .get('/api/auth/authorize')
        .expect(401)
    })
  })
})
