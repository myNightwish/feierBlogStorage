---
title: ES6的新特性
categories: JS
description: 好家伙，面试届的扛把子，内容过多!
cover: https://cdn.jsdelivr.net/gh/myNightwish/CDN_res/Project/ES6.png
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: ES6
date: 2021-12-29 22:54:26
---
## ES6概括 ##

涵盖了**ES2015**、**ES2016**、**ES2017**、**ES2018**、**ES2019**、**ES2020**。更新的内容主要分为以下几点

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f623a94c2f6f4cbeb46b1e8d66e75186~tplv-k3u1fbpfcp-watermark.image" alt="ES6缩略" style="zoom: 25%;" />

* **表达式**：声明、解构赋值
* **内置对象**：字符串扩展、数值扩展、对象扩展、数组扩展、函数扩展、正则扩展、Symbol、Set、Map、Proxy、Reflect
* **语句与运算**：Class、Module、Iterator
* **异步编程**：Promise、Generator、Async

## ES2015 ##

### 1、表达式 ###

#### 1、声明：const、let ####

#### 2、解构赋值 ####

##### 1、语法： #####

*  **字符串解构**：`const [a, b, c, d, e] = "hello"`
*  **数值解构**：`const { toString: s } = 123`
*  **布尔解构**：`const { toString: b } = true`
*  对象解构
   * 形式：`const { x, y } = { x: 1, y: 2 }`
   * 默认：`const { x, y = 2 } = { x: 1 }`
   * 改名：`const { x, y: z } = { x: 1, y: 2 }`
*  数组解构
   * 规则：数据结构具有`Iterator接口`可采用数组形式的解构赋值
   * 形式：`const [x, y] = [1, 2]`
   * 默认：`const [x, y = 2] = [1]`
*  函数参数解构
   * 数组解构：`function Func([x = 0, y = 1]) {}`
   * 对象解构：`function Func({ x = 0, y = 1 } = {}) {}`

##### 2、应用场景： #####

* 交换变量值：`[x, y] = [y, x]`
* 返回函数多个值：`const [x, y, z] = Func()`
* 定义函数参数：`Func([1, 2])`
* 提取JSON数据：`const { name, version } = packageJson`
* 定义函数参数默认值：`function Func({ x = 1, y = 2 } = {}) {}`
* 遍历Map结构：`for (let [k, v] of Map) {}`
* 输入模块指定属性和方法：`const { readFile, writeFile } = require("fs")`

##### 3、重点难点 #####

* 匹配模式：只要等号两边的模式相同，左边的变量就会被赋予对应的值
* 解构赋值规则：只要等号右边的值不是对象或数组，就先将其转为对象
* 解构默认值生效条件：属性值严格等于`undefined`
* 解构不成功时变量的值等于`undefined`
* `undefined`和`null`无法转为对象，因此无法进行解构

### 2、内置对象 ###

#### 1、字符串扩展 ####

*  **Unicode表示法**：`大括号包含`表示Unicode字符(`\u{0xXX}`或`\u{0XXX}`)
*  **字符串遍历**：可通过`for-of`遍历字符串
*  **字符串模板**：可单行可多行可插入变量的增强版字符串
*  **标签模板**：函数参数的特殊调用
*  **String.raw()**：返回把字符串所有变量替换且对斜杠进行转义的结果
*  **String.fromCodePoint()**：返回码点对应字符
*  **codePointAt()**：返回字符对应码点(`String.fromCodePoint()`的逆操作)
*  **normalize()**：把字符的不同表示方法统一为同样形式，返回`新字符串`(Unicode正规化)
*  **repeat()**：把字符串重复n次，返回`新字符串`
*  **matchAll()**：返回正则表达式在字符串的所有匹配
*  **includes()**：是否存在指定字符串
*  **startsWith()**：是否存在字符串头部指定字符串
*  **endsWith()**：是否存在字符串尾部指定字符串

#### 2、数值扩展 ####

*  **二进制表示法**：`0b或0B开头`表示二进制(`0bXX`或`0BXX`)
*  **八进制表示法**：`0o或0O开头`表示二进制(`0oXX`或`0OXX`)

