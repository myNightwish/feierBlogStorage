---
title: CSS tricks-2
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0'
abbrlink: CSStricks-2
date: 2022-06-12 18:01:08
tags: CSS属性
categories: 2.3-实现Tricks
cover: https://mynightwish.oss-cn-beijing.aliyuncs.com/CSS/CSS-tricks1.webp
---

## <center>开发中的CSS tricks-2</center>

### 1、100vw横向滚动条：

#### 100vw的问题： ####

* 在容器宽度设置为100vw，高度很小时：没有滚动条，任意调整窗口

  ```css
  <div class="wrapper">testContent</div>
  * {padding: 0;margin: 0;}
  .wrapper {
      width: 100vw;
      height: 50px;
  }
  ```

  <img src="https://mynightwish.oss-cn-beijing.aliyuncs.com/CSS/100vw-1.webp" style="zoom: 33%;" />

* 在容器宽度设置为100vw，高度很大时，内容不能完整显示出来：横向、纵向都出现了滚动条

  为什么纵向内容超出了，横向也会受影响呢？

  https://stackoverflow.com/questions/23367345/100vw-causing-horizontal-overflow-but-only-if-more-than-one/23367686#23367686

  * 纵向滚动条是占用浏览器宽度的
  * 为了让宽度为 100vw 的元素的最右边能完整的展示出来，浏览器会展示一个横向滚动条让用户滚动看到最右侧内容

  ```css
  <div class="wrapper">testContent</div>
  * {padding: 0;margin: 0;}
  .wrapper {
      width: 100vw;
      height: 5000px;
  }
  ```

  <img src="https://mynightwish.oss-cn-beijing.aliyuncs.com/CSS/100vw-2.webp" style="zoom:33%;" />

#### 如何解决：

- 方式1：100%

  100%是指的父元素的宽度的100%

  ```css
  .wrapper {
  	width: 100%;
    height: 5000px;
  }
  ```

  <img src="https://mynightwish.oss-cn-beijing.aliyuncs.com/CSS/100%-resolve.webp" alt="image-20220612202320476" style="zoom:33%;" />

- 方式2：

  ```css
  .wrapper {
    width: 100vw;
    height: 5000px;
    max-width:100%;  /* added */
  }
  ```

#### 注意：

Mac系统上，如果：系统偏好设置-->通用 --> 显示滚动条：

- 勾选第1个：在 Chrome 下只有滚动页面的时候才会出现滚动条，而且这个临时的滚动条不会占用页面宽度的，滚动完成后自动消失
- 勾第2个：滚动条会一直显示并且占用页面宽度

### 2、溢出省略 ###

#### 单行文本省略： ####

```css
span {
  display: inline-block;
  overflow: hidden;
  // width会定死，而max-width实现根据自身宽度展开：达到宽度时缩略，不够时不缩略
  max-width: 700px;   
  white-space: nowrap;// 不换行
  text-overflow: ellipsis; // 溢出省略
}
```

#### 多行溢出省略

```css
-webkit-line-clamp限制在一个块元素显示的文本的行数 
需要组合其他的WebKit属性,常见结合属性：
  display: -webkit-box; 必须结合的属性，将对象作为弹性伸缩盒子模型显示
  -webkit-box-orient 必须结合的属性，设置或检索伸缩盒对象的子元素的排列方式。
```

```css
.ellipsis{
  overflow: hidden;    
  display: -webkit-box;
  text-overflow:ellipsis;    
  -webkit-line-clamp:2;
  -webkit-box-orient: vertical
}
```

#### 补充卡片折叠效果实现： ####

##### 需求 #####

* 点击展开：同层级卡片全部展开，被点击的卡片文字展开，未被点击的不展开；
* 点击折叠：被点击的折叠，不被点击的维持不动：
* 两列卡片

##### 实现： #####

* 需要状态记录当前被展开的是哪行，因为可能是多行，所以应该是数组；我们使用了ref的current属性：rowRef.current[index] = 。。。。

  * 初始时，所有list数除以2这么多子项，为false；

  * 更新时，交互发生时，去更新点击卡片对应的行：因此涉及函数

    ```js
    // 根据index ---> 映射出行row
    const indexToRow = (index) => {
      return Math.ceil(index+1 / 2);
    }
    ```

    ```js
      const handleClick = (index) => {
        const curRow = indexToRow(index);
        //更新最新的行
        setCardStatus(!cardStatus)
        rowRef.current[curRow] = cardStatus;
      }
    ```

  * 为了记录卡片的切换状态：还需要状态记录打开关闭问题：cardStatus

* 遍历所有的index，匹配是当前行的高度展开，不是的高度不变；

  因此还需要判断函数,决定每个item的class ---> 高度

  ```js
  const isMatchRow = (index) => {
    const curRow = indexToRow(index);
    //遍历所有row，找到是否有匹配的：
  	return rowArr.indexOf(curRow) !== -1;;
  }
  ```

##### 遗留难点： #####

* 要求溢出最后一行截断的70px，之后的溢出隐藏显示

### 3、待续。。。。补充 ###

