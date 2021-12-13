---
title: Vue的生命周期
date: 2021-12-11 22:55:23
tags: 生命周期
categories: React&&Vue
description: 'Vue的生命周期及常见问题'
cover: https://images.unsplash.com/photo-1633040245231-1ae5f7f51392?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80
copyright_author: 飞儿 # 作者覆写
copyright_url: https://www.nesxc.com/post/hexocc.html 
license: CC BY-NC-SA 4.0
license_url: https://creativecommons.org/licenses/by-nc-sa/4.0/
---
## 生命周期 ##

### 1. 概念 ###

* Vue 实例有一个完整的生命周期，也就是从开始创建、初始化数据、编译模版、挂载 Dom -> 渲染、更新 -> 渲染、卸载等一系列过程

* <img src="https://img-blog.csdnimg.cn/20200418101911580.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0NDX1RvZ2V0aGVy,size_16,color_FFFFFF,t_70" alt="图片转自coderwhy老师" style="zoom: 33%;" />

### 2. 各个钩子的作用 ###

**过程：**均不可用——初始数据获取，方法——虚拟Dom创建 ——el完成挂载，真实DOM创建——Diff算法，打补丁——更新数据

##### 1）beforeCreate： #####

* 在**实例初始化之后**，数据观测(data observer) 和 event/watcher 事件配置之前被调用
* 特点： data、methods、computed 以及 watch 上的数据和方法都不能被访问

##### 2）created： #####

* 实例已完成以下的配置：
  * **数据劫持 (data observer)，属性和方法**的运算。
  * 数据已经和**data属性绑定**（放在data中的属性将来值发生改变的同时，视图也会改变）
* 此时操作数据，不会触发update函数，一般在这里做初始数据的获取，且相比在 beforeMount 获取数据页面渲染速度较快
* 然而，**`$el` 属性**目前尚不可用。如果非要想与 Dom 进行交互，可以通过 vm.$nextTick 来访问 Dom

##### 3）beforeMount #####

* 在挂载开始之前被调用：

  相关的 `render` 函数首次被调用。

  **虚拟dom 创建完成，真实 dom未完成挂载**，这里更改数据不会触发 update函数，这里是渲染前最后一次更改数据的机会，在这里也可以做初始数据的获取

##### 4）mounted： #####

* 实例完成的配置：
  * **完成了挂载，这时 `el`** 被新创建的 `vm.$el` 替换了。
  * **数据、真实dom**都已经处理，一般在这里初始化一些操作真实 dom 的方法
