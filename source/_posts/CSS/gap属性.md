---
layout: post
title: CSS中的gap属性
date: 2022-03-31 20:44:02
tags: CSS
categories: 1.1-CSS
description: gap属性在开发中的trick
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: gap-property
---
## gap属性

> 阅读指南：
>
> 1. 首先介绍了gap属性的进化史，有必要阅读下，了解gap为何而出现
> 2. 然后是开发中常见的Flex布局（important，个人最喜欢的）、Grid布局中的用法；
> 3. 最后推荐csstricks的一篇文章，文中有很多的动效demo，可供尝试；

### 1、CSS gap属性进化史

> 可参考张鑫旭大佬的这篇文章：https://www.zhangxinxu.com/wordpress/2020/06/css-gap-history/
>
> 文章的总结：
>
> 1. Multi-column布局首先支持了`column-gap`属性。
> 2. Grid布局规范模块独立发展，出现了grid布局独有的间隙属性`grid-gap`，`grid-row-gap`和`grid-column-gap`。
> 3. 站在CSS世界整体视角，CSS间隙属性出现了内耗。于是，规范调整，保留列间隙和行间隙的概念，但是CSS属性向已经存在的`column-gap`属性靠拢。于是，`gap`，`row-gap`和`column-gap`属性诞生，成为CSS世界中统一的间隙属性。
> 4. Multi-column布局也额外支持了`gap`和`row-gap`属性，只是多栏布局没有行间隙概念，因此`row-gap`属性并无渲染效果。
> 5. Flex布局也采用间隙的概念，支持了统一的`gap`属性，只是刚支持不久

### 2、grid布局的gap

> 参考mdn文档：https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout

`gap` 并非是新的属性，它一直存在于多栏布局 `multi-column` 与 grid 布局中，其中：

- `column-gap` 属性用来设置多栏布局 `multi-column` 中元素列之间的间隔大小
- grid 布局中 `gap` 属性是用来设置网格行与列之间的间隙，该属性是 `row-gap` 和 `column-gap` 的简写形式，并且起初是叫 `grid-gap`

#### 2.1 布局demo：

```html
<div class="grid-container">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
    <div class="item">4</div>
    <div class="item">5</div>
</div>
```

```css
.grid-container {
    display: grid;
    border: 5px solid;
    padding: 20px;
    grid-template-columns: 1fr 1fr 1fr;
}
.item {
    width: 100px;
    height: 100px;
    background: deeppink;
    border: 2px solid #333;
}
```

<img src="https://mynightwish.oss-cn-beijing.aliyuncs.com/img/1460000039855201.png" alt="grid 布局" style="zoom:67%;" />

- 通过给 `grid-container` 添**加 `gap` 属性**，可以设置网格行与列之间的间隙：

```css
.grid-container {
    display: grid;
    border: 5px solid;
    padding: 20px;
    grid-template-columns: 1fr 1fr 1fr;
+   gap: 5px;
}
```

<img src="https://segmentfault.com/img/remote/1460000039855202" alt="img" style="zoom:67%;" />

### 3、flex中的gap

> 从 **Chromium 84** 开始，可以在 `flex` 布局中使用 `gap` 属性。作用与在 grid 布局中的类似，可以控制水平和竖直方向上 flex item 之间的间距：

- `gap` 属性的优势在于，它避免了传统的使用 `margin` 时，要考虑**第一个或者最后一个元素的左边距或者右边距的烦恼**。正常而言，4 个水平的 `flex item`，它们就应该只有 3 个间隙。
- `gap` 只生效于两个 `flex item` 之间。

#### 布局demo1：

```css
.flex-container {
    width: 500px;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    justify-content: center;
    border: 2px solid #333;
}

.item {
    width: 80px;
    height: 100px;
    background: deeppink;
}
```

![img](https://mynightwish.oss-cn-beijing.aliyuncs.com/img/1460000039855203.png)

#### 布局demo2：

- HTML：

  ```html
  <div id="flexbox">
    <div>1111</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
    <div>6</div>
  </div>
  ```

- CSS:

  ```css
  #wrapper {
  	background-color: #777;
  }
    #flexbox {
    display: flex;
    flex-wrap: wrap; 
    width: 300px;
    gap: 20px 10px;
  }
  
  #flexbox > div {
    border: 1px solid green;
    background-color: pink;
    flex: 1 1 auto;  // 以指定宽度作为basis，可拉伸，可收缩
    width: 100px;
    height: 50px;
  }
  ```

- 效果：

  <img src="https://mynightwish.oss-cn-beijing.aliyuncs.com/img/image-20220331202347208.png" alt="image-20220331202347208" style="zoom:25%;" />

  **flex换行显示：flex-wrap：wrap**

  - 会在满足gap间距的情况下，计算一行最大能凑够几个，显示的每项实际宽度可能会拉伸；
  - 比如：一行宽300 每个盒子定死 100 gap要求 10 此时，只能显示2个，一行两列，间隔10 每个盒子实际 145；

  **flex是不换行：默认属性**

  - 在满足间距下，计算一行最大能凑够几个，如果不够，会压缩显示。

  - 如果这里的gap能够满足盒子，就

### 4、小结

本文简单介绍了gap属性，主要用于解决开发中的margin左右第一个和第4个问题；

更多关于它的用法，可参考MDN文档等资料：https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout

更多关于它的demo，推荐阅读：https://css-tricks.com/almanac/properties/g/gap/
