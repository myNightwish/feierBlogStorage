---
title: CSS tricks-1
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0'
abbrlink: CSStricks-1
date: 2022-06-11 05:34:45
tags: CSS属性
categories: 2.3-实现Tricks
cover: https://mynightwish.oss-cn-beijing.aliyuncs.com/CSS/CSS-tricks1.webp
---


## <center>开发中的CSS tricks-1</center>

---

### 1、hover悬浮效果

```css
.item:hover {
      z-index: 2;
      transition: 0.2s;
      box-shadow: 1px 1px 12px 12px #00000010;
}
```

### 2、混入实现原生CSS读取 ###

- 背景色，采用混入的方式：

  ```css
  原本：Background-image: url()
  ```

- 配置混入：

  ```css
  @function appendHost($path) {
    @return $host + $path;
  }
  
  // 将url带上host
  @mixin backgroundImg($path) {
    background-image: url(appendHost($path));
  }
  ```

- 使用混入：

  ```css
  @include backgroundImg('/componentStatic/danceCard.png');
  ```

- 写行内样式的bg：

  ```jsx
  style={{backgroundImage: 'url(' + src(item.backgroundImg) + ')',}}
  ```

### 3、vertical-align

- 实现场景：

  ```css
  &::before {
    content: '';
    margin-right: 8px;
    display: inline-block;
    width: 2px;
    height: 20px;
    vertical-align: sub;
    background: blue;
  }
  ```

- vertical-align属性：

  参数参考：https://developer.mozilla.org/zh-CN/docs/Web/CSS/vertical-align

  - 使行内元素盒模型与其行内元素容器垂直对齐

  - 垂直对齐表格单元内容:

    注意 `vertical-align` 只对行内元素、行内块元素和表格单元格元素生效：不能用它垂直对齐[块级元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Block-level_elements)。

  - vertical-align：inherit在safari上有兼容问题；

### 4、负定位的用法

![image-20220402170005923](https://mynightwish.oss-cn-beijing.aliyuncs.com/img/image-20220402170005923.png)

- 定位值为负数，且为自身宽度，将伪元素定位到组件外部：

  ```css
  &::after {
    content: '';
    position: absolute;
    top: 22px;
    right: -24px;
    display: block;
    width: 20px;
    height: 200px;
    background: blue;
  }
  ```

> 为什么这样做？
>
> - 这个场景在奇数偶数行反向显示时：页面设计时，将来它下一行是在左边大蓝条；
>
> - 使用组件时，传入参数控制类名，进而在反向显示时。调整父元素位置后，自己left为-负值即可；

### 5、遮罩效果

- hover时，出现遮罩效果：

  ```html
    <style>
      /* 注意chrome上默认了body标签的margin为8，所以遮罩定位出现时不是完全吻合着图片 */
      /* 写好遮罩层样式,并且让它先不显示 */
      .cover {
        position: absolute;
        top: 0;
        left: 0;
        width: 400px;
        height: 300px;
        background-color: rgba(0, 0, 0, 0.5);
        opacity: 0;
      }
      .cover:hover  {
        opacity: 1;  /* hover显示遮罩 */
      }
    </style>
  
    <div class="box" style="width: 400px; height: 300px;">
      // 多句嘴：img的alt对SEO有帮助
      <img object-fit = 'cover' width="400px" height="300px"
      src="https://mynightwish.oss-cn-beijing.aliyuncs.com/img/a-icehill.avif" />
      <!-- 遮罩 -->
      <div class="cover">
        遮罩来了
      </div>
    </div>
  ```


### 6、滚动条

> 文章地址：https://mynightwish.top/posts/scroll.html
>
> 实践场景：在markdown-editor-lite中，中间的滚动条时有时无，非常的诡异（包括测试环境、线上环境、各种浏览器及chrome上的不同版本）；
>
> - 后来，干脆自己整个滚动条，并模拟预期显示的滚动条的样式；
>
> 此外，关于这个编辑器在issue上还有很多其他的bug

### 7、cacl

----待补充







### 8、隐藏属性 ###

https://mynightwish.top/posts/hideElement.html

### 9、gap属性 ###

https://mynightwish.top/posts/gap-property.html

### 10、组件库样式生效 ###

- 只有那种原生的span，div可以生效，其他的类粘贴到控制台修改生效；

- 需要加入:global进行包裹：

  ```css
  :global {
  	.antd-btn-primary {
  		color: red
  	}
  }
  ```

* 此外，对于项目中需要全局的组件库样式，我们建议在公共文件中添加，在具体页面中引入，不同的再覆盖；

### 11、Antd的menu

- 多层级嵌套的时候，map的时候不要key都用index，这样会重复问题：

  ```jsx
   <div className={articleStyles.navContext}>
      <Menu selectedKeys={[currentKey]}>
        {ARTICLE_NAV.map((item, index) =>
            <SubMenu key = {index}>
             {item.navContext.map((item, index2) => 
                  <Menu.Item
                     key = {`${index}-${index2}`} //避免重复
                     onClick = {() => handleSubmenuClick(item, index2, index)}
                   >
                     {item.title}
                   </Menu.Item>
                 )}
          </SubMenu>
        )}
     </Menu>
  </div>
  ```

