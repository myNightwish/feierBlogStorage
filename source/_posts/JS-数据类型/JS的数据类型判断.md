---
title: JS的数据类型判断
tags: JS
categories: 1.2-JS
description: 常见的数据类型判断
cover: >-
  https://images.unsplash.com/photo-1639128107506-21cb4c6a2f90?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80
abbrlink: 611441247
date: 2021-12-10 23:09:53
---
### 类型判断5种       ###

#### 1、typeOf（适合基本类型） ####

typeof是操作符，不是函数，返回一个字符串

唯一要注意的就是：

1. **null用typeof返回的是object**，但是这并不意味着null是对象
2. **函数function用typeof返回的是function**，其余对象都返回object

```js
typeOf xxx
object: new Array()、 [11] 、Object 、 null 、 new String()、 new Number()
undefined: undefined
boolean: true
string: 'ssss'
number: 123
function: function(){}
```

#### 2、instanceof：及手写 ####

<img src="file:///C:\Users\小虎牙\Documents\Tencent Files\2575329556\Image\Group\5LOKV2$Q28$JYOMV51%$GAA.jpg" alt="img" style="zoom: 25%;" />

 * `A instanceof B`：检测B的 `prototype` 属性是否在A对象的原型链上，缺点：

   1. 不能检测基本数据类型
   2. 检测不准确，判断数组时需要用Array，而不用Object

   ```js
    console.log(Object instanceof Function) // true
    console.log(Object instanceof Object) // true
    console.log(Function instanceof Function) // true
    console.log(Function instanceof Object) // true
   
    function Foo() {}
   	console.log(Object instanceof  Foo) // false
    console.log(Foo instanceof  Object) // true
    console.log(Foo instanceof  Function) // true
   ```

##### instanceof手写 #####

* 不断向上取A的__proto__与B的prototype对比

```js
function instanceOf(A, B){
  if(typeof A === 'object'|| A === null) return false
  let p = A // 链表遍历
  while(p){
    if(p === B.prototype){
      return true
    }
    p = p.__proto__
  }
  return false
} 
```

#### 3、isArray ####

**检测数组的比较好的方式**

```js
var arr2 = [1, 2];
var obj2 = {
    name: 'name'
}
console.log(Array.isArray(arr2))  // true  
console.log(Array.isArray(obj2))  // false  
```

#### 4、constructor属性 ####

返回创建该对象的构造函数的引用

```
var arr = [1,2];
console.log(arr.constructor === Array);        //true
console.log(arr.constructor === Object);    //false
```

缺点：

* constructor属性存在原型上面，一旦原型被重写，就不再指向之前的构造函数了
* `null`和`undefined`是无效的对象,因此是不会有`constructor`存在的

####  5、Object.prototype.toString()

`Object.prototype.toString().call(thisArg)`

##### 1、执行流程： #####

1. 如果 this 值是 undefined，就返回 [object Undefined]
2. 如果 this 的值是 null，就返回 [object Null]
3. 让 O 成为 ToObject(this) 的结果
4. 让 class 成为 O 的内部属性 [[Class]] 的值
5. **最后返回由 "[object " 和 class 和 "]" 三个部分组成的字符串**

```javascript
var number = 1;          // [object Number]
var string = '123';      // [object String]
var boolean = true;      // [object Boolean]
var und = undefined;     // [object Undefined]
var nul = null;          // [object Null]
var obj = {a: 1}         // [object Object]
var array = [1, 2, 3];   // [object Array]
var date = new Date();   // [object Date]
var error = new Error(); // [object Error]
var reg = /a/g;          // [object RegExp]
var func = function a(){}; // [object Function]

function checkType() {
    for (var i = 0; i < arguments.length; i++) {
       //注意调用方法
        console.log(Object.prototype.toString.call(arguments[i]))
    }
}
checkType(number, string, boolean, und, nul, obj, array, date, error, reg, func)
```

##### 2、调用这个方法、直接toString的区别 #####

* ##### 普通对象Object调用这个方法和直接obj.toString()结果是相同的 #####

  ```js
    var a = {x:4}
    console.log(a.toString());                      //[object Object]
    console.log(Object.prototype.toString.call(a)); //[object Object]
  ```

* ##### 其他数据类型就不是： #####

  1. 字符串 String 的 toString 方法返回还是本身
  2. 数组 Number 的 toString 方法返回字符串的数字
  3. 数组 Array 的 toString 方法将每个数组元素转换成一个字符串，并在**元素之间添加逗号后合并成结果字符串**。
  4. 函数 Function 的 toString 方法返回源代码字符串。
  5. 日期 Date 的 toString 方法返回一个可读的日期和时间字符串。
  6. 正则表达式 RegExp 的 toString 方法返回一个表示正则表达式直接量的字符串。
  7. Null 和 Undefined 没有 toString 方法

  ```js
    var b = '123'.valueOf()
    console.log(b.toString());                      //123
    console.log(Object.prototype.toString.call(b)); //[object String]
    
    var c= [1,2,3]
    console.log(c.toString());                      //1,2,3
    console.log(Object.prototype.toString.call(c)); //[object Array]
  ```
