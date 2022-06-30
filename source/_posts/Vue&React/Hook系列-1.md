---
layout: post
title: Hook系列(1)之what
date: 2022-03-31 16:27:01
tags: Hook
categories: 1.4-框架
description: What is Hook?
cover: https://mynightwish.oss-cn-beijing.aliyuncs.com/React/hook1.png
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: what's Hook
---

## <center>Hook系列（1）之what</center>

> 前言：
>
> 书接上回，我们简单读完了React文档中的核心概念部分：
>
> 此外，基于Hook的讨论展开之前，铺垫了一篇函数组件VS类组件的特性分析，以及为什么函数组件跟契合react的理念：
>
> 从本期开始，关于HOOK的讨论正式展开：
>
> 我们将从what、how、why的角度去研究Hook，对于how更关注：how to work ，而API的使用层面不过于关注
>
> - 目的：学习HOOK的特性，以及开发实践时有什么启发（写法、优化、排查bug等）

> 官方文档：**Hook**是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性

总的来说，Hooks是React团队在实践中逐渐认知的一个改进点，解决了团队长期编写和维护成千上万的组件时，遇到的各种各样看起来不相关的问题。背后涉及到**类组件、函数组件**两种组件形式的思考和侧重；

## what

> 由于Hooks背后涉及到**类组件、函数组件**两种组件形式的思考和侧重，因此在说明之前，我们将对比下两大组件：

- 是一些可以让你在函数组件里“钩入” React state 及生命周期等特性的函数

- 是一套使函数组件更强大、更灵活的钩子。函数组件相比于类组件少了很多东西，而Hooks的出现就是帮助函数式组件补齐这种缺陷。函数式组件可以自由的使用Hooks提供的丰富工具

### 1、useState基础

#### 1.1 基础用法

- 早期函数组件相比于类组件，劣势之一：缺乏维护和定义state的能力，而这个API**为函数组件引入状态**
- 它与 class 里面的 `this.state` 提供的功能完全相同。一般来说，在函数退出后变量就会”消失”，但 state 中的变量会被 React 保留。
- React 会在重复渲染时记住它当前的值，并且提供最新的值给我们的函数。

* 与类组件的不同：

  - 同样逻辑的函数组件比类组件复杂度更低，代码量更少
  - 它类似 class 组件的 `this.setState`，但它不会把**新state 和旧state 合并**，而是**替换**
  - 值得注意的是，不同于 `this.state`，这里的 state **不一定要是一个对象** —— 如果你有需要，它也可以是。
  - 这个初始 state 参数只有在第一次渲染时会被用到，在后续的重新渲染中，`useState` 返回的第一个值将始终是更新后最新的 state

  ```jsx
  语法: const [xxx, setXxx] = React.useState(initValue)// 初始值，允许任意类型的值
  // 解构赋值
  ```

  > 注意
  >
  > React 会确保 `setState` 函数的标识是稳定的，并不会在组件重新渲染时发生变化。这就是为什么可以安全地从 `useEffect` 或 `useCallback` 的依赖列表中省略 `setState`。

#### 1.2 函数式setState更新

- 如果新state 需要通过用先前state 计算得出，可以将函数传递给 `setState`。

- 该函数将接收先前state，并返回一个更新后的值。

- 如果你的更新函数返回值与当前 state 完全相同，则随后的**重渲染会被完全跳过。**

  ```jsx
  setXxx(value => newValue): 参数为函数, 接收原本的状态值, 返回新的状态值, 内部用其覆盖原来的状态值
  ```

  ```jsx
  function Counter({initialCount}) {
    const [count, setCount] = useState(initialCount);
    return (
      <>
        Count: {count}
        <button onClick={() => setCount(initialCount)}>Reset</button>
        <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
        <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
      </>
    );
  }
  ```

> 注意
>
> 与 class 组件中的 `setState` 方法不同，`useState` 不会自动合并更新对象。你可以用函数式的 `setState` 结合展开运算符来达到合并更新对象的效果。
>
> ```jsx
> const [state, setState] = useState({});
> setState(prevState => {
>   // 也可使用 Object.assign
>   return {...prevState, ...updatedValues};
> });
> ```
>
> `useReducer` 是另一种可选方案，它更适合用于管理包含多个子值的 state 对象。

#### 1.3 惰性initialState

- `initialState` 参数只会在组件的初始渲染中起作用，后续渲染时会被忽略。

