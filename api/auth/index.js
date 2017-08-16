const express = require('express')
const Controller = require('./auth.controller')
const format = require('../lib/utils/format')

module.exports = function (options) {
  const router = express.Router()
  const controller = new Controller(options)

  router.get('/authorize', (req, res, next) => controller.authorize(req, res, next))

  router.use('/', format)
  return router
}
