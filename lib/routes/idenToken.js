// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

module.exports = function ({ iden, router, route, model, getToken }) {
  router.post(route.identityToken, iden || async function (ctx) {
    const token = await getToken(ctx)
    if (!token) {
      ctx.status = 400
      ctx.body = {
        message: 'invalid token'
      }
    } else {
      ctx.status = 200
      ctx.body = token.extra
    }
  })
}
