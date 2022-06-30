---
title: webpack基础-使用
tags: webpack
categories: 2.2-基建
description: '为什么会有webpack,loader在做什么'
cover: https://mynightwish.oss-cn-beijing.aliyuncs.com/Project/webpack-basic.png
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: 2131155013
date: 2022-01-26 10:32:19
---

## 一、背景知识 ##

### 1、为什么有webpack ###

与前端发展密切联系

1. web 10.时代  主要是编写静态页面 表达验证与动效
2. Web2.0时代   ajax的出现 不仅仅展示页面，还可以交互   管理数据
3. 大前端开发时代：pc、移动，小程序，公众号。流程更复杂，要做的事越来越多   面临的问题：
   * 模块化支持：当下模块开发方式，但不同浏览器支持不同，且不同的模块化方式不一样
   * 新特性支持：使用新特性提高效率：像es6、less及sass、模板语法、vue指令及jsx在浏览器中是无法直接执行的，必须经过构建这一个操作才能保证项目运行，所以**前端构建打包**很重要
   * 开发中实时监听：能直接在浏览器上看到更改后的内容
   * 项目优化：编码完成后，部署之前，打包压缩等工作

所以，总结来说：**前端构建工程化**发展的需要

### 2、webpack能做什么

#### 1、官方文档： ####

* 本质上，*webpack* 是一个现代 JavaScript 应用程序的**静态模块打包器(module bundler)**
* 当 webpack 处理应用程序时，它会递归地构建一个**依赖关系图(dependency graph)**，其中包含应用程序需要的每个模块，然后将所有这些模块**打包**成一个或多个 ***bundle***

#### 2、解释： ####

* 静态：打包后，最终**产出静态资源**

* 模块：

  * webpack默认支持各种**模块化开发**，前端的所有资源文件(js/json/css/img/less/...)都会作为模块处理

  * 在[模块化编程](https://en.wikipedia.org/wiki/Modular_programming)中，开发者将程序分解为功能离散的 chunk，并称之为 **模块**。
  * 每个模块都拥有小于完整程序的体积，使得验证、调试及测试变得轻而易举
  * Node.js 从一开始就支持模块化编程。 然而，web 的 *模块化* 正在缓慢支持中
    * webpack天然支持的模块：ECMAScript 模块、CommonJS 模块、AMD 模块、WebAssembly 模块
    * 

* 打包：将不同类型的资源按模块处理进行**打包**

### 3、安装与运行 ###

#### 1、初始化项目 ####

* 初始化：

  ```npm
  npm init -y 一路回车   会生成package.json 文件
  ```

* 修改配置package.json：

  ```json
  + “private":"true"  意思是这是一个私有项目，它不会被发布到npm线上仓库
  -“main”:"index.js" 配置项
  -"script":{//可以先去掉里边的内容}
  "author":"可以写成自己的名字"
  "license":"INIT"如果想开源的话，依然使用"ISC"也可以
  "private": true, // 禁止发布到npm上     
  "main": "index.js" // 向外暴露文件
  ```

#### 2、安装webpack ####

* 全局安装：

  ```
  npm i webpack webpack-cli -g  
  npm info webpack 查看都有哪些版本号
  ```

* 局部安装：

  ```
  npm i webpack-cli --save-dev
  npm i weboack --save-dev
  npm i webpack@版本号 -webpack-cli -D
  ```

#### 3、打包项目 ####

* #### 全局打包方式： ####

  问题：假如当前项目在5上的，分享给别人就会有问题。因为别人的跟我的不匹配，我们应该用局部打包方式

  ```
  webpack index.js    // 全局版本
  webpack ./src/index.js -o ./build/built.js --mode=development
  // webpack就会以`./src/index.js`为入口文件开始打包,打包后输出到`./build/built.js`整体打包环境,是开发环境
  ```

  * 此时直接执行webpack ，打包时，会自动去src目录下的index.js文件下去查找,进行依赖分析；


  * 完成编译自动生成了dist文件夹。里面有main.js。他就是打包生成的产物。


  * index.html中引入dist下的main.js文件，就可以在浏览器中看到运行结果

* #### 局部打包方式1：命令行，麻烦 ####

  ```
  npx webpack index.js   
  // 打包时优先用当前项目的webpack版本， npx会在项目中的node_modules中找webpack包运行
  ```

* #### 局部打包方式2：脚本script ####

  假如在index.js做了修改：想自定义入口文件名字，希望产出文件放在指定目录下：ouputPath

  - 导出配置文件webpack.config.js中：

    ```js
    const path = require('path');
    modulex.exports = {
        entry: './src/index.js',
        output: {
            filename: 'build.js',
            path: path.resolve(__dirname, 'dist') //必须为绝对路径，so要path模块
        }
    }
    ```

  - 在package.son中：

    ```js
    "scripts": {
        "build": "webpack"  // 打包默认优先使用本项目webpack版本
    }
    ```

* 如果想修改打包配置文件命名：lg.webpack.js

  ```js
  则在package.json中：scripts：{
  	bulid: webpack --config lg.webpack.js
  }
  ```

#### 4、依赖图： ####

webpack在打包时会有个依赖关系：基于入口文件：index.js，在里面使用语法导入别的模块，可以通过不同的loader转换。

- 当你没有被某个模块引入时，webpack打包时不会去找他，在构建依赖图不会去做打包
- 进一步的，可能模块文件进入了，但是实际没有使用。会有tree  shaking做优化

### 4、实验分析： ###

- 在public目录下新建index.html

  ```html
  <body>
      <script src="./main.js" type="module"></script> 
  </body>
  ```

- 新建JS目录下 util.js文件

  ```js
  const sum = (m, n) => {
      return m+n;
  }
  const  square = (m) => {
      return m*2;
  }
  export {sum, square}
  ```

- 新建JS目录下  api.js

  ```js
  const getInfo = () => {
      return {
          name: 'zcs',
          age: 40
      }
  }
  module.exports = getInfo;
  ```

- 在入口文件index.js中导入

  ```js
  import {sum, square} from './js/utils.js'
  
  console.log(sum(1, 3));  //这种esmodule的支持需要配置script 中的type为module
  console.log(square(4))
  
  //但即使配置了type  commonJS谷歌仍然不支持，此时webpack登场帮我们姐姐
  const getInfo = require('./js/api')  
  console.log(getInfo())
  ```

- 安装好webpack及cli：

  此时直接执行webpack ，打包时，会自动去src目录下的index.js文件下去查找,进行依赖分析；

  完成编译自动生成了dist文件夹。里面有main.js。他就是打包生成的产物。

  index.html中引入dist下的main.js文件，就可以在浏览器中看到运行结果

## 二、核心概念及模块 ##

### 0、4个核心概念 ###

入口、出口、loader、plugins

* **loader：**让Webpack 能够去处理那些非JavaScript文件(JavaScrpit)

  - 为什么webpack需要loader？

    默认webpack自身只理解JS，而不能处理非JS文件，so需要有一个人对这种文件转换，之后让webapck去执行转换后的内容

  - loader是什么？

    是一个模块，能够将转成webpack能够识别的模块，导出一个函数

* **插件(plugins)：**用于执行范围更广的任务：打包优化和压缩、重新定义环境中的变量等

  * 比如说，我们更改了配置项，就需要删除dist目录，重新打包生成编译产物，再运行；
  * 再比如我们每次打包完成后，每次都要手动修改，也比较麻烦。
  * 插件就能帮我们做这些

* **当有插件时，为什么还会有loader呢？**

  核心功能不同

  - 对loader而言，它主要是对特定类型的（非JS）模块转换。而loader就承担了这些识别转换的功能。工作的时机就是**读取某个特定类型的资源时**

  - 而插件，可以做的更多。它同样存在自己的生命周期，我们可以认为打包的过程就是一个完整的流水线，那么当前的插件可以在流水线上的任一时机被插进来。比如说，我们希望在打包开始时做一些事情，或在打包进行到某一时机点做些事情，再比如希望写。而loader并不满足这种需求

### 1、entry模块 ###

功能：指示 Webpack以哪个文件为**入口**开始打包，分析构建内部依赖图

4种写法：

1. 单入口：打包形成一个chunk(模块)，输出一个bundle(包)文件。此时默认的chunk名称是main

   ```
   entry: './src/index.js' 
   ```

2. 多入口：所有入口文件最终只会形成一个chunk，输出出去只有一个bundle文件(类似将add.js打包进index.js中)    

   通常只有在`HMR功能中使用`, 让html热更新生效使用

   ```
   entry: ['./src/index.js', './src/add.js']
   ```

3. 多入口：有几个入口文件就形成几个chunk，输出几个bundle文件。此时chunk名称是 key

   ```js
   entry: {
     index:'./src/index.js',
     add:'./src/add.js'
   }
   ```

4. 特殊用法(混合使用)  ：通常在`dll`优化功能中使用

   ```js
   entry: {
         // 所有入口文件最终只会形成一个chunk, 输出出去只有一个bundle文件。
       index: ['./src/index.js', './src/count.js'], 
          // 形成一个chunk，输出一个bundle文件。
       add: './src/add.js'
     }
   ```

### 2、output模块 ###

功能：指示 Webpack打包后的资源输出到哪里去、如何命名

#### 1、`filename`： ####

文件名称（指定名称+目录）

* 如果这里写死bundle.js，**多入口打包**的时候，会报错，因为你指定了多个打包输出不能都用同一个文件，解决：占位符的写法filename: '[name].js', 

  ```
  filename: 'js/[name].js',
  ```

#### 2、`path`： ####

* 输出文件目录(将来所有资源输出的公共目录)

  ```
  path: resolve(__dirname, 'build'),
  ```

#### 3、`publicPath`： ####

所有资源引入公共路径的前缀

* 在本地打包后，告知本地打包的index.html，将来去哪个地方寻找加载的资源   浏览器补的

* 为空字符串' '时，将当前域名+publicPath+filename形式访问资源。

  * 当以打开index.html的形式，也就是file协议打开时，index.html的js引用的是main.js，实际是./ 以相对路径形式访问  

  * 当开启der-server访问时，也可以找到加载的资源。怎么做的呢？

    首先是前面域名：http://localhost:8080+'/'(这个是浏览器自动帮我们加的)+filename（我们设置的）

* 也可以写成/的形式：此时是以绝对路径的形式访问   自己补

  - 本地打包：<script defer src="/js/build.js"></script>

    报错加载不到资源  此时需要写成./。这样相当于将绝对路径改成相对路径，本地就ok了

    但此时./如果还想dev-server形式，又无法预览。相对路径，它不知道怎么去找。找不到js下面的build.js


#### 4、`chunkFilename`:

* 非入口chunk的名称，如未指定这项,在入口文件中导入的js打包也会用上`filename`的文件名称进行命名，但是名字与入口文件冲突,就会使用0~∞数字命名,不容易区分

  ```
  chunkFilename: 'js/[name]_chunk.js', // 非入口chunk的名称
  ```

#### 5、library ####

* `library:'[name]'`  //整个库向外暴露的变量名 实际上使用`var声明`

* `libraryTarget`:将变量名添加到哪个对象上

  ​	a) libraryTarget: 'window' 适合浏览器端

  ​	b) libraryTarget: 'global' 适合node

  ​	c) libraryTarget: 'commonjs' 使用commonjs方式进行模块导出

