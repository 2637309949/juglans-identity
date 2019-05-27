
module.exports = function ({ router, route, auth, model }) {
  router.post(route.obtainToken, async function (ctx) {
    try {
      const ret = await auth(ctx)
      if (ret) {
        const data = await model.obtainToken(ret)
        ctx.status = 200
        ctx.body = data
      } else {
        ctx.status = 400
        ctx.body = {
          message: 'user authentication failed!'
        }
      }
    } catch (error) {
      console.error(error)
      ctx.status = 500
      ctx.body = { message: error.message }
    }
  })
}
