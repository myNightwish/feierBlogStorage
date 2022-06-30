---
title: cookie、session、Token
categories: 3.2-浏览器
description: cookie与session的故事
cover: https://mynightwish.oss-cn-beijing.aliyuncs.com/Project/cookie&session.png
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: cookie&&session
date: 2021-12-21 23:11:27
---


### 1、为什么会诞生cookie与session？ ###

二者诞生的契机：http是一个无状态协议

* 什么是无状态呢？

  这一次请求和上一次请求是没有任何关联的，这种无状态的的好处是快速。但坏处就是：无法把`www.zhihu.com/login.html`和`www.zhihu.com/index.html`关联起来

* session和cookie出现解决了什么？
  * 由于http的无状态性，服务端并不知道是张三还是李四在和自己打交道。这个时候就需要有一个机制来告诉服务端，本次操作用户是否登录，是哪个用户在执行的操作，那这套机制的实现就需要 Cookie 和 Session 的配合
  * SessionID 是连接 Cookie 和 Session 的一道桥梁，大部分系统也是根据此原理来验证用户登录状态。

### 2、cookie和session如何配合 ###

#### 1、用户首次登录时： ####

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/2/1730fcc51a6e8670~tplv-t2oaga2asx-watermark.awebp)

1. 用户访问 `a.com/pageA`，并输入密码登录

2. 服务器验证密码无误后，会创建 SessionId，并将它保存起来

   服务器端的 SessionId 可能存放在很多地方，例如：内存、文件、数据库等

3. 服务器端发送一个http响应到客户端，这个响应头中就包含Set-Cookie头部，该头部包含了sessionId，Set-Cookie格式如下：
   `Set-Cookie: value[; expires=date][; domain=domain][; path=path][; secure]`

4. 浏览器接收到服务器返回的 SessionID 信息后，会将此信息存入到 Cookie 中：

   * 浏览器安装目录下会**专门有一个 cookie 文件夹**存放各个域下设置的cookie
   * 当网页要发请求时，浏览器**自动检查**是否有相应的cookie，有则自动添加在request header中的cookie字段中

#### 2、第2次访问 ####

**后续的访问：**就可以直接使用 Cookie 身份验证了：

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/2/1730fcc51a81b9f8~tplv-t2oaga2asx-watermark.awebp)

1. 用户访问 `a.com/pageB` 页面时，请求会自动判断此域名下是否存在 Cookie 信息，如果存在自动在请求头中添加cookie
2. 服务端会从 Cookie 中获取 SessionID，再根据 SessionID 找对应的 Session 信息，如果没找到，说明用户没有登录或登录失效
3. 如果找到 Session 证明用户已经登录，可执行后面操作

#### 问题1：可以只用cookie，不用session吗？ ####

此时账户信息全存在客户端：安全、存储空间

* 账户信息全部保存在客户端，一旦被劫持，全部信息都会泄露
* 客户端数据量变大，网络传输的数据量也会变大。而用session只需要在客户端保存一个id，实际上大量数据都是保存在服务端。

#### 问题2：cookie被禁用怎么办 ####

既然服务端根据 Cookie 中的信息判断用户是否登录，那如果浏览器中禁止 Cookie，如何保障整个机制的正常运转？

##### 1、方案1：请求参数 #####

* 每次请求中都携带一个 SessionID 参数，也可以 Post 的方式提交，也可以在请求的地址后面拼接 `xxx?SessionID=123456...`

##### 2、方案2：Token 机制 #####

* 在使用 web 存储前,应检查浏览器是否支持 localStorage 和sessionStorage:

  ```js
  typeof(Storage)!=="undefined"
  ```

* 常用API：

  * 保存数据：localStorage.setItem(key,value); localStorage.keyname= "菜鸟教程";
  * 读取数据：localStorage.getItem(key);
  * 删除单个、所有数据：localStorage.removeItem(key)、localStorage.clear();
  * 得到某个索引的key：localStorage.key(index);

### 3、cookie相关API ###

* 存储形式：由**键值对** key=value构成，**键值对之间由一个分号和一个空格隔开**
* 前端原生API获取cookie的方法：**document.cookie**，但只能获取 HttpOnly 类型的cookie

#### 1、cookie常见属性： ####

设置这些属性时，属性之间由一个分号和一个空格隔开：

```js
"key=name; expires=Thu, 25 Feb 2016 04:18:00 GMT; domain=ppsc.sankuai.com; path=/; secure; HttpOnly"
```

