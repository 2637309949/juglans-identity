/**
 * @author [Double]
 * @email [2637309949@qq.com]
 * @create date 2019-01-09 16:55:19
 * @modify date 2019-01-09 16:55:19
 * @desc [User Identity]
 */
const assert = require('assert').strict
const moment = require('moment')
const is = require('is')
const utils = require('./utils')
const Routes = require('./routes/index')

function Identity ({ auth, expiresIn = 24, fakeUrls = [], fakeTokens = [], route = { obtainToken: '/obtainToken', revokeToken: '/revokeToken', refleshToken: '/refleshToken', identityToken: '/identityToken' }, store: { saveToken, revokeToken, findToken } = {} }) {
  if (!(this instanceof Identity)) {
    return new Identity({ auth, expiresIn, fakeUrls, fakeTokens, route, store: { saveToken, revokeToken, findToken } })
  }
  assert.ok(is.function(revokeToken), 'revokeToken can not be empty!')
  assert.ok(is.function(findToken), 'findToken can not be empty!')
  assert.ok(is.function(saveToken), 'saveToken can not be empty!')
  assert.ok(is.function(auth), 'auth can not be empty!')
  assert.ok(is.number(expiresIn), 'expiresIn can not be empty!')
  assert.ok(is.array(fakeTokens) || is.function(fakeTokens), 'fakeTokens should be array or function!')
  assert.ok(is.array(fakeUrls) || is.function(fakeUrls), 'fakeUrls should be array or function!')
  this.options = { auth, expiresIn, fakeUrls, fakeTokens, route, saveToken, revokeToken, findToken }
}
// Export Identity
const proto = Identity.prototype

// ObtainToken user request and gen token and save token
proto.obtainToken = async function (data) {
  const { expiresIn, saveToken } = this.options
  const accessToken = utils.randomStr(32)
  const refreshToken = utils.randomStr(32)
  const created = moment().unix()
  const updated = moment().unix()
  const expired = moment().add(expiresIn, 'hour').unix()
  await saveToken({
    accessToken,
    refreshToken,
    created,
    updated,
    expired,
    extra: data
  })
  return {
    accessToken,
    refreshToken,
    created,
    updated,
    expired
  }
}

// Auth request token
proto.authToken = async function (accessToken) {
  const { findToken } = this.options
  const token = await findToken(accessToken)
  const now = moment().unix()
  if (!token) {
    return false
  } else if (now > token.expired) {
    return false
  } else {
    return true
  }
}

// Export Plugin
proto.plugin = async function ({ router }) {
  let { auth, expiresIn, fakeUrls, fakeTokens, route, saveToken, revokeToken, findToken } = this.options
  if (is.function(fakeTokens)) {
    fakeTokens = await fakeTokens()
  }
  if (is.function(fakeUrls)) {
    fakeUrls = await fakeUrls()
  }
  const obtainToken = this.obtainToken.bind(this)
  const authToken = this.authToken.bind(this)
  Routes({
    router,
    route,
    obtainToken,
    auth,
    findToken,
    revokeToken,
    saveToken,
    expiresIn,
    fakeUrls,
    authToken,
    fakeTokens
  })
}

Identity.getAccessData = utils.getAccessData
Identity.getAccessToken = utils.getAccessToken
module.exports = Identity
