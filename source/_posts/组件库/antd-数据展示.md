---
title: antd-数据展示
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0'
tags: 组件库-antd
categories: 2.1-组件库
cover: 'https://cdn.jsdelivr.net/gh/myNightwish/CDN_res/zujianku/antd-data-show.png'
abbrlink: antd-data-show
date: 2022-06-11 05:14:55
---

## antd之数据展示类

> 记录一下实际开发中用到的一些有意思的组件及遇到问题解决
>
> 文档：https://ant.design/docs/spec/data-display-cn#%E6%A0%91%E5%BD%A2%E6%8E%A7%E4%BB%B6%EF%BC%88Tree%EF%BC%89
>
> 分类总结下遇到的组件，遇到再更新

### Tree

> 『树形控件』通过逐级大纲的形式来展现信息的层级关系，高效且具有极佳的视觉可视性
>
> 用户可同时浏览与处理多个树状层级的内容。适用于任何需要通过层级组织的信息场景，如文件夹、组织架构、生物分类、国家地区等等。
>
> #### 基本使用：
>
> ```jsx
> <Tree
>    defaultExpandedKeys={['0-0-0', '0-0-1']}
>    defaultSelectedKeys={['0-0-0', '0-0-1']}
>    defaultCheckedKeys={['0-0-0', '0-0-1']}
>    onCheck={onCheck}
>    treeData={treeData} 
> />
> ```
>
> treeData是渲染的树形数据数据
>
> - 可以使用预先确定好的树形数据、或者外部请求、传值拿到的数据
>
> - 也可以通过代码动态生成，比如
>
>   ```jsx
>   const generateData = (_level, _preKey, _tns) => {
>     const preKey = _preKey || '0'; // 第一层级从0开始拼接，往后递归时会将前面拼接的带入
>     const tns = _tns || gData;
>   
>     const children = [];
>     for (let i = 0; i < x; i++) {
>       const key = `${preKey}-${i}`;
>       tns.push({ title: key, key });
>       if (i < y) { children.push(key);}
>     }
>     if (_level < 0) return tns;
>     const level = _level - 1;
>     children.forEach((key, index) => {
>       tns[index].children = [];
>       return generateData(level, key, tns[index].children);
>     });
>   };
>   
>   const x = 3;
>   const y = 2;
>   const z = 1;
>   const gData = []; // 生成的数据用来渲染Tree
>   generateData(z);  
>   ```

#### 1.1 场景1：重命名

- 实现原理：自定义子节点：

  ```jsx
  const renameRef = useRef<any>(null);  // 这里的用法并不是绑定dom节点，只是记录一个值
  // 点击重命名按钮时：其中 
  renameRef.current = node.key; // renameRef记录了重命名时想要改变的节点
  ```

  ```jsx
  <Tree 
    treeData={treeData}
  	titleRender={(v) => {
      // 当渲染成input输入框时，状态控制变量是开的 且必须是当前点击的节点 （匹配节点key值）
      const isRenameNode = isInputVisible && renameRef.current === v.key;
      // 选择性渲染或普通渲染
      return (isRenameNode ? 
         <RenameInput currName={currName}
          handleChange={(e) => setCurrName(e.target.value)}
          handleEnter={handleRename} // 重命名框的回车或obBlur，重命名函数调用
          maxLen={menuIndex.length > 2 ? 20 : 10}
         /> : <div>{v.title}</div>)
    }}/>
  ```

  ```tsx
    // 输入框回车后调用函数
    const handleRename = (): void => {
      if (!currName.length) return;
      if (menuIndex.length > 2) {
        treeData[menuIndex[1]].children[menuIndex[2]].title = currName;
      } else {
        treeData[menuIndex[1]].title = currName; 
      }
      setTreeData([...treeData]); // 更新treeData
      setIsInputVisible(false);  // 控制弹窗显隐
    };
  ```

#### 1.2 场景2：拖拽层级

