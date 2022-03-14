---
title: CSS的盒模型
tags: 盒模型
categories: CSS
description: 盒子模型的分类
cover: >-
  https://img-blog.csdnimg.cn/20200718094809469.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQzNDc1MzM2,size_16,color_FFFFFF,t_70
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: 282252185
date: 2021-12-09 22:49:41
---

## 二、盒模型 ##

### 0、文档流 ###

* 网页是一个多层结构，是一层一层的；我们可以通过css为每一层设置样式，而用户只能看到最上面的一层
* 我们称最下面的一层叫**文档流，文档流是网页的基础**，也是**css的一种基本定位和布局机制**

* 我们创建的元素默认是在文档流中进行排列：
  1. 比如写的html不用css，默认自上而下（块级元素如`div`）从左到右（内联元素如`span`）堆砌的布局方式
  2. 元素主要有两种状态：在文档流中、不在文档流中

### 1、盒模型 ###

* 盒子构成4部分：content（有width和height）、padding、border、margin
* 分类上：
  1. 块级元素的盒模型、行内元素的盒模型
  2. 标准盒模型、怪异盒模型

#### 1、盒子尺寸计算 ####

##### IE盒模型：border-box #####

* css指定的width、height指的是：实际盒子的大小（**内容区域+border+padding**）；不是内容区大小
* 属性控制：**box-sizing**：**border-box**
* 所以这种模式下，**增加border和padding会减小内容区域的大小**，而实际盒子大小不变

##### 标准模型（默认）：content-box #####

1. css指定的width、height指的是：内容区content的大小；
2. 此时**实际盒子**的大小：**内容区域+border+padding**
3. 属性控制：**box-sizing**为**content-box**（默认值）
4. 所以，这种模式下，**增加border和padding不会影响内容区域的大小**，只是会影响实际盒子的大小
5. 声明了DOCTYPE类型，会解读为标准盒模型；

#### 2、盒子宽高尺寸获取 ####

##### 1. 方式一：通过DOM节点的 style 样式获取：element.style.width/height #####

* 缺点：通过这种方式，只能获取行内样式，不能获取内嵌的样式和外链的样式

```html
				<div id="div1" style="width: 100px">111</div>
        <div id="div2">222</div>
        <script>
            var oDiv1 = document.getElementById("div1");
           console.log(oDiv1.style.width ) ;
        </script>
```

##### 2. 方式二（通用型）：window.getComputedStyle(element).width/height #####

```html
        <div id="div1" >111</div>
        <div id="div2">222</div>
        <script>
            var oDiv1 = document.getElementById("div1");
           console.log( window.getComputedStyle(oDiv1).width ) ;
        </script>
```

##### 3. 方式三：IE独有的element.currentStyle.width/height #####

* 获取到的是运行完之后的宽高，三种css样式都可以获取

```js
var oDiv1 = document.getElementById("div1");
 console.log( oDiv1.currentStyle.width);
```

##### 4. 方式四（通用型）：element.getBoundingClientRect().width/height #####

* 这种方式获得到的宽度是内容content+padding+border
* 此 api 的作用是：获取一个元素的绝对位置。绝对位置是视窗 viewport 左上角的绝对位置

```js
var oDiv1 = document.getElementById("div1");
console.log(oDiv1.getBoundingClientRect().width);
```

### 2、块级元素的盒模型 ###

#### 1、盒模型水平方向布局规则： ####

元素在父元素的位置由以下属性决定：

margin-left、border-left、padding-left   width、padding-right、border-right、margin-right

这7个值构成了父元素的content内容区；

必须满足的条件：

```
子元素margin-left+border-left+padding-left+width+padding-right+border-right=父元素宽度
```

* 当等式不成立时，称为过度约束，浏览器会自动调整：

  这7个值中有三个可以设置为auto：width (默认是auto)、margin-left、margin-right

  1. 如果7个值中没有auto会先调整margin-right；所以即使设置margin-right是无效的；
  2. 如果某一个值为auto就会先自动调整那个值；
  3. 如果一个宽度和一个外边距是auto，那么宽度会调整到最大
  4. 如果三个都是auto，那么宽度会是最大；
  5. 如果外边距都是auto，那么两个auto会赋相同的值(常用这个特点实现水平居中)

#### 2、盒模型垂直方向布局 ####

* **默认情况下，如果父元素不设置高度，父元素是被子元素撑开的**。如果父元素指定了高度，设置多少就是多少；

* 子元素在内容区中排列：

  1. 如果子元素的大小超过父元素：则子元素会从父元素中溢出；

  2. 使用overflow属性来设置父元素如何处理溢出的子元素：

     visible：(默认值)子元素从父元素中溢出，在父元素的外部显示
     hidden:溢出的元素将会被裁减而不显示
     scroll:生成两个滚动条，通过两个滚动条实现浏览
     auto：根据需要生成两个滚动条

