---
title: 功能实现trick1
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0'
abbrlink: feature-tricks1
date: 2022-06-11 05:35:11
tags: 功能实现的tricks
categories: 2.3-实现Tricks
cover: https://cdn.jsdelivr.net/gh/myNightwish/CDN_res/Project/实现1.webp
---

# <center>开发中的功能实现trick</center>

---

## 滚动吸顶的实现

#### 1.1 功能及分析：

> - 滚动过程中，滚至对应区域，对应nav高亮显示；
>
>   所以，要记录页面滚动的高度，这样切换到对应高度区间时，通知该区间对应的子项，激活显示，so，这里还涉及消息传递；
>
> - 点击nav中的子项，跳转至该区域
>
>   相反的，知道了子项，可以得到对应高度区间，再scroll到该区间的左值即可

#### 1.2 自定义Hook：useWindowScroll

- 拿到每一帧中滚动的位置；

```jsx
import { isClient } from '../utils/common';
export default useWindowScroll = () => {
  const frame = useRef(0);
  const [state, setState] = useState({
    x: isClient ? window.scrollX : 0,
    y: isClient ? window.scrollY : 0,
  });

  useEffect(() => {
    const handler = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        setState({
          x: window.scrollX,
          y: window.scrollY,
        });
      });
    };
    window.addEventListener('scroll', handler, {
      capture: false,
      passive: true,
    });

    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener('scroll', handler);
    };
  }, []);
  return state;
};
```

#### 1.3 Context:

- 功能：？
- 为啥要这样做？

```jsx
// 这个文件layout.js中导出了两个函数：LayoutStateProvider、useLayout
const initialState = {headerRef: null};  
const layoutContext = createContext({});
const { Provider } = layoutContext;

const LayoutStateProvider = ({ children }) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case 'updateHeaderRef':
        return { ...state, headerRef: action.data };
      default: return state;
    }
  };
  const [layoutState, dispatch] = useReducer(reducer, initialState);
  return <Provider value={{ layoutState, dispatch }}>{children}</Provider>;
};

// 自定义Hook：获取上下文
function useLayout() {
  const context = useContext(layoutContext);
  if (context === undefined) {throw new Error('useLayout 必须被使用 within a LayoutStateProvider');
  }
  return context;
}
```

#### 1.4 Nav导航组件：

```jsx
import { useLayout } from '../../context/layout';
import useWindowScroll from '../../hooks/useWindowScroll';
import { scroller, Link } from 'react-scroll';

export default ScalebleNav = ({ outerStyle, navItem }) => {
  const { layoutState } = useLayout();   // 拿到layoutContext相关的东西
  const { y } = useWindowScroll();
  const navRef = useRef(null);

  useEffect(() => {    
    // 1. 首次进入页面，拿到导航组件距离顶部的高度
    const nav = navRef.current;
    const topDistance = nav.getBoundingClientRect().top;
    // 2. 判断其
    if (topDistance < 300 && topDistance >= 0 && y < 450 && layoutState.headerRef) {
      nav.style.position = 'inherit';
      // 2.1 控制滚动过程中，按钮的样式改变问题
      // 这个距离怎么计算的
      const offsetW = (100 - (topDistance / 300) * 100) * 0.1666667;
      const offsetH = (100 - (topDistance / 300) * 100) * 0.12;
      nav.style.width = 83.33 + offsetW + '%';
      nav.style.height = 60 + offsetH + 'px';
      const headerTopOffset = 100 - (topDistance / 300) * 100;
      // layoutState.headerRef是什么？
      layoutState.headerRef.style.top = -headerTopOffset + 'px';
    } else if (topDistance > 300 && layoutState.headerRef) {
      nav.style.width = '83.33%';
      layoutState.headerRef.style.top = '0px';
    } else if (y > 450 && topDistance <= 0 && layoutState.headerRef) {
      nav.style.width = '100%';
      nav.style.height = '72px';
      nav.style.position = 'fixed';
      nav.style.top = 0;
    }
  }, [y]);

  return (
    <section style={outerStyle}}>
      <nav ref={navRef}>
        {navItem.map((item, index) => {
          return ( <section>
              <Link
                activeClass={styles['item-link-active']} to={item} 
                offset={-navRef.current?.offsetHeight}
              >{item}
          );
        })}
  );
}
```

#### 1.5 使用导航组件的页面：

```jsx
import { Events, scrollSpy } from 'react-scroll';
const EntertainmentSolution = ({
  architectureData,advantageData,useCaseData, navItem, //导航的每个tab
}) => {
  useEffect(() => {
    Events.scrollEvent.register('begin', () => {});
    Events.scrollEvent.register('end', () => {});
    scrollSpy.update();
    return () => {
      Events.scrollEvent.remove('begin');
      Events.scrollEvent.remove('end');
    };
  }, []);

  return (
    <main>
      <Nav outerStyle={{ top: '450px'}} navItem/>
      <Architecture elementName={navItem[0]} architectureData />
      <Advantage elementName={navItem[1]} advantageData/>
      <UseCase elementName={navItem[2]} useCaseData />
    </main>
  );
};
```

