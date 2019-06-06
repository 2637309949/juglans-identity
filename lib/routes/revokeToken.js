const utils = require('../utils')
const logger = require('../logger')

module.exports = function ({ router, route, model }) {
  router.post(route.revokeToken, async function (ctx) {
    try {
      const accessToken = await utils.getAccessToken(ctx)
      await model.revokeToken(accessToken)
      ctx.status = 200
      ctx.body = { success: true }
    } catch (error) {
      logger.error(error)
      ctx.status = 500
      ctx.body = { message: error.message }
    }
  })
}
