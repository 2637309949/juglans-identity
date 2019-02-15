"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * @author [Double]
 * @email [2637309949@qq.com]
 * @create date 2019-01-09 16:55:19
 * @modify date 2019-01-09 16:55:19
 * @desc [User Identity]
 */
const assert = require('assert').strict;

const moment = require('moment');

const is = require('is');

const utils = require('./utils');

const Routes = require('./routes'); // Identity contructor


function Identity(_ref) {
  let {
    auth,
    expiresIn = 24,
    fakeUrls = [],
    fakeTokens = [],
    route = {
      obtainToken: '/obtainToken',
      revokeToken: '/revokeToken',
      refleshToken: '/refleshToken',
      identityToken: '/identityToken'
    },
    store: {
      saveToken,
      revokeToken,
      findToken
    } = {}
  } = _ref;

  if (!(this instanceof Identity)) {
    return new Identity({
      auth,
      expiresIn,
      fakeUrls,
      fakeTokens,
      route,
      store: {
        saveToken,
        revokeToken,
        findToken
      }
    });
  }

  assert.ok(is.function(revokeToken), 'revokeToken can not be empty!');
  assert.ok(is.function(findToken), 'findToken can not be empty!');
  assert.ok(is.function(saveToken), 'saveToken can not be empty!');
  assert.ok(is.number(expiresIn), 'expiresIn can not be empty!');
  assert.ok(is.function(auth), 'auth can not be empty!');
  assert.ok(is.array(fakeTokens), 'fakeTokens should be array!');
  assert.ok(is.array(fakeUrls), 'fakeUrls should be array!');
  this.options = {
    auth,
    expiresIn,
    fakeUrls,
    fakeTokens,
    route,
    saveToken,
    revokeToken,
    findToken
  };
} // Export Identity


const proto = Identity.prototype; // ObtainToken user request and gen token and save token

proto.obtainToken =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(function* (data) {
    const {
      expiresIn,
      saveToken
    } = this.options;
    const accessToken = utils.randomStr(32);
    const refreshToken = utils.randomStr(32);
    const created = moment().unix();
    const updated = moment().unix();
    const expired = moment().add(expiresIn, 'hour').unix();
    yield saveToken({
      accessToken,
      refreshToken,
      created,
      updated,
      expired,
      extra: data
    });
    return {
      accessToken,
      refreshToken,
      created,
      updated,
      expired
    };
  });

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}(); // Auth request token


proto.authToken =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(function* (accessToken) {
    const {
      findToken
    } = this.options;
    const token = yield findToken(accessToken);
    const now = moment().unix();

    if (!token) {
      return false;
    } else if (now > token.expired) {
      return false;
    } else {
      return true;
    }
  });

  return function (_x2) {
    return _ref3.apply(this, arguments);
  };
}(); // Export Plugin


proto.plugin = function (_ref4) {
  let {
    router
  } = _ref4;
  const {
    auth,
    expiresIn,
    fakeUrls,
    fakeTokens,
    route,
    saveToken,
    revokeToken,
    findToken
  } = this.options;
  const obtainToken = this.obtainToken.bind(this);
  const authToken = this.authToken.bind(this);
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
  });
};

Identity.getAccessData = utils.getAccessData;
Identity.getAccessToken = utils.getAccessToken;
module.exports = Identity;