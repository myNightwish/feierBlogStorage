---
title: 跨域中的CORS、JSONP
tags: 跨域解决方案
categories: 1.3-Ajax
description: 跨域解决方案中的CORS、JSONP
cover: >-
  https://images.unsplash.com/photo-1593642532871-8b12e02d091c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1112&q=80
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: 2971665882
date: 2021-12-27 21:27:13
---

### 方案1、CORS（跨域资源共享） ###

浏览器与服务器商量后的一个结果

#### 1、概念 ####

* 是一种机制，使用额外的 [HTTP](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FGlossary%2FHTTP) 头来允许服务器声明哪些源 可以通过浏览器有权限访问哪些资源。

* 不需要在客户端做任何特殊的操作，浏览器会自动进行 CORS 通信，实现 CORS 通信的关键是后端。只要后端实现了 CORS，就实现了跨域。
* 虽然设置 CORS 和前端没什么关系，但是通过这种方式解决跨域问题的话，会在发送请求时出现两种情况，分别为**简单请求**和**复杂请求**。
  * 简单请求：不会触发预检请求的请求
  * 复杂请求：除了简单请求

#### 2、简单请求如何工作 ####

浏览器发现这次跨源AJAX请求是简单请求，就自动在头信息添加一个`Origin`字段：

* 用来说明，本次请求来自哪个源（协议 + 域名 + 端口）
* 服务器根据这个值，决定是否同意这次请求

```js
GET /cors HTTP/1.1
Origin: http://api.bob.com
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

1. 如果`Origin`指定的源，不在许可范围内，服务器会返回一个正常的HTTP回应：

   浏览器发现，这个回应的头信息没有包含`Access-Control-Allow-Origin`字段，就知道出错了，从而抛出一个错误，被`XMLHttpRequest`的`onerror`回调函数捕获

   【注意】：这种错误无法通过状态码识别，因为HTTP回应的状态码有可能是200

2. 如果`Origin`指定的域名在许可范围内，服务器返回的响应，会多出几个头信息字段。

> ```http
> Access-Control-Allow-Origin: http://api.bob.com
> Access-Control-Allow-Credentials: true
> // 指定后，可以返回`FooBar`字段的值
> Access-Control-Expose-Headers: FooBar
> 
> Content-Type: text/html; charset=utf-8
> ```

上面的头信息之中，有三个与CORS请求相关的字段，都以`Access-Control-`开头。

**（1）Access-Control-Allow-Origin**

* 必须。它的值要么是请求时`Origin`字段的值，要么是一个`*`，表示接受任意域名的请求

**（2）Access-Control-Allow-Credentials**

* 可选。它的值是一个布尔值，表示**是否允许发送Cookie**
* 默认情况下，Cookie不包括在CORS请求之中。设为`true`，即表示服务器明确许可，Cookie可以包含在请求中，一起发给服务器

* 这个值也只能设为`true`，如果服务器不要浏览器发送Cookie，删除该字段即可

**（3）Access-Control-Expose-Headers**

* 可选，CORS请求时，`XMLHttpRequest`对象的`getResponseHeader()`方法只能拿到6个基本字段：`Cache-Control`、`Content-Language`、`Content-Type`、`Expires`、`Last-Modified`、`Pragma`

* 如果想拿到其他字段，就必须在`Access-Control-Expose-Headers`里面指定

#### 3、 withCredentials 属性 ####

1. CORS请求默认不发送Cookie和HTTP认证信息。如果要把Cookie发到服务器，一方面要服务器同意，指定`Access-Control-Allow-Credentials`字段

> ```http
> Access-Control-Allow-Credentials: true
> ```

2. 另一方面，开发者必须在AJAX请求中打开`withCredentials`属性。否则，即使服务器同意发送Cookie，浏览器也不会发送。或者，服务器要求设置Cookie，浏览器也不会处理

> ```javascript
> var xhr = new XMLHttpRequest();
> xhr.withCredentials = true;
> ```

3. 但是，如果省略`withCredentials`设置，有的浏览器还是会一起发送Cookie。这时，可以显式关闭`withCredentials`。

> ```javascript
> xhr.withCredentials = false;
> ```

【注意】：

1. 如果要发送Cookie，`Access-Control-Allow-Origin`就不能设为星号，必须指定明确的、与请求网页一致的域名
2. 同时，Cookie依然遵循同源政策，只有用服务器域名设置的Cookie才会上传，其他域名的Cookie并不会上传
3. 且（跨源）原网页代码中的`document.cookie`也无法读取服务器域名下的Cookie

#### 4、复杂请求如何工作 ####

复杂请求的CORS请求，会在正式通信之前，增加一次HTTP查询请求，称为"预检"请求，通过该请求来知道服务端是否允许跨域请求

* 浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些HTTP动词和头信息字段
* 只有得到肯定答复，浏览器才会发出正式的`XMLHttpRequest`请求，否则就报错

#### 4.1、预检请求的发送 ####

* "预检"请求用的请求方法是`OPTIONS`，表示这个请求是用来询问的。头信息里面，关键字段是`Origin`，表示请求来自哪个源。

* 除了`Origin`字段，"预检"请求的头信息包括两个特殊字段

**（1）Access-Control-Request-Method**

* 必须，用来列出浏览器的CORS请求会用到哪些HTTP方法，上例是`PUT`

**（2）Access-Control-Request-Headers**

* 是一个逗号分隔的字符串，指定浏览器CORS请求会额外发送的头信息字段，上例是`X-Custom-Header`

下面是一段浏览器的JavaScript脚本。

> ```javascript
> var url = 'http://api.alice.com/cors';
> var xhr = new XMLHttpRequest();
> xhr.open('PUT', url, true);
> xhr.setRequestHeader('X-Custom-Header', 'value');
> xhr.send();
> ```

这个"预检"请求的HTTP头信息。

> ```http
> OPTIONS /cors HTTP/1.1
> Origin: http://api.bob.com
> Access-Control-Request-Method: PUT
> Access-Control-Request-Headers: X-Custom-Header
> Host: api.alice.com
> Accept-Language: en-US
> Connection: keep-alive
> User-Agent: Mozilla/5.0...
> ```

#### 4.2、预检请求的回应 ####

* 服务器收到"预检"请求以后，检查了`Origin`、`Access-Control-Request-Method`和`Access-Control-Request-Headers`字段以后，确认允许跨源请求，就可以做出回应

* HTTP回应中，关键的是`Access-Control-Allow-Origin`字段，表示`http://api.bob.com`可以请求数据。该字段也可以设为星号，表示同意任意跨源请求。

  > ```http
  > Access-Control-Allow-Origin: *
  > ```

