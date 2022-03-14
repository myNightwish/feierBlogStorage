---
title: transform动画的demo
tags: CSS动画
categories: CSS
description: 'CSS动画2:transform之demo'
cover: >-
  https://images.unsplash.com/photo-1640398251733-33c23a4c36f1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=388&q=80
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: 3253065341
date: 2021-12-25 23:18:32
---

只标注了部分关键代码，并没有传全部代码
### transform的实现demo ###

#### 1、实现动感渐变表单 ####

<img src="https://doc.houdunren.com/assets/img/Untitled-7851179.821af195.gif" alt="Untitled" style="zoom:50%;" />

* 鼠标放上去时，下面呈现波纹效果：

  * 控制鼠标放上去时，translateX的移动

  * 未放上去时，在左侧区域，并overflow不展示

    ```html
    <main>
        <div class="field">
            <input type="text" placeholder="请输入后盾人帐号">
        </div>
        <div class="field">
            <input type="text" placeholder="请输入密码">
        </div>
    </main>
    ```

    ```css
    main {
      //居中显...
      // flex设置子元素居中...
      border: solid 5px silver;
    }
    
    .field {
      position: relative;
      overflow: hidden;  
      margin-bottom: 20px;
    }
    
    .field::before {
      content: '';
      position: absolute;
      left: 0;
      height: 2px;
      bottom: 0;
      width: 100%;
      background: linear-gradient(to right, white, #1abc9c, #f1c40f, #e74c3c, white);
      transform: translateX(-100%);  //一开始不显示
      transition: 2s;
    }
    
    .field:hover::before {
      transform: translateX(100%); // 显示
    }
    ```

#### 2、页面切换 ####

<img src="https://doc.houdunren.com/assets/img/Untitled-7584912.730ab731.gif" alt="Untitled" style="zoom:50%;" />

移动效果制作的页面切换效果。

* 点击不同菜单时，有不同的动画效果，呈现不同的效果

  * 控制底部的3个bar不同的样式的伪类target；
  * 分别设置3个伪类添加时的样式不同；
  * 颜色使用过渡展示；

  ```html
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
  <main>
    <div id="home">
      <i class="fa fa-home" aria-hidden="true"></i>
      houdunren.com
    </div>
    <div id="video">
      <i class="fa fa-vimeo" aria-hidden="true"></i>
    </div>
    <div id="live">
      <i class="fa fa-viadeo" aria-hidden="true"></i>
    </div>
  </main>
  <nav>
    <a href="#home">home</a>
    <a href="#video">video</a>
    <a href="#live">live</a>
  </nav>
  ```

  ```css
  main {
    flex: 1;
    overflow: hidden;
  }
  nav {
    // flex居中...
    height: 8vh;
  }
  
  nav a {
    flex: 1;
  }
  
  nav a:nth-child(2) {
    border-right: solid 1px #aaa;
    border-left: solid 1px #aaa;
  }
  
  main>div {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    transition: all 1s;
    z-index: 1;
    // flex居中...
    transform: translate(0, -100%);  // y轴上的平移
  }
  
  main>div:target {  // 点击时，平移
    opacity: 1;
    transform: translate(0%, 0%);
  }
  
  main>div:nth-of-type(1):target {  // 点击时换颜色
    background: #3498db;
  }
  ...同理，别的子元素
  ```

#### 3、缩放菜单 ####

<img src="https://doc.houdunren.com/assets/img/Untitled-7638319.e0db60be.gif" alt="Untitled" style="zoom:33%;" />

* 鼠标没放上去时：缩放transform：scale（0）

