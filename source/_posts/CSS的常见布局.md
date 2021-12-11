---
title: CSS的常见布局
date: 2021-12-09 22:43:44
tags: CSS
categories: CSS
description: '常见布局样式'
cover: https://images.unsplash.com/photo-1639016618259-523caef3a860?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80
copyright_author: 飞儿 # 作者覆写
copyright_url: https://www.nesxc.com/post/hexocc.html 
license: CC BY-NC-SA 4.0
license_url: https://creativecommons.org/licenses/by-nc-sa/4.0/
---
## 两栏布局          ##

### 1. 左定宽右适应 							 6种 ###

```
<div class="box">
  <div class="box-left"></div>
  <div class="box-right"></div>
</div>
```

* 解法1：float+margin，利用浮动，这样两侧就在同一行了，因为左侧宽度已知，那么右侧margin-left等于左侧宽度即可

  ```
  .box {
   height: 200px;
  }
  
  .box > div {
    height: 100%;
  }
  
  .box-left {
    width: 200px;
    float: left;
    background-color: blue;
  }
  
  .box-right {
    margin-left: 200px;
    background-color: red;
  }
  ```

* 解法2：flex布局，其实和两栏自适应的方法二一模一样

  ```
  .box {
    height: 200px;
    display: flex;
  }
  
  .box > div {
    height: 100%;
  }
  
  .box-left {
    width: 200px;
    background-color: blue;
  }
  
  .box-right {
    flex: 1; // 设置flex-grow属性为1，默认为0
    overflow: hidden;
    background-color: red;
  }
  ```

* 解法3：float+overflow

  ```
  .box {
   height: 200px;
  }
  
  .box > div {
    height: 100%;
  }
  
  .box-left {
    width: 200px;
    float: left;
    background-color: blue;
  }
  
  .box-right {
    overflow: hidden;
    background-color: red;
  }
  ```

* 解法4：cal计算

  ```css
  .box {
   height: 200px;
  }
  
  .box > div {
    height: 100%;
  }
  
  .box-left {
    width: 200px;
    float: left;
    background-color: blue;
  }
  
  .box-right {
    width: calc(100% - 200px);
    float: right;
    background-color: red;
  }
  ```

* 解法5：左侧绝对定位，脱离标准流，那么两侧就能在同一行，右侧margin-left等于左侧宽度

  ```css
  .box {
    height: 100px;
    position: relative;
  }
  .box-left {
    width: 150px;
    height: 100%;
    background-color: blue;
  
    position:absolute;
  }
  .box-right {
    height: 100%;
    background-color: red;
  
    margin-left: 150px;
  }
  ```

* 解法6:右侧绝对定位，那么两侧就能在同一侧，右侧定位的时候要把left等于左侧宽度

  ```css
  .box {
    height:100px;
    position: relative;
  }
  .box-left{
    width: 150px;
    height: 100%;
    background-color: blue;
  }
  .box-right{
    height: 100%;
    background-color: red;
  
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 150px;
  }
  ```

### 2. **两列自适应** ###

**左侧宽度由内容撑开，右侧撑满剩余宽度**

```html
<div class="outter">
	<div class="left">
  	如果是普通的两列布局，浮动+普通元素的margin便可以实现，<br>
    但如果是自适应的两列布局，<br>
    利用float+overflow:hidden便可以实现，<br>
    这种办法主要通过overflow触发BFC,<br>
    而BFC不会重叠浮动元素。
  </div>
 <div class="right"></div>
</div>
```

- 方法一：左侧浮动，右侧BFC

  ```css
  .outter{
    height: 100vh;  
  }
  .left{
    height: 100%;
    background-color: pink;
  
    float: left; //关键
  }
  
  .right{
    height: 100%;
    background-color: skyblue;
    
    overflow: hidden; //关键
  }
  ```

- 方法二：flex布局，右侧flex-grow:1，使其能放大，从而占满剩余宽度

  ```css
  .outter{
    display: flex;
    height: 100vh;
  }
  .left{
    background-color: pink;
    height: 100%;
  }
  .right{
    flex-grow: 1;  //关键
    
    background-color: skyblue;
    height: 100%;
  }
  ```

  **flex-grow**

  - 定义item的放大比例，**默认值为0，如果有空余空间也不会放大**。

  - container在main axis方向上**有剩余空间**时，才生效

  - 如果item的flex-grow总和sum>1，每个item**扩展的size**为

    container剩余size*flex-grow/sum

  如果所有项目的flex-grow属性都为1，则它们将**等分剩余空间**（如果有的话）。

  如果一个项目的flex-grow属性为2，其他项目都为1，则前者占据的**剩余空间**将比其他项多一倍。

## 三栏布局 ##

### 1.三栏自适应

**中间自适应宽度，两侧固定宽度**

#### **1.圣杯布局** ####

- 结构

```html
<body>
  <div class='container'>
    <div class='center'></div> //center在前面，从而最先渲染出来
    <div class='left'></div>
    <div class='right'></div>
  </div>
</body>
```