##### 1、Number： #####

*  **Number.EPSILON**：数值最小精度
*  **Number.MIN_SAFE_INTEGER**：最小安全数值(`-2^53`)
*  **Number.MAX_SAFE_INTEGER**：最大安全数值(`2^53`)
*  **Number.parseInt()**：返回转换值的整数部分
*  **Number.parseFloat()**：返回转换值的浮点数部分
*  **Number.isFinite()**：是否为有限数值
*  **Number.isNaN()**：是否为NaN
*  **Number.isInteger()**：是否为整数
*  **Number.isSafeInteger()**：是否在数值安全范围内

##### 2、Math： #####

*  **Math.sign()**：返回数值类型(`正数1`、`负数-1`、`零0`)
*  **Math.cbrt()**：返回数值立方根
*  对数、立方根、双曲、正弦、、、

#### 3、对象扩展 ####

*  **简洁表示法**：键值相同
*  **属性名表达式**：字面量定义对象时使用`[]`定义键(`[prop]`，不能与上同时使用)
*  **属性的可枚举性和遍历**：描述对象的`enumerable`
*  **super关键字**：指向当前对象的原型对象(只能用在对象的简写方法中`method() {}`)
*  **Object.assign()**：合并对象(浅拷贝)，返回原对象
*  **Object.getPrototypeOf()**：返回对象的原型对象
*  **Object.setPrototypeOf()**：设置对象的原型对象
*  **__proto__**：返回或设置对象的原型对象

> 属性遍历

* 描述：`自身`、`可继承`、`可枚举`、`非枚举`、`Symbol`
* 遍历
  * `for-in`：遍历对象`自身可继承可枚举`属性
  * `Object.keys()`：返回对象`自身可枚举`属性键组成的数组
  * `Object.getOwnPropertyNames()`：返回对象`自身非Symbol`属性键组成的数组
  * `Object.getOwnPropertySymbols()`：返回对象`自身Symbol`属性键组成的数组
  * `Reflect.ownKeys()`：返回对象`自身全部`属性键组成的数组
* 规则
  * 首先遍历所有数值键，按照数值升序排列
  * 其次遍历所有字符串键，按照加入时间升序排列
  * 最后遍历所有Symbol键，按照加入时间升序排列

#### 4、数组扩展 ####

##### 1、语法： #####

*  **扩展运算符(...)**
*  Array.from()：转换具有Iterator接口的数据结构为真正数组，返回新数组
   * 类数组对象：`包含length的对象`、`Arguments对象`、`NodeList对象`
   * 可遍历对象：`String`、`Set结构`、`Map结构`、`Generator函数`
*  **Array.of()**：转换一组值为真正数组，返回新数组
*  **copyWithin()**：把指定位置的成员复制到其他位置，返回原数组
*  **find()**：返回第一个符合条件的成员
*  **findIndex()**：返回第一个符合条件的成员索引值
*  **fill()**：根据指定值填充整个数组，返回原数组
*  **keys()**：返回以索引值为遍历器的对象
*  **values()**：返回以属性值为遍历器的对象
*  **entries()**：返回以索引值和属性值为遍历器的对象

##### 2、扩展应用 #####

* 克隆数组：`const arr = [...arr1]`
* 合并数组：`const arr = [...arr1, ...arr2]`
* 拼接数组：`arr.push(...arr1)`
* 代替apply：`Math.max.apply(null, [x, y])` => `Math.max(...[x, y])`
* 转换字符串为数组：`[..."hello"]`
* 转换类数组对象为数组：`[...Arguments, ...NodeList]`
* 转换可遍历对象为数组：`[...String, ...Set, ...Map, ...Generator]`
* 与数组解构赋值结合：`const [x, ...rest/spread] = [1, 2, 3]`

#### 5、函数扩展 ####

##### 1、参数默认值：为函数参数指定默认值 #####

