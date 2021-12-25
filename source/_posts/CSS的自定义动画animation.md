---
title: animation动画基本使用
date: 2021-12-25 23:20:18
tags: CSS动画
categories: CSS
description: 'CSS动画3：Animation基本使用'
cover: https://images.unsplash.com/photo-1640404880570-2b61bf155ebf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80
copyright_author: 飞儿 # 作者覆写
copyright_url: https://www.nesxc.com/post/hexocc.html 
license: CC BY-NC-SA 4.0
license_url: https://creativecommons.org/licenses/by-nc-sa/4.0/
---

### 动画animation ###

#### 1、关键帧 ####

* 使用`@keyframes` 规则配置动画中的各个帧
  * from 表示起始点（可以用 0% 代替），to表示终点（可以用 100% 代替）
  * 可以用百分数如 20%，动画运行到20%时间时
  * 动画命名不要使用CSS关键字如 `none`

#### 2、时间点 ####

帧动画需要定义在不同时间执行的动作，开始与结束可以用 `form/to` 或 `0%/100%` 声明。

* 必须添加百分号，25%是正确写法
* 时间点没有顺序要求，即100%写在25%前也可以
* 未设置`0%`与`100%` 时**将使用元素原始状态**
* 时间点可以动画样式一样时可以一起声明（类似于h1, h2 样式一样时，写在一起）。

#### 3、动画名 ####

* 使用`animation-name` 规则可以在元素身上**同时使用多个动画。**

  * 使用多个动画时用逗号分隔

  * 多个动画有相同属性时，**后面动画的属性优先使用**：多个动画对用一个元素操作同一属性时，后面动画优先级更高

    ```css 
    animation-name: scale, colors, rotate; 
    // 假如rotate与colors设置过相同的属性，优先rotate设置，rotate时间用完了，才会有colors用，因此入股ocolors的持续时间=== 或< rotate的时间，是没机会生效的
    animation-duration: 1s, 5s, 1s;
    ```

* 不是所有的属性都会产生动画效果：

  * 一般有中间值的属性都可以设置动画如宽度、透明度等。但是宽度不能设置auto这样的值，因为无法计算中间值。如果是auto会马上变成最终效果，没有动画过渡效果。

  * 比如solid和dotted这种，没有中间值，不是慢慢演化改变的。

#### 4、持续时间 ####

* 使用 `animation-duration` 可以声明动画播放的时间，即把所有帧执行一遍所需要的时间。
  * 可以使用m秒，ms毫秒时间单位
  * 可为不同动画单独设置执行时间
  * 如果动画数量大于时间数量，将重新从时间列表中计算

#### 5、重复播放次数-循环 ####

* `animation-iteration-count` 规则设置动画**重复执行**次数，设置值为 `infinite` 表示无限循环执行。
  * 可同时设置元素的多个动画重复，使用逗号分隔
  * 如果动画数量大于重复数量定义，后面的动画将重新计算重复

#### 6、 运行方向 ####

* `animation-direction` 控制动画运行的方向
  * normal：	从0%到100%运行动画，活干完了，**一下子瞬间收回去；**
  * reverse：	从100%到0%运行动画
  * alternate：	先从0%到100%，然后从100%到0%，活干完了，**慢慢再收回去；**
  * alternate-reverse：	先从100%到0%，然后从0%到100%

#### 7、动画延迟 ####

* 使用 `animation-delay` 规则定义动画等待多长时间后执行；
* 使用情况分析：
  * 假如希望一个动画，先延迟2秒再执行，可以通过将50%的样式设置为跟初始一样，比如scale(1)；
  * 但如果动画执行次数是无限次，那么每次开始前都有等待时间，但我不想这样的效果，希望每次开始后，不要再等了：此时就可以用 `animation-delay` 这个属性了。
* 例子：微场景

#### 8、动画速率 ####

* ##### 系统属性：可以在帧中单独定义，将影响当前帧的速率 #####

  | 值                            | 描述                                                         |
  | :---------------------------- | :----------------------------------------------------------- |
  | linear                        | 规定以相同速度开始至结束的过渡效果（等于 cubic-bezier(0,0,1,1)）。 |
  | ease                          | 开始慢，然后快，慢下来，结束时非常慢（cubic-bezier(0.25,0.1,0.25,1)） |
  | ease-in                       | 开始慢，结束快（等于 cubic-bezier(0.42,0,1,1)）              |
  | ease-out                      | 开始快，结束慢（等于 cubic-bezier(0,0,0.58,1)）              |
  | ease-in-out                   | 中间快，两边慢（等于 cubic-bezier(0.42,0,0.58,1)）           |
  | cubic-bezier(*n*,*n*,*n*,*n*) | 在 cubic-bezier 函数中定义自己的值                           |

* ##### 贝塞尔曲线 #####

  需要设置四个值 `cubic-bezier(, , , )`，来控制曲线速度，可在 [https://cubic-bezier.com (opens new window)](https://cubic-bezier.com/)网站在线体验效果。

  <img src="https://doc.houdunren.com/assets/img/image-20190917143208598.d3bc3aad.png" alt="image-20190917143208598" style="zoom:50%;" />

#### 9、步进速度 ####

* 一帧一帧的感觉，有点像现实生活中的机械舞，下面是把过渡分五步完成。

  | 选项           | 说明                                       |
  | -------------- | ------------------------------------------ |
  | steps(n,start) | 设置n个时间点，第一时间点变化状态          |
  | steps(n,end)   | 设置n个时间点，第一时间点初始状态          |
  | step-start     | 等于steps(1,start)，可以理解为从下一步开始 |
  | step-end       | 等于steps(1,end)，可以理解为从当前步开始   |

#### 10、播放状态 ####

* 使用 `animation-play-state` 可以控制动画的暂停与运行。
  * paused：暂停
  * running：运行

#### 11、填充模式 ####

* `animation-fill-mode` 用于定义动画播放结束后的处理模式，是回到原来状态还是停止在动画结束状态。

  | 选项      | 说明                                                         |
  | --------- | ------------------------------------------------------------ |
  | none      | 需要等延迟结束，起始帧属性才应用                             |
  | backwards | 动画效果在起始帧，不等延迟结束                               |
  | forwards  | 结束后停留动画的最后一帧                                     |
  | both      | 包含backwards与forwards规则，即动画效果在起始帧，不等延迟结束，并且在结束后停止在最后一帧 |

#### 12、组合定义 ####

* 和CSS中的其他属性一样，可以使用`animation`组合定义帧动画。animation 属性是一个简写属性，用于设置六个动画属性：

  * animation-name
  * animation-duration
  * animation-timing-function
  * animation-delay
  * animation-iteration-count
  * animation-direction

  必须存在 `animation-duration`属性，否则过渡时间为0没有动画效果。