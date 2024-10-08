---
title: CSS的浮动及其应用问题
tags:
  - 浮动
  - 高度塌陷
  - BFC
  - IFC
categories: 1.1-CSS
description: 浮动、常见问题、BFC、IFC
cover: >-
  https://images.unsplash.com/photo-1638217335430-24415af7c2af?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=399&q=80
abbrlink: 2007769797
date: 2021-12-11 22:32:46
---
## 浮动 ##

### 1、浮动元素 ###

#### 1、浮动元素的特点 ####

1. 浮动元素会完全脱离文档流，不再占据文档流中的位置；
2. 设置浮动后，元素会向父元素的左侧或右侧移动；
3. 浮动元素默认不会从父元素中移出，边界就是父元素；
4. 浮动元素，向左或向右移动时，不会超过其他浮动元素；
5. 如果浮动元素上边是一个不浮动的块级元素，则浮动元素无法上移；（垂直）
6. 浮动元素不会超过它上边的浮动的兄弟元素，最多就是和它一行；（水平）

`float`设计的初衷就是为了“文字环绕”效果：

```css
.left {
	width: 100px;
}
.right {
	float: left;
}
```

#### 2、脱离文档流的特点 ####

* 块元素
  1. 块元素不在独占一行
  2. 脱离文档流以后宽度和高度被内容撑开
* 行内元素
  1. 行内元素脱离文档流之后会变成块元素，可以设置宽高；也就是不区分行内和块了

### 2、高度塌陷、清除浮动 ###

#### 出现场景： ####

```css
<div class="box1 clearfix">  //无高度
    <div class="box2"></div>  //浮动
</div>
```

子浮动、父无高度塌陷

* 浮动布局中，父元素的高度默认是子元素撑开的；

* 当子元素浮动后，其完全脱离文档流，此时子元素无法撑起父元素的高度，导致父元素高度丢失；

* 父元素高度丢失，导致其下的元素会自动上移，导致页面的布局混乱；

#### 怎么解决： ####

* #### 解决1：clear属性 ####

  ```css
  <div class="box1 clearfix">  // 没有高度
      <div class="box2"></div>  // 浮动
  		<div class="box3"></div>  // 会跑到跟box2一行，父元素没有高度
  </div>
  ```

  * 为后面的元素添加：clear：both

    效果：这种方式并不能改变前面元素的浮动属性，但是后面的元素不会再受到影响。

    **原理：**设置清除后，浏览器会自动为元素添加**上外边距**，使其位置不受其他元素的影响。both属性会清除两侧中，最大影响的那侧；

  ```css
  .box3 {
    // 这种情况下，box3会margin-top，撑起来父元素的高度，此时并不是box2撑开的
  		clear：both  
  }
  ```

* #### 解决2：原理同上 ####

  解决方式1，在用结构去修改样式，新添加样式。但我们希望css的问题就css解决。

  * 可以使用css中伪元素选择器

  ```css
  .box1::after{
  		content: "";
      display: block; //伪元素选择器，行内元素，不会独占一行，要转换一下
      clear: both;
  }
  ```

  * 使用这种方式，同样可以解决外边距重叠问题

* #### 解决3：BFC       不是很推荐 ####

  * 方法1：**父元素也设置浮动**               **不推荐**

  * 方法2：**父级添加overflow**   BFC，在IE6中还需要触发 hasLayout    不是很推荐

    * 优点：代码简洁，不存在结构和语义化问题
    * 缺点：内容增多的时候容易造成不会自动换行导致内容被隐藏掉，无法显示要溢出的元素；

  * 方法3：**父元素设置display:table **      **不推荐**

    *  优点：结构语义化完全正确，代码量极少
    *  缺点：盒模型属性已经改变，由此造成的一系列问题，得不偿失，不推荐使用

### 3、BFC ###

#### 1、概念： ####

块级盒子渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用

* BFC本身不会发生`margin`重叠。
* **BFC可以彻底解决子元素浮动带来的的高度坍塌和文字环绕问题。**

#### 2、规则： ####

1. 内部`box`在垂直方向，一个接一个的放置

   * 内部bx就是块级元素，所以平常div、p是独占一行

2. box的垂直方向由`margin`决定，**属于同一个BFC的两个box间的margin会重叠**

   * HTML是BFC，所以内部垂直方向的元素margin会发生重叠；

   * 但子孙元素与该BFC上下边界margin不能重叠，保证了BFC内部的元素不会影响外部的元素；

   * 两个上下相邻的BFC之间折不折叠要看具体情况：

     如display: inline-block、float: left不会折叠；而overflow: hidden会折叠

3. 每一个盒子的左外边距应该和**包含块**的左边缘相接触。即使存在浮动也是如此，除非子盒子形成了一个新的BFC。

   * 是普通的流布局和定位布局默认贴着“左侧”思想的总结：

     1. 包含块未必就是父级元素。对于`position: absolute`来说，包含块是指第一个`positoin`不为`static`的祖先元素

     2. BFC中的盒子应该与其自身的包含块相接触，而非与BFC盒子本身相接触

     3. BFC中的盒子是与其包含块的 左边缘 相接触，而不是包含块的 `left-border` 相接触

        左边缘可能是`content box`的左边缘（非绝对定位如`position: relative` `float: left`，也可能是`padding box`的左边缘（如绝对定位`position: absolute` `position: fixed`）

4. 计算BFC的高度时，考虑BFC所包含的所有元素，连浮动元素也参与计算；

5. 一个隔离独立容器，容器里面的子元素不会影响到外面的元素。反之也如此

