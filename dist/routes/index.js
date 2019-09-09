"use strict";

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const accessTokenRoute = require('./accessToken');

const obtainTokenRoute = require('./obtainToken');

const idenToken = require('./idenToken');

const revokeTokenRoute = require('./revokeToken');

const refleshTokenRoute = require('./refleshToken');

const authTokenRoute = require('./authToken');

module.exports = function (_ref) {
  let {
    getToken,
    setToken,
    router,
    route,
    auth,
    iden,
    model,
    obtainToken,
    saveToken,
    expiresIn,
    fakeUrls,
    fakeTokens
  } = _ref;
  accessTokenRoute({
    router,
    setToken
  });
  obtainTokenRoute({
    router,
    route,
    auth,
    obtainToken,
    expiresIn
  });
  authTokenRoute({
    router,
    setToken,
    getToken,
    fakeTokens,
    fakeUrls,
    model
  });
  idenToken({
    iden,
    router,
    route,
    model,
    getToken,
    setToken
  });
  revokeTokenRoute({
    router,
    route,
    model,
    getToken
  });
  refleshTokenRoute({
    router,
    route,
    getToken,
    model,
    saveToken,
    expiresIn
  });
};