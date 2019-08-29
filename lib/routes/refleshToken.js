// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const moment = require('moment')
const utils = require('../utils')

module.exports = function ({ router, route, model, getToken, expiresIn }) {
  router.post(route.refleshToken, async function (ctx) {
    const token = await getToken(ctx)
    const data = await model.findToken(null, token.accessToken)
    if (!data) {
      ctx.status = 500
      ctx.body = {
        message: 'invalid token'
      }
    } else {
      await model.revokeToken(token.accessToken)
      data.accessToken = utils.randomStr(32)
      data.updated = moment().unix()
      data.expired = moment().add(expiresIn, 'hour').unix()
      await model.saveToken(data)
      ctx.status = 200
      delete data.extra
      ctx.body = data
    }
  })
}
