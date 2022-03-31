---
title: Vue&&React的路由管理
tags: 路由管理
categories: React&&Vue
description: 路由到底是什么，主流实现思路
cover: https://cdn.jsdelivr.net/gh/myNightwish/CDN_res/img/sweet1.avif
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: 路由
date: 2021-12-11 22:55:57
---
## react-router ##

最基本、核心的能力：路由跳转；3个重要部分：

* **路由器**：BrowserRouter、HashRouter。根据Route定义的映射关系，为新路径匹配它对应的逻辑
* 路由：Route、switch。负责定义路径与组件之间的映射关系
* 导航：Link、NavLink、Redirect。负责触发路径的改变

### 1、路由器简介 ###

路由器是整个路由系统中最终重要功能。它负责感知路由的变化并作出反应。react-roter中支持两种路由器：BrowserRouter、HashRouter

两种路由器的不同仅在于调用的history不同。这两个API源码中

* BrowserRouter在浏览器中使用H5的history API来控制路由跳转：
* HashRouter通过控制URL的hash属性来控制路由跳转的。

### 2、为什么需要路由？产生背景 ###

什么是路由、它能解决什么问题

#### 1. 后端路由时代： ####

* 在前后端不分离时代，一个url对应一个页面。

* 由**后端来控制路由**，当接收到客户端发来的   `HTTP` 请求，就会**根据所请求的相应 `URL`，来找到相应的映射函数**，然后执行该函数，并将函数的返回值发送给客户端

* 举例：请求页面：`http://www.xxx.com/login`，大致流程：

  1. 浏览器发出请求
  2. 服务器监听到80端口（或443）有请求过来，并解析url路径
  3. 根据服务器的路由配置，返回相应信息（可以是 html 字串，也可以是 json 数据，图片等）
  4. 浏览器根据数据包的 Content-Type 来决定如何解析数据

  <img src="http://www.conardli.top/img/wl/wlqq_1.png" alt="image" style="zoom: 67%;" />

  * **好处：安全性好，`SEO` 好；**
  * **缺点：**

    1. 加大服务器的压力
    2. 任何和服务器的交互都需要刷新页面，**用户体验**非常差     **Ajax解决了它**
    3. 代码冗合不好维护；

#### 2. 前后端分离时代 ####

* **Ajax：**

  概念：`Async JavaScript And XML`，浏览器的`XMLHttpRequest`是实现`Ajax`最重要的对象，通过XHR对象获取数据后，可以使用DOM方法将数据插入到网页中

* **最大优势特点**：页面**不刷新**的情况下与服务器通信，异步交互体验好

* **缺点：**

  1. 没有浏览历史，不能回退
  2. 存在跨域问题（同源策略限制）
  3. SEO不友好

#### 3. SPA ####

在ajax的背景下，出现了SPA

* SPA 允许页面在不刷新的情况下更新页面内容，内容的切换更流畅

* 但SPA的问题：定位的问题

  页面切换前后，页面的url都是一样的，这就导致了两个问题

  1. SPA并不知道：当前页面当前页面“进展到哪一步”，刷新页面之后，你必须重复之前的操作，才可以重新对内容进行定位，SPA并不会记住你的操作。
  2. SPA有且仅有一个URL给页面做映射，这对SEO并不友好

#### 4. 前端路由 ####

它解决了SPA的什么问题呢？

* 它可以帮助我们在仅有一个页面的情况下，**记住用户走到了哪一步？**

* 它为各个SPA中的各个视图匹配唯一标识，这时候用户前进后退触发的新内容都映射到URL上去，此时即便刷新页面，当前的URL也可以标识出它所在的位置，因此内容也不会丢失

是如何解决的呢？

* **解决问题1：**在SPA中，当用户刷新页面时，浏览器会默认根据当前的URL对资源进行重新定位（发送请求）。这个动作对SPA是不必要的。

  因为SPA作为单页面，无论如何也只有一个页面与之对应；此时若走正常的请求刷新流程，反而会使用户的前进、后退流程无法被记录

* **解决问题2：**单页面应用对服务器来说就是一个URL、一套资源，那么如何做到用不同的URL来映射不同的视图内容呢？

**此时服务端已经无法解决SPA的场景了。前端自己解决：**

