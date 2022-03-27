---
title: CSS的flex布局
tags:
  - flex
categories: CSS
description: 弹性盒模型
cover: >-
  https://images.unsplash.com/photo-1629186235045-80d4147d90dc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: 3120977046
date: 2021-12-11 22:43:56
---

## 弹性盒 ##

弹性盒：布局手段，代替浮动布局，可以跟随页面大小的改变而改变

### 1、弹性容器 ###

<img src="http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071004.png" alt="img" style="zoom:50%;" />

* 容器默认存在两根轴：水平的主轴（main axis）和垂直的交叉轴（cross axis）
* **项目默认沿主轴排列**。单个项目占据的主轴空间叫做`main size`，占据的交叉轴空间叫做`cross size`。
* display: flex; 设置块级弹性容器
* display: inline-flex 设置行内弹性容器（少用）
* 弹性元素：
  1. 弹性容器的子元素是弹性元素，不包含后代元素；
  2. 一个元素可以是弹性盒同时也是弹性元素

### 2、弹性容器属性 ###

#### 1、flex-direction 主轴的方向 ####

* row（默认排列方向）、row-reverse、column、column-reverse
  <img src="http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071005.png" alt="img" style="zoom:50%;" />

#### 2、flex-wrap    子元素换行 ####

一条轴线排不下，设置子元素是否换行

* nowrap（默认不换行）<img src="http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071007.png" alt="img" style="zoom: 33%;" />
* wrap：换行，第一行在上方<img src="http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071008.jpg" alt="img" style="zoom: 33%;" />
* wrap-reverse：换行，但是第一行会在下面<img src="http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071009.jpg" alt="img" style="zoom: 33%;" />

#### 3、flex-flow 前2者简写 ####

* `flex-direction`属性和`flex-wrap`属性的简写形式，默认值为`row nowrap`

#### 4、justify-content 主轴子元素排列 ####

<img src="http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071010.png" alt="img" style="zoom: 33%;" />

主轴上的子元素的排列方式

* flex-start、center、flex-end    默认 从main start对齐
* space-between，两边贴边，中间平分
* space-evenly，item之间、item和container之间距离都相等
* space-around，平分。所以，**项目之间的间隔比项目与边框的间隔大一倍**。

#### 5、align-content  侧轴多子元素排列 ####

侧轴上**子元素的排列方式**（多行） **使用前提是flex-wrap:wrap，要换行**

<img src="http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071012.png" alt="img" style="zoom:33%;" />

* flex-start、flex-end、center（**垂直对齐**）
* space-around、space-between
* stretch：默认值，将元素的长度设置为相同的值

#### 6、align-items 侧轴单子元素排列 ####

侧轴上**子元素的排列方式**（单行）

<img src="http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071011.png" alt="img" style="zoom:33%;" />

* flex-start、flex-end、center（**垂直对齐**）：交叉轴顶部对齐，item有高度的情况下，就是顶部对齐
* stretch：**默认值**，如果项目未设置高度或设为auto，item纵向拉伸，将占满整个容器的高度
* baseline：item**第一行文字**基线对齐

### 3、弹性元素属性 ###

#### 1、 flex-grow   ####

* 定义项目的放大比例，默认为`0`，即如果**存在剩余空间，也不放大**

  ```js
  .item {
    flex-grow: <number>; /* default 0 */
  }
  ```

* 放大规则：

  1. 所有项目的`flex-grow`设置为1，则它们将等分剩余空间（如果有的话）
  2. 如果一个项目的`flex-grow`属性为2，其他项目都为1，则前者占据的剩余空间将比其他项多一倍


#### 2、 flex-shrink ####

* 定义了项目的缩小比例，默认为`1`，即**如果空间不足，该项目将自动缩小**

  ```js
  .item {
    flex-shrink: <number>; /* default 1 */
  }
  ```

* 缩小规则：

  1. 如果所有项目的`flex-shrink`属性都为1，当空间不足时，都将等比例缩小
  2. 如果一个项目的`flex-shrink`属性为0，其他项目都为1，则空间不足时，前者不缩小
  3. 负值对该属性无效


#### 3、 flex-basis ####

* 定义了在分配多余空间之前，项目占据的主轴空间。浏览器根据这个属性，计算主轴是否有多余空间。

  ```js
  .item {
    flex-basis: <length> | auto; /* default auto */
  }
  ```

  * `auto`：首先检索该子元素的主尺寸，如果主尺寸不为 `auto`，则使用值采取主尺寸之值；如果也是 `auto`，则使用值为 `content`。
  * `content`：指根据该子元素的内容自动布局。有的用户没有实现取 `content` 值，等效的替代方案是 `flex-basis` 和主尺寸都取 `auto`。
  * 百分比：根据其包含块（即伸缩父容器）的主尺寸计算。如果包含块的主尺寸未定义（即父容器的主尺寸取决于子元素），则计算结果和设为 `auto` 一样

* 剩余空间的计算：

  剩余空间＝父容器空间－子容器1.flex-basis或width - 子容器2.flex-basis或width - …

#### 4、flex ####

* `flex-grow`, `flex-shrink` 和 `flex-basis`的简写

> ```css
> .item {
> 		flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
> }
> flex的可选值：
> 	initial  --默认值、表示flex：0、1、auto
> auto		 --flex：1、1、auto
> none 		 --flex：0、0、auto，此时表示元素没有弹性
> ```

* #### flex取值情况 ####

1. `默认取值：0 1 auto`
   * 有剩余空间时，不会放大；没有剩余空间时，会缩小
   * 剩余空间的计算，按指定宽度属性width计算
2. `flex：auto（1 1 auto）`
   * 有剩余空间时，会放大；没有剩余空间时，会缩小
   * 剩余空间的计算按指定宽度属性width计算
3. `flex：none（0 0 auto）`
   * 有剩余空间时，不会放大；没有剩余空间时，不会缩小，所以会超出容器
   * 剩余空间的计算按指定宽度属性width计算
4. `flex：1（1 1 0%）`
   * 有剩余空间时，会放大；没有剩余空间时，会缩小
   * flex中此元素占据宽度为0，不论flex-shrink为多少，都不再起作用，不会再压缩
5. `flex：百分比（1 1 百分比）`
   * 百分比则视为 `flex-basis` 值，`flex-grow` 取 `1`，`flex-shrink` 取 `1`
   * flex中此元素占据宽度为0，不论flex-shrink为多少，都不再起作用，不会再压缩
6. `flex：0 （0 0 0）`
   * 有剩余空间时，不会放大；不会缩小，所以会超出容器
   * 剩余空间的计算按元素内容撑开的宽度

#### 5、其他子项属性 ####

* `align-self`：允许单个项目有与其他项目不一样的对齐方式，可覆盖`align-items`属性。默认值为`auto`，表示继承父元素的`align-items`属性，如果没有父元素，则等同于`stretch`。
  <img src="http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071016.png" alt="img" style="zoom:33%;" />

  > ```css
  > .item {
  > 		align-self: auto | flex-start | flex-end | center 
  >    					| baseline |  stretch;
  > }
  > 该属性可能取6个值，除了auto，其他都与align-items属性完全一致。
  > ```

* **`order`：定义项目的排列顺序。数值越小，排列越靠前，默认为0**

  <img src="http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071013.png" alt="img" style="zoom:33%;" />

### 4、flex解决了什么 ###
