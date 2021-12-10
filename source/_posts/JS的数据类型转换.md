---
title: JS的数据类型转换
date: 2021-12-10 23:10:27
tags: 'JS'
categories: 'JS'
description: '显示转换、隐士转换、转换的标准'
cover: https://images.unsplash.com/photo-1639111503666-56295742ed85?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80
---
### 3.1、类型转换1(基本)             ###

* 两种转换形式：**显式类型转换**和**隐式类型转换**
* 三种转换结果：**Number** 、**String** 、**Boolean**

#### 3.1.1、转string ####

##### 1、String()函数：强制转换 #####

* **对于Number Boolean String都会调用他们的toString()方法来将其转换为字符串；**
* **对于null值，直接转换为字符串"null"。对于undefined直接转换为字符串"undefined"**  ，结果如下

| **参数类型** | **结果**                                        |
| ------------ | ----------------------------------------------- |
| Undefined    | **"undefined"**                                 |
| Null         | **"null"**                                      |
| Boolean      | **true**返回**"true"**,**false**返回**"false"** |
| **Number**   | 情况比较复杂                                    |
| String       | 没转换                                          |

* Number的补充说明：
  1. NaN，转换为"NaN"
  2. +0/-0，转换为"0"
  3. Infinity，转换为"Infinity"
  4. **会发生进制转换**

```javascript
console.log(String(NaN));         //"NaN"
console.log(String(-0));          //"0"
console.log(String(+0));          //"0"
console.log(String(-Infinity));   //"-Infinity"
console.log(String(Infinity));    //"Infinity"
console.log(String(0xf));         //"15"
console.log(String(070));         //"56"  转成8进制
```

##### 2、.toString()方法：强制转换 #####

1. Boolean、Number、String是基本包装类型，有toString方法，转换规则和String是一样的
2. **null和undefined没有toString方法，**所以没法转换，会报错

```javascript
console.log((-0).toString());         //"0"
console.log((NaN).toString());        //'NaN'
console.log((0xf).toString());        //'15'
console.log((070).toString());        //'56'
console.log((-Infinity).toString());  //'-Infinity'
```

##### 3、隐式转换： + #####

* **为任意的数据类型 +""**  ， 原理：和String()函数一样	

#### 3.1.2、转number ####

`Number()` / `parseFloat()` / `parseInt()`

##### 1、Number()：强制转换 #####

如果传入参数，调用底层函数**ToNumber()**，如果未传入参数，返回0：

| **参数类型** | **结果**                               |
| ------------ | -------------------------------------- |
| Undefined    | **NaN**                                |
| Null         | **+0**                                 |
| Boolean      | **true**返回**1**，**false**返回**+0** |
| Number       | 就是输入的参数了                       |
| String       | **情况比较复杂**                       |

补充String类型：

1. 如果字符串中只包含数字**(包括前面带正号或负号的情况)**，则将其转换为十进制数值：

   即"1" 会变成 1，"123"会变成 123，而"011"会变成 11**(注意:前导的零被忽略了)**;

2. 如果字符串中包含**有效的浮点格式**，如"1.1"，则将其转换为对应的浮点数值(同样，也会忽略前导零);

3. 如果字符串中包含有效的**十六进制格式**，例如"0xf"，则将其转换为相同大小的**十进制整数值**;

4. 如果字符串是**空串或纯空格**，则将其转换为0;

5. 如果字符串中包含除上述格式之外的字符，则将其转换为NaN。

```javascript
console.log(Number("123")) // 123
console.log(Number("-123")) // -123
console.log(Number("1.2")) // 1.2
console.log(Number("000123")) // 123
console.log(Number("-000123")) // -123

console.log(Number("0x11")) // 17

console.log(Number("")) // 0
console.log(Number(" ")) // 0

console.log(Number("123 123")) // NaN
console.log(Number("foo")) // NaN
console.log(Number("100a")) // NaN
```

##### 2、parseFloat() ：强制转换  #####

专门针对**字符串转数字**的情况，因为用Number()转字符串的时候，复杂又不合理

- 忽略**前导空格**，第一个不为空的字符如果不是**数字/正负号**，就返回NaN；

- 解析后续字符直到遇到不是数字的字符，后面的字符全部忽略，返回之前的数字

  ```javascript
  parseInt('  +3')     //+3
  parseInt('')         //空字符串，NaN
  parseInt(' ')        //NaN
  parseInt('*12')      //NaN
  parseInt('123blue')  //123
  parseInt(2.25)       //2，'.'不是数字，小数点后面都被忽略了
  parseInt('0xf')      //15，十六进制
  parseInt('070')      //70，八进制，但是ES5认为这是70
  ```

