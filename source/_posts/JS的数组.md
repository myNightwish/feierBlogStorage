---
title: JS的数组
date: 2021-12-11 22:02:56
tags:
- 数组API
- 去重
- 扁平化
categories: JS
description: '关于数组API、去重方式、扁平化'
cover: https://images.unsplash.com/photo-1608488174658-40421bc6ce98?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80
copyright_author: 飞儿 # 作者覆写
copyright_url: https://www.nesxc.com/post/hexocc.html 
license: CC BY-NC-SA 4.0
license_url: https://creativecommons.org/licenses/by-nc-sa/4.0/
---
## 数组 ##

### 1、对象、数组遍历 √ ###

#### 1、对象√ ####

##### 1、`for ...in `：可枚举属性，包括实例属性、原型属性（无序） #####

* 可以拿到constructor：原型上是不可枚举属性但**在实例属性中对它进行了屏蔽**

* `Object.propertyIsEnumberable()`: true/false检测自身属性是否可枚举，对继承来的属性无效

  ```js
  // 设置属性是否可枚举：
  Object.defineProperty(对象，修改或新增的属性名，{
  		value:修改或新增的属性的值,
  		writable:true/false,	
  		enumerable: false,		//enumerable 如果值为false 则不允许遍历
      configurable: false  //configurable 如果为false 则不允许删除这个属性 属性是否可以被删除或是否可以再次修改特性
  })	
  ```

##### 2、`Object.keys`： #####

实例上的可枚举属性，原型继承的不会被遍历，不包含symbol属性

##### 3、`Object.getOwnPropertyNames()`： #####

遍历实例上的所有属性，不论是否枚举，但不包含Symbol属性，返回一个属性字符串数组

##### 4、`Reflect.ownKeys()`： #####

遍历实例上的所有属性，不论是否枚举，包含Symbol属性

#### 2、数组√ ####

##### 1、`forEach` #####

* 迭代中间无法跳出，break，contine均无效；

* 参数是函数，对每个元素做了处理，返回值**undefined**

  ```js
  array.forEach(function(currentValue, index, arr){})
  ```

  * currentValue—数组当前值

  * index—当前值索引（可选）
  * arr—该数组（可选）

##### 2、`for...of` #####

* 可迭代对象（Array、Map、Set、String、Arguments等）

##### 3、`map`、`filter`、`Some`、`reduce`、`every` #####

#### 3、 `for ...in `与`for...of`的区别 ####

* `for...in`：本身是为了对象的迭代，但也可用于数组，对象拿到的是key，数组拿到的是value

* `for...of` ：遍历**可迭代对象**定义要迭代的数据

### 2、类数组√ ###

* 是一个对象，不是数组。可以索引取值、length属性、for遍历

  ```js
  var arrLike = {
    0: 'name',
    1: 'age',
    length: 3
  }
  var arr = ['name', 'age', 'job'];
  ```

  **Arguments**对象：是经典的类数组对象：

  * 函数传递的参数
  * length属性：实参的长度
  * callee属性：指向的函数自身，可以通过它来调用自身函数

* 区别在于它不能直接使用数组的方法，如果想使用，则需要借助call/apply

  ```js
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
  ```

#### 2、类数组转为数组√ ####

```js
// 1. slice  (有副本 ，截取start+end)
Array.prototype.slice.call(arrayLike); // ["name", "age", "sex"] 

// 2. splice (原数组会被修改，返回删除元素构成的数组，0表示没有删除)
Array.prototype.splice.call(arrayLike, 0); // ["name", "age", "sex"] 

// 3. ES6 Array.from
// Array.from可以把类数组对象和可遍历（interable）对象（包括set和map）转换为数组
Array.from(arrayLike); // ["name", "age", "sex"] 

// 4. concat
Array.prototype.concat.apply([], arrayLike)

// 5 ES6 ...运算符 作为函数参数的时候可以吧arguments转换成数组
// 扩展运算符...，有Interator接口的对象都可用，对象就不行了，函数的arguments对象就可用
function translateArray(...arguments) {
    // ...
}
```

