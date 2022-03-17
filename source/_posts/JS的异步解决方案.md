---
title: JS的异步解决方案
tags:
  - JS
  - Promsie、Async、await
categories: JS
description: 从回调->promise->async+await，漫长的前端异步之路
cover: https://cdn.jsdelivr.net/gh/myNightwish/CDN_res/img/异步.avif
copyright_author: 飞儿
swiper_index: 1
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: 3384747987
date: 2021-12-11 20:41:16
---

## 异步解决方案 ##

### 1、JS的异步任务 ###

* JS各种事件
* setTimeout、setInterval 定时器
* Ajax网络请求
* Promise
* async function

### 2、几种异步解决方案 ###

* 回调函数
* 事件监听(发布/订阅)
* Promise
* Generator
* Async/Await

### 3.1、方式1：回调函数 ###

异步编程最基本的方法，举例

* 假定有两个函数f1和f2，后者等待前者的执行结果

  ```js
  f1();  // 耗时较长的任务，直接这样写会导致阻塞
  f2();
  ```

* 改写：

  **把同步操作f1变成了异步操作，f1不会堵塞程序运行，相当于先执行程序的主要逻辑，将耗时的操作推迟执行**

  ```js
  function f1(callback){//此时f1就是一个异步任务
    setTimeout(function () {
      // f1的任务代码
      ......
      callback(); // f2的逻辑，会在f1执行完毕后就能执行
    }, 1000);
  }
  f1(f2);
  ```

* 优点：简单易理解

* 缺点：

  * 不利于代码的阅读和维护，各个部分之间高度耦合
  * 流程会很混乱，而且每个任务只能指定一个回调函数
  * **异步回调中，回调函数的执行栈与原函数分离，外部无法抓住异常，异常会变得不可控。这会导致什么呢？？？**

### 3.2、方式2：事件监听 ###

采用事件驱动模式。任务的执行**不取决于代码的顺序，而取决于某个事件是否发生**

* 首先，为f1绑定一个done事件，f2作为回调

  ```js
  f1.on('done', f2);  // f1事件执行完毕后，执行f2
  ```

* 然后，对f1进行改写：

  ```js
  function f1(){
　　　　setTimeout(function () {
      // f1的任务代码
      ....
      // f1.trigger('done')手动触发done事件，从而开始执行f2
　　　　　　f1.trigger('done');
　　　　}, 1000);
  　　}
  ```

* 优点：

  * 易理解，可以绑定多个事件，每个事件可以指定多个回调函数
  * 可以去耦合
  * 有利于模块化

* 缺点：整个程序都要变成事件驱动型，运行流程会变得很不清晰

### 3.3、方式3：发布订阅 ###

**发布/订阅模式：**

* 存在一个“信号中心”，某个任务执行完成，就向信号中心发布一个信号；
* 其他任务可以向信号订阅这个信号，从而知道什么时候自己可以开始执行；

#### 1、用class实现 ####

1. 创建了一个`Emitter`类，有两个原型方法`on`和`trigger`

   ```js
   class Emitter {
     constructor() {
       // _listener数组，key为自定义事件名，value为执行回调数组-因为可能有多个
       this._listener = [];
     }
     on(type, fn) { // 订阅 监听事件
       // 判断_listener数组中是否存在该事件命
       // 存在将回调push到事件名对应的value数组中，不存在直接新增
       this._listener[type] 
         ? this._listener[type].push(fn) 
       	: (this._listener[type] = [fn])
     }
     trigger(type, ...rest) { // 发布 触发事件
       // 判断该触发事件是否存在
       if (!this._listener[type]) return
       // 遍历执行该事件回调数组并传递参数
       this._listener[type].forEach(callback => callback(...rest))
     }
   }
   ```

#### 2、使用 ####

创建一个emitter实例，接着注册事件，再触发事件

```js
const emitter = new Emitter()

emitter.on("done", function(arg1, arg2) {
  console.log(arg1, arg2)
})
emitter.on("done", function(arg1, arg2) {
  console.log(arg2, arg1)
})

function fn1() {
  console.log('我是主程序')
  setTimeout(() => {
    emitter.trigger("done", "异步参数一", "异步参数二")
  }, 1000)
}
fn1();
```

* 这种方法的性质与"事件监听"类似，但是明显优于后者。因为我们可以通过查看"消息中心"，了解存在多少信号、每个信号有多少订阅者，从而监控程序的运行

### 3.4、方式4：promise ###

* 思想是，每一个异步任务返回一个Promise对象，该对象有一个then方法，允许指定回调函数

* 比如，f1的回调函数f2,可以写成：

  ```jsx
  f1().then(f2);
  ```

  f1改写为promise：

  ```js
   const f1 = () => {
     return new Pomise((resolve, reject) => {
  　　	setTimeout(function () {
          // f1的任务代码
              ....
  　　　　　　resolve();
  　　　　}, 500);
  　　})
   }
  ```

* 优点：

  1. 可以指定多个回调、错误的回调

     ```js
     f1().then(f2).then(f3);
     f1().then(f2).catch(f3);
     ```

  2. 其他三个没有的：

     如果一个任务已经完成，**再添加回调函数（指定then），该回调函数会立即执行**。所以，你不用担心是否错过了某个事件或信号

### 3.5、Generator ###

### 3.6、async await ###

## 2.1、Promise概念及关键问题 ##

一句话：用同步的方式写异步的代码，可用来解决回调地狱问题

### 1、是什么 ###

* ##### 抽象表达:   #####

  1. Promise **就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。承诺不一定会完成，但是一定都会有一个结果**
  2. Promise 是 JS `异步编程`的新方案，是一门新技术(ES6 规范) , 备注：旧方案是回调

* ##### 具体表达:  #####

  1. 从语法上: Promise 是一个`构造函数`，实例是一个对象，从它可以获取异步操作的消息
  2. 从功能上: promise 对象用来封装一个异步操作，而且Promise 提供统一的 API，可以获取其成功/ 失败的结果值

### 2、2个特点: ###

1. Promise对象的状态不受外界影响。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态
2. 一旦状态改变，就不会再变，任何时候都可以得到这个结果
   * `Promise`对象的状态改变，只有两种可能：从`pending`变为`fulfilled`和从`pending`变为`rejected`。
   * 只要这两种情况发生，状态就凝固了。
   * 如果改变已经发生了，再对`Promise`对象添加回调函数，会立即得到这个结果。这与事件完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

### 3、优/缺点： ###

#### 3.1、优点： ####

* ##### 以往异步编程模式 #####

  * 普通异步回调：异步函数的返回值只在短时间内存在，需要提前准备好回调函数来接收它
  * 嵌套异步回调：异步返回值依赖与另一个返回值，多个会造成回调地狱，代码维护很难

