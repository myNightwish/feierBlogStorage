---
title: Vue的双向绑定
tags: 双向绑定
categories: React&&Vue
description: Vue中的双向绑定原理实现
cover: >-
  https://images.unsplash.com/photo-1639330721108-fcce4394f608?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: 3598970227
date: 2021-12-13 15:44:12
---
总结：Vue 内部通过 `Object.defineProperty`方法属性拦截的方式，把 `data` 对象里每个数据的读写转化成 `getter`/`setter`，当数据变化时通知视图更新

<img src="https://user-gold-cdn.xitu.io/2019/8/1/16c4a3ce0cc709da?imageView2/0/w/1280/h/960/format/webp/ignore-error/1" alt="4.png" style="zoom:50%;" />

## 一、什么是 MVVM 数据双向绑定 ##

`MVVM` 数据双向绑定主要是指：数据变化更新视图，视图变化更新数据

* 输入框内容变化时，`Data` 中的数据同步变化。即 `View` => `Data` 的变化。  **事件监听**
* `Data` 中的数据变化时，文本节点的内容同步变化。即 `Data` => `View` 的变化

我们会通过实现以下 4 个步骤，来实现数据的双向绑定：

<img src="https://user-gold-cdn.xitu.io/2019/8/1/16c4a3ce0bcb0d91?imageView2/0/w/1280/h/960/format/webp/ignore-error/1" alt="3.png" style="zoom:50%;" />

1、实现一个监听器 `Observer` ，用来劫持并监听所有属性，如果属性发生变化，就通知订阅者；

2、实现一个订阅器 `Dep`，用来收集订阅者，对监听器 `Observer` 和 订阅者 `Watcher` 进行统一管理；

3、实现一个订阅者 `Watcher`，可以收到属性的变化通知并执行相应的方法，从而更新视图；

4、实现一个解析器 `Compile`，可以解析每个节点的相关指令，对模板数据和订阅器进行初始化。

## 二、监听器 Observer 实现 ##

监听器 `Observer` 的实现，主要是指让数据对象变得“可观测”，即每次数据读或写时，我们能感知到数据被读取了或数据被改写了。`Vue 2.0` 源码中用到 `Object.defineProperty()` 来劫持各个数据属性的 `setter / getter`

### 2.1、Object.defineProperty() 语法 ###

**（1）参数**

* `obj`：要在其上定义属性的对象
* `prop`：要定义或修改的属性的名称
* `descriptor`：将被定义或修改的属性描述符

**（2）返回值 ** 被传递给函数的对象

**（3）属性描述符**

`Object.defineProperty()` 为对象定义属性，分 数据描述符 和 存取描述符 ，两种形式不能混用

**数据描述符和存取描述符均具有以下可选键值：**

* `configurable`：当且仅当该属性的 `configurable` 为 `true` 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。**默认为 false**

* `enumerable`：当且仅当该属性的 `enumerable` 为 `true` 时，该属性才能够出现在对象的枚举属性中。**默认为 false**

**数据描述符具有以下可选键值**：

* `value`：该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。**默认为 undefined**

* `writable`：当且仅当该属性的 `writable` 为 `true` 时，`value`才能被赋值运算符改变。**默认为 false**

**存取描述符具有以下可选键值**：

* `get`：一个给属性提供 `getter` 的方法，如果没有 `getter` 则为 `undefined`。当访问该属性时，该方法会被执行，方法执行时没有参数传入，但是会传入`this`对象（由于继承关系，这里的`this`并不一定是定义该属性的对象）。默认为 `undefined`。

* `set`：一个给属性提供 `setter` 的方法，如果没有 `setter` 则为 `undefined`。当属性值修改时，触发执行该方法。该方法将接受唯一参数，即该属性新的参数值。默认为 `undefined`。

### 2.2、监听器 Observer 实现 ###

* #### 梳理： ####

  完成了数据的'可观测'，即我们知道了数据在什么时候被读或写了，那么，我们就可以在数据被读或写的时候通知那些依赖该数据的视图更新了

* **遍历+Object.defineProperty() **：让数据对象的所有属性都变得可观测：

  ```js
  //循环遍历数据对象的每个属性
  function observable(obj) {
      if (!obj || typeof obj !== 'object') return;
      let keys = Object.keys(obj);
      keys.forEach((key) => {
          defineReactive(obj, key, obj[key])
      })
      return obj;
  }
  
   // 将对象的属性用 Object.defineProperty() 进行设置
  function defineReactive(obj, key, val) {
      Object.defineProperty(obj, key, {
          get() {
              console.log(`${key}属性被读取了...`);
              return val;
          },
          set(newVal) {
              console.log(`${key}属性被修改了...`);
              val = newVal;
          }
      })
  }
  ```

