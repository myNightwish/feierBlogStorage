---
title: JS的继承
tags: JS
categories: 1.2-JS
description: 原型链的结构
cover: >-
  https://images.unsplash.com/photo-1616362657885-73baafe81a3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: prototype
date: 2021-12-11 20:40:44
---
## ES5继承 ##

### 1、原型链             极其重要 ###

#### 1、 什么是原型链 ####

* **构造函数、实例、原型对象的关系**
  * 构造函数的 prototype 指向原型对象，原型对象有一个 constructor 属性指回构造函数，每个构造函数生成的实例对象都有一个 *proto* 属性，这个属性指向原型对象
  * 最后，既然每个对象都有一个`_proto_`属性指向原型对象，那么原型对象也有_proto_指向原型对象的原型对象，它指向Object 构造函数对应的原型对象，直到`null`，到达原型链顶端

#### 2、Object、Function的关系 ####

<img src="file:///C:\Users\小虎牙\Documents\Tencent Files\2575329556\Image\Group\5LOKV2$Q28$JYOMV51%$GAA.jpg" alt="img" style="zoom: 25%;" />

* `function` ：所有的函数（包括构造函数）是`Function`的实例，所以所有函数的`_proto_`都指向`Function`的原型对象
* 所有的原型对象（包括 `Function`的原型对象）都是Object的实例，所以`_proto_`都指向 `Object`（构造函数）的原型对象。而`Object`构造函数的 `_proto_`指向 null 
* `Function`构造函数本身就是`Function`的实例，所以`_proto_`指向`Function`的原型对象

#### 3、 原型链应用 ####

* **搜索机制**

  实例属性 --- 实例的原型 --- 在原型链继承后，搜索可继续向上 原型的原型  -- 直到原型链的末端

* **确定原型与继承的关系**

  * 法1：instanceOf
  * 法2：isPrototypeOf：只要原型链上包含该原型就是true

### 2、继承方式：7种  √ ###

#### 1. 原型链继承 ####

```js
function Parent () {
    this.name = 'kevin';
  	this.obj = {a:1};
}
function Child(){}
Child.prototype = new Parent()
Child.prototype.constructor = Child  // Child的constructor属性丢失问题
var child1 = new Child();
var child2 = new Child();
```

* **优点：**简单

* **缺点：**

  1. 共享问题，如果一个属性是引用类型，那么该属性被所有实例共享，基本类型的不会

     child1改变了child1.name, child2.name不会被改变

     child改变了child.obj, child2.obj会改变。因为保存了同一份地址

  2. 子原型被重写

  3. 不能向父类传参 

* **注意：**子实例child1的__proto__ 和 子原型Son.prototye的constructor指向了Father，而不是子构造函数本身


#### 2. 借用构造函数（经典继承） ####

```js
function Parent (name) {
    this.names = ['kevin', 'daisy'];
  	this.name = name;
}
// 核心实现继承的手段
function Child (name) {
  //此处利用call(),将 [Child]的this传递给Parent构造函数
    Parent.call(this, name);
}

var child1 = new Child('kevin');
console.log(child1.name);   // kevin

var child2 = new Child('daisy');
console.log(child2.name);   // daisy

child1.names.push('yayu');
console.log(child1.names); // ["kevin", "daisy", "yayu"]

var child2 = new Child();
console.log(child2.names); // ["kevin", "daisy"]
```

* 优点：
  1. 避免引用类型共享，实例都是独立的，不会互相影响   
  2. 子可以向父类传参
* 缺点：
  1. 不能重用函数：方法是在构造函数内部定义的，每创建一个实例都会创建一遍方法
  2. **子类无法访问父类原型上的方法**，只能访问构造函数上的方法

#### 3. 组合继承（1+2） ####

属性放在构造函数里，方法放在原型链上

* 优点：1+2的优点

* 缺点：调用了两次父类构造函数

  ```js
  function Parent(){}
  function Child(){
  	Parent.call(this, name)     //1. 盗用构造函数继承实例属性
  }
  Child.prototype = new Parent()  //2. 原型链继承原型上的属性+方法
  Child.prototype.constructor = Child
  ```

  ```js
  function Parent (name) {
      this.name = name;
      this.colors = ['red', 'blue', 'green'];
  }
  
  Parent.prototype.getName = function () {
      console.log(this.name)
  }
  
  function Child (name, age) {
      Parent.call(this, name);
      this.age = age;
  }
  
  Child.prototype = new Parent();
  Child.prototype.constructor = Child;
  
  var child1 = new Child('kevin', '18');
  
  child1.colors.push('black');
  
  console.log(child1.name); // kevin
  console.log(child1.age); // 18
  console.log(child1.colors); // ["red", "blue", "green", "black"]
  
  var child2 = new Child('daisy', '20');
  
  console.log(child2.name); // daisy
  console.log(child2.age); // 20
  console.log(child2.colors); // ["red", "blue", "green"]
  ```

#### 4. 原型式继承：（1的变种） ####

实际就是Object.create()，只是Object.create()将原型式继承进一步规范化了，在只传一个参数时，二者等价

```js
let p = Object.create(o);
p.__proto__ === o; //true
```

* 优点：简单，不需要再单独创建构造函数

