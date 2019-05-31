# juglans-identity

Provide user authentication and authorization function.

```javascript
app.Use(Identity({
  async auth (ctx) {
    const form = _.pick(ctx.request.body, 'username', 'password')
    const User = mongoose.model('User')
    // ctx.status.captcha
    const one = await User.findOne({ username: form.username, password: form.password })
    if (!one) return null
    return {
      id: one._id,
      email: one.email,
      username: one.username,
      departments: one.department,
      roles: one.roles
    }
  },
  fakeTokens: ['DEBUG'],
  fakeUrls: [/\/api\/v1\/upload\/.*$/, /\/api\/v1\/favicon\.ico$/],
  model: Identity.model.RedisModel({ redis })
}))

```

#### ObtainToken
```curl
double@double:~/juglans-template$ curl http://127.0.0.1:3001/api/v1/obtainToken -X POST -d "username=123&password=xxx"
{
  "accessToken":"E8V3TZX3XQEWN6E8B0VJTXK26Z8OF6F5",
  "refreshToken":"U1MPQIYQZKD86CYGWKDI04O4R5SK4FEW",
  "created":1559287003,
  "updated":1559287003,
  "expired":1559373403
}
```

#### IdentityToken
```curl
double@double:~/juglans-template$ curl http://127.0.0.1:3001/api/v1/identityToken -X GET -d "accessToken=E8V3TZX3XQEWN6E8B0VJTXK26Z8OF6F5"
{
  "id":"5ce8ba5e51603f528e568b47",
  "username":"123",
  "roles":[]
}
```

#### RefleshToken
```curl
double@double:~/juglans-template$ curl http://127.0.0.1:3001/api/v1/refleshToken -X POST -d "accessToken=U1MPQIYQZKD86CYGWKDI04O4R5SK4FEW"
{
  "accessToken":"0ILMFDM0JILCLJ5987HYMT2J18BYJDXI",
  "refreshToken":"U1MPQIYQZKD86CYGWKDI04O4R5SK4FEW",
  "created":1559287003,
  "updated":1559287592,
  "expired":1559373992,
  "extra":{
    "id":"5ce8ba5e51603f528e568b47","username":"123","roles":[]
  }
}
```
## MIT License

Copyright (c) 2018-2020 Double

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
