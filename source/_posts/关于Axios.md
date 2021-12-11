---
title: Axios的源码的一些妙用
date: 2021-12-11 20:42:15
categories: Ajax、Axios
tags:
- ajax
- 网络请求
- axios
- Promise
description: 'Axios的使用、源码分析'
cover: https://images.unsplash.com/photo-1606210109444-9699afeed688?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80
copyright_author: 飞儿 # 作者覆写
copyright_url: https://www.nesxc.com/post/hexocc.html # 原文链接覆写
license: CC BY-NC-SA 4.0
license_url: https://creativecommons.org/licenses/by-nc-sa/4.0/
---

# Axios #

## 1. 特点 ##

* 基于 xhr + promise 的异步 ajax 请求库 ，前端最流行的 ajax 请求库 
* 浏览器端/node 端都可以使用 
* 支持请求／响应拦截器 、支持请求取消 
* 请求/响应数据转换 
* 批量发送多个请求

## 2. 常用方法 ##

<img src="C:/Users/小虎牙/Desktop/hongs-study-notes/编程_前端开发学习笔记/Ajax、Axios学习笔记/Axios入门与源码解析笔记中的图片/Axios系统学习笔记原理图.png" alt="Axios系统学习笔记原理图" style="zoom: 80%;" />

```
1. axios(config): `通用/最本质`的发任意类型请求的方式 
2. axios(url[, config]): 可以只指定 url 发 get 请求 

3. axios.request(config): 等同于 axios(config) 
4. axios.get(url[, config]): 发 get 请求 
5. axios.delete(url[, config]): 发 delete 请求 
6. axios.post(url[, data, config]): 发 post 请求
7. axios.put(url[, data, config]): 发 put 请求 

8. axios.defaults.xxx: 请求的默认全局配置 

9. axios.interceptors.request.use(): 添加请求拦截器 
10. axios.interceptors.response.use(): 添加响应拦截器 

11. axios.create([config]): 创建一个新的 axios(它没有下面的功能) 

12. axios.Cancel(): 用于创建取消请求的错误对象 
13. axios.CancelToken(): 用于创建取消请求的 token 对象 
14. axios.isCancel(): 是否是一个取消请求的错误 

15. axios.all(promises): 用于批量执行多个异步请求 
16. axios.spread(): 用来指定接收所有成功数据的回调函数的方法
```

## 3. 重点用法 ##

### 1、axios.create(config) 

>1. 根据指定配置创建一个新的 axios, 也就是每个新 axios 都有自己的配置 
>
>2. 新 axios 只是没有取消请求和批量发请求的方法, 其它所有语法都是一致的 
>
>3. 为什么要设计这个语法?
>
>   (1) 需求: 项目中有部分接口需要的配置与另一部分接口需要的配置不太一样, 如何处理 
>
>   (2) 解决: 创建 2 个新 axios, 每个都有自己特有的配置, 分别应用到不同要 求的接口请求中
>
>```js
>//创建实例对象  /getJoke
> const duanzi = axios.create({
>   baseURL: 'https://api.apiopen.top',
>   timeout: 2000
> });
> const onather = axios.create({
>   baseURL: 'https://b.com',
>   timeout: 2000
> });
> //这里  duanzi 与 axios 对象的功能几近是一样的
> // duanzi({
> //     url: '/getJoke',
> // }).then(response => {
> //     console.log(response);
> // });
> duanzi.get('/getJoke').then(response => {
>   console.log(response.data)
> })
>```

### 2、拦截器