* 缺点：与1一样，属性值如果有引用类型，会互相影响

  ```js
  function createObj(o) {
    function F(){};
    F.prototype = o;
    return new F();
  }
  ```

  ```js
  var person = {
      name: 'kevin',
      friends: ['daisy', 'kelly']
  }
  
  var person1 = createObj(person);
  var person2 = createObj(person);
  
  person1.name = 'person1';   //person1 添加实例属性name
  console.log(person2.name); // kevin是原型上的name
  //不是因为person1和person2有独立的name值。
  //而是person1.name = 'person1'给person1添加了name值，而没有修改原型上的name值
  
  person1.friends.push('taylor');
  console.log(person2.friends); // ["daisy", "kelly", "taylor"]
  ```

#### 5. 寄生式继承（2的变种） ####

​	创建一个实现继承的函数，再以某种方式增强对象（添加新方法），再返回这个对象

* 优点：同样适用于关注对象，而不在乎类型和构造函数的场景

* 缺点：2的缺点：跟借用构造函数模式一样，每次创建对象都会创建一遍方法。

  ```js
  function createObj(o){
    let clone = Object.create(o)  //创建新对象，不是必须这个，任何可以返回新对象的函数都可在这用
    clone.sayName = function(){}  // 增强
    return clone
  }
  ```

#### 6. 寄生式组合继承（3+4）引用类型继承的最佳模式！！ ####

思路：由构造函数继承属性，混合原型链继承方法

* 混合原型链继承：不再像之前用父类的实例给子类prototype赋值，而是用**父类prototype**的副本

  ```js
  function Father(name, age) {
      this.name = name;
      this.age = age;
      this.action = ['speak', 'run', 'eat'];
      console.log('我被调用了');
  }
  Father.prototype.say = function () {
      console.log(`my name is ${this.name} , ${this.age} years old!`);
  };
  
  function Son(name, age, score) {
      Father.call(this, name, age);  // 借用构造函数, 第一次调用父类构造函数
      this.score = score;
  }
  // 寄生式继承返回的新对象赋值给子类prototype，使子类原型继承父类prototype
  Son.prototype = Object.create(Father.prototype);
  Son.prototype.constructor  = Son;
  Son.prototype.showScore = function () {
      console.log(`my score is ${this.score}`);
  };
  ```

  ```js
  let xiaoming = new Son('xiaoming', 23, '78');
  xiaoming.action.push('panio'); 
  console.log(xiaoming.action);//['speak', 'run', 'eat', 'panio']
  xiaoming.say();//my name is xiaoming,23 years old!
  xiaoming.showScore(); //my score is 78
  ```

  ```js
  let xiaohua = new Son('xiaohua', 24, '89');
  console.log(xiaohua.action);//['speak', 'run', 'eat']
  xiaohua.say();//my name is xiaohua,24 years old!
  xiaohua.showScore(); //my score is 89
  ```

* 优点：

  1. 解决了组合继承（3）的**效率问题**：父构造函数被调用两次  

  2. **原型链不变**

#### 经典的题： ####

实现：student继承person

1. person上面有一个name属性和printName方法
2. student上面有一个score属性和printScore方法
3. student和person共享一个方法

```js
function Person(name) {
  this.name = name;
  this.printName = function() {
    conaole.log('我是父')
  }
}
//在原型上定义共享方法
Person.prototype.commonMethods = function() {
  console.log('我是共享方法')
}

function Student(name, score) {
  //子类实现继承属性
  Person.call(this, name)
  this.score = score;
  this.printScore = function() {
    conaole.log('我是子')
  }
}
//子类继承方法
Student.prototype = new Person()

//测试
let stu1 = new Student('小明', 200)
// 这里传参100给person是没有用的，person并没有这个属性
let per1 = new Person('小红', 100)
```

```JS
class Person {
  constructor(name) {
    this.name = name
  }
  printName() {
    console.log('我是父')
  }
  //这个方法要继承
  commonMethods() {
    conole.log('我是公共的方法')
  }
}
//问题： 这样直接继承会导致子会继承父类的所有方法？？
class Student extends Person {
  constructor(name, score) {
    super(name)
    this.score = score
  }
  printScore() {
    console.log('我是子')
  }
}
// 测试
let per1 = new Person('小明', 200)
let stu1 = new Student('小红', 100)
```

### 3、创建对象  6种 ###

#### 1、直接创建Object实例 ####

* 套路: 先创建空Object对象, 再动态添加属性/方法
 * 适用场景: 起始时不确定对象内部数据
 * 问题: 语句太多、代码重复

```js
var person = new Object();
var person = {}
var s = Object.create(null) //它没有原型对象，百度问过
```

#### 2、工厂模式 ####

* 套路: 通过工厂函数动态创建对象并返回
 * 适用场景: 需要创建多个相似对象
 * 问题: `对象没有一个具体的类型`, 都是Object类型

```js
function createPerson(name, age, job){
    var o = new Object();
    o.name = name;
    o.sayName = function(){
        console.log(this.name);
    };
    return o;
}
```

####  3、构造函数

