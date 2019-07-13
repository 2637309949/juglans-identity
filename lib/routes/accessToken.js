// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

module.exports = function ({ router, setToken }) {
  router.use(async function (ctx, next) {
    const body = ctx.request.body
    const accessToken = ctx.query['accessToken'] ||
          body['accessToken'] ||
          ctx.cookies.get('accessToken') ||
          ctx.get('accessToken')
    await setToken(ctx, { accessToken })
    await next()
  })
}
