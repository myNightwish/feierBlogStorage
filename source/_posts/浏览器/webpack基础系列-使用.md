---
title: webpack基础-插件编写
tags: webpack
categories: 前端工程化
description: '为什么会有webpack,loader在做什么'
cover: https://cdn.jsdelivr.net/gh/myNightwish/CDN_res/Project/webpack-basic.png
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: 684607466
date: 2022-01-26 10:32:19
---

### Loader编写

#### 1、初始化项目： ####

- 初始化：npm init -y

  安装：npm i webpack@4.29.0 -d    npm i webpack-cli@3.2.1 -d

- 添加src目录下index.js文件：

  ```js
  console.log('hello feier')
  ```

- 添加配置文件：

  ```js
  const path = require('path');
  module.exports = {
      entry: './src/index.js',
      output: {
          filename: '[name].js',
          path: path.resolve(__dirname, 'dist')
      }
  }
  ```

- 修改package.json:

  ```js
  "build": "webpack"
  ```

  打包：打包生成产物：

  - 上面一坨是运行时需要的代码，而我们的代码被编译后，放在eval里。

#### 2、需求1： ####

- ##### 希望打包过程中，如果看到feier的字眼，就改成feizai。而loader就可以帮我们做到：

  - 写loader：新建loaders文件夹：新建replaceLoaders文件：

  ```js
  // loader就是一个函数：但不能写成箭头函数，因为要用this指向
  module.exports = function(source){
      return source.replace('feier', 'feizai');
  }
  ```

  - 用loader：

  ```js
      module: {
          rules: [{
              test: /\.js/,
              use: [
                  path.resolve(__dirname, './loaders/replaceLoaders.js') // 引入loader 
              ]
          }]
      }
  ```

  - 打包生成后，就变成了feizai

#### 3、loader传参1

- 配置文件：

  ```js
  use: [
    // path.resolve(__dirname, './loaders/replaceLoaders.js')
    {
      // 这里除了字符串，还可以配置一个对象
      loader: path.resolve(__dirname, './loaders/replaceLoaders.js'),
      options: {
        name: 'myNightwish'
      }
    }
  ]
  ```

- loader插件中：

  ```js
  module.exports = function(source){
      // 拿到传递的loader：但是它不是通过参数接收的，而是this
      // this中的query有很多参数
      return source.replace('feier', this.query.name);
  }
  ```

#### 4、loader传参2 ####

* 官方文档：https://webpack.docschina.org/api/loaders/

- Callback:

  ```js
  const result = source.replace('feier', this.query.name);
  // 假如我处理source之后，还想把source-map带出去，可以通过回调函数的形式
  this.callback(null, result);
  
  this.callback(
    err: Error | null,
    content: string | Buffer,
    sourceMap?: SourceMap,
    meta?: any
  );
  ```

### plugin编写

设计模式：发布订阅

#### 1、需求

打包结束后，希望生成版权文件：

- 初始化项目+安装+src

- 新建文件夹：plugins   新建文件：copyright-webpack-plugin

  ```js
  // 插件是一个类
  class CopyrightWebpackPlugin {
      constructor(options){
          console.log('插件被使用了', options.name)
      }
      // 当调用插件时，会调用apply方法：该方法参数compiler，可理解为webpack的实例
      apply(compiler){}
  }
  module.exports = CopyrightWebpackPlugin;
  ```

- 使用：

  ```js
  plugins: [ new CopyrightWebpackPlugin({name: 'myNightwish'})]
  ```

#### 2、版权插件功能

* 这里简单举例了同步钩子、异步钩子

  ```js
  // 插件是一个类
  class CopyrightWebpackPlugin {
      constructor(){
          console.log('插件被使用了')
      }
      // 当调用插件时，会调用apply方法：该方法参数compiler，可理解为webpack的实例
      apply(compiler){
          //1.  compiler是webpack实例，存储了各种打包相关的实例
         			 // 里面有hooks，生命周期钩子函数
          		 // emit：将打包之后的代码放入dist目录之前的操作  它是异步的
        compiler.hooks.emit.tapAsync('CopyrightWebpackPlugin', (compilation, cb) => {
              //2.  compilation存放的是与本次打包相关的内容
               // 本次打包生成的文件都生成在compilation.assets下面，so只需要在下卖弄加点东西就可
              compilation.assets['CopyrightWebpackPlugin.txt'] = {
                  source: function(){
                      return 'copyRight by myNightwish'
                  },
                  size: function(){
                      return 30;
                  }
              }
              console.log('emit钩子执行了', compilation.assets);
              cb();
          })
        	compiler.hooks.compile.tap('CopyrightWebpackPlugin', (compilation) => {
              console.log('compiler')
          })
      }
  }
  ```

#### 3、生命周期钩子

* 关于complation：https://webpack.docschina.org/api/compilation-hooks/
  - compilation 对象包含了当前的模块资源、编译生成资源、文件的变化等。
  - 当webpack在开发模式下运行时，每当检测到一个文件发生改变的时候，那么一次新的 Compilation将会被创建。从而生成一组新的编译资源。

