---
title: CSS的过渡transition
date: 2021-12-11 22:44:19
tags: CSS
categories: CSS
description: 'CSS动画1：过渡transition'
cover: https://images.unsplash.com/photo-1640386595378-84a63264fe50?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80
copyright_author: 飞儿 # 作者覆写
copyright_url: https://www.nesxc.com/post/hexocc.html 
license: CC BY-NC-SA 4.0
license_url: https://creativecommons.org/licenses/by-nc-sa/4.0/
---

### 1、过渡transition ###

#### 1、所有属性都执行 ####

* 如果希望所有属性都执行过渡动画：

  * 注意：无先后顺序。如存在持续和延迟两种时间，第一个是持续，第二个是等待

  ```css
  简写属性：
  transition: transition-property | transition-duration | timing-function | delay
  ```

  ```css
  <div id = 'box'> 你好呀，你好</div>
  #box {
    width: 200px;
    background-color: red;
    transition: all 3s ease-out 1s; // 此时hover里面的所有属性都会发生过渡效果
  }
  
  #box:hover{
    width: 400px;
    background-color: green; 
  }
  ```

#### 2、指定属性执行 ####

* 如果不希望所有的属性都执行过渡动画，可以分开写

  ```css
  transition-property: width, height;
  transition-duration: 可分别指定时间，用 , 号隔开,单位可秒和毫秒;
  transition-timing-function: 为过渡效果指定过渡的执行方式
  	- ease 默认值，慢速开始，先加速，后减速  
  	- ease-in 加速运动  ease-out 减速运动   ease-in-out 先加速后减速
  	- linear 匀速运动
  	- cublic-bezier() 贝塞尔曲线
  		- step(步数, start/end) 分步执行过渡效果   start / end 时间开始/结束时执行，默认值
  transition-delay: 延迟时间
  ```

  ```js
  <div id = 'box'> qwwe</div>
  #box {
    width: 200px;
    height: 30px;
    background-color: red;
    
    transition-property: width, height;
    transition-duration: 3s, 5s;
    transition-timingfunction: ease-in, linear;
    transition-delay: 1s, 3s;
  }
  
  #box:hover{
    width: 400px;
    height: 60px;
    background-color: green;  // 不会有过渡效果，hover后马上变
  }
  ```

#### 3、触发方式： ####

* 常见3种：hover、active（鼠标按下、松开）、focus（表单）
