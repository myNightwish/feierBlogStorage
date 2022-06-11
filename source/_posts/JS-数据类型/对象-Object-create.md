---
title: 对象 - Object.create
tags: JS
categories: 1.2-JS
description: Object.create用途、实现
cover: >-
  https://images.unsplash.com/photo-1638990590633-f67f3a8dbed5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMzZ8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60
abbrlink: 775935900
date: 2021-12-11 01:43:18
---

### Object.create() ###

#### 1、参数1：对象、null ####

* 如果对象的属性是基本类型，二者互不影响。如果对象的属性值是**引用类型，会互相影响**，因为只传一个参数的情况下本质就是浅复制

  ```js
  const me = Object.create(person); 
  me 会继承person的所有属性和方法，me.__proto__ === person为true
  me 可以自己添加新属性和方法，也可将继承过来的属性重写，二者互不影响
  ```

* 创造一个没有原型的空对象

  ```js
  const my = Object.create(null);
  此时my就是彻底的空对象，没有继承Object.prototype上的任何属性和方法，如hasOwnProperty()、toString()
  my instanceof Object  // false
  my.__proto__ === person // false
  ```

#### 2、参数2：可选 ####

指定要添加到新对象上的可枚举的属性描述符、属性名称

```js
var bb = Object.create(null, {
    a: {
        value: 2,
        writable: true,
        configurable: true
    }
});
console.dir(bb); // {a: 2}
console.log(bb.__proto__); // undefined
console.log(bb.__proto__ === Object.prototype); // false
console.log(bb instanceof Object); 
// false 没有继承`Object.prototype`上的任何属性和方法，所以原型链上不会出现Object
```

#### 3、实现 ####

```js
Object.mycreate = function(proto, properties) {
    function F() {};
    // 关键：新生成的对象的__proto__指向参数1proto
    F.prototype = proto;
    // 如果有第2参数
    if(properties) {
        Object.defineProperties(F, properties);
    }
    return new F();
}
```
