---
title: Vue&&React的数据流管理
tags: 数据流管理
categories: 1.4-框架
description: 一起学习下主流的数据管理思想：Flux、redux、Vuex
cover: https://mynightwish.oss-cn-beijing.aliyuncs.com/React/react-data.png
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: react_vue_data
date: 2021-12-11 22:56:21
---
## Redux ##

### 1、Flux ###

redux的问题背景和架构思想是什么？

虽然它并不严格遵循flux的设定，但Redux可被认定为Flux的一种实现方式

#### 1、Flux4部分 ####

有FB提出的一套应用架构，并不是一套具体的框架，这套架构约束的是“应用处理数据的模式”。

**把组件之间需要共享的状态抽取出来，遵循特定的约定，统一来管理，让状态的变化可以预测**。

在Flux架构中，一个应用被拆解为4部分：

* #### View：用户界面，可以以任何形式展示 ####

  1. 特性：store改变了VIew也要跟着改变
  2. 如何改变view：一般 Store 一旦发生改变，都会往外面发送一个事件，比如 change，通知所有的订阅者。View 通过订阅也好，监听也好，不同的框架有不同的技术，反正 Store 变了，View 就会变。

* #### Action：视图层发出的消息，会触发应用状态的改变 ####

  1. 必须经过一套流程，视图先要通过action告诉 Dispatcher，让 Dispatcher dispatch 一个 action
  2. Dispatcher 会把 addUser 这个 action 发给所有的 store，store 就会触发 addUser 这个 action，来更新数据
  3. 数据一更新，那么 View 也就跟着更新了

* #### Dispatcher：派发器，负责action的派发 ####

* #### store：数据层，应用状态的仓库，此外还定义修改状态的逻辑 ####

#### 2、Flux工作流 ####

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/18/167c11c13ef4e9a8~tplv-t2oaga2asx-watermark.awebp" alt="image.png | center | 827x250" style="zoom:50%;" />

1. 用户与 view之间产生交互，通过view发起一个action，通过dispatch会把该action派发给store，通过store相应的状态更新
2. store完成更新后，会进一步通知View更新界面；

【注意】：图中的箭头都是单向的，这也是Flux架构一个特点，**单向数据流**

#### 3、Flux解决了什么 ####

Flux的核心特征是：**单向数据流**，那么双向数据流会有什么问题呢？

1. 典型应用场景：MVC架构，

   * 除了通过用户通过view层来触发数据以外，还可以通过control来触发逻辑

   * model：程序需要操作的数据或信息；

   * view视图：视图

   * controller：控制器，用于连接view和model，管理model与view之间的逻辑

   * 用户操作view后，control来处理逻辑，将改变应用到model上，再反馈到view中，这个过程中，是单向的。在服务端的应用中，数据流确实能够保持单向。但是在前端场景下，处于交互的需要往往允许view和model进行直接通信。这就允许了数据流的存在，当业务场景比较复杂时，数据流就会比较混乱，出现这样：

     这样即使一个小小的修改，也可能造成蝴蝶效应问题。因为你很难区分数据是哪个control，哪个view引发的。

2. **而Flux的架构模式，最核心的是严格的单向数据流，在单向数据流下，状态的变化是可预测的，避免了混乱的数据结构**

3. 缺点：

   1. 对数据流约束的背后是成本，因此也只在大型的项目中才会使用，这一点对redux也是一样的。

      Store 封装了数据还有处理数据的逻辑等等

   2. 比如一个应用可以拥有多个 Store，多个Store之间可能有依赖关系；

### 2、Redux ###

它与Flux设计思想上一脉相承

官网描述：是JS的状态容器，它提供可预测的状态管理；Vue、React可以用

<img src="https://tomoya92.github.io/assets/2021-04-29-09-56-16.png" alt="img" style="zoom:50%;" />

#### 1、角色： ####

* store：单一的数据源，而且是只读的；
* action：对变化的描述
* reducer：负责对变化进行分发、处理

在Redux的整个工作过程中，数据流是严格单向的，很重要一定要说！！！

