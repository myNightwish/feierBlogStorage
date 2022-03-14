---
title: React的虚拟DOM
tags: 虚拟DOM
categories: React&&Vue
description: 兄弟篇React的虚拟DOM，包括了栈调和
cover: >-
  https://images.unsplash.com/photo-1639327771356-e2bde8814883?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1333&q=80
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: 2621268747
date: 2021-12-13 15:45:54
---
## 5、虚拟DOM ##

### 1、what、how ###

* 虚拟DOM是什么？

  虚拟Dom本质上是JS和Dom之间的一个映射缓存，在形态上表现为：一个能够描述Dom结构及其属性信息的JS对象。

  是JS对象 2.是对Dom的描述

  <img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211122012139311.png" alt="image-20211122012139311" style="zoom:33%;" />

* #### 挂载阶段 ####

  React将结合JSX的描述，构建出虚拟的Dom树，然后通过ReactDom.render()将虚拟DOM映射到真实Dom（触发渲染流水线）

* #### 更新阶段 ####

  页面的变化会先作用于虚拟Dom，虚拟Dom将在JS层借助算法先对比出具体有哪些真实Dom需要做改变，然后再将这些改变作用于真实Dom

### 2、why ###

为什么需要虚拟Dom，虚拟Dom是否伴随着更好的性能？虚拟Dom的优势何在？

虚拟Dom在历史开发场合的位置：

1. 人肉可见的Dom时期：原生JS支配下的“展示”属性远远强于其“交互”的属性

   这就导致了JS的定位只能是“辅助”，在很长时间里，开发者花费很多时间实现静态的Dom，待结束后再补充少量的JS，简单的业务需求不需要做过多的Dom操作

2. jquery时期：大量Dom操作需求带来的前端开发量激增

   简单的交互效果已无法满足用户体验，与之而来的是大量Dom操作需求带来的前端开发量激增。原生JS提供的API不好使，jquery解决了这个问题，将DomAPI封装成了简单优雅的形式，同时做掉了浏览器的兼容工作，并且提供了链式API调用、插件扩展等一系列能力用于进一步解决生产力。

   * jquery并不能从根本上解决Dom操作量过大情况下前端一侧的压力；

3. 模板引擎方案，它更倾向于点对点解决繁琐DOM操作的问题，它在能力、定位上既不能够、也不打算替换掉jquery，两者和谐共存的。因此，并不存在模板引擎时期，只有模板引擎方案

   1. 读取HTML模板并解析它，分离出其中的JS信息；
   2. 将解析出的内容拼接成字符串，动态生成JS代码
   3. 运行动态生成的JS代码，吐出“目标HTML"
   4. 将目标HTML赋值给innerHtml，触发渲染流水线，完成真实DOM渲染

   * 这种方案只需要关注：数据和数据变化本身，Dom层面的改变会帮我们做；
   * 可惜的是：它实际应用场局限在，实现高效的字符串拼接这个点上而不能去做太复杂的事情。对真实Dom的修改过于大刀阔斧，也没有缓冲这些概念，存在糟糕的性能
   * 他是虚拟DOM思想推广之前的一种方案。

4. 数据驱动视图：操作假DOM

   传统时期、虚拟DOM时期的：

   <img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211122012152399.png" alt="image-20211122012152399" style="zoom: 20%;" /><img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211122012205531.png" alt="image-20211122012205531" style="zoom:20%;" />

   这里并不是一定是模板，比如reatc中使用的JSX。

   * JSX本质不是模板，而是一种使用体验跟模板接近的JS语法糖，区别在于多出了一个虚拟DOm作为中间的缓冲层。缓冲层带来的优点是：当DOM操作频繁时，它会现将前后两次的Dom树记性对比，定位出具体需要更新的部分，生成补丁集，再将补丁打在需要更新的真实Dom上，实现精准更新

     <img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211122012306949.png" alt="image-20211122012306949" style="zoom:20%;" />

### 3、用虚拟Dom是为了更好的性能吗 ###

* 虚拟Dom是前端开发者为了追求更好的研发体验、研发效率而创造出来的高阶产物；
* 它也不是React的卖点。
* 性能问题是比较复杂的，在量化的时候要结合各阶段、各种要素来分情况讨论。

#### 1、对比渲染步骤对比： ####

1. 本质是字符换的拼接，对性能的消耗是有限的；
2. 而虚拟DOm的构建、diff算法过程比较复杂，不可避免的涉及递归、遍历耗时操作；
3. 这一步，都是更新的行为，因此模板渲染是全量更新、虚拟~是差量更新。