* ##### promise #####

  1. **指定回调函数的方式更加灵活:**

     * 启动异步任务 => 返回promie对象 => 给promise对象绑定回调函数(甚至可以在异步任务结束后指定/多个)

     * 而旧版必须在启动异步任务前指定 
     * `Promise`对象提供统一的接口，使得**控制异步操作更加容易**

  2. **支持链式调用, 解决回调地狱问题**

* 同步的方式写异步的代码，避免了层层嵌套的回调函数

* promise `链式调用`：用来解决回调地狱问题，但`只是简单改变格式`，并没有彻底解决

#### 3.2、缺点： ####

1. **一旦新建它就会立即执行，无法中途取消**
2. 如果不设置回调函数，`Promise`内部抛出的错误，不会反应到外部
3. 当处于`pending`状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）
4. 一眼看上去都是promise的API，而且链式语法总觉得不好看，不优雅

### 4、onRejected和catch区别 ###

`promise.then(onresolved, onRejected)`在 `onresolved`回调中发生异常时：

* `onRejected`中是捕获不到这个异常，可以在末尾多加一个`then`从而达到和`catch`相同的作用（流转到下一个错误处理）

* **使用`catch`可以捕获到前面的`onRejected`的异常**

  ```js
  Promise.resolve(1)
    .then(() => {
      console.log("我是对的");
      throw '111'  // 抛出异常
    }, () => {
  		console.log('error')
  	})
  //情况1： 我是对的  111   返回undefined的resolved的promise
  .then(res => console.log(res), err => console.log(err))
  // 情况2：    
  .catch(err => {
    // 我是对的  err:111   返回undefined的resolved的promise
      console.log("err:" + err) 
  })
  ```

### 5、then中抛错未处理 ###

* 如果在then中抛错，而没有对错误进行处理(catch)，那么会一直保持reject状态的promise，就不会往下执行了

* 直到catch了错误，状态变为resolved

* promise的缺点之一就是无法让promise中断，利用这个特性可让Promise中断执行

  ```js
  Promise.resolve()
  	.then(()=>{
    	console.log(a) // 错误：未声明的变量
    	console.log("Task 1");
  	})//跳过了第二个then
    .then(()=>{
    	console.log("Task 2");
  	})//如果我们没有处理这个错误(无catch)的话，就不会往下执行了
    .catch(err=>{
    // 这时候变成undefined的resolved的promise
    	console.log("err:" + err)
  	})
    .then((res)=>{
    	console.log("finaltask", res)
  	});
  
  // err:ReferenceError: a is not defined
  // finaltask  undefined
  ```

* #### 流程图： ####

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/14/17041c4ba347afe2~tplv-t2oaga2asx-watermark.awebp" alt="img" style="zoom: 50%;" />

### 6、异步回调中抛错catch捕捉不到 ###

1. 在Promise对象的处理器函数中直接抛出错误，`catch`是可以捕捉到的

   ```js
   const p = new Promise((resolve, reject)=>{
     throw new Error('这是一个错误')
   });
   p.catch((error)=>{ console.log(error) });
   ```

2. 在Promise对象的处理器函数中异步抛错，**catch捕获不到：**为什么

   ```js
   const p = new Promise((resolve, reject)=>{
     setTimeout(()=>{ throw new Error('这是一个错误') }, 0)
   });
   p.catch(error=>{ console.log(error) });
   ```

   JS 事件循环列表有宏任务与微任务之分，setTimeOut是宏任务， promise是微任务，执行顺序不同

   * 执行栈进入promise 触发setTimeOut，setTimeOut回调函数入宏任务队列
   * 执行promise的catch方法，入微任务队列，此时setTimeOut回调还没执行
   * 执行栈检查发现当前微任务队列执行完毕，开始执行宏任务队列
   * 执行`throw new Error('这是一个错误')` 此**时这个异常其实是在promise外部抛出的**

* **解决**：使用`try catch`捕获异常主动触发`reject`       不太理解？？

  ```js
  const p = new Promise((resolve, reject)=>{
    setTimeout(()=>{ 
      try{
         throw new Error('这是一个错误') 
      }catch(e){
         reject(e)
      }
   }, 0)
  });
  p.catch((error)=>{ console.log(error) });
  ```

### 7、中断 promise 链? ###

场景：有5个then()，但其中有条件判断,如当我符合或者不符合第三个then条件时,要直接中断链式调用,不再走下面的then,该如何？

* 回调函数中返回一个 `pendding` 状态的`promise 对象`

  ```js
  let p = new Promise((resolve, reject) => {
    	setTimeout(() => { resolve('OK');}, 1000);}
  );
  p.then(value => {return new Promise(() => {});})//有且只有这一个方式
  .then(value => { console.log(222);})
  .then(value => { console.log(333);})
  .catch(reason => {console.warn(reason);});
  ```

### 8、一个 promise 指定多个成功/失败回调函数, 都会调用吗?

* 当 promise `改变为对应状态时`都会调用,改变状态后,多个回调函数都会调用,并不会自动停止

>```js
>let p = new Promise((resolve, reject) => {  resolve('OK');});
>///指定回调1
>p.then(value => {  console.log(value); });
>//指定回调2
>p.then(value => { alert(value);});
>```

### 9、改变 promise 状态和指定回调函数谁先谁后?

都有可能, 正常情况下是先指定回调再改变状态, 但也可以先改状态再指定回调 

#### 1、先指定回调再改变状态 ####

* 先指定回调--> 再改变状态 -->改变状态后才进入异步队列执行回调函数

  ```js
  let p = new Promise((resolve, reject) => {
  	//异步写法,这样写会先指定回调,再改变状态
  	setTimeout(() => {resolve('OK'); }, 1000);
  });
  p.then(value => {console.log(value);}, reason => {})
  ```

* 当状态发生改变时, 回调函数就会调用, 得到数据

#### 2、先改状态再`指定`回调 ####

* 先改状态再`指定`回调：

  方法1：在执行器中直接调用 resolve()/reject() 

  ```js
  let p = new Promise((resolve, reject) => {
  	//这是同步写法,这样写会先改变状态,再指定回调
  	resolve('OK'); 
  });
  p.then(value => {console.log(value);}, reason => {})
  ```

  方法2：延迟更长时间才调用 then() ，在`.then()`外再包一层例如延时器

* 当指定回调时, 回调函数就会调用, 得到数据

#### 3、个人理解--结合源码 ####

源码中,promise的状态是通过一个`默认为padding`的变量进行判断：

1. 当你`resolve/reject`延时(异步导致当then加载时,状态还未修改)后,这时直接进行p.then()会发现,目前状态还是`进行中`，如果只是这样会导致只有同步操作才能成功

