"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * @author [Double]
 * @email [2637309949@qq.com]
 * @create date 2019-02-14 14:23:53
 * @modify date 2019-02-14 14:23:53
 * @desc [Utils Tools]
 */
const is = require('is');

const repo = exports; // Skip some spec route or token

repo.fakeVerify =
/*#__PURE__*/
function () {
  var _fakeVerify = _asyncToGenerator(function* (reqPath, _ref) {
    let {
      fakeTokens,
      fakeUrls,
      accessToken
    } = _ref;
    const fakeTokensIndex = fakeTokens.findIndex(x => x === accessToken);
    const fakeUrlsIndex = fakeUrls.findIndex(x => {
      if (is.regexp(x) && x.test(reqPath)) {
        return true;
      } else if (is.string(x) && x === reqPath) {
        return true;
      } else {
        return false;
      }
    });
    return {
      isFakeTokens: fakeTokensIndex !== -1,
      isFakeUrls: fakeUrlsIndex !== -1
    };
  });

  function fakeVerify(_x, _x2) {
    return _fakeVerify.apply(this, arguments);
  }

  return fakeVerify;
}(); // Generate random string


repo.randomStr = function () {
  let number = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 32;
  let text = '';

  if (is.number(number)) {
    const CARDINALSTR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for (let i = 0; i < number; i++) {
      text += CARDINALSTR.charAt(Math.floor(Math.random() * CARDINALSTR.length));
    }
  }

  return text;
}; // Get data after auth by iden plugin


repo.getAccessToken =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(function* (ctx) {
    return ctx.state.accessToken;
  });

  return function (_x3) {
    return _ref2.apply(this, arguments);
  };
}(); // Set data after auth by iden plugin


repo.setAccessData =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(function* (ctx, data) {
    ctx.state.accessData = data;
  });

  return function (_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}(); // Get data after auth by iden plugin


repo.getAccessData =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(function* (ctx) {
    return ctx.state.accessData;
  });

  return function (_x6) {
    return _ref4.apply(this, arguments);
  };
}(); // Set data after auth by iden plugin


repo.setAccessToken =
/*#__PURE__*/
function () {
  var _setAccessToken = _asyncToGenerator(function* (ctx, accessToken) {
    ctx.state.accessToken = accessToken;
  });

  function setAccessToken(_x7, _x8) {
    return _setAccessToken.apply(this, arguments);
  }

  return setAccessToken;
}();