> ```http
> HTTP/1.1 200 OK
> Date: Mon, 01 Dec 2008 01:15:39 GMT
> Server: Apache/2.0.61 (Unix)
> Access-Control-Allow-Origin: http://api.bob.com
> Access-Control-Allow-Methods: GET, POST, PUT
> Access-Control-Allow-Headers: X-Custom-Header
> Content-Type: text/html; charset=utf-8
> Content-Encoding: gzip
> Content-Length: 0
> Keep-Alive: timeout=2, max=100
> Connection: Keep-Alive
> Content-Type: text/plain
> ```

1. HTTP回应中，关键的是`Access-Control-Allow-Origin`字段，表示`http://api.bob.com`可以请求数据。该字段也可以设为星号，表示同意任意跨源请求。

> ```http
> Access-Control-Allow-Origin: *
> ```

2. 如果服务器否定了"预检"请求，会返回一个正常的HTTP回应，但没有任何CORS相关的头信息字段

   这时，浏览器就会认定，服务器不同意预检请求，因此触发一个错误，被`XMLHttpRequest`对象的`onerror`回调函数捕获

   ```http
   XMLHttpRequest cannot load http://api.alice.com.
   Origin http://api.bob.com is not allowed by Access-Control-Allow-Origin.
   ```

3. 服务器回应的其他CORS相关字段如下。

   > ```http
   > Access-Control-Allow-Methods: GET, POST, PUT
   > Access-Control-Allow-Headers: X-Custom-Header
   > Access-Control-Allow-Credentials: true
   > Access-Control-Max-Age: 1728000
   > ```

   ##### （1）Access-Control-Allow-Methods #####

   * 必须，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法
   * 返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次"预检"请求

   ##### （2）Access-Control-Allow-Headers #####

   * 如果浏览器请求包括`Access-Control-Request-Headers`字段，则`Access-Control-Allow-Headers`字段是必需的
   * 也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在"预检"中请求的字段

   ##### （3）Access-Control-Allow-Credentials #####

   * 该字段与简单请求时的含义相同

   ##### （4）Access-Control-Max-Age #####

   * 可选，用来指定本次预检请求的有效期，单位为秒。上面结果中，有效期是20天（1728000秒），即允许缓存该条回应1728000秒（即20天）
   * 在此期间，不用发出另一条预检请求

#### 4.3 、浏览器的正常请求和回应 ####

* 一旦服务器通过了"预检"请求，以后每次浏览器正常的CORS请求，就都跟简单请求一样，会自动有一个`Origin`头信息字段。