* 套路: 自定义构造函数, 通过new创建对象
 * 适用场景: 需要创建多个`类型确定`的对象,与上方工厂模式有所对比
 * 问题: 每次实例化都会自动重新创建一遍，同名函数也是不相等的，每个对象都有相同的数据, 浪费内存

```js
function Person(name, age, job){
    this.name = name;
    this.sayName = function(){
        console.log(this.name);
    };
}
```

#### 4、原型式：共享 ####

```js
function Person(){}

Person.prototype.name = 'zzx';
Person.prototype.sayName = function(){
    console.log(this.name);
}
```

#### 5、组合式： ####

* 套路: 自定义构造函数, 属性在函数中初始化, 方法添加到原型上

 * 适用场景: 需要`创建多个类型确定`的对象
 * 放在原型上可以节省空间(只需要加载一遍方法)

```js
function Person(name, age, job){
    this.name = name;
    this.age = age;
    this.job = job;
    this.friends = ['wc', 'rt'];
}

Person.prototype = {
    constructor: Person,
    sayName: function(){
        console.log(this.name);
    }
};
```

#### 6、寄生构造函数模式 ####

```
function Person(name, age, job){
    var o = new Object()   //创建空对象
    o.name = name;       //增强其属性、方法
    o.age = age;
    o.job = job;
    o.sayName = function(){
        console.log(this.name);
    }
    return o;
}
var person1 = new Person('zzx', 22, 'Programmer');
person1.sayName();
```

## class基本语法 ##

### 1、类与构造函数 ###

ES6 的`class`可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的`class`写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已

#### 1、相同点 ####

##### 数据类型 #####

* 类的**数据类型**就是函数，类本身就指向构造函数

  ```js
  class Point{
  // ...
  }
  typeof Point// "function"
  Point === Point.prototype.constructor // true
  ```

##### 实例化 #####

* 使用的时候，也是直接对类使用**`new`命令**，跟构造函数的用法完全一致

##### 属性、方法 #####

* **构造函数的**`prototype`属性，在 ES6 的“类”上面继续存在。事实上，**类的所有方法都定义在类的`prototype`属性**上。在类的实例上面调用方法，其实就是调用**原型上的方法**

  ```js
  class B {}
  let b =new B();
  b.constructor === B.prototype.constructor // true
  ```

* **实例上的：**

  * 与 ES5 一样，类的所有实例共享一个原型对象

  ```js
  var p1 =new Point(2,3);
  var p2 =new Point(3,2);
  p1.__proto__ === p2.__proto__  //true      它们的原型都是Point.prototype
  ```

  * 与 ES5 一样，**实例的**属性除非显式定义在其本身（即定义在`this`对象上），否则都是定义在原型上（即定义在`class`上）

    ```js
    class Point{
      constructor(x, y){
        this.x = x;
        this.y = y;
      }
      toString(){
      	return'('+this.x +', '+this.y +')';
      }
    }
    var point =newPoint(2,3);
    point.toString()// (2, 3)
    point.hasOwnProperty('x')// true
    point.hasOwnProperty('y')// true
    point.hasOwnProperty('toString')// false
    point.__proto__.hasOwnProperty('toString')// true
    ```

    * `x`和`y`是实例`point`自身属性（因为定义在`this`变量上），所以`hasOwnProperty`方法返`true`
    * 而`toString`是原型对象的属性（因为定义在`Point`类上），所以`hasOwnProperty`方法返回`false`。这些都与 ES5 的行为保持一致

* **`prototype`对象的**

  * **`prototype`对象的**`constructor`属性，直接指向“类”的本身，这与 ES5 的行为是一致的

    ```js
    Point.prototype.constructor ===Point     // true
    ```

  * 一次向类添加多个方法：

    由于类的方法都定义在`prototype`对象上面，所以**类的新方法可以添加在`prototype`对象上面**。`Object.assign`可以很方便地一次向类添加多个方法

  ```js
  class Point{
    constructor(){
    // ...
    }
  }
  Object.assign(Point.prototype,{
    toString(){},
    toValue(){}
  });
  ```

#### 2、不同点 ####

##### 方法不可枚举 #####

* `class` 中定义的方法不能枚举。所以在**遍历类的实例身上的属性**时，**原型上的属性**不会遍历到

  ```js
  class Point{
    constructor(x, y){
  // ...
  }
    toString(){
    // ...
    }
  }
  Object.keys(Point.prototype)
  // []
  Object.getOwnPropertyNames(Point.prototype)
  // ["constructor","toString"]
  ```

  ES5中可以：

  ```js
  var Point=function(x, y){
  // ...
  };
  Point.prototype.toString =function(){
  // ...
  };
  Object.keys(Point.prototype)
  // ["toString"]
  Object.getOwnPropertyNames(Point.prototype)
  // ["constructor","toString"]
  ```

##### 实例化 #####

* 类必须使用`new`调用，否则会报错。这是它跟普通构造函数的一个主要区别，后者不用`new`也可以执行

##### 严格模式 #####

* `class` 默认使用`strict` 严格模式执行，避免无意中，this丢失，指向window

  ```js
  class User {
    constructor(name) {
      this.name = name;
    }
    show() {
      function test() {
        console.log(this); //严格模式下输出 undefined
      }
      test();
    }
  }
  ```

