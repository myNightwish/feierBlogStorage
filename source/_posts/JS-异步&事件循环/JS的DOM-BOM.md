---
title: JS的DOM+BOM
tags:
  - DOM
  - BOM
categories: JS
description: JS的DOM、BOM、事件
cover: >-
  https://images.unsplash.com/photo-1639297221211-d95dfe290342?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=327&q=80
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: 2292260110
date: 2021-12-13 16:58:15
---
## DOM ##

### 1、DOM概念、组成 ###

#### 1、概念 ####

* 文档对象模型，是W3C的标准，该标准中，定义了页面的结构、表现、行为；DOM是独于平台和语言的接口，它允许程序和脚本动态地访问和更新文档的内容、结构和样式
* 它是针对xml经过扩展用于html的应用程序编程接口，我们又叫API；
* DOM把整个页面映射为一个多层的节点结构，html或xml页面中的每个组成部分都是某种类型的节点，这些节点又包含着不同类型的数据

#### 2、为什么操作DOM昂贵 ####

* ES和 DOM是两种东西，每次连接都需要消耗性能：

  浏览器中通常把二者独立实现，使得**二者相互独立**，**JS与DOM每次连接都需要消耗性能**

  所以有了**每操作一次DOM就多做点事**的理念，尽可能以最少的次数处理最多的DOM操作

* 而修改DOM更昂贵，因为首先得访问Dom

  操作DOM会导致重排和重绘，重排会占用、消耗**CPU**; 重绘会占用、消耗**GPU**

#### 3. 智能“节流”操作DOM ####

* 实现队列化修改，批量执行：

  * 浏览器会有一个“队列”，用以存放（攒着）需要操作DOM的js程序。每当执行一次js操作dom的代码，这个队列里就先暂存一个程序。
  * 等到一段时间后，浏览器再集中、批量的链接一次"ES岛"和"DOM岛"（就是让JS引擎去链接渲染引擎），进而触发一次DOM操作。“过一段时间发一班车”

* 但我们如果误操作打断浏览器的“节流”步骤。迫使浏览器中断当前的“等待”，去赶紧、立马进行一次dom操作。让浏览器赶紧执行完他攒在“队列”里的JS操作DOM的程序后返回最新的DOM位置信息给我们

* **减少在循环内进行DOM操作，在循环外部进行DOM缓存**

  ```js
  //优化前代码
  function Loop() {
     console.time("loop1");
     for (var count = 0; count < 15000; count++) {
         document.getElementById('text').innerHTML += 'dom';
     }
     console.timeEnd("loop1");
  }
  //优化后代码
  function Loop2() {
      console.time("loop2");
      var content = '';
      for (var count = 0; count < 15000; count++) {
          content += 'dom';
      }
      document.getElementById('text2').innerHTML += content;
      console.timeEnd("loop2");
  }
  ```

* **只控制DOM节点的显示或隐藏，而不是直接去改变DOM结构**

  ```js
  <div class="staff-list" :class="list">
     <ul class="staff-list-ul">
         <li v-for="item in staffList" v-show="isShow($index)">
             <div>item.staff_name | addSpace </div>
             <div class="staff_phone">item.phone_no </div>
         </li>
     </ul>
  </div>
  上面代码的优化原理即先生成所有DOM节点，但是所有节点均不显示出来，利用vue.js中的v-show，根据计算的随机数来控制显示某个<li>，来达到文字滚动效果。
  ```

* **操作DOM前，先把DOM节点删除或隐藏**

  ```js
  var list1 = $(".list1");
  list1.hide();
  for (var i = 0; i < 15000; i++) {
      var item = document.createElement("li");
      item.append(document.createTextNode('0'));
      list1.append(item);
  }
  list1.show();
  ```

  display属性值为none的元素不在渲染树中，因此对隐藏的元素操作不会引发其他元素的重排。如果要对一个元素进行多次DOM操作，可以先将其隐藏，操作完成后再显示。这样只在隐藏和显示时触发2次重排，而不会是在每次进行操作时都出发一次重排。

* **最小化重绘和重排**

  ```
  //优化前代码：每对element进行一次样式更改都会影响该元素的集合结构，最糟糕情况下会触发三次重排。
  var element = document.getElementById('mydiv');
  element.style.height = "100px";  
  element.style.borderLeft = "1px";  
  element.style.padding = "20px";
  ```

  ```
  //优化后代码：利用js对该元素的class重新赋值，获得新的样式，这样减少了多次的DOM操作
  //js操作
  .newStyle {  
      height: 100px;  
      border-left: 1px;  
      padding: 20px;  
  }  
  element.className = "newStyle";
  ```

### 2、文档类型历史 ###

#### 1、定义： ####

* **SGML ：**标准通用标记语言，是所有电子文档标记语言的起源    1985
* **HTML：**超文本标记语言，它定义了网页内容的含义和结构。用途：结构化信息（段落、表格），描述文档的外观、语义                     1993
* **XML：**可扩展标记语言，和 HTML 的最大区别就在于 XML 的标签是可以自己创建的，数量无限多，而 HTML 的标签都是固定的而且数量有限                 1998
* **XHTML ：**基于 XML 的标记语言，他与 HTML 没什么本质的区别，但他更严格

