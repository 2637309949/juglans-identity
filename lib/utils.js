/**
 * @author [Double]
 * @email [2637309949@qq.com]
 * @create date 2019-02-14 14:23:53
 * @modify date 2019-02-14 14:23:53
 * @desc [Utils Tools]
 */
const is = require('is')
const repo = exports

// Skip some spec route or token
repo.fakeVerify = async function fakeVerify (reqPath, { fakeTokens, fakeUrls, accessToken }) {
  const fakeTokensIndex = fakeTokens.findIndex(x => x === accessToken)
  const fakeUrlsIndex = fakeUrls.findIndex(x => {
    if (is.regexp(x) && x.test(reqPath)) {
      return true
    } else if (is.string(x) && x === reqPath) {
      return true
    } else {
      return false
    }
  })
  return {
    isFakeTokens: fakeTokensIndex !== -1,
    isFakeUrls: fakeUrlsIndex !== -1
  }
}

// Generate random string
repo.randomStr = function (number = 32) {
  let text = ''
  if (is.number(number)) {
    const CARDINALSTR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    for (let i = 0; i < number; i++) {
      text += CARDINALSTR.charAt(Math.floor(Math.random() * CARDINALSTR.length))
    }
  }
  return text
}

// Get data after auth by iden plugin
repo.getAccessToken = async function (ctx) {
  return ctx.state.accessToken
}

// Set data after auth by iden plugin
repo.setAccessData = async function (ctx, data) {
  ctx.state.accessData = data
}

// Get data after auth by iden plugin
repo.getAccessData = async function (ctx) {
  return ctx.state.accessData
}

// Set data after auth by iden plugin
repo.setAccessToken = async function setAccessToken (ctx, accessToken) {
  ctx.state.accessToken = accessToken
}
