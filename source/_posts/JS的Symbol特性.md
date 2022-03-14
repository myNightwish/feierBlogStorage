---
title: JS的Symbol特性
tags: JS
categories: JS
description: symbol解决了什么
cover: >-
  https://images.unsplash.com/photo-1639084695940-40546c3262c2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80
abbrlink: 1405183845
date: 2021-12-10 23:11:22
---

### 4、补充Symbol ###

* `ES6`中新加入的一种原始类型，每个从Symbol()返回的symbol值都是唯一的。
* 一个symbol值能作为对象属性的标识符；这是该数据类型仅有的目的

#### 特性1：独一无二 ####

* 直接使用`Symbol()`创建新的`symbol`变量，可选用一个字符串用于描述。当参数为对象时，将调用对象的`toString()`方法


```js
var sym1 = Symbol();  // Symbol() 
var sym2 = Symbol('ConardLi');  // Symbol(ConardLi)
var sym3 = Symbol('ConardLi');  // Symbol(ConardLi)
var sym4 = Symbol({name:'ConardLi'}); // Symbol([object Object])
console.log(sym2 === sym3);  // false
```

* 如果我们想创造两个相等的`Symbol`变量，可以使用`Symbol.for(key)`。

> 使用给定的key搜索现有的symbol，如果找到则返回该symbol。否则将使用给定的key在全局symbol注册表中创建一个新的symbol

```js
var sym1 = Symbol.for('ConardLi');
var sym2 = Symbol.for('ConardLi');
console.log(sym1 === sym2); // true
```

#### 特性2：原始类型 ####

注意是使用`Symbol()`函数创建`symbol`变量，并非使用构造函数，使用`new`操作符会直接报错。

```js
new Symbol(); // Uncaught TypeError: Symbol is not a constructor
```

使用`typeof`运算符判断一个`Symbol`类型：

```js
typeof Symbol() === 'symbol'
typeof Symbol('ConardLi') === 'symbol'
```

#### 特性3：不可枚举 ####

* 使用`Symbol`作为对象属性时，可以保证对象不会出现重名属性
* 调用`for...in`、`Object.getOwnPropertyNames、Object.keys()`不能获取`Symbol`属性

* 可以调用Object.getOwnPropertySymbols()用于专门获取Symbol属性，会变成一个数组集


```js
var obj = {
  name:'ConardLi',
  [Symbol('name2')]:'code秘密花园'
}
Object.getOwnPropertyNames(obj); // ["name"]
Object.keys(obj); // ["name"]
for (var i in obj) {
   console.log(i); // name
}
Object.getOwnPropertySymbols(obj) // [Symbol(name)]
```

#### 2、应用场景 ####

##### 1、应用一：防止XSS #####

* 在React中，我们所写的JSX实际上是babel 解析时，调用React.createElement，转换成 `ReactElement`对象

* 这个对象里，有type、props、key、ref属性，还有一个`$$typeof`属性，就是在这个过程中添加的：它是一个`Symbol`类型的变量，值为变量 REACT_ELEMENT_TYPE

  * 如果当前浏览器支持 Symbol ，则 `REACT_ELEMENT_TYPE `为 Symbol 类型的变量，否则为 16 进制的数字

    ```js
    var REACT_ELEMENT_TYPE =
      (typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element')) ||
      0xeac7;
    ```

* `React`渲染时会把没有`$$typeof`标识，以及规则校验不通过的组件过滤掉，通过`ReactElement.isValidElement`函数用来判断一个React组件是否是有效的

  ```js
  ReactElement.isValidElement = function (object) {
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  };
  ```

**添加这个属性的意义： **           安全

基于以下几个共识：

1. 数据库是不能存储`Symbol`类型的变量，所以用户恶意存入的数据是无法带有合法的 `$$typeof`字段的
2. 如果你的服务器有一个漏洞，允许用户存储任意`JSON`对象， 而客户端代码需要一个字符串，这可能会成为一个问题：

```js
// JSON
let expectedTextButGotJSON = {
  type: 'div',
  props: {
    dangerouslySetInnerHTML: {
      __html: '/* put your exploit here */'
    },
  },
};
let message = { text: expectedTextButGotJSON };
<p>
  {message.text}
</p>
```

##### 2、**应用二：私有属性**  #####

* 借助`Symbol`类型的不可枚举，可以在类中模拟私有属性，控制变量读写
* **因为通过 Symbol 作为属性名的属性，在常规的属性遍历和获取方法中，并不能够查询到**
* 在使用者不看内部代码的情况下，通过正常方法是无法获取和使用到这些属性的

```js
const privateField = Symbol();
class myClass {
  constructor(){
    this[privateField] = 'ConardLi';
  }
  getField(){
    return this[privateField];
  }
  setField(val){
    this[privateField] = val;
  }
}
```

##### 3、应用三：防止属性污染 #####

* 为对象添加一个属性，可能造成属性覆盖
* 用`Symbol`作为对象属性可以保证永远不会出现同名属性。在手写call中有应用