---
title: transform动画基本使用
tags: CSS动画
categories: 1.1-CSS
description: CSS动画2：transform基本使用
cover: >-
  https://images.unsplash.com/photo-1640398251733-33c23a4c36f1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=388&q=80
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: 680535600
date: 2021-12-25 23:10:48
---

### transform  C3新增 ###

使用 `transform` 规则控制元素的变形操作，包括控制移动translate、旋转rotate、缩放scale、倾斜skew、3D转换等

#### 1、translate位移 ####

##### 基本使用 #####

* 改变元素形状或位置，不会影响页面布局（**不脱标**，也不会对别的元素影响，比如挤别的盒子）

  ```css
  transform: translate(x,y)	 // 定义 2D 转换， 同时控制x, y  不定宽高时，实现水平垂直居中
  transform: translate3d(x, y, z)  // 3d效果 同时控制X/Y/Z轴的移动，三个值必须输入如果某个轴不需要移动时设置为零
  
  transform: translateX() 延 X 轴平移  +： 向右、向下        -： 向左、向上
  transform: translateY() 延 Y 轴平移 
  transform: translateZ() 延 Z 轴平移
  ```

##### 遵守的规则： #####

1. 重复设置变形操作时只在原形态上操作，同时设置多个，只有最后一个生效；除非，伪类上在原有基础上，再进行这样的位移，这样的可以生效

2. 设置该属性的元素，相对于自己原位置来改变，**不脱标**

3. 位移时，**默认原点**是元素的中心位置；

4. 在平移元素时，可以是具体像素或百分比，百分比是相对于自身计算

5. 行内元素不产生变形效果，将其转为 `inline-block` 或 `block` 以及弹性元素时都可以产生变化效果

   ```css
   <span>算法大多数</span>
   span {
     display: inline-block;
     transition: 2s;
     transform: translateX(100px) translateX(50px);
     width: 100px;
     height: 100px;
     background: #9b59b6;
   }
   span:hover {
     transition: 2s;
     transform: translateX(100px);
   }
   ```

##### translateZ： #####

* 控制Z轴移动，正向外、负向里移动。因为Z轴是透视轴没有像X/Y一样的固定尺寸，so不能用百分数

* 如果想体现纵向的视觉效果：需要设置perspective，加了后才有近大远小的效果；

  <img src="https://doc.houdunren.com/assets/img/Untitled-7827784.63fc4fc8.gif" alt="Untitled" style="zoom:25%;" />

#### 2、scale缩放 ####

* 对元素进行等比例缩放：

  ```css
  transform: scale(x, y)  按n倍缩放  n>1放大效果，<1 缩小效果
  transform: scale3d(x, y, z) 沿X/Y/Z三个轴绽放元素
  
  transform: scaleX() 
  transform: scaleY()
  transform: scaleZ() // 沿Z轴缩放元素，需要有3D透视才可以查看到效果
  ```

* 应用场景：

  **菜单缩放：**

  * 效果：鼠标放上去，子菜单显示；不放上去，不显示子菜单；
  * 实现：
    * 没放上去时：缩放transform：scale（0）
    * 放上去后，再显示出来：scale（1）
    * 默认缩放原点是中心，如果想左上方式： transform-origin：left top;

  **图片放大**

#### 3、rotate旋转 ####

* 默认绕着中心位置旋转

* 一般不会单独使用，会结合keyframes关键帧使用 或者与 translate 连用，先后位置影响视觉效果

  ```css
  transform: rotate()// 在X与Y轴平面旋转，效果与使用 rotateZ 相同
   - x, y 一样时，沿着对角线旋转
   - 谁大，转的时候偏那边的较多
  rotate3d(tx,ty,tz,angle) //  同时设置X/Y/Z轴的旋转向量值来控制元素的旋转
  
  transform: rotateX(0-360度) // rotateX（30deg）
  transform: rotateY()
  transform: rotateZ()  // 沿Z轴旋转元素，效果就是沿 X/Y轴的平面 旋转
  ```

* 旋转90deg不可见；旋转89deg，只会看到一条线

* 父级透视：当X旋转90度后无法看到元素，这时可以控制父级旋转从上看子元素。

* 只旋转x轴：

  ```css
  main {
    perspective: 600px;
    transform: perspective(600px) rotateY(35deg);
    transition: 2s;
  }
  // 只旋转x轴：
  body:hover main {
  	transform: perspective(600px) rotateY(35deg) rotate3d(1, 0, 0, -645deg);
  }
  // 只旋转y轴
  body:hover main {
  	transform: perspective(600px) rotateY(-645deg);
  }
  // xy旋转
  body:hover main {
  	transform: perspective(600px) rotateY(35deg) rotate3d(1, 1, 0, -645deg);
  }
  // xz旋转：加入适当的Z向量值，可增加元素沿Z轴旋转的力度。
  body:hover main {
  	transform: perspective(600px) rotateY(35deg) rotate3d(1, 0, .5, -245deg);
  }
  ```

#### 4、skew倾斜变换 ####

* 对元素进行倾斜：

  ```css
  transform: skew(x, y);  // x、y轴的同时倾斜角度
  transform: skewX();
  transform: skewY();
  ```

#### 5、旋转点transform-origin ####

* 变化的起点：默认 center，用**transform-origin** 可以改变变形的起始点

* 元素移动不受变形基点所影响：基点是元素原始空间位，而不是translate移动后的空间位

* rotate、skew都可以

  ```css
  transform-origin: left/right  center/bottom;
  transform-origin: left top;   === 0 0;  左上角  1, 1  中心原点  
  transform-origin: 100%， 100%;  右下角  === right bottom
  transform-origin: 200% 200%;  /* 可以在外部，也可以在内部*/  也可以是具体像素位置
  ```

#### 6、透视perspective： ####

##### 1、perspective #####

* 视觉效果上：近大远小

* 舞台透视：

  * `perspective` 规则用于**将父级整个做为透视元素**，会造成里面的每个子元素的透视是不一样的。就像现实中摆一排杯子，是使用统一透视的，每个杯子的透视不一样，造成有大有小。

* 单独透视：

  * `perspective` 函数用于为元素设置单独透视，每个元素的透视效果是一样的

* 3D透视：transform-style用于控制3d透视

  * 应用于舞台即变形元素的父级元素

  * 设置 `overflow:visible` 时 `preserve-3d` 才无效

    ```css
    flat	2D平面舞台
    preserve-3d	3D透视舞台
    ```

##### 2、视角perspective-origin #####

1. `perspective-origin`用于控制视线的落点，就像我们眼睛看物体时的聚焦点。

2. 可以理解眼镜看物体的位置，比如看一台汽车，是在看车头左边看还是车头右边看。

   * 需要设置 `perspective` 透视后才可以看到效果。

   * 一般设置在舞台元素上来控制子元素

3. 使用规则：
   * x-axis：定义该视图在 x 轴上的位置。默认值：50%。可值：left、center、right、length、%
   * y-axis：定义该视图在 y 轴上的位置。默认值：50%。可值：top、center、bottom、length、%