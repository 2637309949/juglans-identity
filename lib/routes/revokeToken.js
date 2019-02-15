const utils = require('../utils')

module.exports = function ({ router, route, revokeToken }) {
  router.post(route.revokeToken, async function (ctx) {
    try {
      const accessToken = await utils.getAccessToken(ctx)
      await revokeToken(accessToken)
      ctx.status = 200
      ctx.body = { success: true }
    } catch (error) {
      console.error(error)
      ctx.status = 500
      ctx.body = { message: error.message }
    }
  })
}