##### expires： #####

* GMT 格式时间，如不设置，默认有效期为session，即会话cookie。浏览器关闭就没
* http/1.0 ---> expires(失效时刻) ,  http/1.1 ---->由 max-age 选项代替(cookie失效时刻= 创建时刻+ max-age)
  * max-age 的默认值是 -1(即有效期为 session )
  * 有三种可能值：负数（有效期session）、0（删除）、正数（创建时刻+ max-age）

##### domain 和 path： #####

* 域名+路径，两者构成了 URL，共同限制 cookie 能被哪些 URL 访问，所以决定了cookie何时被浏览器自动添加到请求头部中发送出去
* 若没有显式设置，则浏览器会自动取 url 的 host 作为 domain 值
* path默认值为设置该cookie的网页所在的目录

【注意1】：**跨域xhr请求时**，即使请求URL的域名和路径都满足 cookie 的 domain 和 path，默认情况下**cookie也不会自动被添加到请求头**：为什么？

* 在`CORS`标准中规定，默认情况下，浏览器发跨域请求时，不能发任何认证信息（`credentials`）如"`cookies`"和"`HTTP authentication schemes`"，除非`xhr.withCredentials`为`true`（`xhr`对象一个属性，默认值为`false`）

* `cookies`也是一种认证信息，在跨域请求中，`client`端必须**手动设置**`xhr.withCredentials=true`，且`server`端也**必须允许**`request`能携带认证信息（即`response header`中包含`Access-Control-Allow-Credentials:true`），这样浏览器才会自动将`cookie`加在`request header`中

  【特别注意】：

  * 一旦跨域`request`能携带认证信息，`server`端一定不能将`Access-Control-Allow-Origin`设为`*`，而必须设为请求页面的域名

【注意2】：domain是可以设置为页面本身的域名（本域），或页面本身域名的父域，但不能是公共后缀 public suffix

* 如果页面域名为 www.baidu.com, domain可以设置为“www.baidu.com”，或“baidu.com”，但不能设置为“.com”或“com”

* 显式设置 domain 时，如果 value 最前面带点，则浏览器处理时会将这个点去掉，所以最后浏览器存的就是没有点的

* 前面带点‘.’和不带点‘.’有啥区别：

  带点：任何 subdomain 都可以访问，包括父 domain

  不带点：只有完全一样的域名才能访问，subdomain 不能（但在 IE 下比较特殊，它支持 subdomain 访问）

##### secure #####

当请求是HTTPS或其他安全协议时，包含 secure 选项的 cookie才能被发至服务器，**默认cookie不带secure选项**

* 设置一个 secure类型的 cookie：可在控制台看见

  ```
  document.cookie = "name=huang; secure";
  ```

【注意】：在网页中通过 js 设置secure类型的 cookie，必须保证网页是https协议的。在http协议的网页中是无法设置secure类型cookie的

##### httpOnly #####

* 用来**设置cookie能否通过 js 访**问，这个选项**只能由服务端设置，客户端不可**，且凡是httpOnly类型的cookie，其 HTTP 一列都会打上√

  通过document.cookie是**不能获取的，也不能修改**

* 默认cookie不带httpOnly选项，此时客户端是可通过js代码去访问（包括读取、修改、删除等）cookie

* 当cookie带httpOnly选项时，客户端无法通过js代码访问

【httpOnly与安全】：**为什么要限制客户端去访问cookie？**安全

如果任何 cookie 都能被客户端通过document.cookie获取会发生什么可怕的事情

1. 当网页遭受 XSS 攻击，一段恶意script脚本插到网页中，脚本通过document.cookie读取用户身份验证相关的 cookie，并将这些 cookie 发到了攻击者的服务器
2. **攻击者轻而易举就拿到了用户身份验证信息**，充此用户访问你的服务器了（因为攻击者有合法的用户身份验证信息，所以会通过你服务器的验证

#### 2、操作cookie ####

##### 操作方： #####

* 客户端设置：

  ```
  document.cookie = "name=Jonh; ";
  document.cookie="age=12; expires=Thu, 26 Feb 2116 11:50:25 GMT; domain=sankuai.com; path=/";
  ```

  * 没有设置的选项会采用默认值
  * 无法设置HttpOnly选项
  * secure：有条件，必须安全才能设置
  * 多个cookie设置，不能一下子：document.cookie = "name=Jonh; age=12; class=111";