### 3、数组方法              ###

#### 1、splice ####

作用：向数组中添加/删除项目，然后返回被删除的项目构成的新数组，同时原数组也发生了改变

```
arrayObject.splice(index,howmany,item1,.....,itemX)
```

* index：添加/删除项目的位置，使用负数可从数组结尾处规定位置 ---必需

* howmany：要删除的项目数量。**如果设置为 0**，**则不会删除项目** --必需

* 第3项：向数组添加的新项目      --可选

  ```js
  arr.splice(2,0,"William")//创建一个新数组，并将索引为2的那项添加wiliam，后面的索引依次后移
  arr.splice(2,1,"William") //删除位于 index 2 的元素，并添加一个新元素来替代被删除的元素
  arr.splice(2,3,"William") //删除从 index 2 ("Thomas") 开始的三个元素，并添加一个新元素 ("William") 来替代被删除的元素
  ```

#### 2、slice：没有修改原数组，返回新数组 ####

返回一个新的数组，包含从 start 到 end （不包括该元素）的 arrayObject 中的元素

* 若传参为空，则返回数组拷贝

```js
arrayObject.slice(start,end)
```

* start：从何处开始选取。负数，从数组尾部开始算起的位置。也就是说，-1 指最后一个元素，-2 指倒数第二个元素，以此类推。  ---必需
* end：从何处结束选取。如果没有指定，那么start到数组结束的所有元素，负数，从数组尾部开始算起   --可选

#### 3、filter ####

* 遍历数组中每一个元素，返回所有函数返回结果为true的元素，这些元素构成的数组就是filter()方法的返回值

* ```js
  // 定义数组
  var names = ["abc", "cb", "mba", "dna"]
  
  // 获取names中所有包含'a'字符的元素
  var newNames = names.filter(function (t) {
      return t.indexOf("a") != -1
  })
  ```

```javascript
array.filter(function(value,index,array),contetx)
- value—当前数组值，必须
- index—数组索引，非必须
- array—当前数组，非必须
- context—指定回调函数的this值，一般不穿，默认是undefined的
```

- 实现如下：

```javascript
Array.prototype.myFilter = function(fn,context){
  	// 调用.myFilter方法的那个数组
      var arr = this
      var newArr = []
      for(let i=0;i<arr.length;i++){
        if(fn.call(context,arr[i],i,arr)){
          newArr.push(arr[i])
        }
      }
      return newArr
    }
```

```js
    Array.prototype.reduceToFilter = function (fn,context) {
      return this.reduce((target, current, index) => {
        if (fn.call(this, current, index)) {
          target.push(current);
        }
        return target;
      }, [])
    };
```

#### 4、map  ####

* 遍历数组，每个元素经过某函数的作用后，变成新元素，最后形成一个新数组
* 与forEach的区别：
  1. forEach返回的是undefined，因此它也不支持链式调用；而map不改变原数组但是会 返回新数组
  2. forEach没有返回值，不可以中断，不能使用return返回到外层函数；map可以break中断循环，可以return返回到外层函数
     * forEach() 对于空数组是不会执行回调函数的。
     * for可以用continue跳过循环中的一个迭代，forEach用continue会报错。
     * forEach() 需要用 return 跳过循环中的一个迭代，跳过之后会执行下一个迭代。

```js
array.map(function(value,index,array), context)
- value—当前数组值，必须
- index—数组索引，非必须
- array—该数组，非必须
- context—指定回调函数的this值
```

* 实现如下

```javascript
Array.prototype.myMap = function(fn, context){
  var arr = this
  var newArr = []
  for(let i=0;i<arr.length;i++){
    //map处理完就push
    newArr.push(fn.call(context, arr[i], i, arr))
  }
  return newArr
}
```

```js
用reduce实现map
Array.prototype.reduceToMap = function (fn, context) {
// this就是使用map的数组实例
	return this.reduce((target, current, index) => {
		target.push(fn.call(this, current, index))
		return target;
	}, [])
};
```