- 如果对非String使用parseInt()或parseFloat()，它会**先将其转换为String**然后在操作 parseInt() ，可以将**一个字符串中的有效的整数位**提取出来，并转换为Number ， 例子：  

  ```javascript  
  var a = "123.456px";  
  a = parseInt(a); //123  
  ```

- 第二个参数可以指定进制

  ```javascript
  parseInt('070',8)  //56
  ```

##### 3、parseFloat()  强制转换 #####

专门针对**字符串转数字**的情况，因为用Number()转字符串的时候，复杂又不合理

- 忽略**前导0和空格**，第一个不为空的字符如果不是**数字/正负号**，就返回NaN；

- 解析后续字符，**第一次遇到小数点有效，第二次就无效了**，其他非数字字符第一次就无效，返回前面的数字

- **只解析十进制**

  ```javascript
  console.log(parseFloat('  +3'));    //3
  console.log(parseFloat('  -3'));    //3
  console.log(parseFloat(''));        //NaN
  console.log(parseFloat(' '));       //NaN
  console.log(parseFloat('*12'));     //NaN
  console.log(parseFloat('123blue')); //123
  console.log(parseFloat(2.25));      //2.25
  console.log(parseFloat('2.25.4'));  //2.25
  console.log(parseFloat('0xf'));     //0，遇到十六进制都是0
  console.log(parseFloat('070'));     //70
  ```

##### 4、隐式转换  + #####

使用一元的+来进行隐式的类型转换，**原理：和Number()函数一样**

```js
var a = "123";  
a = +a;  
```

#### 3.1.3、转boolean

* 字符串 > 布尔   除了空串其余全是true
* 数值 > 布尔      除了0和NaN其余的全是true 
* null、undefined > 布尔 都是false  
* 对象 > 布尔  ，都是true  

##### 1、显式转换 #####

* Boolean()：**有6种值会被转换为false，其余均为true**

```javascript
//以下都是false
console.log(Boolean());  
console.log(Boolean(false));
console.log(Boolean(undefined));
console.log(Boolean(null));
console.log(Boolean(NaN));
console.log(Boolean(''));
console.log(Boolean(-0));
console.log(Boolean(+0));
console.log(Boolean(0));

console.log(Boolean(' '));  //true
```

##### 2、隐式转换：！！ #####

**为任意的数据类型做两次非运算，即可将其转换为布尔值**

```js
var a = "hello";  
a = !!a; //true 
```

### 3.2、如何隐式转换的？ ###

#### 1、`ToPrimitive`方法： ####

* `ToPrimitive`方法，这是 JavaScript 中每个值隐含的自带的方法，用来将值 （无论是基本类型值还是对象）转换为基本类型值

  * 如果值为基本类型，则直接返回值本身；
  * 如果值为对象，则：ToPrimitive(obj,type)

* `type`的值为`number`或者`string`。

  **（1）当**`type`**为**`number`**时规则如下：**

  * 调用`obj`的`valueOf`方法，如果为原始值，则返回，否则下一步；
  * 调用`obj`的`toString`方法，后续同上；
  * 抛出`TypeError` 异常。

  **（2）当**`type`**为**`string`**时规则如下：**

  * 调用`obj`的`toString`方法，如果为原始值，则返回，否则下一步；
  * 调用`obj`的`valueOf`方法，后续同上；
  * 抛出`TypeError` 异常。

两者的主要区别在于调用`toString`和`valueOf`的先后顺序。默认情况下：

* 如果对象为 Date 对象，则`type`默认为`string`；
* 其他情况下，`type`默认为`number`。

对于 Date 以外的对象，转换为基本类型的大概规则可以概括为一个函数：

```js
var objToNumber = value => Number(value.valueOf().toString())
objToNumber([]) === 0
objToNumber({}) === NaN
```

##### 2、toString() #####

```javascript
var a = [1,2,3]
var b = {val:4}
var c = function(x){
  return x++
}
var d = new Date()
var e = /\d+/g

console.log(a.toString());  //'1,2,3'
console.log(b.toString());  //"[object object]"
console.log(c.toString());  //'function(x){ return x++ }'
console.log(d.toString());  //Thu Apr 09 2020 17:55:26 GMT+0800 
console.log(e.toString());  ///\d+/g
```

##### 3、valueOf() #####

1. 无论是哪种数据类型，返回参数本身，类型也不会变化，唯一特殊的是**Date对象**