#### 2、XHTML  ####

为了规范 HTML，W3C 结合 XML 制定了 XHTML1.0 标准，与 HTML 4.01 几乎是相同的，按照 XML 的要求来规范 HTML，两者最主要的区别：

* 文档顶部 doctype 声明不同，XHTML 的 doctype 顶部声明中明确规定了xhtml DTD的写法
* XHTML 元素必须被正确地嵌套。
* XHTML 元素必须被关闭。
* 标签名必须用小写字母，标签必须成双成对：标签名和属性对大小写敏感
* XHTML 文档必须拥有根元素：所有的 XHTML 元素必须被嵌套于 <html> 根元素中
* 属性值必须用双引号 `""` 括起来

### 3、DOM节点 ###

#### 1、节点的概念 ####

* 可以将任何HTML描绘成一个由多层节点构成的结构，节点分为12种不同类型
* 每种类型分别表示文档中不同的信息及标记，每个节点都拥有各自的特点、数据和方法，也与其他节点存在某种关系
* 节点之间的关系构成了层次，而所有页面标记则表现为一个以特定节点为根节点的树形结构

#### 2、HTML的DOM节点 ####

1. 元素节点：<html>、<body>、<p>等都是元素节点，即标签。
2. 文本节点:向用户展示的内容，如<li>...</li>中的JavaScript、DOM、CSS等文本。
3. 属性节点:元素属性，如<a>标签的链接属性href

#### 3、节点类型 ####

* DOM1级定义了一个Node接口，它在javascript中是作为Node类型来实现的；
* 每个节点都有一个nodeType属性，用于表明节点的类型
* 通过定义数值常量和字符常量两种方式来表示，IE只支持数值常量
* 节点类型一共有12种，常用7种：

