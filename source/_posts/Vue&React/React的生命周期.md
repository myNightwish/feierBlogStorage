---
title: React的生命周期
tags: 生命周期
categories: React&&Vue
description: 生命周期是什么，与库本身的关系
swiper_index: 3
cover: https://cdn.jsdelivr.net/gh/myNightwish/CDN_res/img/sweet3.avif
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: 593377043
date: 2021-12-11 22:55:07
---
## React生命周期 ##

### 1、组件与虚拟DOM ###

#### 虚拟DOM： ####

* **组件初始化时：**
  * 调用render方法 --- 生成虚拟DOM ---再通过ReactDom.render()---生成真实Dom
* **组件更新时：**
  * 通过render方法 ----- 生成新的虚拟DOM------借助diff算法-------定位出两次虚拟Dom的差异

#### 组件化： ####

React中所有可见、不可见的都可以被抽象为组件，每个组件既是“封闭”的，也是“开放”的；

**封闭**：针对渲染工作流而言

* 在每个组件自身的渲染工作流中，每个组件都只处理它内部的逻辑，各自为政
* **渲染工作流：**组件数据改变到组件实际更新发生的过程

**开放**：针对组件通信而言

* React允许开发者基于“单向数据流”的原则完成组件的通信
* 而组件之间的通信又将改变通信双方/某一方内部的数据流，进而对渲染结果构成影响；

#### 组件的分类 ####

* 这些概念有很多重叠，但是他们最主要是关注数据逻辑和UI展示的分离：
  - 函数组件、无状态组件、UI组件主要关注UI的展示;
  - 类组件、有状态组件、容器组件主要关注数据逻辑

##### 1. 无状态、有状态组件 #####

根据组件内部是否有状态需要维护

* ##### 无状态组件： #####

  1. 是一个函数，组件中只有一个render函数，会接受一个props，返回组件，只负责展示，例如函数组件

     ```js
     function HelloComponent(props) {    
     	return <div>{props.data}</div>
     }
     ```

  2. 优点：简单清晰，容易理解，可读性较好；

     缺点：满足不了复杂的应用，往往需要结合**高阶组件**使用，利用高阶组件托管所需状态数据；

  3. 举例：例如redux中就是将组件分为**容器组件**和**ui组件**

     容器组件作为一个高阶组件，**提供数据和行为给ui组件或者其他的容器组件**，负责调用action，并作为回调给展示组件，因此容器组件通常是有状态的，往往作为数据源；

     而ui组件关心组件的展示，通过props接收数据和回调很少有它们自己的state，有也是UI状态而不是数据

* ##### 有状态组件 #####

  1. **特点：**组件内部包含状态，并且状态随着事件或者外部的消息而发生改变，这就构成了有状态组件。使用有状态组件通常会结合react的生命周期钩子控制组件状态更新的时机

  2. react中，有两种更新组件的方式：props和state。

     props是只读的，只能由父组件控制；而state是由组件内部维护的。

     无状态组件通常只通过props来存储数据，而有状态组件使用state来存储数据

##### 2. UI/容器组件 #####

* ##### UI组件 #####

  负责页面的渲染，将todolist关于页面渲染相关的内容全部放到ToDoListUI.js文件中，只负责页面的显示而不是逻辑，所以也叫傻瓜组件

* ##### 容器组件 #####

  负责业务逻辑的代码，而不是组件的页面。所以也叫聪明组件，ToDoList组件

##### 3. 函数组件/类组件 #####

* ##### 函数组件 #####

  1. 本质是JS函数，只是return的内容是描述页面展示内容的React元素
  2. 也会被更新并挂载，但是没有生命周期函数;可以通过hooks来模拟一些生命周期
  3. 没有this(组件实例);
  4. 没有内部状态(state); 

* ##### 类组件 #####

  1. 必须实现render函数， class 组件中唯一必须实现的方法
  2. constructor：可选，常用来初始化数据

##### 4.  受控/非受控组件 #####

* ##### 受控组件 #####

  1. **可变状态**通常保存在组件的状态属性中，并且只能使用 setState() 更新；

  2. 而包裹着受控表单组件的React父组件控制着在后续用户输入时该表单中发生的情况；

  3. 以这种**由React控制的输入表单元素而改变其值的方式**，称为：“受控组件”。

  ```js
  <input type="text" value=this.state.value />;
  ```

* ##### 非受控组件 #####

  * 受控与非受控，关键在于站在哪个视角去看，

  * 对于一组包含关系的父子组件，如果子组件的状态不受父组件控制，而是子组件在其内部维护了自己的状态state，对于父组件来说，子组件就是一个非受控组件。

  * 相反的，如果父组件可以通过props控制子组件的展示状态，那他就是一个受控组件。

### 2、生命周期的本质：render方法为react组件的“灵魂“； ###

* 虚拟DOM、组件化这两个概念，都在围绕这render方法，虚拟DOM的生成需要render、而组件化中跟的渲染工作流这个过程同样离不开render；
* 如果将render方法比喻为灵魂，render之外的生命周期可以理解为组件的躯干