```js
output: {
    filename: 'js/[name].js',
    path: resolve(__dirname, 'build'),
    publicPath: '/',
    chunkFilename: 'js/[name]_chunk.js', // 非入口chunk的名称
  }
```

### 3、module模块

* `test`:文件名匹配规则,后面参数是一个正则

* `exclude`:排除匹配某个目录下的内容 

  ```
  exclude: /node_modules/ ->排除node_modules下的文件
  ```

* `include`:只检查 某个目录下的文件

  ```
  include: resolve(__dirname, 'src') ->只检查 src 下的js文件
  ```

* `loader`与`use`:单个loader使用`loader`,多个loader用`use`

* `enforce`:指定该配置的执行顺序: 

  ```
  enforce:'`pre`'(优先执行) > 默认 > enforce:'`post`'(延后执行)
  ```

* `options`:指定这个loader的配置选项

* ` oneOf: []`:          **性能优化**

  * 里面的配置只会生效一次,即里面有100个配置,当我一个文件进入这里检测,可能第10个配置匹配到了就生效,然后该文件就不会进行下面90次匹配
  * 如果是不放` oneOf`里面的配置,就会完全执行100次匹配
  * 当你使用eslint与babel两种配置进行对于js文件的匹配的情景下会使用

```js
module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,     // 排除node_modules下的js文件
        include: resolve(__dirname, 'src'),    // 只检查 src 下的js文件
        loader: 'eslint-loader',   // 单个loader用loader
        //use: ['style-loader', 'css-loader'] // 多个loader用use     
        enforce: 'pre',// 优先执行 // 延后执行enforce: 'post',
        options: {}      //指定这个loader的配置选项
      },
      {
        oneOf: []  // 以下配置只会生效一个
      }
    ]
  }
```

### 4、resolve模块 ###

* 功能：解析模块的规则

1. `alias`： 配置解析模块路径别名: 优点**简写路径**    缺点路径**没有提示**

2. `extensions`：如果在这里配置了，引入时可以不用写后缀

   ```js
   import '$css/index';
   ```

3. `modules`：告诉webpack**解析模块**时去哪个目录

   * 不指定，webpack会一层一层往外找，不必要的性能浪费

```js
module.exports = {
  module: {
    rules: [ ]
  },
  plugins: [new HtmlWebpackPlugin()],
  resolve: {       // 解析模块的规则
    alias: {       // 配置解析模块路径别名
      $css: resolve(__dirname, 'src/css')
    },
    extensions: ['.js', '.json', '.jsx', '.css'],   // 配置省略文件路径的后缀名
    // 告诉 webpack 解析模块是去找哪个目录
    modules: [resolve(__dirname, '../../node_modules'), 'node_modules']
  }
};
```

### 5、devServer模块 ###

这部分配置很多,只抽出我觉得比较重要的

>1、`proxy`:服务器代理 -->解决开发环境跨域问题
>
>​	① target: 一旦devserver服务器接收到`/接口名/xxx`,就会把请求转发到`target`后面的参数url服务器上
>
>​	② pathRewrite:发送请求时,请求路径重写 --> 如:将/api/xxx ->/xxx(去掉前面的/api)
>
>2、`contentBase`:指定运行代码的目录
>
>3、`hot`:开启`HMR模块热替换`,这是优化部分功能
>
>4、`overlay`:当设置为`false`时,如果代码错误,不要进行全屏提示
>
>5、`watchContentBase`:当设置为`true`时,监听contentBase目录下的所有文件 一旦文件变化就会reload
>
>6、`watchOptions`:内部设置监听的忽略文件,通常与`5`搭配使用
>
>7、`compress`:是否开启`gzip`压缩

```js
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devServer: {
    contentBase: resolve(__dirname, 'build'),   // 运行代码的目录
    // 监视 contentBase 目录下的所有文件，一旦文件变化就会 reload
    watchContentBase: true,
    watchOptions: {
      ignored: /node_modules/       // 忽略文件
    },
    compress: true,
    port: 5000,
    host: 'localhost',
    open: true,
    hot: true,      // 开启HMR功能
    clientLogLevel: 'none',   // 不要显示启动服务器日志信息
    quiet: true,    // 除了一些基本启动信息以外，其他内容都不要显示
    overlay: false,       // 如果出错了，不要全屏提示~
    // 服务器代理 --> 解决开发环境跨域问题
    proxy: {
      // 一旦devServer(5000)服务器接受到 /api/xxx 的请求，就会把请求转发到另外一个服务器(3000)
      '/api': {
        target: 'http://localhost:3000',
        // 发送请求时，请求路径重写：将 /api/xxx --> /xxx （去掉/api）
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
};
```

### 6、Mode： ###

* 指示Webpack使用相应模式的配置

  | 选项        | 描述                                                         | 特点                       |
  | ----------- | ------------------------------------------------------------ | -------------------------- |
  | development | 会将process.env.NODE_ENV的值设置为development.<br />启用NamedChunksPlugin和NamedModulesPlugin | 能让代码本地调试运行的环境 |
  | production  | 启动好多东西....                                             | 能让代码优化上线运行的环境 |

### 7、optimization ###

## 三、loader

### 1、CSS-loader ###

#### 1、CSS-loader   style-loader ####

* css-loader css文件的识别、style-loader  css样式的绑定生效、sass-loader  scss 文件使用

  ```js
     {
          // 匹配哪些文件
          test: /\.css$/,
          // 使用哪些loader进行处理
          use: ['style-loader', 'css-loader']
            // use数组中loader执行顺序：从右到左，从下到上 依次执行
            // style-loader创建style标签，将js中的样式资源插入进行，添加到head中生效
            // css-loader将css文件变成commonjs模块加载js中，里面内容是样式字符串      
        },
        {
          test: /\.less$/,
          use: ['style-loader', 'css-loader', 'less-loader']
            // less-loader:将less文件编译成css文件
        }
  ```

#### 2、browserslitrc 

- 要求：需要考虑兼容性的支持：JS比如ES6  CSS 比如某些选择器

