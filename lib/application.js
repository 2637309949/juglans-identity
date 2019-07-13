// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const assert = require('assert').strict
const moment = require('moment')
const is = require('is')
const utils = require('./utils')
const Routes = require('./routes/index')
const model = require('./model')

function Identity ({ model, auth, iden, expiresIn = 24, fakeUrls = [], fakeTokens = [], route = { obtainToken: '/obtainToken', revokeToken: '/revokeToken', refleshToken: '/refleshToken', identityToken: '/identityToken' }, store: { saveToken, revokeToken, findToken } = {} }) {
  if (!(this instanceof Identity)) {
    return new Identity({ model, auth, iden, expiresIn, fakeUrls, fakeTokens, route, store: { saveToken, revokeToken, findToken } })
  }
  assert.ok(is.object(model), 'model can not be empty!')
  assert.ok(is.function(auth), 'auth can not be empty!')
  assert.ok(is.number(expiresIn), 'expiresIn can not be empty!')
  assert.ok(is.array(fakeTokens) || is.function(fakeTokens), 'fakeTokens should be array or function!')
  assert.ok(is.array(fakeUrls) || is.function(fakeUrls), 'fakeUrls should be array or function!')
  this.options = { auth, iden, expiresIn, fakeUrls, fakeTokens, route, saveToken, revokeToken, findToken }
  this.model = model
}

const proto = Identity.prototype
proto.getToken = async function (ctx) {
  return ctx.state['token']
}

proto.setToken = async function (ctx, data) {
  ctx.state['token'] = data
  return this
}

// ObtainToken user request and gen token and save token
proto.obtainToken = async function (data) {
  const { expiresIn } = this.options
  const accessToken = utils.randomStr(32)
  const refreshToken = utils.randomStr(32)
  const created = moment().unix()
  const updated = moment().unix()
  const expired = moment().add(expiresIn, 'hour').unix()
  await this.model.saveToken({
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

proto.plugin = async function ({ router, config }) {
  let { auth, expiresIn, fakeUrls, fakeTokens, route, iden } = this.options
  const model = this.model
  assert.ok(is.function(model.revokeToken), 'revokeToken can not be empty!')
  assert.ok(is.function(model.findToken), 'findToken can not be empty!')
  assert.ok(is.function(model.saveToken), 'saveToken can not be empty!')
  if (is.function(fakeTokens)) {
    fakeTokens = await fakeTokens()
  }
  if (is.function(fakeUrls)) {
    fakeUrls = await fakeUrls()
  }

  const obtainToken = this.obtainToken.bind(this)
  const getToken = this.getToken.bind(this)
  const setToken = this.setToken.bind(this)

  Routes({
    getToken,
    setToken,
    router,
    route,
    obtainToken,
    auth,
    iden,
    model,
    expiresIn,
    fakeUrls,
    fakeTokens
  })
}

Identity.model = model

module.exports = Identity
