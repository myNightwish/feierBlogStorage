---
title: 移动端适配
tags: 移动端适配
categories: 1.1-CSS
description: 移动端适配方案及基础
cover: >-
  https://images.unsplash.com/photo-1638914130169-5bd5240f6ea2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: 2017257642
date: 2021-12-09 22:47:12
---
## 移动端适配 ##
### 1、媒体查询 ###

* 使用媒体查询的方式：

  1. 可以使用 **link 与 style** 中定义媒体查询
  2. 也可以用 `@import url(screen.css) screen` 形式媒体使用的样式

  可以用逗号分隔同时支持多个媒体设备，未指定媒体设备时等同于all

#### 1、style ####

* 常用的：一般并不会写media="screen"，其实是默认了media="all"

  ```css
  <style media="screen">  //可以指定别的设备
  h1 {
    font-size: 3em;
    color: blue;
  }
  </style>
  ```

#### 2、link ####

* 在 `link` 标签中通过 `media` 属性可以设置样式使用的媒体设备。

* 要写很多link标签，不太方便。不推荐使用

* 此外我们更多的时候是针对页面中某块区域，来单独写个样式控制其响应

  ```css
  <link rel="stylesheet" href="common.css"> //没有指定媒体所以全局应用
  <link rel="stylesheet" href="screen.css" media="screen"> //在屏幕设备
  <link rel="stylesheet" href="print.css" media="print"> //在打印设备
   /* 多设备支持，逗号分隔 */
  <link rel="stylesheet" href="screen.css" media="screen,print">
  ```

#### 3、@import ####

* 相比于link，我们更多的时候是针对页面中某块区域，来单独写个样式控制其响应

* 此时就可以在文件中**引入一个样式文件**，在这个文件中**再引入其他媒体的样式文件。**用`@import` ，引入指定设备的样式规则。

  ```css
  <link rel="stylesheet" href="style.css">  //这样就可以只有一个link了
  ```

  **style.css**

  ```css
  @import url(screen.css) screen;
  @import url(print.css) print;
  ```

  ```css
  @import url(screen.css) screen,print; /* 多设备支持，逗号分隔 */
  ```

#### 4、@media ####

*  `@media` 可以做到更细的控制，即**在一个样式表中为多个媒体设备定义样式**

  ```css
  @media mediatype 关键字 (media feature)  {...}
  @media screen,print {...}  /* 多设备支持，逗号分隔 */
  
  media (min-width: 500px), (max-width: 700px) {....}
  media only screen and (min-width: 500px) and (max-width: 700px) {....}
  ```

  * mediatype：常用媒体类型还是screen
    * all：所有媒体类型
    * screen：电脑屏幕，平板电脑，智能手机等
    * print：打印设备
    * speech：屏幕阅读器等发声设备
  * and|or|not|only：关键字，实际使用3选1
    * not：必须将not写在查询的最前面，表示不应用样式，即所有条件**都满足**时**不应用**样式
    * only：用来排除不支持媒体查询的浏览器
      * only 和 not 一样只能出现在媒体查询的开始
      * 对支持媒体查询的设备，正常调用样式，此时就当only不存在
      * 对不支持媒体查询的设备不使用样式
  * media feature：width、min-width、max-width（布局视口的宽度、最小宽度...）

  * 断点：样式切换的分界点，常用断点

    * 小于768 超小屏幕     大于768 小屏幕   大于992 中型屏幕    大于1200 大屏幕

#### 5、查询条件 ####

* 可以使用不同条件限制使用的样式，条件表达式需要放在**扩号**中

* style：设置查询条件的媒体查询：

  ```css
  <style media="screen and (min-width: 768px),screen and (orientation:landscape)">
  /*  orientation 属性可以定义设备的方向 */
  /* portrait	竖屏设备即高度大于宽度    landscape	横屏设备即宽度大于高度*/
    body {
      color: blue;
    }
  </style>
  ```

* @media：设置查询条件的媒体查询：

  ```css
  <style>
  @media screen and (orientation: landscape) and (max-width: 600px) {
    body {
      background: #8e44ad;
    }
  }
  </style>
  ```

### 2、rem布局 ###

* 作用：当设备尺寸发生改变的时候，等比例适配当前设备
* rem计算：1rem = HTML的font-size  也是:root的font-size
  * HTML的font-size：屏幕宽度 / 划分的份数
* 做法：
  * 不同的媒体查询方式，不同的设备设置不同的HTML的font-size
  * 然后页面元素用rem做尺寸单位
  * 当html字体大小变化，元素尺寸也会发生变化，从而达到等比缩放的效果

### 3、vw适配 ###

* `vh、vw`方案即将视觉视口宽度 `window.innerWidth`和视觉视口高度 `window.innerHeight` 等分为 100 份。
  * `1vw`等于视觉视口的`1%`，`1vh` 为视觉视口高度的`1%`
  * `vmin` : `vw` 和 `vh` 中的较小值、较大值
  * 如果视觉视口为`375px`，那么`1vw = 3.75px`，这时`UI`给定一个元素的宽为`75px`（设备独立像素），我们只需要将它设置为`75 / 3.75 = 20vw`