>1. 说明: 调用 axios()并不是立即发送 ajax 请求, 而是需要经历一个较长的流程 
>2. **流程:** 请求拦截器2 => 请求拦截器1 => 发ajax请求 => 响应拦截器1 => 响应拦截器 2 => 请求的回调 
>3. 注意: 此流程是通过 promise 串连起来的, 请求拦截器传递的是 config, 响应 拦截器传递的是 response
>
>```js
><script>
> // Promise
> // 设置请求拦截器  config 配置对象
> axios.interceptors.request.use(function (config) {
>   console.log('请求拦截器 成功 - 1号');
>   //修改 config 中的参数
>   config.params = {
>     a: 100
>   };
>
>   return config;  // 必须传config
> }, function (error) {
>   console.log('请求拦截器 失败 - 1号');
>   return Promise.reject(error);
> });
>
> axios.interceptors.request.use(function (config) {
>   console.log('请求拦截器 成功 - 2号');
>   //修改 config 中的参数
>   config.timeout = 2000;
>   return config;
> }, function (error) {
>   console.log('请求拦截器 失败 - 2号');
>   return Promise.reject(error);
> });
>
> // 设置响应拦截器
> axios.interceptors.response.use(function (response) {
>   console.log('响应拦截器 成功 1号');
>   return response.data;
>   // return response;
> }, function (error) {
>   console.log('响应拦截器 失败 1号')
>   return Promise.reject(error);
> });
>
> axios.interceptors.response.use(function (response) {
>   console.log('响应拦截器 成功 2号')
>   return response;
> }, function (error) {
>   console.log('响应拦截器 失败 2号')
>   return Promise.reject(error);
> });
>
> //发送请求
> axios({
>   method: 'GET',
>   url: 'http://localhost:3000/posts'
> }).then(response => {
>   console.log('自定义回调处理成功的结果');
>   console.log(response);
> });
></script>
>```

### 3、取消请求

>1. 基本流程 配置 cancelToken 对象 
>   1. 缓存用于取消请求的 cancel 函数 
>   2. 在后面特定时机调用 cancel 函数取消请求 
>   3. 在错误回调中判断如果 error 是 cancel, 做相应处理
>2. 实现功能 点击按钮, 取消某个正在请求中的请求,
>
>```js
><script>
> //获取按钮
> const btns = document.querySelectorAll('button');
> //2.声明全局变量
> let cancel = null;
> //发送请求
> btns[0].onclick = function () {
>   //检测上一次的请求是否已经完成
>   if (cancel !== null) {
>     //取消上一次的请求
>     cancel();
>   }
>   //1. 发送请求
>   axios({
>     method: 'GET',
>     url: 'http://localhost:3000/posts',
>     //1.1请求配置： 添加配置对象的属性，必须先配置好cancelToken
>     cancelToken: new axios.CancelToken(function (c) {
>       //3. 将 c 的值赋值给 cancel
>       cancel = c;
>     })
>   }).then(response => {
>     console.log(response);
>     //将 cancel 的值初始化
>     cancel = null;
>   })
> }
>
> //绑定第二个事件取消请求
> btns[1].onclick = function () {cancel(); }
></script>
>```

### 4. 默认配置

>```js
>//默认配置
>axios.defaults.method = 'GET';//设置默认的请求类型为 GET
>axios.defaults.baseURL = 'http://localhost:3000';//设置基础 URL
>axios.defaults.params = {id:100};
>axios.defaults.timeout = 3000;//
>
>btns[0].onclick = function(){
>axios({
> url: '/posts'
>}).then(response => {
> console.log(response);
>})
>}
>```

## 4. 问题 ##

### 1. axios 与 Axios 的关系

>1. 从`语法`上来说: axios 不是 Axios 的实例
>2. 从`功能`上来说: axios 是 Axios 的实例
>   * axios 是 `Axios.prototype.request` 函数 bind()返回的函数
>   * axios 作为对象，有 Axios 原型对象上的所有方法, 有 Axios 对象上所有属性

### 2. instance 与 axios 的区别?

>1. 相同: 
>   (1) 都是一个能发任意请求的函数: request(config)
>   (2) 都有发特定请求的各种方法: get()/post()/put()/delete()
>   (3) 都有默认配置和拦截器的属性: defaults/interceptors
>2. 不同:
>   (1) 默认配置很可能不一样
>   (2) instance 是通过createInstance创建出来的对象，但创建新对象的instance 没有 axios 后面添加的一些方法: create()/CancelToken()/all()