##### 变量提升 #####

* 类不存在变量提升，这一点与 ES5 完全不同。 ES6 不会把类的声明提升到代码头部。这种规定的原因与继承有关，必须保证子类在父类之后定义。

  ```js
  new Foo();// ReferenceError
  class Foo{}
  ```

### 2、constructor方法 ###

* `constructor`类的默认方法，在 new 时自动执行

* 一个类必须有`constructor`方法，如果没有显式定义，一个空的`constructor`方法会被默认添加

* `constructor`方法默认返回实例对象（即`this`），完全可以指定返回另外一个对象

  ```js
  class Foo{
    constructor(){
    	return Object.create(null);
    }
  }
  new Foo() instanceof Foo  // false
  // constructor函数返回一个全新的对象，结果导致实例对象不是Foo类的实例
  ```

### 3、getter、setter ###

目的：使用访问器对对象的属性进行访问控制，有效的防止属性随意修改

* 与 ES5 一样，在“类”的内部可用`get`和`set`对某个属性设置存、取值函数，拦截该属性的存取行为

  ```js
  class MyClass{
    constructor(){
    // ...
    }
    get prop(){
      return'getter';
    }
    set prop(value){
      console.log('setter: '+value);
    }
  }
  let inst =new MyClass();
  inst.prop =123;   // setter: 123
  inst.prop       // 'getter'
  ```

* 存值函数和取值函数是设置在属性的 Descriptor 对象上的

  ```js
  class CustomHTMLElement{
    constructor(element){
      this.element = element;
    }
    get html(){
      return this.element.innerHTML;
    }
    set html(value){
      this.element.innerHTML = value;
    }
  }
  //存值函数和取值函数是定义在`html`属性的描述对象上面，这与 ES5 完全一致
  var descriptor =Object.getOwnPropertyDescriptor(CustomHTMLElement.prototype,"html");
  
  "get" in descriptor  // true
  "set" in descriptor  // true
  ```

* 类的属性名，可以采用表达式。

  ```js
  let methodName ='getArea';
  class Square{
    constructor(length){
    // ...
    }
    [methodName](){
    // ...
    }
  }
  ```

### 4、类的注意点 ###

#### 1、严格模式 ####

* 类和模块的内部，**默认就是严格模式**，所以不需要使用`use strict`指定运行模式
* 只要你的代码写在类或模块之中，就只有严格模式可用。
* 考虑到未来所有的代码，其实都是运行在模块之中，所以 ES6 实际上把整个语言升级到了严格模式

#### 2、不存在提升 ####

* 类不存在变量提升（hoist），这一点与 ES5 完全不同
* 这种规定的原因与下文要提到的继承有关，必须保证子类在父类之后定义

#### 3、name 属性 ####

* 本质上，ES6 的类只是 ES5 的构造函数的一层包装，所以函数的许多特性都被`Class`继承，包括`name`属性。

* `name`属性总是返回紧跟在`class`关键字后面的类名。

  ```js
  class Point{}
  Point.name // "Point"
  ```

#### 4、this 指向 ####

* 类的方法内部如果含有`this`，它默认指向**类的实例。**
* 但是，必须非常小心，**一旦单独使用该方法，很可能报错。**
  * `printName`方法中的`this`，默认指向`Logger`类的实例。
  * 但是，**如果将这个方法提取出来单独使用**，`this`会指向该方法运行时所在的环境（由于 class 内部是严格模式，所以 this 实际指向的是`undefined`），从而导致找不到`print`方法而报错

```js
class Logger{
  printName(name ='there'){
  	this.print(`Hello ${name}`);
  }
  print(text){
    console.log(text);
  }
}
const logger =new Logger();
const{ printName }= logger;
printName();// TypeError: Cannot read property 'print' of undefined
```

##### 解决办法： #####

* 在构造方法中绑定`this`

  ```js
  class Logger{
    constructor(){
    	this.printName =this.printName.bind(this);
    }
  // ...
  }
  ```

* 箭头函数

  * 箭头函数内部的`this`总是指向定义时所在的对象
  * 箭头函数位于构造函数内部，这时所在的运行环境，肯定是实例对象，所以`this`会总是指向实例对象

  ```js
  class Obj{
    constructor(){
    	this.getThis =()=>this;
    }
  }
  const myObj =new Obj();
  myObj.getThis()=== myObj // true
  ```

* 使用`Proxy`，获取方法的时候，自动绑定`this`

  ```js
  function selfish (target){
      const cache =new WeakMap();
      const handler ={
        get(target, key){
          const value =Reflect.get(target, key);
          if(typeof value !=='function'){
            return value;
          }
          if(!cache.has(value)){
            cache.set(value, value.bind(target));
          }
          return cache.get(value);
      }
  };
  const proxy =newProxy(target, handler);
  	return proxy;
  }
  const logger = selfish(newLogger());
  ```

##### Generator 方法 #####

* 如果某个方法之前加上星号（`*`），就表示该方法是一个 Generator 函数

