// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const tokenKey = 'accessToken'
module.exports = function ({ router, setToken }) {
  router.use(async function (ctx, next) {
    const body = ctx.request.body
    const accessToken = ctx.query[tokenKey] ||
          body[tokenKey] ||
          ctx.cookies.get(tokenKey) ||
          ctx.get(tokenKey)
    if (accessToken) {
      await setToken(ctx, { accessToken })
    }
    await next()
  })
}