* 放上去后，再显示出来：scale（1）

  ```css
  <main>
      <ul>
          <li>
              <strong>VIDEO</strong>
              <div>
                  <a href="">PHP</a>
                  <a href="">hdcms</a>
                  <a href="">laravel</a>
              </div>
          </li>
          <li>
              <strong>LIVE</strong>
              <div>
                  <a href="">houdunren</a>
                  <a href="">angular</a>
                  <a href="">css3</a>
              </div>
          </li>
      </ul>
  </main>
  ```

  ```css
  main {   // 垂直水平居中....}
  
  ul li strong+div {
    display: flex;
    flex-direction: column;
    padding: 10px 20px;
    position: absolute;
    transform-origin: left top;  // 缩放的基点位置  左上 0， 0
    transform: scale(0);      //隐藏
    z-index: -1;
    transition: .6s;
  }
  
  ul li strong+div a {
    display: inline-block;  // 要转成块级才能transform
    padding: 5px;
    text-decoration: none;
  }
  
  ul li:hover strong+div {
    transform: scale(1);   //hover时显示出来
  }
  ```

#### 4、相册放大 ####

<img src="https://doc.houdunren.com/assets/img/Untitled-7641188.78385d23.gif" alt="Untitled" style="zoom:25%;" />

* Dom结构：

  ```html
  <main>
      <div> <img src="1.jpg" alt=""></div>
      <div> <img src="2.jpg" alt=""></div>
      <div> <img src="3.jpg" alt=""></div>
  </main>
  ```

* hover时目标对象放大，且靠近；

* 非目标元素缩小scale

  ```css
  main div {
    // felx居中...
    height: 200px;
    width: 200px;
    border: solid 1px #ddd;
    transition: all .5s;
    
    overflow: hidden;
    box-sizing: border-box;
  }
  
  main div img {
    height: 100%;
  }
  
  main:hover div {
    transform: scale(.8) translateY(-30px);   // 缩小，向下移动了30px
  }
  
  main div:hover {
    transform: scale(1.6);  //目标对象放大
    z-index: 2;  //要把别的盖住
  }
  
  main div:hover::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  ```

#### 5、旋转文字 ####

<img src="https://doc.houdunren.com/assets/img/Untitled-7605104.746a27d4.gif" alt="Untitled" style="zoom:50%;" />

* 注意：transition添加到哪里 main 的div的strong

  ```html
  <main>
    <div>
    		<strong>h</strong>ou<strong>d</strong>unren.com
    </div>
  </main>
  ```

  ```css
   main div strong {
   		transition: 3s; 
   }
   main div:hover strong:nth-of-type(1) {
   		transform: rotate(360deg);
   }
   main div:hover strong:nth-of-type(2) {
   		transform: rotate(-360deg);
   }
  ```

#### 6、酷炫按钮： ####

<img src="https://doc.houdunren.com/assets/img/Untitled-7636893.3e63a4ce.gif" alt="Untitled" style="zoom:50%;" />

* 初始宽度为0，经过后，宽度扩大为200%，离开后，再反向恢复

  ```html
  <main>
    <a class="btn">
      HOUDUNREN
    </a>
  </main>
  ```

  ```css
  main .btn {
    overflow: hidden;
    //... 主要实现水平居中等
  }
  main .btn::before {
    transition: all .8s;
    align-self: center;
    content: '';
    position: absolute;
    width: 0%;    /* 从0过渡到200% */
    height: 100%;
    background: #e74c3c;
    z-index: -1;   /* 保证背景色，不要把文字遮盖住 */
    transform: skewX(-45deg);  /* 产生倾斜效果 */
  }
  
  main .btn:hover::before {
    width: 200%; 
  }
  ```

#### 7、立体盒子按钮： ####

<img src="https://doc.houdunren.com/assets/img/image-20190906135344963.f9a01bf5.png" alt="image-20190906135344963" style="zoom:33%;" />

*  重点理解，盒子左下，右下阴影怎么实现的；

  * 宽高设置、left的意义
  * 要为什么skewY， 还要translate的位移

  ```css
  <a href="" class="btn"> Nightwish</a>
  ```

  ```css
  .btn {
  	transform: skewX(25deg) rotate(-15deg); // 再调这边的，控制的整个btn
    position: relative;
    // 宽、高居中 等样式设置...
  }
  .btn::before {
    content: '';
    width: 10px;
    height: 100%;
    left: -10px; /* 刚好能抵消 width为10的宽度*/
    background: #000;
    position: absolute;
    transform: skewY(-45deg) translate(0, 5px); // 先调这边的
  }
  
  .btn::after {
    content: '';
    width: 100%;
    height: 10px;
    bottom: -10px; /* 刚好能抵消 height为10 */ 
    background: #000;
    position: absolute;
    transform: skewX(-45deg) translate(-5px, 0);
  }
  ```