* 如果想修改数据，只有一种方式：派发action，action会被reducer读取，进而根据action的不同对数据修改，返回新的state，新的state会更新到store里，进而驱动视图层做出对应的改变；
* 因此，任何组件都可以通过store读取到全局的状态；也可以通过合理地派发action，来修改全局的状态。redux提供了状态容器，使得状态能够自由地在组件之间穿梭；这就是redux实现的思路。

#### 2、redux工作流 ####

1. createStore：使用createStore创建包含指定reducer的store对象

   ```js
   1)   import {createStore} from 'redux'
   2)   import reducer from './reducers'
   3)   const store = createStore(reducer)
   ```

2. reducer的作用：将新的state返回给store

   ```js
   const reducer=  (state, action) => {
   	return new_state;
   }
   ```

3. action:通知reducer，让改变发生

   如何在众多的store状态库中，准确地希望他改变state呢？将action对比，因此必须要用正确的action

   ```js
   const action = {
   	type: 'add_mm',
   	payload: "ss"
   }
   ```

4. action只是一个对象，要想让action真正产生动作，还要靠store的dispatch

   ```js
   store.dispatch(action);
   ```

### 3、redux源码分析 ###

* utils文件夹：工具方法库
* index.js：入口文件，主要做模块导出
* 真正干活的文件：
  * applyMiddleWare.js：中间件模块，将在后面单独讲解
  * bingActionCreator.js：用于将传入的actionCreator与dispatch方法相结合，揉成一个新的方法。工具性质的方法（即使不理解它也不影响了解redux）
  * combineReducer.js：用于将多个reducer合并起来。工具性质的方法
  * compose.js：用于把接收到的函数，从右向左进行结合。工具性质的方法
  * **createStore.js：了解redux的主要模块。使用redux最先调用的方法，是整个流程的入口，也是Redux中最核心的API**

#### 1、createStore.js分析 ####

* 使用

```jsx
import { createStore } from 'redux';
const store = createStore(
  reducer,   
  initial_state, //初始状态内容
  applyMiddleware(middleware1, middleware2,...)
);
```

* 源码截图
  <img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211127225633907.png" alt="image-20211127225633907" style="zoom:15%;" /><img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211127225732058.png" alt="image-20211127225732058" style="zoom:15%;" />
  <img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211127225800737.png" alt="image-20211127225800737" style="zoom:15%;" /><img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211127230121583.png" alt="image-20211127230121583" style="zoom:15%;" />
  <img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211127230134769.png" alt="image-20211127230134769" style="zoom:15%;" /><img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211127230309854.png" alt="image-20211127230309854" style="zoom:15%;" />
  <img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211127230558433.png" alt="image-20211127230558433" style="zoom:15%;" /><img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211127230626348.png" alt="image-20211127230626348" style="zoom:15%;" />
  <img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211127230634791.png" alt="image-20211127230634791" style="zoom:15%;" /><img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211127230646868.png" alt="image-20211127230646868" style="zoom:15%;" />

##### 1、整体流程 #####

<img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211127230657392.png" alt="image-20211127230657392" style="zoom: 33%;" />

<img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211127230746655.png" alt="image-20211127230746655" style="zoom:33%;" />

* 与redux主流程强相关的，也是使用较多的：getState、subscribe、dispatch

  getState的源码：

  subscribe、dispatch：关键的分发动作，最核心的

#### 2、dispatch ####

##### 源码 #####

 redux关键要素：action   reducer   store    而dispatch刚好能够将这三位主角串起来：

<img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211127230309854.png" alt="image-20211127230309854" style="zoom:20%;" /><img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211127230558433.png" alt="image-20211127230558433" style="zoom:20%;" /><img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211127230626348.png" alt="image-20211127230626348" style="zoom:20%;" />

##### dispatch核心工作流 #####

<img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211127232248297.png" alt="image-20211127232248297" style="zoom:25%;" />

**通过上锁避免套娃式的dispatch**

最关键的是执行reducer，它通过reducer的更新规则，指定了应用状态的变化如何响应action，并发送到store。currentReducer包裹的try部分代码

