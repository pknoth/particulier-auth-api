const {expect} = require('chai')
const proxyrequire = require('proxyquire')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const chai = require('chai')
chai.use(sinonChai)
chai.should()

const fakeFCResponse = { sub: 'ad421d168ec81bf5d3c968d135c0904506fce807b5aecc6360abdedd4e0f81c2v1',
  given_name: 'Eric',
  family_name: 'Mercier',
  gender: 'male',
  birthdate: '1981-06-23' }

describe('Auth controller', () => {
  describe('France connect auth bearer', () => {
    let Auth, service

    beforeEach(() => {
      Auth = proxyrequire('../auth.controller', {
        './db-tokens.service': class FakeTokenService {
          initialize () {
            return Promise.resolve(this)
          }
          getToken () {
            return Promise.resolve(null)
          }
        },
        './france-connect.service': class FCS {
          userinfo () {
            return Promise.resolve(fakeFCResponse)
          }
        }
      })
      service = new Auth({tokenService: 'db'})
    })

    it('should let pass with a bearer', () => {
      const req = {
        get: function (method) {
          if (method === 'Authorization') return 'Bearer 12345'
        },
        logger: {
          debug: function () {}
        }
      }
      const res = {}
      const consumer = {
        name: [
          fakeFCResponse.given_name,
          fakeFCResponse.family_name
        ].join(' '),
        email: fakeFCResponse.email
      }
      return service.authorize(req, res, function () {}).then(() => {
        expect(res.data).to.deep.equal(consumer)
      })
    })

    it('should not let pass without a bearer', () => {
      const req = {
        get: function (method) {
          if (method === 'Authorization') return undefined
        },
        logger: {
          debug: function () {}
        }
      }
      const res = {}
      const nextSpy = sinon.spy()
      return service.authorize(req, res, nextSpy).then(() => {
        nextSpy.getCall(0).args[0].code.should.equals(401)
      })
    })
  })

  describe('db tokens', () => {
    describe('I have a good token', () => {
      const consumer = {
        _id: 'test',
        name: 'test',
        email: 'test@test.test'
      }
      let Auth, service

      beforeEach(() => {
        Auth = proxyrequire('../auth.controller', {
          './db-tokens.service': class FakeTokenService {
            initialize () {
              return Promise.resolve(this)
            }
            getToken () {
              return Promise.resolve(consumer)
            }
          }
        })
        service = new Auth({tokenService: 'db'})
      })

      it('should let pass 200 + consumer', () => {
        const req = {
          get: function (params) { return '' },
          logger: {
            debug: function (params) {}
          }
        }
        const res = {}

        return service.authorize(req, res, function () {}).then(() => {
          expect(res.data).to.deep.equal(consumer)
        })
      })
    })

    describe('I have a bad token', () => {
      let Auth, service

      beforeEach(() => {
        Auth = proxyrequire('../auth.controller', {
          './db-tokens.service': class FakeTokenService {
            initialize () {
              return Promise.resolve(this)
            }
            getToken () {
              return Promise.resolve(null)
            }
          }
        })
        service = new Auth({tokenService: 'db'})
      })

      it('should not let pass 401 + Error', () => {
        const req = {
          get: function (params) { return '' },
          logger: {
            debug: function (params) {}
          }
        }
        const res = {}
        const nextSpy = sinon.spy()

        return service.authorize(req, res, nextSpy).then(() => {
          nextSpy.getCall(0).args[0].code.should.equals(401)
        })
      })
    })
  })

  describe('File tokens', () => {
    describe('I have a good token', () => {
      const consumer = {
        name: 'test',
        email: 'test@test.test'
      }
      let Auth, service

      beforeEach(() => {
        Auth = proxyrequire('../auth.controller', {
          './file-tokens.service': class FakeTokenService {
            initialize () {
              return Promise.resolve(this)
            }
            getToken () {
              return Promise.resolve(consumer)
            }
          }
        })
        service = new Auth({tokenService: 'file'})
      })

      it('should let pass 200 + consumer', () => {
        const req = {
          get: function (params) { return '' },
          logger: {
            debug: function (params) {}
          }
        }
        const res = {}

        return service.authorize(req, res, function () {}).then(() => {
          expect(res.data).to.deep.equal(consumer)
        })
      })
    })

    describe('I have a bad token', () => {
      let Auth, service

      beforeEach(() => {
        Auth = proxyrequire('../auth.controller', {
          './file-tokens.service': class FakeTokenService {
            initialize () {
              return Promise.resolve(this)
            }
            getToken () {
              return Promise.resolve(undefined)
            }
          }
        })
        service = new Auth({tokenService: 'file'})
      })

      it('should not let pass 401 + error', () => {
        const req = {
          get: function (params) { return '' },
          logger: {
            debug: function (params) {}
          }
        }
        const res = {}
        const nextSpy = sinon.spy()

        return service.authorize(req, res, nextSpy).then(() => {
          nextSpy.getCall(0).args[0].code.should.equals(401)
        })
      })
    })
  })
})
