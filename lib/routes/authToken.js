const utils = require('../utils')
const logger = require('../logger')

module.exports = function ({ router, authToken, fakeTokens, fakeUrls, model }) {
  router.use(async function (ctx, next) {
    try {
      const accessToken = await utils.getAccessToken(ctx)
      const { isFakeTokens, isFakeUrls } = await utils.fakeVerify(ctx.path, { fakeTokens, fakeUrls, accessToken })
      if (isFakeUrls) {
        ctx.state.fakeUrl = true
        await next()
      } else if (isFakeTokens) {
        ctx.state.fakeToken = true
        await next()
      } else {
        const ret = await authToken(accessToken)
        if (!ret) {
          ctx.status = 401
          ctx.body = {
            message: 'invalid token'
          }
        } else {
          const token = await model.findToken(accessToken)
          await utils.setAccessData(ctx, token.extra)
          await next()
        }
      }
    } catch (error) {
      logger.error(error)
      ctx.status = 500
      ctx.body = { message: error.message }
    }
  })
}