#### 5、reduce ####

```javascript
array.reduce(function(pre,cur,index,arr),initalval)
- pre—当前累加值，必须
- cur—当前数组值，必须
- index—数组索引，非必须
- arr—该数组，非必须
- initalVal—累加值初始值，非必须，**不传值的话，数组第一个元素为默认值**
```

* 实现核心：没有传入initalVal时，初始值设为数组第1个元素，并从第2个元素开始便利。回到函数应该处理第二个元素

```javascript
Array.prototype.myReduce=function(fn,inital){
      var arr = this
      var total = inital?inital:arr[0]  //关键
      var startIndex = inital?0:1       //关键
      for(let i=startIndex;i<arr.length;i++){
        total = fn.call(null,total,arr[i],i,arr)  //注意要传入一个null，第二个是total
      }
      return total
    }
```


#### 6、Sort ####

在原数组上排序，不生成副本

* 若参数为空，按照字符编码的顺序进行排序

* 其他标准：提供比较函数

  * 该函数要比较两个值，然后返回一个用于说明这两个值的相对顺序的数字，比较函数应该具有两个参数 a 和 b，其返回值如下：

    * 若 a 小于 b，在排序后的数组中 a 应该出现在 b 之前，则返回一个小于 0 的值。
    * 若 a 等于 b，则返回 0。

    * 若 a 大于 b，则返回一个大于 0 的值

    ```js
    const list = Array.from(map).sort((a,b) => b[1]-a[1])
    // 如果a是较小的，那么b[1]-a[1]就是正的。a应该在b之后。所以输出是降序排列
    ```

#### 7、some ####

只要有一个元素比对结果为true，返回结果就为true

#### 8、every ####

* 使用指定函数检测数组中的所有元素是否都符合指定条件，所有符合，return true，否则返回false

* 不会改变原始数组

  ```js
  array.every(function(currentValue,index,arr), thisValue)
  ```

#### 9、Array.from ####

* 从一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例
  * 伪数组对象（拥有一个 `length` 属性和若干索引属性的任意对象）
  * [可迭代对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/iterable)（可以获取对象中的元素,如 Map和 Set 等）

```js
Array.from('foo');    // [ "f", "o", "o" ] 从 String 生成数组

const set = new Set(['foo', 'bar', 'baz', 'foo']);  从 Set 生成数组
Array.from(set);     // [ "foo", "bar", "baz" ]

const mapper = new Map([['1', 'a'], ['2', 'b']]);  //从 Map 生成数组
Array.from(map);    //[['1', 'a'], ['2', 'b']]
Array.from(mapper.values());  // ['a', 'b'];
Array.from(mapper.keys());   // ['1', '2'];

从类数组对象（arguments）生成数组
function f() {
  return Array.from(arguments);
}
f(1, 2, 3);    // [ 1, 2, 3 ]

Array.from([1, 2, 3], x => x + x);       // [2, 4, 6] 在 Array.from 中使用箭头函数
Array.from({length: 5}, (v, i) => i);    // [0, 1, 2, 3, 4]
const list = Array.from(map).sort((a,b) => b[1]-a[1])
```

### 4、是否改变数组 ###

* #### 改变：push、unshift、pop、shift、reverse 、sort、splice ####

* #### 不改变：concat 、map、every、some 、filter、toString、slice 、join、indexOf ####

### 5、数组去重 ###

#### 法1：双层for+splice            基本数据类型 ####

```js
function unique(arr){
  for(var i=0;i<arr.length;i++){
    for(var j=i+1;j<arr.length;j++){
      if(arr[i]===arr[j]){
        arr.splice(j,1)  //splice是能改变原数组的，slice不行
        j--  //如果有重复元素，删除之后一定要j--
      }
    }
  }
  return arr
}
```

#### 法2：用额外空间存储已经出现过的元素 ####