## 三、订阅器 Dep 实现 ##

### 1、梳理： ###

1. 创建一个依赖收集容器，也就是消息订阅器 `Dep`，用来容纳所有的“订阅者”

2. 当数据变化的时候后执行对应订阅者的更新函数

### 2、实现 ###

#### Dep的构成 ####

```js
function Dep () {
    this.subs = [];
}
Dep.prototype = {
    addSub: function(sub) {
        this.subs.push(sub);
    },
    notify: function() {
        this.subs.forEach(function(sub) {
            sub.update();
        });
    }
};
Dep.target = null;
```

* #### Dep添加的时机 ####

再将 **`defineReactive` 函数进行改造一下，向其植入订阅器**：

* 设计了一个订阅器 `Dep` 类，该类里面定义了一些属性和方法

* 特别注意的是它有一个静态属性 `Dep.target`，这是一个全局唯一 的`Watcher`，因为在同一时间只能有一个全局的 `Watcher` 被计算，另外它的自身属性 `subs` 也是 `Watcher` 的数组

```js
defineReactive: function(data, key, val) {
	var dep = new Dep();
	Object.defineProperty(data, key, {
		enumerable: true,
		configurable: true,
		get: function getter () {
			if (Dep.target) {
				dep.addSub(Dep.target);
			}
			return val;
		},
		set: function setter (newVal) {
			if (newVal === val) {
				return;
			}
			val = newVal;
			dep.notify();
		}
	});
}
```

## 四、订阅者 Watcher 实现 ##

1. 订阅者 `Watcher` 是一个 类，在它的构造函数中，定义了一些属性：

   * **vm：**一个 Vue 的实例对象；
   * **exp：**是 `node` 节点的 `v-model` 等指令的属性值 或者插值符号中的属性。如 `v-model="name"`，`exp` 就是`name`;
   * **cb：**是 `Watcher` 绑定的更新函数;

2. 运行过程：3个过程

   1. 当我们去实例化一个渲染 `watcher` 的时候，首先进入 `watcher` 的构造函数逻辑，就会执行它的 `this.get()` 方法，进入 `get` 函数，实际上就是把 `Dep.target` 赋值为当前的渲染 `watcher` 

      ```
      Dep.target = this;  // 将自己赋值为全局的订阅者
      ```

   2. 触发数据对象的 `getter`

      ```
      let value = this.vm.data[this.exp]  // 强制执行监听器里的get函数
      ```

      每个对象值的 `getter` 都持有一个 `dep`，在触发 `getter` 的时候会调用 `dep.depend()` 方法，也就会执行`this.addSub(Dep.target)`，即把当前的 `watcher` 订阅到这个数据持有的 `dep` 的 `watchers` 中，至此完成了一个依赖收集的过程

   3. 完成依赖收集后，还需要把 `Dep.target` 恢复成上一个状态，即：

      ```
      Dep.target = null; 
      ```

3. 而 `update()` 函数是用来当数据发生变化时调用 `Watcher` 自身的更新函数进行更新的操作。先通过 `let value = this.vm.data[this.exp];` 获取到最新的数据,然后将其与之前 `get()` 获得的旧数据进行比较，如果不一样，则调用更新函数 `cb` 进行更新。

```js
function Watcher(vm, exp, cb) {
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;
    this.value = this.get();  // 将自己添加到订阅器的操作
}

Watcher.prototype = {
    update: function() {
        this.run();
    },
    run: function() {
        var value = this.vm.data[this.exp];
        var oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal);
        }
    },
    get: function() {
        Dep.target = this; // 全局变量 订阅者 赋值
        var value = this.vm.data[this.exp]  // 强制执行监听器里的get函数
        Dep.target = null; // 全局变量 订阅者 释放
        return value;
    }
};
```

## 五、解析器 Compile 实现 ##

### 1、梳理 ###

将来这个节点的这个数据改变了，你要执行这个函数

1. 解析模板指令，并替换模板数据，初始化视图
2. 实例化watcher，将模板指令对应的节点绑定对应的更新函数

### 2、实现 ###