#### 3、垂直外边距塌陷 ####

**概念：**两个或多个相邻普通流中的盒子（父子或兄弟元素）在**垂直方向**上的外边距会发生叠加

##### 兄弟元素：外边距的计算 #####

* 两数为正，取最大值
* 两数为负，取绝对值最大的数
* 一正一负：取二者之和

怎么解决：（兄弟元素的外边距重叠问题不用处理，因为就希望这样的效果）

* ##### 为什么这样设计： #####

  解决垂直方向的多个段落之间的间隔：为了兼顾顶部、底部的没有空隙，所以添加了margin-bottom，margin-top ，由于外边距的合并这样的设计，不会让每个段落之间多出来一份宽度，这样整体间距一样，整齐布局

##### 父子元素： #####

外边距计算：

* 父子元素之间的外边距子元素会传递给父元素（子会将父带下来，这样不好，需要解决）

怎么解决：

1. 不用margin，换用padding，再将高度减去（需要计算）

2. 改父元素定义上边框，设置透明，还需要减去高度，margin-top

3. 解决思路：用一个东西，将上边的外边距与下边的外边距隔开，不要互相影响

   ```css
   <div class="box1 clearfix">
   			// 阻隔的添加在这里
       <div class="box2"></div>
   </div>
   ```

   ```css
   .clearfix::before,  //1
   .clearfix::after {  //4
       content: "";  //2
       display: table; //table可以隔开，本身不占据位置，既可以解决高度塌陷、外边距重叠问题 //3
       clear: both; //5
   }
   // 1、2、3 其实是解决了 外边距重叠问题；
   // 4、5是解决 高度塌陷问题
   ```

* 什么时候用before的问题？

  * **其实它是用来处理margin边距重叠的，由于内部元素 float 创建了BFC，导致内部元素的margin-top和 上一个盒子的margin-bottom 发生叠加**。如果这不是你所希望的，那么就可以加上before

### 3、行内、替换元素              ###

#### 1、行内元素 ####

* 不会独占一行，多个行内元素从左到右(行内元素可以共处一行)，从上到下排列；
* 不能设置宽高：宽高是由其文本内容撑开
* 可以设置margin、padding、border，但**垂直方向**上均不影响页面的布局，下面一行的元素不受影响
* 行内元素**左右margin和padding**有效，直接相加
* 行内元素使用float属性后，设置宽高生效
* a、span、img、br、strong

#### 2、行内块元素 ####

* 结合了inline和block特性，既能设置宽高也不会换行
* 行内块级元素起始就是行内元素设置宽高可以生效
* img、input、button、textarea、select

#### 3、display:none ####

* 此时元素**仍存在于DOM**结构中
* 但**不存在于render tree** 中，**不会被渲染**，就**不会占据空间**，后面的元素会顶上来
* 会引起回流
* 不能点击

#### 5、display:flex ####

* 弹性元素：更像是移动端的布局方式
* 设为flex布局后，子元素的float，clear和vertical-align属性将失效
* 此元素即为弹性布局容器，会按弹性布局规则

#### 6、可替换元素： ####

* 特点：展现效果不是由 CSS 来控制的，外观渲染独立于CSS

* ##### 举例： #####

  1. 典型的可替换元素：iframe、video

     **img**：浏览器去下载 src 属性给到的图片，并用该图片资源替换掉 `img` 标签，而且浏览器在下载前并不知道图片的宽高。所以，可替换元素比较特殊，它的宽高是由其加载的内容决定的。（当然 CSS 可以覆盖其样式）

     * display 属性的默认值是 inline，默认分辨率是由被嵌入的图片的原始宽高来确定的，使得它就像 inline-block 一样

* 没有基线：使用 vertical-align: baseline 时，图像的底部将会与容器的文字基线对齐

2. 仅在特定情况下被作为可替换元素处理：audio、canvas

3. 特殊的 input

   * 根据`type`属性来决定是显示输入框，还是单选按钮等

   * 规范说明了input元素可替换，除了其他形式的控制元素，包括其他类型的 <input> 元素，被明确地列为非可替换元素

#### 7、不可替换元素： ####

* `html` 的大多数元素是不可替换元素，即其内容直接表现给用户端：div、p、h1

#### 3、总结 ####

1. 几乎所有的**替换元素**都是**行内元素**

   不过元素的类型也不是固定的，通过设定CSS 的display属性，可以使行内元素变为块级元素，也可以让块级元素变为行内元素

2. 替换元素一般有内在尺寸，所以具有width和height

   不指定img的width和height时，就按其内在尺寸显示

   对于表单元素，浏览器也有默认的样式，包括宽度和高度