* 形式：`function Func(x = 1, y = 2) {}`
* 参数赋值：惰性求值(函数调用后才求值)
* 参数位置：尾参数
* 参数作用域：函数作用域
* 声明方式：默认声明，不能用`const`或`let`再次声明
* length：返回没有指定默认值的参数个数
* 与解构赋值默认值结合：`function Func({ x = 1, y = 2 } = {}) {}`
* 应用
  * 指定某个参数不得省略，省略即抛出错误：`function Func(x = throwMissing()) {}`
  * 将参数默认值设为`undefined`，表明此参数可省略：`Func(undefined, 1)`

##### 2、剩余参数(...)：返回函数多余参数 #####

* 形式：以数组的形式存在，之后不能再有其他参数
* 作用：代替`Arguments对象`
* length：返回没有指定默认值的参数个数但不包括`rest/spread参数`

##### 3、箭头函数(=>)：函数简写 #####

* 无参数、单个参数、多个参数、解构参数`({x, y}) => {}`、

* 嵌套使用：部署管道机制
* this指向固定化，这种特性很有利于封装回调函数
  * 并非因为内部有绑定`this`的机制，而是根本没有自己的`this`，导致内部的`this`就是外层代码块的`this`
  * 因为没有`this`，因此不能用作构造函数
  * 不可使用`Arguments对象`，此对象在函数体内不存在(可用`rest/spread参数`代替)
  * 返回对象时必须在对象外面加上括号

##### 4、尾调用优化：只保留内层函数的调用帧 #####

* 尾调用
  * 定义：某个函数的最后一步是调用另一个函数
  * 形式：`function f(x) { return g(x); }`
* 尾递归
  * 定义：函数尾调用自身
  * 作用：只要使用尾递归就不会发生栈溢出，相对节省内存
  * 实现：把所有用到的内部变量改写成函数的参数并使用参数默认值

#### 6、正则扩展 ####

#### 7、Symbol ####

#### 8、Set ####

##### 1、用法 #####

* 定义：成员值都是唯一且没有重复的值
* 声明：`const set = new Set(arr)`
* 入参：具有`Iterator接口`的数据结构
* 属性
  * **constructor**：构造函数，返回Set
  * **size**：返回实例成员总数
* 方法
  * **add()**：添加值，返回实例            **clear()**：清除所有成员
  * **delete()**：删除值，返回布尔   **has()**：检查值，返回布尔
  * **keys()**：返回以属性值为遍历器的对象
  * **values()**：返回以属性值为遍历器的对象
  * **entries()**：返回以属性值和属性值为遍历器的对象
  * **forEach()**：使用回调函数遍历每个成员

##### 2、应用场景 #####

* 去重字符串：`[...new Set(str)].join("")`
* 去重数组：`[...new Set(arr)]`或`Array.from(new Set(arr))`
* 集合数组
  * 声明：`const a = new Set(arr1)`、`const b = new Set(arr2)`
  * 并集：`new Set([...a, ...b])`
  * 交集：`new Set([...a].filter(v => b.has(v)))`
  * 差集：`new Set([...a].filter(v => !b.has(v)))`
* 映射集合
  * 声明：`let set = new Set(arr)`
  * 映射：`set = new Set([...set].map(v => v * 2))`或`set = new Set(Array.from(set, v => v * 2))`

##### 3、重点难点 #####

* 遍历顺序：插入顺序
* 没有键只有值，可认为键和值两值相等
* 添加多个`NaN`时，只会存在一个`NaN`
* 添加相同的对象时，会认为是不同的对象
* 添加值时不会发生类型转换(`5 !== "5"`)
* `keys()`和`values()`的行为完全一致，`entries()`返回的遍历器同时包括键和值且两值相等

#### 9、WeakSet ####

##### 1、用法 #####

* 定义：和Set结构类似，成员值只能是对象
* 声明：`const set = new WeakSet(arr)`
* 入参：具有`Iterator接口`的数据结构
* 属性
  * **constructor**：构造函数，返回WeakSet
* 方法
  * **add()**：添加值，返回实例
  * **delete()**：删除值，返回布尔
  * **has()**：检查值，返回布尔

##### 2、应用场景 #####

