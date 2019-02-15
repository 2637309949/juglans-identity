"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const utils = require('../utils');

module.export = function (_ref) {
  let {
    router,
    authToken,
    fakeTokens,
    fakeUrls,
    findToken
  } = _ref;
  router.use(
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(function* (ctx, next) {
      try {
        const accessToken = yield utils.getAccessToken(ctx);
        const {
          isFakeTokens,
          isFakeUrls
        } = yield utils.fakeVerify(ctx.path, {
          fakeTokens,
          fakeUrls,
          accessToken
        });

        if (isFakeUrls) {
          ctx.state.fakeUrl = true;
          yield next();
        } else if (isFakeTokens) {
          ctx.state.fakeToken = true;
          yield next();
        } else {
          const ret = yield authToken(accessToken);

          if (!ret) {
            ctx.status = 401;
            ctx.body = {
              message: 'invalid token'
            };
          } else {
            const token = yield findToken(accessToken);
            yield utils.setAccessData(ctx, token.extra);
            yield next();
          }
        }
      } catch (error) {
        ctx.status = 500;
        ctx.body = {
          message: error.message
        };
      }
    });

    return function (_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }());
};