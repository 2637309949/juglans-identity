// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const utils = require('../utils')

module.exports = function ({ router }) {
  router.use(async function (ctx, next) {
    const body = ctx.request.body
    const accessToken = ctx.query['accessToken'] ||
          body['accessToken'] ||
          ctx.cookies.get('accessToken') ||
          ctx.get('Authorization') ||
          ctx.get('accessToken')
    await utils.setAccessToken(ctx, accessToken)
    await next()
  })
}