* 缺陷：

  * `px`转换成`vw`不一定能完全整除，因此有一定的像素差。
  * 比如当容器使用`vw`，`margin`采用`px`时，很容易造成整体宽度超过`100vw`，从而影响布局效果。当然我们也是可以避免的，例如使用`padding`代替`margin`，结合`calc()`函数使用等等...

### 4、视口 ###

#### 1、viewport的概念 ####

* 通俗的讲，移动设备上的viewport：就是设备的**屏幕上能用来显示网页的那块区域：**

* 但viewport又不局限于浏览器可视区域的大小，它可能比浏览器的可视区域大或小；
* 默认情况下，一般来讲，移动设备上的viewport都是要大于浏览器可视区域的：
  * 因为考虑到移动设备的分辨率相对于桌面来说都较小；
  * 所以为了能在移动设备上正常显示为传统的为桌面设计的网站；
  * 移动设备上的浏览器都会把自己默认的viewport设为980px或其他值
  * 但后果就是浏**览器会出现横向滚动条**，因为浏览器可视区域的宽度是比这个默认的viewport的宽度要小的。

![img](https:////upload-images.jianshu.io/upload_images/18030682-a963ada3b9aed8fb.png?imageMogr2/auto-orient/strip|imageView2/2/w/653/format/webp)

#### 2、css的1px !== 设备1px ####

css中的像素只是一个抽象单位，在不同的设备或环境中**，css中的1px代表的设备物理像素是不同的**

* css中一般使用px作为单位，对应电脑浏览器就是1px，一个物理像素；
* 但**移动设备**中并非如此：
  * 早期设备，屏幕像素比低。iphone3分辨率为320x480，一个css像素等于一个屏幕物理像素
  * 但后期苹果推出了Retina屏，分辨率提高了一倍，变成640x960，但屏幕尺寸却没变化：
    * 这意味着，同样大小的屏幕上，像素却多了一倍，这时，一个css像素是等于两个物理像素的；

* **用户缩放行为：**
  * 当用户把页面放大一倍，那么css中1px所代表的物理像素也会增加一倍；
  * 反之把页面缩小一倍，css中1px所代表的物理像素也会减少一倍

* **devicePixelRatio(设备像素比)**属性：window对象的
  * 设备物理像素和设备独立像素的比例，也就是 **dpr = dp/ dips**：
    *  **dp(device pixels)：**设备物理像素        css中的px
    *  **dips(device-independent pixels)：**设备独立像素，dips = css像素/scale（缩放比例），所以dpr=(dp/css像素)*scale
  * 因此，通过devicePixelRatio可以知道该设备上一个css像素代表多少个物理像素。
  * 但注意的是，devicePixelRatio在不同的浏览器中还存在些许的兼容性问题

#### 3、布局视口 ####

<img src="https:////upload-images.jianshu.io/upload_images/18030682-07a1ff787499c9f2.png?imageMogr2/auto-orient/strip|imageView2/2/w/497/format/webp" alt="img" style="zoom:50%;" />

* 出现的目的：

  浏览器默认情况下把viewport设为一个较宽的值，比如980px，这样的话即使是那些为桌面设计的网站也能在移动浏览器上正常显示了。

  1. 首先，移动设备上的浏览器认为自己必须能让所有的网站都正常显示，即便不是专为移动设备设计的网页
  2. 但移动设备的屏幕都不是很宽，如果以浏览器的可视区域作为viewport的话，那些为桌面浏览器设计的网站放到移动设备上显示时，必然会因为移动设备的viewport太窄，而挤作一团
  3. 因此，。。。

* ppk把这个浏览器默认的viewport叫做**layout viewport(布局视口)**

* 获取：`document.documentElement.clientWidth / clientHeight`

#### 4、视觉视口 ####

<img src="https:////upload-images.jianshu.io/upload_images/18030682-d92903bf680a85cd.png?imageMogr2/auto-orient/strip|imageView2/2/w/500/format/webp" alt="img" style="zoom:50%;" />

* layout viewport 的宽度是大于浏览器可视区域的宽度的，所以我们还需要一个viewport来代表 **浏览器可视区域的大小**：**视觉视口**
* 用户可以缩放来查看网站的内容。
  * 缩小网站，看到的网站区域将变大，此时视觉视口也变大了，反之亦然
  * 不管用户如何缩放，都不会影响到布局视口的宽度
* 调用`window.innerWidth / innerHeight`来获取

#### 5、理想视口 ####

* 现在主流网站会为移动设备单独的设计，所以必须还要有一个能完美适配移动设备的viewport

* 完美适配指的是：

  1. 不需要用户缩放和横向滚动条就能正常的查看网站的所有内容；
  2. 显示的文字（图片等）的大小是合适，比如一段14px大小的文字，不会因为在一个高密度像素的屏幕里显示得太小而无法看清
  3. 理想的情况是这段14px的文字无论是在何种密度屏，何种分辨率，显示出来的都差不多的

* `window.screen.width / height`来获取

* ideal viewport 并没有固定的尺寸，不同的设备有不同的 ideal viewport：

  * 所有的 iphone 的 ideal viewport 宽度都是 320px，无论它的屏幕宽度是 320 还是 640

  * 也就是说，在 iphone 中，css 中的 320px 就代表 iphone 屏幕的宽度。

    <img src="https:////upload-images.jianshu.io/upload_images/18030682-8a400bd06174edfa.png?imageMogr2/auto-orient/strip|imageView2/2/w/270/format/webp" alt="img" style="zoom:33%;" />

* 这3类视口， ideal viewport 是最适合移动设备的viewport：只要在css中把某一元素的宽度设为ideal viewport的宽度(单位用px)，那么这个元素的宽度就是设备屏幕的宽度了，也就是宽度为100%的效果。

* ideal viewport 的意义：

  无论在何种分辨率的屏幕下，那些针对ideal viewport 而设计的网站，不需要用户手动缩放，也不需要出现横向滚动条，都可以完美的呈现给用户。

### 5、meta标签 ###

#### 标准写法： ####

* 移动设备**默认的viewport是layout viewport**，也就是那个比屏幕要宽的viewport，但在进行移动设备网站的开发时，我们需要的是ideal viewport，常见的作法：

  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
  ```

  * 该meta标签的作用：

    让当前viewport的宽度等于设备的宽度，同时不允许用户手动缩放。如果你不这样的设定的话，那就会使用那个比屏幕宽的默认viewport，也就是说会出现横向滚动条。

  * meta viewport 标签：在苹果的规范中，meta viewport 有6个属性

    安卓还支持 target-densitydpi 私有属性，表示目标设备的密度等级，作用是决定css中的1px代表多少物理像素，即将废弃。

    <img src="https:////upload-images.jianshu.io/upload_images/18030682-839f41e5291f76f8.png?imageMogr2/auto-orient/strip|imageView2/2/w/549/format/webp" alt="img" style="zoom:50%;" />

    ![img](https:////upload-images.jianshu.io/upload_images/18030682-76c58332c2eefc4b.png?imageMogr2/auto-orient/strip|imageView2/2/w/657/format/webp)

#### 不同的写法： ####

1.  这样写也能达到同样的效果：为什么？

```xml
<meta name="viewport" content="initial-scale=1">
  // IE 会横竖屏不分
```

* 因为这里的缩放值是1，也就是没缩放，但却达到了 ideal viewport 的效果；
* 因为缩放是相对于 ideal viewport来进行缩放的，当对ideal viewport进行100%的缩放，也就是缩放值为1的时候，不就得到了 ideal viewport吗

2. **但如果 width 和 initial-scale=1 同时出现，并且还出现了冲突呢？**比如：

```xml
<meta name="viewport" content="width=400, initial-scale=1">
  // iphone、ipad会横竖屏不分
```

* width=400：把当前viewport的宽度设为400px

* initial-scale=1：把当前viewport的宽度设为ideal viewport的宽度，`= 理想视口宽度 / 视觉视口宽度`

* **当遇到这种情况时，浏览器会取它们两个中较大的那个值**：

  ideal viewport的宽度为320时，取的是400；当width=400， ideal viewport的宽度为480时，取的是ideal viewport的宽度

#### 用户缩放： ####

`initial-scale= 理想视口宽度 / 视觉视口宽度`

* 缩放是相对于ideal viewport来缩放的，缩放值越大，当前viewport的宽度就会越小，反之亦然。

  例如在iphone中，ideal viewport的宽度是320px，如果我们设置 initial-scale=2 ，此时viewport的宽度会变为只有160px了

  * 原来1px的东西变成2px了，但是1px变为2px并不是把原来的320px变为640px了，而是在实际宽度不变的情况下，1px变得跟原来的2px的长度一样了，所以放大2倍后原来需要320px才能填满的宽度现在只需要160px就做到了

* 另一点，initial-scale：在iphone和ipad上，无论你给viewport设的宽的是多少，如果没有指定默认的缩放值，则iphone和ipad会自动计算这个缩放值，以达到当前页面不会出现横向滚动条(或者说viewport的宽度就是屏幕的宽度)的目的。

### 6、rem、em、vm ###

* px：像素，固定
* em：
  - 相对于自己的字体大小；有继承的属性
  - 如果自己没有，**相对于父元素字体大小**
* rem：相对于**根元素的字体font-size大小**,任意浏览器默认字体都是16px

  * html根元素的获取方式 `document.getElementsByTagName('html')[0]`
  * Htmlfont-size：屏幕宽度 / 划分的份数
  * 页面元素的rem值：页面元素值（px）/（屏幕宽度 / 划分的份数）
* 百分比：
  - 用在字体中，相对于**父元素**字体大小
  - 用在尺寸中，相对于父元素的width和height

* vm、vh
  * `1vw`等于视觉视口的`1%`，`1vh` 为视觉视口高度的`1%`
  * 如果视觉视口为`375px`，那么`1vw = 3.75px`，这时`UI`给定一个元素的宽为`75px`（设备独立像素），我们只需要将它设置为`75 / 3.75 = 20vw`