* 储存DOM节点：DOM节点被移除时自动释放此成员，不用担心这些节点从文档移除时会引发内存泄漏
* 临时存放一组对象或存放跟对象绑定的信息：只要这些对象在外部消失，它在`WeakSet结构`中的引用就会自动消失

##### 3、重点难点 #####

* 成员都是`弱引用`，垃圾回收机制不考虑`WeakSet结构`对此成员的引用
* 成员不适合引用，它会随时消失，因此ES6规定`WeakSet结构不可遍历`
* 其他对象不再引用成员时，垃圾回收机制会自动回收此成员所占用的内存，不考虑此成员是否还存在于`WeakSet结构`中

#### 10、Map ####

##### 1、用法 #####

* 定义：成员键是任何类型的值
* 声明：`const set = new Map(arr)`
* 入参：具有`Iterator接口`且每个成员都是一个双元素数组的数据结构
* 属性
  * **constructor**：构造函数，返回Map
  * **size**：返回实例成员总数
* 方法
  * **get()**：返回键值对   	**set()**：添加键值对，返回实例       **has()**：检查键值对，返回布尔
  * **delete()**：删除键值对，返回布尔		**clear()**：清除所有成员
  * **keys()**：返回以键为遍历器的对象
  * **values()**：返回以值为遍历器的对象
  * **entries()**：返回以键和值为遍历器的对象
  * **forEach()**：使用回调函数遍历每个成员

##### 2、重点难点 #####

* 遍历顺序：插入顺序
* 对同一个键多次赋值，后面的值将覆盖前面的值
* 对同一个对象的引用，被视为一个键
* 对同样值的两个实例，被视为两个键
* 键跟内存地址绑定，只要内存地址不一样就视为两个键
* 添加多个以`NaN`作为键时，只会存在一个以`NaN`作为键的值
* `Object结构`提供`字符串—值`的对应，`Map结构`提供`值—值`的对应

#### 11、WeakMap ####

##### 1、用法 #####

* 定义：和Map结构类似，成员键只能是对象
* 声明：`const set = new WeakMap(arr)`
* 入参：具有`Iterator接口`且每个成员都是一个双元素数组的数据结构
* 属性
  * **constructor**：构造函数，返回WeakMap
* 方法
  * **get()**：返回键值对
  * **set()**：添加键值对，返回实例
  * **delete()**：删除键值对，返回布尔
  * **has()**：检查键值对，返回布尔

##### 2、应用场景 #####

* 储存DOM节点：DOM节点被移除时自动释放此成员键，不用担心这些节点从文档移除时会引发内存泄漏
* 部署私有属性：内部属性是实例的弱引用，删除实例时它们也随之消失，不会造成内存泄漏

##### 3、重点难点 #####

* 成员键都是`弱引用`，垃圾回收机制不考虑`WeakMap结构`对此成员键的引用
* 成员键不适合引用，它会随时消失，因此ES6规定`WeakMap结构不可遍历`
* 其他对象不再引用成员键时，垃圾回收机制会自动回收此成员所占用的内存，不考虑此成员是否还存在于`WeakMap结构`中
* 一旦不再需要，成员会自动消失，不用手动删除引用
* 弱引用的`只是键而不是值`，值依然是正常引用
* 即使在外部消除了成员键的引用，内部的成员值依然存在

#### 12、Proxy ####

* 定义：修改某些操作的默认行为
* 声明：`const proxy = new Proxy(target, handler)`
* 入参
  * **target**：拦截的目标对象
  * **handler**：定制拦截行为
* 方法
  * **Proxy.revocable()**：返回可取消的Proxy实例(返回`{ proxy, revoke }`，通过revoke()取消代理)