```javascript
var date = new Date()
console.log(date.valueOf());  //1586426466217，1970.1.1距今的毫秒数
```

2. 包装类型Number、String、Boolean，也是Object类，用valueOf后类型转换为**基本数据类型**

```javascript
var c = new Number(12)
console.log(c instanceof Number);  //true
console.log(c instanceof Object);  //true
console.log(c.valueOf());          //12
console.log(typeof c.valueOf());   //Number
```

##### 4、隐式转换发生的场景 #####

隐式类型转换主要发生在`+、-、*、/`以及`==、>、<`这些运算符之间。而**这些运算符只能操作基本类型值**，所以在进行这些运算前的第一步就是将两边的值用`ToPrimitive`转换成**基本类型**，再进行操作

#### 1、+a ####

调用**ToNumber()**，对+后面的数据进行转换

* ##### 基本数据类型： #####

  ```js
  console.log(+'12.3');    //12.3
  console.log(+'-12.3');   //-12.3
  console.log(+'');        //0
  console.log(+true);      //1
  console.log(+null);      //+0
  console.log(+undefined); //NaN
  ```

* ##### 对象： #####

  ```js
  console.log(+[]);        //0
  console.log(+[ ]);       //0
  console.log(+[1]);       //1
  console.log(+[1,2]);     //NaN
  console.log(+{});        //NaN
  console.log(+{val: 'happy'}); //NaN
  console.log(+new Date());     //1586433193168，1970.1.1距今毫秒数
  ```

####  2、二元运算符a+b `-`、`*`、`\`

left = ToPrimitive(a)，right = ToPrimitive(b)，a和b是基本数据类型的话，left = a，right = b

1. **当一侧为`String`类型，被识别为字符串拼接，并会优先将另一侧转换为字符串类型**

2. 其他情况下两边的变量都会被转换为数字。

   当一侧为`Number`类型，另一侧为**原始类型**，则将原始类型转换为`Number`类型

   两个数字相加遵循以下规则：

   1. 如果有一个操作数是 NaN，则结果是 NaN
   2. Infinity + Infinity = Infinity、(-Infinity) + (-Infinity )= -Infinity、Infinity + (-Infinity) = NaN
   3. (+0) + (+0) = +0、(-0) +(-0) = -0、(+0) + (-0) = +0

3. 当一侧为`Number`类型，另一侧为**引用类型**，将引用类型和`Number`类型转换成字符串后拼接

```javascript
console.log('1'+123);  //'1123'
console.log(null+1);   //1，两个都不是字符串，所以null转换为0，和1相加
console.log([]+[]);    //''，经过ToPrimitive得到''+'' = ''
console.log(['1']+1);  //'11'，经过ToPrimitive得到'1'+1 = '11'
console.log([]+{});    //'[object Object]'，经ToPrimitive得''+'[object Object]'
```

* `NaN`也是一个数字

```javascript
1 * '23' // 23
 1 * false // 0
 1 / 'aa' // NaN
```

#### 3、==  、 === 、!= ####

* 三等号（===）相等判断时，如果两边类型不一致时，不会做强制类型准换，直接返false

* 对于 `==` 来说，**若类型不同，否则会发生隐式转换： **    重要准则 

  * a和b为 String、Number、Boolean 中的某一类型，则使用 **ToNumber** 函数转化为 Number 类型再进行比较；
  * 有一个是Object，另一个是 String、Number、Boolean 中的某一类型，则**ToPrimitive(Object)**转换为基础数据类型，再按照上一步比较

* 会先判断是否在对比 `null` 和 `undefined`，是的话就会返回 `true`

* 判断两者类型是否为 `string` 和 `number`，是的话就会将字符串转换为 `number`

* 判断其中一方是否为 `boolean`，是的话就会把 `boolean` 转为 `number` 再进行判断

* 判断其中一方是否为 `object` 且另一方为 `string`、`number` 或者 `symbol`，是的话就会把 `object` 转为原始类型再进行判断

  <img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c451c19e23dd4726b3f36223b6c18a1e~tplv-k3u1fbpfcp-watermark.awebp" alt="img" style="zoom:50%;" />

##### 1、准则1：NaN，和其他任何类型比较永远返回`false`(包括和他自己) #####

##### 2、准则2：Boolean             Boolean < Number #####

`Boolean`和其他任何类型比较，`Boolean`首先被转换为`Number`类型

```js
//规则3
true == 1  // true 
true == '2'  // false
true == ['1']  // true
true == ['2']  // false

console.log({} == {});    
console.log([] == false);   //true
console.log([0] == 0);      //true
console.log(['0'] == 0);    //true
```