2. 所以promise将传入的`回调函数`拷贝到promise对象实例上,然后在`resolve/reject`的执行过程中再进行调用,达到异步的目的

## 2.2、Promise用法 ##

### 	1- Promise 构造函数: Promise (excutor) {}

```js
const p2 = new Promise((resolve, reject) => {
  // ...
  resolve(p1);
})
```

* executor 函数: 执行器 (resolve, reject) => {}，会在 **Promise 内部立即`同步调用`**
* resolve 函数：会将promise状态改成resolved，**参数正常的值/另一个 Promise 实例**
* reject 函数：**参数通常是`Error`对象的实例，表示抛出的错误**

#### 1、参数传递问题： ####

```js
const p2 = new Promise(function (resolve, reject) {
  // ...
  resolve(p1);
})
```

* p1：正常值，参数p1会作为promise的结果，保存在promise对象的**promiseResult**属性中，被传递给**回调函数的参数**
* p1：promise对象，**`p1`的状态决定了`p2`的状态**
  * 如果`p1`状态是`pending`，那`p2`的回调函数会等待`p1`的状态改变
  * 如果`p1`状态已经是`resolved`或者`rejected`，那么`p2`的回调函数将会立刻执行

#### 2、`resolve`或`reject`对执行器函数的执行影响 ####

* 注意，调用`resolve`或`reject`并不会终结 Promise 的参数函数的执行，后面的仍然是同步任务

* 而then：是在微任务中执行的

  ```javascript
  new Promise((resolve, reject) => {
    resolve(1);
    console.log(2);
  }).then(r => {
    console.log(r);
  });
  // 2
  // 1
  ```

  * 调用`resolve(1)`以后，后面的`console.log(2)`还是会执行，并且会首先打印出来。这是因为**立即 resolved 的 Promise 是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务**


#### 3、return的影响： ####

一般来说，一个promise对象内部`resolve`或`reject`以后，Promise 的使命就完成了。但执行器本身后面还是执行的，所以，最好在它们前面加上`return`语句，这样就不会有意外

```javascript
new Promise((resolve, reject) => {
  return resolve(1);
  // 后面的语句不会执行
  console.log(2);
})
```

### 	2-原型方法then

Promise实例生成以后，可用`then`方法指定`resolved`状态和`reject`状态的回调函数

```js
Promise.prototype.then(onFulfilled [, onRejected])
```

#### 1、返回值：返回一个新的 promise 对象 ####

* 返回一个新的 promise 对象，因此可用链式写法，即`then`后面再`then`
* 链式写法中，后一个回调函数，会等待前`Promise`对象的状态发生变化，才会被调用

#### 2、返回结果promise 对象的状态          重要5条 ####

总结：由 then()指定**的回调函数执行的结果决定** 

1. 如果没有return值，那会返回的新promise变为resolved，传参undefined

2. 如果return非 promise 的任意值, 新 promise 变为 resolved, value 为返回的值

3. 如果**then里抛出异常**，`then`方法的第二个参数onRejected是监测不到当前`then`方法回调异常的，promise规范规定调用失败态方法(reject)**流转到下一个`then`的onRejected**

4. 如果return另一个新 promise, 此 promise 的结果就会成为新 promise 的结果

   ```js
   let p = new Promise((resolve, reject) => {
   	resolve('ok');
   });
   let result = p.then(value => {
   // 1. 如果只是执行语句，没有返回，新promise变为resolved，且传参undefined
   		console.log(value);
   // 2. 返回结果是非 Promise 类型的对象,新 promise 变为 resolved
   		return 521;
   // 3. 抛出错误 ,变为 rejected，流转到下一个then的onRejected
   		throw '出了问题';
   // 4. 返回结果是 Promise 对象,此 promise 的结果就会成为新 promise 的结果
     return new Promise((resolve, reject) => {
       // 流转到下一个then的onRejected
     	// resolve('success');
     		 reject('error');
     		});
     	}, reason => {
     		 console.warn(reason);
     });
   }
   ```

5. **如果`then`方法没有传入任何回调，则继续向下传递(即所谓的值穿透)**

   ```js
   let p = new Promise((resolve, reject) => {
     resolve(1)
   })
   
   p.then(data => 2)
   .then()
   .then()
   .then(data => {
     console.log(data) // 2
   })
   ```

### 	 3-原型方法catch

then()的语法糖, 相当于: then(undefined, onRejected)

```js
p.catch(onRejected);
p.catch(function(reason) {
  // 
});
```

#### 1、返回值：返回一个新的promise实例，因此后面还可以接着调用`then()`方法 ####

1. 如果 `onRejected`回调抛出一个错误或返回一个本身失败的 Promise ，返回rejected的promise

2. 否则返回成功的promise

   ```js
   fn1()
     .catch(err => {
       console.log(err)
     // 这里只是return了错误信息，并没有抛出错误或者返回一个失败promise
     // 所以第一个`catch`执行返回的promise对象是resolved
       return err  
     })
     .then(data => {
       console.log(data)
     })
   	.catch(err => {
       console.log(err)
     })
   ```

#### 2、catch可以捕获什么？ ####

1. ##### Promise 内部的错误 #####

   如果没有用`catch()`方法指定错误处理的回调函数，**Promise 对象抛出的错误不会传递到外层代码**，即不会有任何反应

   ```js
   const someAsyncThing = function() {
     return new Promise(function(resolve, reject) {
       // 下面一行会报错，因为x没有声明
       resolve(x + 2);//内部有语法错误。浏览器运行到这一行，会抛错，但不会退出进程、终止脚本执行
     });
   };
   
   const m = someAsyncThing();  //m是rejected的，promise中的不会执行下去
   m.then(function() {//不执行
     console.log('everything is great');
   })
   .then(err => alert(11,err))//不执行
   .then(err => alert(22, err)) //不执行
   
   setTimeout(() => { console.log(123) }, 2000); // 仍然执行
   // Uncaught (in promise) ReferenceError: x is not defined
   // 123
   ```

   但如果将then替换为catch：m.then ---m.catch，promise就能继续执行下去

   ```js
   everything is great
   11 22
   ```

2. ##### `then()`方法中抛出错误 #####

   在`then()`方法里面定义 Reject 状态的回调函数，捕获不到then里面的错误

   但会被**后面的`catch()`方法捕获。**

   ```js
   fn1()
     .then(data=>{
       console.log(data)
     }).catch(err=>{
       console.log(err)
     })
   ```

3. ##### promise异常穿透 #####

   前面任何操作出了异常, 都会传到最后失败的回调中处理；所以

   * 可以在每个then()的第二个回调函数中进行err处理
   * 也可以利用异常穿透特性，到最后用`catch`去承接统一处理
   * 两者一起用时,前者会生效(因为err已经将其处理,就不会再往下穿透)而走不到后面的catch

