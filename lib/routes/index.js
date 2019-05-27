const accessTokenRoute = require('./accessToken')
const obtainTokenRoute = require('./obtainToken')
const identityTokenRoute = require('./identityToken')
const revokeTokenRoute = require('./revokeToken')
const refleshTokenRoute = require('./refleshToken')
const authTokenRoute = require('./authToken')

module.exports = function ({
  router,
  route,
  auth,
  model,
  obtainToken,
  saveToken,
  expiresIn,
  fakeUrls,
  authToken,
  fakeTokens
}) {
  accessTokenRoute({ router })
  obtainTokenRoute({ router, route, auth, obtainToken })
  identityTokenRoute({ router, route, model })
  revokeTokenRoute({ router, route, model })
  refleshTokenRoute({router, route, model, saveToken, expiresIn})
  authTokenRoute({router, authToken, fakeTokens, fakeUrls, model})
}