* 在调用dispatch之前会通过isDispatching变量设置为true，待reducer执行完毕后，再将isDispatching变量设置为false；这跟setState的批处理也很相似

* 这里这样做的目的是：**避免套娃式的dispatch**，也就是避免开发者在开发中手动调用dispatch

* **为什么要这样设计呢？**

  redux在设计reducer时就强调了它必须是纯净的，它不应该执行除了计算之外的任何脏操作。dispatch是一个脏操作；

  其次从执行的角度看，若真的在reducer中调用dispatch，那么dispatch又会返过来调用reducer、reducer又会再次调用，陷入死循环。

  因此，在dispatch中做了if判断，一旦识别isDispatching为true，直接抛错

#### 3、subscribe触发订阅 ####

在reducer执行完毕后，会触发订阅执行的过程。

<img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211127230626348.png" alt="image-20211127230626348" style="zoom:20%;" />

* subscribe这个API执行订阅。接收一个function类型的listener做入参，返回是对应listener的解绑函数

  因为redux中已经默认了订阅的对象就是**状态的变化**，准确来说是dispatch函数的调用这个事件

* subscribe的工作流程：

  <img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211127234248963.png" alt="image-20211127234248963" style="zoom:25%;" />

**问题：**

1. **subscribe是如何与redux主流程相结合的呢？**

   在store对象创建成功后，通过调用store.subscribe来注册监听函数，也可以通过subscribe的返回函数来解绑监听函数。

   listeners数组用来维护监听函数。

   当diapatch action发生变化时，redux会在reducer执行完毕后，将listeners数组中的监听函数逐个执行。

2. 为什么会有currentListeners、nextListeners这两个数组呢？

   redux中的订阅过程和发布过程是如何处理数组的？

   ```jsx
   let nextListeners = currentListeners;// 二者指向同一个引用
   ```

   <img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211127225732058.png" alt="image-20211127225732058" style="zoom: 25%;" />

   * 但ensureCanMutateNextListener每次都会在注册listener之前无条件调用：用来确保两个数组引用不同。

   * 在这个函数执行的是listener的注册逻辑： nextListener.push(listener)，注册到这个数组中。

   * 触发订阅的逻辑：

     在触发订阅的过程中，currentListeners会被赋值为nextListener，而即将被执行的数组listeners又被赋值为currentListeners。因此最终被执行的数组指向nextListener的同一个引用。

     <img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211127230626348.png" alt="image-20211127230626348" style="zoom:20%;" />

     既然注册监听使用nextListener、触发订阅也是nextListener。**为什么还需要currentListeners数组呢？**

     currentListeners用于确保监听函数执行过程中的稳定性。因为任何变更都是在nextListener上发生的，因此需要一个不会被变更的稳定的listener保证不出乱子

     ```js
     function listenerA(){}
     let unSubscribeA = store.subscribe(listenerA);
     
     function listenerB(){
       unSubscribeA();//在B中解绑A
     }
     function listenerC(){}
     store.subscribe(listenerB);//订阅B
     store.subscribe(listenerC);//订阅C
     ```

     * 这种操作在redux是合法的。执行完毕后，listeners数组中[listenerA,  listenerB, listenerC]

     * 触发订阅逻辑：遍历listener数组，分别执行自己的函数。而listenerB中执行了unSubscribeA这个动作，而监听、触发、解绑触发影响的都是nextListener数组

       <img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211127230134769.png" alt="image-20211127230134769" style="zoom: 25%;" />

     * 假如不要currentListeners这个数组，也就不需要执行解绑函数中的ensureCanMutateNextListener这个调用。而没有这个动作，unSubscribeA执行完之后，listenerA会同时从listeners数组和nextListener数组中移除，那么listeners数组就只剩下listenerB、listenerC。也就是listeners数组的长度发生了改变，但for循环并不会感知到，它将继续循环下去。下一步索引对应的会出现undefined，进而导致函数异常。

   * 那怎么办呢？

     * 因此需要将当前正在执行的listeners数组与nextListener数组隔离开，将两者指向不同的引用。这也是ensureCanMutateNextListener所执行的事情，这个函数执行前：三者关系：

       ```jsx
       listeners === nextListener === currentListeners
       ```

       执行后：nextListener上的任何改变都无法再影响正在执行中的listeners。而currentListeners就是为了记录下当前正在工作中的listeners数组的引用，将它与可能发生改变的nextListener区分开来，以确保监听函数在执行过程中的稳定性

       ```jsx
       nextListener = currentListeners.slice()
       listeners === nextListener !== currentListeners
       ```

