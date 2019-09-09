"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const moment = require('moment');

const utils = require('../utils');

module.exports = function (_ref) {
  let {
    router,
    setToken,
    getToken,
    fakeTokens,
    fakeUrls,
    model
  } = _ref;
  router.use(
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(function* (ctx, next) {
      let token = yield getToken(ctx);
      const {
        isFakeTokens,
        isFakeUrls
      } = yield utils.fakeVerify(ctx.path, {
        fakeTokens,
        fakeUrls,
        accessToken: token && token.accessToken
      });

      if (isFakeUrls) {
        ctx.state.fakeUrl = true;
        yield next();
      } else if (isFakeTokens) {
        ctx.state.fakeToken = true;
        yield next();
      } else {
        token = yield model.findToken(token && token.accessToken);

        if (!token) {
          ctx.status = 401;
          ctx.body = {
            message: 'invalid token'
          };
          return;
        }

        if (moment().unix() > token.expired) {
          ctx.status = 401;
          ctx.body = {
            message: 'invalid token'
          };
          return;
        }

        yield setToken(ctx, token);
        yield next();
      }
    });

    return function (_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }());
};