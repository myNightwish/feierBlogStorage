---
title: 对象 - new操作符
tags: JS
categories: JS
description: new 一个对象的过程都发生了什么？注意与class有区别喔
cover: >-
  https://images.unsplash.com/photo-1638824886045-783ca980bf11?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80
abbrlink: 3912543564
date: 2021-12-11 02:03:01
---
### new操作符 ###

#### 1、内部做了什么 ####

    1. 在内存中创建一个对象
    2. 这个新对象内部的[prototype]特性会被赋值为构造函数的prototype属性
    3. 构造函数内部的this被赋值为这个新对象，即this指向新对象
    4. 执行构造函数内部的代码，给对象添加属性
    5. 如果构造函数返回非空对象，就返回该对象，否则就返回刚创建的新对象（判断）

```js
function Person(name, age) {
    this.name = name;
    this.age = age;
}
```

#### 2、实现 ####

```js
function myNnew(F,...arg){
  //1. 创建新对象
  let obj = {}  // 或new Object()
  //2. __proto__指向原型
  obj.__proto__ = F.prototype
  //3. this指向新对象，执行构造函数F中的代码
  let result = F.call(obj, arg)
  //4. 判断
  if(typeof result === "Object"){
    return result
  } else {
    return obj
  }
}
```