* 拦截方式
  * **get()**：拦截对象属性读取
  * **set()**：拦截对象属性设置，返回布尔
  * **has()**：拦截对象属性检查`k in obj`，返回布尔
  * **deleteProperty()**：拦截对象属性删除`delete obj[k]`，返回布尔
  * **defineProperty()**：拦截对象属性定义`Object.defineProperty()`、`Object.defineProperties()`，返回布尔
  * **ownKeys()**：拦截对象属性遍历`for-in`、`Object.keys()`、`Object.getOwnPropertyNames()`、`Object.getOwnPropertySymbols()`，返回数组
  * **getOwnPropertyDescriptor()**：拦截对象属性描述读取`Object.getOwnPropertyDescriptor()`，返回对象
  * **getPrototypeOf()**：拦截对象原型读取`instanceof`、`Object.getPrototypeOf()`、`Object.prototype.__proto__`、`Object.prototype.isPrototypeOf()`、`Reflect.getPrototypeOf()`，返回对象
  * **setPrototypeOf()**：拦截对象原型设置`Object.setPrototypeOf()`，返回布尔
  * **isExtensible()**：拦截对象是否可扩展读取`Object.isExtensible()`，返回布尔
  * **preventExtensions()**：拦截对象不可扩展设置`Object.preventExtensions()`，返回布尔
  * **apply()**：拦截Proxy实例作为函数调用`proxy()`、`proxy.apply()`、`proxy.call()`
  * **construct()**：拦截Proxy实例作为构造函数调用`new proxy()`

> 应用场景

* `Proxy.revocable()`：不允许直接访问对象，必须通过代理访问，一旦访问结束就收回代理权不允许再次访问
* `get()`：读取未知属性报错、读取数组负数索引的值、封装链式操作、生成DOM嵌套节点
* `set()`：数据绑定(Vue数据绑定实现原理)、确保属性值设置符合要求、防止内部属性被外部读写
* `has()`：隐藏内部属性不被发现、排除不符合属性条件的对象
* `deleteProperty()`：保护内部属性不被删除
* `defineProperty()`：阻止属性被外部定义
* `ownKeys()`：保护内部属性不被遍历

> 重点难点

* 要使`Proxy`起作用，必须针对`实例`进行操作，而不是针对`目标对象`进行操作
* 没有设置任何拦截时，等同于`直接通向原对象`
* 属性被定义为`不可读写/扩展/配置/枚举`时，使用拦截方法会报错
* 代理下的目标对象，内部`this`指向`Proxy代理`

#### 13、Reflect ####

* 定义：保持`Object方法`的默认行为
* 方法
  * **get()**：返回对象属性
  * **set()**：设置对象属性，返回布尔
  * **has()**：检查对象属性，返回布尔
  * **deleteProperty()**：删除对象属性，返回布尔
  * **defineProperty()**：定义对象属性，返回布尔
  * **ownKeys()**：遍历对象属性，返回数组(`Object.getOwnPropertyNames()`+`Object.getOwnPropertySymbols()`)
  * **getOwnPropertyDescriptor()**：返回对象属性描述，返回对象
  * **getPrototypeOf()**：返回对象原型，返回对象
  * **setPrototypeOf()**：设置对象原型，返回布尔
  * **isExtensible()**：返回对象是否可扩展，返回布尔
  * **preventExtensions()**：设置对象不可扩展，返回布尔
  * **apply()**：绑定this后执行指定函数
  * **construct()**：调用构造函数创建实例

> 设计目的

* 将`Object`属于`语言内部的方法`放到`Reflect`上
* 将某些Object方法报错情况改成返回`false`
* 让`Object操作`变成`函数行为`
* `Proxy`与`Reflect`相辅相成

> 废弃方法

* `Object.defineProperty()` => `Reflect.defineProperty()`
* `Object.getOwnPropertyDescriptor()` => `Reflect.getOwnPropertyDescriptor()`

> 重点难点

* `Proxy方法`和`Reflect方法`一一对应
* `Proxy`和`Reflect`联合使用，前者负责`拦截赋值操作`，后者负责`完成赋值操作`

> 数据绑定：观察者模式

```js
const observerQueue = new Set();
const observe = fn => observerQueue.add(fn);
const observable = obj => new Proxy(obj, {
    set(tgt, key, val, receiver) {
        const result = Reflect.set(tgt, key, val, receiver);
        observerQueue.forEach(v => v());
        return result;
    }
});

const person = observable({ age: 25, name: "Yajun" });
const print = () => console.log(`${person.name} is ${person.age} years old`);
observe(print);
person.name = "Joway";
复制代码
```