* `Foo`类的`Symbol.iterator`方法前有一个星号，表示该方法是一个 Generator 函数。`Symbol.iterator`方法返回一个`Foo`类的默认遍历器，`for...of`循环会自动调用这个遍历器

  ```js
  classFoo{
    constructor(...args){
    	this.args = args;
    }
    *[Symbol.iterator](){
      for(let arg of this.args){
            yield arg;
      }
  	}
  }
  for(let x of newFoo('hello','world')){
    console.log(x);
  }
  // hello
  // world
  ```

### 5、静态方法、静态方法、实例属性写法 ###

#### 1、静态方法定义及规则 ####

* **静态方法：**

  类相当于实例的原型，所有在类中定义的方法，都会被实例继承。

  如果**在一个方法前，加上`static`关键字**，就表示**该方法不会被实例继承**，而是直接通过类来调用，这就**称为“静态方法”。**

* **规则：**

  * 如果在实例上调用静态方法，会**抛出一个错误**，表示不存在该方法

  * 如果静态方法包含`this`关键字，这个`this`指的是类，而不是实例

  * 静态方法可以与非静态方法重名

  * **父类**的静态方法，可以被**子类**继承（注意，这里是两个类，不是类与实例）

  * 静态方法也是可以从`super`对象上调用的

    ```js
    class Foo{
      static classMethod(){
      	return'hello';
      }
    }
    classBar extends Foo{
      static classMethod(){
      	return super.classMethod()+', too';
    	}
    }
    Bar.classMethod()// "hello, too"
    ```

#### 3、实例属性新写法 ####

* 实例属性除了定义在`constructor()`方法里面的`this`上面，也可以定义在类的最顶层

  * 实例属性`_count`与取值函数`value()`和`increment()`方法，处于同一个层级。这时，不需要在实例属性前面加上`this`。
  * 新写法好处：所有实例对象自身的属性都定义在类的头部，一眼就能看出这个类有哪些实例属性。

  ```js
  class IncreasingCounter{
    _count =0;
    get value(){
      console.log('Getting the current value!');
    	returnthis._count;
    }
    increment(){
    	this._count++;
    }
  }
  ```

#### 4、静态属性定义及规则 ####

* **静态属性：**

  指的是 Class 本身的属性，即`Class.propName`，而不是定义在实例对象（`this`）上的属性

  * 老写法：静态属性定义在类的外部。整个类生成以后，再生成静态属性
  * 让人很容易忽略这个静态属性，也不符合相关代码应该放在一起的代码组织原则

  ```js
  class Foo {  // 老写法
  }
  Foo.prop = 1;
  Foo.prop // 1
  ```

   ES6 明确规定，Class 内部只有静态方法，没有静态属性，所以新提案提供新写法：

  * **写法是在实例属性的前面，加上`static`关键字**
  * 显式声明（declarative），而不是赋值处理，语义更好

  ```js
  class MyClass {
    static myStaticProp = 42;
    constructor() {
      console.log(MyClass.myStaticProp); // 42
    }
  }
  ```

### 6、私有方法、属性 ###

* 私有方法和私有属性，是**只能在类的内部访问的方法和属性，外部不能访问**。

* 这是常见需求，**有利于代码的封装，但 ES6 不提供，只能通过变通方法模拟实现**

#### 1、私有属性 现有方案：  ####

##### 1、命名保护 #####

* 将属性定义为以 `_` 开始，来告诉使用者这是一个私有属性，不要在外部使用，这只是刻意的提示
* 外部**修改私有属性时可以使用访问器 `setter` 操作**，**继承时是可以使用的**

##### 2、将私有方法移出模块 #####

因为模块内部的所有方法都是对外可见的：

* `foo`是公开方法，内部调用了`bar.call(this, baz)`。这使得`bar`实际上成为了当前模块的私有方法。

```js
class Widget {
  foo (baz) {
    bar.call(this, baz);
  }
  // ...
}
function bar(baz) {
  return this.snaf = baz;
}
```

##### 3、`Symbol ` #####

* 利用`Symbol`值的唯一性，将私有方法的名字命名为一个`Symbol`值；

* 在外部通过查看对象结构无法获取的属性，继承同样可以拿到这个属性：

  bar和snaf都是Symbol值，一般情况下无法获取到它们，因此达到**了私有方法和私有属性的效果**

```js
const bar = Symbol('bar');  
const snaf = Symbol('snaf');
export default class myClass{
  // 公有方法
  foo(baz) {
    this[bar](baz);
  }
  // 私有方法
  [bar](baz) {
    return this[snaf] = baz;
  }
  // ...
};
```

* 但是也不是绝对不行，`Reflect.ownKeys()`依然可以拿到它们

  ```js
  const inst = new myClass();
  Reflect.ownKeys(myClass.prototype)  //Symbol 值的属性名依然可以从类的外部拿到
  // [ 'constructor', 'foo', Symbol(bar) ]
  ```

#### 2、私有属性 现有提案 ####

为`class`加了私有属性。方法是在属性名之前，使用`#`表示：

* `#count`就是私有属性，只能在类的内部使用（`this.#count`）。如果在类的外部使用，就会报错

  ```js
  class IncreasingCounter {
    #count = 0;
    get value() {
      console.log('Getting the current value!');
      return this.#count;
    }
    increment() {
      this.#count++;
    }
  }
  
  const counter = new IncreasingCounter();
  counter.#count  //代码在类的外部，读取私有属性，就会报错
  counter.#count = 42 // 报错
  ```

