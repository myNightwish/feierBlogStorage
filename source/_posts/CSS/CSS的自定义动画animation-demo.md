---
title: animation动画的demo
tags: CSS动画
categories: 1.1-CSS
description: CSS动画3：animation之demo
cover: >-
  https://images.unsplash.com/photo-1640404880570-2b61bf155ebf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: 511687579
date: 2021-12-25 23:27:27
---


## 明天再复习一下，会再更新的....

### animation动画demo ###

#### 实现物体移动 ####

<img src="https://doc.houdunren.com/assets/img/Untitled-8874535.c42328d7.gif" alt="Untitled" style="zoom:33%;" />

* 定义不同时间点来让物体元素移动一圈，这里就可以不设置`from/to` 系统将定义为元素初始状态。

  ```html
  <main>
  	<div></div>
  </main>
  ```

  ```css
  main {
    width: 400px;
    height: 400px;
    border: solid 2px white;
  }
  
  div {
    width: 100px;
    height: 100px;
    background-color: #e67e22;
    animation-name: hd;
    animation-duration: 3s;
  }
  
  @keyframes hd {
    0% {}  // 不设置：仍然是原始状态
    25% {
      transform: translateX(300%);
    }
    50% {
      transform: translate(300%, 300%);
    }
    75% {
      transform: translate(0, 300%);
    }
    to {}
  }
  ```

#### 炫彩背景 ####

<img src="https://doc.houdunren.com/assets/img/Untitled-8878649.86285441.gif" alt="Untitled" style="zoom: 25%;" />

声明三个动画，使用 `animation-duration`为每个动画设置不同执行的时间

* DOm结构：

  ```css
  <main></main>
  main {
    background: #34495e;
    animation-name: scale, colors, rotate;
    animation-duration: 1s, 5s, 1s;   // 3种动画执行次数不同
    animation-fill-mode: forwards;
  }
  ```

* 旋转、颜色、大小：

  ```css
  @keyframes scale {
    from {
      width: 0;
      height: 0;
    }
    to {
      width: 100vw;
      height: 100vh;
    }
  }
  
  @keyframes colors {
    0% {
      background: #e67e22;
    }
    50% {
      background: #34495e;
    }
    100% {
      background: #16a085;
    }
  }
  
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(-360deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  ```

#### 心动的感觉 ####

<img src="https://doc.houdunren.com/assets/img/Untitled-8894047.f0ee8861.gif" alt="Untitled" style="zoom:33%;" />

* 心的构成：两个圆+正方形，圆把正方形压住。整体旋转正

  <img src="https://doc.houdunren.com/assets/img/image-20190919170506721.7bd12d30.png" alt="image-20190919170506721" style="zoom:25%;" />

```html
<main>
  <div class="heart"></div>
</main>
```

```css
.heart {
  width: 200px;
  height: 200px;
  background: #e74c3c;
  transform: rotate(45deg);/*旋转变正*/
  position: relative;
  animation-name: heart;
  animation-duration: 1s;
  animation-iteration-count: 1;
}

.heart::before {   /* 两个圆的1号圆：圆的直径等于正方形的边长*/
  content: '';
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: #e74c3c;
  position: absolute;
  transform: translate(-50%, 0px);  /* 在垂直方向居中 */
}

.heart::after {  /* 两个圆的2号圆*/
  content: '';
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: #e74c3c;
  position: absolute;
  transform: translate(0%, -50%);
}

@keyframes heart {
  from {
    transform: scale(.3) rotate(45deg); /*此处的rotate(45deg)不要拿掉了，原本是这样的*/
  }
  to {
    transform: scale(1) rotate(45deg);/*变大：跳动*/
  }
}
```

#### 多个心跳 ####

<img src="https://doc.houdunren.com/assets/img/Untitled-9072635.d0d86895.gif" alt="Untitled" style="zoom:33%;" />

* Dom结构：

  ```html
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
  <li>
    <i class="fa fa-heart" aria-hidden="true"></i>
    <span>normal</span>
  </li>
  <li>
    <i class="fa fa-heart" aria-hidden="true"></i>
    <span>reverse</span>
  </li>
  <li>
    <i class="fa fa-heart" aria-hidden="true"></i>
    <span>alternate</span>
  </li>
  <li>
    <i class="fa fa-heart" aria-hidden="true"></i>
    <span>alternate-reverse</span>
  </li>
  ```

