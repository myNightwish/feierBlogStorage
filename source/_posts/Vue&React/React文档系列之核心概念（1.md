---
title: React核心概念系列（1)
abbrlink: React's key Concept-1
date: 2022-03-27 22:02:09
categories: 1.4-框架
tags: React文档
description: React文档系列之核心概念
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
---


# <center>React文档系列之核心概念（1）</center>
今天终于开启了react官方文档学习系列的第一步，简单日程如下：

* 先看完基础的核心概念部分；
* 然后是高级指引部分，希望能追上早会技术分享的脚步；
* 之后，会将以前的阅读与项目中遇到的问题，整合进行总结出来。这个目的所在

### 1、JSX ###

#### 1.1 什么是JSX? ####

##### 官网定义： #####

* 是一个 JavaScript 的**语法扩展**， 可以很好地描述 UI 应该呈现出它应有**交互的本质形式**。

* **JSX **可能会使人联想到模版语言**，但它具有 JavaScript 的全部功能**

* 这种标签语法既不是字符串也不是 HTML

  ```jsx
  const element = <h1>Hello, world!</h1>;
  ```

##### 总结后续内容： #####

* 文档定义：**JSX是拓展**而不是某个版本，说明**浏览器不像天然支持JS那样支持JSX**，即使它看起来很像HTML，所以JSX其实是React.creatElement()的语法糖
* 而**帮手Babel**是一个工具链，主要用于将ECMAScript2015+版本代码转换为向后兼容的JS语法，以便能够运行在当前、旧版本的浏览器和其他环境中。
* JSX会被**Babel**编译为**react.creatElement()**的调用，这个函数会返回React元素。
* JSX语法糖让我们用最熟悉的类HTML标签语法来创建虚拟DOM，降低学习成本，提升开发效率

#### 1.2 为什么要用 JSX？ ####

* React 认为**渲染逻辑**本质上与**其他 UI 逻辑**内在耦合：

  比如，在 UI 中需要绑定处理事件、在某些时刻状态发生变化时需要通知到 UI，以及需要在 UI 中展示准备好的数据。

* React 并没有人为地分离**标记与逻辑**，而是通过将二者共同存放在称之为“组件”的松散耦合单元之中，来实现分离