### 3. axios运行的整体流程

>1. 整体流程: 
>   request(config) ==> dispatchRequest(config) ==> xhrAdapter(config)
>
>2. request(config): 
>   将请求拦截器 / dispatchRequest() / 响应拦截器 通过 promise 链串连起来, 
>    返回 promise
>
>3. dispatchRequest(config): 
>   转换请求数据 ===> 调用 xhrAdapter()发请求 ===> 请求返回后转换响应数
>    据. 返回 promise
>
>4. xhrAdapter(config): 
>   创建 XHR 对象, 根据 config 进行相应设置, 发送特定请求, 并接收响应数据, 
>    返回 promise 
>
>5. 流程图:
>
><img src="C:/Users/小虎牙/Desktop/hongs-study-notes/编程_前端开发学习笔记/Ajax、Axios学习笔记/Axios入门与源码解析笔记中的图片/Axios系统学习流程图.png" alt="Axios系统学习流程图" style="zoom: 80%;" />
>
>

### 4. axios 的请求/响应拦截器是什么?

>1. 请求拦截器: 
>   Ⅰ- 在真正发送请求前执行的回调函数
>   Ⅱ- 可以对请求进行检查或配置进行特定处理
>   Ⅲ- 成功的回调函数, 传递的默认是 config(也必须是)
>   Ⅳ- 失败的回调函数, 传递的默认是 error
>2. 响应拦截器
>   Ⅰ- 在请求得到响应后执行的回调函数
>   Ⅱ- 可以对响应数据进行特定处理
>   Ⅲ- 成功的回调函数, 传递的默认是 response
>   Ⅳ- 失败的回调函数, 传递的默认是 error

### 5. axios 的请求/响应数据转换器是什么?

>1. 请求转换器: 对请求头和请求体数据进行特定处理的函数
>
>```js
>if (utils.isObject(data)) {
>		setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
>		return JSON.stringify(data);
>}
>```
>
>2. 响应转换器: 将响应体 json 字符串解析为 js 对象或数组的函数
>
>```js
>response.data = JSON.parse(response.data)
>```

### 6. response与error  的整体结构

>1. response的整体结构
>
>```js
>{
>data, status,statusText,headers,config,request
>}
>```
>
>2. error  的整体结构
>
>```js
>{
>message,response,request,
>}
>```

### 7. 如何取消未完成的请求?

>1. 当配置了 cancelToken 对象时, 保存 cancel 函数
>   (1) 创建一个用于将来中断请求的 cancelPromise
>   (2) 并定义了一个用于取消请求的 cancel 函数
>   (3) 将 cancel 函数传递出来
>2. 调用 cancel()取消请求
>   (1) 执行 cacel 函数, 传入错误信息 message
>   (2) 内部会让 cancelPromise 变为成功, 且成功的值为一个 Cancel 对象
>   (3) 在 cancelPromise 的成功回调中中断请求, 并让发请求的 proimse 失败, 
>   失败的 reason 为 Cancel 对象

## 5. 源码分析 ##

### 目录结构

>├── /dist/ # 项目输出目录    
>├── /lib/ # 项目源码目录    核心目录
>│ ├── /adapters/ # 定义请求的适配器 xhr.js、http.js
>│ │ ├── http.js # 实现 http 适配器(包装 http 包)，远端爬虫
>│ │ └── xhr.js # 实现 xhr 适配器(包装 xhr 对象)，网页中发送ajax请求
>│ ├── /cancel/ # 定义取消功能
>│ ├── /core/ # 一些核心功能
>│ │ ├── Axios.js # axios 的**核心主类**
>│ │ ├── dispatchRequest.js # **用来调用 http 请求适配器方法发送请求的函数**
>│ │ ├── InterceptorManager.js # 拦截器的管理器
>│ │ └── settle.js # 根据 http 响应状态，改变 Promise 的状态
>│ ├── /helpers/ # 一些辅助方法
>│ ├── axios.js # 对外暴露接口
>│ ├── defaults.js # axios 的默认配置
>│ └── utils.js # 公用工具
>├── package.json # 项目信息
>├── index.d.ts # 配置 TypeScript 的声明文件
>└── index.js # 入口文件