* 主要样式部分：

  ```css
  ul {
    // 设置具体宽高....
    display: flex;
  }
  
  li {
  // 设置li下面列方向排列....
    flex: 1;
  }
  
  i.fa {
    margin: 5px;
    animation-name: hd;  
    animation-duration: 2s;
    animation-iteration-count: infinite;
  }
  li:nth-child(1)>i.fa {
    animation-direction: normal;
  }
  li:nth-child(2)>i.fa {
    animation-direction: reverse;
  }
  li:nth-child(3)>i.fa {
    animation-direction: alternate;
  }
  li:nth-child(4)>i.fa {
    animation-direction: alternate-reverse;
  }
  
  @keyframes hd {
    to {
      opacity: 1;
      transform: scale(3);
    }
  }
  ```

#### 弹跳的小球 ####

<img src="https://doc.houdunren.com/assets/img/Untitled-8895617.c0966e33.gif" alt="Untitled" style="zoom:25%;" />

* 使用合适的运动方向 `alternate-reverse` 制作跳动的小球：0-100  100 -0

  * 球落下和弹起，相反的过程；
  * 落下和弹起时阴影模糊程度变大，减轻

  ```html
  <main>
      <div></div>
      <section></section>  // 设置阴影
  </main>
  ```

  ```css
  div {
    /* 设置球的样式 */ ....省略
    animation-name: ball;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-direction: alternate-reverse;
  }
  
  @keyframes ball {
    100% {
      transform: translateY(-600px);
    }
  }
  
  section {
    width: 400px;
    height: 10px;
    border-radius: 50%;
    animation-name: shadow;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }
  
  @keyframes shadow {
    from {
      background: rgb(0, 0, 0, .9);
      transform: scale(1);
    }
  
    to {
      background: rgb(0, 0, 0, .1);
    }
  }
  ```

#### 微场景 ####

<img src="https://doc.houdunren.com/assets/img/Untitled-8899531.e8d14a71.gif" alt="Untitled" style="zoom: 33%;" />

* 基本Dom结构：

  ```html
  <header>
    后盾人
  </header>
  <main>
    <div class="lesson">
      系统课程是多个实战课程的组合，用来全面掌握一门
    </div>
    <div class="video hd-translate">
      fsgdgfh艾弗森课程的组合，用来全面掌握一门语
    </div>
  </main>
  <footer>
    houdunren.com
  </footer>
  ```

* CSS部分：重点是动画设置：

  ```css
  header {
    animation-name: hd-translate;  // 隐藏---出现
    animation-duration: 500ms;
  }
  
  main {
    animation-name: hd-rotate;  // 隐藏---出现 +选择1圈（xy平面）
    animation-duration: 1s;
    animation-fill-mode: forwards;
  }
  main>.lesson {
    //... 基本布局
    transform: translate(-100vw, -100vh); //控制原始状态隐藏
    animation-name: hd-rotate;
    animation-duration: 1s;
    animation-delay: 1s;
    animation-fill-mode: forwards;
  }
  main>.video {
    //... 基本布局
    animation-name: hd-translate;
    animation-duration: 1s;
    animation-delay: 2s;
    transform: translate(-100vw, -100vh);
    animation-fill-mode: forwards;
  }
  
  footer {
    //... 基本布局
    animation-name: hd-skew; // 倾斜
    animation-duration: 500ms;
    animation-delay: 3s;
    transform: translateX(-100vw);
    animation-fill-mode: forwards;
  }
  
  @keyframes hd-translate {
    from {
      transform: translate(-100vw, -100vh); 
    }
    to {
      transform: translateY(0);
    }
  }
  
  @keyframes hd-rotate {
    from {
      transform: translate(-100%, -100%);
    }
    to {
      transform: translateX(0) rotate(360deg);
    }
  }
  
  @keyframes hd-skew {
    from {
      transform: translateX(-100%) skew(-45deg);
    }
    to {
      transform: skewX(0deg);
    }
  }
  ```

