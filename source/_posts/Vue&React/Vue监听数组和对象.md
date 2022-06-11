---
title: Vue监听数组和对象
tags: 响应式更新
categories: 1.4-框架
description: Vue如何检测数组、对象的变更
cover: >-
  https://images.unsplash.com/photo-1639301643974-0ff1efaeff87?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: 3611094049
date: 2021-12-13 15:52:31
---


## Vue监听对象和数组 ##

### 1、initData  2件事 ###

initData 里面的 observe劫持 是响应式数据核心：

1. 对定义 `data` 函数返回数据的遍历，通过 `proxy` 把每一个值 `vm._data.xxx` 都代理到 `vm.xxx` 上

2. 调用 `observe` 方法观测整个 `data` 的变化，把 `data` 也变成响应式

   对于**数组**会调用 `observeArray` 方法：遍历数组再次调用 `observe` 方法

   对**纯对象**调用 `walk` 方法：遍历对象的 key 调用 `defineReactive` 方法

### 2、这样的劫持方式对对象有什么影响？ ###

对象新增或者删除的属性无法被 set 监听到 只有对象本身存在的属性修改才会被劫持，因为：

* 必须在 `data` 对象上存在才能让 Vue 将它转换为响应式的。否则就不是响应式的；

  ```js
  var vm = new Vue({
    data:{
      a:1   // `vm.a` 是响应式的
    }
  })
  vm.b = 2   // `vm.b` 是非响应式的     数据发生了变化，但不会响应在视图上
  ```

* 解决：`Vue.set(object, propertyName, value)` 方法

  ```js
  Vue.set(vm.someObject, 'b', 2)
  // 或者
  this.$set(this.someObject,'b',2)
  ```

### 3、这样的劫持方式对数组有什么影响？ ###

#### 1、影响：`Vue` 不能检测以下变动的数组： ####

1. 当你利用索引直接设置一个项时，例如：`vm.items[indexOfItem] = newValue`
2. 当你修改数组的长度时，例如：`vm.items.length = newLength`

```js
var vm = new Vue({
  data: {
    items: ['a', 'b', 'c']
  }
})
vm.items[1] = 'x' // 不是响应性的
vm.items.length = 2 // 不是响应性的
```

#### 2、原因： ####

1. `Object.defineProperty`对数组检测是有缺陷的，不能检测到数组长度的变化，准确的说是**通过改变length**而增加的长度不能监测到
2. 性能代价和获得的用户体验收益不成正比
   1. 如果一个数组里面有上千上万个元素 每一个元素下标都添加 get 和 set 方法 。当给数组某一项赋值的时候，触发了setter的时候，数据更新又会调用一遍getter函数，如果数组长度很大也会造成性能问题
   2. 如果你知道数组的长度，理论上是可以预先给所有的索引设置getter/setter的，很多场景下我们是不知道的

#### 3、解决Array变化监听 ####

**思路：**我们知道，改变数组的方法有很多，比如说`push`方法吧，如果我们能拦截到原型上的`push`方法，是不是就可以做一些事情呢？

实现过程：

1. 先获取原生 `Array` 的原型方法
2. 对 `Array` 的原型方法做一些拦截操作：使用`Object.defineProperty` 的writable配合value，进行重写覆盖
3. 把需要被拦截的 `Array` 类型的数据原型指向改造后原型

#### 4、源码分析 数组变异实现 ####

##### 1、重写 #####

`Vue`在`array.js`中重写了`methodsToPatch`中七个方法，并将重写后的原型暴露出去：pop push shift unshift splice  sort  reverse

```js
// 定义属性函数
export function def (obj: Object, key: string, val:any,enumerable?:boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}
```

```js
// Object.defineProperty的封装
import { def } from '../util/index' 

// 获得原型上的方法
const arrayProto = Array.prototype 

// Vue拦截的方法
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

// 将上面的方法重写
methodsToPatch.forEach(function (method) {
    def(arrayMethods, method, function mutator (...args) {
        console.log('method', method); // 获取方法
        console.log('args', args); // 获取参数
        switch (method) {
          case 'push':
          case 'unshift':
            inserted = args
            break
          case 'splice':
            inserted = args.slice(2)
            break
        }
    	// ...功能如上述，监听到某个方法执行后，做一些对应的操作
      	// 1、将开发者的参数传给原生的方法，保证数组按照开发者的想法被改变
        // 2、视图更新等通过notify更新视图。inserted代表新数据插入，需要对新数据进行obsserve
    if (inserted) ob.observeArray(inserted)
    ob.dep.notify()
    return result
    })
})
export const arrayMethods = Object.create(arrayProto);
```

##### 2、observer #####

* 在进行数据`observer`绑定的时候，我们先判断是否`hasProto`，如果存在`__proto__`，就直接将`value` 的 `__proto__`指向重写过后的原型
* 如果不能使用 `__proto__`，就直接循环 `arrayMethods`把它身上的这些方法直接装到 `value` 身上好了。毕竟调用某个方法是先去自身查找，当自身找不到这关方法的时候，才去原型上查找
* 没有直接修改 `Array.prototype`，而是直接把 `arrayMenthods` 赋值给 `value` 的 `__proto__` 。因为这样不会污染全局的Array， `arrayMenthods` 只对 `data`中的`Array` 生效

```js
// 判断是否有__proto__，因为部分浏览器是没有__proto__
const hasProto = '__proto__' in {}
// 重写后的原型
import { arrayMethods } from './array'
// 方法名
const arrayKeys = Object.getOwnPropertyNames(arrayMethods);

// 数组的处理
export function observeArray (value) {
    // 如果有__proto__，直接覆盖                
    if (hasProto) {
        protoAugment(value, arrayMethods);
    } else {
        // 没有__proto__就把方法加到属性自身上
        copyAugment(value, arrayMethods, )
    }
}

// 原型的赋值
function protoAugment (target, src) {
    target.__proto__ = src;
}

// 复制
function copyAugment (target, src, keys) {
    for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i]
        def(target, key, src[key]);
    }
}
```