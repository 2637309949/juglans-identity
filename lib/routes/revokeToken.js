// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

module.exports = function ({ router, route, model, getToken }) {
  router.post(route.revokeToken, async function (ctx) {
    const token = await getToken(ctx)
    await model.revokeToken(token.accessToken)
    ctx.status = 200
    ctx.body = { success: true }
  })
}