4. 【注意】：catch无法捕获在它后面出现的错误，案例1：

   ```js
   Promise.resolve()
   .catch(function(error) {
     console.log('oh no', error);
   })
   .then(function() {
     console.log('carry on');
     throw 'error';
   });
   // carry on
   ```

   * 案例2：resolve之后，在下一轮事件循环中抛错。那时候，**Promise 的运行已经结束了，**所以这个错误是在 Promise 函数体外抛出的，**会冒泡到最外层，成了未捕获的错误**

   ```js
   const promise = new Promise(function (resolve, reject) {
     resolve('ok');
     setTimeout(function () { throw new Error('test') }, 0)
   });
   promise.then(function (value) { console.log(value) });
   // ok
   // Uncaught Error: test
   ```

### 4-原型方法finally ###

* 在promise结束时，不管成功还是失败都将执行其`onFinally`回调

* 不接受任何参数，这意味着没有办法知道，前面的 Promise 状态到底是`fulfilled`还是`rejected`。这表明，`finally`方法里面的操作，与状态无关的，不依赖于 Promise 的执行结果

  ```javascript
  p.finally(function() {
    // 返回状态为(resolved 或 rejected)
  });
  // 等同于
  promise
  .then(
    result => {
      return result;
    },error => {
      throw error;
    }
  );
  ```

### 1-静态方法Promise.resolve : ###

* 接收一个值，将现有对象转为Promise 对象

>```js
>Promise.resolve('foo')
>// 等价于
>new Promise(resolve => resolve('foo'))
>```

#### 1、传参情况4种 ####

1. **参数是一个 Promise 实例**：`Promise.resolve`将原封不动地返回这个实例

2. **参数是一个原始值，或一个不具有`then()`方法的对象**：返回一个新的`resolved`的 Promise 对象

   ```js
   const p = Promise.resolve('Hello');
   
   p.then(function (s) {
     console.log(s)
   });
   // Hello
   ```

3. **参数是空**：直接返回一个`resolved`状态的 Promise 对象

   ```javascript
   const p = Promise.resolve();
   p.then(function () {
     // ...
   });
   ```

4. **参数是一个`thenable`对象：**`Promise.resolve()`将这个对象转为 Promise 对象，然后立即执行`thenable`对象的`then()`方法

   ```javascript
   let thenable = {
     then: (resolve, reject) => resolve(42);
   }
   
   let p1 = Promise.resolve(thenable);
   p1.then(function (value) {
     console.log(value);  // 42
   })
   ```

#### 2、执行顺序 ####

立即`resolve()`的 Promise 对象，是在本轮“事件循环”结束时执行，而不是在下一轮“事件循环”开始时

```javascript
//3.在下一轮“事件循环”开始时执行
setTimeout(function () {
  console.log('three');
}, 0);
//2. Promise.resolve()在本轮“事件循环”结束时执行
Promise.resolve().then(function () {
  console.log('two');
});
console.log('one');  //1. 立即执行
// one two  three
```

### 	2-静态方法Promise.reject :

* 返回一个失败的 promise 对象,直接改变promise状态

* `Promise.reject()`方法的参数，会原封不动地作为`reject`的理由，变成后续方法的参数

>```js
>const p = Promise.reject('出错了');
>// 等同于
>const p = new Promise((resolve, reject) => reject('出错了'))
>
>Promise.reject('出错了')
>.catch(e => {
>console.log(e === '出错了')
>})// true
>```

### 3-静态方法Promise.all :           

* iterable类型：代表可迭代对象，`Array`、`Map`和`Set`都属于`iterable`类型 
* 应用场景：有一个接口，需要其他两个或多个接口返回的数据作为参数时

```
Promise.all(iterable)
```

### 4-静态方法Promise.race :               

* 迭代对象中状态全部改变才会执行
* 只要迭代对象中有一个状态改变了，它的状态就跟着改变，并将那个改变状态实例的返回值传递给回调函数
* p1延时,开启了异步,内部正常是同步进行,所以`p2>p3>p1`,结果是`P2`

> ```js
> Promise.race(iterable)
> let p1 = new Promise((resolve, reject) => {
> setTimeout(() => {
>   	resolve('OK');
>  }, 1000);
> })
> let p2 = Promise.resolve('Success');
> let p3 = Promise.resolve('Oh Yeah');
> 
> const result = Promise.race([p1, p2, p3]);
> console.log(result);
> ```

## 3、Generaor ##

### 1、协程 ###

* 协程：多个线程互相协作，完成异步任务。它的运行流程大致如下：

  ```
  第一步，协程A开始执行。
  
  第二步，协程A执行到一半，进入暂停，执行权转移到协程B。
  
  第三步，（一段时间后）协程B交还执行权。
  
  第四步，协程A恢复执行。
  ```

  上面流程的协程A，就是异步任务，因为它分成两段（或多段）执行

#### 举例文件读取： ####

> ```javascript
> function asnycJob() {
> // ...其他代码
> var f = yield readFile(fileA);
> // ...其他代码
> }
> ```

* asyncJob 是一个协程，它的奥妙就在其中的 yield 命令。它表示执行到此处，执行权将交给其他协程。也就是说，yield命令是异步两个阶段的分界线
* 协程遇到 yield 命令就暂停，等到执行权返回，再从暂停的地方继续往后执行。它的最大优点，就是代码的写法非常像同步操作，如果去除yield命令，简直一模一样。

### 2、Generator 函数 ###

Generator 函数是**协程在 ES6 的实现**，是一种异步解决方案。最大特点就是可以交出函数的执行权（即暂停执行）

* 语法上，首先可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态
* Generator 函数除了状态机，还是一个遍历器对象生成函数
  * 可暂停函数, yield可暂停。next方法可启动
  * yield表达式本身没有返回值，或者说总是返回undefined
  * next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值

#### 运行方式举例 ####

```js
function *foo(x) {
  let y = 2 * (yield (x + 1))
  let z = yield (y / 3)
  return (x + y + z)
}
let it = foo(5)
console.log(it.next())   // => {value: 6, done: false}
console.log(it.next(12)) // => {value: 8, done: false}
console.log(it.next(13)) // => {value: 42, done: true}
```

代码分析：

* 首先 Generator 函数调用和普通函数不同，它会返回一个迭代器
* 当执行第一次 next 时，传参会被忽略，并且函数暂停在 yield (x + 1) 处，所以返回 5 + 1 = 6
* 当执行第二次 next 时，传入的参数12就会被当作上一个yield表达式的返回值，如果你不传参，yield 永远返回 undefined。此时 let y = 2 * 12，所以第二个 yield 等于 2 * 12 / 3 = 8

* 当执行第三次 next 时，传入的参数13就会被当作上一个yield表达式的返回值，所以 z = 13, x = 5, y = 24，相加等于 42

