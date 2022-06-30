---
layout: post
title: React核心概念系列（2）
categories: 1.4-框架
tags: React文档
description: React文档系列之核心概念
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: React's key Concept-2
date: 2022-03-28 18:30:11
---
## <center>React文档系列之核心概念（2）</center>

书接上回，由于条件渲染（7）+列表的使用（8）在实际开发中，写过很多遍；这里不再讨论他们的使用。但是其中关注到：key为什么建议不要用index，这里周会做过一次讨论。

* 官方推荐的阅读文档：https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318
* 周会讨论的文档：主要是源码部分
* 这个点，出于文章的结构性考虑，会作为单独的篇幅探讨

### 6、表单 ###

这个地方是我最近做官网streamLake需求中，遇到过的实际问题；可以结合表单提交那篇博文讨论。ok，进入正题！

#### 6.1 React中的表单 ####

* 在 React 里，HTML 表单元素的工作方式和其他的 DOM 元素有些不同，这是因为表单元素通常会保持一些内部的 state。例如这个纯 HTML 表单只接受一个名称：

  ```jsx
  <form>
    <label>名字:
      <input type="text" name="name" />
    </label>
    <input type="submit" value="提交" />
  </form>
  ```

  * 此表单具有默认的 HTML 表单行为，即在用户提交表单后跳到新页面。 React 中同样有效

* 但大多数情况下，使用 **JS 函数可以很方便的处理表单的提交**， 同时还可以**访问用户填写的表单数据**。实现这种效果的标准方式是使用“受控组件”。

#### 6.2 受控组件 ####

##### 定义： #####

* 在 HTML 中，表单元素（如`<input>`、 `<textarea>` 和 `<select>`）之类的表单元素**通常自己维护 state，并根据用户输入进行更新**。

