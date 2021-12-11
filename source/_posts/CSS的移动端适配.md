---
title: 移动端适配
date: 2021-12-09 22:47:12
tags:
- 移动端
categories: CSS
description: '移动端适配方案及基础'
cover: https://images.unsplash.com/photo-1638914130169-5bd5240f6ea2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80
copyright_author: 飞儿 # 作者覆写
copyright_url: https://www.nesxc.com/post/hexocc.html 
license: CC BY-NC-SA 4.0
license_url: https://creativecommons.org/licenses/by-nc-sa/4.0/
---
## 移动端适配 ##

### 0、rem、em、vm ###

* px：像素，固定
* em：
  - 相对于自己的字体大小；
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

### 1、像素 ###

#### 1、物理像素、CSS像素 ####

屏幕是由一个一个发光的小点构成，这一个个的小点就是像素

* **物理像素：**就是屏幕分辨率：一个屏幕具体由多少个像素点组成

  分辨率高不代表屏幕就清晰，清晰程度还与尺寸有关

* **CSS像素：**F12后的显示即`CSS`像素，网页编写的是 `CSS` 像素

  浏览器在显示网页时，需要将CSS像素转换为物理像素然后再呈现

一个CSS像素最终由几个物理像素显示，由浏览器决定：

* 默认情况下，在PC端，一个CSS像素 = 一个物理像素

#### 2、像素比计算： ####

一个CSS像素由几个物理像素显示

* 像素比 = 视口像素（CSS 像素） / 物理像素
* 比值越小图像越小，比值越大图像越大

### 2、视口 ###

#### 1、布局视口 ####

* PC上：

  布局视口就等于当前浏览器的窗口大小（不包括`borders` 、`margins`、滚动条）

* 移动端：

  布局视口被赋予一个默认值，大部分为`980px`，这保证`PC`的网页可以在手机浏览器上呈现，但是非常小（因为手机端的像素一般都比pc的小），用户可以手动对网页进行放大

**获取布局视口**

* `document.documentElement.clientWidth / clientHeight`

#### 2、视觉视口 ####

* 用户通过屏幕真实看到的区域，默认等于当前浏览器的窗口大小（包括滚动条宽度）
* 缩放会改变视觉视口的大小，不会改变布局视口的大小
* F12点击 HTML 标签查看视口大小；可以通过查看视口的大小，来观察**CSS像素和物理像素的比值**
* 视口宽度是 CSS像素，屏幕分辨率宽度是物理像素
* 调用`window.innerWidth / innerHeight`来获取视觉视口大小

#### 3、完美视口 ####

* 出现的契机：

  布局视口在移动端展示的效果不理想，因为他们像素大小不一致。所以完美视口就是网站页面在移动端展示的理想大小

* 缩放系数计算：

  `页面的缩放系数 = 完美视口宽度 / 视觉视口宽度`

* 获取：

  `window.screen.width / height`来获取完美视口大小

* 使用：通过调整视口大小，**更改像素比大小**

  * 比如说：在开发时，移动端网页一般是980px（布局视口），而苹果6的尺寸750px（视觉视口）。此时像素比：

    750 / 980 ，但苹果手机相比于网页来说，他的像素是更小的，所以网页会更小。所以为了适配，比如说该款收集最佳像素比是2：1（浏览器厂商），可以调整980为375px

    ```css
    <meta name="viewport" content="width=375px" > 
    ```

  * 此时可以使用meta标签进行调整，width：375px，此时的375px就是完美视口。但是所有的手机最佳像素比不一样，为了所有手机上都可以得到最佳显示效果，而不是写死：device-width

    ```css
    <meta name="viewport" content="width=device-width, initial-sacle=1.0" > 
    // initial-sacle=1.0 初始化缩放1倍，防止极端情况下出现问题，横竖屏切换 
    ```

### 3、meta标签适配 ###

* 作用：表示不能由其它`HTML`元相关元素表示的任何元数据信息，可告诉浏览器如何解析页面。在布局中：

  1. 借助元素的`viewport`来帮我们设置布局视口、缩放等，从而让移动端得到更好的展示效果
  2. 为了移动端更好显示效果，要让布局视口、视觉视口都尽可能等于理想视口

* 属性介绍：

  ```css
  <meta name="viewport" 
        content="width=device-width; initial-scale=1; 
                 maximum-scale=1; minimum-scale=1; user-scalable=no;">
  ```

  * width：定义**布局视口**的宽度，px单位：

    device-width：等于完美视口的宽度

    `width=device-width`：让布局视口等于完美视口

    height：定义布局视口的高度，px为单位   这里不写

  * initial-scale：

    定义页面初始缩放比率=完美视口宽度 / 视觉视口宽度，就相当于让视觉视口等于理想视口。这时候，1个`CSS`像素就等于1个设备独立像素，而且我们也是基于理想视口来进行布局的，所以呈现出来的页面布局在各种设备上都能大致相似

  * minimum-scale / maximum-scale：定义缩放的最小值

  * user-scalable：如果设置为 `no`，用户将不能放大或缩小网页。默认值为 yes

### 4、vw适配 ###

* `vh、vw`方案即将视觉视口宽度 `window.innerWidth`和视觉视口高度 `window.innerHeight` 等分为 100 份。
  * `1vw`等于视觉视口的`1%`，`1vh` 为视觉视口高度的`1%`
  * `vmin` : `vw` 和 `vh` 中的较小值、较大值
  * 如果视觉视口为`375px`，那么`1vw = 3.75px`，这时`UI`给定一个元素的宽为`75px`（设备独立像素），我们只需要将它设置为`75 / 3.75 = 20vw`

* 缺陷：

  * `px`转换成`vw`不一定能完全整除，因此有一定的像素差。
  * 比如当容器使用`vw`，`margin`采用`px`时，很容易造成整体宽度超过`100vw`，从而影响布局效果。当然我们也是可以避免的，例如使用`padding`代替`margin`，结合`calc()`函数使用等等...

### 5、响应式布局：媒体查询 ###

* 定义：

  网页根据不同的设备或窗口大小呈现出不同效果，使用响应式布局，可以使一个网页适用所有设备

* 响应式布局的关键是媒体查询

#### 媒体查询适配 ####

* 语法：

  ```css
  @media 查询规则 {...}
  
  @media all and|not|only(media feature){}
  
  media (min-width: 500px), (max-width: 700px) {....}
  media only screen and (min-width: 500px) and (max-width: 700px) {....}
  ```

  * mediatype：all 所有设备、print 打印设备、**screen** 带屏幕设备
  * and|not|only：关键字,实际使用3选1
  * media feature：width、min-width、max-width（布局视口的宽度、最小宽度...）

* 断点：样式切换的分界点，常用断点

  * 小于768 超小屏幕
  * 大于768 小屏幕
  * 大于992 中型屏幕
  * 大于1200 大屏幕

### 6、rem布局适配 ###

* 作用：让一些不能等比自适应的元素，达到当设备尺寸发生改变的时候，等比例适配当前设备
  * Htmlfont-size：屏幕宽度 / 划分的份数
  * 页面元素的rem值：页面元素值（px）/（屏幕宽度 / 划分的份数）

* 做法：使用**媒体查询**根据不同设备按比例设置html的大小（Htmlfont-size），然后页面元素用rem做尺寸单位，当html字体大小变化，元素尺寸也会发生变化，从而达到等比缩放的效果