#### 柱状起落 ####

<img src="https://doc.houdunren.com/assets/img/Untitled-9379048.a9342460.gif" alt="Untitled" style="zoom:25%;" />

* 5条不同的柱状，下降曲线不同的效果

* Dom结构：

  ```html
  <ul>
      <li>ease</li>
      <li>ease-in</li>
      <li>ease-out</li>
      <li>ease-in-out</li>
      <li>linear</li>
  </ul>
  ```

* 样式设置：

  * 

  ```css
  body {
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: 1fr;  //只有1行1列
  }
  
  body::before {
    content: 'houdunren.com';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%);
    opacity: .5;
  }
  
  ul {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: repeat(5, 1fr);  // 1行5列
    gap: 10px;   //每列间隔
  }
  
  li {
    box-sizing: border-box;
    animation-name: move;
    animation-duration: 3s;
    animation-iteration-count: infinite;
  }
  
  li:nth-child(1) {
    animation-timing-function: ease;
  }
  li:nth-child(2) {
    animation-timing-function: ease-in;
  }
  li:nth-child(3) {
    animation-timing-function: ease-out;
  }
  li:nth-child(4) {
    animation-timing-function: ease-in-out;
  }
  li:nth-child(5) {
    animation-timing-function: linear;
  }
  
  @keyframes move {
    to {
      transform: translateY(90vh);
    }
  }
  ```

#### 改进弹跳小球 ####

<img src="https://doc.houdunren.com/assets/img/Untitled-9139804.a095202a.gif" alt="Untitled" style="zoom:25%;" />

* 改进的点：优化小球弹起过程幅度越来越小

* 如果想多个小球，可以再设置一个，位置上区分开，动画延时错开

  ```
  <div></div>
  ```

  ```css
  div {
    //...
    transform: translate(0vw, 0);
    background: radial-gradient(at right top, #f39c12, #d35400);
    border-radius: 50%;
    animation-name: jump;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in;
  }
  
  @keyframes jump {
    0% {
      transform: translateY(0);
      animation-timing-function: ease-in;
    }
  
    30% {
      transform: translateY(10vh);
      animation-timing-function: ease-in;
    }
  
    60% {
      transform: translateY(40vh);
      animation-timing-function: ease-in;
    }
  
    80% {
      transform: translateY(60vh);
      animation-timing-function: ease-in;
    }
  
    95% {
      transform: translateY(75vh);
      animation-timing-function: ease-in;
    }
  
    15%,45%,70%,85%,100% {
      transform: translateY(80vh);
      animation-timing-function: ease-out;
    }
  }
  ```

#### 魔术的小球 ####

<img src="https://doc.houdunren.com/assets/img/Untitled-8904065.907dbaa9.gif" alt="Untitled" style="zoom:33%;" />

* 效果：一群球不同时间进去，不同时间出来

* 乱跳的效果：控制动画%更小一点，精细一点

  ```html
  <div></div>
  <div></div>
  <div></div>
  ```

  ```css
  div {
    // ....
    transform: translate(-20vw, -300%);
    background: radial-gradient(at right top, #f39c12, #d35400);
    border-radius: 50%;
    animation-name: jump;
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in;
  }
  div:nth-child(2) {
    animation-delay: .2s;    /*分别延迟不同的时间*/
  }
  div:nth-child(3) {
    animation-delay: 1s;
  }
  
  @keyframes jump {
    0% {
      transform: translate(-20vw, -300%);
    }
    10% {
      transform: scaleY(.9) translate(15vw, 0%);
    }
    20% {
      transform: translate(20vw, -200%);
    }
    30% {
      transform: scaleY(.9) translate(30vw, 0%);
    }
    40% {
      transform: translate(40vw, -120%);
    }
    50% {
      transform: scaleY(.9) translate(50vw, 0%);
    }
    60% {
      transform: translate(60vw, -70%);
    }
    70% {
      transform: scaleY(.9) translate(70vw, 0%);
    }
    80% {
      transform: translate(80vw, -50%);
    }
    90% {
      transform: scaleY(.9) translate(90vw, 0%);
    }
    95% {
      transform: translate(95vw, -30%);
    }
    100% {
      transform: scaleY(.9) translate(100vw, 0%);
    }
  }
  
  @keyframes move {
    0% {
      /* transform: translateY(-400%); */
    }
  
    100% {
      /* right: 100px; */
    }
  }
  ```