#### 文件读取举例 ####

* 有三个本地文件，分别1.txt,2.txt和3.txt，内容都只有一句话，**下一个请求依赖上一个请求的结果**，想通过Generator函数依次调用三个文件

```js
let fs = require('fs')
function read(file) {
  return new Promise(function(resolve, reject) {
    fs.readFile(file, 'utf8', function(err, data) {
      if (err) reject(err)
      resolve(data)
    })
  })
}
function* r() {
  let r1 = yield read('./1.txt')
  let r2 = yield read(r1)
  let r3 = yield read(r2)
  console.log(r1)
  console.log(r2)
  console.log(r3)
}
let it = r()
let { value, done } = it.next()
value.then(function(data) { // value是个promise
  console.log(data) //data=>2.txt
  let { value, done } = it.next(data)
  value.then(function(data) {
    console.log(data) //data=>3.txt
    let { value, done } = it.next(data)
    value.then(function(data) {
      console.log(data) //data=>结束
    })
  })
})
// 2.txt=>3.txt=>结束
```

* 手动迭代`Generator` 函数很麻烦，实现逻辑有点绕，而实际开发一般会配合 `co` 库去使用
* **`co`是一个为Node.js和浏览器打造的基于生成器的流程控制工具，借助于Promise，你可以使用更加优雅的方式编写非阻塞代码**

#### 安装co库后： ####

* npm install co，代码更简单

```js
function* r() {
  let r1 = yield read('./1.txt')
  let r2 = yield read(r1)
  let r3 = yield read(r2)
  console.log(r1)
  console.log(r2)
  console.log(r3)
}
let co = require('co')
co(r()).then(function(data) {
  console.log(data)
})
// 2.txt=>3.txt=>结束=>undefined
```

#### 回调地狱问题 ####

```js
function *fetch() {
    yield ajax(url, () => {})
    yield ajax(url1, () => {})
    yield ajax(url2, () => {})
}
let it = fetch()
let result1 = it.next()
let result2 = it.next()
let result3 = it.next()
```

### 3、优缺点 ###

#### 优点 ####

* 优雅的流程控制方式，可以让函数可中断执行，在某些特殊需求里还是很实用的

#### 缺点 ####

* Generator 函数的执行必须靠执行器，所以才有了 co 函数库，但co模块约定，yield命令后面只能是 Thunk 函数或 Promise 对象，只针对**异步处理来说，还是不太方便**

## 4、async、await ##

JS异步操作的最终且最优雅的解决方案

### 0、async/await带来了什么 ###

使用async/await，你可以轻松地达成之前使用生成器和co函数所做到的工作,它有如下特点：

#### 1、优点 ####

1. 内置执行器

   Generator 函数的执行必须靠执行器，所以才有了 co 函数库；

   而 `async` 函数自带执行器，也就是说，`async` 函数的执行，与普通函数一模一样，只要一行

2. 更好的语义、结构清晰

   `async` 和 `await`，比起 `*` 和 `yield`，语义更清楚了，几乎跟同步写法一样，十分优雅

   `async` 表示函数里有异步操作，`await` 表示紧跟在后面的表达式需要等待结果

3. 更广的适用性

   co 函数库约定，`yield` 命令后面只能是 Thunk 函数或 Promise 对象

   而 `async` 函数的 `await` 命令后面，可以跟 Promise 对象和原始类型的值(数值、字符串和布尔值，但这时等同于同步操作)

4. 更好的错误处理

   链式调用了很多promises，一级接一级。紧接着，promises链中某处出错。此链条的错误堆栈信息并没用线索指示错误到底出现在哪里

#### 2、缺点 ####

* 滥用 `await` 可能会导致性能问题

  因为 `await` 会阻塞代码，也许之后的异步代码并不依赖于前者，但仍然需要等待前者完成，导致代码失去了并发性

### 1、async返回值 ###

一个函数如果加上 **async** ，那么该函数就会**返回一个 Promise**：return的情况分析

* ##### 返回值为promise，状态和值取决于这个promise #####

  ```js
  async function fn() {
      return new Promise((resolve,reject) => {
          // 1
          // resolve(99);
          // 2
          reject(66); 
      })
  }
  // 1 新的promise状态成功,值为99
  // 2 新的promise状态失败,值为66
  ```

* ##### 函数返回非promise，则会被包装为一个立即resolve的Promise对象，值为返回的非promise值 #####

  ```js
  async function fn() {
      return 1;
  }
  console.log(fn()) // 成功promsie,值为1
  ```

* ##### 函数返回值为undefined.状态成功,值为undefined #####

  ```js
  async function fn() {
  }
  console.log(fn());//  成功promise,值为undefined
  ```

* ##### 函数体内抛出异常 #####

  ```js
  async function fn() {
      throw "异常";
  }
  console.log(fn()); // 失败promise,值为"异常";
  ```

### 2、await ###

#### 1、await在等什么？ ####

`await` **在等待一个异步完成**，等待的是一个表达式，这个表达式的计算结果是 Promise 对象或者其它值

* `await` 后面不是Promise对象，直接返回对应的值，效果等同于直接return

  ```js
  async function f() {
    return await 123;   // 等同于  return 123;
  }
  ```

* `await` 后面是Promise对象，会造成异步函数暂停执行先返回，并且等待 promise 的解决，**等到异步操作完成，再接着执行函数体内后面的语句**。所以**会阻塞后面的代码**

* `await`一个`thenable`对象（即定义了`then`方法的对象），`await`会将其等同于 Promise 对象

#### 2、为什么`await` 只能在 `async` 函数中使用 ####

* `await` 会阻塞后面代码，如果允许我们直接使用 `await` 的话，假如我们使用`await`等待一个消耗时间比较长的异步请求，那代码直接就阻塞不往下执行了，只能等待 `await` 拿到结果才会执行下面的代码，那不乱套了
* 而 `async` 函数调用不会造成阻塞，因为它内部所有的阻塞都被封装在一个 Promise 对象中异步执行，所以才规定 `await` 必须在 `async` 函数中

#### 3、await后面代码是微任务microtask ####

实际上**await是一个让出线程的标志**，因为async await 本身就是promise+generator的语法糖。所以await后面的代码是微任务microtask

* await后面的表达式会先执行一遍
* 将await后面的代码加入到微任务microtask中
* 然后就会跳出整个async函数来执行后面的代码

```js
async function async1() {
    console.log('async1 start'); // 2
    await async2();
  // 3.1 不会执行，添加到微任务
  // 5 真正执行是在微任务中执行
    console.log('async1 end'); 
}
async function async2() {
 console.log('async2'); //3
}
console.log('script start'); // 1
async1();
console.log('script end');//4
```

#### 4、读取文件的例子重写 ####

