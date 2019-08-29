// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

module.exports = function ({ router, route, auth, obtainToken }) {
  router.post(route.obtainToken, async function (ctx) {
    try {
      const ret = await auth(ctx)
      if (ret) {
        const info = await obtainToken(ret)
        ctx.cookies.set('accessToken', info.accessToken,
          {
            maxAge: 60 * 60 * 24
          }
        )
        ctx.status = 200
        ctx.body = info
      } else {
        ctx.status = 500
        ctx.body = {
          message: 'user does not exist or password does not match'
        }
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = {
        message: error.message
      }
    }
  })
}