* 但是，当数据内容变化很大，二者差量计算相近，而虚拟~会有更多的性能消耗。
* 所以虚拟Dom的劣势主要在于**JS计算耗时**，而Dom操作的能耗、JS计算的能耗不再一个量级。少量的Dom操作就能抵大量的JS计算。
* 在实际场景中，setState修改少量的数据。

#### 2、虚拟Dom的价值不在于性能，而在于别处 ####

它解决了什么问题呢？

1. 研发效率、研发体验的追求；

   它的出现为数据驱动视图这一思想提供了落地的载体，对前端能够基于函数式的编程方式实现高效的声明式编程；

2. 跨平台的问题

   虚拟~是对真实内容的一种抽象，如果没有这一层抽象，那么视图层会和渲染平台紧密耦合在一起，为了描述同样的视图内容，需要在web端和native端写完全不同的两套、代码；

   同一套虚拟Dom可以对接多套渲染平台，多端运行，这同样是提高开发效率的一种体现

3. 性能方面的：批量更新

   在通用虚拟Dom库里是由batch函数处理的,缓存每次生成的补丁集，再将最终的补丁集进行渲染到真实Dom

### 4、15栈调和--diff ###

* 调和：也叫协调。Virtual Dom是一种编程概念，在这个概念里，UI以一种理想化的或者说**“虚拟的”**表现形式存在于内存中，并通过如ReactDom等类库使之与**真实的Dom**同步，这一过程叫做**“调和”**。因此，调和也是把虚拟dom映射为真实Dom的过程。

* React15的栈调和、React16的Fiber调和

* **diff是找不同的过程，二者不是一个概念。**它是调和过程中的一环。

* React将源码划分为了3部分：

  core：

  render：

  reconciler：（调和器），这一路径中调和器所做的工作，包括组件的挂载、卸载、更新（涉及diff）过程等

* diff是调和过程中重要的一环，因此很多人也将调和过程默认为diff过程

#### 1、diff策略的设计思想 ####

要想找出两个树结构之间的不同：

* **传统的方法**是通过循环递归进行树节点的一一对比。O(N^3)
* 为了将复杂度降低至o(N)，React确定了两个大前提：
  1. 若组件属于同一类型，他们将拥有相同的Dom树形结构
  2. 处于同一层级的一组子节点，可用通过设置key作为唯一标识，从而维护各个节点在不同渲染过程中的稳定性
  3. React实践的规律：Dom节点之间的跨层级操作并不多，同层级操作是主流

#### 2、Diff逻辑拆分解读 ####

1. Diff算法性能突破的关键点在于“分层对比”

   只需要完成从上到下的一次遍历，就可以完成对比，降低复杂度的重要量级对比

   虽然栈调和将传统的树对比算法优化为了分层对比，但整个算法仍然是以递归的形式运转，分层递归也是递归，如果真的发生了跨层级操作，这种非主流操作，React并不能判断行为，要销毁+重建，因此react官方也要求开发者不要做跨层级的操作，尽量保持层级的稳定性。

2. 类型一致的节点才有继续diff的必要性

   一刀切。抓主要矛盾，只有确认类型相同，才会在更深层次做对比，减少diff过程中的冗余操作

3. key属性的设置，可以帮我们尽可能重用同一层级的节点

   key是帮助react识别哪些内容被更改、添加或删除的。key需要写在用数组渲染出来的元素内部，并需要给其一个稳定的值。稳定很重要，因为如果key值发生了改变，React会触发UI重渲染

### 5、batch 批处理机制 --- setState ###

```jsx
state = {
  count: 0
}
increment = () => {
  console.log('increment setState前的count', this.state.count); // 0
  this.setState({
    count: this.state.count+1
  });
  console.log('increment setState后的count', this.state.count); //0 
}
triple = () => {
  console.log('triple setState前的count', this.state.count); //1
  this.setState({
    count: this.state.count+1
  });
  this.setState({
    count: this.state.count+1
  });
  this.setState({
    count: this.state.count+1
  });
  console.log('triple setState后的count', this.state.count);//1
}

reduce = () => {
  setTimeout(() => {
    console.log('reduce setState前的count', this.state.count);//2
    this.setState({
      count: this.state.count+1
    });
    console.log('reduce setState后的count', this.state.count); //1
  }, 0);
}
```

