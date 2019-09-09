// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const moment = require('moment')
const utils = require('../utils')

module.exports = function ({ router, setToken, getToken, fakeTokens, fakeUrls, model }) {
  router.use(async function (ctx, next) {
    let token = await getToken(ctx)
    const { isFakeTokens, isFakeUrls } = await utils.fakeVerify(ctx.path, { fakeTokens, fakeUrls, accessToken: token && token.accessToken })
    if (isFakeUrls) {
      ctx.state.fakeUrl = true
      await next()
    } else if (isFakeTokens) {
      ctx.state.fakeToken = true
      await next()
    } else {
      token = await model.findToken(token && token.accessToken)
      if (!token) {
        ctx.status = 401
        ctx.body = {
          message: 'invalid token'
        }
        return
      }
      if (moment().unix() > token.expired) {
        ctx.status = 401
        ctx.body = {
          message: 'invalid token'
        }
        return
      }
      await setToken(ctx, token)
      await next()
    }
  })
}
