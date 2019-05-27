"use strict";

const accessTokenRoute = require('./accessToken');

const obtainTokenRoute = require('./obtainToken');

const identityTokenRoute = require('./identityToken');

const revokeTokenRoute = require('./revokeToken');

const refleshTokenRoute = require('./refleshToken');

const authTokenRoute = require('./authToken');

module.exports = function (_ref) {
  let {
    router,
    route,
    auth,
    model,
    saveToken,
    expiresIn,
    fakeUrls,
    authToken,
    fakeTokens
  } = _ref;
  accessTokenRoute({
    router
  });
  obtainTokenRoute({
    router,
    route,
    auth,
    model
  });
  identityTokenRoute({
    router,
    route,
    model
  });
  revokeTokenRoute({
    router,
    route,
    model
  });
  refleshTokenRoute({
    router,
    route,
    model,
    saveToken,
    expiresIn
  });
  authTokenRoute({
    router,
    authToken,
    fakeTokens,
    fakeUrls,
    model
  });
};