* 躯干和灵魂共同构成了完整而不可分割的生命时间轴

### 3、15生命周期 ###

<img src="https://img-blog.csdnimg.cn/20210713213159633.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3BhZ256b25n,size_16,color_FFFFFF,t_70" alt="在这里插入图片描述" style="zoom:50%;" />

#### 1. 初始化：初次渲染阶段 ####

1. `constructor` 构造函数：主要2件事

   - 给 this.state 赋值对象来初始化内部的state;
   - 为事件绑定实例(this);

   * 如果不初始化 state 或不进行方法绑定，则不需要为 React 组件实现构造函数

2. `componentWillMount` 组件初始化渲染前调用1次

3. **`render` 组件渲染**                 **重要 高频**

   * 注意：render在执行过程中并不会真实操作Dom，它的工作是把需要渲染的内容返回出来
   * 真实的Dom渲染工作在初始化阶段是由ReactDOM.render()干的；

4. **`componentDidMount` 组件挂载到 `DOM` 后调用**                      **高频**

   * **只执行1次，后续修改数据，不会执行**,可做的操作：
     * 依赖于DOM的操作、开启定时器、发送网络请求、订阅消息

#### 2. 更新阶段 ####

* ##### 情况1：state触发更新的流程： 状态更新   this.state #####

  1. `shouldComponentUpdate` 组件是否需要更新

  2. `componentWillUpdate` 组件更新前调用：

  3. `render` 组件渲染                                             **重要 高频**

  4. `componentDidUpdate` 组件更新后调用：

* ##### 情况2：父组件render触发的更新流程： 父组件更新 #####

  1. `componentWillReceiveProps` ：

     注意：如果父组件导致组件重新渲染，即使props没有更改，也会调用此方法；如果只是想处理更改，请确保进行当前值与变更值的比较；（官网）

     * 所以这个钩子的触发并不是props更新触发的，而是父组件触发的。即使props并没有更新

  2. `shouldComponentUpdate` 组件是否需要更新：                 **性能优化**

     ```
     shouldComponentUpdate(nextProps, nextState)
     * 返回值：默认true；并且只要写了这个钩子，就必须写true/false，不允许你不写
     * 如果这个函数返回fasle，类比于阀门关闭，后面的所有流程都不往下走
     ```

  3. `componentWillUpdate` 组件更新前调用

  4. `render` 组件渲染                                                **重要 高频**

  5. `componentDidUpdate` 组件更新后调用

* ##### 情况3：forceUpdate触发更新的流程：强制更新 #####

  通过调用`this.forceUpdate()`，不更改任何数据，强制更新

  1. `componentWillUpdate` 组件更新前调用
  2. `render` 组件渲染                                                **重要 高频**
  3. `componentDidUpdate` 组件更新后调用：
     - 基于组件更新后的Dom操作
     - 基于props的更新，来进行新的网络请求

#### 3、卸载 ####

- `componentWillUnmount` 组件卸载前调用：             **高频**
- 调用场景：
  1. 组件在父组件中被移除了
  2. 组件中设置了key属性，父组件在render的过程中，发现key和上一次不一致
  3. 清除 timer、取消网络请求或清除、取消在 componentDidMount() 中创建的订阅

### 4、生命周期16.3 ###

<img src="https://img-blog.csdnimg.cn/2021071322465195.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3BhZ256b25n,size_16,color_FFFFFF,t_70" alt="在这里插入图片描述" style="zoom: 50%;" />

#### 1、初始化阶段 ####

对比15：

1. 将`componentWillMount`替换为`getDerivedStateFromProps`：但只是工作流程的废弃，而不是替代。

   `getDerivedStateFromProps`：只有一个用途，使用props来更新/派生state。

   ```js
   getDerivedStateFromProps(props, state)
   // 1. 当前组件接收到的来自父组件的props,自身的 state；
   2. 需要一个对象格式的返回值，否则会警告。因为react需要这个返回值更新组件的state；因此当你不需要派生state时，最好不要写这钩子，否则return null;
   ```

   * **挂载、更新**的两个阶段都会调用；

   * 是一个静态方法，不是实例调用的，是类自身调用的，static；在这个组件内部访问不到this，否则报错

   * 必须返回值

     返回null则说明不需要更新 `state` ；返回状态对象（对象，且必须得和state里面对应）

   * 该方法对state的更新动作并非“覆盖”式的更新，而是针对某个属性的定向更新；更新后，原属性与更新属性并存；

   * 从接收到的props中，得到一个派生的状态：每次接收新的props之后都会返回一个对象作为新的 `state` 。**你的状态state什么时候都会完全取决于props**，初始化之类的不起作用

2. render方法改进：

   16之前render方法必须返回单个元素，而16允许返回元素数组和字符串

#### 2、更新阶段 ####

对比15：

1. 废弃了`componentWillReceivePorps`，增加了`getDerivedStateFromProps`

