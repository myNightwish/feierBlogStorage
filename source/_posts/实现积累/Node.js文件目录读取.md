---
title: 'fs-文件目录读取'
tags: Node、Antd
categories: 2.3-实现Tricks
cover: https://mynightwish.oss-cn-beijing.aliyuncs.com/Project/文件读取.png
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: file-read
date: 2022-01-19 23:50:26
---
#### 需求：

Article页面有一个menu，其中有5个子menu，点击切换子subMenu，点击menuItem显示对应该Submenu下的.md文档的内容

#### 设计思路

- posts文件夹下有很多5个子文件夹，每个文件夹下有4个.md文件
- .md文档里的内容的目录结构与Article中的menu的subMenu是对应的，切换menu，点击menuItem显示对应该Submenu下的.md文档
- 我们需要读取每个子文件夹里的.md文档，并按照这种对应关系渲染在页面上
- 一些额外考虑的点：
  - 不希望对运营人员写文档时，做过多的约束。因此，没有对md文档内容本身做任何限制；
  - 存放文档的位置：只需要进入既定的文件夹，填写或更新文档即可，方便后期维护

#### 具体实现：

- 在lib下新建文件post.js，在该文件定义读取文件的操作

  ```js
  export function getAllPagePostsData() {}
  ```

- 在要渲染的页面Article中渲染之前，借助在渲染页面之前获取数据：

  ```js
  export async function getStaticProps() {
      const allPageData = getAllPagePostsData()
      return {
        props: {
          allPageData
        }
      }
  }
  ```

- 获取数据后，只需要显示借助ReactMarkdown将内容渲染出来即可

  ```jsx
  <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownInfo.fileContents}</ReactMarkdown>
  ```

- `getAllPagePostsData`d的实现过程：

  ```js
  import fs from 'fs'
  import path from 'path'
  
  // 拿到当前目录
  const postsDirectory = path.join(process.cwd(), 'utils/posts/');
  export function getAllPagePostsData() {
    // 拿到所有的子文件目录
    const subFileDir = fs.readdirSync(postsDirectory, (err,files) => {
        const allSubDir = [];
        //迭代器 异步变同步
        (function iterator(i) {
            if( i == files.length) return allSubDir;
            fs.stat(postsDirectory + files[i],function (err,stats) {
                if(stats.isDirectory()){
                    allSubDir.push(files[i])
                }
                iterator(i + 1);
            });
        })(0);
    })
   
    // 拿到所有子文件夹得所有md文档信息
    const allPageData = subFileDir.map((item, index) => {
        // 获取子文件夹中的文件
        const curPath = path.join(postsDirectory, item)
        const fileNames = fs.readdirSync(curPath)
        
        // 拿到一个子文件夹下的所有md文档相关信息：存在curPageAllPostsData里
        const curPageAllPostsData = fileNames.map(fileName => {
            // 从文件名中移除后缀.md，定义为文件对应的id
            const id = fileName.replace(/\.md$/, '')
       		 // 获取文件路径    
            const fullPath = path.join(curPath, fileName)
            // 读取文件内容
            const fileContents = fs.readFileSync(fullPath, 'utf8')
            // 读取文件的修改时间
            const oriDate = fs.statSync(curPath, fileName).ctime+''
            // 截取前面部分
            const modifyDate = oriDate.split('G')[0]
            // 包裹一个文档需要的信息：id，修改时间，文档内容
            return {
                id,
                modifyDate,
                fileContents
            }
          }
        )
        return curPageAllPostsData.sort((a, b) => a.id - b.id);
          // 在md文档的文件夹中，做了限制：每个md文档命名时必须指定第几个文件夹下的第几个文档
          // 第几个文件夹下的第几个文档在页面渲染Article中对应哪个Submenu下的menuItem
  				// 二者是匹配的，如果随便写，会导致渲染出来的顺序是乱的   渲染出来的顺序取决于当初文件读取顺序：我们限制了文件名命名就是为了让Article页面拿到的数据是有序对应的  
    });
    return allPageData;
  }
  ```

#### 一些拓展：

为了保证页面的渲染顺序，做法是限制文件命名方式，还有一些其他的做法可以参考

1. 限制md文档的书写格式：比如像插件gray-matter那样，必须在文档起初加限制：

   优点：比较方便，我们可以直接拿到想要的信息等

   缺点：必须按照约束的格式去写

2. 在每个子文件夹上加上`config.js`文件，限制它读取文件之前先读该文件，而该文件中定义了文件读取规则：

   ```
   
   ```