```jsx
render(){
  return(
    <div>
      <button onClick = {this.increment}>点我增加</button>
      <button onClick = {this.triple}>点我增加3倍</button>
      <button onClick = {this.reduce}>点我减少</button>
    </div>
  )
}
```

#### 1、setState异步的动机和原理 ####

* state到底是哪个环节发生变化的呢？到底同步还是异步的呢？

1. 一般的更新流程，render本身涉及dom操作，带来性能开销

   <img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211122133334696.png" alt="image-20211122133334696" style="zoom:25%;" />

2. 假如每次setState都触发一次完整的更新流程，视图可能没刷新几次就卡死了

   <img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211122133348906.png" alt="image-20211122133348906" style="zoom:25%;" />

**所以setState异步的动机就来源于 避免频繁的renrender**：

* 它的实现机制就类似于Vue中的nextTick和浏览器的EventLoop。每来一个setState。就把它塞入一个队列里**攒起来**，**等时机成熟**，再将攒起来的state结果做合并。最后只针对最新的State值走一次更新流程

因此，即使100次，也之后增加入队次数，并不会带来频繁的renderer。当100次调用完毕之后，也只是100次任务队列的内容发生了变化，而count本身并不会立刻改变

```jsx
test =() => {
  console.log('循环100次 setState前的count：', this.state.count);
  for(let i = 0; i< 100; i++){
    this.setState({
      count: this.setState.count+1
    })
  }
  console.log('循环100次 setState后的count：', this.state.count);
}
```

<img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211122133403091.png" alt="image-20211122133403091" style="zoom:25%;" />

#### 2、setState工作流 --- 批量更新 ####

在setTimeout的保护下，它似乎有了同步的现象。为什么会这样呢？

并不是因为setTimeout改变了setState，**而是setTimeout帮助setState逃脱了React对它的管控**，只要是在React管控下的setState，一定是异步的。

源码分析（围绕15展开，关于16Fiber带来的改变后续再讲解）:读源码应该带着问题去读，主流程

<img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35dce2754bb844808bf65fcc12cd1b24~tplv-k3u1fbpfcp-watermark.awebp" alt="img" style="zoom: 25%;" />

<img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211122134505874.png" alt="image-20211122134505874" style="zoom: 25%;" />



##### 1、入口函数setState： #####

充当分发的角色，根据入参的不同，将其分发到不同的函数中去。

<img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211122134838045.png" alt="image-20211122134838045" style="zoom:25%;" />

1. 假如传入的是对象：**enqueueSetState做了两件事：**
   1. 将新的state放入组件的状态队列里
   2. 用enqueueUpdate处理将要更新的实例对象

* 获取组件实例：instance；

* 判断是否存在**_pendingStateQueue**

  有---> 将传入的partialState存储push进去，没有创建空数组，push进去;

* 如果存在callback就调用**enqueueCallback**将其存入一个**_pendingCallbacks**队列中存起来

* 调用**enqueueUpdate**，并传入当前组件实例；

  ```js
  enqueueSetState: function(publicInstance, partialState) {
    // 根据this拿到对应的组件实例
    var internalInstance = getInternalInstanceReadyForUpdate(
      publicInstance,
      'setState',
    );
    // queue 对应一个组件实例的 state 数组
    var queue = internalInstance._pendingStateQueue || 		(internalInstance._pendingStateQueue = []);
    queue.push(partialState); // 将 partialState 放入待更新 state 队列
    // 处理当前的组件实例
    enqueueUpdate(internalInstance);
  }
  ```

##### 2、enqueueUpdate的具体实现：**直接决定了是等待还是直接走更新流程** #####

* 调用**ensureInjected**，对batchingStrategy进行赋值，

* 判断**batchingStrategy.isBatchingUpdates**，【注意】：开启事务前会将它设置为了true，事务结束会将它设为false

  为true ---> 将当前组件实例添加到**dirtyComponents**数组中

  为false ----> 执行**batchingStrategy**的**batchedUpdates**方法，【注意】：事务开启的时候也会调用这个方法

  ```js
  function enqueueUpdate(component) {
    ensureInjected() 
    // isBatchingUpdates 标识着当前是否处于批量创建/更新组件过程
    if (!batchingStrategy.isBatchingUpdates) {
      // 若当前没有处于批量创建/更新组件的阶段，则立即更新组件
      batchingStrategy.batchedUpdates(enqueueUpdate, component)
      return
    }
    // 需要批量更新，则先把组件塞入 dirtyComponents 队列
    dirtyComponents.push(component)
    if (component._updateBatchNumber == null) {
      component._updateBatchNumber = updateBatchNumber + 1
    }
  }
  ```

