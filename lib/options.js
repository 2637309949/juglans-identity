// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const assert = require('assert').strict
const is = require('is')

class Option {
  constructor (funk) {
    this.funk = funk
  }
  apply (j) {
    return this.funk(j)
  }
  check (j) {
    return this.funk(j)
  }
}

module.exports.authOption = function (auth) {
  assert.ok(is.function(auth), 'auth can not be empty!')
  return new Option(function (i) {
    i.options.auth = auth
    return i
  })
}

module.exports.fakeUrlOption = function (...urls) {
  assert.ok(is.array(urls), 'urls can not be empty!')
  return new Option(function (i) {
    urls.forEach(url => {
      i.options.fakeUrls.push(url)
    })
    return i
  })
}

module.exports.modelOption = function (model) {
  assert.ok(is.object(model), 'model can not be empty!')
  return new Option(function (i) {
    i.model = model
    return i
  })
}

module.exports.Option = Option