### Ⅰ- axios 的创建过程模拟实现

>```js
><script>
>//2.2 Axio内部做的事：
>function Axios(config) {
>//2.3 默认配置属性
>this.defaults = config; //为了创建 default 默认属性
>// 2.4 添加拦截器的属性request、response，这属性就是在new 拦截器的时候加的属性
>// 至此defaults、intercepters完成了配置
>this.intercepters = {
>request: {},
>response: {}
>}
>}
>//2.5 原型添加相关的方法（源码不止这几个），这样axios上面就有很多方法，实例就可以调用他们的方法
>Axios.prototype.request = function (config) {
>console.log('发送 AJAX 请求 请求的类型为 ' + config.method);
>}
>Axios.prototype.get = function (config) {
>return this.request({
>method: 'GET'
>});
>}
>Axios.prototype.post = function (config) {
>return this.request({
>method: 'POST'
>});
>}
>
>//2. createInstance函数的
>function createInstance(config) {
>//2.1 实例化Axios的一个对象 --> Axios
>let context = new Axios(config); // context.get()  context.post()  但是不能当做函数使用 context() X
>//2.6 创建请求函数 bind会返回新的函数，它与 Axios.prototype.request的作用是一样的，而这个方法是用来发送请求的，并修改了this指向，指向实例对象身上
>let instance = Axios.prototype.request.bind(context); 
>// 2.7 源码中使用extends做到的：可以当对象去使用，调用某些方法，而不是只能做函数调用
>// instance 是一个函数 并且可以 instance({})  此时 instance 不能 instance.get X
>//将 Axios.prototype 对象中的方法添加到instance函数对象中,才可以instance.get....，
>
>// 思想：先造一个函数，再去函数身上添加对应的属性，形成最终的结构  
>Object.keys(Axios.prototype).forEach(key => {
>// 2.8 保证内部的this始终执行实例
>instance[key] = Axios.prototype[key].bind(context); // this.default  this.interceptors
>});
>//2.9 为 instance 函数对象添加属性 default 与 interceptors
>Obect.keys(context).forEach(key => {
>instance[key] = context[key];
>});
>//3. 完成返回
>return instance;
>}
>// 1. axios是通过createInstance创造出来的
>let axios = createInstance();
>//发送请求
>// axios({method:'POST'});// 可以当函数使用
>axios.get({}); // 可以当对象，调方法使用
>axios.post({});
></script>
>```

### Ⅱ-axios发送请求过程详解

1. 判断传入的config是什么类型，做mergeConfig，，将用户配置的config与默认的合并

2. 判断请求方法，都没有传方法，默认值是get，小写设置

3. 声明一个数组chains，第一个元素dispatchRequest，它是一个用来发请求的函数，它来调http或xhr这两个打工仔

4. 用promise.resolve()创建一个promise对象，传入config（因为它是普通对象，所以状态成功的）

5. 请求拦截/响应拦截  略

6. chains的长度做循环，执行回调函数：

   ```js
   while(chain.length){
     // 一开始promise是成功的，执行第一个回调，shift出来的是第一个元素dispatchRequest
     // dispatchRequest的结果决定then的返回值，进而决定下一个promise的值
   	promise = promise.then(chain.shift(), chain.shift());
   }
   ```

7. 在dispatchRequest函数中：

   1. 取消请求 略

   2. 确保头信息存在

   3. 对请求体内容进行转化

   4. 对请求头信息整合

   5. 获取适配器对象：要么是http适配器要么是xhr适配器

      **xhrAdapter：**函数内部new XMLHttpRequest，发ajax请求，返回的是promise

   6. 最终返回：适配器返回的promise，并指定响应成功的函数：

      对响应的结果格式化处理，return response，他是一个普通对象，所以最上面的promise的then返回就是一个成功的promise

