"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const utils = require('../utils');

const logger = require('../logger');

module.exports = function (_ref) {
  let {
    router,
    route,
    model
  } = _ref;
  router.post(route.revokeToken,
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(function* (ctx) {
      try {
        const accessToken = yield utils.getAccessToken(ctx);
        yield model.revokeToken(accessToken);
        ctx.status = 200;
        ctx.body = {
          success: true
        };
      } catch (error) {
        logger.error(error);
        ctx.status = 500;
        ctx.body = {
          message: error.message
        };
      }
    });

    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }());
};