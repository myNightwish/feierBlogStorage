---
title: CSS的动画
date: 2021-12-11 22:44:19
tags:
- 动画
categories: CSS
description: '动画'
cover: https://images.unsplash.com/photo-1638720772346-b745bcd72f5f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=577&q=80
copyright_author: 飞儿 # 作者覆写
copyright_url: https://www.nesxc.com/post/hexocc.html 
license: CC BY-NC-SA 4.0
license_url: https://creativecommons.org/licenses/by-nc-sa/4.0/
---
## 动画 ##

### 1、过渡transition ###

通过过渡，可以指定一个属性发生变化时的切换方式

* transition-property 过渡属性

  ```
  transition-property: width;
  ```

  指定需要过渡的属性，多个属性间用逗号隔开；

  如果所有属性都需要过渡，则可以使用all关键字。

  大部分有数值的属性，都支持过渡效果。注意：过渡时，必须从一个有效值向另外一个有效值进行过渡，不支持auto

* transition-duration 过渡持续时间：

  可以分别指定时间，用 , 号隔开；

  时间单位包括秒和毫秒

* transition-timing-function   为过渡效果指定过渡的的执行方式

  ```
  可选值：
  ease 默认值，慢速开始，先加速，后减速
  linear 匀速运动
  ease-in 加速运动
  ease-out 减速运动
  ease-in-out 先加速后减速
  cublic-bezier() 指定时许函数
  step(步数, 执行时间) 分步执行过渡效果
    执行时间：
    start 时间开始时执行
    end 时间结束时执行，默认值
  ```

* transition-delay 过渡等待时间

* transition：简写属性，同时设置过渡相关的所有属性
  注意：无先后顺序
  如果存在过渡效果等待时间和延迟时间两种时间，第一个是持续时间，第二个是等待时间

  ```
  transition: 2s margin-left 1s;
  ```

### 2、动画animation ###

动画和过渡**最大的区别是能否自动触发**

* 设定动画效果，必须先设置关键帧

  ```css
  @keyframes 关键帧名称 {
    /* 表示动画开始位置 from可以用 0% 代替 */ 
    from {
     margin-left:0;
    }
    /* 表示动画结束位置 to可以用 100% 代替*/
    to {
      margin-left: 700px;
    }
  }
  ```

* 动画相关的属性：

  ```
  animation-name 动画名称   --与关键帧名称对应，要对当前元素生效的关键帧名称
  animation-duration 动画持续时间
  animation-timing-function 动画效果
  animation-delay 动画等待时间
  animation-iteration-count 动画执行次数
  	--可选值 ：数字
  		infinite 无限次
  animation-direction 动画执行方向
  	--可选值：
      normal 从 from 到 to 执行
      reverse 从 to 到 from 执行
      alternate 从 from 到 to 到 from 执行
      alternate-reverse 从 to 到 from 到 to 执行
  animation-play-state 动画播放状态
   -- 可选值：
      running 默认值，运行
      paused 动画暂停
  animation-fill-mode 动画填充模式
  	--可选值：
        none 默认值，动画执行完后回到原来位置
        forwards 动画执行完后停留在最后位置
        backwards 动画等待时，元素处于 from 状态，结束时返回原来位置，与animation-delay 连用
        both 动画等待时，元素处于from状态，结束时停留在最后位置
  ```

* 简写：

  ```
  没有顺序要求，注意 animation-duration 写在 animation-delay 之前
  ```

### 3、transform     C3新增属性 ###

#### 1、平移translate ####

改变元素形状或位置，不会影响页面布局（不会脱离文档流，也不会对别的元素影响，比如挤别的盒子）

* 位置：
  1. 设置该属性的元素，相对于自己原位置来改变，不脱标
  2. 位移时，默认原点是元素的中心位置

* 使用场景：水平垂直居中

##### 1、X、Y轴平移： #####

在平移元素时，百分比是相对于自身计算

* +： 向右、向下        -： 向左、向上

```css
transform: translateX() 延 X 轴平移
transform: translateY() 延 Y 轴平移
transform: translateZ() 延 Z 轴平移
```

水平垂直居中：

1. position: absolute; 法，仅适用于高度宽度固定的情况
2. translateX() 法，优点宽度高度不用固定，无论内容多少都居中

##### 2、Z轴平移： #####

* translateZ() 用于立体效果

* 默认情况下网页不支持透视，如果需要看见效果，必须预先设置网页的视距, 即 在 <html>标签中设置属性 perspective（ 800 px ~ 1200 px 之间）

  加了以后，浏览器会调整元素和人眼之间的距离，距离越大，离人越近，距离越小，离人越远

#### 2、旋转rotate ####

默认情况下网页不支持透视，如果需要看见效果，必须预先设置网页的视距, 即 在 <html>标签中设置属性 perspective 800 px ~ 1200 px 之间

##### 旋转：与 translate 连用，先后位置影响视觉效果 #####

* 单位： deg 度数
* turn：圈数

```css
transform: rotateX()        --transform: rotateX（30deg）
transform: rotateY()
transform: rotateZ()
```

* 属性：

  * backface-visibility 是否显示背面，默认值为visible，设置成hidden的时候，不显示背面

  * transform：preserve-3d 设置元素3D的变形效果

  * opacity：设置透明度

    rgba()和opacity都能实现透明效果,但最大的不同是opacity作用于元素,以及元素内的所有内容的透明度,而rgba()只作用于元素的颜色或其背景色

#### 3、缩放scale ####

```css
transform: scaleX() 水平缩放  缩放系数 
transform: scaleY() 垂直缩放
transform: scaleZ():Z轴方向缩放，这个时候只有当当体现3D效果时才能看的出来效果

transform: scale() 双向缩放
```

* 属性：

  transform-origin 变形原点：默认 center，当设置其他值时，改变变形的起始点

* 使用举例：

  ```
  transform：scale(1.5); //元素放大1.5倍，如果要缩小0.5倍就将设为0.5即可，默认数值等于1
  ```

  <img src="https://img-blog.csdnimg.cn/20201023165659716.gif" alt="img" style="zoom: 25%;" />
