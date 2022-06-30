---
layout: post
title: Hook系列(2)-why
date: 2022-04-03 17:29:51
tags: Hook
categories: 1.4-框架
description: Why Hook?
cover: https://mynightwish.oss-cn-beijing.aliyuncs.com/React/hook1.png
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: why Hook
---

# <center>Hook系列（2）之why</center>

> Hook 解决了长期以来编写和维护成千上万的组件时遇到的各种各样看起来不相关的问题。本系列第2期将分享使用Hook的动机

- 自定义Hook的封装
- 使用Hook的动机、好处是什么？
## 二、自定义Hooks ##

> - 自定义`Hook`非常简单，只需要定义一个函数，并把**相应需要的状态和`effect`封装进去**，同时，`Hook`之间也是可以相互引用的。
> - 使用`use`开头命名自定义`Hook`，这样可以方便`eslint`进行检查。

### 1、实现监听缩放的Hook-demo

- 目标功能：**放大、缩小浏览器窗口**时，页面上的结果都会跟着进行变化

  ```jsx
  function Example9(){
      const size = useWinSize(); // 也就是useWinSize()的结果是页面最新的size数据
      return (
          <div>页面Size:{size.width}x{size.height}</div>
      )
  }
  
  export default Example9 
  ```

#### 1.1 实现过程

1. 用useState设置`size`状态

   ```js
   const [ size , setSize] = useState({
           width:document.documentElement.clientWidth, // 获取页面的size信息
           height:document.documentElement.clientHeight
       })
   ```

2. 然后编写一个更新状态的方法`onResize`：

   - 本质还是依赖setSize更新函数，将最新的尺寸信息赋值给size；
   - 用`useCallback`，目的是为了缓存方法(useMemo是为了缓存变量)

   ```js
    const onResize = useCallback(()=>{
           setSize({
               width: document.documentElement.clientWidth,
               height: document.documentElement.clientHeight
           })
       },[])
   ```

3. 为了防止一直监听，所以在卸载时，方法移除

   ```js
   useEffect(()=>{
           {/*  resize  浏览器窗口被调整到一个新的高度或宽度时，就会触发resize事件*/}
     // 监听浏览器的resize事件，保存最先的size信息
           window.addEventListener('resize', onResize)
           return ()=>{
               window.removeEventListener('resize',onResize)
           }
       },[])
   ```

4. 最后**返回size变量**就可以了，最后返回的是**一个变量；**

   ```js
    return size;
   ```

- 完整代码：

  ```jsx
  function useWinSize(){
      const [ size , setSize] = useState({
          width:document.documentElement.clientWidth,
          height:document.documentElement.clientHeight
      })
  
      const onResize = useCallback(()=>{
          setSize({
              width: document.documentElement.clientWidth,
              height: document.documentElement.clientHeight
          })
      },[]) 
      useEffect(()=>{
          window.addEventListener('resize',onResize)
          return ()=>{
              window.removeEventListener('resize',onResize)
          }
      },[])
  
      return size;
  }
  ```

### 2、修改title

- 根据不同的页面名称修改页面`title`:

  ```jsx
  function useTitle(title) {
    useEffect(() => {
        document.title = title;
        return () => (document.title = "主页");
      }, [title]);
  }
  ```

  ```jsx
  function Page1(props){
    useTitle('Page1');
    return (<div>12343-test</div>)
  }
  ```

### 3、实现监听页面滚动的Hook

> 监听页面滚动，记录滚动位置，返回滚动过程中的位置信息

- 一个新的小收获：如何保存状态为对象的数据？

  可以使用useRef钩子，每次更新时，既可以指定更新某一属性，也可以更新这个数值~

```jsx
import { isClient } from '../utils/common';

export default useWindowScroll = () => {
  const frame = useRef(0); // 它的current属性保存的是requestAnimationFrame的id
  const [state, setState] = useState({
    x: isClient ? window.scrollX : 0,
    y: isClient ? window.scrollY : 0,
  });

  useEffect(() => {
    const handler = () => {
      // q1:第一次scroll时，取消id是0呀？
      cancelAnimationFrame(frame.current);
      // q2: 为啥每次回调里先取消再设置下一帧的？直接赋值不可以吗？
      // 最后直接在卸载时取消~是出于内存的考虑吗？
      // q3:测试了一下，取消不影响页面滚动；但没有第1个id；这是为啥呢？
      frame.current = requestAnimationFrame(() => {
        setState({
          x: window.scrollX,
          y: window.scrollY,
        });
      });
    };
		// 页面挂载完毕后，监听滚动，执行handler：
    window.addEventListener('scroll', handler, {capture: false,
      passive: true,
    });

    return () => { //卸载时取消监听、
      cancelAnimationFrame(frame.current);
      window.removeEventListener('scroll', handler);
    };
  }, []);
  return state;
};
```

