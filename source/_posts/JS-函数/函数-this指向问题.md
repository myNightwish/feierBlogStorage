---
title: 函数- this指向问题
tags: JS
categories: 1.2-JS
description: this的4大指向归纳
cover: >-
  https://images.unsplash.com/photo-1633113088942-99089f4abffa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMTZ8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60
abbrlink: 1207877865
date: 2021-12-11 00:54:28
---

### this指向问题 ###

一句话总结：**`this`指向的是函数运行时的所在的环境对象**，它的绑定机制，就是要找到这个函数的直接调用位置，然后应用绑定的四条规则，当出现满足多个规则时，按照优先级的高低决定最终的绑定规则

#### new > 显式绑定 > 隐式绑定 > 默认绑定 ####

#### 1、`new` 绑定 ####

* new操作符创建的新对象

#### 2、显式绑定 ####

当想绑定指定的对象，用call/apply/bind：null、undefined时为window，否则是调用他们的那个函数

```js
function foo() { 
    console.log(this.a);
}
var a = 2;
var obj1 = { 
    a: 3,
};
var obj2 = { 
    a: 4,
};
var bar = function(){
		console.log(this.a);
    foo.call(obj1);
}
setTimeout(bar, 100); //2  3
bar.call(obj2); //4 3 
```

* 虽然`bar`被显示绑定到`obj2`上，对于`bar`，`function(){…}` 中的`this`确实被绑定到了`obj2`
* 而`foo`因为通过`foo.call(obj1)`已经显示绑定了`obj1`，所以在`foo`函数内，`this`指向的是`obj1`，不会因为`bar`函数内指向`obj2`而改变自身。所以打印的是`obj1.a`（即3）。

#### 3、隐式绑定 ####

函数的调用是在某个对象上触发的，指向这个对象

```js
function thisTo(){
   console.log(this.a);
}
var data={
    a:2,
    foo:thisTo //通过属性引用this所在函数 
};
data.foo(); //2
```

#### 4、默认绑定 ####

将全局对象绑定 `this` 上

* 全局函数调用、变量访问：指向window，严格模式undefined

####  5、this绑定的特殊情况 ####

##### 1. 隐式丢失 #####

当进行隐式绑定时，**如果进行一次引用赋值或者传参操作，会造成this的丢失**，从而最后将this绑定到全局对象中去。

* 引用赋值丢失

  ```js
  function thisTo(){
     console.log(this.a);
  }
  var obj={
      a:2,
      foo:thisTo //通过属性引用this所在函数 
  };
  var a=3;//全局属性
  
  var bar=obj.foo; //这里进行了一次引用赋值 
  bar(); // 3
  // 2种写法一样的结果
  var bar;
  (bar=obj.foo)();
  ```

  因为bar实际上引用的是foo函数本身，跟obj对象没有任何关系,obj对象只是一个中间桥梁。而bar就是一个本身不带a属性的对象，自然最后只能把a绑定到全局对象上了

* 函数传参丢失

  ```js
  function thisTo(){
     console.log(this.a);
  }
  var data={
      a:2,
      foo:thisTo //通过属性引用this所在函数 
  };
  var a=3;//全局属性
  setTimeout(data.foo,100);// 3
  ```

  setTimeout(fn,delay) { fn(); } 实际上fn是一个参数传递的引用(fn=data.foo)，与引用丢失原理一样

bind：**为了解决隐式丢失的问题，ES5提供了bind方法，把参数设置为this的上下文并调用原始函数**

```js
function thisTo(){
   console.log(this.a);
};
var data={
    a:2
}; 
var a=3;
var bar=thisTo.bind(data);
console.log(bar()); //2
```

##### 2. 间接引用 #####

一个定义对象的方法引用另一个对象存在的方法，这种情况下会使得this进行默认绑定

```js
function thisTo(){
   console.log(this.a);
}
var data={
  a:2,
  foo:thisTo
};
var newData={
  a:3
}
var a=4;
data.foo(); //2
(newData.foo=data.foo)() //4
```

newData.foo=data.foo的返回值是目标函数的引用，因此调用的位置实际上是foo(),根据之前的隐式丢失里面说的原则，这里会应用默认绑定

####  6、改变this的方法 ####

* call/bind/apply改变this指向
* 通过对象的方法来定义一个函数：this指向实例化对象
* new：构造函数被new了，创建了新对象，构造函数内部的this会指向该