2. 废弃了`componentWillUpdate`，新增了`getSnapshotBeforeUpdate`

   ```
   getSnapshotBeforeUpdate（参数1， 参数2）
   参数1：是之前的props；
   参数2：是之前的state，都不是最新的；
   返回值：必须有，否则警告。返回null
   ```

   * 触发时间: 在 `render` 之后，在真实 `dom` 渲染之前

   * 返回值会传递给下个钩子：`componentDidUpdat`的第三个参数

   * 使用的场景：可以用于获取前后更新的dom的某些状态，例如高度、滚动高度等等

     实现一个内容会发生变化的滚动列表，要求根据滚动列表的内容是否发生变化来决定是否要记录滚动条的当前位置

##### 3、卸载：相同 #####

#### 5、为什么废弃某些钩子？ ####

1. 废弃了componentWillMount

2. getDerivedStateFromProps代替了componentWillUpdate

与componentWillUpdate一起，这个新生命周期涵盖过时componentWillReceivePorps的所有用例。

* getDerivedStateFromProps代替了componentWillReceivePorps，但不是百分之百cover到

* 为啥不能完全cover住呢？

  它做一件事：实现基于props派生state；

  这个方法被封装为静态方法，使得你不能直接获取this，所以也无法操作this.state这类可能产生副作用的工作，因此这个钩子替换是react强制推行getDerivedStateFromProps，使用props到state的映射，再确保生命周期函数的行为更加可控，帮开发者避免不合理的编程方式，同时也是在为新的fiber架构铺路；

`componentWillMount`的存在鸡肋且危险，因此它不值得被替代，应该废弃；为什么呢？

* 与fiber有关，出于render阶段，因此都可能被反复执行；另一方面，这些钩子常年被滥用的过程中，存在风险

* 比如某些骚操作：

  1. setState()：
  2. 发起异步请求
  3. 操作真实Dom

* 不合理的原因：

  1. 完全可以转移到其他生命周期里去做：

     比如发起异步请求，会有人错认为这样就可以让异步请求早点回来，避免渲染白屏；

     但异步请求再怎么快也快不过同步的生命周期，componentwillmount结束后，render会迅速的触发，首次渲染依然会在数据返回之前执行；

     这样做，不仅达不到预想的目的，还会造成服务端的冗余请求等额外问题，得不偿失；

  2. fiber带来的异步渲染机制下，可能会导致非常严重bug：

     假如你在这个钩子里发了个付款请求：

     由于render阶段的生命周期都可以重复执行，在componentwill***被打断+重启多次后，就会发出多个付款请求。

     假如商品只要10元，用户也只点了一次付款，却因为钩子的打断重启，导致接口频繁调用，导致多付了钱；

     再比如，在componentWillReceivePorps里操作Dom，若该钩子执行了2次，可能会删除两个符合某特征的元素

  3. getDerivedStateFromProps封装设计

     这个方法被封装为静态方法，使得你不能直接获取this，所以也无法操作this.state这类可能产生副作用的工作，因此这个钩子替换是react强制推行getDerivedStateFromProps，使用props到state的映射，再确保生命周期函数的行为更加可控，帮开发者避免不合理的编程方式，同时也是在为新的fiber架构铺路；

  4. 即使你没有开启异步，15下也能把自己玩死

     **16改造的主要动机是为了配合Fiber架构带来的异步渲染机制；**

     比如：componentWillReceivePorps、componentWillUpdate里重复滥用state导致死循环

#### 6、Fiber ####

fiber是16对核心算法的一次重写：会使原本的同步的渲染过程变成异步的；

* 在16之前，每当触发react的更新，react都会重新生成一个虚拟DOM树，通过与之前的diff，通过递归的方式实现定向更新；

  同步渲染的递归调用栈很深，只有最底层的返回，才会开始逐层返回；这个漫长且不可打断的过程将会一直占有渲染线程，浏览器此期间处于不能做别的事情，用户体验也不好；

* 16的架构：将一个大的更新任务拆分为几个小任务，每当执行完一个小任务时，都会把主线程交换，让更高优先级的执行，**实行可中断的更新**，避免卡顿；

#### 7、同步、与异步如何影响生命周期？ ####

Fiber架构的重要特征就是可被打断的异步渲染模式；根据“能否被打断”这一标准，16的生命周期分为了render、commit两个阶段：

* render阶段：render及以前：纯净且无副作用，可能会被暂停、终止、重新启动

  1. 因此，该阶段可能打断，为什么呢？

  render阶段的操作对用户来说是不可见的，即使打断再重启，也是0感知；

  2. 被暂停的细节：

     当执行该任务抢回执行的线程时，任务重启的方式并不是从之前暂停的地方执行，而是重新执行该任务，这就导致render阶段的生命周期都是有可能被重复执行的；

     **按照这个结论，为什么react打算废弃那几个钩子呢？**

* pre-commit阶段：可以读取Dom

* conmit阶段：可以使用Dom运行副作用、安排更新；

  该阶段总是同步执行的，为什么这样设计呢？

  因为commit阶段涉及到真实Dom渲染，带来视图的更改，求稳