---
title: 函数- setTimeout、setInterval
tags: JS
categories: JS
description: 定时器坑真多，用着用着就掉沟里去了
cover: >-
  https://images.unsplash.com/photo-1639077567163-f5bcf1c94d06?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80
abbrlink: 2747544176
date: 2021-12-11 00:57:07
---


### setTimeout / setInterval ###

#### 1、setTimeout  ####

##### 1、使用规则： #####

```js
var timeoutID = scope.setTimeout(function[, delay, arg1, arg2, ...]);
var timeoutID = scope.setTimeout(function[, delay]);
var timeoutID = scope.setTimeout(code[, delay]);
```

* delay：延迟的毫秒数，如果省略该参数，默认值0，意味着“马上”执行，或者尽快执
* `arg1, ..., argN` **可选**：附加参数，一旦定时器到期，它们会作为参数传递给`function`
* code：可选语法，可以使用字符串而不是函数，但不推荐
* 返回值：`timeoutID`是一个正整数，表示定时器的编号。可以传递给`clearTimeout()`取消该定时器。

##### 2、this问题： #####

* `setTimeout()`调用的代码运行在与所在函数完全分离的执行环境上。这会导致，这些代码中包含的 `this` 在非严格模式会指向 `window` (或全局)对象，严格模式下为 undefined

  ```js
  let myArray = ["zero", "one", "two"];
  myArray.myMethod = function (sProperty) {
      alert(arguments.length > 0 ? this[sProperty] : this);
  };
  
  myArray.myMethod(); // prints "zero,one,two"
  myArray.myMethod(1); // prints "one"
  
  setTimeout(myArray.myMethod, 1000); //  "[object Window]"
  setTimeout(myArray.myMethod, 1500, "1"); //"undefined"
  ```

* 解决方法1：用包装函数来设置`this`：

  ```js
  setTimeout(function(){myArray.myMethod()}, 2000); //"zero,one,two"
  setTimeout(function(){myArray.myMethod('1')}, 2500); // "one" 
  ```

* 解决方法2：箭头函数

  ```js
  setTimeout(() => {myArray.myMethod()}, 2000); //"zero,one,two" 
  setTimeout(() => {myArray.myMethod('1')}, 2500); // "one"
  ```

* 解决方法3：bind显式地指定函数调用时 this 所指向的值 。解决 this 指向不确定的问题。

  ```js
  let myArray = ['zero', 'one', 'two'];
  myBoundMethod = (function (sProperty) {
      console.log(arguments.length > 0 ? this[sProperty] : this);
  }).bind(myArray);
  
  myBoundMethod(); // "zero,one,two"
  myBoundMethod(1); // "one"
  setTimeout(myBoundMethod, 1000); //  "zero,one,two"
  setTimeout(myBoundMethod, 1500, "1"); //"one" 
  ```

#### 2、setInterval ####

```js
var intervalID = scope.setInterval(func, delay, [arg1, arg2, ...]);
 // func:该函数不接受任何参数，也没有返回值。
 // [..arg1, arg2,...] 当定时器过期的时候，将被传递给func指定函数的附加参数
var intervalID = scope.setInterval(code, delay);
var intervalID = setInterval(myCallback, 500, 'Parameter 1', 'Parameter2');
```

【注意】：

1. func函数不能传参：如果需要传递参数,可以使用闭包返回一个函数

   ```js
   setInterval(test,1000);    // 正常 每秒打印1次
   setInterval(test(),1000);   // test已经同步调用，只会打印一次1
   setInterval("test()",1000);  //每秒打印1次，
   function test(){  console.log(1)   }
   ```

2. 需要使用`clearInterval`清除定时器,防止定时器一直执行下去,同时也需要手动释放内存

3. `this`指向问题

#### 3、setTimeout模拟setInterval ####

##### setInterval的执行机制 #####

* `setTimeout` 会将当前异步任务推入队列（`setTimeout`本身就是一次调用一次执行），而 `setInterval` 则会在任务**推入异步队列时判断上次异步任务是否被执行。**
* 这就导致 `setInterval` 在做**定时轮训时，出现耗时操作，或者调用的异步操作耗时**会导致异步任务**不按照期待的时间间隔**执行。

##### 版本1：无法清除啊，停不下来 #####

```js
const mySetInterval = (func, delay) => {
  const interval = () => {
    // 执行原本逻辑func
    func();
    setTimeout(interval, delay);
  }
  setTimeout(interval, delay);
}
```

##### 版本2：保存id来清除 #####

* 执行 `mySetInterval` 的时候返回的 `id` 依然不是最新的 `timeId`。因为 `timeId` 只在 `fn` 内部被更新了，在外部并不知道它的更新,注意内层、外层的也有清除
* 由于 `timeId` 是`Number`类型，这样使用拿到的是**全局变量 `timeId` 的值拷贝而不是引用**，

```js
const mySetInterval = (func, delay) => {
  let timeId = null;
  const interval = () => {
    // 执行原本逻辑func
    func();
    timeId = setTimeout(interval, delay);
  }
  timeId = setTimeout(interval, delay);
  return timeId;
}
```

##### 版本3：闭包 #####

```js
const mySetInterval = (func, delay, ...args) => {
  const interval = () => {
    func(...args);
    timeId = setTimeout(interval, delay,...args);
  }
  timeId = setTimeout(interval, delay, ...args);
  return {
    cancel:()=>{
      clearTimeout(timeId)
    }
  }
}

let a=mySetInterval((...args)=>{
  console.log(...args);
}, 1000, 'hello')
let b=mySetInterval((...args)=>{
  console.log(...args);
}, 1000, 'world')
```