### 4、redux中间件 ###

#### 1、用法 ####

```jsx
import { createStore, applyMiddleware } from 'redux';
const store = createStore(
  reducer,   
  initial_state, //初始状态内容
  applyMiddleware(middleware1, middleware2,...)
);
```

#### 2、中间件的引入，为redux工作流带来什么改变？ ####

* redux-thunk  经典的**异步action场景**

  在redux源码中可以看出，只有同步操作，当我们dispatch一个action时，会立即更新，因此如果想在redux中引入异步数据流，该怎么办？

  使用中间件来支持，其中最受欢迎的是redux-thunk 

  ```jsx
  import thunkMiddleWare for 'redux-thunk';
  import reducer from './reducer.js'
  const store = createStore(reducer, applyMiddleware(thunkMiddleware));
  ```

* 异步action的例子：

  ```jsx
  import { createStore, applyMiddleware } from 'redux';
  import thunk for 'redux-thunk';
  import axios from 'axios';
  import reducer from './reducer.js'
  
  const store = createStore(reducer, applyMiddleware(thunk));
  
  const payMoney = payInfo => () => {
    dispatch({type: 'payStart'});
    fetch().then(res => {
      dispatch();
    })
    return axios.post('./api/payMoney', {
      payInfo
    })
    .then(response => {
      console.log(response);
      dispatch({type: 'paySuccess'});//付款成功
    })
    .catch(error => {
      console.log(error);
      dispatch({type: 'payError'}); // 付款失败
    })
  }
  
  const payInfo = {
    username: 'ss',
    password: '123',
    count: 5,
    ....
  }
  // 注意action是函数这里
  store.dispatch(payMoney(payInfo));
  ```

  * createStore的源码中，初始化时会检查中间件，使得即使写在第2个参数也可以识别

dispatch的入参从action对象，变成了一个函数，源码中是有校验的action入参必须是一个对象，thunk似乎绕开了这层校验，为什么呢？

#### 3、redux中间件的工作流程 ####

* 当只有一个中间件：

  ```
  action -- middleWare -- dispatch -- reducer -- nextState
  ```

  middleWare会在action分发之后，到达reducer之前执行；

* 当有多个中间件：

  ```
  action -- middleWare1 （安装的执行顺序）
  			 -- middleWare2
  			 -- middleWare3...
  -- dispatch -- reducer -- nextState
  ```

  中间件的执行时机使得它能在状态正在发生之前结合action信息，做一些自己的处理。

* ##### 中间件如何绕过主流程的校验逻辑呢？ #####

  其实并没有被绕过，而是被**applyMiddleWare**改写了，使得dispatch，在触发reducer之前首先执行对redux中间件的链式调用

### 5、redux-thunk源码 ###

主要做的事情：

* 在拦截到action后，会检查它是否为一个函数：

  若为函数，就会执行它；并且返回执行结果

  若不是函数，就不处理它，直接调用next，工作流可以继续往下走

<img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211128140700555.png" alt="image-20211128140700555" style="zoom:25%;" /><img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211128141206440.png" alt="image-20211128141206440" style="zoom:25%;" />

<img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211127225633907.png" alt="image-20211127225633907" style="zoom:15%;" />

