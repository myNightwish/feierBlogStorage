---
layout: post
title: requestAnimationFrame的介绍
date: 2022-04-03 14:39:27
categories: 项目总结
tags: 
  - 动画
  - requestAnimationFrame
description: 前端动画
cover: https://cdn.jsdelivr.net/gh/myNightwish/CDN_res/img/4ea44274b6bd448cba69bf2b041a1787~tplv-k3u1fbpfcp-zoom-crop-mark:1956:1956:1956:1101.image
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: requestAnimationFrame
---

## <center>requestAnimationFrame</center>

- 本篇文章的背景：

  > 1. 实际开发中，滚动过程中吸顶效果实现中借助了requestAnimationFrame API；
  > 2. 在下一个迭代双周中，我们的目标是对官网页面整体优化，其中包括了动画部分：原本是采用放一个mp4视频文件进行播放，但MP4耗费资源，对首屏加载也不友好~基于此，采用动画优化，对于具体涉及实现的技术将在下一专题进行总结；
  > 3. 在周会分享中，前端页面渲染部分，探讨了一些前端动画中的实现方式，requestAnimationFrame就是其中之一；

- 官方文档：https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame

  - window.requestAnimationFrame() 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行

  - **说人话：**

    该API能以浏览器的显示频率来作为其动画动作的频率，比如浏览器每10ms刷新一次，动画回调也每10ms调用一次，这样就不会存在过度绘制的问题，动画不会掉帧，自然流畅。

### 1、前置知识-动画的形成

#### 1.1 **计算机屏幕刷新率与浏览器重绘次数**

- 常见显示器有两种，即 CRT和 LCD；

  - CRT 是一种使用阴极射线管的显示器，屏幕上的图形图像是由一个个因电子束击打而发光的荧光点组成，由于显像管内荧光粉受到电子束击打后发光的时间很短，所以电子束必须不断击打荧光粉使其持续发光。**电子束每秒击打荧光粉的次数就是屏幕绘制频率**。

  - LCD 就是常见的液晶显示器。 不存在绘制频率的问题，因为 LCD 中每个像素都在持续不断地发光，直到不发光的电压改变并被送到控制器中，所以 LCD 不会有电子束击打荧光粉而引起的闪烁现象。

- 屏幕刷新率：

  - 指`1s`内屏幕刷新的次数，一般电脑为`1s 60次`(`1000ms / 60 ≈ 16.7ms` | `60FPS`)，也就是**每`16.7ms`会刷新一下屏幕**。此数值受到分辨率、显卡、屏幕尺寸等其他因素的影响
  - 当你只看着电脑时，显示器也会以每秒60次的频率正在不断的更新屏幕上的图像。但我们感觉不到这个变化，因为人眼的视觉停留效应

- 视觉停留效应：

  - 即前一副画面留在大脑的印象还没消失，紧接着后一副画面就跟上来了，这中间只间隔了16.7ms(1000/60≈16.7)， 所以会让你误以为屏幕上的图像是静止不动的。
  - 试想一下，如果刷新频率变成1次/秒，屏幕上的图像就会出现严重的闪烁，很容易引起眼睛疲劳、酸痛和头晕目眩等症状。

- 由于刷新频率是`60FPS`，所以大多数浏览器会**限制其重绘次数**，一般不会超过计算机的刷新频率，因为即使超过了其频率，用户的体验也不会得到提升。

#### 1.2 动画的形成及实现方式

- 动画的本质是在快速不断的切换图片，让人眼看到图像被绘制而引起变化的视觉效果。
- 这个变化要以连贯的、平滑的方式进行过渡。而动画是由浏览器按照一定的频率一帧一帧的绘制的：想要流畅，就需要尽可能在一秒中绘制更多的图片，但绘制太多需要消耗大量的性能，
- 通常来说**因为人眼的残影现象，所以只要两帧画面切换时间高于1/24秒，即可形成流畅的动画**。所以通常将渲染频率控制在每秒30~60次，人的视觉效果都很正常，也可以兼顾渲染性能

