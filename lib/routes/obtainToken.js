const logger = require('../logger')

module.exports = function ({ router, route, auth, obtainToken }) {
  router.post(route.obtainToken, async function (ctx) {
    try {
      const ret = await auth(ctx)
      if (ret) {
        const data = await obtainToken(ret)
        ctx.status = 200
        ctx.body = data
      } else {
        ctx.status = 400
        ctx.body = {
          message: 'user authentication failed!'
        }
      }
    } catch (error) {
      logger.error(error)
      ctx.status = 500
      ctx.body = { message: error.message }
    }
  })
}