* 而 React 中，可变状态（mutable state）通常存在组件的 state 属性中，且只能通过 [`setState()`](https://react.docschina.org/docs/react-component.html#setstate)更新。
* so，可以把两者结合起来，使 React 的 state 成为“唯一数据源”：渲染表单的 React 组件还控制着用户输入过程中表单发生的操作。
* 被 React **以这种方式控制取值的表单输入元素**就叫做**“受控组件”。**

##### 使用： #####

* 例如，如果想让表单在提交时打印出名称，可以将表单写为受控组件：

  * 由于在表单元素上设置了 `value` 属性，因此显示的值将始终为 `this.state.value`，这使得 React 的 state 成为唯一数据源。
  * 由于 `handlechange` 在每次按键时都会执行并更新 React 的 state，因此显示的值将随着用户输入而更新。
  * 对于受控组件来说，**输入值始终由 React 的 state 驱动**。你也可以将 value 传递给其他 UI 元素，或者通过其他事件处理函数重置，但这意味着你需要编写更多的代码。

  ```jsx
  constructor(props) {
      super(props);
      this.state = {value: ''};
  }
  const handleChange = (event) => {this.setState({value: event.target.value});}
  const handleSubmit = (event) => {
    alert('提交的名字: ' + this.state.value);
    event.preventDefault();
  }
  
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>名字:
          <input type="text" 
            value={this.state.value} 
            onChange={this.handleChange} />
        </label>
        <input type="submit" value="提交" />
      </form>
    );
  }
  }
  ```

* 在百度的有一期需求是这样的，所以当时也不用操心数据维护的问题。但是后来需求中，因为考虑组件的封装问题，这样就不好处理了：

  * 如果这里的input组件是自定义封装的组件，怎么办，这样就没有这么方便去用satte维护了。这就涉及到跨组件写，成本就更高了

#### 6.3 常见受控组件 ####

##### textarea标签： #####

* 与单行 input 的表单非常类似：略

##### select标签： #####

* `<select>` 创建下拉列表标签

  ```jsx
  this.state = {value: 'lime'}; //默认选中项
  const handleChange = (event) => {
      this.setState({value: event.target.value});
    }
  <form onSubmit={this.handleSubmit}>
    <label>选择你喜欢的风味:
      <select value={this.state.value} onChange={this.handleChange}>
        <option value="grapefruit">葡萄柚</option>
        <option value="lime">酸橙</option>
      </select>
    </label>
    <input type="submit" value="提交" />
  </form>
  ```

* `select` 标签中选择多个选项：

  ```
  <select multiple={true} value={['B', 'C']}>
  ```

##### 文件 input 标签：《非受控》 #####

* 在 HTML 中，`<input type="file">` 允许用户从存储设备中选择一个或多个文件，将其上传到服务器，或通过使用 JavaScript 的 [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications) 进行控制。

* 因为它的 value 只读，所以它是 React 中的一个**非受控**组件。将与其他非受控组件[在后续文档中](https://react.docschina.org/docs/uncontrolled-components.html#the-file-input-tag)一起讨论。

  ```html
  <input type="file" />
  ```

##### 多个输入控件： #####

* 可以给每个元素添加 `name` 属性，并让处理函数根据 `event.target.name` 的值选择要执行的操作

  ```jsx
  this.state = {
    isGoing: true,
    numberOfGuests: 2
  };
  
  handleInputChange(event) {
    const target = event.target;
    const value = target.name === 'isGoing' ? target.checked : target.value;
    const name = target.name;
    // 使用了 ES6 计算属性名称的语法更新给定输入名称对应的 state 值
    this.setState({[name]: value});
  }
  <input
    name="isGoing"
    type="checkbox"
    checked={this.state.isGoing}
    onChange={this.handleInputChange} />
  ```

#####  ES6 计算属性名称 #####

* 以下代码等同：

  ```jsx
  this.setState({[name]: value});
  ```

  ```jsx
  var partialState = {};
  partialState[name] = value;
  this.setState(partialState);
  ```

##### 受控输入空值 #####

* 在[受控组件](https://react.docschina.org/docs/forms.html#controlled-components)上指定 value 的 prop 会阻止用户更改输入。如果你指定了 `value`，但输入仍可编辑，则可能是你意外地将`value` 设置为 `undefined` 或 `null`。

* 效果：输入最初被锁定，但在短时间延迟后变为可编辑

  ```jsx
  ReactDOM.render(<input value="hi" />, mountNode); //咋输都输不进去
  或：ReactDOM.render(<input value={"hi"} />, mountNode);
  
  setTimeout(function() {
    ReactDOM.render(<input value={null} />, mountNode);
  }, 1000);
  ```

#### 6.4 受控组件的替代方案 ####

* 有时使用受控组件会很麻烦，因为需要为数据变化的每种方式都编写事件处理函数，并通过一个 React 组件传递所有的输入 state。
* 当你将之前的代码库转换为 React 或将 React 应用程序与非 React 库集成时，这可能会令人厌烦。在这些情况下，你可能希望使用[非受控组件](https://react.docschina.org/docs/uncontrolled-components.html), 这是实现输入表单的另一种方式。

* 想寻找包含验证、追踪访问字段以及处理表单提交的完整解决方案，使用 [Formik](https://jaredpalmer.com/formik) 是不错的选择。然而，它也是建立在受控组件和管理 state 的基础之上

### 7、状态提升 ###

这个demo非常有趣，请多多研究一下

#### 7.1 状态提升的做法 ####

在 React 中，将多个组件中需要共享的 state 向上移动到它们的最近共同父组件中，便可实现共享 state。这就是所谓的“状态提升”。

* 此时，共享组件之间便有了同一数据源，

* 但新问题出现了：

  props是只读的，共享组件失去了对它的控制权

* 在 React 中，这个问题通常是通过使用“受控组件”来解决的

  与 DOM 中的 `<input>` 接受 `value` 和 `onChange` 一样，父组件把**值和更新值的函数都作为props传下去**，子组件将来更新时，调用更新函数

  * 它通过修改父组件自身的内部 state 来处理数据的变化，进而使用新的数值重新渲染那些要用这些数据的共享组件。

#### 7.2 demo分析

##### 自己的理解总结：

- 原本两个组件，内部自己维护自己的state 。但因为要求二者同步更新，所以提出了状态提升。将父组件中的state来掌控这个个数据源，子组件做为props下流，拿到温度，各自按自己的逻辑显示；
- 但受控组件还要用户输入控制，so，为了解决这个问题，父组件下流props时，不仅传显示数据温度，还要将改变温度的函数也传下去，将来受控组件才能更新；
- 更新时，调用传过来的函数及新输入值，从而更新父组件内的state。state下流至props，UI更新：

##### demo代码：

- 子组件：

  ```jsx
  constructor(props) {super(props);}
  handleChange(e) {this.props.onTemperatureChange(e.target.value);}
  
  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature} onChange={this.handleChange} />
      </fieldset>
    );
  ```

- 父组件：

  ```js
  constructor(props) {// 省略
      this.state = {temperature: '', scale: 'c'};
   }
  
  handleCelsiusChange(temperature) {this.setState({scale: 'c', temperature});}
  handleFahrenheitChange(temperature) {this.setState({scale: 'f', temperature});}
  
  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;
    return (
      <div>
        <TemperatureInput scale="c" temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange} />
        <TemperatureInput scale="f" temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange} />
        <BoilingVerdict  celsius={parseFloat(celsius)} />
      </div> );
  ```

##### 过程梳理：

当你对输入框内容进行编辑时会发生些什么：

```
输入框输值 ---> 调用 DOM 中 <input> 的 onChange 方法:handleChange
---> 调用 this.props.onTemperatureChange()，并传入新输入的值作为参数 
---> 通过使用新的输入值与当前输入框对应的温度计量单位来调用 this.setState() 
--->进而请求 React 重新渲染自己本身
---->  render 方法得到组件的 UI 呈现 ---> 子组件的 render 方法来获取子组件的 UI 呈现。BoilingVerdict组件根据输入值匹配水是否沸腾，并将结果更新至 DOM。
```

得益于每次的更新都经历相同的步骤，两个输入框的内容才能**始终保持同步。**

#### 7.3 总结

- 在 React 应用中，任何可变数据**应当只有一个相对应的唯一“数据源”。**

  通常，state 都是首先添加到需要渲染数据的组件中去。然后，如果其他组件也需要这个 state，那么你可以将它提升至这些组件的最近共同父组件中。你应当依靠[自上而下的数据流](https://zh-hans.reactjs.org/docs/state-and-lifecycle.html#the-data-flows-down)，**而不是尝试在不同组件间同步 state**。

- 带来的好处是，排查和隔离 bug 所需的工作量将会变少。

  由于“存在”于组件中的任何 state，仅有组件自己能够修改它，因此 bug 的排查范围被大大缩减了。此外，你也可以使用自定义逻辑来拒绝或转换用户的输入。

- 当你在 UI 中发现错误时，可以使用 [React 开发者工具](https://github.com/facebook/react/tree/main/packages/react-devtools) 来检查问题组件的 props，并且按照组件树结构逐级向上搜寻，直到定位到负责更新 state 的那个组件。这使得你能够追踪到产生 bug 的源头：

![Monitoring State in React DevTools](https://mynightwish.oss-cn-beijing.aliyuncs.com/img/react-devtools-state.gif)

### 8、组合 vs 继承

React 有十分强大的组合模式。并**推荐使用组合而非继承**来实现组件间的代码重用。

#### 8.1  包含关系：`children` prop

##### 定义：

- 有些组件无法提前知晓它们子组件的具体内容。

  这些组件使用一个特殊的 `children` prop 来将他们的子组件传递到渲染结果中：

- 我的通俗理解：

  反正不知道将来我的女朋友什么样子，先提前给她起个名字“翠花”，将来谁是女朋友，谁的结婚证是翠花这个名字

  ```jsx
  function FancyBorder(props) {
    return (
   	<div className={'FancyBorder FancyBorder-' + props.color}>{props.children}</div>
    );
  }
  ```

##### 使用：

- 这使得别的组件可以通过 JSX 嵌套，将任意组件作为子组件传递给它们

- `<FancyBorder>` JSX 标签中的所有内容都会作为一个 `children` prop 传递给 `FancyBorder` 组件。因为 `FancyBorder` 将 `{props.children}` 渲染在一个 `<div>` 中，被传递的这些子组件最终都会出现在输出结果中。

  ```jsx
  function WelcomeDialog() {
    return (
      <FancyBorder color="blue"> // props下流的colo值  内部是下流的组件
        <h1 className="Dialog-title"> Welcome</h1>      
        <p className="Dialog-message">Thank you for visiting our spacecraft!</p>    
      </FancyBorder>
    );
  }
  ```

##### 预留出几个“洞”：

- 少数情况下，可能需要在一个组件中预留出几个“洞”。这种情况下，可以不用 `children`，而是自行约定：将所需内容传入 props，并使用相应的 prop。

- `<Contacts />` 和 `<Chat />` 之类的 React 元素本质就是对象（object），所以可以把它们当作 props，像其他数据一样传递。

- 这种方法可能使你想起别的库中“槽”（slot）的概念，但在 React 中没有“槽”这一概念的限制，你可以将任何东西作为 props 进行传递。

  ```jsx
  function SplitPane(props) {
    return (
      <div className="SplitPane">
        <div className="SplitPane-left">{props.left}</div>
        <div className="SplitPane-right">{props.right}</div>
      </div>);
  }
  
  function App() {
    return (<SplitPane left={<Contacts />} right={<Chat />} />);
  }
  ```

#### 8.2 特例关系

- 有时，会把一些组件看作是其他组件的特殊实例，比如 `WelcomeDialog` 可以说是 `Dialog` 的特殊实例。

- 在 React 中，我们也可以通过组合来实现这一点。“特殊”组件可以通过 props 定制并渲染“一般”组件：

  ```jsx
  function Dialog(props) {
    return (
      <FancyBorder color="blue">
        <h1 className="Dialog-title">{props.title}</h1>
        <p className="Dialog-message">{props.message}</p>
      </FancyBorder>
    );
  }
  
  function WelcomeDialog() {return <Dialog title="Welcome" message="visiting!" />;}
  ```

#### 8.3 继承

- 而继承，大意是FB成百上千的组件用react都没有用继承来构建组件层次的情况，他不推荐你用继承。而相比之下：props+组合模式更好
  - Props 和组合提供了清晰而安全地定制组件外观和行为的灵活方式。注意：组件可以接受任意 props，包括基本数据类型，React 元素以及函数。
  - 如果你想在组件间复用非 UI 的功能，建议将其提取为一个单独的 JavaScript 模块，如函数、对象或者类。组件直接引入（import）而无需通过 extend 继承它们。

### 9、React哲学

#### 9.1 官方定位：

- 我们认为，React 是用 JavaScript 构建快速响应的大型 Web 应用程序的首选方式。它在 Facebook 和 Instagram 上表现优秀。

#### 9.2 组件层级划分

- 如何将设计好的 UI 划分为组件层级？

  - 可以将组件当作一种函数或者是对象来考虑，根据[单一功能原则](https://en.wikipedia.org/wiki/Single_responsibility_principle)来判定组件的范围。

  - 一个组件原则上只能负责一个功能。如果它需要负责更多的功能，这时候就应该考虑将它拆分成更小的组件。

  - 实例图：

    - `FilterableProductTable`
      - `SearchBar`
      - `ProductTable`
        - `ProductCategoryRow`
        - `ProductRow`

    <img src="https://mynightwish.oss-cn-beijing.aliyuncs.com/img/thinking-in-react-components.png" alt="组件嵌套图示" style="zoom:50%;" />

#### 9.3 构建应用

- 你可以自上而下或者自下而上构建应用：

  自上而下意味着：先编写层级较高的组件（比如 `FilterableProductTable`）

  自下而上意味着：从最基本的组件开始编写（比如 `ProductRow`）。

  当你的应用较简单时，自上而下的方式更方便；对于较为大型的项目来说，自下而上地构建，并同时为低层组件编写测试是更加简单的方式。

#### 9.4 确定state

确定是state还是props的判断：

1. 该数据是否是由父组件通过 props 传递而来的？如果是，那它应该不是 state。
2. 该数据是否随时间的推移而保持不变？如果是，那它应该也不是 state。
3. 你能否根据其他 state 或 props 计算出该数据的值？如果是，那它也不是 state。

#### 9.5 确定组件传值问题

这里主要讨论的是内层子组件与外层组件的传递，例子中使用的受控组件，查看状态提升小节，这里不再赘述；

### 10、撒花

ok，到这里，核心概念部分就已经结束了，我们相当于简单过了一下文档的基础部分，对react的认知又多了一点：

- 关于state与Props的认知与区别。以及**props的特性。结合组件复用，**其实可以延伸至高阶组件HOC，这跟最近需求开发中的一个困惑：组件复用时样式太零散，但我不想通过零零散散的参数控制乱七八糟的属性，怎么办？
- 关于JSX中的转换过程，其实这里展开的不太深入，看完高级部分，会再反过来更新补充博文；
- 关于表单提交，解决了开发中的困惑，借此机会学习了别的处理方式；
- 关于事件处理、生命周期、Hooks、数据管理这些非常重要的东西，并没有大篇幅地展开介绍，期待一下高级部分；
- interesting的一点是，今天下午开发需求刚好用上了昨晚看的状态提升，哈哈哈哈，开心~