* 服务器的回应，也都会有一个`Access-Control-Allow-Origin`头信息字段。

下面是"预检"请求之后，浏览器的正常CORS请求。

> ```http
> PUT /cors HTTP/1.1
> Origin: http://api.bob.com
> Host: api.alice.com
> X-Custom-Header: value
> Accept-Language: en-US
> Connection: keep-alive
> User-Agent: Mozilla/5.0...
> ```

下面是服务器正常的回应

> ```http
> Access-Control-Allow-Origin: http://api.bob.com
> Content-Type: text/html; charset=utf-8
> ```

#### 4.4、配置流程： ####

* 我们用`PUT`向后台请求时，属于复杂请求，由`http://localhost:3000/index.html`向`http://localhost:4000/`跨域请求，正如上面所说的，后端是实现 CORS 通信的关键

* 前端：

  ```js
  // index.html
  let xhr = new XMLHttpRequest()
  document.cookie = 'name=xiamen' // cookie不能跨域
  xhr.withCredentials = true // 前端设置是否带cookie
  xhr.open('PUT', 'http://localhost:4000/getData', true)
  xhr.setRequestHeader('name', 'xiamen')
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
        console.log(xhr.response)
        //得到响应头，后台需设置Access-Control-Expose-Headers
        console.log(xhr.getResponseHeader('name'))
      }
    }
  }
  xhr.send()
  ```

* 后端配置：

  ```js
  //server1.js
  let express = require('express');
  let app = express();
  app.use(express.static(__dirname));
  app.listen(3000);
  ```

  ```js
  //server2.js
  let express = require('express')
  let app = express()
  let whitList = ['http://localhost:3000'] //设置白名单
  app.use(function(req, res, next) {
    let origin = req.headers.origin;
    if (whitList.includes(origin)) {
      // 设置哪个源可以访问我
      res.setHeader('Access-Control-Allow-Origin', origin)
      // 允许携带哪个头访问我
      res.setHeader('Access-Control-Allow-Headers', 'name')
      // 允许哪个方法访问我
      res.setHeader('Access-Control-Allow-Methods', 'PUT')
      // 允许携带cookie
      res.setHeader('Access-Control-Allow-Credentials', true)
      // 预检的存活时间
      res.setHeader('Access-Control-Max-Age', 6)
      // 允许返回的头
      res.setHeader('Access-Control-Expose-Headers', 'name')
      if (req.method === 'OPTIONS') {
        res.end() // OPTIONS请求不做任何处理
      }
    }
    next()
  })
  app.put('/getData', function(req, res) {
    console.log(req.headers)
    res.setHeader('name', 'jw') //返回一个响应头，后台需设置
    res.end('我不爱你')
  })
  app.get('/getData', function(req, res) {
    console.log(req.headers)
    res.end('我不爱你')
  })
  app.use(express.static(__dirname))
  app.listen(4000)
  ```

#### 5、与JSONP比较 ####

使用目的相同，但是比JSONP更强大：

* JSONP只支持`GET`请求，CORS支持所有类型的HTTP请求
* JSONP的优势在于支持老式浏览器，以及可以向不支持CORS的网站请求数据

#### 6、简单、复杂请求 ####

##### 1、简单请求 #####

不会触发 [CORS 预检请求](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FHTTP%2FAccess_control_CORS%23Preflighted_requests)。这样的请求为“简单请求”：

* 情况一: 使用以下方法(意思就是以下请求以外的都是非简单请求)

  * get、head、post

* 情况二: 人为设置以下集合外的请求头

  * [`Accept`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FHTTP%2FHeaders%2FAccept)、[`Accept-Language`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FHTTP%2FHeaders%2FAccept-Language)、[`Content-Language`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FHTTP%2FHeaders%2FContent-Language)、[`Content-Type`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FHTTP%2FHeaders%2FContent-Type) （需要注意额外的限制）
  * `DPR`、`Downlink`、`Save-Data`、`Viewport-Width`、`Width`

* 情况三：`Content-Type`的值仅限于下列三者之一：(例如 application/json 为非简单请求)

  * `text/plain`、`multipart/form-data`、`application/x-www-form-urlencoded`

* 情况四:

  请求中的任意[`XMLHttpRequestUpload`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FXMLHttpRequestUpload) 对象均没有注册任何事件监听器、[`XMLHttpRequestUpload`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FXMLHttpRequestUpload) 对象可以使用 [`XMLHttpRequest.upload`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FXMLHttpRequest%2Fupload) 属性访问

* 情况五:

  请求中没有使用 [`ReadableStream`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FReadableStream) 对象

##### 2、复杂请求 #####

除了简单请求
