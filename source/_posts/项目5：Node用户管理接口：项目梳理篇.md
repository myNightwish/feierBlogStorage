---
title: 项目5：Node用户管理接口：项目梳理篇
date: 2021-12-12 00:19:34
tags: Node、MySQL2
categories: 项目总结
cover: https://images.unsplash.com/photo-1638645671264-82cae622dada?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDUwfHhIeFlUTUhMZ09jfHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60
copyright_author: 飞儿 
copyright_url: https://www.nesxc.com/post/hexocc.html 
license: CC BY-NC-SA 4.0
license_url: https://creativecommons.org/licenses/by-nc-sa/4.0/
---

* 项目时间： 2021年2月
* 项目背景： 春节在家，只是想简单了解下接口、数据库的概念
* 梳理篇：大概梳理了哪些功能，实现思路。。吧，记忆丢失，嘤嘤嘤

## 用户管理系统逻辑 ##

#### 1. 用户注册 ####

```
// 用户注册
userRouter.post('/', verifyUser, handlePassword, create)
```

1. 验证是否已有该账户： verifyUser
   查询数据库，结果是否为空

2. 对用户信息加密：handlePassWord，目的：避免存在数据库中的用户信息是明文的

   借助框架crypto的createHash（），MD5的加密方式

3. 创建新用户：create

   对users表插入数据

#### 2. 用户登录 ####

```
// 用户登录
authRouter.post('/login', verifyLogin, login)
// 验证是否授权的一个接口
authRouter.get('/test', verifyAuth, success)
```

1. 验证账户密码正确：verifyLogin
   * 拿到请求中的账户密码，是否为空、是否存在该用户
   * 对登录的密码进行MD5的加密，去数据库查询是否匹配
2. 登录：login
   * 从ctx.user中拿到id和name，通过jwt.sign({})，设置过期时间+私钥的加密算法，生成token。

#### 3. 用户动态 ####

```
//发表动态之前要先验证登录，然后才是create创建动态
momentRouter.post('/', verifyAuth, create)
// 查看动态,不需要登录,需要知道动态对应的id
momentRouter.get('/:momentId', momentDetail)

// 修改动态 
momentRouter.patch('/:momentId',verifyAuth, verifyPermission, update)
// 删除动态
momentRouter.delete('/:momentId',verifyAuth, verifyPermission, remove)
// 给动态添加标签
momentRouter.post('/:momentId/labels', verifyAuth, verifyPermission,
                    verifyLabelExist,addLabels)
```

1. 验证登录：verifyAuth，作用：验证用户授权与否、颁发签名是否有效

   在验证时：

   * 通过ctx.headers.authorization拿到authorization，处理（去掉Bearer ），得到token
   * 通过jwt.verify(token, 公钥，{解密算法})拿到解密后的信息。
   * 通过try.catch块包裹，如果有错误会抛出。否则进入下一个中间件

2. 创建动态：create

   * 在上一中间件中ctx.user，进行解构拿到id（哪个用户），拿到content内容（请求体），插入数据库moment表中

3. 查询动态:

   * 单条：由params拿到要查询的动态id，再去数据库moment表中查询（左连接）
   * 多条：offset和size在query中拿到，在评论的功能汇总添加的动态的评论数量。这是通过修改sql语句，增加字段

4. 修改动态

   * 验证登录verifyAuth

   * 验证是否具备修改权限verifyPermission
     拿到要删除的动态id（params中得到），登录用户的id，查询结果是否为空，判断是否具有权限

   * 更改

     对moment表中id为xxx的content设置新的值

5. 删除动态

   * 验证登录
   * 验证权限
   * 删除remove：从params中拿到要删除的动态id，Delete删除

#### 4. 用户评论：comment ####

```
commentRouter.post('/', verifyAuth, create)
commentRouter.post('/:commentId/reply', verifyAuth, reply)
// 修改评论,你只能修改自己发表的评论，而不能修改别人发表的评论
commentRouter.patch('/:commentId', verifyAuth,verifyPermission, update)
// 删除评论
commentRouter.delete('/:commentId', verifyAuth, verifyPermission, remove)
// 获取评论列表：不需要验证登录、权限
commentRouter.get('/', list)
```

1. 发布评论

   * 验证登录
   * 创建评论
     从请求体里拿到动态id，内容content、用户id。也就是哪个用户对哪条动态做了怎样的评论

2. 回复评论

   * 验证登录
   * 回复：从请求体里拿到动态id，内容content、用户id，再拿到要评论的id（params），去操作moment表

3. 修改评论

   * 验证登录

   * 验证权限：varifyPermission，只能修改自己的评论

     对varifyPermission做了修改，通过遍历ctx.params属性拿到表名，从而动态的修改statement中的表名，使其作为一个参数传入进去，这样每次查询的是否，根据传入参数tablename的不同，查询的不同权限，使其既具备验证动态权限处理又可验证评论权限

   * update

4. 删除评论

   * 验证登录
   * 验证权限
   * remove

5. 查询动态，显示评论

   * 单条：显示评论列表
   * 多条：修改sql语句，增加commentCount字段

#### 5. 标签功能 ####

```
// 创建标签时会先验证登录，
labelRouter.post('/', verifyAuth,create)

// 查询标签列表
labelRouter.get('/', list)
```

##### 添加标签的过程 #####

1. 验证登录  √

2. 验证用户权限  √

3. 验证要添加的标签是否存在 （verifyLabelsExists）

   * 从params中拿到动态id，再拿到所有的标签，进行遍历，getLabelByName判断label表中，是否有标签id

     如果没有标签id，通过create在label表中添加，此时数据库的操作返回结果result.insertId就有了该id

     如果已有标签id，通过getLabelByName查询的结果 labelResult.id中，可以拿到id

   * 补充如何添加标签：创建标签表、验证登录、从请求体拿到标签名，通过create插入label中

4. 再给某条动态添加标签（在关系表中）

   此时已有commentId、标签id，以及标签。在添加标签之前，hasLabel判断该动态是否已存在该标签，对没有某些标签的那个动态，再通过addLabels去添加标签。在关系表中添加

##### 展示标签 #####

* 从query中取出offset和size，去label表中查询结果

#### 6. 图片上传 ####

```
// 用户上传头像
userRouter.get('/:userId/avatar', avatarInfo)
```

```
fileRouter.post('/avatar', verifyAuth, uploadHandle,saveAvatarInfo)
fileRouter.post('/picture', verifyAuth, pictureHandle,pictureResize, savePictureInfo)
```

1. 头像上传
   * 验证登录：VerifyAuth
   * uploadHandle：借助koa-multer，实现上传功能，单张图片用single的方法
   * 图像信息保存：saveAvatarInfo，从ctx.req.file中拿到filename,mimetype,size，再去数据库中插入数据
2. 头像获取
   * 拿到用户id（从params中），再去数据库中查询，拿到查询结果
3. 展示头像
   * ctx.body = result，不能直接去那个接口请求，会下载下来。而是先设置ctx.response.set()设置content-type为头像的mimetype。
   * 再修改ctx.body =为fs读取文件流的结果，读取的地址是http：//localhost:8000/.....等接口下的某路径。但是这个地方不能写死了，所以可以将端口主机等修改为导入的量。
   * 为表users添加字段avatar_url，保存请求地址，此时修改获取头像时，只需要传入avatar_url和用户的id，就可以在users中查找到对应的头像
4. 上传动态的配图（多张）
   * 登录验证
   * savePictureInfo
     * 上传文件，使用multer，并用array的方法
     * 拿到文件信息，用户id，momentId（query中），遍历每个文件，都进行插入数据库的表file中，