* 服务端设置：

  * 请求资源文件、ajax请求时，服务端返回的response header中的**set-cookie**，是服务端专门用来设置cookie的

  * set-cookie字段的值就是普通的字符串，一个set-Cookie字段只能设置一个cookie，当你要想设置多个 cookie，需要添加同样多的set-Cookie字段

  * 服务端可设置cookie 所有选项：expires、domain、path、secure、HttpOnly

    <img src="https://img-blog.csdn.net/20180306222521824" alt="img" style="zoom:33%;" />

    

##### 修改、删除cookie： #####

* 修改cookie：

  重新赋值，覆盖旧的。【注意】：在设置新cookie时，path/domain这几个选项一定要旧cookie 保持一样。否则不会修改旧值，而是添加了一个新的 cookie

* 删除cookie：（下面封装思路有）

  重新赋值，新cookie的expires 设为一个过去的时间点。

  【注意】：path/domain/这几个选项一定要旧cookie 保持一样

  ```js
  var date=new Date();
  var cookieExpire=date.getTime()-1000; // 设置为一个过去的时间
  // 删除 cookie 时，名称、路径和域名必须相同
  document.cookie=" username=JavaScript  ; expire= " + cookieExpire + " ;path=/;domain=www.bababa.org ";
  ```

##### cookie 编码： #####

* cookie是个字符串，但其中**逗号、分号、空格**被当做了特殊符号

* 所以当cookie的 key 和 value 中含有这3个特殊字符时，要对其额外编码；

* 一般用escape编码，读取时用unescape解码

  ```js
  var key = escape("name;value");
  var value = escape("this is a value contain , and ;");
  document.cookie= key + "=" + value + "; expires=Thu, 26 Feb 2116 11:50:25 GMT; domain=sankuai.com; path=/";
  ```

#### 3、封装一个cookie ####

* 设置、删除、获取指定名称的cookie、打印所有cookie

  ```js
  const Cookie = {
  // 设置cookie
    setCookie: (name, value) => {
         const Days = 30;
         const exp = new Date();
         exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
         document.cookie =
           name + '=' + escape(value) + ';expires=' + exp.toUTCString();
    },
    // 删除cookie
    delCookie: (name) => {
       const Days = -1;
       const exp = new Date();
       const value = Cookie.getCookie(name);
       exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
       document.cookie =
         name + '=' + escape(value) + ';expires=' + exp.toUTCString();
    },
    // 打印所有cookie
    function print() {
        var strcookie = document.cookie;//获取cookie字符串
        var arrcookie = strcookie.split(";");//分割
  
        //遍历匹配
        for ( var i = 0; i < arrcookie.length; i++) {
            var arr = arrcookie[i].split("=");
            console.log(arr[0] +"：" + arr[1]);
        }
    }
  // 获取指定名称的cookie
    getCookie: (name) => {
      // 正则匹配
       const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
       const arr = document.cookie.match(reg);
       if (arr != null) return unescape(arr[2]);
       else return null;
    }
    
    // 循环，不借助正则
    function getCookie(name){
        var strcookie = document.cookie;//获取cookie字符串
        var arrcookie = strcookie.split("; ");//分割
        //遍历匹配
        for ( var i = 0; i < arrcookie.length; i++) {
            var arr = arrcookie[i].split("=");
            if (arr[0] == name){
                return arr[1];
            }
        }
        return "";
    }
  };
  export default Cookie;
  ```

### 4、cookie与session特点对比 ###

#### 1、存储大小和位置 ####

* cookie：
  * 服务端生成，**客户端维护和存储**，以键值对的形式。
  * 每个域名下Cookie的数量不能超过20个，单个 Cookie 保存的数据不能超过 4K；
* Session：
  * 客户端请求服务端，服务端会为这次请求生成一个 **Session 对象**，代表着服务器和客户端一次会话的过程
  * session对象：结构为 `ConcurrentHashMap`，存储特定用户会话所需属信息
  * session基于cookie实现的，要先攻破cookie获取sessionID

#### 2、生存期 ####

* Cookie分类： Session Cookies、持久性 Cookie
  * 如 Cookie 不包含到期日期，则视为会话 Cookie。存在内存中不会写入磁盘，当浏览器关闭时， Cookie 将永久丢失
  * 如 Cookie 包含`有效期` ，则视为持久性 Cookie。在到期时，Cookie 将从磁盘中删除
* Session：
  * 存储在 Session 对象中的变量，在整个用户会话中一直存在下去
  * 当客户端关闭会话，或者 Session 超时失效时会话结束