- 方式1：配置package.json

  ```
    "browserslist": [
      ">1%",
      "last 2 version",
      "not dead"
    ]
  ```

- 方式2：专门有.browserslistrc

  ```
  在里面写所有的要求
  ```

- 查看兼容的浏览器

  ```
  npx browserslist
  ```

#### 3、postcss

- 为什么会有？     工程化开发css，存在配置项筛选出要兼容的平台。利用这个工具可以

- 是什么？

  可以将css文件处理完成，交给css-loader处理即可。在webpack中，通过javascript转换样式的工具


##### 命令行的方式使用： #####

- 不支持命令行的方式，除非安装cli

  ```
  npm i postcss-cli -d
  ```

- 假如我们指定兼容哪些平台，前缀不一样，会自动加前缀，做兼容性处理：autoprefix

  在test.css中

  ```
  .title {
      transition: all 0.5s;
      user-select: none;
  }
  ```

  在login.js中引入文件

  ```
  import '../css/test.css'
  ```

- 重新打包，可以发现控制台中style标签已经添加了样式内容，但是**并没有为我们自动补齐前缀：**

- 处理test.css文件

  ```
  npx postcss -o ret.css ./src/css/test.css
  此时下面就生成了ret.css
  ```

  它的生成产物，好像只是复制了一遍，并没做什么。**因为postcss它本身只是一个工具，希望它做啥还需要插件拿进来**

  ```js
   npm i autoprefixer -d  //安装插件：具体的功能，实现前缀添加
  ```

- 重新处理test.cs文件

  ```
  npx postcss --use autoprefixer -o ret.css ./src/css/test.css 
  ```

- 此时产物ret.css就添加了前缀

  ```css
  .title {
      display: grid;
    	color: #12345678;
      transition: all 0.5s; 
      -webkit-user-select: none;
         -moz-user-select: none;
          -ms-user-select: none;
              user-select: none;
  }
  ```

##### 以配置的方式使用 #####

- 安装

  ```
  npm 安装post-loader
  配置：use: ['style-loader', 'css-loader', 'postcss-loader']
  ```

  - 但是postcss-loader什么也做不了，所以也不会自动添加。

- 配置lg.config.js

```js
{
  test: /\.css$/,
  use: [
    'style-loader',
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {      // 设置参数:希望将来加载的插件:
        postcssOptions: {
          plugins: [
            require('autoprefixer')      // 插件的功能可以对其夹前缀
          ]
        }
      }
		}]
},
```

#### 4、postcss-preset-env

* 是什么？

  * 这是一个预设，是插件的集合，用来对新的语法做处理；

  * 比如我们在上面定义样式时，写了color: #12345678，这是不同于常见的rgb写法。而autoprefix时不能帮我们做这种新语法。还需要去配置里修改，但这很麻烦。so   postcss-preset-env

- 它里面默认集合了常见的css转换，因此安装+配置即可

  ```js
  添加插件引入：
  plugins: [require('autoprefixer'),require('postcss-preset-env')]
  ```

- 可以简写为：

  ```js
  plugins: [
    // 插件的功能可以对其夹前缀
    'autoprefixer','postcss-preset-env'  //它有了，不用写autoprefixer
  ]
  //最终简写
  plugins: ['postcss-preset-env']   //它有了，不用写autoprefixer
  ```

##### 单独配置文件postcss.config.css #####

- 针对CSS文件如此，Less文件也是如此，webpack支持专门搞个文件，设置这些，就不用再copy配一遍，很方便管理配置：新建postcss.config.css（不能随便命名）

  ```js
  module.exports = {
       plugins: [
          require('postcss-preset-env')  //可以简写
          // require('autoprefixer')
       ]
  }
  ```

  lg.config.js中只需要写对应loader：比如匹配css

  ```js
  {
    test: /\.css$/,
    use: [
      'style-loader',
      'css-loader',
      'postcss-loader'  // 当它读到这里时会自动去找它的配置
    ]
    test: /\.less$/,
      use: [
        'style-loader', 
        'css-loader', 
        'postcss-loader',
        'less-loader'
      ]
  }
  ```

#### 5、importLoader属性

- 在test.css文件中：拆解部分login.css文件 给test.css

  ```css
  .title {
      transition: all 0.5s;
      user-select: none;
  }
  ```

- 在login.css文件中导入拆解走的样式：

  ```css
  @import './test.css';
  
  .title {
      color: #12345678;   
      background-color: rgba(155, 118, 70, 0.714);
  }
  ```

- 重新打包，成功。但控制台中发现兼容性的样式并没有，autoprefix配置没问题。so，@import导入的样式无法生效，为什么？

  - 按照loader解析顺序：

    - postcss-loader经过分析配置后，会对生成的css文件生效。

    - 然后，login.css文件@import导入了test.css文件。 postcss-loader拿到了login.css的代码后，分析基于筛选条件并不需要做额外处理，so会把代码直接交给了css-loader。

    - css-loader可以处理@import  media url这类问题。此时拿到了test.css文件。此时内部有需要兼容性处理的loader，但此时loader不会再回头找postcss-loader。它直接交给了style-loader处理。
    - 所以我们在页面没有看到那块处理

- 解决：import loader属性，此时就可以看到import的模块进行了兼容性处理

  ```js
  {
    loader: 'css-loader',
      options: {
        importLoaders: 1 //让它遇到import 往前找一个loader
      }
  }
  ```

### 2、file/url-loader ###

#### 1、file-loader ####

-  打包图片：比如img的src   background的url引入图片资源
-  file-loader功能：
   - 能帮我们返回一个js能识别的东西
   - 可以把要处理的 二进制文件拷贝到指定目录。如果我们没有指定，会拷贝到dist目录里

##### img标签实验： #####

- 定义image.js文件

  ```js
  function packImg(){
      //  比如页面上有标签：设置src属性
      // 容器元素
      const oEle = document.createElement('div');
      return oEle;
  }
  
  document.body.appendChild(packImg());
  ```

- 在入口文件index.js引入：

  ```js
  import './js/Image'   // 引入依赖
  ```

​			重新打包生成，可在控制台中看到标签

- 添加图片，本地img文件夹放了a b两张图，修改img.js，引入图片并打包。此时报错提示loader

  ```js
  function packImg(){
      //  比如页面上有标签：设置src属性
      // 容器元素
      const oEle = document.createElement('div');
      const oImg = document.createElement('img');
      oImg.src = require('../img/aa.jpeg');
      oEle.appendChild(oImg); 
      return oEle;
  }
  document.body.appendChild(packImg());
  ```

- 安装该loader 并配置：

  ```js
  {
    test: /\.(png|svg|gif|jpeg)$/,
    use: ['file-loader']
  }
  ```

- 此时我的页面显示不正常，控制台报错：

  ```js
  Automatic publicPath is not supported in this browser。
  ```

  修改lg.config.js配置文件的outpath的publicPath

  ```js
  output: {
    publicPath: '/dist/',  
    filename: 'build.js',
    path: path.resolve(__dirname, 'dist') //必须为绝对路径，so要path模块
  },
  ```

- 此时不报错，控制台会有img，但图片不显示，且src变成了 Object module。在webpack5中，file-loader默认返回的是一个对象，东西放在default中，就必须访问dedault。修改img.js，就ok啦

  ```js
  oImg.src = require('../img/aa.jpeg').default;
  ```

##### img.js中不想通过default的方式 #####

* 方式1：配置file-loader：

```js
{
  test: /\.(png|svg|gif|jpeg)$/,
    use: {
      loader: 'file-loader',
        options: {
          esModule: false  // false不换为esModule
        }
    }
}
```

- 方式2：通过esModule的导入方式

```js
import oImgSrc  from '../img/aa.jpeg';
oImg.src = oImgSrc;
```

##### background的引入实验

- 修改img.js，重新打包生成可看到dom结构已经生效

  ```js
  const oEle = document.createElement('div');
  const obgImg = document.createElement('div');
  obgImg.className = 'bgbox';
  
  oEle.appendChild(obgImg); 
  return oEle;
  ```

- 新建css文件夹下的img.css

  ```css
  .bgbox {
      width: 500px;
      border: 1px solid red;
      background: url('../img/bb.jpeg');
  }
  ```

- 修改img.js：执行打包

  ```
  import '../css/img.css'
  ```

  此时dist下有2个图片：有个是二进制图片，但页面并没有正确显示图片

- 在打包时，在处理img.js时

  * 依赖img.css，so postcsss-loader会去处理，并没有太多变化，又交给css-loader。该loader可以处理bg-img。

  * 而css-loader会将bg-img替换为require语法。返回的是**esModule**，导出加了default。但是我们理想的，是不要你返回esModule，直接返回资源即可：

  - 此时，css-loader配置中更改esModule：此时图片便可正常显示，且dist下不会有中间产物

    ```js
    options: {
      importLoaders: 1, //让它遇到import 往前找一个loader
      esModule: false
    }
    ```

