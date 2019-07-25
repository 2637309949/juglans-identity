"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const logger = require('../logger');

module.exports = function (_ref) {
  let {
    router,
    route,
    auth,
    obtainToken
  } = _ref;
  router.post(route.obtainToken,
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(function* (ctx) {
      try {
        const ret = yield auth(ctx);

        if (ret) {
          const info = yield obtainToken(ret);
          ctx.cookies.set('accessToken', info.accessToken, {
            maxAge: 60 * 60 * 24
          });
          ctx.status = 200;
          ctx.body = info;
        } else {
          throw new Error('user authentication failed');
        }
      } catch (error) {
        logger.error(error);
        ctx.status = 500;
        ctx.body = {
          message: 'Internal Server Error',
          stack: error.stack || error.message
        };
      }
    });

    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }());
};