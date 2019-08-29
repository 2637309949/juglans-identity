"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const assert = require('assert').strict;

const moment = require('moment');

const is = require('is');

const utils = require('./utils');

const Routes = require('./routes/index');

const options = require('./options');

const model = require('./model');

function Identity(_ref) {
  let {
    model,
    auth = utils.defaultAuth,
    iden,
    expiresIn = 24,
    fakeUrls = [],
    fakeTokens = [],
    route = {
      obtainToken: '/obtainToken',
      revokeToken: '/revokeToken',
      refleshToken: '/refleshToken',
      identityToken: '/identityToken'
    }
  } = _ref;

  if (!(this instanceof Identity)) {
    return new Identity({
      model,
      auth,
      iden,
      expiresIn,
      fakeUrls,
      fakeTokens,
      route
    });
  }

  assert.ok(is.number(expiresIn), 'expiresIn can not be empty!');
  assert.ok(is.array(fakeTokens) || is.function(fakeTokens), 'fakeTokens should be array or function!');
  assert.ok(is.array(fakeUrls) || is.function(fakeUrls), 'fakeUrls should be array or function!');
  this.options = {
    auth,
    iden,
    expiresIn,
    fakeUrls,
    fakeTokens,
    route
  };
  this.model = model;
}

const proto = Identity.prototype;

proto.getToken =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(function* (ctx) {
    return ctx.state['token'];
  });

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();

proto.setToken =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(function* (ctx, data) {
    ctx.state['token'] = data;
    return this;
  });

  return function (_x2, _x3) {
    return _ref3.apply(this, arguments);
  };
}();

proto.addOptions = function () {
  for (var _len = arguments.length, opts = new Array(_len), _key = 0; _key < _len; _key++) {
    opts[_key] = arguments[_key];
  }

  for (const opt of opts) {
    opt.apply(this);
  }

  return this;
}; // ObtainToken user request and gen token and save token


proto.obtainToken =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(function* (data) {
    const {
      expiresIn
    } = this.options;
    const accessToken = utils.randomStr(32);
    const refreshToken = utils.randomStr(32);
    const created = moment().unix();
    const updated = moment().unix();
    const expired = moment().add(expiresIn, 'hour').unix();
    yield this.model.saveToken({
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

  return function (_x4) {
    return _ref4.apply(this, arguments);
  };
}();

proto.plugin =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(function* (_ref5) {
    let {
      router,
      config
    } = _ref5;
    let {
      auth,
      expiresIn,
      fakeUrls,
      fakeTokens,
      route,
      iden
    } = this.options;

    if (is.function(fakeTokens)) {
      fakeTokens = yield fakeTokens();
    }

    if (is.function(fakeUrls)) {
      fakeUrls = yield fakeUrls();
    }

    const obtainToken = this.obtainToken.bind(this);
    const getToken = this.getToken.bind(this);
    const setToken = this.setToken.bind(this);
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
    });
  });

  return function (_x5) {
    return _ref6.apply(this, arguments);
  };
}();

Identity.model = model;
Identity.options = options;
module.exports = Identity;