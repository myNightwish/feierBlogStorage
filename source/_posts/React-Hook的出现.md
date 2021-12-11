---
title: React-Hook的出现
date: 2021-12-11 22:55:37
tags: Hooks
categories: React&&Vue
description: '为何Hooks是React的未来'
cover: https://images.unsplash.com/photo-1638936020382-143f464e0a8c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80
copyright_author: 飞儿 # 作者覆写
copyright_url: https://www.nesxc.com/post/hexocc.html 
license: CC BY-NC-SA 4.0
license_url: https://creativecommons.org/licenses/by-nc-sa/4.0/
---
## Hooks ##

### why ###

* Hooks是React团队在实践中逐渐认知的一个改进点，背后设计到**类组件、函数组件**两种组件形式的思考和侧重

#### 1、类组件 ####

* 基于ES6的写法，通过继承React.component的组件

#### 2、函数组件 ####

* 以函数组件的形态存在的组件，在早期没有Hooks加持时，函数组件内部无法定义、维护state，因此也叫“无状态组件”

#### 3、对比两种组件： ####

* 类组件继承自class，函数组件不需要；
* 类组件可以访问生命周期，函数组件不可；
* 类组件可以获取实例化后的this，并基于该this做事情，但函数组件不可；
* 类组件可以定义并维护state状态，但函数组件不可；

#### 4、这是否意味着函数组件没有类组件好呢？ ####

不是，在Hooks出现之前，类组件的**能力边界**明显强于函数组件。一味鼓吹轻量、易上手、取代类组件也不是应该讨论谁优谁劣的依据。更多的关注点，应该是二者的不同之处，把对应的场景与不同的特性结合起来。

1. 类组件

   类组件是一个面向对象编程思想的一种表现。面向对象的特性之一：

   * 封装：将一类属性和方法聚合到一个class中
   * 继承：新的class可以通过继承现有的class，实现对某一类属性和方法的复用；

   react类组件内部只需要继承React.component，就轻易获得了内部丰富的配备。

   * React.component提供了很多东西，学习成本更高，比如生命周期，用的不好也会让代码一团糟。大而全的背后是不可忽略的学习成本。可以但没有必要。
   * 开发者编写的逻辑在封装后，是和组件粘在一起的，这就使得类组件内部的逻辑难以实现拆分和复用。这就需要学习更高的设计模式，用更高的学习成本来交换一点编码的灵活度

2. 函数组件

   不仅能承担数据渲染（简单的任务），同样可以承担复杂的交互逻辑；

   * 粗浅的认知：轻量、灵活、较低的学习成本
   * **Dam（React开发者）：函数组件会捕获render内部的状态，这是两类组件最大的不同。**
   * 类组件、函数组件之间的千差万别，但最不能被我们忽视的是，**心智模式层面的差异。**是面向对象和函数式编程这两种不同设计思想的差异

3. **函数式组件更加契合React的理念：**

   UI = f(data)，react组件本身的定位就是函数，吃进去数据，吐出来UI。作为开发者，我们编写的是声明式的代码，而React就是把声明式的代码转换为命令式的DOM操作，把数据层面的描述映射到用户可见的UI变化中去。

   这就意味着react中数据和渲染是紧密绑在一起的，但类组件是做不到这一点。**为什么呢？**

   因为**函数组件会捕获render内部的状态，这是两类组件最大的不同。**

#### 5、函数组件会捕获render内部的状态，这是两类组件最大不同 ####

1. 类组件：

   * 类组件中，虽然props是不可变的，但是this是可变的，this上的数据是可以修改的。this.props的调用每次都可以获取最新的props，而这正是react获取数据实时性的重要手段。多数情况下，this.props与预期的渲染动作的连贯。
   * 假如通过setTimeout将预期的渲染推迟了3s，打破了this.props和渲染动作之间的这种时机上的联动。也就是渲染时捕获到的是一个错误的props，这就出现了问题

2. 函数组件：

   在函数执行的一瞬间就被捕获，而props本身又是一个不可变值，因此在任何时机读取到的props都是最新的props。

   当父组件传递新的props时，其实内部产生了一次新的函数调用，并不会影响上一个props。

   函数组件是真正将数据与渲染绑定在了一起。

【总结】：总的说，函数组件是一个更加匹配其设计理念、也更有利于逻辑拆分和重用的组件表达形式。

#### 6、Hook ####