* React [不强制要求](https://react.docschina.org/docs/react-without-jsx.html)使用 JSX，但是大多数人发现，在 JavaScript 代码中将 JSX 和 UI 放在一起时，会在视觉上有辅助作用。它还可以使 React 显示更多有用的错误和警告消息。

#### 1.3 JSX的使用 ####

##### 大括号 #####

* 声明了一个名为 `name` 的变量，然后在 JSX 中使用它：

* 在 JSX 语法中，你可以在大括号内放置任何有效的 JS表达式

  ```jsx
  const name = 'Josh Perez';
  const element = <h1>Hello, {name}</h1>;
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
  ```

##### 函数调用 #####

* 调用 JavaScript 函数 `formatName(user)` 的结果，并将结果嵌入到 `<h1>` 元素中

  ```jsx
  function formatName(user) {
    return user.firstName + ' ' + user.lastName;
  }
  const user = {
    firstName: 'Harper',
    lastName: 'Perez'
  };
  
  const element = (
    <h1>Hello, {formatName(user)}!  </h1>
  );
  
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
  ```

##### 条件语句 #####

* 可以在 `if` 语句和 `for` 循环的代码块中使用 JSX，将 JSX 赋值给变量，把 JSX 当作参数传入，以及从函数中返回 JSX：

* 在编译之后，JSX 表达式会被转为普通 JavaScript 函数调用，并且对其取值后得到 JavaScript 对象。

  ```JSX
  function getGreeting(user) {
    if (user) {
      return <h1>Hello, {formatName(user)}!</h1>;  }
    return <h1>Hello, Stranger.</h1>;}
  ```

##### JSX 的属性 #####

注意：因为 JSX 语法上更接近 JavaScript 而不是 HTML，所以 React DOM 使用 `camelCase`（小驼峰命名）来定义属性的名称，而不使用 HTML 属性名称的命名约定。

* 用引号，来将属性值指定为字符串字面量：

  ```jsx
  const element = <div tabIndex="0"></div>;
  ```

* 用大括号，来在属性值中插入一个 JavaScript 表达式：

  ```jsx
  const element = <img src={user.avatarUrl}></img>;
  ```

* 在属性中嵌入 JavaScript 表达式时，不要在大括号外面加上引号。你应该仅使用引号（对于字符串值）或大括号（对于表达式）中的一个，对于同一属性不能同时使用这两种符号。

##### JSX 防止注入攻击 #####

https://mynightwish.top/posts/2062301197.html?_sw-precache=e8cf09069586c0ee9ef7f817de532a71

* React DOM 在渲染所有输入内容之前，默认会进行[转义](https://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html)。它可以确保在你的应用中，永远不会注入那些并非自己明确编写的内容。

* 所有的内容**在渲染之前都被转换成了字符串**。这样可以有效地防止 [XSS（cross-site-scripting, 跨站脚本）](https://en.wikipedia.org/wiki/Cross-site_scripting)攻击。

* 可以安全地在 JSX 当中插入用户输入内容：

  ```JSX
  const title = response.potentiallyMaliciousInput;
  // 直接使用是安全的：
  const element = <h1>{title}</h1>;
  ```

#### 1.4 JSX --> React元素 ####

* Babel 会把 JSX 转译成一个名为 `React.createElement()` 函数调用;

* 这个函数会返回一个叫做**“React  Element”**的JS对象

  ```jsx
  const element = (
    <h1 className="greeting">
      Hello, world!
    </h1>
  );
  // 二者等效
  const element = React.createElement(
    'h1',
    {className: 'greeting'},
    'Hello, world!'
  );
  ```

* 这个函数会返回一个叫做**“React  Element”**的JS对象，也就是 **“React 元素”**。它们描述了预期在屏幕上看到的内容。

* React 通过读取这些对象，然后使用它们来**构建 DOM** 以及保持随时更新。

  ```jsx
  // 注意：这是简化过的结构
  const element = {
    type: 'h1',
    props: {
      className: 'greeting',
      children: 'Hello, world!'
    }
  };
  ```

### 2、 React 元素 ###

说人话：**如何将 React 元素渲染为 DOM的？**

#### 2.1 将一个元素渲染为 DOM ####

* 注意：

  * 假设 HTML 文件某处有一个 `<div>`：**“根” DOM 节点**，因为该节点内的所有内容都将由 React DOM 管理。
  * 仅使用 React 构建的应用通常只有单一的根 DOM 节点。

  ```html
  <div id="root"></div>
  ```

* 将想要渲染的React 元素传入 [`ReactDOM.render()`](https://react.docschina.org/docs/react-dom.html#render)：

  ```jsx
  const element = <h1>Hello, world</h1>;
  ReactDOM.render(element, document.getElementById('root'));
  ```

#### 2.2 已渲染的元素的更新 ####

* React 元素是[不可变对象](https://en.wikipedia.org/wiki/Immutable_object)。一旦被创建，你就**无法更改它的子元素或者属性**。一个元素就像电影的单帧：它代表了某个特定时刻的 UI。

* **更新 UI** 唯一的方式是**创建一个全新的元素**，并将其传入 [`ReactDOM.render()`](https://react.docschina.org/docs/react-dom.html#render)。

* 考虑一个计时器的例子：

  ```jsx
  function tick() {
    const element = (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {new Date().toLocaleTimeString()}.</h2>
      </div>
    );
    ReactDOM.render(element, document.getElementById('root'));}
  
  setInterval(tick, 1000);
  ```

  * 这个例子会在 [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) 回调函数，**每秒都调用 [`ReactDOM.render()`](https://react.docschina.org/docs/react-dom.html#render)。**

* **注意：**

  在实践中，大多数 React 应用**只会调用一次** [`ReactDOM.render()`](https://react.docschina.org/docs/react-dom.html#render)。怎么做到的呢？？？？？

#### 2.3 React只更新需更新部分 ####

* React DOM 会将元素和它的子元素与它们之前的状态**比较**，并只会进行**必要的更新**来使 DOM 达到预期的状态。

* 尽管每一秒都会**新建一个描述整个 UI 树的元素**，React DOM **只会更新实际改变了的内容，也就是例子中的文本节点。**

  ![img](https://cdn.jsdeliver.net/gh/myNightwish/CDN_res/react/granular-dom-updates.gif)

* 根据我们的经验，考虑 UI 在任意给定时刻的状态，而不是随时间变化的过程，能够消灭一整类的 bug。 啥意思呢？？？？

### 3、组件 ###

#### 3.1 定义 ####

* 组件，从概念上类似于 JS函数。它**接受任意的入参**（即 “props”），并**返回**用于描述页面展示内容的 **React 元素**。

* React 元素可以是DOM 标签、或用户自定义的组件：

  为自定义组件时，它会将 JSX 所接收的**属性**以及**子组件**（children）**转换为单个对象**传递给组件，这个对象被称之为 “props”。

* 转换过程：

  1. 调用 `ReactDOM.render()` 函数，并传入 `<Welcome name="Sara" />` 作为参数。
  2. React 调用 `Welcome` 组件，并将 `{name: 'Sara'}` 作为 props 传入。
  3. `Welcome` 组件将 `<h1>Hello, Sara</h1>` 元素作为返回值。
  4. React DOM 将 DOM 高效地更新为 `<h1>Hello, Sara</h1>`。

  ```jsx
  function Welcome(props) {  
    return <h1>Hello, {props.name}</h1>;
  }
  
  const element = <Welcome name="Sara" />;
  ReactDOM.render(element, document.getElementById('root'));
  ```

  1. 我们调用 `ReactDOM.render()` 函数，并传入 `<Welcome name="Sara" />` 作为参数。
  2. React 调用 `Welcome` 组件，并将 `{name: 'Sara'}` 作为 props 传入。
  3. `Welcome` 组件将 `<h1>Hello, Sara</h1>` 元素作为返回值。
  4. React DOM 将 DOM 高效地更新为 `<h1>Hello, Sara</h1>`。

* 组件复用

  提取组件可能是一件繁重的工作，但在大型应用中，构建可复用组件库是完全值得的。

  根据经验来看，如果 UI 中有一部分**被多次使用**（`Button`，`Panel`，`Avatar`），或**组件本身就足够复杂**（`App`，`FeedStory`，`Comment`），那它就是一个可复用组件的候选项。

#### 3.2 Props 的只读性 ####

**React的严格规则：**所有 React 组件都必须像**纯函数**一样保护它们的 props 不被更改。

* 纯函数：多次调用下相同的入参始终返回相同的结果。

  ```jsx
  function sum(a, b) { //纯函数
    return a + b;
  }
  ```

  ```jsx
  function withdraw(account, amount) { //非纯函数，因为它更改了自己的入参：
    account.total -= amount;
  }
  ```

* 任何组件（函数组件、类组件）都决不能修改自身的 props。但应用的 UI 是动态的，并会伴随着时间的推移而变化，怎么办？

  “state”出场啦~~，在不违反上述规则的情况下，state 允许 React 组件随用户操作、网络响应或者其他变化而动态更改输出内容。

### 4、state ###

#### 4.1  `ReactDOM.render()`更新渲染元素 ####

* 前面章节2介绍了一种更新 UI 界面的方法：调用 `ReactDOM.render()` 来更新想渲染的元素：

  ```jsx
  function tick() {
    const element = (
      <div>
        <h2>It is {new Date().toLocaleTimeString()}.</h2>
      </div>
    );
    ReactDOM.render( element,    document.getElementById('root')  );}
  
  setInterval(tick, 1000);
  ```

* 如何封装真正可复用的 `Clock` 组件，并设置自己的计时器并每秒更新一次：

  * 关键的技术细节：`Clock` 组件需要设置一个计时器，并且需要每秒更新 UI。

  ```jsx
  function Clock(props) {
    return (
      <div>           
        <h2>It is {props.date.toLocaleTimeString()}.</h2>    
      </div>);
  }
  
  function tick() {
    ReactDOM.render(
      <Clock date={new Date()} />,    document.getElementById('root')
    );
  }
  
  setInterval(tick, 1000); 
  ```

#### 4.2 state更新渲染元素 ####

* 以上的实现并不符合预期，其实**每秒都在重新创建，重新调用**。而我们希望只编写一次代码，便可让 `Clock` 组件自我更新：
* 此时，需要在 `Clock` 组件中添加 “state” 来实现这个功能。State 与 props 类似，但 state 是私有的，并完全受控于当前组件。

##### 1. 转成类组件 #####

```jsx
class Clock extends React.Component {
  constructor(props) {
    super(props);  //通过以下方式将 props 传递到父类的构造函数中：
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div><h2>It is {this.state.date.toLocaleTimeString()}.</h2></div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

##### 2. 设置 `Clock` 的计时器并每秒更新它 #####

* 在具有许多组件的应用中，当组件被销毁时释放所占用的资源是非常重要的。

* “挂载"：当 `Clock` 组件第一次被渲染到 DOM 中时，就为其[设置一个计时器](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval)

  ```jsx
    componentDidMount() {
      // 把计时器的 ID 保存在 this 之中（this.timerID）
      this.timerID = setInterval(() => this.tick(),1000);
    }
  ```

* “卸载"：当 DOM 中 `Clock` 组件被删除的时候，应该[清除计时器](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/clearInterval)。

  ```jsx
    componentWillUnmount() {
      clearInterval(this.timerID);
    }
  ```

* 实现 `tick()` 方法，`Clock` 组件每秒都会调用它。现在时钟每秒都会刷新。

  ```jsx
  tick() {
      this.setState({
        date: new Date()
      });
    }
  ```

##### 3. 总结☆☆☆ #####

1. 当 `<Clock />` 被传给 `ReactDOM.render()`时，React 会调用 `Clock` 组件的构造函数。因为 `Clock` 需要显示当前的时间，所以它会用一个包含当前时间的对象来初始化 `this.state`。我们会在之后更新 state。

2. 之后 React 会调用组件的 `render()` 方法。这就是 React 确定该在页面上展示什么的方式。然后 React 更新 DOM 来匹配 `Clock` 渲染的输出。

3. 当 `Clock` 的输出被插入到 DOM 中后，React 就会调用 `ComponentDidMount()` 生命周期方法。在这个方法中，`Clock` 组件向浏览器请求设置一个计时器来每秒调用一次组件的 `tick()` 方法。

4. 浏览器每秒都会调用一次 `tick()` 方法。 在这方法之中，`Clock` 组件会通过调用 `setState()` 来计划进行一次 UI 更新。

   **得益于 `setState()` 的调用，React 能够知道 state 已经改变了**，然后会重新调用 `render()` 方法来确定页面上该显示什么。这一次，`render()` 方法中的 `this.state.date` 就不一样了，如此以来就会渲染输出更新过的时间。React 也会相应的更新 DOM。

   * `setState()` 是视图更新的驱动方式

5. 一旦 `Clock` 组件从 DOM 中被移除，React 就会调用 `componentWillUnmount()` 生命周期方法，这样计时器就停止了。

#### 4.3 State的3个使用原则 ####

##### 1. 不要直接修改 State #####

* 否则不会重新渲染组件。而是应该使用 `setState()`:

  ```jsx
  // Wrong
  this.state.comment = 'Hello';
  // Correct
  this.setState({comment: 'Hello'});
  ```

##### 2. State 的更新可能是异步的 #####

* 出于性能考虑，React 可能会把多个 `setState()` 调用合并成一个调用

* 因为 `this.props` 和 `this.state` 可能会异步更新，所以**不要依赖他们的值来更新下一个状态**

  ```jsx
  // Wrong
  this.setState({
    counter: this.state.counter + this.props.increment,
  });
  ```

* 要解决这个问题，可以让 `setState()` 接收一个函数而不是一个对象。这个函数用上一个 state 作为第一个参数，将此次更新被应用时的 props 做为第二个参数：

  ```jsx
  // Correct
  this.setState((state, props) => ({
    counter: state.counter + props.increment
  }));
  ```

##### 3. State的更新会被合并 #####

* 当你调用 `setState()` 时，React 会把**你提供的对象合并到当前的 state**

* 例如，你的 state 包含几个独立的变量：

  ```jsx
  constructor(props) {
    super(props);
    this.state = {
      posts: [],      
      comments: []    
    };
  }
  ```

  然后你可以分别调用 `setState()` 来单独地更新它们：

  ```jsx
  componentDidMount() {
    fetchPosts().then(res => {
      this.setState({ posts: res.posts });
    });
  
    fetchComments().then(res => {
      this.setState({  comments: res.comments });
    });
  }
  ```

  这里的合并是浅合并，所以 `this.setState({comments})` 完整保留了 `this.state.posts`， 但是完全替换了 `this.state.comments`。

#### 4.4 数据是下流动的 ####

##### 1. state 是局部封装的 #####

* 不管是父组件或是子组件都无法知道**某个组件是有状态的还是无状态的**，且它们**也不关心它是函数组件还是 class 组件**。这就是为什么称 state 为局部的或是封装的的原因：

  除了拥有并设置了它的组件，其他组件都无法访问。

* 组件可以选择把它的 state 作为 props 向下传递到它的子组件中：

  `FormattedDate` 组件会在其 props 中接收参数 `date`；

  但组件本身不知道它是来自于 `Clock` 的 state，或是 `Clock` 的 props，还是手动输入的：

  ```jsx
  <FormattedDate date={this.state.date} />
  
  function FormattedDate(props) { //傻子，不知道是prop、state、还是自定义传过来的
    return <h2>It is {props.date.toLocaleTimeString()}.</h2>;
  }
  ```

##### 2. 总结 #####

这通常会被叫做“自上而下”或是“单向”的数据流。

* 任何的 state 总是所属于特定的组件，且从该 state 派生的任何数据或 UI 只能影响树中“低于”它们的组件。
* 如果你把一个以组件构成的树想象成一个 props 的数据瀑布的话，那么每一个组件的 state 就像是在任意一点上给瀑布增加额外的水源，但它只能向下流动。

* 在 React 应用中，组件是有状态组件还是无状态组件属于组件实现的细节，它可能会随着时间的推移而改变。你可以在有状态的组件中使用无状态的组件，反之亦然。这咋理解？？？

### 5、事件处理 ###

#### 5.1 与DOM元素的差异 ####

React 元素的事件处理和 DOM 元素的很相似，但是有一点语法上的不同：

1. 使用 JSX 语法时你需要传入一个函数作为事件处理函数，而不是一个字符串

   ```jsx
   <button onclick="activateLasers()">
     Activate Lasers
   </button>
   
   <button onClick={activateLasers}>
     Activate Lasers
   </button>
   ```

2. 不能通过返回 `false` 的方式阻止默认行为。你必须显式的使用 `preventDefault`

   例如，传统的 HTML 中阻止链接默认打开一个新页面

   ```jsx
   <a href="#" onclick="console.log('clicked.'); return false">Click me</a>
   
   function ActionLink() {
     function handleClick(e) {
       e.preventDefault();
       console.log('clicked.');
     }
     return (<a href="#" onClick={handleClick}>Click me</a>);
   }
   ```

   * 在这里，`e` 是一个合成事件。React 根据 [W3C 规范](https://www.w3.org/TR/DOM-Level-3-Events/)来定义这些合成事件，所以你**不需要担心跨浏览器的兼容性问题**。查看 [`SyntheticEvent`](https://react.docschina.org/docs/events.html) 参考指南
   * 用 React 时，你一般不需要使用 `addEventListener` 为已创建的 DOM 元素添加监听器。事实上，你只需要在该元素初始渲染的时候添加监听器即可

#### 5.2  回调函数中的 `this` ####

##### 绑定this #####

* 在 JS 中，class 的方法默认不会[绑定](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind) `this`。当你调用函数时 `this` 的值为 `undefined`。
* 这并不是 React 特有的行为；这其实与 [JavaScript 函数工作原理](https://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/)有关
* 通常情况下，如果你没有在方法后面添加 `()`，例如 `onClick={this.handleClick}`，你应该为这个方法绑定 `this`。

##### 解决绑定麻烦2种： #####

1. 实验性的 [public class fields 语法](https://babeljs.io/docs/plugins/transform-class-properties/)，[Create React App](https://github.com/facebookincubator/create-react-app) 默认启用此语法。

   ```jsx
   class LoggingButton extends React.Component {
     // 此语法确保 `handleClick` 内的 `this` 已被绑定。  // 注意: 这是 *实验性* 语法。   handleClick = () => {    console.log('this is:', this);  }
     render() {
       return (<button onClick={this.handleClick}>Click me</button>);
     }
   }
   ```

2. 箭头函数

   问题：每次渲染 `LoggingButton` 时都会创建不同的回调函数；

   * 在大多数情况下，这没什么问题，但如果该回调函数作为 prop 传入子组件时，这些组件可能会额外的重新渲染
   * so，建议在构造器中绑定或使用 class fields 语法来避免这类性能问题

   ```jsx
   class LoggingButton extends React.Component {
     handleClick() {console.log('this is:', this);}
   
     render() {
       // 此语法确保 `handleClick` 内的 `this` 已被绑定。
       return (<button onClick={() => this.handleClick()}>Click me</button>);
     }
   }
   ```

#### 5.3 事件传参 ####

2种方式：

* 在这2种情况下，React 的事件对象 `e` 会被作为第二个参数传递
* 如果通过箭头函数的方式，事件对象必须显式的进行传递，而通过 `bind` 的方式，事件对象以及更多的参数将会被隐式的进行传递。

```jsx
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```

