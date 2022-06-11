---
title: CSS的定位
tags:
  - position
categories: 1.1-CSS
description: 关于css中的定位
cover: >-
  https://images.unsplash.com/photo-1633113093730-47449a1a9c6e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80
abbrlink: 619926249
date: 2021-12-11 22:38:13
---
## 定位 ##

### 1、定位position ###

* **static：**         正常文档流的位置（从上到下，从左到右）

* **relative**：    不脱标， 相对于原本占据的位置，且占用原位    不会改变元素的性质

* **absolute**       脱标   

  * 会改变元素的性质：行内元素变行内块元素，在不手动设置宽高的情况下，该元素的大小为内容的大小，在设置宽高时，大小变为设置的宽高

  * 会提升元素层级：可以进行覆盖

  * 绝对定位元素是**相对于包含块进行定位的：**其实就是，相对于第一个不是static的父元素定位，如果没有，就以html元素为基准

    **包含块概念**：离当前元素最近的祖先块元素

    这里的**包含块概念**：离当前元素最近的，开启了定位的祖先元素。如果所有的祖先元素都没有开启，就相对于html根元素，也是初始包含块

* **fixed：**          脱标        相对于浏览器窗口

  * 大部分特点跟绝对定位很像，唯一不同的是他们的参考系一定是视口（不会随滚动条，固定不动）
  * 会改变元素的性质：行内元素变行内块元素，在不手动设置宽高的情况下，该元素的大小为内容的大小，在设置宽高时，大小变为设置的宽高

* **sticky：**  基于用户的滚动位置来定位，在 **relative** 与 **fixed** 之间切换

  * 一般它的行为就像 **relative**
  * 而当页面滚动超出目标区域（特定阈值top, right, bottom 或 left 之一）时，表现就像 **fixed**固定在目标位置

  * 指定 top, right, bottom 或 left 四个阈值其中之一，才可使粘性定位生效。否则其行为与相对定位相同

  * 相对于：一个sticky元素会“固定”在离它最近的一个有“滚动机制”的祖先上（当该祖先的`overflow` 是 `hidden`, `scroll`, `auto`, 或 `overlay`时），即便这个祖先不是最近的真实可滚动祖先

### 2、绝对定位的水平垂直方向布局  ###

```
子元素Σmargin +border + padding + width +绝对定位的left right=父元素宽度
```

#### 水平方向： ####

* 当发生过度约束的时候：

  1. 如果9个值没有auto就调整right

  2. 如果有auto就调整auto，可以设置auto的值是：

     ```
     width、margin、left、right
     ```

  3. left right的默认值是auto，如果不指定这几个值，默认有auto的值。当等式不满足时，会自动调整这两个值。所以使用margin auto设置居中时，要写上left、right为0。否则会调默认的left、right

#### 垂直方向： ####

垂直方向的等式也必须满足：

```
top + margin2 + padding2 + height + buttom = h
```

* 当过度约束时，

  1. 如果9个值没有auto就调整buttom

  2. 如果有auto就调整auto，可以设置auto的值是：

     ```
     height、margin、top、buttom
     ```

  3. top、buttom的默认值是auto，如果不指定这几个值，默认有auto的值。当等式不满足时，会自动调整这两个值。所以使用margin auto设置居中时，要写上top、buttom为0。否则会调默认的top、buttom