#### 8、三维旋转 ####

<img src="https://doc.houdunren.com/assets/img/Untitled-7932004.12f1c62a.gif" alt="Untitled" style="zoom:33%;" />

* 实现立体的旋转，可以指定角度。不同的transform-origin原点不同，效果不同：

  ```html
  <main>
      <div></div>
      <div></div>
  </main>
  ```

  ```css
  main {
    //...居中代码
    border: solid 5px silver;
    transform-style: preserve-3d;
    transform: perspective(900px) rotateX(60deg);  // 是以y、z轴构成的平面选择。默认是中
  }
  
  div {
    // ...居中代码
    // 不加，是翻书效果：很好玩
    transform-origin: left bottom 200px;  //加了200px,其实是z轴方向，可以飞起来
  }
  div:nth-child(2) {
    transition: 3s;   // 持续3秒
  }
  main:hover div:nth-child(2) {
    transform: rotateY(720deg);  /* 旋转2圈*/
  }
  ```

#### 9、新年贺卡 ####

<img src="https://doc.houdunren.com/assets/img/Untitled-7939019.ed7152ba.gif" alt="Untitled" style="zoom:33%;" />

* 注意透视加的位置，翻书效果实现

  ```html
  <main>
      <div class="card">houdunren</div>
  </main>
  ```

  ```css
  .card {
    position: relative;
    width: 300px;
    height: 200px;
   // 居中设置.... 
    transform-style: preserve-3d;  //实现卡片透视效果
    transform: perspective(900px) rotateX(35deg) rotateY(15deg);
  }
  
  .card::before,
  .card::after {
    transition: 3s;   //注意transition添加的位置
  }
  
  .card::before {
    content: '新年';
    width: 150px;
    height: 100%;
    left: 0px;
    top: 0;
    text-align: right;
    position: absolute;
    transform-origin: left bottom;
  }
  
  .card::after {
    content: '快乐';
    width: 150px;  // 宽度为一半
    height: 100%;
    top: 0;
    left: 150px;
    position: absolute;
    transform-origin: right bottom;   // 翻书效果 ==right == right center
  }
  
  .card:hover::before {
    transform: rotateY(-179deg);
  }
  
  .card:hover::after {
    transform: rotateY(179deg);
  }
  ```

#### 10、电子时钟： ####

<img src="https://doc.houdunren.com/assets/img/Untitled-7645507.b3731f7b.gif" alt="Untitled" style="zoom:33%;" />

* 整体Dom结构：

  * main是整体的大表盘：（两个盘叠加，z-index控制层叠）
    * 带渐变色的大表盘最大（scale 1.2），但是z-index小，所以相比于main大表盘，只会漏出外环
    * main：最大表盘，大小刚好设置为彩带环内大小
  * line是插入6条线的部分：6条白色的线，旋转不同的角度；
    * 6条线都垂直水平居中，并在环内不同角度旋转，旋转原点是自己中点
  * mark：是小表盘，叠在线上面，（scale 0.8）
  * 圆点：同样宽、高更小，50%  设置为圆。垂直水平居中 ，且要提高他的z-index
  * 时、分、秒：大致一样的，
    * 指针长度不同：wid控制即可
    * 旋转的圆点：left bottom
  * 动画：hover时，旋转指定度数

  ```html
  <main>
    <section class="line">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </section>
    <div class="mark"></div>
    <div class="point"></div>
    <div class="hour"></div>
    <div class="minute"></div>
    <div class="second"></div>
    <div class="text">
        houdunren.com <br>
        向军大叔
    </div>
  </main>
  ```

* 首先画大圆盘：

  ```css
  main {
    position: relative;
    width: 400px;
    height: 400px;
    background: #34495e;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(0, 0, 0, .7);
  }
  main::before {    // 带渐变色的大表盘
    position: absolute;
    left: 0;
    top: 0;
    content: '';
    width: 100%;   
    height: 100%;
    border-radius: 50%;
    transform: scale(1.2);
    background: radial-gradient(at right, #27ae60, #e67e22, #e67e22, #27ae60);
    z-index: -1;
  }
  ```