- 修改打包的文件以想要的方式生成：

  ```js
  options: {
    name: '[name].[hash:6].[ext]',
    outputPath: 'img' // 打包到img下面，但一般不这样写
  }
  options: {
    name: 'img/[name].[hash:6].[ext]'  //这样也可以，会自动生成img，图片在这下面
  }
  ```

##### 打包其他资源

>`exclude`:指定除此之外的资源

```js
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      // 打包其他资源(除了html/js/css资源以外的资源)
      {
        // 排除css/js/html资源
        exclude: /\.(css|js|html|less)$/,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]'
        }
      }
    ]
  },
```



#### 2、url-loader

- 安装  配置：此时图片正常显示，但dist下图片不会生成img。也没图片

  ```js
  {
    test: /\.(png|svg|gif|jpeg)$/,
      use: {
        loader: 'url-loader',
          options: {
            name: 'img/[name].[hash:6].[ext]',
          }
      }
  }
  ```

- File-loader与url-loader

  - File-loader：将当前图片的名称返回，路径返回，并将要打包的图片资源拷贝到dist目录下。

    - 缺点：在访问静态资源的时候，需要额外发请求

  - 但url-loader：将当前要打包的图片资源以base64的格式加载到代码中，所以不会看到dist目录下，控制台也可以看到。

    - 优点：不需要额外请求，减少请求次数。

    - 缺点：图片过大时，请求慢，对首屏不好。

  limit属性可以做拆分：大于该值，做拷贝，避免等待时间过长。小于该值，转64，减少额外请求

  ```js
  options: {
    name: 'img/[name].[hash:6].[ext]',
    limit: 25*1024
  }
  ```

#### 3、asset

- 在webpack5中，可以通过asset直接配置这两个loader，不需要单独分开配

  ```
  - Asset/reesouse: 可以将目标支援拷贝到指定目录  file-loader
  - asset/inline:   url-loader
  - Asset/source: raw-loader  不常用
  - asset/  设置类似limit等限制
  ```

- 修改配置：lg.config.js，打包后，图片正常显示

  ```js
  {
    test: /\.(png|svg|gif|jpeg)$/,
    type: 'asset/resource',
  }
  ```

- 再修改lg.config.js：

  - 全局方式：全局统一设置：需要找到output配置，打包完成，仍然正常使用，img也生成

    ```js
    output: {
            publicPath: '/dist/',
            filename: 'build.js',
            + assetModuleFilename: "img/[name].[hash:6][ext]", // 不用加. ext会自动加
            path: path.resolve(__dirname, 'dist') //必须为绝对路径，so要path模块
        },
    ```

    但这种配置方式是全局的，将来还有可能处理其他静态资源，比如字体，也会被打包进入这该文件夹

  - 局部的方式：lg.config.js，打包编译即可成功

    ```js
    {
    		test: /\.(png|svg|gif|jpeg)$/,
        type: 'asset/resource',  
        generator: {
            filename: "img/[name].[hash:6][ext]",
        }
    }
    ```

    asset/inline的方式

    ```js
    {
      test: /\.(png|svg|gif|jpeg)$/,
       type: 'asset/inline'    //不会产出图片，且没有generator
    }
    ```

    如果希望做限制，还需要配置parser、generator

    ```js
    {
      test: /\.(png|svg|gif|jpeg)$/,
        type: 'asset',
          generator: {
            filename: "img/[name].[hash:6][ext]",
          },
            parser: {
              dataUrlCondition: {
                maxSize: 3*1024  //此时超过3k的会生成在img，以静态资源的形式引入
        				// 没有3k的会以 data uri的形式引入        
              }
            }
    }
    ```

  - ##### asset还可以处理字体：略 #####

    ```js
    {
      test: /\.(ttf|woff2?)$/,
      type: 'asset/resource',
        generator: {
          filename: "font/[name].[hash:3][ext]",
      }
    }
    ```

#### 4、配置：

* 问题一:只设置一个`test{/\.(jpg|png|gif)$/} ,loader:'url-loader'`,,默认处理不了html中img图片,html中仍然是`./src/img.jpg`

  解: 需要再引入`test:{/\.html$/}`,才可以,但是这时候解析时会出问题：html的图片路径编程`[object Module]`

* 问题二:html的图片路径变成`[object Module]`

  分析: 因为url-loader默认使用`es6模块化解析`，而html-loader引入图片是`commonjs`,所以解析时用的es6模块化解析,出现问题

  解决:关闭`options`中的url-loader的es6模块化,使用commonjs解析 `options:{esModule: false}` 

```js
module: {
    rules: [
      {
        // 问题：默认处理不了html中img图片
        // 处理图片资源        下载 url-loader file-loader
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader',
        options: {
          // 图片大小小于8kb，就会被base64处理
          // 优点: 减少请求数量（减轻服务器压力）
          // 缺点：图片体积会更大（文件请求速度更慢）
          limit: 8 * 1024,
          // 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs
          // 解析时会出问题：[object Module]
          // 解决：关闭url-loader的es6模块化，使用commonjs解析
          esModule: false,
          // 给图片进行重命名
          // [hash:10]取图片的hash的前10位
          // [ext]取文件原来扩展名
          name: '[hash:10].[ext]',
          outputPath: 'images/',   // 图片大于2048时， 将图片打包在images文件下
        }
      },
      {
        test: /\.html$/,
        // 处理html文件的img图片（负责引入img，从而能被url-loader进行处理）
        loader: 'html-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
```

### 3、babel

#### 1、babel简介 ####

- 为什么需要babel？

  虽然目前的脚手架帮助完兼容性处理。但是react会有jsx  ts es6这些对于浏览器默认不能识别。so希望产出为浏览器能够直接使用的，但是这些特性并不是所有浏览器都能识别的。而babel可做到

- babel是什么？

  它就是工具，本身不具备任何功能

##### **实验1：** #####

* index.js

```js
const title = 'front_end';
const foo = () => {
    alert(title)
}
foo()
```

* 修改配置导出工具

```js
mode: 'development',
output: {
   filename: 'js/build.js',
}
```

此时打包产物build.js，一大堆代码。但是可以看出，只是对JS代码做了拷贝 输出一份，没有做处理就，交给浏览器使用。因此**我们希望有人能够帮我们做这件事，就是babel**

##### 实验2-命令行的方式 #####

- babel是一个微内核结构**，核心操作都放在core里**，你只需要针对不同语法安装不同的包即可。

  ```js
  npm i @babel/core -d
  ```

- 但默认情况下，我们不能在命令行中安装使用的babel。怎么办呢？还需要安装@babel/cli。这样就可直接npx babel

  ```
  npm i @babel/cli -d
  ```

  ```
  npx babel src --out-dir build
  src:指定src下的所有文件   build 新建build文件夹，处理后的结果放在这里
  ```

- 打开build的文件夹的main.js文件。与原文件index.js一模一样。为什么babel为什么啥也没做呢？

  因为它只是工具。它只是能完成转换，但是具体啥转换，需要插件支持才可以。比如箭头函数 

  ```js
  npm i @babel/plugin-transform-arrow-functions -d  // 处理箭头函数
  npm i @babel/plugin-transform-block-scoping -d  //处理const
  ```

- 此时执行：

  ```js
  npx babel src --out-dir build --plugins=@babel/plugin-transform-arrow-functions
  
  // 同时完成箭头+const转换
  npx babel src --out-dir build --plugins=@babel/plugin-transform-arrow-functions,@babel/plugin-transform-block-scoping
  ```

- 生成的main.js中箭头函数就转换成了普通函数

#### 2、预设preset： ####

当前每次转换一类，都需要转换，因此提供了**预设。这样就不能每次配置了，它涵盖了大部分ES6的语法**

- 安装preset

  ```
  npm i @babel/preset-env -D
  ```

- 执行：此时就完成了转换

  ```
  npx babel src --out-dir build --presets=@babel/preset-env 
  ```

#### 3、babel-loader

##### 功能： #####

* babel-loader：解析es6的桥梁，需要通过插件翻译es5，如babel-perset
  * chrome浏览器对于ES6中的很多用法都做了底层实现，所以打包后的文件在chrome中打开ok，但如果在低版本的IE中打开就会出问题，因为他们根本就不认识这些ES6的代码，报错

  * 如果能把ES6转成ES5，就能让浏览器都能识别了，babe-laoder就做了这样的工作：ES6 --- ast ----ES5 ---低版本的补充
