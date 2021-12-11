---
title: 函数- call、apply、bind
date: 2021-12-11 00:53:00
tags: JS
categories: JS
description: '箭头函数出现之前解决this的丢失方案'
cover: https://images.unsplash.com/photo-1638977557338-15b7774688d5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMDZ8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60
---
### call、apply、bind √ ###

#### 1、使用上 ####

* 传参

  ```js
  // 参数列表， call与apply的区别就是传参形式不同
  fun.call(thisArg, param1, param2, ...)
  fun.bind(thisArg, param1, param2, ...)
  
  // 第2个参数必须是数组
  fun.apply(thisArg, [param1,param2,...])
  ```

* 返回值

  call/apply：`fun`执行的结果，改变this上下文后马上执行该函数

  bind：返回`fun`的拷贝，不执行函数，并指定了fun的this指向，保存了fun的参数

* `thisArg`

  ```
  thisArg的值为null/undefined时，非严格模式下，fun中的this指向window对象，严格模式下，fun的this值为undefined
  thisArg的值为原始值时，fun的this指向该原始值的包装对象，如 String、Number、Boolean
  ```

* 这3个方法的调用者必须是函数，它们是挂载在Function对象上的3个方法，只有函数才有这些方法

#### 2、功能上 ####

* 改变函数执行时的this指向
* 带来的好处：可以将任意对象设置为任意函数的作用域，这样对象就不用关心方法，而是**借用方法**

#### 3、apply/call的应用场景： ####

##### 1、判断数据类型 #####

为了每个对象都能通过 `Object.prototype.toString()` 来检测，需要以 `Function.prototype.call()` 或者 `Function.prototype.apply()` 的形式来调用，传递要检查的对象作为第一个参数，称为 `thisArg`。

```js
var toString = Object.prototype.toString;

toString.call(new Date); // 	[object Date]
toString.call(new String); // [object String]
toString.call(Math); // 			[object Math]
toString.call(undefined); // 	[object Undefined]
toString.call(null); // 			[object Null]
```

##### 2、类数组借用数组的方法 #####

```js
var arrayLike = {
  0: 'OB',
  1: 'Koro1',
  length: 2
}
Array.prototype.push.call(arrayLike, '添加元素1', '添加元素2');
console.log(arrayLike)
//{"0":"OB","1":"Koro1","2":"添加元素1","3":"添加元素2","length":4}
```

##### 3、apply获取数组最大值最小值 #####

```
const arr = [15, 6, 12, 13, 16];
const max = Math.max.apply(Math, arr); // 16
const min = Math.min.apply(Math, arr); // 6
```

##### 4、继承 #####

在子类构造函数中，通过`apply/call`借用父类构造函数中的属性，并可传参

#### 4、bind的应用场景 ####

##### 1、保存函数参数 #####

原理：bind会返回一个函数，它保存了函数的this指向、初始参数，所以每次i的变量会被bind保存

```js
for(var i = 1; i <= 5; i++) {
     setTimeout(function(i) {
        console.log(i);
    }.bind(null, i)，i*1000)
}
```

##### 2、绑定this指向，用做回调函数，解决回调函数this丢失问题 #####

#### 5、手写call ####

* 获取方法的调用者，通过this拿到，因为函数myCall内部的this指向的是调用者
* 其次，拿到谁调用这个函数，其实就是传参的第一个，也就是context上下文
* 为上下文context添加这个属性，属性值就是这个函数，让其具备该函数的功能，使用该功能
* 使用完，删除该属性，不能改变其上下文

```js
Function.prototype.myCall = function (context, ...arr) {
  if (this === Function.prototype) {
  	return undefined; // 用于防止 Function.prototype.myCall() 直接调用
  }
  if (context === null || context === undefined) {
    context = window // 指定为 null/undefined时this指向全局对象(浏览器中为window)
  } else {
     //1.Object():将值为原始值（数字字符串布尔值）包装成对象
      context = Object(context)
  }
  const testFn = Symbol();  // 保证属性不会出现同名覆盖的情况
  context.testFn = this;  //添加属性this, this就是调用call的那个函数
  let result = context.testFn(...arr); 
  delete context.testFn;  // 删除上下文对象的属性
  // 若不删除，result：[ 12, 8, 4, 6, 7, testFn: [Function: push] ]
  return result; 
};

let arr1 = [12,8]，;let arr2 = [4, 6];
Array.prototype.push.myCall(arr1,4,6,7)
console.log(arr1) // [ 12, 8, 4, 6, 7 ]
```

注意：

```js
// 判断函数上下文绑定到`window`不够严谨
context = context ? Object(context) : window; 
context = context || window; 
// 会导致：本应该绑定到原始值的实例对象上，却绑到window上
handle.elseCall('') // window  
handle.elseCall(0) // window
handle.elseCall(false) // window
```

#### 6、手写Apply ####

* 与call大致相同，但参数形式不一样；增加了类数组的判断

```js
Function.prototype.myApply = function (context) {
  if (this === Function.prototype) {
    return undefined; // 用于防止 Function.prototype.myCall() 直接调用
  }
  if (context === null || context === undefined) {
      context = window 
  } else {
      context = Object(context) 
  }
  // JavaScript权威指南判断是否为类数组对象
  function isArrayLike(o) {
      if (o &&                                    // o不是null、undefined等
          typeof o === 'object' &&                // o是对象
          isFinite(o.length) &&                   // o.length是有限数值
          o.length >= 0 &&                        // o.length为非负值
          o.length === Math.floor(o.length) &&    // o.length是整数
          o.length < 4294967296)                  // o.length < 2^32
          return true
      else
          return false
  }
  context.testFn = this; // 隐式绑定this指向到context上
  const args = arguments[1]; // 获取参数数组
  let result
  // 处理传进来的第二个参数
  if (args) {
      // 是否传递第二个参数
      if (!Array.isArray(args) && !isArrayLike(args)) {
          throw new TypeError('myApply 第二个参数不为数组并且不为类数组对象抛出错误');
      } else {
          args = Array.from(args) // 转为数组
          result = context.testFn(...args); // 执行函数并展开数组，传递函数参数，注意要展开
      }
  } else {
      result = context.testFn(); // 执行函数
  }
  delete context.testFn; // 删除上下文对象的属性
  return result; 
}
```

#### 7、手写bind： ####

* bind() 方法会创建一个新函数。当这个新函数被调用时，**bind() 的第一个参数将作为它运行时的 this**，之后的一序列参数将会在传递的实参前传入作为它的参数

  ```js
  Function.prototype.myBind = function (context,...args1) {
    if (this === Function.prototype) throw new TypeError('Error');
    
    const _this = this   // _this就是bind函数的调用者
    // bind函数的调用后，返回一个新函数,既可以new，也可以直接调用
    function F(...args2) {
      // 判断是否用于构造函数
      // this是F的调用者，当它是普通调用时this指向函数调用者，
      // 做构造函数时指向那个实例对象 context
      context = this instanceof F? this: Object(context);
      return _this.apply(context, args1.concat(args2))
    }
    F.prototype = Object.create(_this.prototype) //弄个中间值
    return F;
  }
  
  var value = 'v in window';
  var obj = {value: 'v in obj'};
  function func() {
    console.log(this.value);
  }
  var newFunc = func.bind(obj,1,2,3);
  newFunc(4,5,6); 
  ```