* 接着画大圆盘的时针，要漏出来一点：

  ```css
  <section class="line">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </section>
    
  main .line>div {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 10px;  // 线
    height: 95%;
    background: white;
  }
  
  main .line>div:nth-child(1) {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  
  main .line>div:nth-child(2) {
    transform: translate(-50%, -50%) rotate(30deg);
  }
  
  main .line>div:nth-child(3) {
    transform: translate(-50%, -50%) rotate(60deg);
  }
  
  main .line>div:nth-child(4) {
    transform: translate(-50%, -50%) rotate(90deg);
  }
  
  main .line>div:nth-child(5) {
    transform: translate(-50%, -50%) rotate(120deg);
  }
  
  main .line>div:nth-child(6) {
    transform: translate(-50%, -50%) rotate(150deg);
  }
  ```

* 小表盘：

  ```css
  main>div[class="mark"] {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0%;
    top: 0%;
    background: #34495e;
    border-radius: 50%;
    transform: scale(.8);
  }
  ```

* 表盘的圆点：

  ```css
  main>.point {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
  }
  ```

* 时针：

  ```css
  main .hour {
    width: 15px;
    position: absolute;
    height: 25%;
    background: #95a5a6;
    left: 50%;
    bottom: 50%;
    transform: translate(-50%, 0);
  }
  main .minute {
    width: 8px;
    position: absolute;
    height: 35%;
    background: #3498db;
    left: 50%;
    bottom: 50%;
    transform-origin: left bottom;  // 旋转：末端
    transform: translate(-50%, 0) rotate(60deg);
  }
  main .second {
    width: 2px;
    position: absolute;
    height: 35%;
    background: #f1c40f;
    left: 50%;
    bottom: 50%;
    transform-origin: left bottom;
    transform: translate(-50%, 0) rotate(90deg);
  }
  ```

* 表盘经过的效果、文字效果：

  ```css
  main:hover .second {
    transition: 10s;
    transform: rotate(260deg);
  }
  
  main .text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 20px);
    opacity: .5;
    text-align: center;
  }
  ```

#### 11、动态旋转菜单 ####

<img src="https://doc.houdunren.com/assets/img/Untitled-8015150.745be0aa.gif" alt="Untitled" style="zoom:50%;" />

* 首选画这么多个圆，然后围绕这几个圆的中心旋转；

* 将这几个圆挪到圆中间：让ul垂直水平居中

  ```css
  <nav>
    <ul>
        <li><span><i class="fa fa-address-book" aria-hidden="true"></i></span></li>
        <li><span><i class="fa fa-adjust" aria-hidden="true"></i></span></li>
        <li><span><i class="fa fa-bars" aria-hidden="true"></i></span></li>
        <li><span><i class="fa fa-book" aria-hidden="true"></i></span></li>
        <li><span><i class="fa fa-bug" aria-hidden="true"></i></span></li>
        <li><span><i class="fa fa-compress" aria-hidden="true"></i></span></li>
        <li><span><i class="fa fa-ban" aria-hidden="true"></i></span></li>
        <li><span><i class="fa fa-beer" aria-hidden="true"></i></span></li>
        <li><span><i class="fa fa-bus" aria-hidden="true"></i></span></li>
    </ul>
  </nav>
  ```

  ```css
  ul li {
  	transition: 1s;
    transform-origin: 150px 150px;   // 按几个圆的正中心位置
  }
  ul li span {
    transition: 1s;
  }
  nav:hover li:nth-child(1) {
    transform: rotate(40deg);
  }
  nav:hover li:nth-child(1)>span { //控制字体显示不要歪
    transform: rotate(1040deg); 
  }
  nav:hover li:nth-child(2) {
    transform: rotate(80deg);
  }
  // ... 旋转不同的角度
  }
  ```

  ```css
  nav::before {
    content: '';
    width: 200px;
    height: 200px;
    background: #e74c3c;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }
  ```