- 实现步骤

  - center、right、left均为`float:left`，center宽度100%，则独自占据一行
  - left和right设置负margin，使得和center同一行
  - 包裹三者的container设置padding-left和padding-right，为left和right留位置
  - left和right设置相对定位，移到container留出的空白位置中

  ```css
  .container{
    //为left和right留位置
    padding-left: 200px;
    padding-right: 200px;
  }
  .center{
    float: left;
  
    width: 100%;
    height: 500px;
    background-color: lightgreen;
  }
  .left{
    float: left;
    margin-left: -100%;  
  
    position: relative;
    left: -200px;
  
    width: 200px;
    height: 400px;
    background-color: lightskyblue;
  }
  .right{
    float: left;
    margin-left: -200px;
  
    position: relative;
    right: -200px;
  
    width: 200px;
    height: 400px;
    background-color: lightpink;
  }
  ```

#### **2.双飞翼布局** ####

- 结构

  ```css
  <body>
    <div class='container'>
      <div class='center'> //center在前面，从而最先渲染出来
        <div class='inner'></div>
      </div>
      <div class='left'></div>
      <div class='right'></div>
    </div>
  </body>
  ```

- 实现步骤

  - center、right、left均为`float:left`，center宽度100%，则独自占据一行
  - left和right设置负margin，使得和center同一行
  - inner设置`margin:0 200px`，为left和right留位置

  ```css
  .center{
    float: left;
  
    width: 100%;
    height: 500px;
    background-color: lightgreen;
  }
  .left{
    float: left;
    margin-left: -100%;
  
    width: 200px;
    height: 400px;
    background-color: lightskyblue;
  }
  .right{
    float: left;
    margin-left: -200px;
  
    width: 200px;
    height: 400px;
    background-color: lightpink;
  }
  .inner{
    margin: 0 200px;
  }
  ```

#### **3.flex布局**⭐️⭐️ ####

- 结构

  ```html
  <body>
    <div class='container'>
      <div class='center'></div>  //center在前面，从而最先渲染出来
      <div class='left'></div>
      <div class='right'></div>
    </div>
  </body>
  ```

- 实现步骤

  - container设置flex
  - 此时显示center、left、right的顺序，要把center调整到中间，设置left和right的order属性
  - center要扩充页面剩余部分，故`flex-grow: 1;`
  - left和right宽度通过flex-basis设置，从而在拓宽center前宽度正常

  ```css
  .container {
    display: flex;
  }
  
  .center {
    flex-grow: 1;
  
    width: 100%;
    height: 500px;
    background-color: lightgreen;
  }
  
  .left {
    order: -1;
    flex: 0 0 200px;//flex-grow:0;flex-shrink:0;flex-basis:200px
  
    width: 200px;
    height: 400px;
    background-color: lightskyblue;
  }
  
  .right {
    order: 1;
    flex: 0 0 200px;
  
    width: 200px;
    height: 400px;
    background-color: lightpink;
  }
  ```

### **2. 非自适应**

- 流式布局

  ```css
  <body>
    <div class='container'>
      <div class='left'></div>
      <div class='right'></div>
      <div class='center'></div>  //center最后渲染
    </div>
  </body>
  
  .center {
    margin-left: 210px;
    margin-right: 210px;
    height: 500px;
    background-color: lightgreen;
  }
  
  .left {
    float:left;
  
    width: 200px;
    height: 400px;
    background-color: lightskyblue;
  }
  
  .right {
    float: right;
  
    width: 200px;
    height: 400px;
    background-color: lightpink;
  }
  ```

- BFC

  ```css
  <body>
    <div class='container'>
      <div class='left'></div>
      <div class='right'></div>
      <div class='center'></div>  //center最后渲染
    </div>
  </body>
  
  .center {
    overflow: hidden;   //center变成BFC，不会与浮动元素重叠
    height: 500px;
    background-color: lightgreen;
  }
  
  .left {
    float:left;
  
    width: 200px;
    height: 400px;
    background-color: lightskyblue;
  }
  
  .right {
    float: right;
  
    width: 200px;
    height: 400px;
    background-color: lightpink;
  }
  ```

- 绝对定位

  - container相对定位，子元素left和right绝对定位
  - center设置margin为left和right留位置

  ```css
  <body>
    <div class='container'>
      <div class='center'></div> //center可以先渲染
      <div class='left'></div>
      <div class='right'></div>
    </div>
  </body>
  
  .container{
    position: relative;
  }
  
  .center {
    margin-left: 200px;
    margin-right: 200px;
    
    height: 500px;
    background-color: lightgreen;
  }
  
  .left {
    position: absolute;  //脱离了文档流，后代元素也脱离了文档流，高度未知会有问题
    top:0;
    left: 0;
    
    width: 200px;
    height: 400px;
    background-color: lightskyblue;
  }
  
  .right {
    position: absolute;
    top: 0;
    right: 0;
  
    width: 200px;
    height: 400px;
    background-color: lightpink;
  }
  ```