```js
let fs = require('fs')
function read(file) {
  return new Promise(function(resolve, reject) {
    fs.readFile(file, 'utf8', function(err, data) {
      if (err) reject(err)
      resolve(data)
    })
  })
}
async function readResult(params) {
  try {
    let p1 = await read(params, 'utf8')//await后面跟的是一个Promise实例
    let p2 = await read(p1, 'utf8')
    let p3 = await read(p2, 'utf8')
    console.log('p1', p1)
    console.log('p2', p2)
    console.log('p3', p3)
    return p3
  } catch (error) {
    console.log(error)
  }
}
readResult('1.txt').then( // async函数返回的也是个promise
  data => {
    console.log(data)
  },
  err => console.log(err)
)
// p1 2.txt
// p2 3.txt
// p3 结束
// 结束
```

### 3、处理异常 ###

#### 错误导致中断 ####

任何一个`await`后面的 **Promise 对象变为`reject`状态**，那么**整个`async`函数都会中断执行**

```js
async function f() {
  await Promise.reject('出错了');
  await Promise.resolve('hello world'); // 不会执行
}
```

#### catch ####

`await`命令后面的 Promise 对象如果变为`reject`状态，则`reject`的参数会被`catch`的回调接收

```js
async function f() {
  await Promise.reject('出错了');  //这里如果在await前面加上return，效果是一样的
}

f()
.then(v => console.log(v))
.catch(e => console.log('error',e))
// error 出错了
```

#### try...catch ####

```js
async function fn(){
  try{
    let res = await ajax()
    console.log(res)
  }catch(err){
    console.log(err)
  }
}
```

#### 总结： ####

假如希望即使前一个异步操作失败，也不要中断后面的异步操作：

* 方法1：第一个`await`放在`try...catch`结构里面。这样不管这个异步操作是否成功，第二个`await`都会执行
* 方法2：`await`后面的 Promise 对象再跟一个`catch`方法处理前面可能出现的错误

### 4、async/await继、并发、promise.all ###

#### 1、继发及其应用场景 ####

await本身是继发的

* 当函数执行的时候，一旦遇到`await`就会先返回，**等到异步操作完成，再接着执行函数体内后面的语句**，比较耗时
* 所以如果**多个异步代码没有依赖性**却使**用了 await 会导致性能上的降低**
* 因此，**代码没有依赖性的话，完全可以并发的方式**

**经常会遇到这种业务，多个请求，每个请求依赖于上一个请求的结果。**

* 用setTimeout模拟异步操作，用Promise和Async/Await分别来实现下

```js
function analogAsync(n) {
  return new Promise(resolve => {
    setTimeout(() => resolve(n + 500), n);
  });
}
function fn1(n) {
  console.log(`step1 with ${n}`);
  return analogAsync(n);
}

function fn2(n) {
  console.log(`step2 with ${n}`);
  return analogAsync(n);
}

function fn3(n) {
  console.log(`step3 with ${n}`);
  return analogAsync(n);
}
```

##### 使用Promise: #####

```js
function fn(){
  let time1 = 0
  fn1(time1)
    .then((time2) => fn2(time2))
    .then((time3) => fn3(time3))
    .then((res) => {
    	console.log(`result is ${res}`)
  	})
}
fn()
```

##### 使用async/await #####

* 输出效果一样，但代码结构看起来清晰得多，几乎跟同步写法一样，十分优雅

```js
async function fn() {
  let time1 = 0
  let time2 = await fn1(time1)
  let time3 = await fn2(time2)
  let res = await fn3(time3)
  console.log(`result is ${res}`)
}

fn()
```

#### 2、手动实现一个继发： ####

只有`getFoo`完成以后，才会执行`getBar`，完全可以让它们同时触发

```javascript
let foo = await getFoo();
let bar = await getBar();
```

* #### for循环实现 ####

  ```js
  async function dbFuc(db) {
    let docs = [{}, {}, {}];
  
    for (let doc of docs) {
      await db.post(doc);
    }
  }
  ```

* #### reduce实现 ####

  ```js
  async function dbFuc(db) {
    let docs = [{}, {}, {}];
  
    await docs.reduce(async (_, doc) => {
      await _;
      await db.post(doc);
    }, undefined);
  }
  ```

#### 3、并发实现 ####

`getFoo`和`getBar`都是同时触发，且没有依赖项，这样就会缩短程序的执行时间

* #### `Promise.all` ####

  ```js
  // 写法一
  let [foo, bar] = await Promise.all([getFoo(), getBar()]);
  
   async function dbFuc(db) {
    let docs = [{}, {}, {}];
    let promises = docs.map(doc => db.post(doc));
   
    let results = await Promise.all(promises);
    console.log(results);
  }
  ```

* #### 赋值操作 ####

  * getFoo函数本身是非阻塞的，赋值后**不会停在这里等待它的执行结果**

  * 而await getFoo()在promise有结果之前不会执行赋值操作，async内部代码在promise返回结果之前会阻塞住

    但整个主线程不会阻塞而是会执行async函数后面的同步代码，等promise有了结果且外面的同步代码执行完了就又会回到async函数原来阻塞的地方继续执行

  ```js
  // 写法二
  let p1 = getFoo();
  let p2 = getBar();
  let foo = await p1;
  let bar = await p2;
  ```

* #### forEach ####

  ```js
  function dbFuc(db) { //这里不需要 async
    let docs = [{}, {}, {}];
    let promises = docs.forEach(async doc => {
      await db.post(doc);
    });
    let results = [];
    for (let promise of promises) {
      results.push(await promise);
    }
    console.log(results);
  }
  ```

* #### Map ####

  虽然map方法的参数是async函数，但它是并发执行，因为只有async函数内部是继发执行，外部不受影响

  ```js
  async function dbFuc(db) {
    let docs = [{}, {}, {}];
    let promises = docs.map( async doc => db.post(doc));
  
    let results = [];
    for (let promise of promises) {
      results.push(await promise);
    }
    console.log(results);
  }
  ```

## 2.3、手写promise ##

#### 1、Promise的异步实现 ####

#### 2、promsie的链式调用 ####

1. **首先`then` 方法必须返回一个 `promise` 对象(划重点)**
   1. 在`then`方法中先实例化了一个Promise对象并返回，我们把原来写的代码放到该实例的处理器函数中
   2. 在每个执行函数处使用`try..catch`语法，try中`resolve`执行结果，catch中`reject`异常
   3. pending状态判断，逻辑也和resolved相似，但是由于此处为了处理异步，做了push操作，所以我们push时在onFulfilled和onRejected回调外面再套一个回调做操作即可