```js
function unique(arr){
  var res = []
  for(var i=0;i<arr.length;i++){
    if(res.indexOf(arr[i])==-1){
      //  if(!res.includes(arr[i])){
      res.push(arr[i])
    }
  }
  return res
}
版本2：对象的键名存储(能对NAN去重，对象只留前面一个，基本数据类型：)
function unique(arr){
  let res = []
  let obj = {}
  for(var item of arr){
    if(!obj.hasOwnProperty(typeof item + item)){
      res.push(item)
      obj[typeof item + item] = true
    }
  }
  return res
}
版本3：Map 的键名可以是任意类型，而不是像对象那样必须是字符串类型，所以利用这一点，简化版本2
function unique(arr){
  var res = []
  var map = new Map()
  for(var item of arr){
    if(!map.has(item)){  //map没有当前元素键名
      res.push(item)
      map.set(item,true)
    }
  }
  return res
}
```

#### 方法3：filter+indexOf，基本数据类型： ####

```js
法1：
function unique(arr){
  return arr.filter(function(cur,index){
    // indexOf:返回的是元素在数组中跟的索引位置，-1代表不存，
    // 否则结果是索引位置，且是从左到右第一次找到的与该元素相等或就是该元素的位置
    // 所以arr.indexOf(cur) == index说明是第一次出现的元素
    return arr.indexOf(cur) == index
  })
}
法2
const unique = (arr) => {
  arr.filter(i => arr.indexOf(i) === arr.lastIndexOf(i))
}
```

#### 方法4：Set，基本数据类型：NaN能去重，对象不可以 ####

```js
function unique(arr){
  return [...new Set(arr)]
  // 或者：return Array.from(new Set(arr))
}
```

### 6、扁平化数组        ###

####  法1：递归                   支持指定深度写这个

遍历数组元素，遇到元素是数组时，递归flatten函数

```javascript
var array = [1,2,[3,[4,5],6],7]
function flatten(arr, deep = 1){
  var res = []
  for(let i=0;i<arr.length;i++){
    if(Array.isArray(arr[i]) && deep > 1){
      res = res.concat(flatten(arr[i]))    //这里一定要连接数组
    }else{
      res.push(arr[i])
    }
  }
  return res
}

flatten(array, 2); //[1, 2, 3, Array(2), 6, 7]
```

#### 法2：reduce+递归                 支持指定深度  重点√

因为是遍历数组所有元素，最终返回一个值-数组，可以用reduce来简化递归代码

```javascript
function flatten(arr){
  return arr.reduce((total,current) => {
    return total.concat(Array.isArray(current)? flatten(current) : current)
  },[])
}
// 指定深度版本：
function flattenByDeep(array, deep = 1) {
  return array.reduce(
    		(previousValue, current) =>
    				Array.isArray(current) && deep > 1 ?
	previousValue.concat(flattenByDeep(current, deep - 1)) :previousValue.concat(current)
   , [])
    }
```

####  法3：扩展运算符                       不支持指定深度

* 拍平一层

```javascript
var array = [1,2,[3,[4,5],6],7]
console.log([].concat(...array)); //[1,2,3,[4,5],6,7]
```

* 检查数组每个元素，如果有元素是数组就要拍平一次，所以这里用到了数组的some方法

```javascript
function flatten(arr){
  while(arr.some(item=>Array.isArray(item))){
    arr = [].concat(...arr)
  }
  return arr
}
```

#### 法4：es6的flat     支持指定深度    快手手写实现

es6中的新方法，数组拍平用

```javascript
var array = [1,2,[3,[4,5],6],7]
var a = array.flat(1)     //拍平一层   
var b = array.flat(Infinity)  //完全拍平
```

#### 法5：toString    数组元素均为数字  不支持指定深度

* toString效果如下

```javascript
var array = [1,2,[3,[4,5],6],7]
var a = array.toString()         //'1,2,3,4,5,6,7'
```

* 字符串的split方法以','分割，得到字符串数组，然后把数组每个元素数转换为数字

```javascript
function flatten(arr){
  return arr.toString().split(',').map(item => +item)  
  //用到了类型转换，+item把item字符串变成数字
}
```
