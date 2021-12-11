---
title: CSS的样式隔离
date: 2021-12-11 22:23:40
tags:
- 样式污染
- cssModule
- CSS-in-JS
categories: CSS
description: '关于样式污染的解决方案'
cover: https://images.unsplash.com/photo-1605525933485-647411098629?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80
---
### 1、为什么需要css隔离 ###

基于组件化的搭建系统在提升研发效率的同时，组件化面临着一个痛点—组件样式隔离的问题

* 全局污染：CSS 选择器的作用域是全局的，所以很容易引起选择器冲突；而为了避免全局冲突，又会导致类命名的复杂度上升
* 复用性低：CSS 缺少抽象的机制，选择器很容易出现重复，不利于维护和复用

css隔离就是为了解决这个问题，vue 框架已经帮我们实现了 css 模块化, 通过 style 标签的 scoped 指令定义作用域，通过编译为该作用域所有标签生成唯一的属性。如图： 

<img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b86cc72b94e4df49adb0fba1ffee3eb~tplv-k3u1fbpfcp-watermark.awebp" alt="img" style="zoom: 33%;" />

 但是 react 并未给我们实现，解决方案主要有以下几种：

<img src="https://segmentfault.com/img/bVcQ2Nm" alt="image.png" style="zoom:50%;" />

### 做法1、命名空间          代码维护困难 ###

