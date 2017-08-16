const express = require('express')
const Controller = require('./system.controller')
const format = require('../lib/utils/format')

var router = express.Router()

module.exports = function (options) {
  const controller = new Controller(options)

  // router.get('/swagger.yaml', systemController.swagger)
  router.get('/ping', controller.ping)
  router.get('/ping', format)
  return router
}
