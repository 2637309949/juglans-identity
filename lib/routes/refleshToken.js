// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const moment = require('moment')
const logger = require('../logger')
const utils = require('../utils')

module.exports = function ({ router, route, model, expiresIn }) {
  router.post(route.refleshToken, async function (ctx) {
    try {
      const accessToken = await utils.getAccessToken(ctx)
      const data = await model.findToken(null, accessToken)
      if (!data) {
        ctx.status = 400
        ctx.body = {
          message: 'invalid refleshToken'
        }
      } else {
        // rebuild Token
        await model.revokeToken(accessToken)
        data.accessToken = utils.randomStr(32)
        data.updated = moment().unix()
        data.expired = moment().add(expiresIn, 'hour').unix()
        await model.saveToken(data)
        ctx.status = 200
        ctx.body = data
      }
    } catch (error) {
      logger.error(error)
      ctx.status = 500
      ctx.body = { message: error.message }
    }
  })
}