#### 14、Class           15、Module    16、Iterator    17、Promise   18、Generator ####

## ES2016 ##

<img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8b6131b43a2415e8deb82c53a054432~tplv-k3u1fbpfcp-watermark.image" alt="ES2016" style="zoom:25%;" />

## ES2017 ##

<img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/65ff57811aff4f0e884a9b250fa1b6fb~tplv-k3u1fbpfcp-watermark.image" alt="ES2017" style="zoom:25%;" />

### 1、声明 ###

*  **共享内存和原子操作**：由全局对象`SharedArrayBuffer`和`Atomics`实现，将数据存储在一块共享内存空间中，这些数据可在`JS主线程`和`web-worker线程`之间共享

### 2、字符串扩展 ###

*  **padStart()**：把指定字符串填充到字符串头部，返回新字符串
*  **padEnd()**：把指定字符串填充到字符串尾部，返回新字符串

### 3、对象扩展 ###

*  **Object.getOwnPropertyDescriptors()**：返回对象所有自身属性(非继承属性)的描述对象
*  **Object.values()**：返回以值组成的数组
*  **Object.entries()**：返回以键和值组成的数组

### 4、函数扩展 ###

*  **函数参数尾逗号**：允许函数最后一个参数有尾逗号

### 5、Async ###

* 定义：使异步函数以同步函数的形式书写(Generator函数语法糖)
* 原理：将`Generator函数`和自动执行器`spawn`包装在一个函数里
* 形式：将`Generator函数`的`*`替换成`async`，将`yield`替换成`await`
* 声明
  * 具名函数：`async function Func() {}`
  * 函数表达式：`const func = async function() {}`
  * 箭头函数：`const func = async() => {}`
  * 对象方法：`const obj = { async func() {} }`
  * 类方法：`class Cla { async Func() {} }`
* await命令：等待当前Promise对象状态变更完毕
  * 正常情况：后面是Promise对象则返回其结果，否则返回对应的值
  * 后随`Thenable对象`：将其等同于Promise对象返回其结果
* 错误处理：将`await命令Promise对象`放到`try-catch`中(可放多个)

> Async对Generator改进

* 内置执行器
* 更好的语义
* 更广的适用性
* 返回值是Promise对象

> 应用场景

* 按顺序完成异步操作

> 重点难点

* `Async函数`返回`Promise对象`，可使用`then()`添加回调函数
* 内部`return返回值`会成为后续`then()`的出参
* 内部抛出错误会导致返回的Promise对象变为`rejected状态`，被`catch()`接收到
* 返回的Promise对象必须等到内部所有`await命令Promise对象`执行完才会发生状态改变，除非遇到`return语句`或`抛出错误`
* 任何一个`await命令Promise对象`变为`rejected状态`，整个`Async函数`都会中断执行
* 希望即使前一个异步操作失败也不要中断后面的异步操作
  * 将`await命令Promise对象`放到`try-catch`中
  * `await命令Promise对象`跟一个`catch()`
* `await命令Promise对象`可能变为`rejected状态`，最好把其放到`try-catch`中
* 多个`await命令Promise对象`若不存在继发关系，最好让它们同时触发
* `await命令`只能用在`Async函数`之中，否则会报错
* 数组使用`forEach()`执行`async/await`会失效，可使用`for-of`和`Promise.all()`代替
* 可保留运行堆栈，函数上下文随着`Async函数`的执行而存在，执行完成就消失

## ES2018 ##

<img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ee2ee331aa642c49fc3119bdf3eb974~tplv-k3u1fbpfcp-watermark.image" alt="ES2018" style="zoom: 25%;" />

### 字符串扩展 ###

*  **放松对标签模板里字符串转义的限制**：遇到不合法的字符串转义返回`undefined`，并且从`raw`上可获取原字符串

### 对象扩展 ###

*  **扩展运算符(...)**：转换对象为用逗号分隔的参数序列(`{ ...obj }`，相当于`rest/spread参数`的逆运算)