1. **applyMiddleWare**是如何配合createStore工作的？

   * **applyMiddleWare**返回的是一个接收createStore作为入参的函数，这个函数将会作为入参传递给createStore

   * createStore中，会判断enhancer存在，就会返回一个针对enhancer的调用，调用中第一层入参是createStore，第二层入参是reducer、preloadedState

   * 对应到applymiddelware中的逻辑：

     这个函数中的return 的createStore对应createStore本身，args对应的就是reducer、preloadedState

   * applyMiddeware是enhancer的一种，而enhancer的意思是增强，增强的是createStore的能力。因此入参是传入这个函数是有必要的

   <img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211128141742510.png" alt="image-20211128141742510" style="zoom:20%;" />

   2. dispatch函数是如何改写的？

      做了两件事，以，，aPI作为入参逐个调用传入的middleWare函数，获取一个由内层函数组成的数组chain；

      然后调用compose函数，将内层函数逐个组合起来。并调用最终组合出来的函数

      内层函数：creatThunk函数的返回值 return next(action) 仍然是一个函数，高阶函数，要求redux中间节都是高阶函数，内层的就是内层函数。

   <img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211128141804611.png" alt="image-20211128141804611" style="zoom:20%;" />

   <img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211128141819905.png" alt="image-20211128141819905" style="zoom:20%;" />

2. compose函数是如何组合起来的？

**redux中间件是如何实现的？**

​	**函数合成（组合函数**）并不是redux的专利，而是**函数式编程**中的一个通用概念，它其实作为一个工具类的文件存在。源码：

* 函数组合是通过调用reduce来实现的；特点是对数组中每个元素执行指定的逻辑，并将结果汇总为单个返回值。

  ```jsx
  (...args) => f1(f2(f3(f4(...args)))) //最后一行等效为
  ```

<img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211128020307931.png" alt="image-20211128020307931" style="zoom:25%;" />

### 6、中间件背后的AOP ###

1. 为什么中间件可以流行？
2. 为什么我们的应用需要中间件？

AOP的存在恰恰是为了解决OOP的局限性。AOP可以被看成是OOP的补充，在OOP模式下，想要拓展一个类的逻辑时，最常见的思路是：

* Class A继承Class B  classB继承classC，这样一层层 将逻辑向下传递
* 当我们想要为某几个类追加一段共同的逻辑时，可以通过修改他们的父类来实现，这会导致公共类越来越臃肿。但也没有更好的办法

面向切面就登场了。切面是一个相对于执行流程来说的概念，以redux为例，其自上而下的工作流：

```
	action
  reducer
  store
```

* 假如在每个action被派发后，都打印一个action被派发的记录，这样的逻辑通用性很强，但业务属性很弱，因此不适合与任何的业务逻辑耦合在一起。因此就可以以切面的方式，将其与业务功能剥离开来。扩展功能在工作流中的执行节点可以看做一个单独切点，我们把扩展功能的逻辑放到这个切点上来，形成的就是一个可以拦截连续逻辑的切面，如下图：
* 切面与业务逻辑是分离的，因此AOP是一种典型的非侵入式的逻辑扩容思路。在日常开发中，日志追溯、性能打点、异步工作流处理这种和业务逻辑关系不大的功能，都可以抽取到切面中去做。

切面编程的收益？

1. 可以很大程度上提升了组织逻辑的灵活度与干净度、帮助了我们规避掉了逻辑冗余、逻辑耦合问题
2. 通过将业务逻辑与切面剥离，更高地专注与开发。而切面这种即插即用的方式，自由组织想要的扩展功能

### 7、Vuex ###

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/18/167c11c13fc70df1~tplv-t2oaga2asx-watermark.awebp" alt="image.png | center | 701x551" style="zoom: 50%;" />

#### 1、Vuex的设计 ####

* #####  五个核心属性：state、mutations、actions、Getter、modules #####

* 把同步和异步拆分开，不要互相干涉

* store的改变流程：

  **在 vuex 中只有 mutations 可以更新state**

  * commit 一个 mutation，mutation 负责更改 state（store状态更新的唯一方式）
  * dispatch 一个 action，在 action 中 commit 一个 mutation

* 引入 Getter，mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性

* 引入 Module 的概念，把一个大 Store 拆开，每个 Module 有自己的 state、mutation、action、getter：

#### 1、Store ####

