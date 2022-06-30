---
layout: post
title: overflow与滚动
abbrlink: scroll
date: 2022-04-21 20:09:43
tags: overflow、滚动
cover: https://mynightwish.oss-cn-beijing.aliyuncs.com/CSS/overflow-scroll.webp
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0'
---

### overflow与scroll

#### overflow属性：

> overflow文档：https://developer.mozilla.org/zh-CN/docs/Web/CSS/overflow

定义当一个元素的内容太大而无法适应 [块级格式化上下文](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context) 时候该做什么，该属性有四个常用的值：

> `visible`: 默认值。内容不会回修剪，可以呈现在元素框之外。
>
> `hidden`: 如果内容超出父级容器，超出部分将会被隐藏
>
> `scroll`: 无论是否超出容器，都会出现一个滚动条。
>
> `auto`: 如果没有超出容器的显示，将会正常显示，如果超出，将会出现一个滚动条。

**值得注意的是**：

- 如果 `overflow-x` 与 `overflow-y` 的值相同，结果等同于 `overflow`；
- 如果  `overflow-x` 与 `overflow-y` 不同，且其中一个属性的值被赋予 `visible`，另外一个被赋予一个 非 `visible` 的值，第一个被赋予 `visible` 的值会自动变为 `auto`。

#### 起作用的条件：

> - 父容器非 `display:inline` 水平
>
> - 对应方位的尺寸限制，(`width` / `height` / `max-width` / `max-height` / `absolute`拉伸 )
>
>   ```
>   垂直滚动设置 高度或者最小高度 如：{overflow:scroll; height:500px}
>   
>   水平滚动设置 宽度或者最小宽度 如：{overflow:scroll; width:500px}
>   ```
>
> - 对于单元格`td`元素等，还需要设置`table`为`table-layout:fixed`状态

#### 滚动条出现的条件：

> 1. HTML 元素自带的，例如 `<html>` 和 `<textarea>` 属性。
>
>    **值得注意的是**，默认滚动条是来自于 `<html>` 元素而不是 `<body>` 元素。滚动条也会占用用容器的可用宽度或者高度
>
> 2. 使用 `overflow` 属性出现的滚动条：内容超出范围

> 获取滚动条：
>
> ```
> let st = document.documentElement.scrollTop || document.body.scrollTop;
> ```

#### 自定义滚动条scrollbar：

> 文档：https://developer.mozilla.org/zh-CN/docs/Web/CSS/::-webkit-scrollbar
>
> `webkit` 内核提供了以下适用于 `webkit` 内核的浏览器自定义滚动条的样式的属性，具体如下：
>
> - `::-webkit-scrollbar` — 整个滚动条.
> - `::-webkit-scrollbar-button` — 滚动条上的按钮 (上下箭头).
> - `::-webkit-scrollbar-thumb` — 滚动条上的滚动滑块.
> - `::-webkit-scrollbar-track` — 滚动条轨道.
> - `::-webkit-scrollbar-track-piece` — 滚动条没有滑块的轨道部分.

> ##### 滚动条样式美化
>
> 巧了，博客魔改中也使用了滚动条的相关属性：
>
> ```css
> .test1::-webkit-scrollbar {  
>  width: 8px;  
> }  
>  .test1::-webkit-scrollbar-track {  
>  background-color:#808080;  
>  -webkit-border-radius: 2em;  
>  -moz-border-radius: 2em;  
>  border-radius:2em;  
> }  
>  .test1::-webkit-scrollbar-thumb {  
>  background-color:#ff4400;  
>  -webkit-border-radius: 2em;  
>  -moz-border-radius: 2em;  
>  border-radius:2em;  
> }
> ```

#### 依赖于 overflow 的 CSS 属性：

> ##### resize 属性：
>
> - 用于设定一个元素的是否可调整大小，该属性具有如下几个值：
>   - `none`: 默认值，元素不能被用户缩放。
>   - `both`: 允许用户在水平和垂直方向上调整元素的大小。
>   - `horizontal`: 允许用户在水平方向上调整元素的大小。
>   - `vertical`: 允许用户在垂直方向上调整元素的大小。
>
> ##### text-overflow 属性：
>
> - 用于指定当文本溢出时的操作，该属性具有如下几个值：
>   - `clip`: 默认值"在内容区域的极限处截断文本
>   - `ellipsis`: 用 `...` 来表示被截断的文本
>   - `<string>`: 该字符串内容将会被添加在内容区域中，如果空间太小，该字符串也会被截断