8. 此时request函数执行完毕-----axios执行结果完成

>```js
><script>
>// axios 发送请求   axios  Axios.prototype.request  bind
>//1. 声明构造函数
>function Axios(config) {
>this.config = config;
>}
>Axios.prototype.request = function (config) {
>//发送请求
>//1.1创建一个 promise 对象
>let promise = Promise.resolve(config);
>//声明一个数组
>let chains = [dispatchRequest, undefined]; // undefined 占位
>//调用 then 方法指定回调
>let result = promise.then(chains[0], chains[1]);
>//返回 promise 的结果
>return result;
>}
>
>//2. dispatchRequest 函数
>function dispatchRequest(config) {
>//调用适配器发送请求
>return xhrAdapter(config).then(response => {
>//响应的结果进行转换处理
>//....
>return response;
>}, error => {
>throw error;
>});
>}
>
>//3. adapter 适配器
>function xhrAdapter(config) {
>console.log('xhrAdapter 函数执行');
>return new Promise((resolve, reject) => {
>//发送 AJAX 请求
>let xhr = new XMLHttpRequest();
>//初始化
>xhr.open(config.method, config.url);
>//发送
>xhr.send();
>//绑定事件
>xhr.onreadystatechange = function () {
>if (xhr.readyState === 4) {
> //判断成功的条件
> if (xhr.status >= 200 && xhr.status < 300) {
>   //成功的状态
>   resolve({
>     //配置对象
>     config: config,
>     //响应体
>     data: xhr.response,
>     //响应头
>     headers: xhr.getAllResponseHeaders(), //字符串  parseHeaders
>     // xhr 请求对象
>     request: xhr,
>     //响应状态码
>     status: xhr.status,
>     //响应状态字符串
>     statusText: xhr.statusText
>   });
> } else {
>   //失败的状态
>   reject(new Error('请求失败 失败的状态码为' + xhr.status));
> }
>}
>}
>});
>}
>
>
>//4. 创建 axios 函数
>let axios = Axios.prototype.request.bind(null);
>axios({
>method: 'GET',
>url: 'http://localhost:3000/posts'
>}).then(response => {
>console.log(response);
>});
></script>
>```

### Ⅲ-拦截器的模拟实现

1. **调use的时候：**
   * InterceptorManager中会往实例的**handlers属性**（数组）里面**push**两个函数，分别是resolve，reject，其实就是use传参的时候传的两个函数，这对应一组请求拦截器
   * 如果有第2个请求拦截器，再push第2组：成功、失败的回调函数
   * 此时request的handlers身上已经有每个请求对应的每组回调了
2. **response的use：**
   * 同样的，如果有第2个响应拦截器，再push第2组：成功、失败的回调函数此时response的handlers身上已经有每个响应对应的每组回调了

use在执行的时候：只是把两个函数保存在了request的handlers属性里面，response也是这样

1. **真正发请求：**

   1. request发送请求，跟之前一样，参数检测合并

   2. chain数组  dispatchRequest undefined

   3. 创建成功promise对象

   4. 对拦截器的实例对象中的InterceptorManager封装了一个forEach方法来遍历handlers，其实就是遍历request对象身上的handlers的数组，并将请求拦截器回调往chains数组的前面追加**unshift**

      此时chains数组就发生了变化：two two one one dispatchRequest undefined

   5. forEach方法来遍历handlers：将响应拦截器的每组回调**push**到**chains**数组里面

      此时chains变化：two two one one dispatchRequest undefined one one two two 

   6. 不停的循环：从chains中取出**shift**执行，一组一组的执行

      所以2号响应拦截器先执行：返回promise对象 --取出1号响应器执行，返回promise对象

      dispatchRequest 

      响应1号 --- 响应2号

      假如这个过程中：发生了失败：失败会穿透