* 每一个 Vuex 里面有一个全局的 Store，包含着应用中的状态 **State**
* Vuex通过 store 选项，把 state 注入到整个应用中，这样子组件能通过 this.$store 访问到 state 了
* **State 改变，View 就会跟着改变，这个改变利用的是 Vue 的响应式机制**

#### 2、Mutation           同步    store状态更新的唯一方式 ####

* ##### 改变state的唯一方法是提交commit来触发_mutations #####

* 每个 mutation 都有一个字符串的 事件类型和 一个 回调函数

* mutation 有些类似 Redux 的 Reducer，**但Vuex直接修改 State**

  1. **Redux 强调的 immutability**，在保证了每一次状态变化都能追踪，收益很有限
  2. 为了同构而设计的 API 很繁琐，必须依赖第三方库才能相对高效率地获得状态树的局部状态，这些不足的地方，所以也被 Vuex 舍掉了

#### 3、假如在mutation里面提交异步            ####

##### 1、问题、坑 #####

* 提交的时候页面状态view发生变化，但是真正的状态是没有变化的，**页面改变了**，**而devtool工具里面的state状态不一致** 如下面图片

* 在/src/store/index.js 的mutations里面模拟异步发现状态是混乱的
  <img src="https://segmentfault.com/img/remote/1460000011528057?w=1406&amp;h=538" alt="image_1bs7rnpdd1slf119n1k6k1ltt1o8m9.png-73.7kB" style="zoom:50%;" />

```js
let store = new Vuex.Store({
    state: {
        num: 100
    },
    mutations: {
        // 任何时候改变state的状态都通过提交 mutation 来改变
        // 里面可以定义多个函数，当触发这个函数就会改变state状态
        addIncrement(state, stark) {
            console.log(stark);
            // 接收一个state作为参数， 相当于上面的state
            // 模拟异步，状态会发生混乱
            setTimeout(() => {
                state.num += stark.n;
            }, 1000)

        },
        minIncrement(state) {
            state.num -= 5;
        }
    }
})
export default store
```

##### 2、解决： #####

1. 在组件里面利用this.$store.dispatch("addAction"); 提交actions

```js
<h2>加减法计算器</h2>
<div>
  <input type="button" value="-" @click="minHandle"/>
    <span>{{num}}</span>
  <input type="button" value="+" @click="addHandle"/>
</div>
<script>
    export default {
        computed:{
            num(){
                return this.$store.state.num
            }
        },
        methods:{
            addHandle(){
                // this.num += 5;
                // 点击的时候需要改变状态，提交mutation addIncrement
                // 利用$store.commit 里面 写参数相当于 mutation的函数名字
                // this.$store.commit("addIncrement",{name:'stark',age:18,n:5})
                // this.$store.commit({
                //     type:"addIncrement",
                //     n:5,
                //     age:18,
                //     name:'stark.wang'
                // })
                this.$store.dispatch("addAction"); // 在这提交 actions

            },
            minHandle(){
                // this.num -= 5;
                this.$store.commit("minIncrement")
                // this.$store.         
            }
        }
    }
</script>
```

##### 3、为什么呢？ #####

* 在vuex里，改变state的唯一方法是提交commit来触发_mutations，而调用actions时会判断是不是Promise，调用异步处理，你在mutations里写情求他都不会跑then方法，你怎么改变

* ##### 源码： #####

  ```js
  // 这个就是 Store 类的 commit 方法
  function commit (_type, _payload, _options) {
      // check object-style commit
      const {type, payload, options} = unifyObjectStyle(_type, _payload, _options)
      // 定义mutation对象，type 其实就是我们要操作的 mutation 的方法名， payload 是参数（载荷）
      const mutation = { type, payload }
      // entry 就是要被执行的 mutation 方法
      const entry = this._mutations[type]
      
      // 省略了一些中间不影响逻辑的代码
      
      // 注册一些回调函数，可以看到 mutation 方法（entry）最终是在这个回调函数中执行，直接就执行结束，没有任何的 return 以及 异步处理，这样也就是说在 commit 中不可以写异步逻辑
      this._withCommit(() => {
          entry.forEach(function commitIterator (handler) {
              handler(payload)
          })
      })
      this._subscribers
      .slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
      .forEach(sub => sub(mutation, this.state))
  }
  ```