【注意】：

`undefined、null`和`Boolean`比较，虽然`undefined、null`和`false`都很容易被想象成假值，但他们比较结果是`false`，原因是**`false`首先被转换成`0`：**

```js
undefined == false  // false   bollean先被转换为number
null == false       // false
```

##### 3、准则3：String  : #####

```js
//规则3.1
123 == '123' // true
'' == 0 // true
console.log(1 == true);    //true
console.log('1' == true);  //true
console.log(0 == false);   //true
console.log('1' == 1);     //true
```

##### 4、准则4：null和undefined #####

`null == undefined`比较结果是`true`，除此之外，`null、undefined`和其他任何结果的比较值都为`false`

```js
a∈{null,undefined}且b∈{null,undefined}，返回true，有一个不属于{null,undefined}，返回false
//规则2
null == undefined // true
undefined == false // false
console.log(null == null);           //true
console.log(undefined == undefined); //true    
console.log(null == {});             //false
```

##### 5、准则5：引用类型 #####

1. a和b为 String、Number、Boolean 中的某一类型，则使用 **ToNumber** 函数转化为 Number 类型再进行比较
2. 有一个是Object，另一个是 String、Number、Boolean 中的某一类型，则ToPrimitive(Object)转换为基础数据类型，再按照上一步比较

* 依照`ToPrimitive`规则转换为原始类型：

```js
  '[object Object]' == {} // true
  '1,2,3' == [1, 2, 3] // true
```

* 判断：`[] == ![] // true`
  1. `!`的优先级高于`==`，`![]`首先会被转换为`false`
  2. `false`转换成`Number`类型`0`，左侧`[]`转换为`0`，两侧比较相等

```js
[null] == false // true
[undefined] == false // true
//规则4
console.log([0] == ['0']);  //false
console.log(+0 == 0);       //true
console.log(-0 == 0);       //true
console.log(+0 == -0);      //true
```

根据数组的`ToPrimitive`规则：

* 数组元素为`null`或`undefined`时，该元素被当做空字符串处理，所以`[null]、[undefined]`都会被转换为`0`

#### 3.2、逻辑运算符 ####

* 注意[]是为真的，所以在数组if判断时要用length

* 在`if`语句和逻辑语句中，如果只有单个变量，会先将变量转换为`Boolean`值，只有下面6种情况会转换成`false`，其余被转换成`true`：

  ```js
  null  undefined  ''   NaN  0  false   
  ```

#### 4.1、对象转Number ####

对象转数字的过程：

1. 有**valueOf()**方法，就用，结果为基本数据类型就返回，否则下一步
2. 有**toString()**方法，就用，结果为基本数据类型就返回，否则报错
3. 得到基本数据类型后，调用**ToNumber(primValue)**

```javascript
console.log(Number([1,2,3]));  //NaN
console.log(Number([]));       //0
console.log(Number([0]));      //0
console.log(Number({val:4}));  //NaN
console.log(Number({}));       //NaN
console.log(Number(function(x){ return x++ })); //NaN
console.log(Number(new Date()));
console.log(Number(/\d+/g));   //NaN
```

试着分析[]和[1,2,3]的情况

```javascript
[].valueOf() == [],不是基本数据类型
[].toString() == '',是基本数据类型
ToNumber('') == 0
```

 ```
[1,2,3].valueOf() == [1,2,3],不是基本数据类型
[1,2,3].toString() == '1,2,3',是基本数据类型
ToNumber('1,2,3') == NaN
 ```

#### 4.2、对象转字符串 ####

参考转数字的过程，有

- 有**toString()**方法，就用，结果为基本数据类型就返回，否则下一步
- 有**valueOf()**方法，就用，结果为基本数据类型就返回，否则报错
- 得到基本数据类型primValue后，调用**ToString(primValue)**，下面就很熟悉了

```javascript
console.log(String([1,2,3]));    //'1,2,3'
console.log(String([]));         //一个空格
console.log(String([0]));        //'0'
console.log(String({val:4}));    //'[object Object]'
console.log(String({}));         //'[object Object]'
console.log(String(function(x){ return x++ }));  //'function(x){ return x++ }'
console.log(String(new Date()))//'Thu Apr 09 2020 19:23:31 GMT+0800 (标准时间)'
console.log(String(/\d+/g));     //'/\d+/g'
```

#### 4.3、对象转布尔值 ####

* **都转为true！包装类型也是！**