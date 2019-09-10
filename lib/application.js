// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const assert = require('assert').strict
const moment = require('moment')
const is = require('is')
const utils = require('./utils')
const Routes = require('./routes/index')
const options = require('./options')
const model = require('./model')

function Identity ({ model, auth = utils.defaultAuth, iden, expiresIn = 24, fakeUrls = [], fakeTokens = [], route = { obtainToken: '/obtainToken', revokeToken: '/revokeToken', refleshToken: '/refleshToken', identityToken: '/identityToken' } }) {
  if (!(this instanceof Identity)) {
    return new Identity({ model, auth, iden, expiresIn, fakeUrls, fakeTokens, route })
  }
  assert.ok(is.number(expiresIn), 'expiresIn can not be empty!')
  assert.ok(is.array(fakeTokens) || is.function(fakeTokens), 'fakeTokens should be array or function!')
  assert.ok(is.array(fakeUrls) || is.function(fakeUrls), 'fakeUrls should be array or function!')
  this.options = { auth, iden, expiresIn, fakeUrls, fakeTokens, route }
  this.model = model
}

Identity.prototype.verifyContext = async function (ctx) {
  let token = await this.getToken(ctx)
  if (token && token.accessToken) {
    const one = await this.model.findToken(token.accessToken)
    if (one) {
      if (moment().unix() > one.expired) {
        return true
      }
    }
  }
  return false
}

Identity.prototype.verifyToken = async function (token) {
  const one = await this.model.findToken(token)
  if (one) {
    if (moment().unix() < one.expired) {
      return true
    }
  }
  return false
}

Identity.prototype.getToken = async function (ctx) {
  return ctx.state['token']
}

Identity.prototype.setToken = async function (ctx, data) {
  ctx.state['token'] = data
  return this
}

Identity.prototype.addOptions = function (...opts) {
  for (const opt of opts) {
    opt.apply(this)
  }
  return this
}

// ObtainToken user request and gen token and save token
Identity.prototype.obtainToken = async function (data) {
  const { expiresIn } = this.options
  const accessToken = utils.randomStr(32)
  const refreshToken = utils.randomStr(32)
  const created = moment().unix()
  const updated = moment().unix()
  const expired = moment().add(expiresIn, 'h').unix()
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

Identity.prototype.plugin = async function ({ router, config }) {
  let { auth, expiresIn, fakeUrls, fakeTokens, route, iden } = this.options
  if (is.function(fakeTokens)) {
    fakeTokens = await fakeTokens()
  }
  if (is.function(fakeUrls)) {
    fakeUrls = await fakeUrls()
  }
  const obtainToken = this.obtainToken.bind(this)
  const getToken = this.getToken.bind(this)
  const setToken = this.setToken.bind(this)
  const model = this.model
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
  return {
    identity: this
  }
}

Identity.model = model
Identity.options = options

module.exports = Identity