* 下面对 '{{变量}}' 这种形式的指令处理的关键代码进行分析，感受解析器 `Compile` 的处理逻辑

  ```js
  compileText: function(node, exp) {
  	var self = this;
  	var initText = this.vm[exp]; // 获取属性值
  	this.updateText(node, initText); // dom 更新节点文本值
      // 将这个指令初始化为一个订阅者，后续 exp 改变时，就会触发这个更新回调，从而更新视图
  	new Watcher(this.vm, exp, function (value) { 
  		self.updateText(node, value);
  	});
  }
  ```

## 六、源码分析 ##

从 `Vue` 源码层面分析监听器 `Observer` 、订阅器 `Dep` 、订阅者 `Watcher` 的实现

### 6.1、监听器 Observer 实现 ###

核心就是利用 `Object.defineProperty` 给数据添加了 `getter` 和 setter，目的就是为了在我们访问数据以及写数据的时候能自动执行一些逻辑 。

#### （1）initState ####

* 在 `Vue` 的初始化阶段，`_init` 方法执行的时候，会执行 `initState(vm)` 方法，它的定义在 `src/core/instance/state.js` 中，分别对`data`、`prop`、`computed`进行初始化，让其变成响应式

* #### 过程： ####

  * 初始化`props`：对所有`props`进行遍历，Observe调用`defineReactive`函数，将每个 prop 属性值变成响应式，然后将其挂载到`_props`中，然后通过代理，把`vm.xxx`代理到`vm._props.xxx`实例中
  * 初始化`data`时：与`prop`相同，对所有`data`进行遍历，调用`defineReactive`函数，将每个 data 属性值变成响应式，然后将其挂载到`_data`中，然后通过代理，把`vm.xxx`代理到`vm._data.xxx`中
  * 初始化`computed`，首先创建一个观察者对象`computed-watcher`，然后遍历`computed`的每一个属性，对每一个属性值调用`defineComputed`方法，使用`Object.defineProperty`将其变成响应式的同时，将其代理到组件实例上，即可通过`vm.xxx`访问到`xxx`计算属性

```js
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```

#### （2）initData  2件事 ####

1. 对定义 `data` 函数返回对象的遍历，通过 `proxy` 把每一个值 `vm._data.xxx` 都代理到 `vm.xxx` 上
2. 调用 `observe` 方法观测整个 `data` 的变化，把 `data` 也变成响应式

```js
function initData (vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(key)) {
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  observe(data, true /* asRootData */)
}
```

#### **（3）observe** ####

* **功能：**监测数据的变化，它的定义在 `src/core/observer/index.js` 中：
* 做法：给非 VNode 的对象类型数据添加一个 `Observer`，如果已经添加过则直接返回，否则在满足一定条件下去实例化一个 `Observer` 对象实例

```js
export function observe (value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
```

#### **（4）Observer** ####

* 是一个类，它的作用是给对象的属性添加 getter 和 setter，用于依赖收集和派发更新：

* `Observer` 的构造函数逻辑：

  1. 首先实例化 `Dep` 对象， `Dep` 对象

  2. 接下来会对 `value` 做判断：

     对于**数组**会调用 `observeArray` 方法：遍历数组再次调用 `observe` 方法

     对**纯对象**调用 `walk` 方法：遍历对象的 key 调用 `defineReactive` 方法

```js
xport class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}
```

#### （5）defineReactive ####

* **功能：**定义一个响应式对象，给对象动态添加 `getter` 和 `setter`，它的定义在 `src/core/observer/index.js` 中：
* **做法：**最开始初始化 `Dep` 对象的实例，接着拿到 `obj` 的属性描述符，然后对子对象递归调用 `observe` 方法，这样就保证了无论 `obj` 层级多深，访问或修改 `obj` 中一个嵌套较深的属性，也能触发 getter 和 setter

```js
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
 
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
 
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}
```

### 6.2、订阅器 Dep 实现 ###

* 订阅器`Dep` 是整个 `getter` 依赖收集的核心，它的定义在 `src/core/observer/dep.js` 中：

* 特别注意的是它有一个静态属性 `target`，这是一个全局唯一 `Watcher`，这是一个非常巧妙的设计，因为在同一时间只能有一个全局的 `Watcher` 被计算，