* 关于钩子类型的描述，请查看 [Tapable 文档](https://github.com/webpack/tapable#tapable).

  ```js
  // ...  
  apply(compiler) {
      compiler.hooks.beforeCompile.tap("RemoveLogs", () => {
        console.log("The compiler before compile...");
      });
      compiler.hooks.compile.tap("RemoveLogs", () => {
        console.log("The compiler is starting compile...");
      });
      compiler.hooks.make.tap("RemoveLogs", () => {
        console.log("before done");
      });
      compiler.hooks.done.tap("RemoveLogs", () => {
        console.log("done!");
      });
    }
  // ...
  ```

#### 4、需求插件2： ####

* 功能：罗列出打包后的文件资源，并存储在readme.md文件中

  ```js
  class RemoveLogs {
    constructor(options) {
      this.options = options;
      this.filename = "";
    }
  
    apply(compiler) {
      // 这个为什么这样写呢？？？？？
      compiler.hooks.compilation.tap("FileListPlugin", compilation => {
        // compilation 创建之后执行
        compiler.hooks.emit.tap("FileListPlugin", () => {
          // 输出 asset 到 output 目录之前执行
          let content = "\r\n";
          console.log("资源列表及其size：");
          // compilation.assets 存放当前所有即将输出的资源
          Object.entries(compilation.assets).map(([pathname, source]) => {
            content += `— ${pathname}: ${source.size()} bytes\r\n`;
          });
  
          console.log(content);
          compilation.assets["README.md"] = {
            source() {
              return content;
            },
            size() {
              return content.length;
            }
          };
        });
      });
    }
  };
  ```

#### 5、需求插件3： ####

* 不太累计

  ```js
  module.exports = class RemoveLogs {
    constructor(options) {
        this.options = options;
        this.filename = "";
    }
  
    apply(compiler) {
        compiler.hooks.compilation.tap('GetFileNamePlugin', compilation => {
          compilation.hooks.chunkIds.tap('GetFileNamePlugin', (c) => {
              this.filename = Array.from(c)[0].name
          });
        });
      
        compiler.hooks.done.tap("RemoveLogs", compilation => {
          const { path, filename } = compilation.options.output;
          let filePath = (path + "/" + filename).replace(/\\[name\\]/g, this.filename); 
          fs.readFile(filePath, "utf8", (err, data) => {
              const rgx = /console.log\\(['|"](.*?)['|"]\\)/;
              const newData = data.replace(rgx, "");
            
              fs.writeFile(filePath, newData, function (err) {
                  if (err) return console.log(err);
                  console.log(filePath, "Logs Removed");
              });
          });
        })
    };
  }
  ```

### bundler编写

#### 1、初始化 ####

- src下新建index.js   message.js   word.js

  ```js
  // word.js
  const word = 'hello';
  export {word};
  
  // message.js
  import {word} from './word.js'
  // 注意我们现在没用webpack so要写后缀 
  const message = `say ${word}`;
  export {message};
  
  // index.js
  import {message} from './message.js'
  // 这里涉及到几个模块下的相互调用：
  // 此时浏览器根本不认识这种，此时需要一个类似webpack帮我们去实行项目的打包
  console.log('index.js中的：', message);
  ```

#### 2、分析入口文件 ####

- 新建bundler.js    模块分析文件

  ```js
  // 打包工具在这里写  它依赖于node  so记得提前安装喔
  // 1. 定义一个函数
  const muduleAnalyser = (filename) => {
  
  }
  // 2.最开始对入口文件做分析
  muduleAnalyser('./src/index.js');
  ```

- 实现1：读取入口文件，分析入口文件的代码

  * ast.program.body：

    第一个节点：ImportDeclaration  引入的声明    so它能帮我们找到声明的语句 我们可以根据对象找到依赖关系

    第2个节点：ExpressionStatement  表达式语句

  ```js
  const fs = require('fs');
  const parser = require('@babel/parser');
  
  const muduleAnalyser = (filename) => {
      // 1.1 读取文件出来,content就是文件本身内容
      const content = fs.readFileSync(filename, 'utf-8')
      console.log('content', content)
      // 1.2 提取引入文件：message.js  字符串截取不灵活
      // 引入一个第三发模块：npm i @babel/parser -d  可以帮助我们分析源代码
      const ast = parser.parse(content, {
          // 如果入口文件时es6 的引入方式，需要传入sourceType为module
          // 此时打印出来的就是抽象语法树
          sourceType: "module"
      })
      console.log(ast.program.body)
  }
  ```

- ImportDeclaration  自己写遍历麻烦，babel提供了npm i @babel/traverse --save 

  ```js
  // 1.3 分析语法树,参数2 遍历时需要找到什么类型的元素
      const dependencies = []; // 存遍历中遇到的依赖，但内部的value属性就可以得到引入的啥文件
      traverse(ast, {
          // 要写成函数，这个节点的内容里包含node
          ImportDeclaration({ node }){
              dependencies.push(node.source.value)
          }
      })
  ```

- 但我们打包时，dependcies存入的不应该是相对路径：[ './message.js', './word' ]，而是绝对路径，怎么办

  ```js
  const path = require('path');
  // 1.3 分析语法树,参数2 遍历时需要找到什么类型的元素
  const dependencies = []; // 存遍历中遇到的依赖，但内部的value属性就可以得到引入的啥文件
  traverse(ast, {
    // 要写成函数，这个节点的内容里包含node
    ImportDeclaration({ node }){
      // 拿到filename对应的文件夹路径
      const dirname = path.dirname(filename);
      const newPath = './'+path.join(dirname, node.source.value);
      dependencies.push(newPath);
    }
  })
  ```

- 修改dependencies  既可以存相对路径，又能存绝对路径

  ```js
  const dependencies = {};
  dependencies[node.source.value] = newPath;
  ```

* 因为打包后需要安装成可以在浏览器上运行的，so安装babel核心模块

  ```js
  npm i @babel/core -d
  ```

  ```js
  // 1.4 babel的transformFromAst可以将ast语法树转化成浏览器可以识别的语法
      // 里面有code字段，它就是浏览器编译运行的可以在浏览器上生成运行的代码
      const {code} = babel.transformFromAst(ast, null, {
          // 转换过程中，可以用的东西 npm i @babel/preset-env -d
          presets: ['@babel/preset-env']
      })
      return {
          filename,
          dependencies,
          code
      }
  ```

#### 3、总结：

* 当我们做一个项目的打包时，w会对模块做分析。

  ```js
  const fs = require('fs');
  const parser = require('@babel/parser');
  const traverse = require('@babel/traverse').default;
  const path = require('path');
  const babel = require('@babel/core');
  
  const moduleAnalyser = (filename) => {
      const content = fs.readFileSync(filename, 'utf-8');
      const ast = parser.parse(content, {
          sourceType: "module";
      })
      const dependencies = {}; 
      traverse(ast, {
          ImportDeclaration({ node }){
              const dirname = path.dirname(filename);
              const newPath = './'+path.join(dirname, node.source.value);
              dependencies[node.source.value] = newPath;
          }
      })
      const {code} = babel.transformFromAst(ast, null, {
          presets: ['@babel/preset-env'];
      })
      return {
          filename,
          dependencies,
          code
      }
  }
  module.exports = moduleAnalyser('./src/index.js');
  ```

#### 4、依赖图 ####

* 对整个项目的文件进行依赖分析：

  ```js
  // 1. 依赖图谱：存储所有模块的模块信息
  const makeDependenciesGraph = function(entry){}
  
  graphInfo= makeDependenciesGraph('./src/index.js');
  ```

  ```js
  // 1. 依赖图谱：存储所有模块的模块信息
  const makeDependenciesGraph = function(entry){
      const entryModule = moduleAnalyser(entry);
      // 1.1 对所有的依赖分析:队列遍历
      const graphArr = [entryModule];
      for(let i = 0; i<graphArr.length; i++){
          //1.2 拿出这个模块
          const item = graphArr[i];
          // 1.3 拿出这个依赖
          const { dependencies } = item;
          // 1.4 对对象里的文件进一步做分析
          if(dependencies){
              // 存储时，存的是对象，递归分析
              for(let j in dependencies){
                  graphArr.push(moduleAnalyser(dependencies[j]))
              } 
          }
      }
      // 2. 此时就拿到了这个图谱数组：但打包后为了方便处理，还要格式转换 
      const graph = {};
      graphArr.forEach(item => {
          graph[item.filename] = {
              dependencies: item.dependencies,
              code: item.code
          }
      })
    return graph;
  }
  
  graphInfo= makeDependenciesGraph('./src/index.js');
  ```

#### 5、生成代码 ####

- 现在已经拿到所有模块的代码生成结果。目标：借助dependiencies生成真正可以在浏览器上运行的代码

  ```js
  const generateCode = entry => {
      const graph = JSON.stringify(makeDependenciesGraph(entry));
      // 1.1 最终生成的代码，实际上是字符串
      // 1.2 网页中的所有代码应该放在一个闭包里执行，避免污染全局环境
      // 1.6 现在graph中的代码中有require、exports对象，但是浏览器不识别，所以还需要转换：构造require、exports
      return `(function(graph){
          function require(module){
              function localRequire(relativePath){
                  return require(graph[module].dependencies[relativePath])
              }
  
              var exports = {};
              (function(require, exports, code){
                  eval(code)
              })(localRequire, exports, graph[module].code)
              return exports;
          }
          require('${entry}')
      })(${graph})`
      // 1.3 注意这里不能直接${graph}  不然打印出来就是[object object] 对象会被toString方法
      // 1.4 so 传入之前要stringfy
  }
  const code = generateCode('./src/index.js');
  console.log(code)
  ```

- 将code粘贴到控制台，即可执行