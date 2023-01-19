---
title: 关于Ajax
categories:
- [1.3-Ajax, PlayStation]
- [1.3-Ajax, Games]
- [2.1-组件库]
tags:
  - ajax
  - 网络请求
  - 跨域
description: Ajax的诞生为前端带来了什么
cover: >-
  https://images.unsplash.com/photo-1606210109305-8f56c21327d4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: 1078088869
date: 2021-12-11 20:42:15
---

## 一、Ajax是什么 ##

### 1. ajax之前 ###

* 服务端与客户端的交互方式：

<!-- <img src="http://www.conardli.top/img/wl/wlqq_1.png" alt="image" style="zoom: 67%;" /> -->

* 缺点：

  任何和服务器的交互都需要刷新页面，用户体验非常差，`Ajax`的出现解决了这个问题

### 2. Ajax是什么 ###

[你真的会使用XMLHttpRequest吗？ - SegmentFault 思否](https://segmentfault.com/a/1190000004322487#articleHeader13)

* `Async JavaScript And XML`，`ajax`是一种技术方案，但并不是一种**新技术**。它依赖的是现有的`CSS`/`HTML`/`Javascript`

  * 而其中最核心的依赖是浏览器提供的`XMLHttpRequest`对象，是这个对象使得浏览器可以发出`HTTP`请求与接收`HTTP`响应

  * 总结两者的关系：我们使用`XMLHttpRequest`对象来发送一个`Ajax`请求
  * XML：可拓展标记语言，被设计用来传输、存储数据，历史后端中返回的形式，现在被JSON取代了

* **最大优势特点：**
  * 页面**不刷新**的情况下与服务器通信
  * 允许根据用户事件来更新部分页面内容
* **缺点：**

  1. 没有浏览历史，不能回退
  2. 存在跨域问题（同源策略限制）
  3. SEO不友好

### 3、`XMLHttpRequest`发展历程 ###

一开始只是微软浏览器提供的一个接口，后来W3C对它进行了标准化，再后来提出了[`XMLHttpRequest`标准](https://link.segmentfault.com/?url=https%3A%2F%2Fwww.w3.org%2FTR%2FXMLHttpRequest%2F)。`XMLHttpRequest`标准又分为`Level 1`和`Level 2`

#### 1、Level 1主要缺点： ####

* 受同源策略的限制，不能发送跨域请求；
* 不能发送二进制文件（如图片、视频、音频等），只能发送纯文本数据；
* 在发送和获取数据的过程中，无法实时获取进度信息，只能判断是否完成；

#### 2、Level 2中新增： ####

* 可以发送跨域请求，在服务端允许的情况下；
* 支持发送和接收二进制数据；
* 新增formData对象，支持发送表单数据；
* 发送和获取数据时，可以获取进度信息；
* 可以设置请求的超时时间；

#### 3、`XMLHttpRequest`兼容性 ####

Can I use”这个网站提供的结果[XMLHttpRequest兼容性](https://link.segmentfault.com/?url=http%3A%2F%2Fcaniuse.com%2F%23search%3DXMLHttpRequest)

![clipboard.png](https://segmentfault.com/img/bVsiDk)

从图中可以看到：

* IE8/IE9、Opera Mini 完全不支持`xhr`对象
* IE10/IE11部分支持，不支持 `xhr.responseType`为`json`
* 部分浏览器不支持设置请求超时，即无法使用`xhr.timeout`
* 部分浏览器不支持`xhr.responseType`为`blob`

## 二、`XMLHttpRequest`如何使用 ##

使用`XMLHttpRequest`发送`Ajax`请求

```javascript
function sendAjax() {
  //构造表单数据
  var formData = new FormData();
  formData.append('username', 'johndoe');
  formData.append('id', 123456);
  //创建xhr对象 
  var xhr = new XMLHttpRequest();
  //设置xhr请求的超时时间
  xhr.timeout = 3000;
  //设置响应返回的数据格式
  xhr.responseType = "text";
  //创建一个 post 请求，采用异步
  xhr.open('POST', '/server', true);
  //注册相关事件回调处理函数
  xhr.onload = function(e) { 
    if(this.status == 200||this.status == 304){
        alert(this.responseText);
    }
  };
  xhr.ontimeout = function(e) { ... };
  xhr.onerror = function(e) { ... };
  xhr.upload.onprogress = function(e) { ... };
  
  //发送数据
  xhr.send(formData);
}
```

### 1、如何设置request header ###

在发送`Ajax`请求（实质是一个[HTTP](https://link.segmentfault.com/?url=http%3A%2F%2Fwww.tutorialspoint.com%2Fhttp%2Fhttp_header_fields.htm)请求）时，我们可能需要设置一些请求头部信息，比如`content-type`、`connection`、`cookie`、`accept-xxx`等。`xhr`提供了`setRequestHeader`来允许我们修改请求 header。

> ```
> void setRequestHeader(DOMString header, DOMString value);
> ```

**注意点**：

* 方法的第一个参数 header 大小写不敏感，即可以写成`content-type`，也可以写成`Content-Type`，甚至写成`content-Type`;
* `Content-Type`的默认值与具体发送的数据类型有关
* **`setRequestHeader`必须在`open()`方法之后，`send()`方法之前调用，否则会抛错；**
* `setRequestHeader`可以调用多次，最终的值不会采用覆盖`override`的方式，而是采用追加`append`的方式。下面是一个示例代码：

```javascript
var client = new XMLHttpRequest();
client.open('GET', 'demo.cgi');
client.setRequestHeader('X-Test', 'one');
client.setRequestHeader('X-Test', 'two');
// 最终request header中"X-Test"为: one, two
client.send();
```

### 2、如何获取response header ###

`xhr`提供了2个用来获取响应头部的方法：

1. `getAllResponseHeaders`：获取 response 中的所有header 字段

2. `getResponseHeader`：只是获取某个指定 header 字段的值，`header`参数不区分大小写

> ```
> DOMString getAllResponseHeaders();
> DOMString getResponseHeader(DOMString header);
> ```

#### 【注意大坑】： ####

1. 使用`getAllResponseHeaders()`看到的所有`response header`与实际在控制台 `Network` 中看到的 `response header` 不一样

   这个方法只能拿到**限制以外**（即被视为`safe`）的header字段，而不是全部字段

2. 使用`getResponseHeader()`获取某个 `header` 的值时，浏览器抛错`Refused to get unsafe header "XXX"`

   `header`参数必须是***限制以外\***的header字段，否则调用就会报`Refused to get unsafe header`的错误

经过一番寻找最终在 [Stack Overflow找到了答案](https://link.segmentfault.com/?url=http%3A%2F%2Fstackoverflow.com%2Fquestions%2F7462968%2Frestrictions-of-xmlhttprequests-getresponseheader)。

* 原因1：[W3C的 xhr 标准中做了限制](https://link.segmentfault.com/?url=https%3A%2F%2Fwww.w3.org%2FTR%2FXMLHttpRequest%2F)，规定客户端无法获取 response 中的 `Set-Cookie`、`Set-Cookie2`这2个字段，无论是同域还是跨域请求；
* 原因2：[W3C 的 cors 标准对于跨域请求也做了限制](https://link.segmentfault.com/?url=https%3A%2F%2Fwww.w3.org%2FTR%2Fcors%2F%23access-control-allow-credentials-response-header)，规定对于跨域请求，客户端允许获取的response header字段只限于“`simple response header`”和“`Access-Control-Expose-Headers`” 
  * "`simple response header`"包括的 header 字段有：`Cache-Control`,`Content-Language`,`Content-Type`,`Expires`,`Last-Modified`,`Pragma`;
  * "`Access-Control-Expose-Headers`"：首先得注意是"`Access-Control-Expose-Headers`"进行**跨域请求**时响应头部中的一个字段，对于同域请求，响应头部是没有这个字段的。这个字段中列举的 header 字段就是服务器允许暴露给客户端访问的字段

### 3、如何指定`xhr.response`的数据类型 ###

有些时候我们希望`xhr.response`返回的就是我们想要的数据类型。比如：响应返回的数据是纯JSON字符串，但我们期望最终通过`xhr.response`拿到的直接就是一个 js 对象，我们该怎么实现呢？

* 一个是`level 1`就提供的`overrideMimeType()`方法
* 另一个是`level 2`才提供的`xhr.responseType`属性

#### 1、`xhr.overrideMimeType()` ####

作用就是用来重写`response`的`content-type`

意义：

1. 比如：server 端给客户端返回了一份`document`或者是 `xml`文档，我们希望最终通过`xhr.response`拿到的就是一个`DOM`对象，那么就可以用`xhr.overrideMimeType('text/xml; charset = utf-8')`来实现
2. 们都知道`xhr level 1`不支持直接传输blob二进制数据，那如果真要传输 blob 该怎么办呢？当时就是利用`overrideMimeType`方法来解决这个问题的

下面是一个获取图片文件的代码示例：

* 通过将 `response` 的 `content-type` 改为'text/plain; charset=x-user-defined'，使得 `xhr` 以纯文本格式来解析接收到的blob 数据
* 最终用户通过`this.responseText`拿到的就是图片文件对应的二进制字符串，最后再将其转换为 blob 数据

```javascript
var xhr = new XMLHttpRequest();
//向 server 端获取一张图片
xhr.open('GET', '/path/to/image.png', true);

// 这行是关键！
//将响应数据按照纯文本格式来解析，字符集替换为用户自己定义的字符集
xhr.overrideMimeType('text/plain; charset=x-user-defined');

xhr.onreadystatechange = function(e) {
  if (this.readyState == 4 && this.status == 200) {
    //通过 responseText 来获取图片文件对应的二进制字符串
    var binStr = this.responseText;
    //然后自己再想方法将逐个字节还原为二进制数据
    for (var i = 0, len = binStr.length; i < len; ++i) {
      var c = binStr.charCodeAt(i);
      //String.fromCharCode(c & 0xff);
      var byte = c & 0xff; 
    }
  }
};

xhr.send();
```

#### 2、`xhr.responseType` ####

* 它有兼容性问题，那么`responseType`可以设置为哪些格式呢

| 值              | `xhr.response` 数据类型 | 说明                             |
| --------------- | ----------------------- | -------------------------------- |
| `""`            | `String`字符串          | 默认值(在不设置`responseType`时) |
| `"text"`        | `String`字符串          |                                  |
| `"document"`    | `Document`对象          | 希望返回 `XML` 格式数据时使用    |
| `"json"`        | `javascript` 对象       | 存在兼容性问题，IE10/IE11不支持  |
| `"blob"`        | `Blob`对象              |                                  |
| `"arrayBuffer"` | `ArrayBuffer`对象       |                                  |

下面是同样是获取一张图片的代码示例，用`xhr.response`来实现简单得多。

```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', '/path/to/image.png', true);
//可以将`xhr.responseType`设置为`"blob"`也可以设置为`" arrayBuffer"`
//xhr.responseType = 'arrayBuffer';
xhr.responseType = 'blob';

xhr.onload = function(e) {
  if (this.status == 200) {
    var blob = this.response;
    ...
  }
};

xhr.send();
```

* `xhr.responseType`就是用来取代`xhr.overrideMimeType()`的，`xhr.responseType`功能强大的多

### 4、如何获取response数据 ###

`xhr`提供了3个属性来获取请求返回的数据，分别是：`xhr.response`、`xhr.responseText`、`xhr.responseXML`

#### 1、`xhr.response` ####

* 默认值：空字符串`""`
* 当请求完成时，此属性才有正确的值
* 请求未完成时，此属性的值可能是`""`或者 `null`，具体与 `xhr.responseType`有关：当`responseType`为`""`或`"text"`时，值为`""`；`responseType`为其他值时，值为 `null`

#### 2、`xhr.responseText` ####

* 默认值为空字符串`""`
* 只有当 `responseType` 为`"text"`、`""`时，`xhr`对象上才有此属性，此时才能调用`xhr.responseText`，否则抛错
* 只有当请求成功时，才能拿到正确值。请求未完成、请求失败值都为空字符串`""`

#### 3、`xhr.responseXML` ####

* 默认值为 `null`

* 只有当 `responseType` 为`"text"`、`""`、`"document"`时，`xhr`对象上才有此属性，此时才能调用`xhr.responseXML`，否则抛错

* 只有当请求成功且返回数据被正确解析时，才能拿到正确值。以下3种情况下值都为`null`：

  请求未完成、请求失败、请求成功但返回数据无法被正确解析时

### 5、如何追踪`ajax`请求的当前状态 ###

用`xhr.readyState`这个属性即可追踪到，总共有5种可能值，分别对应`xhr`不同的不同阶段，次`xhr.readyState`的值发生变化时，都会触发`xhr.onreadystatechange`事件：

```javascript
  xhr.onreadystatechange = function () {
    switch(xhr.readyState){
      case 1://OPENED
        //do something
            break;
      case 2://HEADERS_RECEIVED
        //do something
        break;
      case 3://LOADING
        //do something
        break;
      case 4://DONE
        //do something
        break;
    }
```

| 值   | 状态                              | 描述                                                         |
| ---- | --------------------------------- | ------------------------------------------------------------ |
| `0`  | `UNSENT` (初始状态，未打开)       | 此时`xhr`对象被成功构造，`open()`方法还未被调用              |
| `1`  | `OPENED` (已打开，未发送)         | `open()`方法已被成功调用，`send()`方法还未被调用。注意：只有`xhr`处于`OPENED`状态，才能调用`xhr.setRequestHeader()`和`xhr.send()`,否则会报错 |
| `2`  | `HEADERS_RECEIVED` (已获取响应头) | `send()`方法已经被调用, 响应头和响应状态已经返回             |
| `3`  | `LOADING` (正在下载响应体)        | 响应体(`response entity body`)正在下载中，此状态下通过`xhr.response`可能已经有了响应数据 |
| `4`  | `DONE` (整个数据传输过程结束)     | 整个数据传输过程结束，不管本次请求是成功还是失败             |

### 6、如何设置请求的超时时间 ###

如果请求过了很久还没有成功，为了不会白白占用的网络资源，一般会主动终止请求

* XMLHttpRequest提供了`timeout`属性来允许设置请求的超时时间
* 从***请求开始\*** 算起，若超过 `timeout` 时间请求还没有结束（包括成功/失败），则会触发ontimeout事件，主动结束该请求

> ```
> xhr.timeout            单位：毫秒     默认值：`0`，即不设置超时
> ```

#### 1、什么时候才算是请求开始 ？ ####

`xhr.onloadstart`事件触发的时候，也就是你调用`xhr.send()`方法的时候：

* `xhr.open()`只是创建了一个连接，但并没有真正开始数据的传输
* 而`xhr.send()`才是真正开始了数据的传输过程。只有调用了`xhr.send()`，才会触发`xhr.onloadstart` 

#### 2、什么时候才算是请求结束？ ####

 `xhr.loadend`事件触发的时候

#### 3、2个坑： ####

1. 可以在 `send()`之后再设置此`xhr.timeout`，但计时起始点仍为调用`xhr.send()`方法的时刻。
2. 当`xhr`为一个`sync`同步请求时，`xhr.timeout`必须置为`0`，否则会抛错。原因可以参考本文的【如何发一个同步请求】

### 7、如何发一个同步请求 ###

由`xhr.open（）`传入的`async`参数决定，默认发异步true

> ```
> open(method, url [, async = true [, username = null [, password = null]]])
> ```

* `method`: 请求的方式，如`GET/POST/HEADER`等，这个参数不区分大小写
* `url`: 请求的地址，可以是相对地址如`example.php`，这个**相对**是相对于当前网页的`url`路径；也可以是绝对地址如`http://www.example.com/example.php`
* `async`: 默认值为`true`，即为异步请求，若`async=false`，则为同步请求

#### 1、同步与异步的区别： ####

当`xhr`为同步请求时，有如下限制：任何一个限制不满足，都会抛错，而对于异步请求，则没有这些参数设置上的限制

* `xhr.timeout`必须为`0`
* `xhr.withCredentials`必须为 `false`
* `xhr.responseType`必须为`""`（注意置为`"text"`也不允许）

#### 2、为什么尽量避免使用`sync`同步请求 ####

1. 因为无法设置请求超时时间（`xhr.timeout`为`0`，即不限时）

   在不限制超时的情况下，有可能同步请求一直处于`pending`状态，服务端迟迟不返回响应，这样整个页面就会一直阻塞，无法响应用户的其他交互

2. 标准中并没有提及同步请求时事件触发的限制，但实际开发中我确实遇到过部分应该触发的事件并没有触发的现象

   如在 chrome中，当`xhr`为同步请求时，在`xhr.readyState`由`2`变成`3`时，并不会触发 `onreadystatechange`事件，`xhr.upload.onprogress`和 `xhr.onprogress`事件也不会触发

### 8、如何获取上传、下载的进度 ###

在上传或者下载比较大的文件时，可以通过`onprogress`事件来实时显示进度

* 默认情况下这个事件每50ms触发一次。需要注意的是，上传过程和下载过程触发的是不同对象的`onprogress`事件：

* 上传触发的是`xhr.upload`对象的 `onprogress`事件
* 下载触发的是`xhr`对象的`onprogress`事件

```javascript
xhr.onprogress = updateProgress;
xhr.upload.onprogress = updateProgress;
function updateProgress(event) {
    if (event.lengthComputable) {
      var completedPercent = event.loaded / event.total;
    }
 }
```

### 9、可以发送什么类型的数据 ###

#### 1、支持的类型 ####

`xhr.send(data)`的参数data可以是类型：`ArrayBuffer`、`Blob`、`Document`、`DOMString`、`FormData`、`null`

* GET/HEAD请求：`send()`方法一般不传参或传 `null`

  即使你真传入了参数，参数也最终被忽略，`xhr.send(data)`中的data会被置为 `null`

#### 2、如何影响请求头部 ####

`xhr.send(data)`中data参数的数据类型会影响请求头部`content-type`的默认值：

* 如果`data`是 `Document` 类型，同时也是`HTML Document`类型，则`content-type`默认值为`text/html;charset=UTF-8`;否则为`application/xml;charset=UTF-8`；
* 如果`data`是 `DOMString` 类型，`content-type`默认值为`text/plain;charset=UTF-8`；
* 如果`data`是 `FormData` 类型，`content-type`默认值为`multipart/form-data; boundary=[xxx]`
* 如果`data`是其他类型，则不会设置`content-type`的默认值

但如果用`xhr.setRequestHeader()`手动设置了中`content-type`的值，以上默认值就会被覆盖

#### 3、注意 ####

若在断网状态下调用`xhr.send(data)`方法，则会抛错：`Uncaught NetworkError: Failed to execute 'send' on 'XMLHttpRequest'`

* 一旦程序抛出错误，如果不 catch 就无法继续执行后面的代码，所以调用 `xhr.send(data)`方法时，应该用 `try-catch`捕捉错误

```javascript
try{
    xhr.send(data)
  }catch(e) {
    //doSomething...
  };
```

### 10、`xhr.withCredentials`与 `CORS` 什么关系 ###

#### 1、跨域不自动加cookie？ ####

* 在发同域请求时，浏览器会将`cookie`自动加在`request header`中
* 但，在发送跨域请求时，`cookie`并没有自动加在`request header`中

#### 2、为什么？ ####

【注意】造成这个问题的原因是：

1. 在`CORS`标准中做了规定，默认情况下，浏览器在发送跨域请求时，不能发送任何认证信息（`credentials`）如"`cookies`"和"`HTTP authentication schemes`"，除非`xhr.withCredentials`为`true`（`xhr`对象有一个属性叫`withCredentials`，默认值为`false`）

2. `cookies`也是一种认证信息，在跨域请求中，`client`端必须手动设置`xhr.withCredentials=true`，且`server`端也必须允许`request`能携带认证信息（即`response header`中包含`Access-Control-Allow-Credentials:true`），这样浏览器才会自动将`cookie`加在`request header`中

【特别注意】：

* 一旦跨域`request`能够携带认证信息，`server`端一定不能将`Access-Control-Allow-Origin`设置为`*`，而必须设置为请求页面的域名

## 三、`xhr`相关事件 ##

### 1、事件分类 ###

`XMLHttpRequestEventTarget`接口定义了7个事件：

* `onloadstart`、`onprogress`、`onabort`、`ontimeout`、`onerror`、`onload`、`onloadend`

#### 2、特点 ####

总结：`xhr`一共有8个相关事件：7个`XMLHttpRequestEventTarget`事件+1个独有的`onreadystatechange`事件；而`xhr.upload`只有7个`XMLHttpRequestEventTarget`事件

1. 每一个`XMLHttpRequest`里面都有一个`upload`属性，而`upload`是一个`XMLHttpRequestUpload`对象
2. `XMLHttpRequest`和`XMLHttpRequestUpload`都继承了同一个`XMLHttpRequestEventTarget`接口，所以`xhr`和`xhr.upload`都有第一条列举的7个事件
3. `onreadystatechange`是`XMLHttpRequest`独有的事件

### 2、事件触发条件 ###

下面是我自己整理的一张`xhr`相关事件触发条件表，其中最需要注意的是 `onerror` 事件的触发条件。

| 事件                 | 触发条件                                                     |
| -------------------- | ------------------------------------------------------------ |
| `onreadystatechange` | 每当`xhr.readyState`改变时触发；但`xhr.readyState`由非`0`值变为`0`时不触发。 |
| `onloadstart`        | 调用`xhr.send()`方法后立即触发，若`xhr.send()`未被调用则不会触发此事件。 |
| `onprogress`         | `xhr.upload.onprogress`在上传阶段(即`xhr.send()`之后，`xhr.readystate=2`之前)触发，每50ms触发一次；`xhr.onprogress`在下载阶段（即`xhr.readystate=3`时）触发，每50ms触发一次。 |
| `onload`             | 当请求成功完成时触发，此时`xhr.readystate=4`                 |
| `onloadend`          | 当请求结束（包括请求成功和请求失败）时触发                   |
| `onabort`            | 当调用`xhr.abort()`后触发                                    |
| `ontimeout`          | `xhr.timeout`不等于0，由请求开始即`onloadstart`开始算起，当到达`xhr.timeout`所设置时间请求还未结束即`onloadend`，则触发此事件。 |
| `onerror`            | 在请求过程中，若发生`Network error`则会触发此事件（若发生`Network error`时，上传还没有结束，则会先触发`xhr.upload.onerror`，再触发`xhr.onerror`；若发生`Network error`时，上传已经结束，则只会触发`xhr.onerror`）。<br />**注意**，只有发生了网络层级别的异常才会触发此事件，对于应用层级别的异常，如响应返回的`xhr.statusCode`是`4xx`时，并不属于`Network error`，所以不会触发`onerror`事件，而是会触发`onload`事件。 |

### 3、事件触发顺序 ###

当请求一切正常时，相关的事件触发顺序如下：

1. 触发`xhr.onreadystatechange`(之后每次`readyState`变化时，都会触发一次)
2. 触发`xhr.onloadstart`
   //上传阶段开始：
3. 触发`xhr.upload.onloadstart`
4. 触发`xhr.upload.onprogress`
5. 触发`xhr.upload.onload`
6. 触发`xhr.upload.onloadend`
   //上传结束，下载阶段开始：
7. 触发`xhr.onprogress`
8. 触发`xhr.onload`
9. 触发`xhr.onloadend`

### 4、发生`abort`/`timeout`/`error`异常处理 ###

在请求的过程中，有可能发生 `abort`/`timeout`/`error`这3种异常。那么一旦发生这些异常，`xhr`后续会进行哪些处理呢？后续处理如下：

1. 一旦发生`abort`或`timeout`或`error`异常，先立即中止当前请求
2. 将 `readystate` 置为`4`，并触发 `xhr.onreadystatechange`事件
3. 如果上传阶段还没有结束，则依次触发以下事件：
   * `xhr.upload.onprogress`
   * `xhr.upload.[onabort或ontimeout或onerror]`
   * `xhr.upload.onloadend`
4. 触发 `xhr.onprogress`事件
5. 触发 `xhr.[onabort或ontimeout或onerror]`事件
6. 触发`xhr.onloadend` 事件

### 5、在哪个`xhr`事件中注册成功回调？ ###

#### 1、onreadystatechange、onload ####

* 若`xhr`请求成功，就会触发`xhr.onreadystatechange`和`xhr.onload`两个事件
* 但倾向于 `xhr.onload`事件，因为`xhr.onreadystatechange`是每次`xhr.readyState`变化时都会触发，而不是`xhr.readyState=4`时才触发

#### 2、坑 ####

这样的判断是有坑儿的，比如当返回的`http`状态码不是`200`，而是`201`时，请求虽然也是成功的，但并没有执行成功回调逻辑

```javascript
xhr.onload = function () {
    //如果请求成功
    if(xhr.status == 200){
      //do successCallback
    }
  }
```

更靠谱的判断方法应该是：当`http`状态码为`2xx`或`304`时才认为成功

```javascript
  xhr.onload = function () {
    //如果请求成功
    if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
      //do successCallback
    }
  }
```

* **使用场景：**

  * 页面上拉加载更多数据，页面没有更新只是把请求来的数据呈现出来
  * 列表数据无刷新分页
  * 表单数据离开焦点验证，比如邮箱注册的时候输完地址会自动显示该地址是否已被注册
  * 搜索框文字自动提示

  ```js
          var xhr = new XMLHttpRequest();
         
          // 跨域携带cookie
          xhr.withCredentials = true;
  
          // 处理请求参数
          postData = {"name1":"value1","name2":"value2"};
          postData = (function(value){
          var dataString = "";
          for(var key in value){
               dataString += key+"="+value[key]+"&";
          };
            return dataString;
          }(postData));
  
          xhr.open('post','www.xxx.com',true);
   				// 设置请求头
          xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
          xhr.send(postData);
  
          xhr.onreadystatechange = function(){
              if(xhr.readyState === 4 ){
                  if(xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
                      console.log(xhr.responseText);
                  }
              }
          }
          // 异常处理
          xhr.onerror = function() {console.log('Network request failed')}
  ```

<!-- <img src="http://www.conardli.top/img/wl/wlqq_2.png" alt="image" style="zoom: 67%;" /> -->

## 四、xhr相关API用法 ##

###  1、xhr方法

#### 1. open方法 ####

* 用于初始化一个请求，为请求做准备

  ```
  xhr.open(method,URL,async)
  // 注意：只能访问同源URL,域名，端口，协议相同
  // 如果请求的URL和发送请求的页面在任何地方有所不同，就会抛出安全错误
  ```

  * `method`：请求方式，如`get、post`
  * `url`：请求的`url`
  * `async`：是否为异步请求，true/false

#### 2. send方法 ####

* 用于发送HTTP请求，即调用该方法后HTTP请求才会被真正发出

  ```
  xhr.send(param)
  ```

* `param`：http请求的参数，作为请求体发送的数据，可以为`string、Blob`等类型。null代表不发

* 这个请求是同步的，所以JS代码会等待服务器相应后，再继续执行。

* 收到服务器响应后，XHR对象的某些属性会被填充数据

  * ResponseText：作为响应返回的文本
  * ResponseXML：如果响应的内容类型是"text\html"，那就是包含响应数据的XML DOM文档
  * status：响应HTTP状态
  * statusText：响应的HTTP状态描述

#### 3. setRequestHeader ####

* 用于设置`HTTP`请求头，默认情况，会发头部字段，还可以发额外的请求

* 必须在`open()`方法和`send()`之间调用

* 可以与通用字段重名（即重写，有的浏览器不支持），或自定义

  ```js
  xhr.setRequestHeader(header, value);
  
  xhr.open('POST','http://www.example.com')
  xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded')
  xhr.send('name=zhangsan&age=12') //请求参数放在send方法中
  ```

  * header：自定义的头部字段的名称
  * value：值

#####  设置请求参数格式：

- **application/x-www-form-urlencoded**

  请求参数就是&连接的**键值对**，如`name=zhangsan&age=12`

  ```
  xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded')
  ```

- **application/json**

  请求参数是**json对象**，如`{name:'zhangsan',age:'12'}`

  ```
  xhr.setRequestHeader('Content-type','appliation/json)'
  ```

  但是要把json对象转换为字符串，用JSON.stringify方法

  ```
  xhr.send(JSON.stringify({name:'zhangsan',age:'12'}))
  ```

  **get是不能传递json对象的请求参数的，表单提交也不支持json数据**

#### 4.1 getResponseHeader ####

* 用于获取`http`返回头，如果在返回头中有多个一样的名称，那么返回的值就会是用逗号和空格将值分隔的字符串

  ```
  var header = xhr.getResponseHeader(name);
  ```

#### 4.2 getAllResponseHeaders ####

* 用于所有响应头部的字符串

#### 5. abort                           ####

* 用于终止一个`ajax`请求，调用此方法后`readyState`将被设置为`0`，用法：

  ```
  xhr.abort()
  ```

### 2、xhr属性 ###

<img src="https://note.youdao.com/yws/public/resource/05ca5e90ee117da30b7751ae1e23528a/xmlnote/331ECC69CEA04C3DA2DFA12B5888B1FB/3581" alt="img" style="zoom:67%;" />

#### 1. readyState ####

* 标识当前`XMLHttpRequest`对象所处状态，`XMLHttpRequest`对象总是位于下列状态之一

  | 值   | 状态               | 描述                                               |
  | ---- | ------------------ | -------------------------------------------------- |
  | 0    | `UNSENT`           | 代理被创建，但尚未调用 `open()` 方法。             |
  | 1    | `OPENED`           | `open()` 方法已经被调用。                          |
  | 2    | `HEADERS_RECEIVED` | `send()`方法已经被调用，并且头部和状态已经可获得。 |
  | 3    | `LOADING`          | 下载中； `responseText` 属性已经包含部分数据。     |
  | 4    | `DONE`             | 下载操作已完成。   **最关心这个**                  |

#### 2. status： ####

* 表示`http`请求的状态, 初始值为`0`。如果服务器没有显式地指定状态码, 那么`status`将被设置为默认值, 即`200`。

#### 3. responseType： ####

* 表示响应的数据类型，并允许我们手动设置，如果为空，默认为`text`类型，可以有下面的取值

* | 值              | 描述                                                         |
  | --------------- | ------------------------------------------------------------ |
  | `""`            | 将 `responseType`设为空字符串与设置为`"text"`相同， 是默认类型 （实际上是 `DOMString`）。 |
  | `"arraybuffer"` | `response` 是一个包含二进制数据的`JavaScript ArrayBuffer` 。 |
  | `"blob"`        | `response`是一个包含二进制数据的 `Blob` 对象 。              |
  | `"document"`    | response 是一个`HTML Document`或`XML XMLDocument`，这取决于接收到的数据的 MIME 类型。 |
  | `"json"`        | `response` 是一个 JavaScript 对象。这个对象是通过将接收到的数据类型视为`JSON`解析得到的。 |
  | `"text"`        | `response`是包含在`DOMString`对象中的文本。                  |

#### 4. response ####

#### 5. withCredentials ####

* `ajax`请求默认会携带同源请求的`cookie`，而跨域请求则不会携带`cookie`，设置`xhr`的`withCredentials`的属性为`true`将允许携带跨域`cookie`

### 3、事件处理 ###

#### 1. onreadystatechange             进度事件 ####

* 当`readyState`属性发生变化时，callback会被触发

  ```js
   xhr.onreadystatechange = callback;
  ```

#### 2. onloadstart                               进度事件 ####

* 在接收到响应的第一个字节时触发，在`ajax`请求发送之前（`readyState==1`后, `readyState==2`前），`callback`会被触发

  ```
   xhr.onloadstart = callback;
  ```

#### 3. onprogress                                进度事件 ####

* 在接收响应期间反复触发，回调函数可以获取资源总大小`total`，已经加载的资源大小`loaded`，用这两个值可以计算加载进度。事件处理程序上携带event对象，其target属性是XHR对象

  ```js
  xhr.onprogress = function(event){
    console.log(event.loaded / event.total);
  }
  ```

#### 4. onload                                      进度事件 ####

* 在成功接收完响应时触发，通常在回调中返回值。

* 最初火狐增加了load事件用来代替readystatechange事件，load在响应接收完成后，立即触发，无论状态码是什么，都会触发，所以还需要检查状态码属性才能确定是否有效。并非所有浏览器支持

  ```js
   xhr.onload = callback;
  ```

####  5. ontimeout：                                 请求超时 ####

* 当进度由于预定时间到期而终止时，会触发`callback`，超时时间可使用`timeout`属性进行设置。

  ```js
   xhr.ontimeout = callback;
  ```

#### 6. onerror                                           进度事件 ####

* 在请求出错时会触发`callback`

#### 7. loadend                                          进度事件 ####

* 在通信完成时，且在 error、abort 或 load 之后触发。 每次请求都会首先触发 loadstart 事件，之后是一个或多个 progress 事件，接着是 error、abort 或 load 中的一个，最后以 loadend 事件结束

### 6. 低版本IE缓存问题

#### 1. 问题： ####

* 在请求地址不发生变化的情况下，ajax只会发送第一次的请求，剩余的多次请求不会再发送给浏览器而是直接加载缓存中的数据
* 即使服务器中数据已经发生改变，客户端拿到的依旧是缓存的就数据

#### 2. 解决办法 ####

* 浏览器的缓存是根据url地址来记录的，所以我们只需要修改url地址既可避免缓存问题：添加**请求参数**，每次请求都不相同，该参数是随机数

  ```js
  xhr.open('GEt','http://www.example.com'+Math.random())
  ```

  ```js
  xhr.open('get', '/testAJAX?t='+Date.now())
  ```

### 7. 重复请求问题  ###

* **标识量：**发请求之前判断请求是否在发送中，如果是，就调用abort停止强求，在收到响应之后，标识位变为false

  ```js
  btn.onclick = function(){
    if(isSending){
      xhr.abort();
    }
    xhr = new XMLHttpRequest();
    isSending = true;
    x.open('GET', 'http://127.0.0.1:8000/delay');
    xhr.send();
    xhr.onreadystateChange = function(){
      if(xhr.readyState === 4){
        isSending = false;
      }
    }
  }
  ```

### 8. 发ajax请求的方式： ###

#### 1. jquery 略 ####

#### 2. Fetch 略 ####

#### 3. axios ####

基于**promise的HTTP库**，本质上也是对**原生XHR的封装**

* 常见方法：

  ```
  axios.get(url, data, params);
  axios.post(url, data, params)
  ```

### 9. AJAX封装 ⭐️⭐️

* 封装函数：

  ```js
  function ajax(options){
    //1.创建XMLHttpRequest对象
  	var xhr = new XMLHttpRequest()
    
    //2.处理请求参数，默认请求参数是对象，要弄成键值对形式
    var params = ''
    for(var attr in options.data){
        params += attr+'='+options.data[attr]+'&'
    }
    params = params.substr(0,params.length-1)
    
    //3.调用open方法，get请求要把请求参数加入url中，post要把请求参数放入send方法中
    if(options.type == 'get'){
      options.url = options.url+'?'+params
    }
    xhr.open(options.type,options.url)
    
    //4.调用send方法，get请求就直接调用，post请求要设置头字段，请求参数要放入send方法中
    if(options.type == 'post'){
      var contentType = options.header['Content-Type']
      xhr.setRequestHeader('Content-Type',contentType)
      if(contentType == 'application/json'){
  			xhr.send(JSON.stringify(options.data))
      }else{
        xhr.send(params)
      }
    }else{
      xhr.send()
    }
    
    //5.接收响应数据
    xhr.onload = function(){
      var contentType = xhr.getResponseHeader('Content-Type')
      var responseText = xhr.responseText
      
      if(contentType.includes('json')){
        responseText = JSON.parse(responseText)
      }
      
      if(xhr.status == 200){
        options.success(responseText)
      }else{
        options.error(responseText)
      }
    }
  }
  ```

* 调用：

  ```js
  ajax({
    type:'get',
    url:'xxxx',
    data:{
    	name:'zs',
      age:18
  	},
    header:{
  		'Content-type',''
    },
    success:function(){},
    error:function(){}
  })
  ```