#### 3、隐私策略 ####

* Cookie：

  * 存在客户端，容易被窃取

  * 同源窗口共享：同一域名发送http请求，会携带相同cookie，服务器拿到cookie解析得到客户端状态。不支持跨域名

* Session 存储在服务端，安全性相对 Cookie 要好一些。并且session基于cookie实现的

  * 要先攻破cookie获取session ID，session ID是加密的
  * 如果禁用cookie就要通过重写url的方式：把sessionID放到url中

#### 4、缺点 ####

* cookie：

  * 性能缺陷：cookie紧跟域名，域名相同的请求，不管是否需要都携带，浪费性能

  * 安全问题：HTTP明文传递，第三方攻击拦截；或者获取本地文件就能获取cookie数据

    易遭受XSS攻击，所以有**cookie安全策略**；

    易遭受XSRF攻击，所以有**Set-Cookie：SameSite**   

* session：比如 A 服务器存储了 Session，做了负载均衡后，假如一段时间内 A 的访问量激增，会转发到 B 访问，但B 服务器并没有存 A 的 Session，会导致 Session 失效

### 5、cookie和session的缺陷 ###

存在一些问题：存储空间、分布式问题、安全

1. 存储空间：由于服务器端需要对接大量的客户端，也就需要存放大量的 SessionId，这样会导致服务器存储压力过大。
2. 分布式问题：如果服务器端是一个集群，为了同步登录态，需要将 SessionId 同步到每一台机器上，增加服务器端维护成本。
3. 安全：由于 SessionId 存放在 Cookie 中，所以无法避免 CSRF 攻击：
   * 攻击者诱导用户进入一个第三方网站，然后该网站向**被攻击网站**发送跨站请求。
   * 如果用户在**被攻击网站中保存了登录状态**，那么攻击者就可以利用这个登录状态，绕过后台的用户验证，冒充用户向服务器执行一些操作。
   * CSRF 攻击的**本质是利用 cookie 会在同源请求中携带发送给服务器的特点，以此来实现用户的冒充。**

### 6、Token机制 ###

* 诞生的原因：为了解决 Session + Cookie 机制问题：
  * 安全：存登录凭证相关信息，不必放在cookie中；
  * 存储空间：不再存储，而是验证即可
* Token 是服务端生成的一串字符串，以作为客户端请求的一个令牌

  * 当第一次登录后，服务器会生成一个 Token 并返回给客户端；

  * 客户端后续访问时，只需带上这个 Token 即可完成身份认证。

#### 1、Token 机制实现流程 ####

用户**首次登录**时：

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/2/1730fcc51ab8a1db~tplv-t2oaga2asx-watermark.awebp)

1. 用户输入账号密码，并点击登录。
2. 服务器端验证账号密码无误，创建 Token。
3. 服务器端将 Token 返回给客户端，由**客户端自由保存**。

**后续页面访问时：**

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/2/1730fcc519ee3add~tplv-t2oaga2asx-watermark.awebp)

1. 用户访问 `a.com/pageB` 时，带上第一次登录时获取的 Token。
2. 服务器端验证 Token ，有效则身份验证成功。

#### 2、Token 机制的特点 ####

根据上面的案例，分析出 Token 的优缺点：

* 服务器端**无需维护Token存储空间**，只需要首次生成Token，**后续验证即可：**
  * 所以不会对服务器端造成压力，即使是服务器集群，也不需要增加维护成本
* Token 可存放在前端任何地方，可以不用存在 Cookie 中，提升页面安全性
* Token 下发之后，只要在生效时间之内，就一直有效，如果服务器端**想收回此 Token 的权限，并不容易**

#### 3、Token 的生成步骤 ####

* 最常见： JWT（Json Web Token），通信双方之间以 JSON 对象的形式安全的传递信息