> 官方文档中有自由拖拽的例子，需要了解几个关键属性：
>
> ```jsx
> // node         代表当前被drop 的对象
> // dragNode     代表当前需要drop 的对象
> // dropPosition 代表drop后的节点位置；不准确
> // dropToGap    代表移动到非最顶级组第一个位置
> ```
>
> 关于dropPosition的issue：https://github.com/ant-design/ant-design/issues/14244
>
> ##### 自由拖拽
>
> ```tsx
> const loop = (data, key, callback) => {
> // 递归寻找树中的节点，通过传入的key，匹配到拖拽节点
> // 匹配到后，将当前元素，极其子节点，传入回调函数
>    for (let i = 0; i < data.length; i++) {
>      if (data[i].key === key)  return callback(data[i], i, data);
>      if (data[i].children) {
>        loop(data[i].children, key, callback);
>      }
>    }
>  };
> ```
>
> ```tsx
> const handleDrag = (info): void => {
>  const dropKey = info.node.key;
>  const dragKey = info.dragNode.key;
>  const dropPos = info.node.pos.split('-');
>  // info.dropPosition: 你希望拖到哪里，从1开始计数
>  // dropPos[dropPos.length - 1]：目标节点的索引位置  
>  // 所以正常情况下，这个地方info.dropPosition永远是1
>  // dropPosition: ( -1 | 0 | 1 ) dropPosition计算前的值，可以查看rc-tree源码;
>  // -1 代表移动到最顶级组的第一个位置
>  const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
>  const loopData = [...treeData];
> 
>  let dragObj; // 用来保存删除的节点
> // 找到拖拽的节点及索引，从渲染数组中删除该项 
>  loop(loopData, dragKey, (item, index, arr) => {
>    arr.splice(index, 1);
>    dragObj = item;
>  });
> 
>  // 如果要：移动到非最顶级组第一个位置
>  // 找到dropKey对应的节点数据，将拖拽节点数据添加至目标节点的children中
>  if (!info.dropToGap) {
>    loop(loopData, dropKey, item => {
>      item.children = item.children || [];
>      item.children.unshift(dragObj);
>    });
>  } else if (
>   // 平级移动、交叉组移动、移动到其他组(非最顶级)非第一个位置
>    (info.node.props.children || []).length > 0 && info.node.props.expanded && dropPosition === 1
>  ) {
>    loop(loopData, dropKey, item => {
>      item.children = item.children || [];
>      item.children.unshift(dragObj);
>    });
>  } else {
>    // 移动到最顶级第一个位置
>    let ar;
>    let i;
>    loop(loopData, dropKey, (item, index, arr) => {
>      ar = arr;
>      i = index;
>    });
>    if (dropPosition === -1) {
>      ar.splice(i, 0, dragObj);
>    } else {
>      ar.splice(i + 1, 0, dragObj);
>    }
>  }
>  setTreeData(loopData);
> };
> ```

> ##### 同层级拖拽
>
> - github的issue：https://github.com/ant-design/ant-design/issues/15926
>
> ```tsx
>   const isSameLevel = (a, b) => {
>     const aLevel = a.props.pos.split('-').length;
>     const bLevel = b.props.pos.split('-').length;
>     return aLevel === bLevel;
>   };
>   const isSameParent = (a, b) => {
>     const aLevel = a.props.pos.split('-');
>     const bLevel = b.props.pos.split('-');
>     aLevel.pop();
>     bLevel.pop();
>     return aLevel.join('') === bLevel.join('');
>   };
> 
>     const handleDrag = (info): void => {
>     const dragNode = info.node;
>     const dropNode = info.dragNode;
>     const canDrop = isSameParent(dragNode, dropNode) && isSameLevel(dragNode, dropNode);
>     if (!canDrop) {
>       alert('不允许跨层级拖拽');
>       return;
>     }
>     const dropKey = info.node.key;..../省略
>     }
> ```

### 走马灯

> 作为一组平级内容的并列展示模式，常用于图片或卡片轮播，可由用户主动触发或者系统自动轮播。适合用于官网首页、产品介绍页等展示型区块。
>
> > 注：
> >
> > 1. 轮播的数量不宜过多以免造成用户厌烦，控制在 3~5 个之间为最佳
> > 2. 建议在设计上提供暗示，让用户对轮播的数量和方向保持清晰的认知

### 卡片

> 卡片是一种承载信息的容器，对可承载的内容类型无过多限制，它让一类信息集中化，增强区块感的同时更易于操作；卡片通常以网格或矩阵的方式排列，传达相互之间的层级关系。适合较为轻量级和个性化较强的信息区块展示。
>
> > 注：
> >
> > 1. 卡片通常根据栅格进行排列，建议一行最多不超过四个
> > 2. 在有限的卡片空间内需注意信息之间的间距，若信息过长可做截断处理。例如『Ant Design 适用于中台…』

### 时间轴

> 垂直展示的时间流信息，一般按照时间倒叙记录事件，追踪用户当下以及过去做了什么。每一条信息以时间为主轴，内容可涵盖主题、类型、相关的附加内容等等。
>
> 适用于包括事件、任务、日历标注以及其他相关的数据展示。