>1. array.shift()该方法用于把数组的第一个元素从其中删除，并返回第一个元素的值
>2. 思路为先将拦截器的响应回调与请求回调都压入一个数组中,之后进行遍历运行
>3. `promise = promise.then(chains.shift(), chains.shift());` 通过循环使用promise的then链条得到最终的结果-->等式前面的`promise`将被最终的结果覆盖

>```js
>function Axios(config){
>this.config = config;
>// 最后造出来的interceptors属性可以使用request等，use实际是实例对象上面的方法
>this.interceptors = {
> request: new InterceptorManager(),
> response: new InterceptorManager(),
>}
>}
>//发送请求  难点与重点
>Axios.prototype.request = function(config){
>//创建一个 promise 对象
>let promise = Promise.resolve(config);
>//创建一个数组
>const chains = [dispatchRequest, undefined];
>//处理拦截器
>//请求拦截器 将请求拦截器的回调 压入到 chains 的前面  request.handles = []
>this.interceptors.request.handlers.forEach(item => {
> chains.unshift(item.fulfilled, item.rejected);
>});
>//响应拦截器
>this.interceptors.response.handlers.forEach(item => {
> chains.push(item.fulfilled, item.rejected);
>});
>while(chains.length > 0){ 
> promise = promise.then(chains.shift(), chains.shift());
>}
>
>return promise;
>}
>
>//发送请求
>function dispatchRequest(config){
>//返回一个promise 队形
>return new Promise((resolve, reject) => {
> resolve({
>     status: 200,
>     statusText: 'OK'
> });
>});
>}
>
>//创建实例
>let context = new Axios({});
>//创建axios函数
>let axios = Axios.prototype.request.bind(context);
>//将 context 属性 config interceptors 添加至 axios 函数对象身上
>Object.keys(context).forEach(key => {
>axios[key] = context[key];
>});
>
>//拦截器管理器构造函数
>function InterceptorManager(){
>this.handlers = [];
>}
>InterceptorManager.prototype.use = function(fulfilled, rejected){
>this.handlers.push({
> fulfilled,
> rejected
>})
>}
>```

​	功能测试代码：

```js
   //以下为
   // 设置请求拦截器  config 配置对象
   axios.interceptors.request.use(function one(config) {
       console.log('请求拦截器 成功 - 1号');
       return config;
   }, function one(error) {
       console.log('请求拦截器 失败 - 1号');
       return Promise.reject(error);
   });

   axios.interceptors.request.use(function two(config) {
       console.log('请求拦截器 成功 - 2号');
       return config;
   }, function two(error) {
       console.log('请求拦截器 失败 - 2号');
       return Promise.reject(error);
   });

   // 设置响应拦截器
   axios.interceptors.response.use(function (response) {
       console.log('响应拦截器 成功 1号');
       return response;
   }, function (error) {
       console.log('响应拦截器 失败 1号')
       return Promise.reject(error);
   });

   axios.interceptors.response.use(function (response) {
       console.log('响应拦截器 成功 2号')
       return response;
   }, function (error) {
       console.log('响应拦截器 失败 2号')
       return Promise.reject(error);
   });


   //发送请求
   axios({
       method: 'GET',
       url: 'http://localhost:3000/posts'
   }).then(response => {
       console.log(response);
   });
```

### Ⅳ-请求取消功能模拟实现

* 原理：未来某个时刻调用cancel() --> promise属性上的promise状态变为成功--> 执行成功回调:xhr.abort()取消请求：
* 设计思想：把代码全放在一个promise成功回调之中，在未来想让代码执行的话，你只需要改变这个promsie的状态就可以了，而它将状态改变的函数暴露给了外层，交由程序员去控制

