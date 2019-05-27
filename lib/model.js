/**
 * @author [Double]
 * @email [2637309949@qq.com]
 * @create date 2019-01-05 14:31:34
 * @modify date 2019-01-05 14:31:34
 * @desc [Hooks for Reids Instance]
 */
const fmt = require('util').format
const assert = require('assert').strict
const is = require('is')

const FORMAT = {
  TOKEN: 'TOKEN:%s'
}

function json2Object (str) {
  try {
    if (!str) return null
    return JSON.parse(str)
  } catch (error) {
    throw new Error('parse token string wrong,', error)
  }
}

function object2Json (obj) {
  try {
    return JSON.stringify(obj)
  } catch (error) {
    throw new Error('parse token string wrong,', error)
  }
}

function RedisModel ({ redis }) {
  if (!(this instanceof RedisModel)) {
    return new RedisModel({ redis })
  }
  assert.ok(!is.undefined(redis), 'redis can not be empty!')
  this.redis = redis
}

RedisModel.prototype.saveToken = async function (item) {
  try {
    const strData = object2Json(item)
    await this.redis.set(fmt(FORMAT.TOKEN, item.accessToken), strData)
    await this.redis.set(fmt(FORMAT.TOKEN, item.refreshToken), strData)
  } catch (error) {
    throw error
  }
}

RedisModel.prototype.findToken = async function (accessToken, refreshToken) {
  try {
    const token = accessToken || refreshToken
    const tokenRaw = await this.redis.get(fmt(FORMAT.TOKEN, token))
    return json2Object(tokenRaw)
  } catch (error) {
    throw error
  }
}

RedisModel.prototype.revokeToken = async function (accessToken) {
  try {
    await this.redis.del(fmt(FORMAT.TOKEN, accessToken))
  } catch (error) {
    throw error
  }
}

module.exports.RedisModel = RedisModel