- 如果初始 state 需通过复杂计算获得，则可传入一个函数，在函数中计算并返回初始的 state，此函数只在初始渲染时被调用：

  ```jsx
  const [state, setState] = useState(() => {
    const initialState = someExpensiveComputation(props);
    return initialState;
  });
  ```

#### 1.4 跳过 state 更新

- 调用 State Hook 的更新函数并传入当前的 state 时，也就是函数式更新，state返回值没有发生变化时，React 将跳过子组件的渲染及 effect 的执行。（React 使用 [`Object.is` 比较算法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description) 来比较 state。）

> 需要注意的是：
>
> - React 可能仍需**在跳过渲染前渲染该组件**。不过由于 React **不会对组件树的“深层”节点进行不必要的渲染**，所以大可不必担心。
>
> - 如果你在渲染期间执行了高开销的计算，则可用 `useMemo` 来进行优化。

#### 1.5 注意：

* 多个状态声明时，**必须分开写**

* 多次调用 `useState` 时，必须保证每次渲染时它们的调用顺序是不变的。后面解释why

* 因此，不能出现在**条件判断语句**中，因为它**必须有一样的渲染顺序**          

  ```js
      const [ age , setAge ] = useState(18)
      const [ sex , setSex ] = useState('男')
      const [ work , setWork] = useState('前端程序员')
  ```

  ```js
  const [ age , setAge ] = useState(18)   // 错误写法
  if(showSex){
    const [ sex , setSex ] = useState('男')
    showSex=false
  }
  const [ work , setWork ] = useState('前端程序员')
  ```

- #### why 顺序为什么重要？

  已经填坑——请查看Hook的使用规则小节部分或者源码调用流程部分；

### 2、 useEffect基 ###

> 之前在React 组件中执行过数据获取、订阅或者手动修改过 DOM。我们统一把这些操作称为**“副作用”**
>
> - `useEffect` 就是一个 Effect Hook，给函数组件增加了操作副作用的能力
> - 它跟 class 组件中的 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 具有相同的用途，只不过被合并成了一个 API
> - 调用 `useEffect` 时，就是在告诉 React 在完成对 DOM 的更改后运行你的“副作用”函数。由于副作用函数是在组件内声明的，所以可以访问到组件的 props 和 state

```
useEffect(callback, [](可选));
```

#### 2.1 引入副作用

> 生命周期到useEffect的转换关系都不是最重要的，最重要的是构建组件有副作用，useEffect为函数组件引入副作用的钩子

- 通过 Hook，可以把**组件内相关的副作用组织在一起**（例如创建订阅及取消订阅），**而不要把它们拆分到不同的生命周期函数里**

- 过去在DidMount 、DidUpdate、willUnmount中做的事，可放在该钩子做。比如：操作DOM、获取外部API

- 【注意】：**useEffect中返回的函数叫“清除函数”：**

  当React识别到该函数，会在卸载阶段执行其清除逻辑。

  这个函数不会收第2个参数、或其他参数因素的影响。

  只要你在useEffect回调中返回了一个函数，它就会被当做清除函数来处理。

#### 2.2 无需清除的 effect ⭐️面试~

> 有时候，我们只想**在 React 更新 DOM 之后运行一些额外的代码。**比如发送网络请求，手动变更 DOM，记录日志，这些都是常见的无需清除的操作。
>
> 因为在执行完这些操作之后，就可以忽略他们了。

```jsx
useEffect(() => {
    // 每次渲染都执行：相当于 componentDidMount 和 componentDidUpdate:
    });

useEffect(() => {
      // 只在挂载阶段执行一次的副作用，且该函数的返回值不是一个函数
    },[]);
```

- **`useEffect` 做了什么？** React 会保存你传递的函数（effect），并在执行 DOM 更新之后调用它

- **为什么在组件内部调用 `useEffect`？** 

  可以在 effect 中直接访问 `count` state 变量（或其他 props），而不需要特殊的 API 来读取它，它已经保存在函数作用域中（Hook 使用了**JS的闭包机制**）

- **`useEffect` 会在每次渲染后都执行吗？** 

  是的，默认情况下，它在**第一次渲染之后*和*每次更新之后**都会执行。

  你可能会更容易接受 effect 发生在“渲染之后”这种概念，不用再去考虑“挂载”还是“更新”。

  React **保证了每次运行 effect 的同时，DOM 都已经更新完毕。**

