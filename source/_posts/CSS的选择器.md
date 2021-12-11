---
title: CSS的选择器
date: 2021-12-11 22:28:34
tags:
- 选择器
- 选择器优先级
categories: CSS
description: '常见的选择器及其优先级'
cover: https://images.unsplash.com/photo-1607165124139-a8c46d126f44?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80
---

## 一、CSS选择器 ##

### 1、CSS选择器  ###

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/613b29f0bfb74f8e84947e243f865875~tplv-k3u1fbpfcp-watermark.awebp" alt="img" style="zoom: 50%;" />

#### 1、分类 ####

* #### 基本选择器 ####

```css
* ID 选择器， 如 #id{}
* 类选择器， 如 .class{}
* 标签选择器， 如 span{}
* 通配选择器， 如 *{}
```

* #### 组合选择器 ####

```css
    /* 后代选择器  空格隔开   匹配所有符合的后代元素*/
    div span { margin-left: 10px; background: #ff8585  }
    /* 子元素选择器  > 连接; 匹配符合的直接子元素; 不包括子元素的子元素 */
    .div1>span { color: #6155a6 }
    /* 群组选择器  逗号隔开 */
    .div1, .div2 { color: #a7c5eb }
    /* 相邻兄弟元素选择器  + 连接; 匹配某元素后紧邻的兄弟元素 */
    .div3 + div { color: #fd3a69 }
    /* 兄弟选择器   ~ 连接; 匹配某元素后所有同级的指定元素，强调的是所有的 */
    .div5 ~ div {  color: #008891 ; }
```

* #### 伪元素选择器         略 ####

* #### 伪类选择器             略  ####

* #### 属性选择器 ####

  ```css
  [属性名] 选择含有指定属性的元素
  [属性名=属性值] 选择含有指定属性和属性值的元素
  [属性名^=属性值] 以属性值开头的元素
  [属性名$=属性值] 以属性值结尾的元素
  [属性名*=属性值] 以属性值含有某值的元素
  
  p[title=abc]{
    color:orange;
  }
  p[title^=abc]{
      background-color: red;
  }
  ```

#### 2、选择器优先级 ####

* !important（最强势） > 内联(1000) > id(100) > class(10) = 属性选择器 = 伪类选择器 > 标签选择器(1) = 伪元素选择器 > 通用
* 权重计算important不参与；它高于没有important的，多个会互相抵消，具体不知道
* 权重值相同时，写在后面的样式生效
* 如果针对同一元素样式存在冲突且同时存在 !important ，那么选择器总权重值高者生效
* 权重即使无限叠加也不能跨层级
* 指定大于继承，继承最低

#### 3、样式优先级 ####

* 内联样式表（标签内部）> 嵌入样式表（当前文件中）> 外部样式表> @import导入

### 2、伪元素选择器 ###

* 特点：无中生有，用于创建一些不在DOM树中的元素，并为其添加样式

  比如：通过:before 来在一个元素前增加一些文本，并为其添加样式。虽然用户可以看到这些文本，但是实际上不在文档树中

* 用途：

  1. 清除浮动
  2. 辅助生成一些装饰性的箭头之类，保证html语义，不会出现无意义的空元素

```css
/* ::after 在选中元素的最后添加一个子元素，默认为行内元素 (替换元素上不生效) */
.div1::after { content: 'div1 的 after'; margin-left: 10px; color: #ef4f4f }
/* ::before 在选中元素的第一个位置添加一个子元素 (其他用法同 ::after) */
.div2::before { content: 'div2 的 before'; margin-right: 10px; color: #ee9595 }

/* ::first-letter 匹配选中块级元素的第一行的第一个字符 */
.div3::first-letter { color: #ff4646 }
/* ::first-line 匹配选中块级元素的第一行 */
.div4::first-line { color:  #9dab86 }
/* ::marker 匹配选中有序或无序列表的序号或符号 */
.div5 ul li::marker { color: #fdb827 }
/* ::selection 匹配元素中被选中高亮的部分 */
.div6::selection { background: #9dab86; color: white }
```

### 3、伪类选择器 ###

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/310652ad0bf040cda0b17b4054cecaa1~tplv-k3u1fbpfcp-watermark.awebp" alt="img" style="zoom: 80%;" />

* 特点：
  1. 当已有元素处于的某个状态时，为其添加对应的样式
  2. 虽然和普通css 类相似，可以为已有的元素添加样式，但是它只有处于 dom 树无法描述的状态下才能为元素添加样式，所以将其称为伪类

* 用途：改变超链接的样式

#### 1、动态伪类 ####

```css
a:link { color: #11698e; }
a:visited {color: #9fb8ad; }
a:hover{ color: #383e56; }
a:active{ color: #fb743e; }
```

#### 2、结构性伪类 ####

```css
    /* 父元素的第一个子元素且该子元素为 p 的元素 */
    p:first-child { background: #046582; }
    /* 父元素中第 2n 个子元素且为 p 的元素 */
    p:nth-child(2n) { background: #bb8082; }
    /* 父元素中唯一子元素的 i 元素 */
    i:only-child { background: #865858; }

		/* 父元素中第一个 span 元素 */
    span:first-of-type { background: #6e7582; }
    /* 父元素中第 2n 个 span 元素 */
    span:nth-of-type(2n) { background: #f39189; }
    /* 父元素有且仅有一个为 i 的元素 */
    strong:only-of-type { background: #8e7f7f; }

    /* 没有子元素的元素 */
    p:empty { height: 16px; background: #bbb; }
    /* 根元素   HTML 中相当于 <html> */
    :root { background: #e2d5d5; color: #fff; }
```

#### 3、目标伪类、否定伪类、语言伪类 ####

```css
/* 目标伪类 :target: 代表一个唯一的页面元素(目标元素)，其 id 与当前URL片段匹配 */
div:target { color: #f05454; }
/* 否定伪类 :not   注: 仅 Chrome、Firefox 和 Safari 高版本浏览器适用*/
p:not(#p1){ color: #e27802; }
/* 语言伪类 :lang */
div:lang(zh) { color: #ffc1b6; }
```

#### 4、表单类伪类 ####

```css
   /* :enabled 可用状态 */
   input[type="radio"]:enabled {  box-shadow: 0 0 0 3px #7c9473; }
   /* :disabled 禁用状态 */
   input[type="radio"]:disabled {  box-shadow: 0 0 0 3px #cfdac8;  cursor: not-allowed; }
   /* :checked radio 或 checkbox 表单被勾选状态 */
   /* 注意书写顺序，选择元素相同时 :checked 应写在 :enabled/:disabled 后面 */
   input[type="radio"]:checked {  box-shadow: 0 0 0 3px #c0e218 ; }
   /* :default 表示一组相关元素中的默认(选中)表单元素   此处 :default 应用于默认设置了 checked 的 radio 表单上 */
   /* 该选择器可以在 <button>, <input type="checkbox">, <input type="radio">, 以及 <option> 上使用 */
    input[type="radio"]:default {  box-shadow: 0 0 0 3px #86aba1;}
   /* :read-write 可读及可写状态。 */
   input:read-write { background: #7c9473; }
   /* :read-only 只读状态 */
   input:read-only { background: #cfdac8; }
```