> 扩展应用

* 克隆对象：`const obj = { __proto__: Object.getPrototypeOf(obj1), ...obj1 }`
* 合并对象：`const obj = { ...obj1, ...obj2 }`
* 转换字符串为对象：`{ ..."hello" }`
* 转换数组为对象：`{ ...[1, 2] }`
* 与对象解构赋值结合：`const { x, ...rest/spread } = { x: 1, y: 2, z: 3  }`(不能复制继承自原型对象的属性)
* 修改现有对象部分属性：`const obj = { x: 1, ...{ x: 2 } }`

### 正则扩展 ###

* **s修饰符**：dotAll模式修饰符，使`.`匹配任意单个字符(`dotAll模式`)

* **dotAll**：是否设置`s修饰符`

* **后行断言**：`x`只有在`y`后才匹配

* **后行否定断言**：`x`只有不在`y`后才匹配

* Unicode属性转义

  ：匹配符合

  ```
  Unicode某种属性
  ```

  的所有字符

  * 正向匹配：`\p{PropRule}`
  * 反向匹配：`\P{PropRule}`
  * 限制：`\p{...}`和`\P{...}`只对`Unicode字符`有效，使用时需加上`u修饰符`

* 具名组匹配

  ：为每组匹配指定名字(

  ```
  ?<GroupName>
  ```

  )

  * 形式：`str.exec().groups.GroupName`
  * 解构赋值替换
    * 声明：`const time = "2017-09-11"`、`const regexp = /(?\d{4})-(?\d{2})-(?\d{2})/u`
    * 匹配：`time.replace(regexp, "$/$/$")`

### Promise ###

*  **finally()**：指定不管最后状态如何都会执行的回调函数

### Async ###

*  **异步迭代器(for-await-of)**：循环等待每个`Promise对象`变为`resolved状态`才进入下一步

## ES2019 ##

![ES2019](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ae43118d7ef4e1eb9b3aac7b0f89777~tplv-k3u1fbpfcp-watermark.image)

### 字符串扩展 ###

*  **直接输入U+2028和U+2029**：字符串可直接输入`行分隔符`和`段分隔符`
*  **JSON.stringify()改造**：可返回不符合UTF-8标准的字符串
*  **trimStart()**：消除字符串头部空格，返回新字符串
*  **trimEnd()**：消除字符串尾部空格，返回新字符串

### 对象扩展 ###

*  **Object.fromEntries()**：返回以键和值组成的对象(`Object.entries()`的逆操作)

### 数组扩展 ###

*  **sort()稳定性**：排序关键字相同的项目其排序前后的顺序不变，默认为`稳定`
*  **flat()**：扁平化数组，返回新数组
*  **flatMap()**：映射且扁平化数组，返回新数组(只能展开一层数组)

### 函数扩展 ###

*  **toString()改造**：返回函数原始代码(与编码一致)
*  **catch()参数可省略**：`catch()`中的参数可省略

### Symbol ###

*  **description**：返回`Symbol值`的描述

## ES2020 ##

<img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4762da8a25d242eb82da69576b05b035~tplv-k3u1fbpfcp-watermark.image" alt="ES2020" style="zoom:25%;" />

### 声明 ###

* globalThis

  ：作为顶层对象，指向全局环境下的

  ```
  this
  ```

  * Browser：顶层对象是`window`
  * Node：顶层对象是`global`
  * WebWorker：顶层对象是`self`
  * 以上三者：通用顶层对象是`globalThis`

### 数值扩展 ###

* BigInt

  ：任何位数的整数(新增的数据类型，使用

  ```
  n
  ```

  结尾)

  * **BigInt()**：转换普通数值为BigInt类型
  * **BigInt.asUintN()**：转换BigInt为0到2n-1之间对应的值
  * **BigInt.asIntN()**：转换BigInt为-2n-1 到2n-1-1
  * **BigInt.parseInt()**：近似于`Number.parseInt()`，将一个字符串转换成指定进制的BigInt类型

> 重点难点