* #### JWT构成：主要分为 3 个部分：header（头信息），playload（消息体），signature（签名） ####

  <img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20210206202812405.png" alt="image-20210206202812405" style="zoom: 33%;" />

  1. header 部分指定了该 JWT 使用的签名算法:

     ```js
     header = '{"alg":"HS256","typ":"JWT"}'   
      // `HS256` 表示使用了 HMAC-SHA256 来生成签名：同一个密钥加密解密
      // JWT，固定值，通常都写成JWT即可
     ```

  2. playload 部分：携带的数据：

     ```js
     payload = '{"loggedInAs":"admin","iat":1422779638}'     
     //iat 表示令牌生成的时间
     // exp（expiration time）：过期时间
     ```

  3. signature 部分为 JWT 的签名：

     主要为了让 JWT 不能被随意篡改，签名的方法分为两个步骤：

     1. 输入 `base64url` 编码的 header 部分、 `.` 、`base64url` 编码的 playload 部分，输出 unsignedToken。
     2. 输入服务器端私钥、unsignedToken，输出 signature 签名

     ```js
     const base64Header = encodeBase64(header)
     const base64Payload = encodeBase64(payload)
     const unsignedToken = `${base64Header}.${base64Payload}`
     const key = '服务器私钥'
     
     signature = HMAC(key, unsignedToken)
     ```

  4. 最后的 Token 计算：

     ```js
     const base64Signature = encodeBase64(signature)
     token = `${base64Header}.${base64Payload}.${base64Signature}`
     ```

#### 4、服务器解密Token ####

```js
const [base64Header, base64Payload, base64Signature] = token.split('.')

const signature1 = decodeBase64(base64Signature);
const unsignedToken = `${base64Header}.${base64Payload}`;
const signature2 = HMAC('服务器私钥', unsignedToken);

if(signature1 === signature2) return '签名验证成功，token 没有被篡改';

const payload =  decodeBase64(base64Payload)
if(new Date() - payload.iat < 'token 有效期') return 'token 有效';
```

### 7、分布式session问题 ###

前面说到了session+cookie的3点缺陷，其实token只解决了两点。而对于分布式问题：

* 互联网公司为了可以支撑更大的流量，后端往往需要多台服务器共同来撑前端用户请求
* 那如果用户在 A 服务器登录了，第二次请求跑到服务 B 就会登录失效问题

#### 解决方案： ####

* Nginx ip_hash 策略，服务端使用 Nginx 代理，每个请求按访问 IP 的 hash 分配，这样来自同一 IP 固定访问一个后台服务器，避免了在服务器 A 创建 Session，第二次分发到服务器 B 的现象。
* Session 复制，任何一个服务器上的 Session 发生改变（增删改），该节点会把这个 Session 的所有内容序列化，然后广播给所有其它节点。
* 共享 Session，服务端无状态话，将用户的 Session 等信息使用缓存中间件来统一管理，保障分发到每一个服务器的响应结果都一致   推荐这一种

### 8、localStorage & sessionStorage ###

#### 1、诞生的契机 ####

* cookie：

  设置“**每次请求都要携带的信息（最典型的就是身份认证信息**）”就特别适合放在cookie中，免去了重复添加操作，其他类型的数据就不适合了

* 在 localStorage 出现之前，cookie被滥用当做了存储工具。什么数据都放在cookie中，即使这些数据只在页面中使用而不需要随请求传送到服务

#### 2、localStorage

* **持久化存储：**长期存数据，浏览器关闭后数据不丢失，存的数据没有过期时间，直到手动去除；
* **同源: **   同源窗口中都是共享的

#### 3、sessionStorage ####

* **持久化存储：**临时存储数据，在关闭窗口或标签页之后会删除
* **同源问题: **   更严苛：不仅要求同源，还要求同一个浏览器窗口中打开

<img src="https://www.runoob.com/wp-content/uploads/2019/04/3793073884-56950753e65db_articlex.png" alt="img" style="zoom: 33%;" />

#### 4、存储超容量问题 ####

**localstorage超容量会怎样？**                    美团

问题根源：

* 同一个域名共享同一个 localStorage，而同一个域名下存在过多独立的业务线，业务线之间各自为政，毫无节制的攫取公共资源

问题本质：

* localStorage 归根结底就两个作用：**持久化存储与跨页面传数据**。问题就出在跨页面传数据上，上一个页面因为 localStorage 存满导致数据没有写入，下一个页面读取数据为空，从而导致错误。

* 浏览器反应：

  * 不存储数据, 也不会覆盖现有数据。
  * 引发 QUOTA_EXCEEDED_ERR 异常。

* 该怎么办？

  1、划分域名：各域名下的存储空间由各业务组统一规划使用

  2、跨页面传数据：考虑单页应用、优先采用 url 传数据。

  * 每一个域名下的localStorage容量是5M，假如a.com域名下localstorage存不下了
  * 可以用iframe创建b.com域框架(子页面)用于存 a.com剩下的数据。然后用postMessage读写数据

  3、indexDB

  4、最后的兜底方案：清掉别人的存储