---

## 伸缩折叠实现

```jsx
import { Element } from 'react-scroll';
import Collapsible from 'react-collapsible';
import FadeIn from '../../commonComponents/fadeIn';

const CollapseList = ({
  list,
  loaded,
  setCurrentOpenIndex,
  currentOpenIndex,
}) => {
  return list.map((item, index) => {
    return (
      <div key={index}>
        <Collapsible
          onTriggerOpening={() => {
            loaded.current = false;
            setCurrentOpenIndex(index);
          }}
          onTriggerClosing={() => {
            loaded.current = false;
            setCurrentOpenIndex(-1);
          }}
          open={index === currentOpenIndex}
          easing={'ease-in-out'}
          transitionTime={200}
          trigger={<div className={styles['collapse-trigger-container']}>
              {item.useCaseTitle}
            </div>}
          >
          <div className={styles['useCase-content-container']}>
            <div className={styles['useCase-content']}>{item.useCaseContent}</div>
            <div className={styles['useCase-label']}>
              <Image
                draggable={false}
                src="/img/useCaseLabel.png"
                alt="useCaseLabel"
                layout={'fill'}
              />
            </div>
          </div>
        </Collapsible>
        <div className={styles.divider} />
      </div>
    );
  });
};

const UseCase = ({ elementName, useCaseData }) => {
  const [currentOpenIndex, setCurrentOpenIndex] = useState(0);
  const loaded = useRef(false);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const onImageLoad = () => {
    loaded.current = true;
    forceUpdate();
  };

  return (
    <Element name={elementName}>
      <FadeIn distance="100px" repeat>
        <main className={styles.container}>
          <div className={styles.title}>{useCaseData.title}</div>
          <section className={styles['use-case-content-wrapper']}>
            <section
              style={{height: (useCaseData.content.length - 1) * 67 + 383 + 'px',}}
              className={styles['use-case-left-content']}
            >
              <div className={styles['content-list-container']}>
                <CollapseList
                  loaded={loaded}
                  currentOpenIndex={currentOpenIndex}
                  setCurrentOpenIndex={setCurrentOpenIndex}
                  list={useCaseData.content}
                />
              </div>
            </section>
            <section className={styles['use-case-right-content']}>
              <div
                style={
                  loaded.current
                    ? { opacity: 1, transition: 'opacity 0.6s ease' }
                    : { opacity: 0 }
                }
                className={styles['use-case-right-img-container']}
              >
                <Image
                  onLoad={onImageLoad}
                  alt="配图"
                  src={
                    useCaseData.content[currentOpenIndex]?.imgUrl ||
                    useCaseData.content[0]?.imgUrl
                  }
                  draggable={false}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </section>
          </section>
        </main>
      </FadeIn>
    </Element>
  );
};

export default UseCase;
```

---

## 切换效果实现总结

> 预期效果：切换按钮，展示对应的内容。记录开发过程中：
>
> - 遇见的不同同学写的几种实现方式；
> - 自己写的方式，优化问题；
> - 在此过程中，学习到的新的React概念，比如组件复用问题等；

<img src="https://cdn.jsdelivr.net/gh/myNightwish/CDN_res/CSS/css-tab.png" alt="image-css-tab" style="zoom: 100%;" />

待展示的数据设计：

```js
export const DEMO_LIST = [{
    title: '大猫',
    subTitle: '大猫睡觉了',
    desc: [
      '大猫实时在线直播，打造混血网红猫',
      '大猫实时睡觉，满足猫猫睡觉的多样拍摄睡姿',
      '大猫通过卖萌，完美融合直播生态，打造百万up猫',
    ],
    videoUrl: staticFileMap['cat-demo1'],
  }, {
    title: '二猫',
    subTitle: '二猫睡觉了吗',
    desc: [
      '二猫实时在线直播，打造混血网红猫',
      '二猫实时睡觉，满足猫猫睡觉的多样拍摄睡姿',
      '二猫通过卖萌，完美融合直播生态，打造百万up猫',
    ],
    videoUrl: staticFileMap['cat-demo2'],
  }, {
    title: '三猫',
    subTitle: '三猫其实已经睡觉了呀',
    desc: [
      '三猫实时在线直播，打造混血网红猫',
      '三猫实时睡觉，满足猫猫睡觉的多样拍摄睡姿',
      '三猫通过卖萌，完美融合直播生态，打造百万up猫',
    ],
    videoUrl: staticFileMap['cat-demo3'],
  }, {
    title: '四猫',
    subTitle: '四猫睡觉了哈哈哈',
    desc: [
      '四猫实时在线直播，打造混血网红猫',
      '四猫实时睡觉，满足猫猫睡觉的多样拍摄睡姿',
    ],
    videoUrl: staticFileMap['cat-demo4'],
  }];
```

### 1、方式1：通过antd库

#### 1.1 封装思路