**提供解决思路：**拦截用户的刷新操作，避免服务器盲目响应，返回不符合预期的资源内容。把刷新这个动作完全放到前端逻辑里消化掉，感知URL的变化，这里并不是改造URL，给他做一些处理，这些处理并不会影响其本身的性质，也不会影响服务器对它的识别。

一旦感知到它的变化，根据JS生成不同的页面。

### 3、前端路由实践思路 ###

#### 1、hash模式 ####

* **#后面 hash 值的变化，不会导致浏览器向服务器发请求，浏览器不发请求，就不会刷新页面**
* 每次 hash 值的变化，还会触发 **hashchange 这个事件**，通过这个事件可知道 hash 值发生了哪些变化。便可以监听 hashchange 来实现更新页面部分内容的操作：

##### hash值改变的方式： #####

* **方式1：**通过 `a` 标签，并设置 `href` 属性，当用户点击这个标签后，`URL` 就会发生改变，也就会触发 `hashchange` 事件了：

  ```js
  <a href="#search">search</a>
  ```

* **方式2：**直接使用 `Js`来对 `loaction.hash` 进行赋值，从而改变 `URL`，触发 `hashchange` 事件：

  ```js
  location.hash="#search"
  ```

##### 感知hash的方式： hashChange事件 #####

* `hashchange` 事件来监听 `hash` 的变化：可以在回调中执行展示和隐藏不同UI显示的功能

  ```
  window.addEventListener('hashChange', () => {})
  ```

##### Hash的特点： #####

* **HTTP请求中不包括#及其后面的部分**，都不会被发送到服务器端

  所以，hash 虽然出现在 URL 中，**但不会被包括在 HTTP 请求中，对后端完全没有影响**，因此改变 hash 不会重新加载页面

  对于后端来说，即使没有做到对路由的全覆盖，也**不会返回 404 错误**

* **改变#后面的内容不触发网页重载**，浏览器只会滚动到相应位置

  \#代表网页中的一个位置。其右面的字符，就是该位置的标识符：http://www.example.com/index.html#print，就代表网页index.html的print位置。浏览器读取这个URL后，会自动将print位置滚动至可视区域

#### 2、history模式 ####

通过浏览器的回退、前进按钮控制，就可以实现页面跳转，这是通过API来实现的。浏览器的History API所赋予的。但H4只能切换，而不能改变。H5后增加了pushState、replaceState。

```js
// 新增一个历史记录，所以会相应地启用“后退”按钮
window.history.pushState(null,一个新状态的标题，path);

//直接替换当前的历史记录
// 要确保每个“假”URL 背后都对应着服务器上一个真实的物理 URL。否则，单击“刷新”按钮会导致 404 错误
window.history.replaceState(null, null, path);
```

在hsitory模式下，可以通过监听 `popstate` 事件，达到目的：

* 每当浏览记录发生变化， `popstate` 事件就会触发，go、forward、back等调用确实会触发popState、但`pushState()` 或 `replaceState()` 不会触发 `popstate` 事件。

* 但我们可以通过手动触发来实现。

### 4、404 错误 ###

history 模式下，前端的 URL 必须和实际向后端发起请求的 URL 一致，如 http://www.abc.com/book/id 如果后端缺少对 /book/id 的子路由处理，将返回 404 错误

#### 为什么histroy需要额外配置？ ####

* 假设应用地址为`abc.com`，服务端不加额外的配置。当通过`abc.com`来访问时，是没有问题的，可以正常加载到html文件

* 之后通过route-link或router.api来跳转也不会有问题，因为之后都不会刷新页面请求html，只是通过`history.pushState`或者`history.replaceState`改变history记录，修改地址栏地址而已；

* 但如果是**直接访问子路由`abc.com/test`时就会有问题**，`/test`是子路由名，但是服务器中并不存在该目录，就无法索引到html文件，此种情况下就会出现404，所以不管是访问什么路径，都应该加载根目录的html文件，因为`/xxx/yyy`对我们应用来讲是子路由路径而已

* **处理：**

  在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面。一般需要后端将所有页面都配置重定向到首页路由

#### 为什么hash不需要？ ####

* hash 虽然出现在 URL 中，**但不会被包括在 HTTP 请求中，对后端完全没有影响**，因此改变 hash 不会重新加载页面
* 对于后端来说，即使没有做到对路由的全覆盖，也**不会返回 404 错误**