---
title: JS的EventLoop
tags:
  - EventLoop
  - 宏任务
  - 微任务
categories: 1.2-JS
description: 异步与同步、宏任务、微任务
cover: https://mynightwish.oss-cn-beijing.aliyuncs.com/CSS/浏览器异步.webp
copyright_author: 飞儿
swiper_index: 2
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: 656350506
date: 2021-12-11 20:41:33
---

### 1、JS执行机制 ###

* JS分为同步任务和异步任务，同步任务都在主线程上（JS引擎线程）执行，形成一个`执行栈`
* 主线程之外，**事件触发线程**管理着一个`任务队列`，只要异步任务有了运行结果，就在`任务队列`之中放置一个事件
* 一旦`执行栈`中的所有同步任务执行完毕（此时JS引擎空闲），系统就会读取`任务队列`，将可运行的异步任务添加到可执行栈中，开始执行

### 2、事件循环 ###

#### 1、流程： ####

1. 首先，执行栈开始顺序执行
2. 判断是否为同步，异步则进入异步线程，最终事件回调给事件触发线程的任务队列等待执行，同步继续执行
3. 执行栈空，询问任务队列中是否有事件回调
4. 任务队列中有事件回调则把回调加入执行栈末尾继续从第一步开始执行
5. 任务队列中没有事件回调则不停发起询问

#### 2、涉及到的线程特点： ####

1. **定时触发线程：**只管理定时器且只关注定时不关心结果，定时结束就把回调扔给事件触发线程
2. **异步http请求线程：**只管理http请求同样不关心结果，请求结束把回调扔给事件触发线程
3. **事件触发线程：**只关心异步回调入事件队列
4. **JS引擎线程：**只会执行执行栈中的事件，执行栈中的代码执行完毕，就会读取事件队列中的事件并添加到执行栈中继续执行，这样反反复复就是我们所谓的**事件循环(Event Loop)**

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/1/18/16fb7acab03b35fa~tplv-t2oaga2asx-watermark.awebp" alt="img" style="zoom:25%;" />



### 3、宏任务         task ###

* 可以将每次执行栈执行的代码当做是一个宏任务(包括每次从事件队列中获取一个事件回调并放到执行栈中执行)， 每一个宏任务会从头到尾执行完毕，不会执行其他

* 由于`JS引擎线程`和`GUI渲染线程`是互斥的关系，浏览器为了能够使`宏任务`和`DOM任务`有序的进行，会在一个`宏任务`执行结果后，在下一个`宏任务`执行前，`GUI渲染线程`开始工作，对页面进行渲染

  ```
  宏任务 -> GUI渲染 -> 宏任务 -> ...
  ```

* 常见的宏任务

  * 主代码块
  * setTimeout
  * setInterval
  * setImmediate ()-Node
  * requestAnimationFrame ()-浏览器

### 4、微任务    jobs ###

#### 1、概念： ####

* ES6新引入了Promise标准，同时浏览器实现上多了一个`microtask`微任务概念

* `宏任务`结束后，会执行渲染，然后执行下一个`宏任务`， 而微任务可以理解成在当前`宏任务`执行后立即执行的任务

  会在渲染前，将执行期间所产生的所有`微任务`都执行完

  ```
  宏任务 -> 微任务 -> GUI渲染 -> 宏任务 -> ...
  ```

* 常见微任务

  * process.nextTick ()-Node
  * Promise.then()
  * catch
  * finally
  * Object.observe
  * MutationObserver

#### 2、注意点 ####

* 浏览器会先执行一个宏任务，紧接着执行当前执行栈产生的微任务，再进行渲染，然后再执行下一个宏任务

* #### 微任务和宏任务不在一个任务队列，不在一个任务队列 ####

  * 例如`setTimeout`是一个宏任务，它的事件回调在宏任务队列，`Promise.then()`是一个微任务，它的事件回调在微任务队列，二者并不是一个任务队列
  * 有关渲染的都是在渲染进程中执行：
    1. 渲染进程中的任务（DOM树构建，js解析…等等），其中需要主线程执行的任务都会在主线程中执行
    2. 而浏览器维护了一套事件循环机制，主线程会循环消息队列，并从头部取出任务进行执行
    3. 如果执行过程中产生其他任务需要主线程执行的，渲染进程中的其他线程会把该任务塞入到消息队列的尾部，**消息队列中的任务都是宏任务**

* #### 微任务是如何产生的呢？ ####

  1. 当执行到script脚本的时候，js引擎会为全局创建一个执行上下文，在该执行上下文中维护了一个微任务队列
  2. 当遇到微任务，就会把微任务回调放在微队列中，当所有的js代码执行完毕，在退出全局上下文之前引擎会去检查该队列，有回调就执行，没有就退出执行上下文
  3. 这也就是为什么微任务要早于宏任务

