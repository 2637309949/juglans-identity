"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const fmt = require('util').format;

const assert = require('assert').strict;

const is = require('is');

const logger = require('./logger');

const FORMAT = {
  TOKEN: 'TOKEN:%s'
};

function json2Object(str) {
  try {
    if (!str) return null;
    return JSON.parse(str);
  } catch (error) {
    logger.error(error);
    throw new Error('parse token string wrong,', error);
  }
}

function object2Json(obj) {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    logger.error(error);
    throw new Error('parse token string wrong,', error);
  }
}

function RedisModel(_ref) {
  let {
    redis
  } = _ref;

  if (!(this instanceof RedisModel)) {
    return new RedisModel({
      redis
    });
  }

  assert.ok(!is.undefined(redis), 'redis can not be empty!');
  this.redis = redis;
}

RedisModel.prototype.saveToken =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(function* (item) {
    try {
      const strData = object2Json(item);
      yield this.redis.set(fmt(FORMAT.TOKEN, item.accessToken), strData);
      yield this.redis.set(fmt(FORMAT.TOKEN, item.refreshToken), strData);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  });

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();

RedisModel.prototype.findToken =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(function* (accessToken, refreshToken) {
    try {
      if (accessToken) {
        const tokenRaw = yield this.redis.get(fmt(FORMAT.TOKEN, accessToken));
        const token = json2Object(tokenRaw);

        if (!token) {
          return null;
        }

        return token.accessToken === accessToken;
      } else if (refreshToken) {
        const tokenRaw = yield this.redis.get(fmt(FORMAT.TOKEN, refreshToken));
        const token = json2Object(tokenRaw);

        if (!token) {
          return null;
        }

        return token.refreshToken === refreshToken;
      }

      return null;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  });

  return function (_x2, _x3) {
    return _ref3.apply(this, arguments);
  };
}();

RedisModel.prototype.revokeToken =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(function* (accessToken) {
    try {
      yield this.redis.del(fmt(FORMAT.TOKEN, accessToken));
    } catch (error) {
      logger.error(error);
      throw error;
    }
  });

  return function (_x4) {
    return _ref4.apply(this, arguments);
  };
}();

module.exports.RedisModel = RedisModel;