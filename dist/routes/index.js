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
    obtainToken,
    auth,
    findToken,
    revokeToken,
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
    obtainToken
  });
  identityTokenRoute({
    router,
    route,
    findToken
  });
  revokeTokenRoute({
    router,
    route,
    revokeToken
  });
  refleshTokenRoute({
    router,
    route,
    findToken,
    revokeToken,
    saveToken,
    expiresIn
  });
  authTokenRoute({
    router,
    authToken,
    fakeTokens,
    fakeUrls,
    findToken
  });
};