2. **如果`then`方法中返回的是一个普通值(如Number、String等)就使用此值包装成一个新的Promise对象返回**
3. 如果`then`方法中没有`return`语句，就返回一个用Undefined包装的Promise对象
4. 如果`then`方法中出现异常，则调用失败态方法(reject)跳转到下一个`then`的onRejected
5. **如果`then`方法没有传入任何回调，则继续向下传递(值穿透)**
6. 如果`then`方法中返回了一个Promise对象，那就以这个对象为准，返回它的结果

#### 3、根据上一个`then`方法的返回值来生成新Promise对象 ####

### 1、基本构成 ###

```js
function Promise(executor) {
  // 托管构造函数的this指向
  let _this = this
  // 状态描述 pending resolved rejected
  this.state = "pending"
  // 成功结果
  this.value = undefined
  // 失败原因
  this.reason = undefined
  //保存成功回调
  this.onResolvedCallbacks = []
  //保存失败回调
  this.onRejectedCallbacks = []

  // 让其处理器函数立即执行
  try {
    executor(resolve, reject)
  } catch (err) {
    reject(err)
  }
  function resolve(value) {
    // 判断当前态是否为pending，只有pending时可更该状态
    if (_this.state === "pending") {
      // 更改为成功态
      _this.state = "resolved"
      // 保存成功结果
      _this.value = value
      // 遍历执行成功回调
      _this.onResolvedCallbacks.forEach(fn => fn(value))
    }
  }

  function reject(reason) {
    // 判断当前态是否为pending，只有pending时可更该状态
    if (_this.state === "pending") {
      // 更改为失败态
      _this.state = "rejected"
      // 保存失败原因
      _this.reason = reason
      // 遍历执行失败回调
      _this.onRejectedCallbacks.forEach(fn => fn(reason))
    }
  }
}
```

### 2、then方法 ###

```js
// then原型方法
Promise.prototype.then = function(onFulfilled, onRejected) {
  // 判断参数不为函数时变成普通函数，成功-直接返回接收值 失败-抛出错误
  onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : err => {
          throw err
        }

  // 创建一个新的Promise实例
  let promise2 = new Promise((resolve, reject) => {
    // 等待态判断，此时异步代码还未走完，回调入数组队列
    if (this.state === "pending") {
      // 将成功回调push入成功队列
      this.onResolvedCallbacks.push(() => {
        // 使用queueMicrotask实现微任务
        queueMicrotask(() => {
          try {
            let x = onFulfilled(this.value)
            // 处理返回值
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      })

      // 将失败回调push入失败队列
      this.onRejectedCallbacks.push(() => {
        // 使用queueMicrotask实现微任务
        queueMicrotask(() => {
          try {
            let x = onRejected(this.reason)
            // 处理返回值
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      })
    }
    if (this.state === "resolved") {
      // 使用queueMicrotask实现微任务
      queueMicrotask(() => {
        try {
          let x = onFulfilled(this.value)
          // 处理返回值
          resolvePromise(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
    }
    if (this.state === "rejected") {
      // 使用queueMicrotask实现微任务
      queueMicrotask(() => {
        try {
          let x = onRejected(this.reason)
          // 处理返回值
          resolvePromise(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
    }
  })
  return promise2
}
```

### 3、解析then返回值与新Promise对象 ###

```js
/**
 * 解析then返回值与新Promise对象
 * @param {Object} 新的Promise对象，就是我们创建的promise2实例
 * @param {*} x 上一个then的返回值
 * @param {Function} resolve promise2处理器函数的resolve
 * @param {Function} reject promise2处理器函数的reject
 */
function resolvePromise(promise2, x, resolve, reject) {
  // 解决循环引用报错
  if (promise2 === x) {
    // reject报错
    reject(new TypeError("请避免Promise循环引用"))
  }

  // 定义状态-防止多次调用
  let called
  // x不是null 且x是对象或函数
  if (x != null && (typeof x === "object" || typeof x === "function")) {
    try {
      // 拿到x的then方法
      let then = x.then
      // 如果then是函数，就默认是promise
      if (typeof then === "function") {
        // 执行then 使用call传递this 第一个参数是this 后面是成功的回调 和 失败的回调
        then.call(
          x,
          y => {
            // 成功和失败只能调用一个
            if (called) return
            called = true
            // 防止用户在resolve的时候传入Promise，递归调用
            resolvePromise(promise2, y, resolve, reject)
          },
          err => {
            // 成功和失败只能调用一个
            if (called) return
            called = true
            reject(err)
          }
        )
      } else {
        resolve(x)
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    resolve(x)
  }
}
```

### 4、catch、resolve、reject方法 ###

```js
// catch原型方法
Promise.prototype.catch = function(onRejected) {
  // 直接执行then方法，onFulfilled为null，传入onRejected
  return this.then(null, onRejected)
}

// resolve方法
Promise.resolve = function(val) {
  // 直接抛出一个成功状态的Promise
  return new Promise((resolve, reject) => {
    resolve(val)
  })
}

// reject方法
Promise.reject = function(val) {
  // 直接抛出一个拒绝状态的Promise
  return new Promise((resolve, reject) => {
    reject(val)
  })
}
```

### 5、all方法             ###

```js
// all方法
Promise.all = function(promises) {
  // 只有一个目的 获取到所有的promise，都执行then，把结果放到数组，一起返回
  // 用于存放每次执行后返回结果
  let results = []
  let promiseCount = 0;
	let promisesLength = promises.length;
  return new Promise(function(resolve, reject) {
    for (let i=0;i< promises.length;i++) { // 使用let保证promise顺序执行
      // Promise.resolve：因为数组中的可能不是promise实例，没有then方法
			Promise.resolve(promises[i]).then(res => {
          results[i] = res;
          promiseCount++;
          // 当所有函数都正确执行了，resolve输出所有返回结果
          if (promiseCount === promisesLength)  resolve(results);
      	}, err => {
          reject(err);
        })
     }
    });
};
```

```js
var p1 = new Promise(resolve=>{
 	setTimeout(()=>{
    return resolve(3)
  },1000)})
 );
var p2 =Promise.resolve(1);
var p3 =Promise.resolve(2);
var p = Promise.all([p1,p2,p3]);
p.then(e=>{console.log(e)});
```

### 6、race方法 ###

```js
// race方法
Promise.race = function(promises) {
  // return一个Promise
  return new Promise((resolve, reject) => {
    // 遍历执行promises
    for (let i = 0; i < promises.length; i++) {
      // then只要接收到状态改变，直接抛出
      promises[i].then(resolve, reject)
    }
  })
}
```

## 2.4、手写Promise.all、allsettled ##

### 1、使用all： ###

* iterable类型：代表可迭代对象，`Array`、`Map`和`Set`都属于`iterable`类型 

* 应用场景：有一个接口，需要其他两个或多个接口返回的数据作为参数时

  ```
  Promise.all(iterable)
  ```