* babel-core: babel的核心库，识别js代码，把js代码部分解析成ast，有些新语法在低版本js中不存在的，如箭头函数，rest参数，通过ast语法转换器分析其语法后转换低版本js。
* babel-preset：代表一些类转码插件，提供预设，为es5转码。只能翻译一部分，所以还要babel-poly-fill
* babel-poly-fill: 转换babel preset没有的es6新特性，打包js会变大。
* transform-runtime:  babel-poly-fill 会污染全局变量，transform-runtime 转换es6时不会污染全局

##### 实验1:-文件配置方式

- 安装：npm i babel-loader -D

- 配置导出文件：

  ```js
  {
    test: /\.js$/,
      use: ['babel-loader']
  }
  ```

- 重新打包的dist：**什么都没做，如果想做。必须指明插件，指明参数**。so 导出文件需要重新配置

  ```js
  {
  	test: /\.js$/,
    use: [{
        loader: 'babel-loader',
        options: {
          plugins: [
            '@babel/plugin-transform-arrow-functions',
            '@babel/plugin-transform-block-scoping' 
          ]
        }
      }]
  }
  ```

- 同样，不想要全家桶式的不用每次专门配置，也可以使用预设，就可以放心大胆用：此时配置方式：

  ```js
  {
    test: /\.js$/,
    use: [{
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']   //需要提前安装
        }
      }
   ]
  }
  ```

  - 这里打包出来的文件，会与browserlist支持的兼容想关联的，比如当你配置的希望只兼容支持的浏览器是很高很新版本，此时babel-loader转出来的语法可能就是ES6最新的。

  - 还可以通过presets的参数的形式指定目标兼容：

    此时bebel-loader最终结果会 {targets: 'chrome 91'为主，但只对当前loader有用。建议在browserlist方便管理，

    ```js
    presets: [[
        '@babel/preset-env', 
        {targets: 'chrome 91'}]
    ]
    ```

##### babel专门配置文件

- 方式1：**babel.config.js**（json、cjc、mjs）  现在babel是多包管理的方式，babelcore只是一个微内核，一个仓库下面有很多功能，每个功能一个包。这样的配置方式更适合一些    **推荐**

- 方式2：babelrc.json （js） 在babel7之前用的较多，那时每个babel下边对应一个仓库，这样更符合

- 实验：

  - lg.config.js

    ```js
    {
      test: /\.js$/,
      use: ['babel-loader',]
    }
    ```

  - babel.config.js

    ```js
    module.exports = {
        presets: ['@babel/preset-env']
    }
    ```

#### 4、polyfill

##### 是什么？ #####

填充预设不能做的事。

* 假如在index.js中写了promise语法，我希望最终打包产出物中，**应该要考虑到**浏览器内部实现了promise，否则不能使用。所以，**polyfill就是能够实现这个功能的函数，能够对功能进行填充。**preset预设能帮我们做很多事情，但遇到Promise  generator 等更加新的语法时，可能不会做转换。而polyfill就会做这件事。

- 如果你不喜欢打包出来的文件是eval格式，可以在导出文件配置添加devtoo

  ```js
  entry: './src/index.js',
  mode: 'development',
  +devtool: false,
  ```

* 在4时，默认不做这些处理，已经加进去了。但这样打包后臃肿。5基于打包优化速度的考虑被移除，需要进行自己安装。

##### 实验：

- 安装：npm i @babel/ployfill --s

  - 安装后提示：如果要使用，不建议直接安装了，而是引用core下面的stable   regenerator-runtime

    tc39参与对ecma语法的制定，用core下面的stable是将已经制定的标准的加载进来。只要引进来，babel-loader就可以把功能填充过来。

    当我们需要promise等，其实是基于generator实现等，而 regenerator-runtime引进来也可以进行填充

- 卸载，polfill，安装这两个包：

  ```
  npm i core-js regenerator-runtime
  ```

- 配置babel单独配置文件：

  * useBuiltIns：

    * 打包的过程中，useBuiltIns帮助我们可以根据业务需求来注入polifill里面的内容。

    * 但你在开发一个内库、一个第三方模块的时候，组件库的时候，用这种注入是有问题的，它会通过全局变量的方式进行注入，会污染全局环境，

    * 所以如果你在打包一个UI组件库的时候，你需要换一种配置

  ```js
  module.exports = {
      // 为什么要给preset-env设置参数呢？
      // babel是工具，本身不干，转换es6语法需要告诉：兼容谁-browserc文件
      // 需要：找人完成真正的兼容  --插件的集合preset-env
      // 问题：preset-env不能完成所有功能转换 --polyfill
      
      presets: [
          // 传参时是以数组，一组组的
          [
              '@babel/preset-env',
              {
   // 取值： false默认、usage（根据用户源代码当中所使用到的新语法  按需填充）看代码不看浏览器
                 // 功能：FALSE：不对当前的JS做poll填充
                 // useBuiltIns: false
                
        //取值： usage（按需填充）：对版本有要求  默认2  如果安得是3 报错 ，so还需配置版本corejs
                  // useBuiltIns: 'usage',
                 //  corejs: 3
                
     //取值： entry: 依据所要兼容的浏览器进行填充 看浏览器不用代码
     // 比如要兼容10款浏览器，它不管代码里用没用  只要10个需要啥就填充啥
     //  安装后 需要手动import引入过来 否则会不生效
              }
          ]
      ]
  }
  ```

  - usage需要注意：开发时可能会用第三方的包，这个包可能也需要polyfill，假如它用了promise，我自己可能也用promise。so  我们需要加配置，去掉node_modules内的东西：

    ```js
    {
      test: /\.js$/,
      exclude: '/node_modules/',   // 不要对包ployfill
      use: ['babel-loader']
    }
    ```

##### 业务代码的使用场景：

```js
npm install @babel/core @babel/preset-env 
npm install --save @babel/polyfill

index.js 引入 import "@babel/polyfill";
```

```js
   {
      test: /\.js$/,
    	exclude: /node_modules/,  // 第三方库的文件是没有必要做这个的
      loader: "babel-loader",
      options: {
             "presets": [
               "@babel/preset-env", 
               { 
                 targets: {chrome: "67",},  // 比如chrome版本67以上的，不要做转化了
  // 用 babel-poly-fill 会转化所有低版本没有的es6语法，会加大打包文件大小。
// 用 { useBuiltIns: 'usage' }，仅转换使用的es6语法从而减小打包文件大小。可以不引入babel-poly-fill 该配置自动转换es6用的语法。
                useBuiltIns: 'usage'  //按需引入
               }
             ],   
           }
      }
```

##### 库项目代码，不存在全局污染 #####

* babel涉及的内容更深层次，甚至比webpack更多，源码里讲了这种转换过程是如何实现的
* 打包的过程中，useBuiltIns帮助我们可以根据业务需求来步入polifill里面的内容。但你在开发一个内库、一个第三方模块的时候，组件库的时候，用这种注入是有问题的，它会通过全局变量的方式进行注入，会污染全局环境，所以如果你在打包一个UI组件库的时候，你需要换一种配置

```js
npm install --save-dev @babel/plugin-transform-runtime
```

```js
  {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            options: {
                "plugins": [[
                        "@babel/plugin-transform-runtime",
                        {  //默认false，改为2需额外安包@babel/runtime-corejs2
                            "corejs": 2,
                            "helpers": true,
                            "regenerator": true,
                            "useESModules": false
                        }
                    ]
                ]
            }
        }
   * 配置 {corejs: 2 }作用有时Babel可能会在输出中注入一些相同的代码，因此可能会重复使用。使用类转换（没有松散模式）
      
  ③ 如果私有功能：可以使用babel-poly-fill
    如果是库功能：使用transfrom-runtime，来规避全局变量冲突。

  ④ 插件配置优化，单独提出公共文件 
    根目录里创建babelrc 文件  把options里面的代码都拿出来，放在这个文件里
    让插件config内容写入：
        {
            "plugins": [
                [
                  "@babel/plugin-transform-runtime",
                {
                  "corejs": 2,
                  "helpers": true,
                  "regenerator": true,
                  "useESModules": false
              }
            ]
          ]
      }
```

## 四、plugins ##

插件用来干什么呢？你如说，我们更改了配置项，就需要删除dist目录，重新打包生成编译产物，再运行；再比如我们每次打包完成后，每次都要手动修改，也比较麻烦。插件就能帮我们做这些

- 当有插件时，为什么还会有loader呢？

  核心功能不同

  - 对loader而言，它主要是对特定类型的（非JS）模块进行转换。而loader就承担了这些识别转换的功能。工作的时机就是读取某个特定类型的资源时

  - 而插件，可以做的更多。它同样存在自己的生命周期，我们可以认为打包的过程就是一个完整的流水线，那么当前的插件可以在流水线上的任一时机被插进来。比如说，我们希望在打包开始时做一些事情，或在打包进行到某一时机点做些事情，再比如希望写。而loader并不满足这种需求

### 1、clean-webpack-plugin ###

自动清除打包目录dist：让你不用每次手动清除

- 实验：

  - 本地安装：clean-webpack-plugin

  - 配置：一般plugin的书写：添加plugins

    ```js
    plugins: [
         // 将来在这里写的时候，就是一个plugin，
      // 每个plugin本质就是一个类：自己安装的插件 
      class myPlugin {
        // new 的时候会执行的方法
        constructor(){}
        // 允许传的时候传入参数this等
        apply(){}
      }
    ]
    ```

    配置：lg.config.js配置文件的导出文件

    ```js
    // 导入插件
    const {CleanWebpackPlugin} = require('clean-webpack-plugin');
    在导出配置中：
    plugins: [new CleanWebpackPlugin(), // 内部具体实现去看github官网]
    ```

### 2、html-webpack-plugin

- 实验：

  - 本地安装：html-webpack-plugin

  - 配置：lg.config.js配置文件的导出文件

    ```js
    const HtmlWebpackPlugin = require('html-webpack-plugin')
    
    plugins: [
      new CleanWebpackPlugin(), 
      new HtmlWebpackPlugin()
    ]
    ```

  - 打包出的index.html 中的title默认：Webpack App。默认的值与该插件中文档规定过有关，我们可以在new的时候传入参数，定义打包生成的index.html的信息

    ```js
    new HtmlWebpackPlugin({
      title: 'html-webpack-plugin自定义'
    })
    ```

  - 自定义index.html模板：比如说Vue中所有组件都需要挂载在#app的div上，so需要自定义的样式

    - 新建**public文件夹**，新建index.html文件

      ```js
      <title>
        <%= htmlWebpackPlugin.options.title %>  // 不能随便写或不写，不写传参不生效
        </title>
      </head>
      <div id="app">index.html测试</div>
      ```

    - 修改配置信息：

      ```js
      new HtmlWebpackPlugin({
        title: 'html-webpack-plugin自定义',
        // 希望打打包时找到自己的模板
        template: './public/index.html'
      }),
      ```

- 实验：希望实现像Vue那样的模板，引入资源：

  ```html
  <!DOCTYPE html>
  <html lang="en">
   // 这里的路径是常量
      <link rel='icon' href="<%= BASE_URL %>"favicon.ico></link>
      <title>
          <%= htmlWebpackPlugin.options.title %>
      </title>
  </head>
  <body>
      <div id="app">index.html测试</div>
  </body>
  </html>
  ```

  - webpack-define-plugin  内置插件：允许我们往插件中填充数据

    ```js
    const {DefinePlugin} = require('webpack')   // 内置
     
    // 内部可以定义常量，就是键值对
    // DefinePlugin配置完成后，会把我们设置的值原封不动拿出去
    // 将来如果我们希望以字符串的形式出去，还需要包一层引号
    new DefinePlugin({
    	BASE_URL: "'./'"   // 会去public目录下去查找
    })
    ```

  - 打包生成结果：

    ```html
    <!doctype html>
    <html lang="en">
    <link rel="测试icon" href="./" favicon.ico>  // 已生效
    <title>html-webpack-plugin自定义</title>
    <script defer="defer" src="/dist/build.js"></script>
    
    <body>
        <div id="app">index.html测试</div>
    </body>
    </html>
    ```

### 3、copy-webpack-plugin

##### 背景：

- 无论是自己使用webpack打包，还是基于脚手架  内部都有一个基于资源拷贝问题：public里面会存放很多资源，但不希望w对其做打包操作。只需要w打包后能够产生一个自定义的静态资源目录：将来可以将静态资源目录在服务器上部署。我们希望能将这部分直接拷贝过去
- 而之前的plugin，只是基于入口文件：src下的index.js生成一个静态HTML文件，但是文件里可能会通过src引入图标，文档等都不能进行处理。so  我们希望对静态资源做拷贝   copy-webpack-plugin

##### 实验

- 安装：npm i copy-webpack-plugin -d

- 配置：lg.config.js的plugin

  ```js
  const CopyWebpackPlugin = require('copy-webpack-plugin')
  
  new CopyWebpackPlugin({
              // patterns是数组，里面可以放很多项配置拷贝项
              patterns: [
                  {
                      from: 'public',
                      // to：默认不写，会自动找output配置中设计的目录
                  }
              ]
          })
  ```

  - 不能直接这样写，因为之前的webpack配置过  将public下的index.html作为模板拷贝到dist目录下，这里又去做了这样类似的事。因此，不是所有的东西都需要拷贝时，可以排除：

    ```js
     {
        from: 'public',
        // to：默认不写，会自动找output配置中设计的目录
        globOptions: {
          ignore: ['index.html']  //忽略不想拷贝的东西
        }
      }
    ```

  - 但仍然有问题：坑，当前 from: 'public',要求必须写**/

  - 遇到版本坑：打包时报错：HookWebpackError: Invalid host defined options  降级到9版本

    https://stackoverflow.com/questions/70080671/copy-webpack-plugin-error-invalid-host-defined-options

### 4、dev-sever ###

#### 1、背景： ####

当你的项目开发到一定阶段了，想调试。

- 做法1：

  - npm run build  产出静态资源到dist目录。此时dist下面有index.html，此时将它放在浏览器运行就可以了

  - 这是在使用file协议直接看，只要出现更新后，手动进行更新

    ```
    file:///Users/zhoumoling/kaifa/test/babel/dist/index.html
    ```

- 做法2：使用插件liver server  自动更新 不用手动刷新

  ```
  http://127.0.0.1:5500/dist/index.html
  ```

  此时接着修改代码，我希望能看到最新的修改效果。但是看不到，因为打包产物没有变。

so，希望有人能帮忙做到这样的事情：**当文件下面变更后，能自动帮我们完成编译，结合liver server 将生成的内容展示出来**

#### 2、实时打包更新 ####

##### 模式1：watch命令 #####

- 修改package.json：添加watch

  ```
  "scripts": {
      "build": "webpack --config lg.config.js --watch"
    },
  ```

- 此时它会监控项目下面的文件，只要打包的文件发生变化，就会自动重新打包，刷新页面就是最新生成的

- 但它不够好，我希望你不仅自动打包，**还能自动打开浏览器，还能模拟服务器上的特性**，它做不到 要借助---devserver

##### 模式2：配置文件 #####

- lg.config.js     

  ```js
  + watch: true,   //默认watch是fasle，这是出于性能的考虑。
  entry: './src/index.js',
  mode: 'development',
  devtool: false,
  ```


##### 不足分析：

分析：当前2种模式能实现更新，但不是效率最优。跟dev-server比还有不足：

- 这种模式需要watch+dev-server（webpack内置了dev-server）的加持，某个文件发生了改变都会使得webpack**重新编译所有代码**
- CleanWebpackPlugin：每次编译时都会帮我们去重新生成新的dist目录，将产物、静态资源写入。消耗性能
- liver server是vscode生态下的插件，不是webpack的
- 模块化开发需要很多组件，**当修改一小部分组件时，全部组件都更新，so不能实现局部刷新**。而webpack中给的**dev-server能做到局部刷新**

##### 模式3：devServer #####

- 配置package.json:

  ```js
   // 在5以后，这里需要将命令写全
  "serve": "webpack serve"
  // 如果不配置config  否则localhost访问的是当前项目的目录展示
  "serve": "webpack serve  --config lg.config.js"
  ```

- 配置文件中：w5中没有这些配置了

  ```js
  +devServer: {
     // contentBase：服务器要在哪个文件夹下开启，因为我们打包在dist下，所以这样写
    contentBase: "./dist",
    open: true,   //在运行npm run serve开启服务时， webpack-dev-server会被启动，open会自动的打开浏览器，自动的访问8080端口的内容
    port: 8000(默认端口8080，如果你想要修改，可以添加此配置)
  }
  ```

- 它同样是跟live server一样开启了一个静态服务，占用端口8080。当前目录下并没有产出dist目录，而是将数据都写入了内存中，内存的操作读写**速度更快**

- 遇到的问题：

  我index.js下写的东西并没有展示出来，修改也不会有所改变，这是为什么呢？

  Content not from webpack is served from '/Users/zhoumoling/kaifa/test/babel/public' directory

  https://stackoverflow.com/questions/42712054/content-not-from-webpack-is-served-from-foo

### 5、webpack-dev-middleware

可以用来追求自由度更高的模式，但在开发阶段使用过的较少：

#### 实验

- 实现逻辑：

  期望浏览器可以访问一个静态资源：比如8080端口，而这个服务是由middleware来开启这个服务。webpack会将其打包之后的内容交给服务器，服务器监听某个端口上的请求，如果浏览器往这个端口上发送了相应的请求，那就可以将这个结果返回给浏览器展示：

- 要解决问题1：怎么样开启一个服务？可以node-js。也可以借助框架。express

  ```
  npm i express@4.17.1 -d
  ```

- 要解决的问题2：怎样把webpack打包之后的结果交给server？

  框架中间件

  ```
  npm i webpack-dev-middleware@5.0.0 -d
  ```

```js
const express = require('express')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpack = require('webpack')

// 开启一个服务，帮我们加载中间件
const app = express();

// 让webapck可以打包:这个函数拿到配置参数后，会调用 ... 
// 返回compare对象，它控制weback的打包流程
// 1. 获取配置文件
const config = require('./lg.config.js')
const compiler = webpack(config)
// 2. 打包完成后，将结果交给server
app.use(webpackDevMiddleware(compiler))

app.listen(3000, () => {
    console.log('服务运行在3000端口上')
})
```

#### 实现一个dev-server：

* 创建webpack打包判断文件 

* 安装webpack中间件        npm i express webpack-dev-middleware -d

* 创建server.js：

  ```js
  const express = require('express');
  const webpack = require('webpack');       // 首先引入webpack库
  const webpackDevMiddleware = require('webpack-dev-middleware');
  
  const config = require('./webpack.config.js');
  ```

  ```js
  // 用webpack结合配置文件，随时进行代码的编译器，编译器执行一次就会编译一次
  const complier = webpack(config);
  const app = express();    // 通过express启动一个服务器
  // 通过webpack 中间件webpackDevMiddleware监听文件变化，然后重新执行打包 complier
  // 第2个参数是对象，只要文件发生改变了，重新输出文件就是config.output.publicPath
  app.use(webpackDevMiddleware(complier, {
    publicPath: config.output.publicPath
  }))
  app.listen(3000, () => {
    console.log('server is running');
  })
  ```

* package.json文件修改

  ```js
  "scripts": {
          // 当我运行npm run server的时候，我想自己写一个服务器。
          // 当监听到src下面的文件有改变，它会向dev-server重启一个服务器，更新网页内容
              "server": "node server.js"  
  },
  ```

## 五、性能优化 ##

### 0、总结 ###

#### webpack性能： ####

* 开发环境性能优化：

  ① 优化打包构建速度:HMR	

  ② 优化代码调试:source-map

* 生产环境性能优化

  ① 优化打包构建速度：oneOf、babel缓存、多进程打包、externals、dll

  ② 运行性能：缓存、tree shaking、code split、懒加载/预加载、pwa

### 1- HMR优化

#### 功能： ####

* 作用：在运行时更新各种模块，而无需进行完全刷新。极大的提升开发模式中构建速度

* 特点：

  * 之前打包后的文件都会放在dist目录上面
  * 但用webpack-dev-server后，为了让打包更快，是将打包后的文件放在内存中，实际上是有dist目录的

* 对于不同的文件：

  * 样式文件：**可以使用HMR功能:因为`style-loader`内部实现了**

  * js文件：默认不能使用HMR功能  需要`修改js代码`,添加支持HMR功能的代码

  * html文件：默认不能使用HMR功能，会导致问题:html文件不能热更新了
    解决：`修改entry入口`,将html文件引入(不用做HMR功能,毕竟现在流行单页面应用)

  * Vue\React：

    在Vue中，在写js文件的时候也从来不会去写上面那一坨代码，是因为vue-loader也已经帮我们做了。而React是借助了babel-preset，里面也内置了这种HMR的组件。但如果在项目中引入了一些比较偏的文件，比如说数据文件，这些文件的loader里并没有内置HMR效果，我们还需要手动写这样的代码。

#### 修改代码： ####

* 配置文件：

  ```js
   devServer:{
        contentBase:resolve(__dirname,'build'),//项目构建后路径
        compress:true, //启动gzip压缩
        open:true,//自动打开浏览器
        hot:true //开启HMR功能,注意:当修改了webpack功能,新配置想要生效,必须重启webpack
      }
  ```

* js进行HMR优化：

  注意:你要监听进行`热模块替换`,前提是你这个js要`在入口文件中导入`,然后入口文件中才能监听得到变化

  ```js
  import print from './print';
  import test from './test';
  
  if (module.hot) {
    // 一旦 module.hot 为true，说明开启了HMR功能。 --> 让HMR功能代码生效
    module.hot.accept(['./print.js','./test.js'], function() {
      //只有一个js文件需要监听打包就直接输入url字符串,不用数组
      
      // 假如有相关DOm操作，记得先移除上次的// document.body.removeChild(document.getElementById("number"), number())
        console.log("前提是你要在入口文件上导入,才能监听得到变化")
    });
  }
  ```

### 2- source-map 优化

#### 功能： ####

* 提供源代码到构建后代码映射 技术 （如果构建后代码出错了，通过映射可以追踪源代码错误）分为`内联`与`外部`:
* 内联和外部的区别：1. 外部生成了文件，内联没有 2. 内联构建速度更快

#### 不同环境选择: ####

* `开发环境`：考虑 速度快，调试更友好
  	① 速度快(eval>inline>cheap>...):  eval-cheap-souce-map > eval-source-map

  ​    ② 调试更友好: souce-map > cheap-module-souce-map > cheap-souce-map

  ​    ③ 最优选--> `eval-source-map`  > eval-cheap-module-souce-map

* `生产环境`：考虑 源代码要不要隐藏? 调试要不要更友好

  ​	 ① 内联会让代码体积变大，所以在生产环境不用内联

  ​     ② 考虑隐藏:nosources-source-map 全部隐藏 >hidden-source-map 只隐藏源代码，会提示构建后代码错误信息

  ​     ③ 综合考虑:source-map `or` cheap-module-souce-map

* 推荐：

  * dev环境: cheap-module-eval-source-map  提示错误全，打包速度快
  * prod环境: cheap-module-source-map    上线的代码不用映射，但是一旦线上出问题也能提示

#### 配置： ####

```js
module.exports = {
  entry: [],
  output: { },
  module: { rules: [] },
  plugins: [],
  mode: 'development',
  devServer: {},
   //选定映射模式
  devtool: 'eval-source-map'
};
```

### 3-oneOf ###

#### 功能： ####

* 正常来说,一个文件会被所有的loader过滤处理一遍

* 而使用`oneOf`后,而如果放在`oneOf`中的loader规则有一个匹配到了,`oneOf`中的其他规则就不会再对这文件匹配

* `注意`:oneOf中不能有两个loader规则配置处理同一种文件,否则只能生效一个 

  例如，对于js进行eslint检测后再进行babel转换

  解决：将eslint抽出到外部,然后优先执行,这样在外部检测完后`oneOf`内部配置就会再进行检测匹配

```js
rules: [
  {
    test: /\.js$/,    //将eslint抽出到外部
    exclude: /node_modules/, enforce: 'pre', loader: 'eslint-loader',
  },
  {
    // 以下loader只会匹配一个 // 注意：不能有两个配置处理同一种类型文件
    oneOf: [
      {
        test: /\.css$/,
        use: [...commonCssLoader]
      },
      {
        test: /\.less$/,
        use: [...commonCssLoader, 'less-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'usage',
                corejs: {version: 3},
                targets: {
                  chrome: '60',
                  firefox: '50'
                }
              }
            ]
          ]
        }
      }
```

### 4-缓存

缓存需要在`server环境`中才有效果 

#### 缓存类型 ####

1、babel缓存:

* 在`babel`的loader选项部分添加 `cacheDirectory: true` -->让第二次打包构建速度更快

2、文件资源缓存:

* 当你文件名不变时，会默认读取本地缓存。所以当你修改某个文件内容后，并不能实时更新到线上项目中
* 解决方法：在每次webpack构建时生成一个唯一的hash值加在文件名中，每次修改便改动文件名，达到更新效果。
* 而不同的hash也有不同效果,其中需要选用`contenthash`

#### contenthash ####

① hash：每次webpack构建时会生成一个唯一的hash值

​	问题：因为js和css同时使用`同一个hash值`，如重新打包，会导致所有缓存失效(即使只改动了一个文件)

② chunkhash：根据chunk生成的hash值，如果打包来源于同一个chunk，那么hash值就一样

​    问题：js和css的hash值还是一样**, 因为css时在js中被引入的,所以属于同一个chunk**

③ `contenthash`：根据文件的内容生成hash值，不同的文件hash一定不一样

​	-->让代码上线运行缓存更好使用(当你线上项目出现紧急BUG时,可以更快的修改)		  

#### 实验： ####

* webpack配置文件：

  ```js
  module.exports = {
    output: {
      filename: 'js/built.[contenthash:10].js',  //使用contenthash哈希值
      path: resolve(__dirname, 'build')
    },
    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env',
                   { useBuiltIns: 'usage', corejs: { version: 3 }, targets: {chrome: '60',firefox: '50'}} ]
                ],
                
                // 第二次构建时，会读取之前的缓存  // 开启babel缓存
                cacheDirectory: true
              }
            },
            
            }
          ]
        }
      ]
    },
    plugins: [   
        new MiniCssExtractPlugin({ filename: 'css/built.[contenthash:10].css' })
    ],
    mode: 'production',
  };
  ```

* server.js代码

  ```js
  const express = require('express');
  const app = express();
  // express.static向外暴露静态资源
  // maxAge 资源缓存的最大时间，单位ms
  app.use(express.static('build', { maxAge: 1000 * 3600 }));
  app.listen(3000);
  ```

### 5-tree shaking 

#### 概念： ####

* 移除 JS上下文中的未引用代码(dead-code)，不要引入所有的，只要需要的，减少代码体积
* 使用前提：
  1. 只支持ES module这种静态引入 如export 但不支持commonJS，require 动态引入
  2. 开启production环境 
  3. w4中,对于嵌套的代码,无法去除 

#### 使用： ####

* webpack.config.js配置：

  ```js
  optimization: {
     useExports: true    //打包使用部分
  },
  ```

* package.json

  ```js
  "sideEffects": false,// 禁止tree-shaking 处理不向外暴露方法的插件,将文件标记副作用
  ```

  * tree-shaking 会处理没有暴露方法的插件，如 @babel-poly-fill。会使打包报错。

    @babel-poly-fill 是在window上绑定es6语法 如window,pormise，不会向外暴露方法，不是直接导出模块的，treeshaking可能会误认为这个是用不到的，就不打包，会报错

  * 所以配置如下解决问题：

    ```js
    "sideEffects": ['@babel-poly-fill', '*css'] 
    // 或针插件配置如下：  tree-shaking不会处理该插件
    // 而如果你引入的是.css文件，也不会有导出文件，所以css文件也不要使用tree shaking
    ```

* 注意：

  * tree shaking中export used会表现出树摇之后引用的模块，而不是直接删掉没有引用的代码
  * 这是为了便于调试开发环境下的
  * 但如果是production，想打包上线的话，记得更改mode、sourcemap、也不用写optimization，树摇会自动生效
  * 重新打包后，此时线上的代码就是树摇之后的，已经剔除了不需要的代码

### 6-code split 

#### 1、多入口与单入口打包 ####

* 通常不使用这个方法,一般使用2、3的方法；

* 多入口：有一个入口，最终输出就有一个bundle

  ```js
  // entry: './src/js/index.js',       // 单入口
  entry: {
    // 多入口：有一个入口，最终输出就有一个bundle
    index: './src/js/index.js',
      test: './src/js/test.js'
  },
    output: {
      // [name]：取文件名
      filename: 'js/[name].[contenthash:10].js',
        path: resolve(__dirname, 'build')
    },
  ```

#### 2、splitChunks ####

* 可以将node_modules中代码单独打包一个chunk最终输出

* 自动分析多入口chunk中，有没有公共的文件。如果有会打包成单独一个chunk(多入口文件)

  ```js
  entry: {
    // 多入口：有一个入口，最终输出就有一个bundle
    index: './src/js/index.js',
      test: './src/js/test.js'
  },
    output: {
      // [name]：取文件名
      filename: 'js/[name].[contenthash:10].js',
        path: resolve(__dirname, 'build')
    },
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
   // 将当前模块的记录其他模块的hash单独打包为一个文件 runtime
   // 解决：修改a文件导致b文件的contenthash变化
    runtimeChunk: {
        name: entrypoint => `runtime-${entrypoint.name}`
      },
  },
  ```

#### 3、单入口文件 ####

单入口文件且想打包特定js文件为单独文件,在`2`的配置基础上再写js代码(入口改为单入口)

* ` 通过js代码`，让某个文件被单独打包成一个chunk，该代码写在入口js文件中

* `import动态导入语法`：能将某个文件单独打包

* `通过注释`,可以让js生成的打包文件带上这个名字，在`webpack5`中的`开发模式中可以不用注释加名字`,内部有 chunk 命名规则，不再是以 id(0, 1, 2)命名了，当然生产模式还是有必要的

```js
//通过注释,可以让js生成的打包文件带上这个名字
import(/* webpackChunkName: 'test' */'./test')  
  .then(({ mul, count }) => {
    console.log(mul(2, 5));
  })
  .catch(() => {
    console.log('文件加载失败~');
  });

console.log(sum(1, 2, 3, 4));
```

### 7- 懒加载、预加载

#### 场景： ####

* 当我们模块很多时，导入的js太多，或者有的js只有使用的时候才有用，而我一开始便加载，就可能造成一些不必要的性能浪费

* 懒加载：当文件需要使用时才加载

  `可能的问题`：当用户第一次使用时，如果js文件过大可能加载时间过长(有延迟)。

  但第二次就不会了，因为懒加载第二次是从缓存中读取文件

  ```js
  // import { mul } from './test';
  //懒加载
  document.getElementById('btn').onclick = function() {
      //懒加载其实也是需要前面Ⅵ代码分割功能,将我的需要加载的文件打包成单独文件
    import(/* webpackChunkName: 'test'*/'./test').then(({ mul }) => {
      console.log(mul(4, 5));
    });
  };
  ```

* 预加载 prefetch：等其他资源加载完毕，浏览器空闲了再偷偷加载

  * 正常加载可以认为时并行加载(同一时间加载多个文件，但是同一时间有上限)
  * 例如下面例子，有预加载的代码运行效果。页面刷新后，但还未进行使用时，该文件其实已经加载好了

  ​    `注意`：预加载虽然性能很不错，但需要浏览器版本较高，兼容性较差，`慎用预加载`


```js
// import { mul } from './test';  //预加载
//在注释参数上添加 webpackPrefetch: true 
  import(/* webpackChunkName: 'test', webpackPrefetch: true */'./test').then(({ mul }) => {
    console.log(mul(4, 5));
  });
```

### 8-externals

> 当你使用外部引入代码时:如`CDN引入`，不想他将我引入的模块也打包，就需要添加这个配置
>
> 即:声明哪些库是不进行打包的
>
> -->`externals`: {}

```js
module.exports = {
  externals: {
    jquery: 'jQuery'      // 拒绝jQuery被打包进来
  }
};
```

## 六、通用、开发、生产 ##

### 1、通用配置

* webpack.config.js  webpack的配置文件：

  作用: 指示 webpack 干哪些活（当你运行 webpack 指令时，会加载里面的配置）

  所有构建工具都是基于nodejs平台运行的~模块化默认采用commonjs。

```js
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'built.js',
    path: resolve(__dirname, 'build')
  },
  // loader的配置  loader: 1. 下载   2. 使用（配置loader）
  module: {
    rules: [
      // 详细loader配置,如样式打包修改这里
    ]
  },
  // plugins的配置  1. 下载  2. 引入  3. 使用
  plugins: [
    // 详细plugins的配置 如:html打包配置这里
  ],
  mode: 'development', // 开发模式
}
```

### 2、开发环境配置

```js
module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [{
        //1.1 处理less资源
        test: /\.less$/,
        use: [ 'style-loader','css-loader', 'less-loader' ]
      },
      {
        //1.2 处理css资源
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        //2.1 处理图片资源
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024,
          //压缩后的文件名   压缩后保留后缀名
          name: '[hash:10].[ext]',
          //关闭es6模块化
          esModule: false,
          //在built文件中输入位置,这里是放在build中的imgs文件夹中
          outputPath: 'imgs'
        }
      },
      {
        //2.2 处理html中的图片资源
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        //处理其他资源 先排除以下几个
        exclude: /\.(html|js|css|less|jpg|png|gif)/,
        loader: 'file-loader',
        options: { 
          name: '[hash:10].[ext]',// name 打包生成的hash串前10位，前名字 ext打包文件后缀
          outputPath: 'media' 
        }
        name: '[name].[ext]',   
        outputPath: './images'   // 打包后制定图片位置
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({//打包HTML文件
      template: './src/index.html'
    })
  ],
  mode: 'development',
  //热更新配置
  devServer: {
    contentBase: resolve(__dirname, 'build'),
    compress: true,
    port: 3000,
    open: true
  }
}
```