* #### 为什么没有采用`private`关键字？ ####

  * 是因为 JavaScript 是一门动态语言，没有类型声明，使用独立的符号似乎是唯一的比较方便可靠的方法，能够准确地区分一种属性是否为私有属性
  * ES6 没有用`@`符号而使用`#`，是因为`@`已经被留给了 Decorator

* 这种方式样可用于私有方法

* ##### 私有属性也可以设置 getter 和 setter 方法 #####

  ```js
  class Counter {
    #xValue = 0;
    constructor() {
      super();
      // ...
    }
    get #x() { return #xValue; }
    set #x(value) {
      this.#xValue = value;
    }
  }
  ```

* ##### 私有属性不限于从`this`引用，只要是在类的内部，实例也可以引用私有属性 #####

  ```js
  class Foo {
    #privateValue = 42;
    static getPrivateValue(foo) {
      return foo.#privateValue;    //从实例foo上面引用私有属性
    }
  }
  Foo.getPrivateValue(new Foo()); // 42
  ```

* ##### 私有属性和私有方法前面，也可以加上`static`关键字，表示这是一个静态的私有属性或私有方法 #####

  ```js
  class FakeMath {
    static PI = 22 / 7;
    static #totallyRandomNumber = 4;
    static #computeRandomNumber() {
      return FakeMath.#totallyRandomNumber;
    }
    static random() {
      console.log('I heard you like random numbers…')
      return FakeMath.#computeRandomNumber();
    }
  }
  FakeMath.PI // 3.142857142857143  
  FakeMath.random()           // 只能在`FakeMath`这个类的内部调用，外部调用就会报错
  // I heard you like random numbers…
  // 4
  FakeMath.#totallyRandomNumber // 报错  `#totallyRandomNumber`是私有属性
  FakeMath.#computeRandomNumber() // 报错  `#computeRandomNumber()`是私有方法
  ```

### 7、new.target 属性 ###

#### 1、对构造函数 ####

* ES6 为`new`命令引入了一个`new.target`属性，该属性一般用在构造函数之中，返回`new`命令作用于的那个构造函数。

* 如果构造函数不是通过`new`命令或`Reflect.construct()`调用的，`new.target`会返回`undefined`，因此**这个属性可以用来确定构造函数是怎么调用的**。

* 代码确保构造函数只能通过`new`命令调用：

  ```js
  function Person(name){
    if(new.target !==undefined){
    	this.name = name;
    }else{
    	throw new Error('必须使用 new 命令生成实例');
    }
  }
  // 另一种写法
  function Person(name){
    if(new.target === Person){
    	this.name = name;
    }else{
    	throw new Error('必须使用 new 命令生成实例');
    }
  }
  var person =new Person('张三');// 正确
  var notAPerson =Person.call(person,'张三');// 报错
  ```

#### 2、对类class ####

* Class 内部调用`new.target`，返回当前 Class

  ```js
  class Rectangle{
    constructor(length, width){
      console.log(new.target === Rectangle);
      this.length = length;
      this.width = width;
     }
  }
  var obj =new Rectangle(3,4);// 输出 true
  ```

* 注意：子类继承父类时，`new.target`会返回子类

  ```js
  class Rectangle{
    constructor(length, width){
      console.log(new.target ===Rectangle);  //new.target会返回子类
    // ...
    }
  }
  class Square extends Rectangle{
    constructor(length, width){
      super(length, width);
      console.log(new.target ===Square); //true
  	}
  }
  var obj =new Square(3);// 输出 false
  ```

#### 3、应用 ####

利用这个特点，可以写出**不能独立使用、必须继承后才能使用的类**

* `Shape`类不能被实例化，**只能用于继承。**
* 注意，在函数外部，使用`new.target`会报错。

```js
class Shape{
  constructor(){
    if(new.target === Shape){
    	throw new Error('本类不能实例化');
  	}
	}
}
class Rectangle extends Shape{
  constructor(length, width){
    super();
  	// ...
  }
}
var x =new Shape();// 报错
var y =new Rectangle(3,4);// 正确
```

## class继承 ##

Class 可以通过`extends`关键字实现继承，比 ES5 的通过修改原型链实现继承，要清晰和方便很多。

### 1、继承实现 ###

#### 1、extends关键字 ####

* 通过`extends`关键字，继承了`Point`类的所有属性和方法

  * 父类的静态方法，会被子类继承
  * 

* **子类必须在`constructor`方法中调用`super`方法，否则新建实例时会报错：**

  * 这是因为：子类自己的`this`对象，必须先通过父类的构造函数**得到与父类同样的实例属性和方法**
  * 然后再对其进行加工，加上子类自己的实例属性和方法
  * **如果不调用`super`方法，子类就得不到`this`对象。**

* 因此，在子类的构造函数中，只有调用`super`之后，才可以使用`this`关键字，否则会报错。这是**因为子类实例的构建，基于父类实例**，只有`super`方法才能调用父类实例。

  ```js
  class Point{
  }
  
  class ColorPoint extends Point{
    constructor(x, y, color){
      super(x, y);        // 调用父类的constructor(x, y)
    	this.color = color;
    }
    toString(){
    	return this.color +' '+ super.toString();// 调用父类的toString()
    }
  }
  ```

* 如果子类没有定义`constructor`方法，这个方法会被默认添加，也就是说，不管有没有显式定义，任何一个子类都有`constructor`方法

  ```js
  class ColorPoint extends Point{
  }
  // 等同于
  class ColorPoint extends Point{
    constructor(...args){
      super(...args);
  	}
  }
  ```

#### 2、继承的实质分析 ####

* ##### ES5 的继承： #####

  实质是**先创造子类的实例对象`this`，然后再将父类的方法添加**到`this`上面（`Parent.apply(this)`）

  ```js
  function User(name) {
    this.name = name;
  }
  function Admin(name) {
    User.call(this, name); 
  }
  ```

* ##### ES6 的继承机制： #####

  <img src="https://upload-images.jianshu.io/upload_images/675733-c5dd46572ce51840.png?imageMogr2/auto-orient/strip|imageView2/2/w/504/format/webp" alt="img" style="zoom:50%;" />

  实质是**先将父类实例对象的属性和方法，加到`this`上面**

  因此，在子类构造函数中要先执行`super`，然后再用子类的构造函数修改`this`

  ```js
  class User {
    constructor(name) {
      this.name = name;
    }
  }
  class Admin extends User {
    constructor(name) {
      super(name);
    }
  }
  ```

#### 3、静态方法 ####

* 父类的静态方法，也会被子类继承

#### 4、Object.getPrototypeOf ####

`Object.getPrototypeOf`方法可以用来从子类上获取父类。

```js
Object.getPrototypeOf(ColorPoint)===Point   // true
```

### 2、super关键字 ###

`super`这个关键字，既可以当作函数使用，也可以当作对象使用。在这两种情况下，它的用法完全不同。

#### 1、作函数调用 ####

`super`作为函数调用时，**代表父类的构造函数**。ES6 要求，子类的构造函数必须执行一次`super`函数。

* `super`虽然代表了父类`A`的构造函数，但是返回的是子类`B`的实例：即**`super`内部的`this`指的是`B`的实例**，因此`super()`在这里相当于`A.prototype.constructor.call(this)`。

  ```js
  class A {
    constructor() {
      console.log(new.target.name);// `new.target`指向当前正在执行的函数
    }
  }
  class B extends A {
    constructor() {
      super();
    }
  }
  new A() // A  
  //在`super()`执行时，它指向的是子类`B`的构造函数，而不是父类`A`的构造函数，也就是说，`super()`内部的`this`指向的是`B`。
  new B() // B  
  ```

* `super()`只能用在**子类的构造函数**之中，用在其他地方就会报错

  ```js
  class A {}
  class B extends A {
    m() {
      super(); // 报错，不是构造函数
    }
  }
  ```

#### 2、作为对象调用 ####

##### 普通方法： #####

* `super`作为对象时，**在普通方法中，指向父类的原型对象**；**在静态方法中，指向父类**。

  ```js
  class A {
    p() {
      return 2;
    }
  }
  class B extends A {
    constructor() {
      super();
      // 子类B当中的super.p()，就是将super当作一个对象使用。
      //这时，super在普通方法之中，指向A.prototype，所以super.p()就相当于A.prototype.p()。
      console.log(super.p()); // 2
    }
  }
  let b = new B();
  ```

* 由于`super`指向父类的**原型对象**，所以定义在**父类实例上的方法或属性，是无法通过`super`调用的**。

  如果属性定义在父类的原型对象上，`super`就可以取到

  ```js
  class A {
    constructor() {
      this.p = 2;
    }
  }
  A.prototype.x = 2;
  
  class B extends A {
    get m() {
      return super.p;  // p是父类A实例的属性，super.p就引用不到它
      console.log(super.x) // 2   此时在原型上，可以取到
    }
  }
  let b = new B();
  b.m // undefined
  ```

* 在子类普通方法中通过`super`调用父类的方法时，方法内部的`this`指向当前的子类实例

  也因此，所以如果通过`super`对某个属性赋值，这时`super`就是`this`，赋值属性会变成子类实例属性

  ```js
  class A {
    constructor() {
      this.x = 1;
    }
    print() {
      console.log(this.x);
    }
  }
  class B extends A {
    constructor() {
      super();
      this.x = 2;
    }
    m() {
      super.print(); //实际上执行的是super.print.call(this)
      // 此时this指向子类实例，对子类实例属性赋值了
      super.x = 3;  //等同于对this.x赋值为3
      console.log(super.x); // 读的是A.prototype.x，所以返回undefined
      console.log(this.x); // 3  this是子类实例
    }
  }
  let b = new B();
  b.m() // 2
  ```

##### 静态方法： #####

* 在**子类静态方法**中通过`super`调**用父类静态方法**时，

  * `super`将指向**父类**，而不是父类的原型对象。

  * 方法内部的**`this`指向当前的子类**，而不是子类的实例。

    ```js
    class A {
      constructor() {
        this.x = 1;
      }
      static print() {
        console.log(this.x);
      }
    }
    class B extends A {
      constructor() {
        super();  
        this.x = 2;
      }
      static m() {
        super.print();  //这个方法里面的this指向的是B，而不是B的实例。
      }
    }
    B.x = 3;
    B.m() // 3
    ```

#### 3、使用注意 ####

* 使用`super`的时候，必须显式指定是作为函数、还是作为对象使用，否则会报错

* 由于对象总是继承其他对象的，所以可以在任意一个对象中，使用`super`关键字

  ```js
  var obj = {
    toString() {
      return "MyObject: " + super.toString(); //明显是对象来用
    }
  };
  obj.toString(); // MyObject: [object Object]
  ```

### 3、prototype、__proto__属性 ###

#### 1、类的 prototype 属性和__proto__属性 ####

* ES5 实现之中，每一个对象都有`__proto__`属性，指向对应的构造函数的`prototype`属性。

* Class 作为构造函数的语法糖，同时有`prototype`属性和`__proto__`属性，因此**同时存在两条继承链**

  （1）子类的`__proto__`属性，表示**构造函数的继承**，总是指向父类

  （2）子类`prototype`属性的`__proto__`属性，表示方法的继承，总是指向父类的`prototype`属性

  ```js
  class A {
  }
  class B extends A {
  }
  B.__proto__ === A // true 子类`B`的`__proto__`属性指向父类`A`
  B.prototype.__proto__ === A.prototype // true 子类`B`的`prototype`属性的`__proto__`属性指向父类`A`的`prototype`属性
  ```

* 这样的结果是因为，类的继承是按照下面的模式实现的。

  ```js
  class A {
  }
  class B {
  }
  // B 的实例继承 A 的实例
  Object.setPrototypeOf(B.prototype, A.prototype);
  // B 继承 A 的静态属性
  Object.setPrototypeOf(B, A);
  const b =new B();
  
  Object.setPrototypeOf方法的实现:
    Object.setPrototypeOf =function(obj, proto){
      obj.__proto__ = proto;
    	return obj;
    }
  ```

* 因此，可以这样理解：

  作为一个对象，子类（`B`）的原型（`__proto__`）是父类（`A`）；

  作为一个构造函数，子类（`B`）的原型对象（`prototype`）是父类原型对象（`prototype`属性）的实例

#### 2、不同个继承类型 ####

* `extends`关键字后面可以跟多种类型的值

  只要是一个有`prototype`属性的函数，就能被`B`继承。由于函数都有`prototype`属性（除了`Function.prototype`函数），因此`A`可以是任意函数。

  ```
  class B extends A {//
  }
  ```

##### 方式1：子类继承`Object`类 #####

```js
class A extends Object{
}
A.__proto__ ===Object// true
A.prototype.__proto__ ===Object.prototype // true
```

##### 方式2：不存在任何继承 #####

* `A`作为一个基类（即不存在任何继承），就是一个普通函数，所以直接继承`Function.prototype`。
* 但`A`调用后返回一个空对象（即`Object`实例），所以`A.prototype.__proto__`指向构造函数（`Object`）的`prototype`属性。

```js
class A {
}
A.__proto__ ===Function.prototype // true
A.prototype.__proto__ ===Object.prototype // true
```

#### 3、实例的 __proto__ 属性 ####

* 子类实例的`__proto__`属性的`__proto__`属性，指向父类实例的`__proto__`属性。

* 也就是说，子类的原型的原型，是父类的原型。

  `ColorPoint`继承了`Point`，导致前者原型的原型是后者的原型

  ```js
  var p1 =new Point(2,3);
  var p2 =new ColorPoint(2,3,'red');
  p2.__proto__ === p1.__proto__ // false
  p2.__proto__.__proto__ === p1.__proto__ // true
  ```

* 应用：

  通过子类实例的`__proto__.__proto__`属性，可以修改父类实例的行为

  ```js
  p2.__proto__.__proto__.printName =function(){
    console.log('Ha');
  };
  p1.printName()// "Ha"
  ```

### 4、Mixin ###

Mixin 指的是多个对象合成一个新的对象，新对象具有各个组成成员的接口。

* `JS`不能实现多继承，如果要使用多个类的方法时可以使用`mixin`混合模式来完成

* `mixin` 类是一个包含许多供其它类使用的方法的类

* `mixin` 类不用来继承做为其它类的父类

  ```js
  function mix(...mixins){
      class Mix{
          constructor(){
            for(let mixin of mixins){
              copyProperties(this,new mixin());// 拷贝实例属性
            }
      		}
  	  }
      for(let mixin of mixins){
        copyProperties(Mix, mixin);// 拷贝静态属性
        copyProperties(Mix.prototype, mixin.prototype);// 拷贝原型属性
      }
  		return Mix;
  }
  function copyProperties(target, source){
      for(let key of Reflect.ownKeys(source)){
        if(key !=='constructor' && key !=='prototype' && key !=='name'){
          let desc =Object.getOwnPropertyDescriptor(source, key);
          Object.defineProperty(target, key, desc);
        }
  		}
  }
  ```

* 上面代码的`mix`函数，可以将多个对象合成为一个类。使用的时候，只要继承这个类即可。

  ```js
  class DistributedEdit extends mix(Loggable,Serializable){
  // ...
  }
  ```