##### 3、batchingStrategy是什么 ---锁管理器 #####

* 从上面的流程可以看出： `batchingStrategy`该对象的`isBatchingUpdates`属性直接决定了是马上要走更新流程，还是应该进入队列等待；
* 所以大概可以得知`batchingStrategy`用于管控批量更新的对象

```js
//0. transition是ReactDefaultBatchingStrategyTransaction的实例，它代表了其中一类事务的执行
var transaction = new ReactDefaultBatchingStrategyTransaction();

var ReactDefaultBatchingStrategy = {
  // 1. 初始值为 false 表示当前并未进行任何批量更新操作：全局唯一的锁标识
  isBatchingUpdates: false,
  
  // 2. 发起更新动作的方法batchedUpdates：
      先把锁锁上，表明现在正处于批量更新过程中，此期间任何批量更新都只能暂时进入dirtyComponents排队等候下一次批量更新，而不能随意插队，这是一种任务锁的思想
  batchedUpdates: function (callback, a, b, c, d, e) {
    
    // 2.1 第一次调用时，alreadyBatchingUpdates设置为false,就会执行perform
    var alreadyBatchingUpdates = ReactDefaultBatchingStrategy.isBatchingUpdates;
    ReactDefaultBatchingStrategy.isBatchingUpdates = true;

    if (alreadyBatchingUpdates) {
      return callback(a, b, c, d, e);
    } else {
    //2.2 perform启动事务，同时将 callback 放进事务里执行
      return transaction.perform(callback, null, a, b, c, d, e);
    }
  }
};
    进入事务transation，执行method方法，开启了组件的首次装载
// 3. 当组件装载完毕会调用componentDidMount(注意，此时还是在执行method方法，事务还没结束，事务只有在执行完method后执行一系列close才会结束)
```

##### 4、transaction.perform --- Transaction（事务）机制 #####

* #### 概念： ####

  * Transaction 是创建一个黑盒，该黑盒能够封装任何的方法，在React源码表现为一个核心类；
  * 一个 Transaction 就是将需要执行的 method 使用 wrapper（一组 initialize 及 close 方法称为一个 wrapper） 封装起来，再通过 Transaction 提供的 perform 方法执行
  * 在React中就是调用perform方法进入一个事务，该方法中会传入一个method参数。执行perform时：
    * 先执行所有 wrapper 中的 initialize 方法，例如一些初始化操作
    * 然后执行传入的method --- perform真正
    * perform 完成之后（即 method 执行后）再执行所有的 close 方法，例如执行批量更新或者将isBatchingUpdates变回false等等

##### 5、batchingStrategy 批量更新策略 #####

* ReactDefaultBatchingStrategy 这个对象，其实就是一个批量更新策略事务，它的 wrapper 有两个：`FLUSH_BATCHED_UPDATES` 和 `RESET_BATCHED_UPDATES`

* 在**perform**中的method执行完毕后，会按照数组的顺序**[FLUSH_BATCHED_UPDATES, RESET_BATCHED_UPDATES]**依次调用其**close**方法

  - **FLUSH_BATCHED_UPDATES**执行批量更新操作，会循环所有dirtyComponents，调用updateComponent执行所有的生命周期方法，实现组件的更新
  - **RESET_BATCHED_UPDATES**将isBatchingUpdates变回false，即意味着事务结束

  ```js
  var RESET_BATCHED_UPDATES = {
    initialize: emptyFunction,
    //2 将isBatchingUpdates设置为false，代表本次事务结束。后续再调用setState就不会push到dirtyComponents里面
    close: function () {
      ReactDefaultBatchingStrategy.isBatchingUpdates = false;
    }
  };
  
  // flushBatchedUpdates 将所有的临时 state 合并并计算出最新的 props 及 state
  var FLUSH_BATCHED_UPDATES = {
    initialize: emptyFunction,
    // 1 批量更新操作
    close: ReactUpdates.flushBatchedUpdates.bind(ReactUpdates)
  };
  
  var TRANSACTION_WRAPPERS = [FLUSH_BATCHED_UPDATES, RESET_BATCHED_UPDATES];
  
  function ReactDefaultBatchingStrategyTransaction() {
    this.reinitializeTransaction();
  }
  ```

#### 3、setState为何会表现为同步？ ####

 `batchedUpdates` 这个方法不仅仅会在setState之后才被调用，在首次渲染组件时执行内部会调用一次：