- 一些奇怪问题：

  current的id从初始的0 直接蹦到了2。这是为啥呢？？？？？

  <img src="https://mynightwish.oss-cn-beijing.aliyuncs.com/img/image-20220403162430758.png" alt="image-20220403162430758" style="zoom:50%;" />

### 4、日志打点

- 注意区分：首次挂载与更新；

  ```jsx
  const useLogger = (componentName, ...params) => {
    useEffect(() => {
      // 首次挂载
      console.log(`${componentName}初始化`, ...params);
      
      return () => {
        console.log(`${componentName}卸载`, ...params);
      }
    }, [])
    // 针对更新的钩子
    useEffect(() => {
      console.log(`${componentName}更新`, ...params);
    }, [componentName])
  };
  ```

- 使用：

  ```jsx
  function Page1(props){
    useLogger('Page1', props);
    return (<div>...</div>)
  }
  ```

### 5、双向绑定 ###

- 将表单`onChange`的逻辑抽出来封成一个`Hook`，这样所有需要双向绑定的表单组件都可以复用：

  ```jsx
  function useBind(init) {
    let [value, setValue] = useState(init);
    let onChange = useCallback(event => setValue(event.currentTarget.value), []);
    return {
      value,
      onChange
    };
  }
  ```

- 使用：

  ```jsx
  function Page1(props){
    let value = useBind('');
    return <input {...value} />;
  }
  ```

- 也可以利用`HOC`，结合`context`和`form`来封装一个更通用的双向绑定

## 二、为什么Hook升级了工作模式？

> 这一部分主要参考了官方文档的介绍，语言比较总结概括，但要真的能很好地实践与理解还需要不断的在实际中应用~
>
> 暂时我还没有特别深的能理解这些话，随着实际开发经验的增加，希望能有更多的理解与运用

### 1、使状态逻辑复用更简单可行

- 过去复用状态逻辑，靠的是HOC、render Props这些组件设计模式，但这些设计模式并非万能，它们在实现逻辑复用的同时，也破坏着组件的结构，其中一个最常见的问题就是**“嵌套地狱”**的现象。
- 而Hooks可以看做是React解决状态逻辑复用的原生途径，达到既不破坏组件结构，又能够实现扁平式的状态逻辑复用，而避免了大量的组件嵌套
- `Hook`和`Mixin`在用法上有一定的相似之处，但是`Mixin`引入的逻辑和状态是可以相互覆盖的，而多个`Hook`之间互不影响，这让我们不需要在把一部分精力放在防止避免逻辑复用的冲突上。

### 2、解决业务逻辑难以拆分的问题

1. 类组件：

   过去组织业务逻辑时，先想清楚业务需要，将对应的业务逻辑拆到对应的生命周期中，逻辑与生命周期强耦合。比如：DidMout去获取数据，在DidUpdate里获取数据的变化，但是大型项目中，一个生命周期做的事情很多。这些事情看起来毫无关联，而有关联的被分散在不同的生命周期里。

2. 但是Hooks有专门管理状态的、有引入副作用的等等，**它能帮我们实现业务逻辑的聚合，避免复杂的组件和冗余的代码。**

   可以让你更大限度的将公用逻辑抽离，将一个组件分割成更小的函数，而不是强制基于**生命周期方法**进行分割。

### 3、告别难以理解的class ###

class的两大痛点：this、生命周期

- **this：**比如推出了箭头函数、bind来解决this问题，但本质上是在用实践层面解决设计层面的问题。而函数组件就没有这个问题了。

- **生命周期：**学习成本、不合理的逻辑划分方式

相比函数，编写一个`class`可能需要掌握更多的知识，需要注意的点也越多，比如`this`指向、绑定事件等等。另外，计算机理解一个`class`比理解一个函数更快。`Hooks`让你可以在`classes`之外使用更多`React`的新特性。

##### 4、从设计思想上更加契合React的理念 #####

前面的函数组件、类组件已经做了对比分析。

### 4、Hooks的局限性 ###

Hooks并非万能，在认识到Hooks利好的同时，也需要认识到他的局限性。

1. Hooks暂时还不嫩而过完全为函数组件补全类组件的能力：比如，某些钩子还是没有；

2. 函数组件仍然是“轻量”，这可能使得它并不能很好地消化“复杂”

3. 在使用层面严格的约束

   耦合和内聚的边界很难把握，函数式组件给了更多自由，却对开发者代码能力提了更高的要求。
