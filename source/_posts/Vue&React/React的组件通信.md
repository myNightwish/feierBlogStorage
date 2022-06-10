---
title: React的组件通信
tags: 组件通信
categories: React&&Vue
description: 数据是如何在react组件上流动
swiper_index: 6
cover: https://cdn.jsdelivr.net/gh/myNightwish/CDN_res/Project/react-component-communication.png
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: react_components
date: 2021-12-11 22:59:46
---
## 数据是如何在react组件上流动 ##

React视图会随着数据的变化而变化：UI= render(data)；因此data在react中非常重要；

react中如果希望两个组件之间能够产生耦合，那么**两个组件必须建立数据上的连接。也就是组件间通信，**其背后是一套 **环环相扣的react数据流解决方案**。

时下react中的组件通信解决方案：

#### 1、基于props的数据流 ####

* 组件，从概念上类似于JS函数，它接收任意的入参（即props），并返回用于描述页面展示内容的React元素

* 既然props是入参，通过修改props来完成通信就是很自然的事。

* 遵循的原则：单向数据流。当前组件的state以props的形式流动时，只能流向组件树中比自己层级更低的树。比如父组件--->子组件，而不能反过来。

  基于这种原则，可以完成**父子通信，子父通信、兄弟通信**

  * ##### 父子通信：父组件通过this.props传入子组件，实现父--子通信 #####

  * ##### 子父通信：由于单向数据流的原则限制： #####

    父组件传递给子组件的是一个绑定在自身上下文的函数，那么子组件在调用该函数时，就可以将想要交给父组件的数据以函数入参的形式给出去

  * 子传父，再由父传新子。

* 优点：简单

* 缺点：层层嵌套的场景很繁琐

#### 2、发布订阅模式 ####

解决通信类问题的“万金油”

最初的案例是：addEventlistener，监听事件的位置、触发事件的位置是不受限的。

##### 事件的监听、触发 #####

* on()负责注册事件的监听器，指定事件触发时的回调函数
* emit（）：负责触发事件，可以通过传参使其在触发的时候携带数据
* off()：负责监听器的删除

##### 写出一个同时拥有on、emit、off的EventEmitter #####

1. 事件和监听函数的对应关系应该如何处理？映射，因此全局应该设计一个对象来存储二者的关系
2. 如何实现订阅？写操作，将具体的事件和监听函数写入到队列里去
3. 如何实现发布？ 读操作，触发安装在某个事件上对应的监听函数

```js
class myEventEmitter{
	constructor(){
		this.eventMap = {}; //eventMap用来存储事件和监听函数的关系
	}
	on(type, handler){  //type事件名称
		if(!handler instanceof Function){
      throw new Error('你传错了');
		};
    // 判断type事件对应的队列是否存在
		if(!this.eventMap[type]){
      this.eventMap[type] = []; // 若不存在该类型，新建该队列
		};
    // 直接往队列里推入handler
		this.eventMap[type].push(handler);
	};
	emit(type, params){  // 触发时可以传参
    // 假设该事件是有订阅的（对应的事件队列存在）
    if(this.eventMap[type]){
      // 将事件队列里的handler依次执行出队
      this.eventMap[type].forEach((handler, index) => {
        handler(params);
      })
    }
  }
  off(type, handler){
    if(this.eventMap[type]){
      this.eventMap[type].splice(this.eventMap[type].indexOf(handler)>>>0,1)
    }
  }
}
```

##### 测试： #####

```js
const myEvent = new myEventEmitter();
const testHandler = params => {
	console.log('test事件被处罚了,参数是:'+`${params}`);
}
myEvent.on('test', testHandler); //监听
myEvent.emit('test', 'newState');
```

##### 借助发布订阅实现AB通信 #####

在B中编写一个handler，在handler中进行this.setState的操作，然后将handler作为监听器的回调，与某事件（自定义）关联起来，在A组件中触发对应的事件，并将希望携带的参数入参传入即可。

<img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211121125421211.png" alt="image-20211121125421211" style="zoom: 33%;" />

#### 3、Context API ####

React天然提供的一种组件树的全局通信方式，16.3之后具备更强的可用性；

##### 1、Context API工作流 #####

Provider作为数据的提供方，可以将数据下发给自身组件树中任意层级的consumer；

consumer不仅能读取到provider下发的数据，还能读取到这些数据的更新；

因此，数据在生产者、消费者之间能够及时同步；

<img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211121130228283.png" alt="image-20211121130228283" style="zoom:33%;" />

##### 2、使用 #####

1. 创建Context容器对象： 

   ```jsx
   	const XxxContext = React.createContext(defaultVlaue);
   ```

2. 从创建的context中，可以读取到Provider、Comsumer

   ```js
   const {Provider, Consumer} = XxxContext;
   ```

3. 使用Provider(数据的提供者)对组件树中的根组件进行包裹，然后传入**value的属性**，这个value就是后续在组件树中流动的数据

   ```js
   <Provider value={数据}>
   		子组件
   		<Title />
   		<Contet />
   </Provider>
   ```

   * 数据其实是字符串，如果你想传对象，或多个值，可以再包一个{}


   ```js
   <Provider value={{username, age, height}}>
   		子组件
   </Provider>
   ```

4. 这个Value可以被consumer消费，可以读取Provider下发的数据。前提是需要函数、类组件作为它的子组件

   ```js
   <Consumer>
   	{
        value => ( // value就是context中的value数据
           要显示的内容
     			<div> {value.title}</div>
   	    )
   	  }
   </Consumer>
   ```

   * 当consumer没有对应的Provider时，会直接去创建的地方defaultValue查找；

##### 3、 新的context API解决了什么问题 #####

* 过时的context API存在的问题：

  <img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211121134007115.png" alt="image-20211121134007115" style="zoom:33%;" />

  * 前两者提供生产者的角色；
  * contextTypes的成为消费者；

* 缺点： 

  1. 代码不够优雅，不能很好辨别provider、cosumer

  2. 无法保证数据在生产者和消费者之间的及时同步，官网描述：

     如果组件提供的一个context发生了变化，而中间父组件的shouldComponentUpdate返回了false，那么使用该组件的后代组件不会尽心更新。

     返回了context的组件则完全失控，所以基本上没有办法能够可靠的更新context

* 新的context解决了什么问题：

  即使组件的shouldComponentUpdate返回了false，它依然可以**“穿透”**组件继续向后代进行传播，进而确保了数据生产者、数据消费者之间数据的一致性。

#### 4、Redux ####

官网描述：是JS的状态容器，它提供可预测的状态管理；Vue、React可以用

<img src="https://tomoya92.github.io/assets/2021-04-29-09-56-16.png" alt="img" style="zoom:50%;" />

##### 1、角色： #####

* store：单一的数据源，而且是只读的；
* action：对变化的描述
* reducer：负责对变化进行分发、处理

在Redux的整个工作过程中，数据流是严格单向的，很重要一定要说！！！

* 如果想修改数据，只有一种方式：派发action，action会被reducer读取，进而根据action的不同对数据修改，返回新的state，新的state会更新到store里，进而驱动视图层做出对应的改变；
* 因此，任何组件都可以通过store读取到全局的状态；也可以通过合理地派发action，来修改全局的状态。redux提供了状态容器，使得状态能够自由地在组件之间传播；这就是redux实现的思路。

##### 2、redux工作流 #####

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