- 思路：tab切换通过antd的Tab组件实现，内容展示再单独封装成组件：https://ant.design/components/tabs-cn/

- 通过状态控制：同步两个组件的信息

```jsx
  const [previous, setPrevious] = useState(0);
  const [current, setCurrent] = useState(0);
```

#### 1.1 左侧手机展示：

- 专门封装了组件：

  - 实现功能：拿到想要播放的视频的索引，播放它就ok
  - 不仅需要知道当前切换的索引是什么，还需要知道切换前的索引，这样才能拿到视频暂停上一个视频的播放

  ```jsx
  <PhonePlayer
    background={'/img/play/cat/cat-background.png'}
    demoList={demoList}
    current={current} 
    previous={previous}
    size="medium"
    />
  ```

- 具体实现：

  细节问题：切换时，初始时其实视频标签都渲染了，但opacity控制它只显示一个：而且通过定位，他们都在同一个位置

  ```css
  .video-phone-case-inner {
    position: relative;
    .phone-video {
      position: absolute;
      top: 10px;
      left: 10px;
      width: calc(100% - 20px);
      height: calc(100% - 25px);
    }
  ```

  ```jsx
  export const PhonePlayer = ({
    background,
    demoList,
    current,
    previous,
    size = 'small',
  }) => {
    const mode = {
      small: { width: 250, height: 520, case: '/img/phone1.png' },
      medium: { width: 450, height: 540, case: '/img/phone2.png' },
    };
    const videoRefs = useRef([]);
    useEffect(() => {
      videoRefs.current = videoRefs.current.slice(0, demoList.length);
    }, [demoList]);
  
    useEffect(() => {
        videoRefs.current[0] && videoRefs.current[0].play();
    }, []);
    useEffect(() => {
      if (previous === current) return;
      videoRefs.current[previous].pause(); //暂停上一个播放的视频 并把时间调回起始点
      videoRefs.current[previous].currentTime = 0;
      videoRefs.current[current].play(); // 播放当前video
    }, [previous, current]);
    
    return (
      <section>
        <div><img  ....放背景图 /></div>
        <div >
            {demoList.map((item, index) => {
              return (
                <video
                  // ...只显示部分属性
                  // 控制元素显隐：如果这里用display性能不好  opacity会有丝滑效果
                  style={{opacity: index === current ? 1 : 0,}} 
                  ref={(el) => (videoRefs.current[index] = el)} // 控制视频播放过程
                  preload="auto"  // 预加载 提前加载，避免播放等待
                />
              );
            })}
            <Image
              src={mode[size].case} 
              height={mode[size].height} width={mode[size].width}
            />
         </div>
      </section>
    );
  };
  ```

#### 1.2 右侧切换展示：

- 引入antd中的tab，需要注意文档中说明：activeKey是string，注意转number

  ```jsx
  <Tabs
    defaultActiveKey="0"
    onChange={(activeKey) => {
        setPrevious(current);   
        setCurrent(Number(activeKey)); }}
    >
    {demoList.map((item, index) => (
      <TabPane tab={item.title} key={index}> //是string
        <div>
          <div>{item.subTitle}</div>
          <div>
            {item.desc.map((text, i) => (
              <div key={i}>
                ....icon显示
                ....文字显示
              </div>
            ))}
          </div>
        </div>
      </TabPane>
    ))}
  </Tabs>
  ```

### 2、方式2：通过display

 >这是我原本写的方式，但并不推荐:
 >
 >- 因为会带来dom的重建与销毁，不利于性能；
 >- 此外，对于视频类的，会感觉播放卡顿

#### 2.1 封装的实现思路：

- 父组件包括切换组件、显示组件，并有**curplay**状态控制，将**状态+改变状态的方法**传递给子组件，
- 子：切换组件，通过匹配该信息，（1）显示切换的激活样式；（2）用户切换时，更新状态**curplay**
- 子：显示组件，通过匹配curplay，显示对应的展示内容，不匹配的隐藏；

#### 2.2 切换组件

- 注意，这个key那边接受不到，所以想传索引，用单独的props

- 然后CurShowTab中，激活样式下划线是伪元素实现

  ```jsx
  {Data.map((item, index) => (
      <CurShowTab
        key={index}
        item={item}
        activeIndex={curPlay}
        itemIndex={index}
        onTabChange={() => {setCurPlay(index);}}
      />
  ))}
  ```

- 伪元素：

  ```css
  &::after {
      content: '';
      display: block;
      width: 100%;
      height: 2px;
      background: pink;
    }
  ```

#### 2.3 显示组件

- 只是展示对应的内容

  ```jsx
  {Data.map((item, index) => {
      const isCurPlay = index === curPlay;
      return (
        <CurShowCard
          item={item}
          isCurPlay={isCurPlay}
          itemIndex={index}
          key={index}
          />
      );
    })}
  ```

### 3、方式3：通过props.children

- 实现目的：将显示部分的内容以插槽的形式传入组件；
- 子组件通过props.children拿到传入的组件，渲染出来；

### 4、方式4：高阶组件的方式