#### 按钮提交 ####

* 模拟向后台提交数据时，等待的那种效果

  ```css
  /* 只保留了主要功能代码 */
  button::after {
    content: '';
    display: inline-block;
    height: 3px;
    width: 3px;
    /*移动第一个宽度   3个宽度   5个宽度*/
    box-shadow: 3px 0 currentColor, 9px 0 currentColor, 15px 0 currentColor;
    
    animation-name: point;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    margin-left: 5px;
  }
  
  @keyframes point {
    from {
      box-shadow: none;  //起始的时候没有点
    }
    30% {
      box-shadow: 3px 0 currentColor; // 只有1个点
    }
    60% {
      box-shadow: 3px 0 currentColor, 9px 0 currentColor; //2个点
    }
    90% {
      box-shadow: 3px 0 currentColor, 9px 0 currentColor, 15px 0 currentColor; //3个点
    }
  }
  ```

  * 阴影使用API：原理就是底下有个黑盒子，所以最大水平移动自己宽度，再继续移就出来了。

  * 如果给某个元素设置颜色color，就是阴影的颜色

  * background-color:orange;是元素本身的颜色

  * concurentColor：指的是当前的文本颜色

    ```css
    box-shadow: h-shadow v-shadow blur spread color inset;
    ```

    | 值         | 描述                                     |
    | :--------- | :--------------------------------------- |
    | *h-shadow* | 必需。水平阴影的位置。允许负值。         |
    | *v-shadow* | 必需。垂直阴影的位置。允许负值。         |
    | *blur*     | 可选。模糊距离。                         |
    | *spread*   | 可选。阴影的尺寸。                       |
    | *color*    | 可选。阴影的颜色。请参阅 CSS 颜色值。    |
    | inset      | 可选。将外部阴影 (outset) 改为内部阴影。 |

#### 步进动画steps ####

<img src="https://doc.houdunren.com/assets/img/Untitled-9469170.45d93747.gif" alt="Untitled" style="zoom:33%;" />

* `steps(n,start)` 可以简单理解为从第二个开始，`steps(n,end)` 从第一个开始

  ```css
  <main>
      <div>1 <small>houdunren.com</small></div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>5</div>
      <div>6</div>
      <div>7</div>
      <div>8</div>
  </main>
  ```

  ```css
  div:nth-child(5)::before {
    content: 'END';
    position: absolute;  //父元素相对定位，z-index浮在上面
    width: 100px;
    height: 100px;
    background: #e67e22;
    left: 0;
  
    animation-name: move;
    animation-duration: 5s;
    z-index: 2;
    animation-timing-function: steps(4, end);
    animation-iteration-count: infinite;
  }
  
  div:nth-child(1)::after {
    content: 'START';
    position: absolute; 
    left: 0;
    top: 0;
    width: 100px;
    height: 100px;
    background: #9b59b6;
  
    animation-name: move;
    animation-duration: 2s;
    animation-timing-function: steps(4, start); //从2开始的
    animation-iteration-count: infinite;
    z-index: 2;
  }
  
  @keyframes move {
    to {
      transform: translateX(400px);
    }
  }
  ```

* 修改效果为：在1-2之间来回走

  <img src="https://doc.houdunren.com/assets/img/Untitled-9484950.4ca2375f.gif" alt="Untitled" style="zoom:33%;" />

  * 此时如果只是修改translate的距离100，step的n为1就不可以，不会动，因为你只有1步

    ```css
    div:nth-child(1)::before,
    div:nth-child(5)::before {
      animation-name: hd;
      animation-iteration-count: infinite;
      animation-duration: 2.5s;
      z-index: 2;
    }
    
    div:nth-child(1)::before {
      content: 'START';
      width: 100px;
      height: 100px;
      background: #8e44ad;
      position: absolute;
      left: 0;
      top: 0;
      animation-timing-function: step-start;
    }
    
    div:nth-child(5)::before {
      content: 'END';
      width: 100px;
      height: 100px;
      background: #27ae60;
      position: absolute;
      left: 0;
      top: 0;
      animation-timing-function: step-end;
    }
    
    @keyframes hd {
      50% { 
        transform: translateX(100px);  //修改此处
      }
    
      to {
        transform: translateX(0px);  //回到原处
      }
    }
    ```