- web实现动画的方式
  - `css`：`animation`、`transition`
  - `js`: `setTimeout`、`setInteval`
  - `html`: `canvas`、`svg`
  - `requestAnimationFrame`等...

#### 1.3 requestAnimationFrame的优势

- 动画更加流畅，防止动画失帧
  - **浏览器知道动画的开始及每一帧的循环间隔，能够在恰当的时间刷新UI**，给用户一种流畅的体验
  - requestAnimationFrame 会把每一帧中的所有 DOM 操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率
  - 而setInterval或setTimeout实现的JavaScript动画就没有这么可靠了，因为浏览器压根就无法保证每一帧渲染的时间间隔，
- 资源节能(CPU、内存等)
  1. 在隐藏或不可见的元素中，requestAnimationFrame 将不会进行重绘或回流，这当然就意味着更少的 CPU、GPU 和内存使用量
  2. requestAnimationFrame 是由浏览器专门为动画提供的 API，在运行时浏览器会自动优化方法的调用，并且如果页面不是激活状态下的话，动画会自动暂停，有效节省了 CPU 开销

### 2、`requestAnimationFrame`的应用

#### 2.1 实现动画demo

- 宽度改变

  ![示例](https://cdn.jsdelivr.net/gh/myNightwish/CDN_res/img/1618f7bc6acd9f5c~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0-20220403135057109.awebp)

  ```js
  function animationWidth() {
    var div = document.getElementById('box');
    div.style.width = parseInt(div.style.width) + 1 + 'px';
    if(parseInt(div.style.width) < 200) {
      requestAnimationFrame(animationWidth)  // 函数继续传入
    }
  }
  requestAnimationFrame(animationWidth);
  ```

  - 可以看到，requestAnimationFrame接受一个动画执行函数作为参数，这个函数的作用是仅执行一帧动画的渲染，并根据条件判断是否结束，**如果动画没有结束，则继续调用requestAnimationFrame并将自身作为参数传入**。
  - 从示例来看，得到了效果平滑流畅的动画，这样就巧妙地避开了每一帧动画渲染的时间间隔问题。

- 位移

  由于人眼的视觉停留效应，当前位置的图像停留在大脑的印象还没消失，紧接着图像又被移到了下一个位置，这样你所看到的效果就是，图像在流畅的移动。这就是视觉效果上形成的动画。

  ```html
  <div id="test" style="width: 100px; height: 100px;background-color: orange;"></div>
  <script>
    // 调用的是系统的时间间隔
    const element = document.getElementById('test');
    let start;
    function step(timestamp) {
      if (start === undefined)
        start = timestamp;
      const elapsed = timestamp - start;
  
      //这里使用`Math.min()`确保元素刚好停在200px的位置。
      element.style.transform = 'translateX(' + Math.min(0.1 * elapsed, 200) + 'px)';
  
      if (elapsed < 5000) { // 5秒后停止动画
        window.requestAnimationFrame(step);
      }
    }
  
    var timer1 = window.requestAnimationFrame(step);
  
    //取消回调函数
    // cancelAnimationFrame(timer1);
  ```

#### 2.2 注意点

- 对于**window.requestAnimationFrame()**：
  - 当你准备更新动画时你应调用此方法。这将使浏览器在下一次重绘之前调用你传入给该方法的动画函数(即你的回调函数)。
  - 回调函数执行次数通常是每秒60次，但在大多数遵循W3C建议的浏览器中，回调函数执行次数通常与浏览器屏幕刷新次数相匹配。
  - 为了提高性能和电池寿命，在大多数浏览器里，当requestAnimationFrame() 运行在后台标签页时，requestAnimationFrame() 会被暂停调用。
  - 回调函数会被传入**DOMHighResTimeStamp参数**，DOMHighResTimeStamp指示当前被 requestAnimationFrame() 排序的回调函数被触发的时间。**在同一个帧中的多个回调函数，它们每一个都会接受到一个相同的时间戳**，即使在计算上一个回调函数的工作负载期间已经消耗了一些时间。该时间戳是一个十进制数，单位毫秒，最小精度为1ms(1000μs)。

## 3、requestAnimationFrame 与 Event Loop

Event Loop（事件循环）是用来协调事件、用户交互、脚本、渲染、网络的一种浏览器内部机制。

- Event Loop 在浏览器内也分几种：window event loop、worker event loop、worklet event loop。这里主要讨论的是 window event loop。也就是浏览器一个**渲染进程内主线程所控制**的 Event Loop。

#### 3.1 Event Loop的整体过程

<img src="https://cdn.jsdelivr.net/gh/myNightwish/CDN_res/img/ca5ec835c88b4f89b06e0302bfe98a7b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0-20220403141256079.awebp" alt="img" style="zoom: 50%;" />

- 大体上来说，event loop 就是不停地找 task queues 里是否有可执行的 task ，如果存在即将其推入到 call stack （执行栈）里执行，并且在合适的时机更新渲染
  1. 在所选 task queue (taskQueue)中约定必须包含一个可运行任务。如果没有此类 task queue，则跳转至下面 microtasks 步骤。
  2. 让 taskQueue 中最老的 task (oldestTask) 变成第一个可执行任务，然后从 taskQueue 中删掉它。
  3. 将上面 oldestTask 设置为 event loop 中正在运行的 task。
  4. 执行 oldestTask。
  5. 将 event loop 中正在运行的 task 设置为 null。
  6. 执行 microtasks 检查点（也就是执行 microtasks 队列中的任务）。
  7. 设置 hasARenderingOpportunity 为 false。
  8. 更新渲染。（哈哈哈，有点锁上门渲染的意思~）
  9. 如果当前是 window event loop 且 task queues 里没有 task 且 microtask queue 是空的，同时渲染时机变量 hasARenderingOpportunity 为 false ，去执行 idle period（requestIdleCallback）。
  10. 返回到第一步。

#### 3.2 Event Loop的更新渲染过程

流程基本如下图所示 ：

<img src="https://cdn.jsdelivr.net/gh/myNightwish/CDN_res/img/bee8d1d1e9b1437ebd0fa2ce5e5b795e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0-20220403141628158.awebp" alt="img" style="zoom: 67%;" />

浏览器渲染有个**渲染时机**（Rendering opportunity）的问题，也就是浏览器会根据当前的浏览上下文判断是否进行渲染，它会尽量高效，**只有必要的时候才进行渲染**；

如果没有界面的改变，就不会渲染。按照规范里说的一样，因为考虑到硬件的刷新频率限制、页面性能以及页面是否存在后台等等因素，有可能执行完 setTimeout 这个 task 之后，发现还没到渲染时机，所以 setTimeout 回调了几次之后才进行渲染

- 电脑屏幕的刷新和render是两个概念对吗？

  电脑是由其配置决定刷新频率、并且一直在刷新；

  但页面渲染会基于判断是否有必要重新渲染，

1. 遍历当前浏览上下文中所有的 document ，必须按在列表中找到的顺序处理每个 document 。
2. 渲染时机（Rendering opportunities）**：如果当前浏览上下文中没有到渲染时机**，则将所有 docs 删除，取消渲染（此处是 否存在渲染时机由浏览器自行判断，根据硬件刷新率限制、页面性能或页面是否在后台等因素）。
3. 如果当前document 不为空，设置 hasARenderingOpportunity 为 true 。
4. 不必要的渲染（Unnecessary rendering）：如果浏览器**认为更新文档的浏览上下文的呈现不会产生可见效果**且文档的 animation frame callbacks 是空的，则取消渲染。
5. 从 docs 中删除浏览器认为出于其他原因最好跳过更新渲染的文档。
6. 如果文档的浏览上下文是顶级浏览上下文，则刷新该文档的自动对焦候选对象。
7. 处理 resize 事件，传入一个 performance.now() 时间戳。
8. 处理 scroll 事件，传入一个 performance.now() 时间戳。
9. 处理媒体查询，传入一个 performance.now() 时间戳。
10. 运行 CSS 动画，传入一个 performance.now() 时间戳。
11. 处理全屏事件，传入一个 performance.now() 时间戳。
12. 执行 requestAnimationFrame 回调，传入一个 performance.now() 时间戳。
13. 执行 intersectionObserver 回调，传入一个 performance.now() 时间戳。
14. 对每个 document 进行绘制。
15. 更新 ui 并呈现。

至此，requestAnimationFrame 的回调时机就清楚了，它会在 style/layout/paint 之前调用。

## 4、应用场景

#### 4.1 大量数据渲染

在大数据渲染过程中，比如表格的渲染，如果不进行一些性能策略处理，就会出现 UI 冻结现象，用户体验极差。

- 有个场景，将后台返回的**十万条记录**插入到表格中，如果一次性在循环中生成 DOM 元素，会导致页面卡顿5s左右。
- 此时，就可以用 **requestAnimationFrame** 来分步渲染，确定最好的时间间隔，页面加载更流畅

```js
var total = 100000;
var size = 100;
var count = total / size;
var done = 0;
var ul = document.getElementById('list');

function addItems() {
    var li = null;
    var fg = document.createDocumentFragment();

    for (var i = 0; i < size; i++) {
        li = document.createElement('li');
        li.innerText = 'item ' + (done * size + i);
        fg.appendChild(li);
    }

    ul.appendChild(fg);
    done++;

    if (done < count) { requestAnimationFrame(addItems);}
};
requestAnimationFrame(addItems);
```

#### 4.2 实现动画

- css3实现使得性能和流畅度都得到了很大的提升，但同时局限性也挺大。

  比如**不是所有的属性都能参与动画，动画过程不能完全控制，动画缓动效果太小**等等。

- 刚好相反的是setTimeout和setInterval能达成更多的可控性质的自有帧动画，但是由于刷新时间和定时器时间不同会出现掉帧现象，定时器时间设的越短掉帧时间越严重，而且性能牺牲很严重

- 然而 **requestAnimationFrame** 的出现让我们有了除了这两种我们常用的方案之外的另一种更优的选择
- 具体如2节示例。

### 5、兼容性

- 针对低版本浏览器，则需要使用setTimeout来模拟requestAnimationFrame，且针对不同浏览器对requestAnimationFrame的实现，这个api的名字也略有差异，张鑫旭大佬的模拟requestAnimationFrame的写法如下：

- 如果遇到低版本浏览器的动画需求，你只需要把这段代码丢进去定义一个低配版requestAnimationFrame方法即可

  ```js
  (function() {
      var lastTime = 0;
      var vendors = ['webkit', 'moz'];
      for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
          window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
          window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    
            // Webkit中此取消方法的名字变了
          window[vendors[x] + 'CancelRequestAnimationFrame'];
      }
  
      if (!window.requestAnimationFrame) {
          window.requestAnimationFrame = function(callback, element) {
              var currTime = new Date().getTime();
              var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
              var id = window.setTimeout(function() {
                  callback(currTime + timeToCall);
              }, timeToCall);
              lastTime = currTime + timeToCall;
              return id;
          };
      }
      if (!window.cancelAnimationFrame) {
          window.cancelAnimationFrame = function(id) {
              clearTimeout(id);
          };
      }
  }());
  ```

  ### 小结

  > 下一次，我们将在项目中分享，reequestAnimationFrame是如何解决页面滚动吸顶效果的，以及另一期开发工作中，类似金币转圈圈的效果实现、腾讯云中某一图标的动态旋转实现~

  