##### 4、在组件中执行异步操作，在异步的回调中执行commit可以吗？ #####

可以，但是一般不这么做

* state状态更新逻辑是可复用的，但是如果把这部分逻辑写在了组件内：

  比如写在了组件A中，这时候另外一个组件B也需要更新这个状态，你就需要把组件A中的那段异步代码复制到组件B中

  这个不是一个合理的方式（代码冗余，应该将公共逻辑抽离出来），虽然可以这么做，但是不推荐

#### 4、vuex中为什么把异步操作封装在action，把同步操作放在mutations？ ####

* 官方文档说明：“在 mutation 中混合异步调用会导致你的程序很难调试

  例如，当你能调用了两个包含异步回调的 mutation 来改变状态，你怎么知道什么时候回调和哪个先回调呢？这就是为什么我们要区分这两个概念

  在 Vuex 中，我们将全部的改变都用同步方式实现。我们将全部的异步操作都放在[Actions](https://link.zhihu.com/?target=http%3A//vuex.vuejs.org/zh-cn/actions.html)中。”

* 如果同时出发了两个异步的actions，那么这两个回调的时间不一样，那么对于state的更新还是存在竞态的。所以我觉得这样进行区分并不能解决“那么先回调，哪个后回调”来更新state的问题

* 尤大的回答：区分 actions 和 mutations 并不是为了解决竞态问题，而是为了能用 devtools 追踪状态变化

  1. vuex 里面 actions 只是一个架构性的概念，并不是必须的，说到底只是一个函数，你在里面想干嘛都可以，只要最后触发 mutation 就行

  2. 异步竞态怎么处理那是用户自己的事情。vuex 真正限制你的只有 mutation 必须是同步的这一点（在 redux 里面就好像 reducer 必须同步返回下一个状态一样）

  3. 同步的意义在于这样每一个 mutation 执行完成后都可以对应到一个新的状态（和 reducer 一样），这样 devtools 就可以打个 snapshot 存下来，然后就可以随便 time-travel 了

  4. 如果你开着 devtool 调用一个异步的 action，你可以清楚地看到它所调用的 mutation 是何时被记录下来的，并且可以立刻查看它们对应的状态

  5. 尤大没有做的：

     把记录下来的 mutations 做成类似 rx-marble 那样的时间线图，对于理解应用的异步状态变化很有帮助

#### 5、Action ####

* ##### 源码： #####

  ```js
  function dispatch (_type, _payload) {
      // check object-style dispatch
      const {type,payload} = unifyObjectStyle(\type, _payload)
      // 定义 action 对象，type 是 actions 对象中的一个属性，payload 是载荷
      const action = { type, payload }
      // 待执行的 action 方法
      const entry = this._actions[type]
      try {
          this._actionSubscribers
          .slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
          .filter(sub => sub.before)
          .forEach(sub => sub.before(action, this.state))
      } catch (e) {}
      
      // 在这里执行了 action 方法，并将结果用 Promise.all 方法处理
      const result = entry.length > 1
      ? Promise.all(entry.map(handler => handler(payload)))
      : entry[0](payload)
      
      // 这里的 result.then 执行完以后会 return 一个结果出去（其实就是我们自己调用的异步逻辑的结果）
      return result.then(res => {
          try {
              this._actionSubscribers
              .filter(sub => sub.after)
              .forEach(sub => sub.after(action, this.state))
          } catch (e) {}
          return res
      })
  }
  ```

#### 6、对比Redux ####

* Redux： view——>actions——>reducer——>state变化——>view变化（同步异步一样）

* Vuex： view——>commit——>mutations——>state变化——>view变化（同步操作）

  ​             view——>dispatch——>actions——>mutations——>state变化——>view变化（异步操作）

#### 3者总的思想： ####

**总的来说都是让 View 通过某种方式触发 Store 的事件或方法，Store 的事件或方法对 State 进行修改或返回一个新的 State，State 改变之后，View 发生响应式改变**