- ##### 函数在渲染过程中的不同：⭐️⭐️⭐️

  - 注意到，传递给 `useEffect` 的函数在每次渲染中**都会有所不同，这是刻意为之的。**
  - 事实上这正是我们可以在 effect 中**获取最新的 `count` 的值**，而不用担心其过期的原因。
  - 每次我们重新渲染，都会生成*新的* effect，替换掉之前的。某种意义上讲，effect 更像是渲染结果的一部分 —— 每个 effect “属于”一次特定的渲染。
  - 与 `componentDidMount` 或 `componentDidUpdate` 不同，使用 `useEffect` 调度的 effect **不会阻塞浏览器更新屏幕，这让你的应用看起来响应更快**。大多数情况下，effect 不需要同步地执行。在个别情况下（例如测量布局），有单独的 [`useLayoutEffect`](https://zh-hans.reactjs.org/docs/hooks-reference.html#uselayouteffect) Hook 供你使用，其 API 与 `useEffect` 相同。
  - 后续章节挖坑：⭐️

#### 2.3 需清除的effect

此外，还有一些副作用是需要清除的。例如**订阅外部数据源**。这种情况下，清除工作可以防止引起内存泄露！

- **为什么要在 effect 中返回一个函数？** 

  这是 effect 可选的**清除机制**。每个 effect 都可以返回一个清除函数。如此可以将添加和移除订阅的逻辑放在一起。它们都属于 effect 的一部分。

  ```jsx
  useEffect(() => {
    const subscription = props.source.subscribe();
    return () => {
      // 清除订阅
      subscription.unsubscribe();
    };
  });
  ```

- **React 何时清除 effect？** 

  - 为防止内存泄漏，清除函数会在组件卸载前执行。如果组件多次渲染（通常如此），则**在执行下一个 effect 之前，上一个 effect 就已被清除**。在上述示例中，意味着组件的每一次更新都会创建新的订阅。若想避免每次更新都触发 effect 的执行

  - 正如之前学到的，**effect 在每次渲染时都会执行**。这就是为什么 React *会*在执行当前 effect 之前清除上一个 effect 

  **为什么要这样，以及如何在遇到性能问题时跳过此行为**在2.5 2.6会展开

```jsx
useEffect(() => {
      // 只在挂载、卸载阶段执行的副作用，且该函数的返回值是一个函数
  
  		// 业务逻辑A: 它会在挂载阶段执行
  		....A
      // 业务逻辑B: 它会在卸载时执行
  		return () => {};
    },[]);
```

```jsx
useEffect(() => {
      // 每一次渲染、且卸载阶段执行的副作用，且该函数的返回值是一个函数，不传第2个参数
  		// 业务逻辑A: 它会在每次渲染时执行
  		....A
      // 业务逻辑B:它会在卸载时执行
  		return () => {};
    });
```

```jsx
useEffect(() => {
      // 根据一定的依赖条件出发的副作用
      // 业务逻辑：
      ....
      // 若xxx是一个函数，则xxx会在组件卸载时被触发
  		return xxx;
    },[count1, count2, count3]);
```

#### 2.4 Effect的执行时机

- 与 `componentDidMount`、`componentDidUpdate` 不同的是，传给 `useEffect` 的函数会在浏览器完成布局与绘制**之后**，在一个延迟事件中被调用。
- 这使得它适用于许多常见的副作用场景，比如设置订阅和事件处理等情况，因为**绝大多数操作不应阻塞浏览器对屏幕的更新。**
- 然而，并非所有 effect 都可以被延迟执行。例如，一个对用户可见的 DOM 变更就必须在浏览器执行下一次绘制前被同步执行，这样用户才不会感觉到视觉上的不一致。

- React 为此提供了一个额外的 [`useLayoutEffect`](https://zh-hans.reactjs.org/docs/hooks-reference.html#uselayouteffect) Hook 来处理这类 effect。它和 `useEffect` 的结构相同，区别只是调用时机不同。

- 虽然 `useEffect` 会在浏览器绘制后延迟执行，但会保证在任何新的渲染前执行。在开始新的更新前，React 总会先清除上一轮渲染的 effect。

#### 使用多个Effect实现关注点分离

- 使用 Hook 其中一个[目的](https://zh-hans.reactjs.org/docs/hooks-intro.html#complex-components-become-hard-to-understand)就是要解决 class 中生命周期函数经常包含不相关的逻辑，但又把相关逻辑分离到了几个不同方法中的问题。so，它可以**使用多个 effect**。这会将不相关逻辑分离到不同的 effect 中：
- **Hook 允许我们按照代码的用途分离他们，** 而不是像生命周期函数那样。React 将按照 effect 声明的顺序依次调用组件中的*每一个* effect。

#### 2.5 为何每次更新时都运行 Effect

为什么 effect 的清除阶段在**每次重新渲染时都会执行**，**而不是只在卸载组件的时候执行一次**。

- **因为这样的设计可以帮助创建组件bug更少：**

  一个用于显示好友是否在线的 `FriendStatus` 组件。从 class 中 props 读取 `friend.id`，然后在组件挂载后订阅好友的状态，并在卸载组件的时候取消订阅：

  ```jsx
    componentDidMount() {
      ChatAPI.subscribeToFriendStatus(
        this.props.friend.id,
        this.handleStatusChange
      );
    }
  
    componentWillUnmount() {
      ChatAPI.unsubscribeFromFriendStatus(
        this.props.friend.id,
        this.handleStatusChange
      );
    }
  ```

  **但当组件已显示在屏幕时，`friend` prop 发生变化时会发生什么？**

   我们的组件将继续展示原来的好友状态。**这是一个 bug**。

  而且我们还会因为**取消订阅时使用错误的好友 ID** 导致内存泄露或崩溃的问题。class 组件中要添加 `componentDidUpdate` 来解决这个问题：

  忘记正确地处理 `componentDidUpdate` 是 React 应用中常见的 bug 来源，其实确实存在

  ```jsx
  componentDidUpdate(prevProps) {    
    // 取消订阅之前的 friend.id    	
   ChatAPI.unsubscribeFromFriendStatus(prevProps.friend.id, this.handleStatusChange);     // 订阅新的 friend.id    
   ChatAPI.subscribeToFriendStatus(this.props.friend.id,this.handleStatusChange); 
  }
  ```

- **但hook的写法：并不会受到此 bug 影响**

  **并不需特定的代码来处理更新逻辑，因为 `useEffect` *默认*就会处理**。它会在调用一个新的 effect 之前对前一个 effect 进行清理。下面按时间列出一个可能会产生的订阅和取消订阅操作调用序列来说明：

  ```jsx
  // Mount with { friend: { id: 100 } } props
  ChatAPI.subscribeToFriendStatus(100, handleStatusChange);     // 运行第一个 effect
  
  // Update with { friend: { id: 200 } } props
  ChatAPI.unsubscribeFromFriendStatus(100, handleStatusChange); // 清除上一个 effect
  ChatAPI.subscribeToFriendStatus(200, handleStatusChange);     // 运行下一个 effect
  
  // Update with { friend: { id: 300 } } props
  ChatAPI.unsubscribeFromFriendStatus(200, handleStatusChange); // 清除上一个 effect
  ChatAPI.subscribeToFriendStatus(300, handleStatusChange);     // 运行下一个 effect
  
  // Unmount
  ChatAPI.unsubscribeFromFriendStatus(300, handleStatusChange); // 清除最后一个 effect
  ```

  此默认行为保证了一致性，**避免了在 class 组件中因为没有处理更新逻辑而导致常见的 bug。**

#### 2.6 通过跳过 Effect来性能优化

在某些情况下，每次渲染后都执行清理或执行 effect 可能会导致性能问题。

##### 渲染：

- **在 class 组件中**，通过在 `componentDidUpdate` 中添加对 `prevProps` 或 `prevState` 的**比较逻辑**解决：

  ```jsx
  componentDidUpdate(prevProps, prevState) {
    if (prevState.count !== this.state.count) {
      document.title = `You clicked ${this.state.count} times`;
    }
  }
  ```

- 这是很常见的需求，所以**它被内置到了 `useEffect` 的 Hook API 中**。如果**某些特定值在两次重渲染之间没有发生变化**，你可以通知 React **跳过**对 effect 的调用，只要传递数组作为 `useEffect` 的第二个可选参数即可：

  如果数组中有多个元素，即使只有一个元素发生变化，React 也会执行 effect。

  ```jsx
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]); // 仅在 count 更改时更新
  ```

##### 清除时：

- 对于有清除操作的 effect 同样适用：未来版本，可能会在构建时自动添加第二个参数。

  ```jsx
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  }, [props.friend.id]); // 仅在 props.friend.id 发生变化时，重新订阅
  ```

##### 注意：

- 如果你要使用此优化方式，请确保数组中包含了**所有外部作用域中会随时间变化并且在 effect 中使用的变量**，否则你的代码会引用到先前渲染中的旧变量。参阅文档，了解更多关于[如何处理函数](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies)以及[数组频繁变化时的措施](https://zh-hans.reactjs.org/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often)内容。

- 如果想**执行只运行一次的 effect**（仅在组件挂载和卸载时执行），可以传递一个空数组（`[]`）作为第二个参数。

  - 这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它**永远都不需要重复执行**。这并不属于特殊情况 —— 它依然遵循依赖数组的工作方式。

  - 如果传入了一个空数组（`[]`），effect 内部的 props 和 state 就会一直拥有其初始值。尽管传入 `[]` 作为第二个参数更接近大家更熟悉的 `componentDidMount` 和 `componentWillUnmount` 思维模式，但我们有[更好的](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies)[方式](https://zh-hans.reactjs.org/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often)来避免过于频繁的重复调用 effect。
  - 除此之外，请记得 **React 会等待浏览器完成画面渲染之后才会延迟调用 `useEffect`**，因此会使得额外操作很方便。

  - 推荐启用 [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) 中的 [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) 规则。此规则会在添加错误依赖时发出警告并给出修复建议。

### 3、useContext基

```jsx
const value = useContext(MyContext); //参数必须是 context 对象本身
```

- 接收一个 context 对象（`React.createContext` 的返回值）并返回该 context 的当前值
- 当前的 context 值由上层组件中**距离当前组件最近**的 `<MyContext.Provider>` 的 `value` prop 决定

#### 3.1 特性：

- 当组件上层最近的 `<MyContext.Provider>` 更新时，该 Hook 会触发重渲染，并使用最新传递给 `MyContext` provider 的 context `value` 值。
- 调用了 `useContext` 的组件**总会在 context 值变化时重渲染**，即使祖先使用 [`React.memo`](https://zh-hans.reactjs.org/docs/react-api.html#reactmemo) 或 [`shouldComponentUpdate`](https://zh-hans.reactjs.org/docs/react-component.html#shouldcomponentupdate)。
- 如果重渲染组件的开销较大，可以 [通过使用 memoization 来优化](https://github.com/facebook/react/issues/15156#issuecomment-474590693)。

#### 3.2 完整用法：

1. 创建Context容器对象： 

   ```jsx
   	const XxxContext = React.createContext()  
   ```

2. 传值子组件时，外面包裹`xxxContext.Provider`, 通过**value**属性（定死的）给后代组件传数据：                          

   ```js
   <xxxContext.Provider value={数据}>
   		子组件
   </xxxContext.Provider>
   ```

   * 数据其实是字符串，如果你想传对象，或多个值，可以再包一个{}

     ```jsx
     <xxxContext.Provider value={{username, age, height}}>
     <xxxContext.Provider value={{username: 'superawesome'}}>
     ```

3. 后代组件接收：`useContext()`钩子函数用来引入 Context 对象

   ```jsx
   const Messages = () => {
   		const { username } = useContext(xxxContext)
   		return (
          <div className="messages">
            <p>1 message for {username}</p>
            <p className="message">useContext is awesome!</p>
          </div>
       )
   }
   ```

#### 3.3 关于Context API  ####

- `useContext(MyContext)` 相当于 class 组件中的 `static contextType = MyContext` 或者 `<MyContext.Consumer>`。
- `useContext(MyContext)` 只是让你能***读取* context 的值及订阅 context 的变化**。你**仍需在上层组件树中使用 `<MyContext.Provider>` 来为下层组件*提供* context**。

- 高级指引部分有展开讲： [Context 高级指南](https://zh-hans.reactjs.org/docs/context.html)

#### 3.4 memoization优化

待续~挖坑

### 4、useReducer

#### 4.1 

> 在某些场景下，`useReducer` 会比 `useState` 更适用，例如 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等。并且，使用 `useReducer` 还能给那些会触发**深更新的组件做性能优化**，因为[你可以向子组件传递 `dispatch` 而不是回调函数](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down) 。

```jsx
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

- [`useState`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usestate) 的替代方案。它接收一个形如 `(state, action) => newState` 的 reducer，并返回当前的 state 以及与其配套的 `dispatch` 方法。

- **注意**

  React 会确保 `dispatch` 函数的标识是稳定的，并不会在组件重新渲染时改变。这就是为什么可以安全地从 `useEffect` 或 `useCallback` 的依赖列表中省略 `dispatch`。

#### 4.2 用法demo ####

- 用 reducer 重写 [`useState`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usestate) 一节的计数器示例：

  ```jsx
  const initialState = {count: 0};     // 1.1 初始化state
  
  function reducer(state, action) {    // 1.2 定义reducer
    switch (action.type) {
      case 'increment': return {count: state.count + 1};
      case 'decrement': return {count: state.count - 1};
      default: throw new Error();
    }
  }
  
  function Counter() {
    const [state, dispatch] = useReducer(reducer, initialState); // 1.3 初始化
    return (
      <>
        Count: {state.count}
  			// 1.4 想要更改store数据的组件，只需要有dispatch钩子就可以
        <button onClick={() => dispatch({type: 'decrement'})}>-</button>
        <button onClick={() => dispatch({type: 'increment'})}>+</button>
      </>
    );
  }
  ```

#### 4.3 指定初始 state

有两种不同初始化 `useReducer` state 的方式：

##### 最简单的：

- 将初始 state 作为第二个参数传入 `useReducer` 是最简单的方法：

  ```jsx
    const [state, dispatch] = useReducer(
      reducer,
      {count: initialCount}  );
  ```

  - React 不使用 `state = initialState` 这一由 Redux 推广开来的参数约定。有时候初始值依赖于 props，因此需要在调用 Hook 时指定。
  - 如果你特别喜欢上述的参数约定，可以通过调用 `useReducer(reducer, undefined, reducer)` 来模拟 Redux 的行为，但不鼓励你这么做。

##### 惰性初始化:

- 需将 `init` 函数作为 `useReducer` 的第三个参数传入，这样初始 state 将被置为 `init(initialArg)`

- 这么做可将用于计算 state 的逻辑提到reducer外部，这也为将来对**重置 state 的 action** 做处理提供了便利：

  ```jsx
  function init(initialCount) {  return {count: initialCount};}
  function reducer(state, action) {
    switch (action.type) {
      case 'increment':  return {count: state.count + 1};
      case 'decrement':  return {count: state.count - 1};
      case 'reset':  return init(action.payload);     // 重置action
      default:    throw new Error();
    }
  }
  
  function Counter({initialCount}) {
    const [state, dispatch] = useReducer(reducer, initialCount, init);  return (
      <>
        Count: {state.count}
        <button onClick={() => dispatch({type: 'reset', payload: initialCount})}>       				Reset
        </button>
        <button onClick={() => dispatch({type: 'decrement'})}>-</button>
        <button onClick={() => dispatch({type: 'increment'})}>+</button>
      </>
    );
  }
  ```

#### 4.4 跳过 dispatch

- 如果 Reducer Hook 的返回值与当前 state 相同，React 将跳过子组件的渲染及副作用的执行。（React 使用 [`Object.is` 比较算法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description) 来比较 state。）
- 需要注意的是，React 可能仍需要在跳过渲染前再次渲染该组件。不过由于 React 不会对组件树的“深层”节点进行不必要的渲染，所以大可不必担心。如果你在渲染期间执行了高开销的计算，则可以使用 `useMemo` 来进行优化。不是很理解~？？？

### 5、useRef

#### 特性

```jsx
const refContainer = useRef(initialValue);
```

- `useRef` 返回一个可变的 **ref 对象**，其 `.current` **属性被初始化为传入的参数**（`initialValue`）。返回的 ref 对象在**组件的整个生命周期内持续存在**。
- 本质上，`useRef` 就像是可以在其 `.current` 属性中保存一个可变值的“盒子”。
- `useRef()` 比 `ref` 属性更有用：
  - ref：是一种[访问 DOM](https://zh-hans.reactjs.org/docs/refs-and-the-dom.html) 的主要方式，如果将 ref 对象以 `<div ref={myRef} />` 形式传入组件，则无论该节点如何改变，React 都会将 **ref 对象的 `.current` 属性设置为相应的 DOM 节点**
  - `useRef()` ：可以[很方便地保存任何可变值](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables)，因为它创建的是一个普通JS对象。而 `useRef()` 和自建一个 `{current: ...}` 对象的唯一区别是，**`useRef` 会在每次渲染时返回同一个 ref 对象。**
  - 注意：当 ref 对象内容变化时，`useRef` 并*不会*通知你。**变更 `.current` 属性不会引发组件重新渲染**。如果想要在 React 绑定或解绑 DOM 节点的 ref 时运行某些代码，则需要使用[回调 ref](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node) 来实现。

#### 使用demo：

```jsx
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    inputEl.current.focus(); // `current` 指向已挂载到 DOM 上的文本输入元素
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

### 6、useMemo   

这部分不太理解，以后在实际使用时要多注意一下~

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

- 把“创建”函数和**依赖项数组**作为参数传入 `useMemo`，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化**有助于避免在每次渲染时都进行高开销的计算**。
- 返回一个 [memoized](https://en.wikipedia.org/wiki/Memoization) 值
- 传入 `useMemo` 的函数会在渲染期间执行。请不要在这个函数内部执行与渲染无关的操作，诸如副作用这类的操作属于 `useEffect` 的适用范畴，而不是 `useMemo`

#### 特性：

- **目的：**用来解决用React hooks产生的无用渲染的性能问题

- 如果没有提供依赖项数组，`useMemo` 在每次渲染时都会计算新的值
- 先编写在没有 `useMemo` 的情况下也可执行的代码 —— 之后再添加 `useMemo`，以达到优化性能的目的

> **你可以把 `useMemo` 作为性能优化的手段，但不要把它当成语义上的保证。**将来，React 可能会选择“遗忘”以前的一些 memoized 值，并在下次渲染时重新计算它们，比如为离屏组件释放内存。
>
> - 这里不是很理解？？？

#### demo举例：

- 作用：

  * 函数组件失去了`shouldCompnentUpdate`，所以无法在组件更新前，根据某些条件来组件是否更新
  * 函数组件不再区分`mount`和`update`两个状态，所以**函数组件每次调用都会执行内部的所有逻辑**，性能损耗

- ##### 父组件：

  ```js
  function App(){
    const [name , setname] = useState('小红')
    const [count , setcount] = useState(0)
    return (
       <>
        <button>名字：{name}</button>
        <button 
  				onClick={()=>{setcount(count++)}}>数字：{count}</button>
        <Child name={name}>{name}</Child>
  </>
    )
  }
  ```

- ##### 子组件：

  ```js
  function Child({name,children}){
      function changeName(name){
          console.log('我要更改父组件传过来的名字name啦')
          return name+',新的';
      }
  
      const newName = changeName(name)
      return (
          <>
              <div>{newName}</div>
              <div>{children}</div>
          </>
      )
  }
  ```

  * 点击数字，计时器会更新，但是名字相关的展示组件，与count毫无关系，但是也在执行，这是在做无用的渲染。
  * 我们希望，只有与它相关的更新了，才执行对应的方法

- #### 优化： ####

  useMemo包裹，并传递第二个参数，参数匹配成功，才会执行

  ```js
  const newName = useMemo(()=>changeName(name),[name]) 
  ```

#### 注意：

> 依赖项数组不会作为参数传“创建”函数。
>
> 虽然从概念上来说它表现为：所有“创建”函数中引用的值都应该出现在依赖项数组中。未来编译器会更加智能，届时自动创建数组将成为可能。
>
> 推荐启用 [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) 中的 [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) 规则。此规则会在**添加错误依赖时**发出警告并给出修复建议。

### 7、useCallback

#### 特性：

- 返回一个 [memoized](https://en.wikipedia.org/wiki/Memoization) 回调函数

- 把内联回调函数及依赖项数组作为参数传入 `useCallback`，它将返回该回调函数的 memoized 版本，该回调函数**仅在某个依赖项改变时才会更新。**

- 当你把回调函数传递给经过优化的并**使用引用相等性**去避免非必要渲染（例如 `shouldComponentUpdate`）的子组件时，它将非常有用。

  怎么理解？？？挖坑~

  ```jsx
  const memoizedCallback = useCallback(
    () => {
      doSomething(a, b);
    },
    [a, b],
  );
  ```

#### 注意：

- `useCallback(fn, deps)` 相当于 `useMemo(() => fn, deps)`。

> 依赖项数组不会作为参数传给回调函数。虽然从概念上来说它表现为：所有回调函数中引用的值都应该出现在依赖项数组中。未来编译器会更加智能，届时自动创建数组将成为可能。

- 推荐启用 [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) 中的 [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) 规则。此规则会在添加错误依赖时发出警告并给出修复建议

### 8、useLayoutEffect

- 与 `useEffect` 不同的是，它会在所有的 DOM 变更之后同步调用 effect，可以使用它来读取 DOM 布局并同步触发重渲染。
- 在浏览器执行绘制之前，`useLayoutEffect` 内部的更新计划将被同步刷新。

尽可能使用标准的 `useEffect` 以避免阻塞视觉更新。

> 提示
>
> 如果你正在将代码从 class 组件迁移到Hook，则注意 `useLayoutEffect` 与 `componentDidMount`、`componentDidUpdate` 的调用阶段是一样的。但推荐你**一开始先用 `useEffect`**，只有当它出问题的时候再尝试用 `useLayoutEffect`。
>
> 如果你使用服务端渲染，请记住，***无论* `useLayoutEffect` *还是* `useEffect` 都无法在 JS代码加载完成之前执行**。这就是为什么**在服务端渲染组件中引入 `useLayoutEffect` 代码时会触发 React 告警**。
>
> - 解决这个问题，需要将代码逻辑移至 `useEffect` 中（如果首次渲染不需要这段逻辑的情况下）
> - 或是将该组件延迟到客户端渲染完成后再显示（如果直到 `useLayoutEffect` 执行之前 HTML 都显示错乱的情况下）。
>
> 若要从服务端渲染的 HTML 中排除依赖布局 effect 的组件，可以通过使用 `showChild && <Child />` 进行条件渲染，并使用 `useEffect(() => { setShowChild(true); }, [])` 延迟展示组件。这样，在客户端渲染完成之前，UI 就不会像之前那样显示错乱了。

### 9、useContext + useReducer

#### 9.1、redux开发痛点

比如当你正在开发一个很复杂的功能，中途需要不断添加全局状态，每次添加都不得不重复如下步骤：

1. 去到管理 redux 的文件夹，思考把这个状态放到状态树的哪个位置，然后新建一个文件夹并命名 `myFeature`。
2. 创建三个文件 `my-feature/actions.js` 、`my-feature/reducer.js`、`my-feature/type.js`
3. combineReducer 和并 reduce
4. 将 action 引入到组件中
5. 通过 connect HOC 与你的组件相连
6. 增加两个方法 mapStateToProps 和 mapDispatchToProps

以上只是加个状态而已，写很多模板代码还是其次，最要命的是会打断你写代码的思路。

而且随着项目越来越大， redux 的状态树也会变大，维护也会变困难。

#### 做法： ####

对包裹组件使用useContext 和useReducer：

* 一方面：后代的组件都能够获取到这个值store里面某个值，用来渲染
* 另一方面，还要把dispatch这个函数传下去，到时候，某种交互想改变store的数据，可以直接dispatch，派发action

* **APP组件：**

  ```js
  import { Color } from "./color";
  
  function App() {
    return (
      <div className="App">
        <Color>
          <ShowArea />
        </Color>
      </div>
    );
  }
  ```

* **Color组件：**包裹、传递

  ```js
  //1.  创建 context
  export const ColorContext = createContext({});
  
  //2.2  reducer方法 声明
  const reducer = (state, action) => {
    switch(action.type) {
      case UPDATE_COLOR: return action.color
      default:  return state  
    }
  }
  
  export const Color = props => {
  	//2.1 使用useReducer
    const [color, dispatch] = useReducer(reducer, 'blue')
    return (
    // 3. Provider通过value 将自己的组件中的某一state+更新该state的方法也传给了子组件
      <ColorContext.Provider value={{color, dispatch}}>
        {props.children}
      </ColorContext.Provider>
    );
  };
  ```

* **ShowArea：**使用的组件

  ```js
  import { ColorContext } from "./color"; // 1. 导入context
  const ShowArea = props => {
    // 2. 通过context接收到satate
    const { color, dispatch} = useContext(ColorContext);
    return (
    	<div>
      		// 3.1 使用store中的数据渲染
      		<div style={{ color: color }}>字体颜色展示为{color}</div>;
  					//3.2 用户交互改变store
      		<button  onClick={() => {
            dispatch({ type: UPDATE_COLOR, color: "red" });}}
           >
      </div>
    )
    return 
  };
  ```

## 小结

> 至此，我们介绍完了Hook中大部分钩子及其使用特性；
>
> 关于接下来的Hook系列旅程中，我们将结合特性说明Hook的调用工作流程：How to work，以及最后分析why hooks的出现，以及为React的实际开发带来了怎样的好处；
>
> 最后总结一些Hook的实际开发心得~