* 当需要处理多个Promise并行时，大多数情况下Promise.all用起来是非常顺手的

  ```js
  const delay = n => new Promise(resolve => setTimeout(resolve, n));
  
  const promises = [
    delay(100).then(() => 1),
    delay(200).then(() => 2),
    ]
  
  Promise.all(promises).then(values=>console.log(values))
  // 最终输出： [1, 2]
  ```

* 可是，是一旦有一个promise出现了异常，被reject了，情况就会变的麻烦。

  问题1：任意一个 promise 被 reject ，Promise.all 就会立即被 reject ，其他执行成功的Promise的消息都丢失了

  问题2：大多数场景中，我们期望传入的这组 promise 无论执行失败或成功，都能获取每个 promise 的执行结果

  ```js
  const delay = n => new Promise(resolve => setTimeout(resolve, n));
  const promises = [
    delay(100).then(() => 1),
    delay(200).then(() => 2),
    Promise.reject(3)
    ]
  
  Promise.all(promises).then(values=>console.log(values))
  // 最终输出： Uncaught (in promise) 3
  
  Promise.all(promises)
  .then(values=>console.log(values))
  .catch(err=>console.log(err))  // 加入catch语句后，最终输出：3
  ```

### 2、手写Promise.all ###

* 将多个Promise 实例**包装成一个新的 Promise实例**，参数为一组 **Promise 实例组成的数组**

* 只有所有的 promise `都成功才成功`, 只要有一 个失败了就直接失败

* promsie.all的痛点：一旦有一个promise出现了异常，被reject了，情况就会变的麻烦。

  ```js
  // all方法: 只有一个目的 获取到所有的promise，都执行then，把结果放到数组，一起返回
  const PromiseAll = promises => {
    if (!promises.length) return Promise.resolve([]);
  	const newPromises = promises.map(item => {
      return item instanceof Promise ? item :  Promise.resolve(item);
    })
    
    const results = []; // 用于存放每次执行后返回结果
    let promiseCount = 0;
    let promiseLen = newPromises.length;
    
    return new Promise((resolve, reject) => {
      for (let i=0; i < promiseLen; i++) { // 使用let保证promise顺序执行
        // Promise.resolve：因为数组中的可能不是promise实例，没有then方法
  				newPromises[i].then(value => {
          	results[i] = {
              status: 'fulfilled',
              value
            }
            promiseCount++;
            // 当所有函数都正确执行了，resolve输出所有返回结果
            if (promiseCount === promiseLen)  resolve(results);
        	}).catch(err => {
             results[i] = {
                status: 'rejected',
                err
       				}
      				reject(results);
          })
       }
      });
  };
  ```

  ```js
  const delay = n => new Promise(resolve => setTimeout(resolve, n));
  const promises = [
    delay(100).then(() => 1),
    delay(200).then(() => 2),
    Promise.reject(3)
    ]
  
  PromiseAll(promises).then(values=>console.log(values))
  .catch(err=> console.log(err+' 捕获的错误'))//不然会报错走不下去
  ```

### 3、使用allsettled ###

* 返回的新 Promise 实例，一旦结束，状态总是 fulfilled，不会变成 rejected

* 使用场景：

  不关心异步操作的结果，只关心这些操作有没有结束时，这个方法会比较有用。

  ```js
  const promises = [
    delay(100).then(() => 1),
    delay(200).then(() => 2),
    Promise.reject(3)   //拒绝
    ]
  Promise.allSettled(promises).then(values=>console.log(values))
  // 最终输出： 
  //    [
  //      {status: "fulfilled", value: 1},
  //      {status: "fulfilled", value: 2},
  //      {status: "rejected", value: 3},
  //    ]
  ```

### 4、手写allsettled ###

* 即使是遇到rejec也会等待所有的promise到最后。所以我们只需要用一个array记录各个promise的fulfill或者reject结果即可

  ```js
  const PromiseAllSettled = function(promises) {
    if (!promises.length) return Promise.resolve([]);
  	const newPromises = promises.map(item => {
      return item instanceof Promise ? item :  Promise.resolve(item);
    })
    
    const results = []; // 用于存放每次执行后返回结果
    let promiseCount = 0;
    let promiseLen = newPromises.length;
    
    return new Promise((resolve, reject) => {
      for (let i=0; i < promiseLen; i++) { // 使用let保证promise顺序执行
        // Promise.resolve：因为数组中的可能不是promise实例，没有then方法
  				newPromises[i].then(value => {
          	results[i] = {
              status: 'fulfilled',
              value
            }
            promiseCount++;
            if (promiseCount === promiseLen)  resolve(results);
        	}).catch(err => {
             results[i] = {
                status: 'rejected',
                err
       				}
             promiseCount++;
           	 if (promiseCount === promiseLen)  resolve(results);
          })
       }
      });
  };
  ```

### 5、race实现 ###

* 最早改变状态）resolve或reject时，就改变自身的状态，并执行响应的回调。

* 跟all同样对于错误的不能处理。

  ```js
  const PromiseRace = function(promises) {
    if (!promises.length) return Promise.resolve([]);
  	const newPromises = promises.map(item => {
      return item instanceof Promise ? item :  Promise.resolve(item);
    })
    
    let promiseLen = newPromises.length;
    
    return new Promise((resolve, reject) => {
      for (let i=0; i < promiseLen; i++) {
  				newPromises[i].then(value => {
            resolve({
              status: 'fulfilled',
              value
            });
        	}).catch(err => {
            reject({
                status: 'rejected',
                err
       			});
          })
       }
      });
  };
  ```

## 5、实现promisify化 ##

### 1、概念 ###

* `promisify`是node的utils模块中的一个函数

* 作用：**将一种函数**（最后一个参数是回调函数的函数，且回调函数中有两个参数：`error` 和 `data`）**转换为promise函数**

  ```js
  // 使用前
  fs.readFile('./index.js', (err, data) => {
     if(!err) {
         console.log(data.toString())
     }
     console.log(err)
  })
  // 使用promisify后
  const readFile = promisify(fs.readFile)
  readFile('./index.js')
     .then(data => {
         console.log(data.toString())
     })
     .catch(err => {
         console.log('error:', err)
     })
  ```

### 2、实现 ###

```js
const newFn = promisify(fn)
newFn(a) // 会执行Promise参数方法
```

```js
const promisify = (func) => {
  return (ctx) => {
    let args = Array.prototype.slice.call(arguments, 1);
    
    return new Promise((resolve, reject) => {
      // 除了调用时的传参，还需要提供一个callback函数来供异步方法调用
      const callback = () => {
        return (err, res) => {
           if (err) return reject(err);
           return resolve(res);
        }
      }
      args.push(callback());
      func.apply(ctx, args);
    })
  }
}
```