* 是一套使函数组件更强大、更灵活的钩子。函数组件相比于类组件少了很多东西，而Hooks的出现就是帮助函数式组件补齐这种缺陷。函数式组件可以自由的使用Hooks提供的丰富工具

### what ###

#### 1、useState：引入状态 ####

早期函数组件相比于类组件，劣势之一：缺乏维护和定义state的能力，而这个API就是为函数组件引入状态

* 同样逻辑的函数组件比类组件复杂度更低，代码量更少

  ```
  语法: const [xxx, setXxx] = React.useState(initValue)
  		* 参数: 初始值，允许任意类型的值
  		* 返回值:  第1个为state变量, 第2个为能够修改这个变量的API
  		* React.useState的调用实际上给这个组件关联上了一个状态
  ```

  ```js
  export default function  Button()  {
    const  [buttonText, setButtonText] =  useState("Click me,   please");
  
    function handleClick()  {
     return setButtonText("Thanks, been clicked!");
    }
  
    return  <button  onClick={handleClick}>{buttonText}</button>;
  }
  ```

* 注意：多个状态声明时，必须分开写，且不能出现在条件判断语句中，因为它必须有一样的渲染顺序                

  ```js
      const [ age , setAge ] = useState(18)
      const [ sex , setSex ] = useState('男')
      const [ work , setWork] = useState('前端程序员')
  ```

  ```js
  const [ age , setAge ] = useState(18)
      if(showSex){
          const [ sex , setSex ] = useState('男')
          showSex=false
      }
  
  const [ work , setWork ] = useState('前端程序员')
  ```

#### 2、useEffect：为组件引入副作用、生命周期 ####

过去在DidMount 、DidUpdate、willUnmount中做的事，可以放在该钩子做。比如：操作DOM、获取外部API

生命周期到useEffect的转换关系都不是最重要的，最重要的是构建组件有副作用，引入useEffect这样的条件反射。**为函数组件引入副作用的钩子。**

```js
useEffect(callback, [](可选));
--  useEffect(() => {
    // 每次渲染都执行
    });
--  useEffect(() => {
      // 只在挂载阶段执行一次的副作用，且该函数的返回值不是一个函数
    },[]);
--  useEffect(() => {
      // 只在挂载、卸载阶段执行的副作用，且该函数的返回值是一个函数
  		// 业务逻辑A: 它会在挂载阶段执行
  		....
      // 业务逻辑B:它会在卸载时执行
  		return () => {};
    },[]);
--  useEffect(() => {
      // 每一次渲染、且卸载阶段执行的副作用，且该函数的返回值是一个函数，不传第2个参数
  		// 业务逻辑A: 它会在每次渲染时执行
  		....
      // 业务逻辑B:它会在卸载时执行
  		return () => {};
    });
--  useEffect(() => {
      // 根据一定的依赖条件出发的副作用
      // 业务逻辑：
      ....
      // 若xxx是一个函数，则xxx会在组件卸载时被触发
  		return xxx;
    },[count1, count2, count3]);
```

【补充】：useEffect中返回的函数叫“清除函数”，当React识别到该函数，会在下卸载阶段执行其清除逻辑。这个规律不会收第2个参数、或其他参数因素的影响。只要你在useEffect回调中返回了一个函数，它就会被当做清除函数来处理。

#### 3、Hooks是如何升级工作模式的，为什么需要Hooks？面试 ####

##### 1、告别难以理解的class #####

class的两大痛点：

1. this

   比如推出了箭头函数、bind来解决this问题，但本质上是在用实践层面解决设计层面的问题。而函数组件就没有这个问题了。

2. 生命周期

   1. 学习成本
   2. 不合理的逻辑规划方式

##### 2、解决业务逻辑难以拆分的问题 #####

1. 类组件：

   过去组织业务逻辑时，先想清楚业务需要，将对应的业务逻辑拆到对应的生命周期中，逻辑与生命周期强耦合。比如：DidMout去获取数据，在DidUpdate里获取数据的变化，但是大型项目中，一个生命周期做的事情很多。这些事情看起来毫无关联，而有关联的被分散在不同的生命周期里。

2. 但是Hooks有专门管理状态的、有引入副作用的等等，**它能帮我们实现业务逻辑的聚合，避免复杂的组件和冗余的代码。**

##### 3、使状态逻辑复用变得更简单可行 #####

