"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
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
};

repo.defaultAuth =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(function* (ctx) {
    throw new Error('user authentication failed');
  });

  return function (_x3) {
    return _ref2.apply(this, arguments);
  };
}();