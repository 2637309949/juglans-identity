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
    route,
    model,
    getToken,
    expiresIn
  } = _ref;
  router.post(route.refleshToken,
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(function* (ctx) {
      const token = yield getToken(ctx);
      const data = yield model.findToken(null, token.accessToken);

      if (!data) {
        ctx.status = 500;
        ctx.body = {
          message: 'invalid token'
        };
      } else {
        yield model.revokeToken(token.accessToken);
        data.accessToken = utils.randomStr(32);
        data.updated = moment().unix();
        data.expired = moment().add(expiresIn, 'hour').unix();
        yield model.saveToken(data);
        ctx.status = 200;
        delete data.extra;
        ctx.body = data;
      }
    });

    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }());
};