* 做法：

  给每个不同模块使用的css规划好命名，以不同的前缀代表不同的含义，实现样式分组，文件分块，达到模块化的目的

  第三方组件在导出 css 文件时，很多都使用的是这种方式：

  比如，[ant-design](https://link.segmentfault.com/?url=https%3A%2F%2Fgithub.com%2Fant-design%2Fant-design) 导出的 css 中使用 `ant-` 前缀标识，[mui](https://link.segmentfault.com/?url=https%3A%2F%2Fgithub.com%2Fdcloudio%2Fmui) 导出的 css 中使用 `mui-` 前缀标识等等

* 缺点：

  1. 并不是真正意义上的模块化，因为无法避免全局冲突的问题
  2. 编写起来很繁琐，维护成本会很高

#### 最佳实践： ####

比如网易的 css 规范框架 [NEC](https://link.segmentfault.com/?url=http%3A%2F%2Fnec.netease.com%2F)，[H-ui](https://link.segmentfault.com/?url=http%3A%2F%2Fwww.h-ui.net%2F)

* 一个 css 文件不宜过大，可以使用 `@import` 进行文件分块；
* 样式渲染尽量不要使用 `#id` `[attr]`，应尽量使用 `.class`；
* 使用 js 库操作 dom 时，尽量不要用 `.class`，应尽量用 `#id` `data-set`，如 `$('#main'), $('[data-tab="1"]')`

```js
<ul>
    <li data-tab="1">tab1</li>
    <li data-tab="2">tab2</li>
</ul>
<div data-tab-container="1"></div>
<div data-tab-container="2"></div>
```

### 做法2. css-modules（导出为 js ） 代码维护困难 ###

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/30/16f5477372d2bee3~tplv-t2oaga2asx-watermark.awebp" alt="总结" style="zoom: 80%;" />

#### 1、思想 ####

* 使用 `js` 来加载 `css` 文件，并将 `css` 的内容导出为一个对象，使用 `js` 来渲染整个 dom 树和匹配相应的样式到对应的元素上
* 在这个过程中，我们便有机会对 css 做额外的处理，来达到模块化的目的。

#### 2、做法 ####

**它需要在 jsx 中进行 className 的动态绑定：**，其中对 css 书写需求主要是：

1. 应用 `.class`，而非`#id` `[attr]`（因为只有 `.class` 才能导出为对象的属性）；
2. 推荐用 `.className` 书写，而非 `.class-name`（前者可以通过 `styles.className` 访问，后者需要通过 `styles['class-name']` 才能访问）
3. 这个功能需要构建工具的支持，如果使用 [webpack](https://link.segmentfault.com/?url=http%3A%2F%2Fwebpack.js.org) 构建工程的话，可以使用 [css-loader](https://link.segmentfault.com/?url=https%3A%2F%2Fgithub.com%2Fwebpack-contrib%2Fcss-loader)，并设置 `options.modules` 为 `true`， 便可使用模块化的功能了

#### 3、它的问题： ####

1. 问题1：需要先编写样式而不是先编写元素结构和定义 className

2. 问题2：在 className 写法上由于需要使用获取对象属性的写法，会导致一些使用连字符的样式类名需要用中括号才行

   ```js
   .container-title {
     color: red;
   }
   import style from './App.css';
   <h1 className={style["container-title"]}>
         Hello World
   </h1>
   ```

3. 问题3：其编译产物中 className 的值会变成一个哈希字符串，类名确实独一无二了，但可读性极差、且如果在作为其他组件的子组件使用时，如果父组件想要覆盖子组件样式，就没法儿支持了

   ```jsx
   <h1 class="_3zyde4l1yATCOkgn-DBWEL">
   		Hello World
   </h1>
   
   ._3zyde4l1yATCOkgn-DBWEL {
     color: red;
   }
   ```

#### 4、webpack配置   这个配置已过时，请看excel解析说的 ####

这个功能需要构建工具的支持，如果使用 [webpack](https://link.segmentfault.com/?url=http%3A%2F%2Fwebpack.js.org) 构建工程的话，可以 配置 css-loader 或者 scss-loader , module 为 true

```js
{
    loader: 'css-loader',
    options: {
        modules: true, // 开启模块化
        localIdentName: '[path][name]-[local]-[hash:base64:5]'
    }
}
```

效果如图所示： ![效果图](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e81eff3bce7b4d168b7cf72899d75325~tplv-k3u1fbpfcp-watermark.awebp)

localIdentName 自定义生成的类名格式，可选参数有：

* [path]表示样式表相对于项目根目录所在的路径(默认不拼接)
* [name] 表示样式表文件名称
* [local] 表示样式表的类名定义名称
* [hash:length] 表示 32 位的 hash 值 注意：只有类名选择器和 ID 选择器才会被模块化控制，类似 body h2 span 这些标签选择器是不会被模块化控制

#### 4.2 补充 ####

##### 1、引入css文件： #####

【注意1】：create-react-app, 默认已支持CSS Modules，所以不需webpack做开启模块化的添加配置了；

```jsx
<div className={styles['upload-wrap']}>
  <Upload {...uploadProps}>
    <Button icon={<UploadOutlined/>} >上传文件</Button>
    <p className={styles['file-text']}>支持扩展名: .doc .docx .jpg .png </p>
  </Upload> 
  // 这两种方式完全一样的：注意cssModule推荐使用驼峰
  <div className = {styles['upload-end']}>蛤蛤蛤11</div>
  <div className = {styles.uploadEnd}>蛤蛤蛤22</div>
</div>
```

【注意2】：

1. 以styles['upload-end']形式写的：样式也要这样写
2. 以styles.uploadEnd形式写的：样式也是uploadEnd，形式对应   **推荐√**

【注意3】：引入方式，这种方式下，**样式不生效的**

```js
import styles from './index.css';
```

将index.css文件名改为：

```js
import styles from './style.module.css';
```

【疑问】：为什么要带module呢？

```

```

##### 2、引入less文件          ？ #####

要解决的问题：

1. 配置webpack，让less文件生效：

   配置less-loader，注意less-loader版本降级

2. less文件模块化：

   开启less的模块化

【这部分还没有配置好，~~】

#### 5、css module 作用域 ####

* 作用域默认为 local 即只在当前模块生效
* global 被 :global 包裹起来的类名，不会被模块化

```js
/* 加上 :global 会全局样式 */
:global(.global-color) {
  color: blue;
  :global(.common-width) {
    width: 200px;
  }
}
```

#### 6、css module 高级使用 ####

##### 1、和外部样式混用 #####

```jsx
import classNames from 'classnames';

const wrapperClassNames = classNames({
  'common-show': visible,
  'common-hide': !visible,
  [styles1['view-wrapper']]: true
});

// 使用classNames库
<div className={wrapperClassNames}></div>
// 使用模板字符串
<div className={`${styles1.content} ${styles1.color} common-show`}>
  我是文章内容我是文章内容我是文章内容我是文章内容我是文章内容我是文章内容
</div>
```

##### 2、覆盖第三方 UI 库 #####

```jsx
{/* 覆盖第三方UI库 样式*/}
<div className={styles1['am-button-custom-wrapper']}>
  <Button type={'primary'} onClick={() => toggle()}>
     {visible ? '隐藏' : '显示'}
  </Button>
</div>

//  覆盖第三方UI库的 样式
.am-button-custom-wrapper {
  :global {
    .am-button-primary {
      color: red;
    }
  }
}
```

### 做法3. CSS-in-JS（内置 js，绑定组件） ###

#### 1、思想 ####

* 思路1：把整个组件的资源进行封装，并只对外暴露一个对象，而调用者无需关心组件的内部实现和资源，直接调用这个对象就够了

* 思路2：就是将 css 内置 js 中，成为 js 的一部分，这样做的目的，一是 css 的模块化，二是直接绑定到组件上

  比如，[material-ui](https://link.segmentfault.com/?url=https%3A%2F%2Fgithub.com%2Fmui-org%2Fmaterial-ui)、[styled-jsx](https://link.segmentfault.com/?url=https%3A%2F%2Fgithub.com%2Fzeit%2Fstyled-jsx)、[jss](https://link.segmentfault.com/?url=https%3A%2F%2Fgithub.com%2Fcssinjs%2Fjss)、[vue style scoped](https://link.segmentfault.com/?url=https%3A%2F%2Fgithub.com%2Fvuejs%2Fvue) 便是使用的这种方式

* **缺点**：

  1. 不太符合关注点分离的开发习惯
  2. 不仅会导致js文件的膨胀，并且其构建产物中样式大多是通过 style 内联的形式，这种方式对于样式复写也会造成较高的成本

#### 2、实践1 ####

比如（以 react 为例），一个 Welcome 组件，包括一个 js 文件、一个 css 文件、图片：

```js
# Welcome 组件
|-- welcome.js
|-- welcome.css
|-- images/
```

在 `welcome.js` 中便可如下加载（使用“导出为 js 对象”的 css 模块化）：

```jsx
import styles from './welcome.css';
import image1 from './images/1.jpg';
```

#### 3、实践2：styled-jsx ####

[jsx组件样式隔离的最佳实践 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/188318692)

* `styled-jsx` 的原理：

  根据当前文件的位置、内容生成一个全局唯一的标识，然后把这个标识追加到组件每一个元素上，每一个样式选择器上，达到模块化的目的

##### 1、安装工具（babel 转码所需） #####

```jsx
npm install --save styled-jsx
```

##### 2、配置 babel plugins（如 `.babelrc`） #####

```jsx
{
  "plugins": [
    "styled-jsx/babel"
  ]
}
```

##### 3、添加源文件代码 #####

```jsx
export default () => (
    <div className={'container'}>
        <p className={'hello'}>Hello! Hello!</p>
        <div id={'hi'}>Hi!</div>
        <style jsx>
            {`
            .container {
              color: blue;
            }
            p:first-child {
              color: red;
            }
            .hello {
              color: yellow;
            }
            #hi {
              color: green;
            }`
          }
    	</style>
    </div>
)
```

##### 4、转码 #####

```js
babel path/to/hello.js -d target/dir
```

转码后的文件

```jsx
import _JSXStyle from 'styled-jsx/style';
export default () => (
    <div className={'jsx-234963469' + ' ' + 'container'}>
        <p className={'jsx-234963469' + ' ' + 'hello'}>Hello! Hello!</p>
        <div id={'hi'} className={"jsx-234963469"}>Hi!</div>
        <_JSXStyle styleId={"234963469"} css={".container.jsx-234963469{color:blue;}p.jsx-234963469:first-child{color:red;}.hello.jsx-234963469{color:yellow;}#hi.jsx-234963469{color:green;}"} />
    </div>
);
```

##### 5、运行 #####

实际渲染效果

```xml
<style type="text/css" data-styled-jsx="">
  .container.jsx-234963469{
    color:blue;
  }
  p.jsx-234963469:first-child{
    color:red;
  }
  .hello.jsx-234963469{
    color:yellow;
  }
  #hi.jsx-234963469{
    color:green;
  }
</style>

<div class="jsx-234963469 container">
  <p class="jsx-234963469 hello">Hello! Hello!</p>
  <div id="hi" class="jsx-234963469">Hi!</div>
</div>
```

#### 4、实践2：styled-components ####

* 针对 React 写的一套 css in js 框架, 在你使用 styled-components 进行样式定义的同时，你也就创建了一个 React 组件
* 优势: 支持将 props 以插值的方式传递给组件,以调整组件样式, 跨平台可在 RN 和 next 中使用
* 缺点： 预处理器和后处理器不兼容

```css
const DivWrapper = styled.div`
  width: '100%';
  height: 300;
  background-color: ${(props) => props.color};
`;

// 封装第三方组件库
const AntdButtonWrapper = styled(Button)`
  color: 'red';
`;

// 通过属性动态定义样式
const MyButton = styled.button`
  background: ${(props) => (props.primary ? 'palevioletred' : 'white')};
  color: ${(props) => (props.primary ? 'white' : 'palevioletred')};

  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

// 样式复用
const TomatoButton = styled(MyButton)`
  color: tomato;
  border-color: tomato;
`;


// 创建动画组件
const Rotate = styled.div`
  display: inline-block;
  animation: ${rotate} 2s linear infinite;
  padding: 2rem 1rem;
  font-size: 1.2rem;
`;
```

### 做法4：预处理器的嵌套语法和CSS 属性选择器 ###

借鉴Vue中的Scoped的做法：

* 通过 style 标签的 scoped 指令定义作用域，通过编译为该作用域所有标签生成唯一的属性

<img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b86cc72b94e4df49adb0fba1ffee3eb~tplv-k3u1fbpfcp-watermark.awebp" alt="img" style="zoom: 33%;" />

#### 1、做法 ####

* #### JS文件： ####

  data-component可以限制为每个组件的名字

  ```js
  function App() {
    return (
      <div className="app" data-component="app">
        <div className="content">
          <p className="title">标题</p>
          <p className="text">隔离css</p>
        </div>
      </div>
    );
  }
  ```

* #### 预处理器文件：less、sass ####

  这样就解决了css class全局污染的问题。简单易用，不用引入新的概率和扩展。

  create-react-app脚手架默认也支持引入scss、less

  ```less
  [data-component=app] {
    .content {
      padding: 20px;
      .title {
        font-size: 18px;
        font-weight: bold;
        color: #333333;
      }
      .text {
        font-size: 16px;
        color: #333333;
      }
    }
  }
  ```

