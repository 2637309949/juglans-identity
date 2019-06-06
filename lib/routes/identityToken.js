const utils = require('../utils')
const logger = require('../logger')

module.exports = function ({ router, route, model }) {
  router.get(route.identityToken, async function (ctx) {
    try {
      const accessToken = await utils.getAccessToken(ctx)
      const data = await model.findToken(accessToken)
      if (!data) {
        ctx.status = 400
        ctx.body = {
          message: 'invalid token'
        }
      } else {
        ctx.status = 200
        ctx.body = data.extra
      }
    } catch (error) {
      logger.error(error)
      ctx.status = 500
      ctx.body = { message: error.message }
    }
  })
}