* BigInt同样可使用各种进制表示，都要加上后缀
* BigInt与普通整数是两种值，它们之间并不相等
* typeof运算符对于BigInt类型的数据返回`bigint`

### 对象扩展 ###

* 链判断操作符(?.)

  ：是否存在对象属性(不存在返回

  ```
  undefined
  ```

  且不再往下执行)

  * 对象属性：`obj?.prop`、`obj?.[expr]`
  * 函数调用：`func?.(...args)`

* **空判断操作符(??)**：是否值为`undefined`或`null`，是则使用默认值

### 正则扩展 ###

*  **matchAll()**：返回所有匹配的遍历器

### Module ###

* import()

  ：动态导入(返回

  ```
  Promise
  ```

  * 背景：`import命令`被JS引擎静态分析，先于模块内的其他语句执行，无法取代`require()`的动态加载功能，提案建议引入`import()`来代替`require()`

* 位置：可在任何地方使用

  * 区别：`require()`是**同步加载**，`import()`是**异步加载**
  * 场景：按需加载、条件加载、模块路径动态化

### Iterator ###

*  **for-in遍历顺序**：不同的引擎已就如何迭代属性达成一致，从而使行为标准化

### Promise ###

* Promise.allSettled()

  ：将多个实例包装成一个新实例，返回全部实例状态变更后的状态数组(齐变更再返回)

  * 入参：具有`Iterator接口`的数据结构
  * 成功：成员包含`status`和`value`，`status`为`fulfilled`，`value`为返回值
  * 失败：成员包含`status`和`reason`，`status`为`rejected`，`value`为错误原因

## ES提案 ##

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68085d653c054f68a496cb158496ed8b~tplv-k3u1fbpfcp-watermark.image" alt="ES提案" style="zoom:33%;" />

### 声明 ###

*  **do表达式**：封装块级作用域的操作，返回内部最后执行表达式的值(`do{}`)
*  **throw表达式**：直接使用`throw new Error()`，无需`()`或`{}`包括
*  **!#命令**：指定脚本执行器(写在文件首行)

### 数值扩展 ###

*  **数值分隔符(_)**：使用`_`作为千分位分隔符(增加数值的可读性)
*  **Math.signbit()**：返回数值符号是否设置

### 函数扩展 ###

* **函数部分执行**：复用函数功能(`?`表示单个参数占位符，`...`表示多个参数占位符)

* **管道操作符(|>)**：把左边表达式的值传入右边的函数进行求值(`f(x)` => `x |> f`)

* 绑定运算符(::)

  ：函数绑定(左边是对象右边是函数，取代

  ```
  bind
  ```

  、

  ```
  apply
  ```

  、

  ```
  call
  ```

  调用)

  * bind：`bar.bind(foo)` => `foo::bar`
  * apply：`bar.apply(foo, arguments)` => `foo::bar(...arguments)`

### Realm ###

* 定义：提供`沙箱功能`，允许隔离代码，防止被隔离的代码拿到全局对象
* 声明：`new Realm().global`

### Class ###

*  **静态属性**：使用`static`定义属性，该属性`不会被实例继承`，只能通过类来调用
*  **私有属性**：使用`#`定义属性，该属性只能在类内部访问
*  **私有方法**：使用`#`定义方法，该方法只能在类内部访问
*  **装饰器**：使用`@`注释或修改类和类方法

### Module ###

*  **import.meta**：返回脚本元信息

### Promise ###

* Promise.any()

  ：将多个实例包装成一个新实例，返回全部实例状态变更后的结果数组(齐变更再返回)

  * 入参：具有`Iterator接口`的数据结构
  * 成功：其中一个实例状态变成`fulfilled`，最终状态就会变成`fulfilled`
  * 失败：只有全部实例状态变成`rejected`，最终状态才会变成`rejected`

* **Promise.try()**：不想区分是否同步异步函数，包装函数为实例，使用`then()`指定下一步流程，使用`catch()`捕获错误

### Async ###

*  **顶层Await**：允许在模块的顶层独立使用`await命令`(借用`await`解决模块异步加载的问题)