1. 过去复用状态逻辑，靠的是HOC、renderer Props这些组件设计模式，但这些设计模式并非万能，它们在实现逻辑复用的同时，也破坏着组件的结构，其中一个最常见的问题就是**“嵌套地狱”**的现象。
2. 而Hooks可以看做是React解决状态逻复用的原生途径，达到既不破坏组件结构，又能够实现逻辑复用的效果
3. 这块在第3下一个专题上会展开

##### 4、从设计思想上更加契合React的理念 #####

前面的函数组件、类组件已经做了对比分析。

#### 4、Hooks的局限性 ####

Hooks并非万能，在认识到Hooks利好的同时，也需要认识到他的局限性。

1. Hooks暂时还不嫩而过完全第为函数组件补全类组件的能力：
   比如，某些钩子还是没有；

2. 函数组件仍然是“轻量”，这可能使得它并不能很好地消化“复杂”

3. 在使用层面严格的约束

   耦合和内聚的边界很难把握，函数式组件给了更多自由，却对开发者代码能力提了更高的要求。

### how：深入React-Hooks工作机制 ###

#### 1、HOOKS的使用原则2个： ####

1. 只在函数组件中调用Hook

2. 不要在循环、条件、嵌套函数中调用Hook

   目的：确保Hooks在每次渲染时，都能保持同样的渲染执行顺序。

#### 2、为什么渲染顺序如此重要呢？ ####

* 如果不保证Hooks执行顺序会导致什么问题？

  下面的代码按照意图，预期希望初次渲染时，展示出来，点击后，只获取carrer，并且名字修改更新（第二次渲染）

  现象：组件没有发生变化，且报错渲染Hooks钩子减少。

  初次渲染输出：isMounted是false， carrer：搬砖

  单机修改按钮：isMounted为true，但carrer：小1，为什么发生的是carrer呢？

  ```js
  // eslint-disable-next-line   禁止校验
  import React, {useState} from 'react';
  
  let isMounted = false;
   
  function personInfo(){
    let name, age, career, serName, setCareer;
    console.log('isMounted is:', isMounted);
    if(!isMounted){
      [name, setName] = useState('小1');
      [age] = useState('100');
      isMounted = true;
    }
    [career, setCareer] = useState('搬砖');
    console.log('career', career);
    rerurn (
      <div className = "personInfo">
        {{name} ? <p>姓名： {name}</p> : null}
        {{age} ? <p>年龄： {age}</p> : null}
        <p>职业：{career}</p>
        <button onClick = {() => {
          setName('小2');
        }}>
          修改姓名
        </button>
      </div>
    )
  }
  ```

#### 3、源码调用流程 ####

Hooks的正常运作，在底层依赖于顺序链表；

<img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211121185614905.png" alt="image-20211121185614905" style="zoom: 33%;" />

##### 1、mounState #####

useState的调用会落脚到mounState中：

<img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211121185632743.png" alt="image-20211121185632743" style="zoom: 20%;" /><img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211121185651487.png" alt="image-20211121185651487" style="zoom: 20%;" /><img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211121185932268.png" alt="image-20211121185932268" style="zoom: 20%;" />

* 主要工作是：初始化Hooks，最需要关注的是mountWorkInProgressHook

  <img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211121190156553.png" alt="image-20211121190156553" style="zoom: 25%;" /><img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211121190221958.png" alt="image-20211121190221958" style="zoom:25%;" />

Hooks所有的信息收在Hook对象里，而对象以单向链表的形式相互串联。

##### 2、mountState #####

首次渲染和更新的区别是，是调用的mounState还是updateState。

* mountState：首次渲染，构建链表并渲染

* updateState做的事情：依次遍历链表并渲染。
* 因此Hooks的渲染是通过“一次遍历”来定位每个Hooks的内容的，如果前后两次读到的链表在顺序出现差异，那么渲染的结果自然是不可控的。
* Hooks的本质是链表。

##### 3、重现2中的执行过程 #####

1. 首次渲染时的链表结构：

<img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211121191404195.png" alt="image-20211121191404195" style="zoom: 20%;" />

2. 第二次渲染时，只有一个钩子

<img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211121191424244.png" alt="image-20211121191424244" style="zoom:20%;" />

3. 在更新时，只会按照顺序取到链表头结点

<img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20211121191456565.png" alt="image-20211121191456565" style="zoom:20%;" />