---
layout: post
title: codeReview之CSS规范
abbrlink: 867212230
date: 2022-03-21 11:27:15
tags: codeReview
---
## codeReview之css书写顺序 ##

### 1、为啥要讲究css书写顺序 ###

* 减少浏览器reflow（回流），提升浏览器渲染dom的性能；

* css样式解析到显示至浏览器屏幕上，发生的阶段：

  * `①:`解析html构建dom树，解析css构建css树：将html解析成树形的数据结构，将css解析成树形的数据结构

  * `②:`构建render树：DOM树和CSS树合并之后形成的render树。
  * `③:`布局render树：有了render树，浏览器已经知道那些网页中有哪些节点，各个节点的css定义和以及它们的从属关系，从而计算出每个节点在屏幕中的位置。
  * `④:`绘制render树：按照计算出来的规则，通过显卡把内容画在屏幕上。

* 总结一下：浏览器并不是一拿到css样式就立马开始解析，而是：

  拿到css样式的书写顺序 ----> 构建render tree ②  ——>然后，才开始遍历树形结构的节点进行解析，而此时的遍历顺序是由之前的书写顺序决定的，所以这个书写顺序才要讲究起来

### 2、具体怎么讲究的呢？-优先级 ###

#### 1、定位属性： ####

```css
  {
      display         规定元素应该生成的框的类型。
      position        定位规定元素的定位类型。
      float           规定框是否应该浮动。
      left  top  right  bottom   
      overflow        规定当内容溢出元素框时发生的事情。
      clear           清除
      z-index         设置元素的堆叠顺序。
      content         内容
          list-style  
          visibility  可见性/显示
 } 
```

#### 2、自身属性： ####

```css
{
     width、height、border、padding、margin、 、 background
} 
```

#### 3、文字样式： ####

```
 {
   font-family  、 font-size   、font-style     规定文本的字体样式。
    font-weight  、font-varient   规定是否以小型大写字母的字体显示文本
    color   
   } 
```

#### 4、文本属性： ####

```
{
        text-align、 vertical-align、  
        text-wrap          规定文本的换行规则。
        text-transform     控制文本的大小写。
        text-indent 、text-decoration 、letter-spacing 、word-spacing 
        white-space        规定如何处理元素中的空白。
        text-overflow      规定当文本溢出包含元素时发生的事情。
   }   
```

#### 5、C3新增属性： ####

```maxima
{  
    box-shadow、 cursor、 border-radius、background:linear-gradient、   
    transform……       向元素应用 2D 或 3D 转换。     
 }
```

### 3、CSS命名规范 ###

* 必须以字母开头命名选择器，这样可保证在所有浏览器下都能兼容；
* 不允许单个字母的类选择器出现；
* **不允许命名带有广告等英文的单词**，例如ad,adv,adver,advertising，已防止该模块被浏览器当成垃圾广告过滤掉。任何文件的命名均如此；
* 下划线 ’ _ ’ 禁止出现在class命名中，全小写,统一使用’-‘连字符；
* 禁止驼峰命名 className，一般中横线的比较常见；
* 见名知意

### CSS注意事项 ###

1. 不要以无语义的标签作为选择器,这会造成大面积污染
2. 简写CSS颜色属性值
3. 删除CSS属性值为0的单位
4. 删除无用CSS样式
5. 为单个CSS选择器或新申明开启新行
6. 避免过度简写 , .ico足够表示这是一个图标 , 而.i不代表任何意思
7. 使用有意义的名称，使用结构化或者作用目标相关的，而不是抽象的名称