* 注意：此阶段不会保证所有的子组件也都一起被挂载，如果你希望等到整个视图都渲染完毕，可以在 `mounted` 内部使用 [vm.$nextTick](https://cn.vuejs.org/v2/api/#vm-nextTick)

##### 5）beforeUpdate： #####

* 时机：当组件或实例的数据更改，会立即执行beforeUpdate，发生在虚拟 DOM 打补丁之前

* 特点：可以监听到 **data 变化，但view层的数据还没有变化**

* 适合：在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器

##### 6）updated： #####

* 时机：完成虚拟 DOM 重新渲染和打补丁后，来到这个钩子

* 特点：

  * 此时组件 DOM 已经更新，可以操作更新后的虚拟dom，view层的数据重新渲染完成；

  * 应该避免在此期间更改状态，如果要相应状态改变，通常最好使用[计算属性](https://cn.vuejs.org/v2/api/#computed)或 [watcher](https://cn.vuejs.org/v2/api/#watch) 取而代之；

  * **不会**保证所有的子组件也都一起被重绘。如果你希望等到整个视图都重绘完毕，可以在 `updated` 里使用 [vm.$nextTick](https://cn.vuejs.org/v2/api/#vm-nextTick)：

##### 7）beforeDestroy： #####

* 时机：实例销毁之前调用，实例仍然完全可用
* 工作：做一些善后工作，例如**清除计时器、数据和事件的监听等 ** 

##### 8）destroyed： #####

* 时机：实例销毁后调用，对应 Vue 实例的所有指令都被解绑，所有的事件监听器被移除，所有的子实例也都被销毁。

##### 9）activated：被 keep-alive 缓存的组件激活时调用 #####

* keep-alive：当在组件之间切换的时候，你有时会想保持这些组件的状态，以避免反复重渲染导致的性能问题

##### 10）deactivated：被 keep-alive 缓存的组件停用时调用 #####

##### 11）errorHandler：被 keep-alive 缓存的组件停用时调用 #####

* 指定组件的渲染和观察期间未捕获错误的处理函数。这个处理函数被调用时，可获取错误信息和 Vue 实例

  ```php
  Vue.config.errorHandler = function (err, vm, info) {}
  ```

##### 12）errorCaptured #####

* 当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 false 以阻止该错误继续向上传播
* 触发时机都是相同的，不同的是 errorCaptured 发生在前，且如果某个组件的 errorCaptured 方法返回了 false，那么这个异常信息不会再向上冒泡也不会再调用 errorHandler 方法

### 3. 常见问题 ###

#### 1. 调用异步请求 ####

* 可以 created、beforeMount、mounted 中调用：在这三个钩子函数中，**data 已经创建**，可以将服务端端返回的**数据进行赋值。**
* 如果异步请求不需要依赖 Dom 推荐在 **created** 钩子函数中调用异步请求，因为在 created 钩子函数中调用异步请求有以下优点：
  * 能更快获取到服务端数据，减少页面  loading 时间；
  * ssr  不支持 beforeMount 、mounted 钩子函数，所以放在 created 中有助于一致性；

#### 2. el选项对生命周期影响： ####

* **没有el选项，则停止编译**，也意味着暂时停止了生命周期。生命周期到created就结束了

* 而当我们不加el选项，但是手动执行`vm.$mount(el)`方法的话，也能够使暂停的生命周期进行下去

* `template`和`HTML`的优先级：

  >结论

  1. 如果Vue实例对象中有template参数选项，则将其作为模板编译成render函数
  2. 如果没有template参数选项，则将外部的HTML作为模板编译（template），也就是说，template参数选项的优先级要比外部的HTML高
  3. 如果1,2条件都不具备，则报错

  >注意

  1. Vue需要通过el去找对应的template，Vue实例通过el的参数，首先找自己有没有template，如果没有再去找外部的html，找到后将其编译成render函数。
  2. runtime-only也可以直接调用[render](https://cn.vuejs.org/v2/api/#render)选项，优先级：`render函数选项  > template参数  > 外部HTML`

### 4. 父子组件 ###

* #### 执行顺序： ####

  * 加载渲染过程：父要等子的挂载

    `父beforeCreate `----`父created`------`父beforeMounted`------`子beforeCreate `------`子created`------`子beforeMounted`---`子mounted`------`父mounted`

  * 子组件更新过程：父要等子的更新

    `父beforeUpdate`----`子beforeUpdate`---`子updated`---`父updated`

  * 父组件更新过程

    `父 beforeUpdate` -> ` 父 updated`

  * 销毁过程

    `父beforeDestroy`----`子beforeDestroy`----`子destroyed`----`父destroyed`

* #### 数据传输流程： ####

  * 当子组件被点击后，会向外emit一个事件，父组件会监听这个自定义事件，methods里改变data的list
  * 这个list会由于单向数据流，传递给子组件
  * 所以子组件列表渲染好了，此时父组件才整个更新：`父beforeUpdate`----`子beforeUpdate`---`子updated`---`父updated`

* #### 场景设计： ####

  **层级：**父--子--孙  3级层级组件

  **需求：**在组件显示在页面上之后，再将数据初始化进行回显。父组件获取数据后传递到子组件，要求子组件根据这个值将内部元数据进行加工，那么**在子组件中什么时机下才能获取父组件传递过来的新值呢？**

  **分析：**

  1. 子组件挂载完成后，父组件还未挂载。所以组件数据回显的时候，在父组件`mounted`中获取api的数据，子组件的`mounted`是拿不到的
  2. 发现`created`这个钩子是按照从外内顺序执行，所以**回显场景**的解决方案是：在created中发起请求获取数据，依次在子组件的created中会接收到这个数据
  3. 问题在于如何在子组件中知道远程数据回来了，并且通过对远程数据的加工处理，最终形成正确的回显