​    [<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/4/5/c09202a794fc92f73181eaa8aab51d95~tplv-t2oaga2asx-watermark.awebp" alt="img" style="zoom:50%;" />](https://link.juejin.cn?target=https%3A%2F%2Fcamo.githubusercontent.com%2F0c63f3fd6ccb91445ac1149b2ad3c109135c87c6%2F687474703a2f2f7777312e73696e61696d672e636e2f6d773639302f6165343962613537677931666539727a316c6b32776a323068613037327462772e6a7067)<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/4/5/b0622da786234b4efda4820c4bc6d57a~tplv-t2oaga2asx-watermark.awebp" alt="img" style="zoom: 50%;" />

##### 1、Element(元素) #####

* 它表示了html、xml文档中的元素。通常元素因为有**子元素**、**文本节点**或者两者的结合；

* 元素节点是唯一能够拥有属性的节点类型

* **`html`、`head`、`meta`、`title`、`body`、`div`、`ul`、`li`、`script`都属于Element(元素节点);**

* #### 操作元素属性： ####

  * getAttribute()：实际中主要用于获取自定义属性
    * 元素的style属性，自定义属性，返回的是css文本
    * 元素的事件属性：onclick事件处理程序，属性值是一段JS代码，返回代码字符串
  * setAttribute(A,B)：设置特性
  * removeAttribute()：删除特性

* #### 所有节点类型共享了两个方法： ####

  * 克隆节点

    ```
    node.cloneNode(false/true)
    //返回改调用节点的副本。括号内参数为true是深度拷贝，为空格或false则是浅拷贝。
    ```

    * 参数true：表示深复制，复制节点及整个子DOM树
    * false：浅复制，只复制该节点，没有子节点，没有指定父节点，称作孤儿节点
    * 该方法只复制HTML属性，而不复制事件处理程序，但IE会，这是个bug，它复制前要先删除事件

  * normolize()：处理文档子树中的文本节点，相邻同胞节点合为一个文本节点，删除空文本节点等

##### 2、Attr(属性) #####

* 代表了元素中的属性；
* 因为属性实际上是附属于元素的，因此属性节点不能被看做是元素的子节点，因而在DOM中属性没有被认为是文档树的一部分
* 也就是说：属性节点其实被看做是包含它的元素节点的一部分，它并不作为单独的一个节点在文档树中出现
* `lang`、`charset`、`id`、`class`都属于Attr(属性节点);

##### 3、Text(文本) #####

* 是只包含文本内容的节点；
* 它可以由更多的信息组成，也可以只包含空白。
* 在文档树中元素的文本内容和属性的文本内容都是由文本节点来表示的
* `DocumentFragment文档片段节点`、`test1`、`test2`、`元素节点之后的空白区域`都属于Text(文本节点)

##### 4、Comment(注释)  略 #####

##### 5、DocumentType(文档类型) #####

* 每一个Document都有一个DocumentType属性，它的值或者是null，或者是DocumentType对象。比如声明文档类型时<!doctype html>就是文档类型节点
* ！**`DOCTYPE html`** 就属于DocumentType(文档类型节点);

##### 6、DocumentFragment(文档片段) #####

*  是轻量级的或最小的Document对象，它表示文档的一部分或者是一段，不属于文档树
*  它有一个特殊的行为：
   1. 把一个DocumentFragment节点插入到文档的时候，插入的不是DocumentFragment自身，而是它的所有的子孙节点
   2. 这使得DocumentFragment成了有用的占位符，暂时存放那些一次插入文档的节点，同时它还有利于实现文档的剪切、复制和粘贴等操作
*  **例子中的:`var frag = document.createDocumentFragment();`就属于DocumentFragment(文档片段节点);**

#### 4、特殊的文档节点document ####

##### 位置：是文档树的根节点，是文档中其他所有节点的父节点； #####

1. 在浏览器中，文档对象 document 是HTMLdocument的一个实例，表示**整个HTML页面**

2. 也是**window对象的一个属性**，因此是一个全局对象

3. !Doctype html、html作为Document(文档节点)的子节点出现;

   ```
   document.documentElement：指向<html>元素
   document.body：指向<body>元素
   document.doctype获取到文档中独立的部分：<!doctype>
   ```

##### 2、【注意】 #####

1. 文档节点并不是html、xml文档的根元素，因为在xml文档中，处理指令、注释等内容可以出现在根元素之外
2. 所以我们在构造DOM树的时候，根元素并不适合作为根节点，因此就有了文档节点，而根元素是作为文档节点的子节点出现的

* Document 类型的节点有以下特征：
  * nodeType 等于 9； 
  * nodeName 值为"#document"； 
  * nodeValue 、parentNode 、ownerDocument值为 null；
  * 值为 null； 
  * 子节点可以是 DocumentType（最多一个）、Element（最多一个）、ProcessingInstruction 或 Comment 类型

##### 功能1：提供文档信息 #####

* 提供浏览器所加载网页的信息，所有这些信息都可以在请求的 HTTP 头部信息中获取，只是在 JS 中通过这几个属性暴露出来
  * title：过这个属性可以读写页面的标题，修改后的标题也会反映在浏览器标题栏上。不过，修改 title 属性无效
  * URL：包含当前页面的完整 URL（地 址栏中的 URL）
  * domain ：含页面的域名（唯一可设置的）
  * referrer：包含链接到当前页面的那个页面的 URL，如 果当前页面没有来源，则 referrer 属性包含空字符串

##### 功能2：查找元素节点 #####

##### 功能3：文档写入 #####

document对象有向**网页输出流**写入内容的能力，write()、 writeln()、open()和 close()

* document.write():向一个已经加载，并且没有调用过 [`document.open()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/open) 的文档写入数据时，会自动调用 `document.open`。一旦完成了数据写入，建议调用 [`document.close()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/close)，以告诉浏览器当前页面已经加载完毕。写入的数据会被解析到文档结构模型（DOM）里。
* document.onload()：**页面包含图片等文件在内的所有元素都加载完成**，即页面加载完毕执行的事，会有覆盖性

##### 功能4：创建元素 #####

* ##### document.createElement()： #####

  创建元素节点，参数为要创建元素的标签名，div、h2等,要把元素，通过appendChild等操作节点的方式添加到文档树上，才能在浏览器中渲染出来

- ##### document.createTextNode()： #####

  创建文本节点，参数为要插入的字符串

### 4、增删改查元素节点 ###

#### 4.1、通过选择器查找 ####

```
根据CSS选择器去页面中查询一个元素，如果匹配到的元素有多个，则它会返回查询到的第一个元素：
document.querySelector('selector') 

根据CSS选择器去页面中查询一组元素，会将匹配到所有元素封装到一个数组中返回，即使只匹配到一个
document.querySelectorAll('selector)

获取或设置HtmL
elem.innerHTML(HTML片段)
elem.textContent(纯文本内容)
```

#### 4.2 通过document对象调用 ####

```
html  docunment.documentElement   获取页面中html根元素
head  document.head
body  document.body = document.getElementsByTagName("body")[0];  
document.all  =  document.getElementsByTagName("*") 获取页面中的所有元素

document.getElementById('id')
document.getElementsByTagName('p')
document.getelementsByName('text')
document.getElementsByClassName('userClass')
```

#### 4.3、通过元素节点关系 ####

* 节点的层次关系：

  <img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/4/5/4ed4cb033ac7ecd2b1f921d896eff506~tplv-t2oaga2asx-watermark.awebp" alt="img" style="zoom: 67%;" />

```
 查找节点：
 elem.parentNode 查找elem的父节点
 elem.childNodes 找elem的所有直接子节点
 elem.firstChild 找elem的第一个直接子节点
 elem.lastChild 找elem的最后一个直接子节点
 elem.previousSibling 找elem的前一个兄弟
 elem.nextSibling 找elem的下一个兄弟
 查找元素：
 elem.parentElement 找父元素
 elem.children 找所有直接子元素
 elem.firstElementChild 第一个直接子元素
 elem.lastElementChild 最后一个直接子元素
 elem.previousElementSibling 前一个兄弟元素
 elem.nextElementSibling 下一个兄弟元素
```

#### 4.4、增加、删除、修改元素节点 ####

**先获取父节点，并有子节点，再操作其子节点**

```
1、创建节点
	document.creatElement('tagName')
	document.createTextNode("xxx")创建文本节点
	
2、增加节点
	1. 尾部添加：node.appendChild(A)：
	2. 插入添加：node.insertBefore(新节点,旧节点)；在node的孩子节点B前面，插入A节点
	
3、删除节点
	node.removeChild(子节点)：移除node的A节点
	推荐方式：子节点.parentNode.removeChild(子节点)**  
	
4、替换节点
	node.replaceChild(新节点,旧节点)：用A节点替换B节点
```

### 5、JS操作Dom修改样式属性 ###

#### 1、读取、修改内联样式：   ####

```
获取：元素节点.style.样式名 
修改：元素.style.样式名 = 样式值
```

【注意】：

1.  **通过style修改和读取的样式都是内联样式**，由于内联样式的优先级比较高，所以通过JS来修改的样式，往往会立即生效
2.  **但是如果样式中设置了!important，则内联样式将不会生效。**

#### 2、读取元素的当前样式 ####

* #### getComputedStyle(元素节点， 一般null) ####

  ```
  getComputedStyle(box, null)["width"]; 
  ```

  * 是window对象的方法，可以返回一个对象，这个对象中保存着当前元素生效样式
  * 该方法读取到样式都是只读的不能修改

* #### window对象的方法 ####

  ```js
  alert
  setInterval、setTimeout、clearInterval、clearTimeout
  scrollBy、scrollTo、resizeBy、resizeTo
  ```

#### 3、样式相关属性 ####

以下样式都是只读的,未指明偏移量都是相对于当前窗口左上角 

```
clientHeight、clientWidth： 元素的可见高/宽度，包括元素的内容区和内边距的高度  

scrollHeight、scrollWidth：  获取元素滚动区域的高度和宽度 
scrollTop、scrollLeft：      获取元素垂直和水平滚动条滚动的距离 

offsetHeight、offfsetWidth：  整个元素的高度，包括内容区、内边距、边框
offsetLeft、offsetTop： 当前元素和定位父元素之间的偏移量

offsetParent：  当前元素的定位父元素、离他最近的开启了定位的祖先元素，如果所有的元素都没有开启定位，则返回body
```

```
判断滚动条是否滚动到底  
 垂直滚动条  
	scrollHeight -scrollTop = clientHeight  
	  
 水平滚动	  
	scrollWidth -scrollLeft = clientWidth	
```

### 6、DomReady ###

#### 1、基本概念 ####

* **domReady**：
  1. 操作DOM的时候，要先确保HTML解析工作已经完成，否则，拿不到DOM节点；
  2. 指的是DOM树构建完毕，也就是HTML解析第一步完成。节点是以树的形式组织的，当页面上所有的html都转换为节点以后，就叫做domReady；

#### 2、实现策略 ####

##### 1、body标签最后 #####

* 浏览器是从上到下，从左向右渲染元素的，这样实例中的js代码一定在domReady之后去执行的

* 但为什么很少用？

  在实际项目中，js文件往往非常多，而且之间会相互调用，大多数都是外部引用的，不把js代码直接写在页面上。

  这时候就不能自由地去调用jS了，就需要一个domReady，不管逻辑代码写在哪里，都是等到domReady之后去执行的

##### 2、window.onload方法： #####

* 表示当页面**所有的元素**都加载完毕，并且**所有要请求的资源也加载完毕**才触发执行；
* 在文档外部资源不多的情况下不会有什么问题，但当页面中有**大量远程图片或要请求的远程资源时**：
  1. 需要让js在点击每张图片时，进行相应的操作；
  2. 如果此时外部资源还没有加载完毕，点击图片是不会有任何反应的，大大降低了用户体验。

##### 3、DOMContentLoaded 事件： #####

为了解决window.onload的短板，w3c 新增了一个 DOMContentLoaded 事件。

* 不支持的就用来自Diego Perini发现的著名Hack兼容。兼容原理大概就是通过IE中的document，
  documentElement.doScroll('left')来判断DOM树是否创建完毕

  ```js
  function myReady(fn){  
      //对于现代浏览器，对DOMContentLoaded事件的处理采用标准的事件绑定方式  
      if ( document.addEventListener ) {  
          document.addEventListener("DOMContentLoaded", fn, false);  
      } else {  
          IEContentLoaded(fn);  
      }  
      //IE模拟DOMContentLoaded  
      function IEContentLoaded (fn) {  
          var d = window.document;  
          var done = false;  
    
          //只执行一次用户的回调函数init()  
          var init = function () {  
              if (!done) {  
                  done = true;  
                  fn();  
              }  
          };  
          (function () {  
              try {  
                  // DOM树未创建完之前调用doScroll会抛出错误  
                  d.documentElement.doScroll('left');  
              } catch (e) {  
                  //延迟再试一次~  
                  setTimeout(arguments.callee, 50);  
                  return;  
              }  
              // 没有错误就表示DOM树创建完毕，然后立马执行用户回调  
              init();  
          })();  
          //监听document的加载状态  
          d.onreadystatechange = function() {  
              // 如果用户是在domReady之后绑定的函数，就立马执行  
              if (d.readyState == 'complete') {  
                  d.onreadystatechange = null;  
                  init();  
              }  
          }  
      }  
  }
  ```

### 7、DOM节点继承层次 ###

#### 1、DOM节点继承层次 ####

* #### 为什么操作DOM耗费性能？ ####

  对DOM节点每一个属性的访问，有时候可能会向上向上溯寻到N多个原型链，因此DOM操作是个非常耗性能的操作；

  前端框架提出了虚拟DOM的概念，合并和屏蔽了很多无效的DOM操作

#### 2、元素节点（Element）的创建过程 ####

举例**创建一个p元素一共溯寻了7层原型链：**

1. 使用document.createElement("p")创建p元素

2. document.createElement("p")是HTMLParagraphElement的一个实例；

3. HTMLParagraphElement的父类是HTMLElement

4. HTMLElement的父类是Element

5. Element的父类是Node

6. Node的父类是EventTarget

7. EventTarget的父类是Function

8. Function的父类是Object

   <img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/4/5/4c794f63d00b456f059056c4d3db3fa3~tplv-t2oaga2asx-watermark.awebp" alt="img" style="zoom:33%;" />

* #### 查看document.createElement("p")自身属性： ####

  ##### 遍历对象属性方法3种： #####

  1. for-in循环:会遍历对象自身的属性,以及原型属性,包括enumerable 为 false(不可枚举属性);
  2. Object.keys():可以得到自身可枚举的属性，但得不到原型链上的属性;
  3. Object.getOwnPropertyNames():可以得到**自身所有的属性(**包括不可枚举),但得不到原型链上的属性,Symbols属性

#### 3、文本节点（Text）的创建过程 ####

举例**创建一个文本节点一共溯寻了6层原型链**：

1. 使用document.createTextNode("xxx")创建文本节点；
2. document.createTextNode("xxx")是Text的一个实例
3. 而Text的父类是CharactorData --- CharactorData的父类是Node
4. Node的父类是EventTarget  ---- EventTarget的父类是Function
5. Function的父类是Object

​    [<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/4/5/23bec759f6a82d45f491c8d96ca36406~tplv-t2oaga2asx-watermark.awebp" alt="img" style="zoom:33%;" />](https://link.juejin.cn?target=https%3A%2F%2Fcamo.githubusercontent.com%2F562ed479af47c93aa1579ab297326c74bec35e7d%2F687474703a2f2f7777312e73696e61696d672e636e2f6c617267652f6165343962613537677931666561347368657332676a32306979306b38646b332e6a7067)



【注意】：所有节点的继承层次都不简单，但相比较而言，元素节点是更可怕的。从HTML1升级到HTML3.2，再升级到HTML4.1，再到HTML5。除了不断地增加新类型、新的嵌套规则以外，每个元素也不断的添加新属性。

#### 4、空的div元素的自有属性 ####

* 空的div元素，并且没有插入到DOM里边，看它有多少自有属性（不包括原型链继承来的属性）

  <img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/4/5/b8a4c92310facfc3b40671b9f8e7db18~tplv-t2oaga2asx-watermark.awebp" alt="img" style="zoom:25%;" />

* 在新的HTML规范中，许多元素的固有属性（比如value）都放到了原型链当中，数量就更加庞大了

* 而框架：比如MVVM框架，将所有的DOM操作都转交给框架内部做精细处理，包括虚拟DOM

## 事件 ##

### 1、事件、事件流 ###

* 事件三要素：事件源、事件类型、事件处理程序
* 事件流：事件传递时在元素节点之间按照特定的顺序传播，描述了页面接收事件的顺序。IE（事件冒泡）和网景（事件捕获）提出了相反的事件流方案

### 2、事件对象 ###

#### 1、概念： ####

1. 在 DOM 中发生事件时，所有相关信息都会被收集并存储在一个名为 **event** 的对象中

2. 这个对象包含了一些基本信息，比如导致事件的元素、发生的事件类型等；

3. event 对象**只在事件处理程序执行期间存在**，一旦执行完毕，就会被销毁

#### 2、属性： ####

```
e.target                        //返回触发事件的对象 标准
e.srcElement;                   //返回触发事件的对象 非标准
e.type;                         //返回事件的类型 ，如click
eventPhase 属性可用于确定事件流当前所处的阶段
    捕获阶段被调用，则 eventPhase 等于 1；
    目标上被调用，则 eventPhase 等于 2；
    冒泡阶段被调用，则 eventPhase 等于 3
```

#### 3、currentTarget 、target区别 ####

1. 事件处理程序内部this始终等于 currentTarget 的值，而 target 只包含事件的实际目标；

2. 如果事件处理直接添加在了意图的目标，则3者一致；

3. 如果这个事件处理程序是添加到外层：

   this 和 currentTarget 都等于**注册事件**处理程序的元素

    target 属性等于按钮本身，这是因为那**才是 click 事件真正的目标**。由于按钮本身并没有注册事件处理程序，因此 click 事件冒泡到外层，从而触发了在它上面注册的处理程序

#### 4、方法： ####

```
preventDefault()方法：用于阻止特定事件的默认动作。比如，链接的默认行为
stopPropagation()方法：用于立即阻止事件流在DOM结构中传播，取消后续事件捕获或冒泡
```

### 3、事件绑定、解除 ###

#### 1、添加事件属性   基本不用 ####

```
<input type="button" value="Click Me" onclick="console.log('Clicked')"/> 

<input type="button" value="Click Me" onclick="showMessage()"/> 
<input type="button" value="Click Me" onclick="console.log(event.type)">
<input type="button" value="Click Me" onclick="console.log(this.value)"> 
```

* this 值相当于事件的目标元素；
* 这个函数有一个特殊的局部变量 event，其中保存的就是 event 对象。有了这个对象，就不用开发者另外定义其他变量，也不用从包装函数的参数列表中去取了

**缺点：**

* 时差问题：有可能 HTML 元素已经显示在页面上，用户都与其交互了，而事件处理程序的代码还无法执行。比如函数定义放在后面

  ```
  <input type="button" value="Click Me" onclick="try{showMessage();}catch(ex) {}">
  ```

  * 为此，大多数 HTML 事件处理程序会封装在 try/catch 块中，错误在浏览器收到之前已经被拦截了，就不会发生 JavaScript 错误了

* HTML 与 JavaScript 强耦合：如果要更换事件处理程序，就要改动两个地方:HTML代码和JS代码，这非常不利于后期代码的维护

####  2、DOM0  函数赋值 ####

* 做法：把一个函数赋值给（DOM 元素的）一个事件处理程序属性，要使用 JavaScript 指定事件处理程序，必须先取得要操作对象的引用

  ```
  let btn = document.getElementById("myBtn"); 
  // 赋值时，所赋函数被视为元素的方法。因此，事件处理程序会在元素的作用域中运行，即 this 等于元素
  btn.onclick = function() {  
   console.log(this.id); // "myBtn" 
  };
  ```

* 事件处理程序会在元素的作用域中运行，即 this 等于元素。通过 this 可以访问元素的任何属性和方法

  * 以这种方式添加事件处理程序是注册在事件流的**冒泡阶段**的。

* **缺点：**

  * 只能给该元素绑定一个事件，会覆盖

#### 3、DOM2 ####

```
addEventListener(事件名，事件处理函数，布尔值)

true 表示在捕获阶段调用事件处理程序
false（默认值）表示在冒泡阶段调用事件处理程序
```

* 优点：为同一个事件添加**多个**事件处理程序，以添加**顺序**来触发
* 注意：大多数情况下，事件处理程序会被添加到事件流的冒泡阶段，主要原因是跨浏览器兼容性好

#### 4、解除绑定 ####

```js
//移除通过 DOM0 方式添加的事件处理程序
btn.onclick = null

removeEventListener(事件名，事件处理函数，布尔值)
-- true 表示在捕获阶段调用事件处理程序
-- false（默认值）表示在冒泡阶段调用事件处理程序
-- 添加的匿名函数无法移除，因为移除方式与添加一样
```

* 添加的匿名函数无法移除，因为移除方式与添加一样

#### 性能问题： ####

* 删除时带来的问题：由于无用的事件处理程序长驻内存导致Web 应用性能不佳

  * 第一个是删除带有事件处理程序的元素。比如通过真正的 DOM方法 removeChild()或 replaceChild()删除节点

  * 使用 innerHTML 整体替换页面的 某一部分。这时候，被 innerHTML 删除的元素上如果有事件处理程序，就不会被垃圾收集程序正常清理。很有可能元素的引用和事件处理程序的引用都会残留在内存中。

    ```
    btn.onclick = null; // 删除事件处理程序    推荐
    ```

  * 另一个可能导致内存中残留引用的问题是页面卸载。浏览器每次加载和卸载页面（比如通过前进、后退或刷新），内存中残留对象的数量都会增加，这是因为事件处理程序不会被回收

    记住：onload 事件处理程序中做了什么，最好在 onunload 事件处理程序中恢复

* 删除会阻止事件冒泡。只有事件目标仍然存在于文档中时，事件才会冒泡

### 4、事件传播3个阶段 ###

#### 1、事件冒泡         √ ####

* 概念：事件向上传导，当后代元素上的事件被触发时，将会导致其祖先元素上的同类事件也会触发

* 优点：**事件委托**，大多是有益的

* 缺点：有时候我们需要**阻止冒泡**

  需求：比如存在这么一个页面A-->B-->C，c是最内层元素，如果用户点击c，则跳转页面，点击b，无反应，点击a，关闭页面；

  做法：我们给A加一个点击事件关闭，给C加一个单击跳转事件，这时候如果点B，会产生冒泡就会关闭页面

  解决：如果不想关闭页面，那么就需要给B绑定一个单击响应事件，添加上阻止冒泡函数**event.stopPropagation();**即可

* **阻止事件冒泡的方式：**

  * 方式1：事件处理过程中，阻止了事件冒泡，但不会阻击默认行为（执行超链接的跳转）

    ```js
    <a href="https://www.csdn.net/" class="box">
    	<button class="btn">按钮</button>
    </a>
    
    btn.onclick = function(e){
      e.stopPropagation();
    }	
    ```

  * 方式2：连接不会被打开，但是会发生冒泡，冒泡会传递到上一层的父元素；

    ```js
    btn.onclick = function(e){
      e.preventDefault();
    }	
    ```

  * 方式3：阻止事件冒泡也会阻止默认事件；

    可以理解为return false就等于同时调用了event.stopPropagation()和event.preventDefault()

    ```js
    btn.onclick = function(e){
     return false;
    }	
    ```

#### 2、目标阶段   ####

​		 事件捕获到目标元素，捕获结束开始在目标元素上触发事件  

#### 3、事件捕获 ####

​		最不具体的节 点应该最先收到事件，而最具体的节点应该最后收到事件。事件捕获实际上是为了在事件到达最终目标前拦截事件。

* 如果希望在捕获阶段就触发事件，可以将**addEventListener()**的第三个参数设置为true  
  一般情况下我们**不会希望在捕获阶段触发事件**，所以这个参数一般都是false


### 5、事件委托     √ ###

* 作用：解决“事件处理程序过多”的办法，利用**事件冒泡**，只指定一个事件处理程序，就可以管理某一类型的所有事件

  * 首先，每个函数都是对象，都**占用内存空间**，对象越多，性能越差。
  * 其次，为指定事件处理程序所需**访问 DOM 的次数会先期造成整个页面交互的延迟**
* 做法：一般把事件绑定到父级元素或者更外层元素，当子元素发生该事件，由于事件冒泡，事件会被父级元素监听到，从而触发事件处理程序
* 优点：

  * document 对象随时可用，任何时候都可以给它添加事件处理程序，这意味着只要页面渲染出可点击的元素，就可以无延迟地起作用
  * 节省花在设置页面事件处理程序上的时间。只指定一个事件处理程序既可以节省 DOM 引用，也 可以节省时间。
  * 减少整个页面所需的内存，提升整体性能

* 缺点：
  * 1.部分事件如 focus、blur 等无冒泡机制，所以无法委托。
    2.事件委托有对子元素的查找过程，委托层级过深，可能会有性能问题
    3.频繁触发的事件如 mousemove、mouseout、mouseover等，经常需要计算元素位置，不适合事件委托

### 6、事件类型 ###

* DOM3 Events 定义了如下事件类型

  ```
  * 用户界面事件：load、scroll、resize
  
  * 焦点事件：在元素获得和失去焦点时触发
  
  * 鼠标事件：鼠标在页面上执行某些操作时触发
  
  * 滚轮事件：使用鼠标滚轮（或类似设备）时触发
  
  * 输入事件：向文档中输入文本时触发
  
  * 键盘事件：键盘在页面上执行某些操作时触发
  ```

#### 1、用户界面事件 ####

* load：会在整个页面（包括 所有外部资源如图片、JavaScript 文件和 CSS 文件）加载完成后触发

  * 第一种是 JavaScript 方式：  √

  ```
  window.addEventListener("load", (event) => { 
   console.log("Loaded!"); 
  }); 
  ```

  * 第二种指定 load 事件处理程序的方式是向元素添加 onload 属性

  ```
  <body onload="console.log('Loaded!')"> 
  ```

* scroll：虽然 scroll 事件发生在 window 上，但实际上反映的是页面中相应元素的变化

* resize：窗口的尺寸缩放到新高度/新宽度时，这个事件在 window 上触发，因此 可以通过 JavaScript 在 window 上或者为元素添加 onresize 属性来指定事件处理程序

#### 2、鼠标事件： ####

```
click、mouseover、mouseout
```

* 由于事件之间存在关系，因此取消鼠标事件的默认行为也会影响其他事件。 

  比如，click 事件触发的前提是 mousedown 事件触发后，紧接着又在同一个元素上触发了 mouseup 事件。如果 mousedown 和 mouseup 中的任意一个事件被取消，那么 click 事件就不会触发。

  这 4 个事件永远会按照如下顺序触发：

   (1) mousedown  (2) mouseup (3)  click (4) mousedown (5) mouseup (6) click (7) dblclick

```
e.pageX、e.pageY                  //返回鼠标相对于浏览器可视窗口的X、Y坐标
e.clientX、e.clientY              //返回鼠标相对于文档页面的X、Y坐标
e.screenX、e.screenY              //返回鼠标相对于电脑屏幕的X、Y坐标
```

* 页面坐标

  事件发生时鼠标光标在页 面上的坐标，通过 event 对象的 pageX 和 pageY 可以获取

  在页面没有滚动时，pageX 和 pageY 与 clientX 和 clientY 的值相同

* 客户端坐标

  事件发生时鼠标光标在视口中的坐标，通过 event 对象的 clientX 和clientY 获取

  注意客户端坐标不考虑页面滚动，因此这两个值并不代表鼠标在页面 上的位置

* 屏幕坐标

  可以通过 event 对象的 screenX 和 screenY 属性获取鼠标光标在屏幕上的坐标

#### 3、键盘事件 ####

```
onkeydown、onkeyup
keyCode  获取按键的编码，判断哪个按键被按下
altKey、ctrlKey、shiftKey  这个三个用来判断alt ctrl 和 shift是否被按下  
```

#### 4、触摸事件 ####

```
* touchstart：手指放到屏幕上时触发（即使有一个手指已经放在了屏幕上）。
* touchmove：手指在屏幕上滑动时连续触发。在这个事件中调用 preventDefault()可以阻止 滚
* touchend：手指从屏幕上移开时触发。 
* touchcancel：系统停止跟踪触摸时触发。文档中并未明确什么情况下停止跟踪
```

```
提供的一些属性：clientX、clientY、screenX、screenY
```

**用于跟踪触点的3个属性：**

1. **touches**：Touch 对象的数组，表示当前屏幕上的每个触点。touchend 事件触发时 touches 集合中什么也没有，这是因为没有滚动的触点了。此时必须使用 changedTouches 集合
2. **targetTouches：**Touch 对象的数组，表示特定于事件目标的触点
3. **changedTouches：**Touch 对象的数组，表示自上次用户动作之后变化的触点

## BOM ##

### 1、BOM的定义、与DOM的区别 ###

* BOM ：浏览器对象模型，它代表浏览器的一个实例，BOM可以使我们通过JS来操作浏览器

  * BOM的核心对象是 window，它是用于与浏览器窗口进行交互对象

  * window对象包含了DOM：可以console.dir(window)查看window的属性和方法 

    <img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c42ebb19c64402ebbfa210374122e3a~tplv-k3u1fbpfcp-watermark.awebp" alt="image-20210801105424814的副本.png" style="zoom:33%;" />

  * 所以，BOM当然也就包含了DOM

### 2、Navigator ###

* 代表的当前浏览器的信息，通过该对象可以来识别不同的浏览器 

### 3、Location   ###

* 代表当前浏览器的地址栏信息，通过Location可以获取地址栏信息，或者操作浏览器跳转页面

  | **属性**           |                                                              |
  | ------------------ | ------------------------------------------------------------ |
  | location.href      | 返回完整的URL                                                |
  | location.host      | 返回域名                                                     |
  | location.search    | 返回一个URL的查询部分                                        |
  | **方法**           |                                                              |
  | location.assign()  | 用来跳转到其他的页面，作用和直接修改location一样             |
  | location.reload()  | 用于重新加载当前页面，作用和刷新按钮一样<br />如果在方法中传递一个true，作为参数，则会强制清空缓存刷新页面 |
  | location.replace() | 可以使用一个新的页面替换当前页面，调用完毕也会跳转页面  <br/>	不会生成历史记录，不能使用回退按钮回退 |


### 4、History   ###

* 代表浏览器的历史记录，可以通过该对象来操作浏览器的历史记录

  由于隐私原因，该对象不能获取到具体的历史记录，只能操作浏览器向前或向后翻页

  而且该操作只在当次访问时有效 

  | **属性**          |                                   |
  | ----------------- | --------------------------------- |
  | history.length    | 返回历史列表中的网址数            |
  | **方法**          |                                   |
  | history.forward() | 加载 history 列表中的前一个 URL   |
  | history.back()    | 加载 history 列表中的下一个 URL   |
  | history.go()      | 加载 history 列表中的某个具体页面 |


### 5、Screen   ###

* 代表用户的屏幕的信息，通过该对象可以获取到用户的显示器的相关的信息


### 6、Window ###

* 整个浏览器的窗口，同时window也是网页中的全局对象

* 在浏览器中，window有着双重的角色，这些BOM对象在浏览器中都是作为window对象的属性保存的
  1. 是JS访问浏览器窗口的接口，又是ES标准规定的Global对象
  2. 这也就是说“在网页定义的任何对象、变量、函数都以window作为其Global对象

####  1、循环定时器

* ####  setInterval() ， 返回值：

1. 返回一个Number类型的数据，这个数字用来作为定时器的唯一标识
2. 每次调用间隔的时间，单位是毫秒

* ####  clearInterval()

  需要一个定时器的标识作为参数，这样将关闭标识对应的定时器 

  如果参数不是一个有效的标识，则什么也不做

#### 2、延时调用 ####

* **setTimeout**   
* 延时调用一个函数不马上执行，隔一段时间以后在执行，而且只会执行一次

 返回值：

1. 返回一个Number类型的数据，这个数字用来作为定时器的唯一标识
2. 每次调用间隔的时间，单位是毫秒

* clearTimeout(timer);  关闭一个延时调用 

#### 3、应用 ####

轮播图

## JSON ##

### 1、语法规则 ###

1. 复合类型的值只能是数组或对象，不能是函数、正则表达式对象、日期对象。
2. 原始类型的值只有四种：字符串、数值（必须以十进制表示）、布尔值和`null`（不能使用`NaN`, `Infinity`, `-Infinity`和`undefined`）。
3. 字符串**必须使用双引号表示**，不能使用单引号。
4. 对象的键名必须放在双引号里面。
5. 数组或对象最后一个成员的后面，不能加逗号。
6. JSON和JS对象的格式一样，只不过**JSON字符串中的属性名必须加双引号**

* #### 分类：对象 {} 、数组 []   ####

* 转换：

  JSON.parse（）：将一个JS对象转换为JSON字符串

  JSON.stringify（）：将JSON字符串转换为JS对象