* 另外它的自身属性 `subs` 也是 `Watcher` 的数组。`Dep` 实际上就是对 `Watcher` 的一种管理，`Dep` 脱离 `Watcher` 单独存在是没有意义的

  ```js
  export default class Dep {
    static target: ?Watcher;
    id: number;
    subs: Array<Watcher>;
  
    constructor () {
      this.id = uid++
      this.subs = []
    }
  
    addSub (sub: Watcher) {
      this.subs.push(sub)
    }
  
    removeSub (sub: Watcher) {
      remove(this.subs, sub)
    }
  
    depend () {
      if (Dep.target) {
        Dep.target.addDep(this)
      }
    }
  
    notify () {
      // stabilize the subscriber list first
      const subs = this.subs.slice()
      if (process.env.NODE_ENV !== 'production' && !config.async) {
        subs.sort((a, b) => a.id - b.id)
      }
      for (let i = 0, l = subs.length; i < l; i++) {
        subs[i].update()
      }
    }
  }
  
  Dep.target = null
  ```

### 6.3、订阅者 Watcher 实现 ###

* 订阅者`Watcher` 的一些相关实现，它的定义在 `src/core/observer/watcher.js` 中

* #### 实现过程： ####

  `Watcher` 是一个 `Class`，在它的构造函数中，定义了一些和 `Dep` 相关的属性 ，其中，`this.deps` 和 `this.newDeps` 表示 `Watcher` 实例持有的 `Dep` 实例的数组；而 `this.depIds` 和 `this.newDepIds` 分别代表 `this.deps` 和 `this.newDeps` 的 `id` Set 。当我们去实例化一个渲染 `watcher` 的时候

  1. 首先进入 `watcher` 的构造函数逻辑，然后会执行它的 `this.get()` 方法，进入 `get` 函数，首先会执行：把 `Dep.target` 赋值为当前的渲染 `watcher` 并压栈（为了恢复用）

     ```
     pushTarget(this)
     ```

  2. 触发了数据对象的 `getter` 

     ```
     value = this.getter.call(vm, vm)
     ```

  3. 每个对象值的 `getter` 都持有一个 `dep`，在触发 `getter` 的时候会调用 `dep.depend()` 方法，也就会执行 `Dep.target.addDep(this)`。这个时候 `Dep.target` 已经被赋值为渲染 `watcher`

     ```
     addDep (dep: Dep) {
       const id = dep.id
       if (!this.newDepIds.has(id)) {
         this.newDepIds.add(id)
         this.newDeps.push(dep)
         if (!this.depIds.has(id)) {
           dep.addSub(this)
         }
       }
     }
     ```

     * 这时候会做一些逻辑判断（保证同一数据不会被添加多次）后执行 `dep.addSub(this)`，那么就会执行 `this.subs.push(sub)`
     * 所以在 `vm._render()` 过程中，会触发所有数据的 `getter`，这样实际上已经完成了一个依赖收集的过程。

  4. 当我们在组件中对响应的数据做了修改，就会触发 `setter` 的逻辑，最后调用 `watcher` 中的 `update` 方法：对于 `Watcher` 的不同状态，会执行不同的更新逻辑

     ```js
       update () {
         if (this.lazy) {
           this.dirty = true
         } else if (this.sync) {
           this.run()
         } else {
           queueWatcher(this)
         }
       }
     ```

* #### 3类watcher： ####

  1. `normal-watcher`：在组件钩子函数`watch`中定义，即监听的属性改变了，都会触发定义好的回调函数

  2. `computed-watcher`：在组件钩子函数`computed`中定义的，每一个`computed`属性，最后都会生成一个对应的`Watcher`对象

     特点：当计算属性依赖的数据改变时，才会重新计算，即具备`lazy`（懒计算）特性

  3. `render-watcher`：每一个组件都会有一个`render-watcher`, 当`data/computed`中的属性改变的时候，会调用该`Watcher`来更新组件的视图。

  **执行顺序：**computed-render ---------> normal-watcher ------> render-watcher

  * 目的：尽可能的保证，在更新组件视图的时候，computed 属性已经是最新值了，如果 render-watcher 排在 computed-render 前面，就会导致页面更新的时候 computed 值为旧数据

```js
export default class Watcher {
  vm: Component;
  expression: string;
  cb: Function;
  id: number;
  deep: boolean;
  user: boolean;
  lazy: boolean;
  sync: boolean;
  dirty: boolean;
  active: boolean;
  deps: Array<Dep>;
  newDeps: Array<Dep>;
  depIds: SimpleSet;
  newDepIds: SimpleSet;
  before: ?Function;
  getter: Function;
  value: any;

  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm
    if (isRenderWatcher) {
      vm._watcher = this
    }
    vm._watchers.push(this)
    // options
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
      this.before = options.before
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    this.dirty = this.lazy // for lazy watchers
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = noop
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
    this.value = this.lazy
      ? undefined
      : this.get()
  }
   。。。。。。
}
```