##### 1、componentDidMount： #####

1. 实例化组件；
2. 内部调用了一次 `batchedUpdates` 方法（将 isBatchingUpdates 设为 true）
3. 在组件的渲染过程中，会按照顺序调用各个生命周期(钩子)函数。开发者可能在生命周期函数里面调用 setState，因此需要开启batch来确保所有的更新都能够进入 dirtyComponents 里去，进而确保初始初始渲染流程中，所有的state都是生效的

##### componentWillUpdate、componentDidUpdate #####

* 这两个生命周期中不能调用`setState`。在它们里面调用`setState`会造成死循环，导致程序崩溃

```javascript
// ReactMount.js
_renderNewRootComponent: function( nextElement, container, shouldReuseMarkup, context ) {
  // 实例化组件
  var componentInstance = instantiateReactComponent(nextElement);
  // 调用 batchedUpdates 方法
  ReactUpdates.batchedUpdates(
    batchedMountComponentIntoNode,
    componentInstance,
    container,
    shouldReuseMarkup,
    context
  );
}
```

##### 2、事件： #####

当我们在React绑定了事件后，事件中也有可能触发setState

* 为了确保每一次 setState 都有效，React 同样会在此处手动开启批量更新
* `react`仍然处于他的更新机制中，这时`isBranchUpdate`为true；
* 这时无论调用多少次`setState`，都不会执行更新，而是将要更新的`state`存入`_pendingStateQueue`，将要更新的组件存入`dirtyComponent`
* 事物结束后，会设置为false

```js
// ReactEventListener.js

dispatchEvent: function (topLevelType, nativeEvent) {
  try {
    // 处理事件：batchedUpdates会将 isBatchingUpdates设为true
    ReactUpdates.batchedUpdates(handleTopLevelImpl, bookKeeping);
  } finally {
    TopLevelCallbackBookKeeping.release(bookKeeping);
  }
}
```

【总结】：`isBatchingUpdates` 这个变量，在 React 的生命周期函数以及合成事件执行前，已经被 React 改为 true，这时我们所做的 setState 操作自然不会立即生效 

#### 4、回到之前的例子： ####

* isBatchingUpdates对setTimeout内部的执行逻辑完全没有约束力，因为isBatchingUpdates是在同步代码变化，setTimeout是异步执行的，当this.setState真正运行时，isBatchingUpdates已经被重置为false了。
* 这就使得 setTimeout 里面的 setState 具备了立刻发起同步更新的能力。

```js
increment = () => {
  // isBatchingUpdates = true; 先锁上
  console.log('increment setState前的count', this.state.count); // 0
  this.setState({
    count: this.state.count+1
  });
  console.log('increment setState后的count', this.state.count); //0 
   // isBatchingUpdates = false;
}

reduce = () => {
   // isBatchingUpdates = true;
  setTimeout(() => {
    console.log('reduce setState前的count', this.state.count);//2
    this.setState({
      count: this.state.count+1
    });
    console.log('reduce setState后的count', this.state.count); //1
     // isBatchingUpdates = false;
  }, 0);
```

#### 5、总结 ####

setState 同步异步的表现会因调用场景的不同而不同：

* 在 React 钩子函数及合成事件中，它表现为异步；
* 而在 setTimeout/setInterval 函数，DOM 原生事件中，它都表现为同步。这是由 React 事务机制和批量更新机制的工作方式来决定的

【备注】：16以后，整个React核心算法被重写，setState也不可避免地被“Fiber”化，之后会展开讲

#### 6、整体执行流程 ####

- 1.将setState传入的`partialState`参数存储在当前组件实例的state暂存队列中。
- 2.判断当前React是否处于批量更新状态，如果是，将当前组件加入待更新的组件队列中。
- 3.如果未处于批量更新状态，将批量更新状态标识设置为true，用事务再次调用前一步方法，保证当前组件加入到了待更新组件队列中。
- 4.调用事务的`waper`方法，遍历待更新组件队列依次执行更新。
- 5.执行生命周期`componentWillReceiveProps`。
- 6.将组件的state暂存队列中的`state`进行合并，获得最终要更新的state对象，并将队列置为空。
- 7.执行生命周期`componentShouldUpdate`，根据返回值判断是否要继续更新。
- 8.执行生命周期`componentWillUpdate`。
- 9.执行真正的更新，`render`。
- 10.执行生命周期`componentDidUpdate`。