6. BFC的区域不会与`float box`重叠；

#### 3、如何触发： ####

1. 根元素
2. `float`属性不为`none`
3. `position`为`absolute`或`fixed`
4. `overflow`不为`visible`
5. `display`为`inline-block`, `flex`，`table`，`table-cell`

### 4、IFC ###

#### 1、包含块 ####

* 概念：离当前元素最近的祖先块元素
* 作用：元素会为它的子孙元素创建包含块，但是，并不是说元素的包含块就是它的父元素，元素的包含块与它的祖先元素的样式等有关系
* 举例：
  * 元素是最顶端的元素，它没有父节点，它的包含块就是初始包含块
  * static和relative的包含块由它最近的块级、单元格或者行内块祖先元素的内容框（content）创建
  * fixed的包含块是当前可视窗口
  * absolute的包含块由它最近的position 属性为`absolute`、`relative`或者`fixed`的祖先元素创建
    * 如果其祖先元素是行内元素，则包含块取决于其祖先元素的`direction`特性
    * 如果祖先元素不是行内元素，那么包含块的区域应该是祖先元素的内边距边界

#### 2、控制框 ####

块级元素和块框以及行内元素和行框的相关概念

**块框:**

* **块级元素**会生成一个块框（`Block Box`），块框会占据一整行，用来包含子box和生成的内容

* **块框**同时也是一个块包含框（`Containing Box`），里面要么只包含块框，要么只包含行内框（不能混杂），如果块框内部有块级元素也有行内元素，那么行内元素会被**匿名块框**包围

* 关于**匿名块框**的生成，示例：

  ```
  <DIV>
  Some text
  <P>More text
  </DIV>
  ```

  `div`生成了一个块框，包含了另一个块框`p`以及文本内容`Some text`，此时`Some text`文本会被强制加到一个匿名的块框里面，被`div`生成的块框包含

* **如果一个块框在其中包含另外一个块框，那么我们强迫它只能包含块框，因此其它文本内容生成出来的都是匿名块框（而不是匿名行内框）**

**行内框：**

* 一个行内元素生成一个**行内框**，行内元素能排在一行，允许左右有其它元素

* 关于**匿名行内框**的生成，示例：

  ```
  <P>Some <EM>emphasized</EM> text</P>
  ```

  `P`元素生成一个块框，其中有几个行内框（如`EM`），以及文本`Some `，` text`，此时会专门为这些文本生成匿名行内框

#### 3、display属性的影响 ####

`display`的几个属性也可以影响不同框的生成：

* `block`，元素生成一个块框
* `inline`，元素产生一个或多个的**行内框**
* `inline-block`，元素产生一个**行内级块框**，行内块框的内部会被当作块框来格式化（这也是为什么会产生`BFC`），而此元素本身会被当作行内框来格式化（）
* `none`，**不生成框**，不在格式化结构中，另一个`visibility: hidden`则**会产生一个不可见的框**

总结：

* 如果一个框里，有一个块级元素，那么这个框里的内容都会被当作块框来进行格式化，因为只要出现了块级元素，就会将里面的内容分块几块，每一块独占一行（出现行内可以用匿名块框解决）
* 如果一个框里，没有任何块级元素，那么这个框里的内容会被当成行内框来格式化，因为里面的内容是按照顺序成行的排列

#### 4. IFC ####

* IFC即行内框产生的格式上下文，行内元素自身如何显示以及在框内如何摆放的渲染规则

* 特点：

  * 框一个接一个地水平排列，起点是包含块的顶部。
  * 水平方向上的 margin，border 和 padding 在框之间得到保留
  * 框在垂直方向上可以以不同的方式对齐：它们的顶部或底部对齐，或根据其中文字的基线对齐

* **行框**

  **包含那些框的长方形区域，会形成一行，叫做行框**

* 行框的规则：

  * 行内框的分割：如果几个行内框在水平方向无法放入一个行框内，它们可以分配在两个或多个垂直堆叠的行框中
  * 行框在堆叠时没有垂直方向上的分割且永不重叠
  * 行框的宽度由它的包含块和其中的浮动元素决定，高度总是足够容纳所包含的所有框。不过，它可能高于它包含的最高的框
  * 行框的左边接触到其包含块的左边，右边接触到其包含块的右边

* 补充下IFC规则：

  * 浮动元素可能会处于包含块边缘和行框边缘之间
  * 尽管在相同的行内格式化上下文中的行框通常拥有相同的宽度（包含块的宽度），它们可能会因浮动元素缩短了可用宽度，而在宽度上发生变化
  * 同一行内格式化上下文中的行框通常高度不一样（如，一行包含了一个高的图形，而其它行只包含文本）
  * 当一行中行内框宽度的总和小于包含它们的行框的宽，它们在水平方向上的对齐，取决于 `text-align` 特性
  * 空的行内框应该被忽略。即不包含文本，保留空白符，margin/padding/border非0的行内元素，
    以及其他常规流中的内容(比如，图片，inline blocks 和 inline tables)，并且不是以换行结束的行框，必须被当作零高度行框对待

#### 5、总结： ####

* 行内元素总是会应用IFC渲染规则
* 行内元素会应用IFC规则渲染，譬如`text-align`可以用来居中等
* 块框内部，对于文本这类的匿名元素，会产生匿名行框包围，而行框内部就应用IFC渲染规则
* 行内框内部，对于那些行内元素，一样应用IFC渲染规则
* 另外，`inline-block`，会在元素外层产生IFC（所以这个元素是可以通过`text-align`水平居中的），当然，它内部则按照BFC规则渲染