>```js
>//构造函数
>function Axios(config) {
>this.config = config;
>}
>//原型 request 方法
>Axios.prototype.request = function (config) {
>return dispatchRequest(config);
>}
>//dispatchRequest 函数
>function dispatchRequest(config) {
>return xhrAdapter(config);
>}
>//xhrAdapter
>function xhrAdapter(config) {
>//发送 AJAX 请求
>return new Promise((resolve, reject) => {
>//实例化对象
>const xhr = new XMLHttpRequest();
>//初始化
>xhr.open(config.method, config.url);
>//发送
>xhr.send();
>//处理结果
>xhr.onreadystatechange = function () {
>if (xhr.readyState === 4) {
>//判断结果
>if (xhr.status >= 200 && xhr.status < 300) {
>//设置为成功的状态
>resolve({
> status: xhr.status,
> statusText: xhr.statusText
>});
>} else {
>reject(new Error('请求失败'));
>}
>}
>}
>//5. 关于取消请求的处理
>//5.1 如果你之前配置过cancelToken
>if (config.cancelToken) {
>
>//5.2 对 cancelToken 对象身上的 promise 对象指定成功的回调
>config.cancelToken.promise.then(value => {
>xhr.abort();
>//将整体结果设置为失败
>reject(new Error('请求已经被取消'))
>});
>}
>})
>}
>
>//创建 axios 函数
>const context = new Axios({});
>const axios = Axios.prototype.request.bind(context);
>
>//CancelToken 构造函数
>function CancelToken(executor) {
>//1. 声明一个变量
>var resolvePromise;
>//2. 为实例的CancelToken对象身上添加属性promise，它还是一个promise对象
>this.promise = new Promise((resolve) => {
>//3. 将 resolve 赋值给 resolvePromise，它的执行就会改变这个promise的状态，因为有这个赋值了
>resolvePromise = resolve
>});
>//4. 调用 executor 函数：它就是你在实例化CancelToken时传入的那个函数，此时执行
>//4.1 而它的参数也是函数，它在运行的时候，改变了CancelToken属性的promsie状态
>// 4.2 这个函数实际上就是c，如果c执行：说明executor内部的函数参数执行，也就是resolvePromise()会执行，相当于resolve执行，promise状态改变        重点
>executor(function () {
>//执行 resolvePromise 函数，
>resolvePromise();
>});
>}
>```

```js
//获取按钮 以上为模拟实现的代码
const btns = document.querySelectorAll('button');
//2.声明全局变量
let cancel = null;
//发送请求
btns[0].onclick = function () {
 //检测上一次的请求是否已经完成
 if (cancel !== null) {
   //取消上一次的请求
   cancel();
 }

 //创建 cancelToken 的值，是
 let cancelToken = new CancelToken(function (c) {
   //4.3 在这里c赋值给了cancel，所以cancel函数执行，就会触发cancelToken内部的resolve的执行，改变promise的状态
   cancel = c;
 });

 axios({
   method: 'GET',
   url: 'http://localhost:3000/posts',
   //1. 添加配置对象的属性
   cancelToken: cancelToken
 }).then(response => {
   console.log(response);
   //将 cancel 的值初始化
   cancel = null;
 })
}

//绑定第二个事件取消请求
btns[1].onclick = function () {
 cancel();
}
```

## 基于axios的网络封装 ##

```js
//main.js

import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3000';
/**
* //封装axios方法,为不需要登录操作时使用,也可以提前传入token
* @param options 配置
*/
let Axios= (options)=>{
   axios({
       url:options.url,
       method:options.method||'POST',
       data: options.data,
       params: options.data
   }).then(result=>{
       if (options.success)  options.success(result.data)
   }).catch(err=>{
       let msg = err.response ? err.response.data:'请求异常'
       if (options.error){
           options.error(msg)
           Message.error({message: msg, offset: 150});
       }else {
           Message.error({message: msg, offset: 150});
       }
   })
}
//不拦截的(不带token)往往用在vue创建前的生命周期中
Vue.prototype.$Axios = Axios
```