* 控制显、隐

  ```css
  nav:hover ul {
    transform: scale(1);
  }
  
  ul {
    width: 300px;
    height: 300px;
    transform: scale(0);
    transition: .5s;
  }
  ul li span {   /* 控制图标歪 */
    transition: 1s;  /* 控制span */
  }
  ```

#### 12、3D旋转图集 ####

<img src="https://doc.houdunren.com/assets/img/Untitled-7838254.e56c8d56.gif" alt="Untitled" style="zoom:33%;" />

* 实现思路：

  * DOM结构：

    ```css
    <main>
        <div>
            <img src="5.jpg" alt="">
        </div>
        <div>
            <img src="1.jpg" alt="">
        </div>
        <div>
            <img src="3.jpg" alt="">
        </div>
        <div>
            <img src="5.jpg" alt="">
        </div>
        <div>
            <img src="1.jpg" alt="">
        </div>
        <div>
            <img src="3.jpg" alt="">
        </div>
    </main>
    ```

  * 每个图像设置在一起，但是Y轴旋转角度不同，且旋转不是以xz轴，而是以

    ```css
    div {
      position: absolute;
      width: 100%;
      height: 100%;
      transform-origin: center center -300px;
      overflow: hidden;
    }
    
    div:nth-child(1) {
      transform: rotateY(60deg);
    }
    
    div:nth-child(2) {
      transform: rotateY(120deg);
    }//...
    ```

  * 而是将旋转麻木的中心点设置为旋转原点

    ```css
    main {
      position: absolute;
      width: 400px;
      height: 200px;
      left: 50%;
      top: 50%;
      transform-style: preserve-3d; /* 开启3D视觉， 此时要把rotateX调整下方便看*/
      transform-origin: center center -300px; /* 调整旋转中心是旋转木马中心*/
      transform: translate(-50%, -50%) rotateX(-45deg);
      transition: 6s;
    }
    body:hover main {
      /* translate(-50%, -50%)： 不加，会导致旋转跑偏了*/ 
      transform: translate(-50%, -50%) rotateX(-45deg) rotateY(900deg);
    }
    ```

#### 立方体 ####

<img src="https://doc.houdunren.com/assets/img/Untitled-7784965.483715b7.gif" alt="Untitled" style="zoom:25%;" />

* 四个边的盒子旋转以z轴中间作为基点，分别旋转rotateY90 180 270

* 两个盖子，分别以y轴旋转rotateX

  ```html
  <main>
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>5</div>
      <div>后盾人</div>
  </main>
  ```

  ```css
   main {
          position: absolute;
          // 居中...
          transform-style: preserve-3d;
          transform-origin: 50% 50% 50px;  //在z轴中心旋转
          transition: 2s;
      }
  
      main:hover {
          transform: rotate3d(1, 1, 0, 180deg);
      }
  
      div {
          position: absolute;
          width: 200px;
          height: 200px;
          //... 居中
      }
  
      div:nth-child(1) {
          transform-origin: right;
          background: #1abc9c;
          transform-origin: bottom;
          transform: translateY(-200px) rotateX(-90deg);
          opacity: .8;
      }
  
      div:nth-child(2) {
          transform-origin: right;
          background: #27ae60;
          transform-origin: top;
          transform: translateY(200px) rotateX(90deg);
          opacity: .8;
      }
  
      div:nth-child(3) {
          transform-origin: bottom;
          background: #e67e22;
          transform-origin: right;
          transform: translateX(-200px) rotateY(90deg);
          opacity: .8;
      }
  
      div:nth-child(4) {
          transform-origin: top;
          background: #8e44ad;
          transform-origin: left;
          transform: translateX(200px) rotateY(-90deg);
          opacity: .8;
      }
  
      div:nth-child(5) {
          transform-origin: left bottom;
          background: #ecf0f1;
          opacity: .8;
      }
  
      div:nth-child(6) {
          transform-origin: left bottom;
          background: #ecf0f1;
          opacity: .5;
          transform: translateZ(200px);
      }
  ```