#### 纯css轮播 ####

<img src="https://doc.houdunren.com/assets/img/Untitled-9059867.a86bf9bf.gif" alt="Untitled" style="zoom: 33%;" />

* 使用无JS参与的图片轮换效果，图片切换使用`steps` 步进与`animation-play-state`播放状态

  ```html
  <main>
    <section>
      <div><img src="1.jpg" alt=""></div>
      <div><img src="2.jpg" alt=""></div>
      <div><img src="3.jpg" alt=""></div>
      <div><img src="5.jpg" alt=""></div>
    </section>
    <ul>
      <li>1</li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
    </ul>
  </main>
  ```

  ```css
  main {
    width: 400px;
    border: solid 5px #ddd;
    overflow: hidden;
    position: relative;
  }
  main:hover section { // 鼠标经过暂停：图片+数字
    animation-play-state: paused;
  }
  main:hover ul::before {
    animation-play-state: paused;
  }
  
  section {
    width: 1600px;
    height: 200px;
    display: flex;
    flex-direction: row;
    
    animation-name: slide;
    animation-duration: 4s;
    animation-iteration-count: infinite;
    animation-timing-function: steps(4, end);
  }
  section div {
    width: 400px;
    height: 200px;
    overflow: hidden;
  }
  section div img {
    width: 100%;
  }
  
  ul {
    width: 200px;
    position: absolute;
    //flex居中...
    z-index: 3;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
  
  ul li {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    box-sizing: border-box;
    //flex居中...
    z-index: 2
  }
  
  ul::before {
    content: '';
    //画圆....
    position: absolute;
    left: 0;
    
    animation-name: num;
    animation-duration: 4s;   //时间一致保持同步
    animation-iteration-count: infinite;
    animation-timing-function: steps(4, end);
    z-index: 1;
  }
  
  @keyframes slide {
    from {
      transform: translateX(0px);
    }
    to {
      transform: translateX(-100%);
    }
  }
  @keyframes num {
    100% {
      transform: translateX(200px);
    }
  }
  ```

#### 效果对比 ####

<img src="https://doc.houdunren.com/assets/img/Untitled-9067254.58a8233a.gif" alt="Untitled" style="zoom:33%;" />

* 具体区别：

  1. none：等待后，第1帧--结束--直接恢复到起始状态
  2. backwards：等待过程中，使用的是第一帧的效果
  3. forwards：执行技术完后，定在结束帧（等待验收）
  4. both：结合两个，起始的时候使用的就是第一帧的效果，执行技术完后，定在结束帧（等待验收）

  ```html
    <ul>
      <li>none</li>
      <li>backwards</li>
      <li>forwards</li>
      <li>both</li>
  </ul>
  <h2>houdunren.com</h2>
  ```

  ```CSs
  ul {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  li {
    list-style: none;
    width: 200px;
    height: 200px;
    background: #ecf0f1;
    border-radius: 50%;
    animation-name: hd;
    animation-delay: 2s;
    animation-duration: 2s;
    text-align: center;
    font-size: 2em;
    line-height: 200px;
    margin: 10px;
  }
  
  li:nth-child(1) {
    animation-fill-mode: none;
  }
  li:nth-child(2) {
    animation-fill-mode: backwards;
  }
  li:nth-child(3) {
    animation-fill-mode: forwards;
  }
  li:nth-child(4) {
    animation-fill-mode: both;
  }
  
  @keyframes hd {
    0% {
      border-radius: 0;
      background: #9b59b6;
    }
  
    100% {
      border-radius: 50%;
      background: #e74c3c;
    }
  }
  ```
