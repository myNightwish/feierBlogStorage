---
title: 项目5：Node用户管理接口：学习记录篇
date: 2021-12-12 00:42:57
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
* 学习记录篇：记录过程的，记忆丢失，嘤嘤嘤


## 项目实战 ##

### 1. 划分目录结构  ###

* 划分方式：

  * 按照功能模块划分；

  * 按照业务模块划分；

* #### 项目配置文件信息： ####

  ```js
  "start": "nodemon ./src/main.js"
  ```

* #### 项目的入口文件：main.js ####

  ```js
  const app = require('./app/index')
  const config = require('./app/config')
  // 启动服务器
  app.listen(config.APP_PORT, () => {
    console.log('服务器启动成功',config.APP_PORT);
  });
  ```

* #### 创建服务器：index.js ####

  ```js
  const Koa = require('koa')
  const bodyParser = require('koa-bodyParser')
  
  const app = new Koa();
  app.use(bodyParser())
  
  // 将app传入到userRouter函数里面是为什么？？？
  	// router文件夹下的index.js的作用：对router文件夹下的每个router.js文件遍历，
  //免去每注册一个路由都要写一次app.use(router1.allowed())和app.use(router1.routes())
  //传入app，是因为使用app.use()
  const useRoutes = require('../router/index')
  useRoutes(app)
  
  const errorHandle = require('./error-handle')
  //监听错误事件
  app.on('error', errorHandle)
  
  module.exports = app
  ```

* #### 加载配置的变量：config.js ####

  ```js
  // 通过dotenv内置模块
  const dotenv = require('dotenv')
  const fs = require('fs')
  const path = require('path')
  dotenv.config();
  
  //读取公钥+私钥 
  const PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname,'./keys/private.key'))
  const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname,'./keys/public.key'))
  
  //导出
  module.exports = {
    APP_PORT,
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_DATABASE,
    MYSQL_PASSWORD,
    LOCAL_HOST
  } = process.env;
  //两种exports顺序不能换
  module.exports.PUBLIC_KEY = PUBLIC_KEY;
  module.exports.PRIVATE_KEY = PRIVATE_KEY;
  ```

* #### 编写.env文件 ####

  ```JS
  APP_PORT = 8000
  LOCAL_HOST = "http://localhost
  
  MYSQL_HOST = "localhost"
  MYSQL_PORT = 3306
  MYSQL_USER = "root"
  MYSQL_DATABASE = "coderhub"
  MYSQL_PASSWORD = "56830908zml"
  ```

* #### 错误类型模块：error-type.js ####

  ```js
  const NAME_OR_PASSWORD_IS_REQUIRED = 'name_or_password_is_required';
  const USER_ALREADY_EXISITS =  'user_alreay_exisits'
  const USER_DOES_NOT_EXISITS = 'user_does_not_exisits'
  const PASSWORD_IS_NOT_CORRECT = 'password_is_not_correct'
  const NOT_AUTHORIZATION = 'not_authorization'
  const NOT_PERMISSION = 'not_permission'
  
  module.exports = {
    NAME_OR_PASSWORD_IS_REQUIRED,
    USER_ALREADY_EXISITS,
    USER_DOES_NOT_EXISITS,
    PASSWORD_IS_NOT_CORRECT,
    NOT_AUTHORIZATION,
    NOT_PERMISSION
  };
  ```

* #### 错误处理模块 ：error-handle.js ####

  ```js
  const errorType = require('../constants/error-types')
  
  const errorHandler = (error, ctx) => {
    switch(error.message){
      case 'name_or_password_is_required': 
        status = 400;
        message = '用户名/密码不能为空'
        break
      case 'user_alreay_exisits':
        status = 409,// 发生冲突conflict
        message = '用户名已经使用'
        break
      case 'user_does_not_exisits':
        status = 400,
        message = '用户名不存在'
        break
      case 'password_is_not_correct':
        status = 400, 
        message = '密码不正确'
        break
      case 'not_authorization': 
        status = 401  
        message = '没有授权，token无效'
        break
      case 'not_permission': 
        status = 401  
        message = '你没有操作权限'
        break
      default: 
        status = 404
        message = 'Not Found1'
    }
    ctx.status = status
    ctx.body = message
  }
  
  module.exports = errorHandler
  ```

* #### 数据库连接：database.js ####

  ```js
  const mysql = require('mysql2')
  const config = require('./config')
  
  const connections = mysql.createPool({
    host: config.MYSQL_HOST,
    port: config.MYSQL_PORT,
    user: config.MYSQL_USER,
    database:config.MYSQL_DATABASE,
    password: config.MYSQL_PASSWORD
  })
  
  connections.getConnection((err, conn) => {
    conn.connect( errr => {
      if(err){
        console.log('连接失败')
      }else{
        console.log('连接成功')
      }
    })
  })
  
  module.exports = connections.promise()
  ```

### 2. 用户注册接口 ###

* 用户注册接口编写流程：

  * 注册用户路由

    ```js
    const router = require('koa-router')
    
    const {verifyUser} = require('../middleWare/user.middleware')
    const {create} = require('../controller/user.controller')
    
    const userRouter = new router({prefix: '/users'})
    userRouter.post('/', verifyUser,create)
    
    module.exports = userRouter;
    ```

  #### 注册用户校验：verifyUser ####

  ```js
  const errorType = require('../constants/error-types')
  const service = require('../service/user.service')
  
  const verifyUser = async (ctx, next) => {
    //1. 获取用户名和密码
    const {name, password} = ctx.request.body;
    // 如果没有传，name应该是undefined
    //2. 判断用户名/密码是否为空
    if (!name || !password || name ===''|| password == '' ){
      const error = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED)
      //此时发送一个错误信息，另一个地方去获取这个错误信息
      //emit传事件类型，事件，参数
      return ctx.app.emit('error',error, ctx)
    }
    //3. 判断用户名是否已经存在
    const result = await service.getUserByName(name)
    if(result.length){
      const error = new Error(errorType.USER_ALREADY_EXISITS)
      return ctx.app.emit('error', error, ctx) 
    	}
    //必须调用next，等后面的中间件执行才返回结果
    await next()
  }
  module.exports = {
    verifyUser
  }
  ```

  * 查询用户名是否被注册过：user.service.js

  ```js
  const connection = require('../app/database')
  class userService{
    // 查询是否存在该用户
  	async getUserByName(name){
      const statement = `SELECT * FROM users WHERE name = ?`
      const result = await connection.execute(statement, [name])
      return result[0];
    	}
    async create(user){
      //解构user
      const {name, password} = user;
      const statement = `INSERT INTO users (name, password) VALUES (?, ?)`;
      //执行sql语句
      const result = await connection.execute(statement, [name, password]);
      //将user存储到数据库中
      return result[0];
    }
  }
  module.exports = new userService();
  ```

  #### 注册用户操作：create.js ####

  ```js
  # 验证注册用户后的处理逻辑抽到user.controller.js里面
  const service= require('../service/user.service')
  
  class userController {
    async create(ctx, next) {
    //这部分要做的事很多，所以对每一部分再抽取：
      //获取用户用于传递的参数
      const user = ctx.request.body   
      //查询数据 ----抽取到user.service.js
      //user是传入的参数
      const result = await service.create(user)  // 见上面的user.service.js
      //返回数据
      ctx.body = result
    }
  }
  module.exports = new userController();
  ```

  #### 密码加密存储 ####

  此时已经手动注册两个用户，可在数据库查看：
  ![image-20210206144301822](C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20210206144301822.png)

但是账户密码是明文的形式保存的，如果数据库泄露了，那么密码会被别人拿到登录。更危险的是，很多人的其他账户密码全是一样的，所以我们拿到ctx.request.body里面的用户名+密码。然后加密。但是开发中并不是这样做。而是在verify之后做密码加密

```
userRouter.post('/', verifyUser,**增加拦截中间件handlePassword***，create)
```


  加密中间件：

```js
  const errorType = require('../constants/error-types')
  const service = require('../service/user.service')
  const md5password = require('../utils/password-handle')
  
  const verifyUser = async (ctx, next) => {}
  
  const handlePassword = async(ctx, next) => {
    let { password } = ctx.request.body
    //通过加密函数，对password
    ctx.request.body.password = md5password(password) 
    await next()
  }
  module.exports = {
    verifyUser,
    handlePassword
  }
```

  加密的方式MD5，借助**框架crypto**，node自带的，有一个函数调用createHash()

```js
  const crypto = require('crypto')
  
  const md5password = (password) => {
    // 拿到的是一个对象
    const md5 = crypto.createHash('md5')
    // 返回还是一个对象,并转成16进制的结果,最终拿到字符串形式
    const result = md5.update(password).digest('hex')
    return result
  }
  module.exports = md5password
```

  ![image-20210206151111074](C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20210206151111074.png)

  数据库那边也已经显示的是加密后的密码

### 3. 登录接口 ###

* 登录路径是/login

  ```js
  # 新建路由配置auth.router.js
  const authRouter = new Router()
  const {login} = require('../controller/auth.controller')
  
  authRouter.post('/login', login)
  ```

  ```js
  # 配置路由
  app.use(authRouter.routes())
  app.use(authRouter.allowedMethods())
  ```

  * #### 登录处理：login ####

  ```js
  class AuthController{
    async login(ctx, next){
      //拿到用户名
      const {name} = ctx.request.body
      ctx.body = `欢迎${name}回来`
    }
  }
  
  module.exports = new AuthController();
  ```

* 此时，用户随便输入密码账户都可以登录，并没有验证，在/login的post请求中插入中间件

  ```js
  authRouter.post('/login',***中间件verifyLogin***, login)
  ```

  #### 密码验证： ####

  ```js
  const errorType = require('../constants/error-types')
  const service = require('../service/user.service')
  const md5password = require('../utils/password-handle')
  
  const verifyLogin = async(ctx, next) =>{
  //1.获取用户名+密码
    const {name, password} = ctx.request.body
  
    //用户名/密码是否为空
  //2. 判断用户名/密码是否为空
    if (!name || !password){
      const error = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED)
      //此时发送一个错误信息，另一个地方去获取这个错误信息
      //emit传事件类型，事件，参数
      return ctx.app.emit('error',error, ctx)
    }
  //3.用户名/密码是否存在
    const result = await service.getUserByName(name)
    const user = result[0]
    if(!user){
      const error = new Error(errorType.USER_DOES_NOT_EXISITS)
      return ctx.app.emit('error', error, ctx)
    }
    
  //4.用户名/密码是否一致(加密)
    //user.password是之前数据库中存储的密码，而且是已经加密了的
    if(md5password(password) !== user.password){
      const error = new Error(errorType.PASSWORD_IS_NOT_CORRECT)
      return ctx.app.emit('error', error, ctx)
    }
  //5.完成所有验证步骤后，再执行router后面的中间件
    await next()
  }
  
  module.exports = verifyLogin
  ```

* #### 优化路由注册，动态加载路由： ####

之前每监理一个路由都要进行一次注册，当路由越来越多，index.js里面的内容越来越多。对这部分代码简化

  ```js
  # index.js删除
  app.use(userRouter.routes())
  app.use(userRouter.allowedMethods())
  app.use(authRouter.routes())
  app.use(authRouter.allowedMethods())
  # 改为
  const useRoutes = require('../router/index')
  useRoutes(app)
  ```

在router文件夹下，新增index.js

  ```js
  const fs = require('fs')
  const useRoutes = (app) => {
    //读取当前文件所在的目录，返回的结果是数组
    fs.readdirSync(__dirname).forEach(file => {
      //对当前目录下的所有文件遍历，除了index.js
      if(file === 'index.js'){
        return 
      }
      //否则对每个router.js文件进行导入
      const router = require('${file}')
      app.use(router.routes())
      app.use(router.allowedMethods())
    }) 
  }
  module.exports = useRoutes
  ```

### 4. 登录凭证： ###

* 验证方式1：cookie+session；（正在被淘汰）

  验证方式2：Token令牌；登录成功返回凭证：（未来更流行）

* 有关cookie、session、token的知识在14章节笔记：token采用了生成token时和验证token时使用同一密钥的方式

#### 非对称加密 ####

* 如果secretKey暴露是一件非常危险的事情，因为之后就可以模拟颁发token， 也可以解密token；所以HS256加密算法一单密钥暴露就是非常危险的事情。

  * 比如在分布式系统中，每一个子系统都需要获取到密钥；那么拿到这个密钥后这个子系统既可以发布另外，也可以验证令牌；
  * 但是对于一些资源服务器来说，它们只需要有验证令牌的能力就可以了；这个时候我们可以使用非对称加密，RS256：
    <img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20210206220511367.png" alt="image-20210206220511367" style="zoom:67%;" />
    * 私钥（private key）：用于发布令牌
    * 公钥（public key）：用于验证令牌，是通过私钥得到的

  * 可以使用openssl来生成一对私钥和公钥：Mac直接使用terminal终端即可；Windows默认的cmd终端是不能直接使用的，建议直接使用git bash终端；

  ```js
  const Koa = require('koa')
  const Router = require('koa-router')
  const fs = require('fs')
  const jwt = require('jsonwebtoken')
  
  const app = new Koa()
  const router = new Router()
  
  // 拿到公钥+私钥,拿到的是buffer，但是后面是可以传入buffer的
  const PRIVATE_KEY = fs.readFileSync('./keys/private.key')
  const PUBLIC_KEY = fs.readFileSync('./keys/public.key')
  
  router.post('/test', (ctx, next) => {
    //基于token实现：jwt，手里用私钥加密
    const user = {id: 110, name:'lily'}
    const token = jwt.sign(user, PRIVATE_KEY, {
      expiresIn: 10*100,
      //加密算法
      algorithm: "RS256"
    })
    ctx.body = token
  })
  router.get('/demo', (ctx, next) => {
    //取出token
    const authorization = ctx.headers.authorization
    const token = authorization.replace("Bearer ","" )
    try {
   		 //验证token，手里有公钥解密
    	const result = jwt.verify(token, PUBLIC_KEY, {
      //这里传入的是数组，而且复数，说明可以传很多
      algorithms: ["RS256"]
    	})
      ctx.body = result
    } catch(error) {
      ctx.body = 'token是无效的'
    }
  })
  app.use(router.routes())
  app.use(router.allowedMethods())
  
  app.listen(8080, () => {
    console.log('koa启动成功了')
  })
  ```

  * 补充：fs.readFileSync有时候可以传相对路径，绝对路径。但是有时又不可以。在项目中的任何地方，相对路径是相对于process的cwd，在哪个文件夹启动的项目就是process.cwd

* #### 颁发令牌+验证令牌（回到项目） ####

  ```js
  //读取公钥+私钥 
  const PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname,'./keys/private.key'))
  const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname,'./keys/public.key'))
  
  //两种exports顺序不能换
  module.exports.PUBLIC_KEY = PUBLIC_KEY;
  module.exports.PRIVATE_KEY = PRIVATE_KEY;
  ```

  ```js
  # auth.controller.js 
  const jwt = require('jsonwebtoken')
  const {PUBLIC_KEY} = require('../app/config')
  const {PRIVATE_KEY} = require('../app/config')
  
  class AuthController{
    async login(ctx, next){
      //拿到用户名
      const {id, name} = ctx.user 
      //颁发令牌
      const token = jwt.sign({id, name}, PRIVATE_KEY, {
        expiresIn: 10*100*60,
        algorithm: 'RS256'
      })
      ctx.body = {
        id, token, name
      }
    } 
  } 
  module.exports = new AuthController();
  ```

* #### 验证用户是否授权，颁发的签名是否有效 ####

  比如当一个用户登录之后，发表动态，发表文章之前我们要验证该用户是否授权

  ```js
  # 验证的路径是/test,get请求
  authRouter.get('/test', verifyAuth, success)//success只是显示验证成功的功能
  ```

  ```js
  # auth.middleware.js  验证函数
  const verifyAuth = async (ctx, next) => {
    console.log('验证授权的middleware')
    // 注意这里发送请求时在postmen里记得把token复制，携带过去
    const authorization = ctx.headers.authorization
    //如果我们在postman中携带错误的token传过来，
    //此时ctx.headers里面压根就没有authorization
    //所以要先验证一遍
    if(!authorization){
      const error = new Error(errorType.NOT_AUTHORIZATION)
      //这里必须是return,否则会卡在这里
       return ctx.app.emit('error', error, ctx)
    }
    const token = authorization.replace('Bearer ', '')
    try{
      // 验证token
      const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256']
      })
      ctx.body = result
      await next()
    } catch(err){
      const error = new Error(errorType.NOT_AUTHORIZATION)
      ctx.app.emit('error', error, ctx)
    }
  }
  ```


### 5.1 发布/查询动态内容 ###

#### 1. 发布动态内容 ####

* 新建moment.router.js

  ```js
  const Router = require('koa-router')
  
  const {verifyAuth} = require('../middleWare/auth.middleware')
  const {create} = require('../controller/moment.controller.js')
  
  const momentRouter = new Router({prefix: '/moment'})
  //发表评论之前要先验证登录，然后才是create创建评论
  momentRouter.post('/', verifyAuth, create)
  module.exports = momentRouter 
  ```

* 创建新的表 moment

  ```js
  CREATE TABLE IF NOT EXISTS `moment` (
    // 评论的id，表示哪条评论
    id INT PRIMARY KEY AUTO_INCREMENT,
    content VARCHAR(1000) NOT NULL,
    // 该评论对应的用户id
    user_id INT NOT NULL,
    createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    // 引用外键约束，user_id是发表评论对应的用户的id，
    // users(id)是用户表中的用户的id，表示哪个用户，二者应该是联动的
    // 代表了哪条评论对应了哪个用户
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
  ```

* 定义发布动态内容的接口

  * 验证用户登录:  verifyAuth直接导入使用

  * Controller和Service中处理内容

    ```js
    # moment.controller.js
    const momentService = require('../service/moment.service')
    
    class momentController{
      async create(ctx, next){
      // 发表动态的逻辑:
        //1.拿到user_id, 动态内容，上一个中间件的ctx.user里面存着
        const user_id = ctx.user.id   // 拿到用户id，是哪个用户
        const content = ctx.request.body.content  // 是什么动态内容
    
        //2. 将数据插入到数据库中
        const result = await momentService.create(user_id, content)
        ctx.body =  result
      }
    }
    module.exports = new momentController();
    ```

  * moment.service.js

    ```
    const connection = require('../app/database')
    class momentService{
      async create(user_id, content){
        const statement = `INSERT INTO moment (content, user_id) VALUES (?, ?)`
        const result = connection.execute(statement, [content, user_id])
        return result
      }
    }
    module.exports = new momentService();
    ```

    ![image-20210207173925587](C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20210207173925587.png)

#### 2.查询动态内容 ####

* 定义查询单个内容的接口

  * 根据momentId查询接口内容；

    ```js
    # 路由
    // 查看评论,不需要登录,需要知道评论对应的id
    momentRouter.get('/:momentId', momentDetail)
    ```

    ```js
    # moment.controller.js
      async momentDetail(ctx, next){
        // 从数据库中获取评论信息，需要id,
        //1. id是请求接口params里面携带的momentId
        const momentId = ctx.params.momentId
        //2.拿到id去数据库查询评论信息,让service做
        const result = await momentService.getMomentById(momentId)
        ctx.body = result
      }
    ```

    ```js
    # 去数据库查询内容
      async getMomentById(id){
        const statement = `SELECT 
          m.id id, m.content content, 
          m.createAt createTime, m.updateAt updateTime, 
          JSON_OBJECT('id', u.id, 'name', u.name) author
          FROM moment m
          LEFT JOIN users u ON m.user_id = u.id 
          WHERE m.id =?`
        const result = await connection.execute(statement, [id])
        return result[0]
      }
    ```

* 定义查询多条内容的接口

  * 查询所有moment接口内容（根据offset和size决定查询数量）

    ```js
    # 路由
    // 查看多条动态
    momentRouter.get('/', list)
    ```

    在实际中，数据很多的，不能一次性把所有数据查完而是分页查询，所以你请求路径后面还要跟上偏移offset+size，从哪儿查，一次查多少

    ```js
    # moment.controller.js
      async list(ctx, next){
        // 获取查询参数
        const {offset, size} = ctx.request.query
        //获取数据
        const result = await momentService.getMomentList(offset, size)
        ctx.body = result
      }
    ```

    ```js
    # 查询多条内容
     async getMomentList(offset, size){
        const statement = `SELECT 
          m.id id, m.content content, 
          m.createAt createTime, m.updateAt updateTime, 
          JSON_OBJECT('id', u.id, 'name', u.name) author
          FROM moment m
          LEFT JOIN users u ON m.user_id = u.id 
          LIMIT ?, ?`
        const [result] = await connection.execute(statement, [offset, size])
        return result
      }
    ```

  * 代码优化：sql语句有很多相似的地方，可以抽出来 ，简化代码

    ```js
    const sqlFragment = `SELECT 
      m.id id, m.content content, 
      m.createAt createTime, m.updateAt updateTime, 
      JSON_OBJECT('id', u.id, 'name', u.name) author
      FROM moment m
      LEFT JOIN users u ON m.user_id = u.id `
    ```

    ```js
    const statement = `
      ${sqlFragment}
    	WHERE m.id =?`
    ```

###  5.2 修改/删除动态内容 ###

#### 1.  定义修改动态内容的接口 ####

​	用户必须已经登录验证; 只能修改自己发表的内容，而不能修改别人的内容，是否有权限

* 定义路由接口

  ```js
  // 修改动态 
  momentRouter.patch('/:momentId',verifyAuth, verifyPermission, update)
  ```

* 验证用户登录：省略

* 验证用户的权限

  ```js
  # moment.middleware.js的中间件
  const verifyPermission = async(ctx, next) => {
    // 验证已经登陆的用户与要修改的评论是否有权限
    console.log('验证是否有修改权限')
  // 1.获取参数
    // momentId 是要修改的动态id
    const {momentId} = ctx.request.params
    // 拿到当前登录用户的id，也就是谁登陆的
    //在update前面的中间件auth.verify中将ctx.user = result
    //当前登录信息结果保存在user里面
    const {id} = ctx.user
  // 2. 查询是否具备权限并处理
    try {
      const isPermission = await authService.checkMoment(momentId, id)
      if(!isPermission){
        throw new Error()//这个错误会在catch捕获
      }
      await next()
    } catch(err) {
      const error = new Error(errorType.NOT_PERMISSION)
      return ctx.app.emit('error', error, ctx)
    }
  }
  ```

* #### 单独封装权限查询的函数，这是为了后续各种需要权限的操作时，不用再重复写

  验证权限的中间件很重要：

  1. 很多功能都需要权限验证
  2. 业务接口，一般只需要验证当前登录的这个人与修改评论即可。但在后台管理系统中，权限验证是非常重要的，它是有一对一的关系：后台管理系统中用户有角色，还有权限表，是多对多的关系。角色是否具备某个权限，到时候可以去查询就可以了。
  3. 开发业务接口和后台管理系统一般是两个系统，而且可能部署到不同的服务器，一般不会放在一起开发。

  ```js
  # auth.service.js
  const connection = require('../app/database')
  class authService{
    async checkMoment(momentId, userId){
      const statement = `SELECT * FROM moment WHERE id =? AND user_id = ?`
      const result = await connection.execute(statement, [momentId, userId])
      return result.length === 0? false:true
    }
  }
  module.exports = new authService()
  ```

* Controller和Service中的处理

  ```js
  # moment.controller.js
   async update(ctx, next){
      // momentId 是要修改的动态id
      const {momentId} = ctx.request.params
      const {content} = ctx.request.body
      // 修改动态
      const result = await momentService.update(content, momentId)
      ctx.body = result
    }
  ```

  ```js
  # moment.service.js
    async update(content, id){
      const statement = `UPDATE moment SET content =? WHERE id = ?`
      const result = await connection.execute(statement, [content, id])
      return result
    }
  ```

#### 2. 定义删除内容的接口 ####

* 定义路由接口

  ```js
  // 删除动态
  momentRouter.delete('/:momentId',verifyAuth, verifyPermission, remove)
  ```

* 验证用户登录：省略

* 验证用户权限： 省略

* Controller和Service的处理

  ```js
  # moment.controller.js
    async remove(ctx, next){
    // 拿到要输出动态的id
    const id = ctx.params.momentId
    // 删除内容
    const result = await momentService.remove(id)
    ctx.body = result
    }
  ```

```js
  # moment.service.js
    async remove(id){
      const statement = `DELETE FROM moment WHERE id = ?`
      const result = await connection.execute(statement, [id])
      return result
    }
```

### 6.1 发表/修改评论内容 ###

* 创建新的表 comment

  需要记录是对当前动态做的评论，还是对评论做了评论，但他们都属于当前这条动态下的。

  ```js
  CREATE TABLE IF NOT EXISTS `comment`(
    # 评论唯一的主键
    id INT PRIMARY KEY AUTO_INCREMENT,
    # 评论的内容
    content VARCHAR(1000) NOT NULL,
    # 对哪个动态做的评论
    moment_id INT NOT NULL,
    # 哪个用户做的评论
    user_id INT NOT NULL,
    # 这个评论是对哪个评论做的评论
    comment_id INT DEFAULT NULL,
    createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
    FOREIGN KEY (moment_id) REFERENCES moment(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comment(id) ON DELETE CASCADE ON UPDATE CASCADE
  );
  ```


#### 1. 定义发布评论内容的接口 ####

* 定义路由接口

  ```js
  const Router = require('koa-router')
  const {create} = require('../controller/comment.controller')
  const {verifyAuth} = require('../middleWare/auth.middleware')
  
  const commentRouter = new Router({prefix: "/comment"})
  commentRouter.post('/', verifyAuth, create)
  module.exports = commentRouter
  ```

* 验证用户登录： verifyAuth省略

* Controller和Service中处理内容

  ```js
  # comment.service.js
  const service = require('../service/comment.service')
  
  class momentController{
    // 创建评论
    async create(ctx, next){
      // 在请求体里对哪个动态(动态id)拿到评论的内容(content)
      const {momentId, content} = ctx.request.body
      // 谁发布的评论，在上一个中间件认证中已经知道
      const {id} = ctx.user
      const result = await service.create(momentId, content, id)
      ctx.body = result
    }
  }
  module.exports = new momentController()
  ```

  ```js
  # comment.controller.js
  const connection = require('../app/database')
  
  class momentService{
    async create(momentId, content, user_id){
      const statement = `INSERT INTO comment (content, moment_id, user_id) 
      										VALUES (?, ?, ?)`
      const [result] = await connection.execute(statement, 
      										[content, momentId, user_id])
      return result
    }
  }
  module.exports = new momentService()
  ```

  * 在这里犯了错：写sql语句的时候一定要记得对照数据库里面的称呼名字，传参时对应就可以，但写语句时必须严格一样

#### 2. 定义回复评论内容的接口 ####

* 定义路由接口

  ```js
  commentRouter.post('/:commentId/reply', verifyAuth, reply)
  ```

* 验证用户登录： verifyAuth

* Controller和Service中的处理

  ```js
  # comment.controller.js
    async reply(ctx, next){
      // 拿到传的参数commentId
      const {momentId, content} = ctx.request.body
      const {commentId} = ctx.params
      const {id} = ctx.user
      const result = await service.reply(commentId, momentId, content, id)
      ctx.body = result
    }
  ```

  ```js
  # comment.service.js
    async reply(commentId, momentId, content, id){
      const statement = `INSERT INTO comment (content, moment_id, user_id, comment_id) 								VALUES (?, ?, ?, ?)`
      const [result] = await connection.execute(statement, 
      											[content, momentId, id, 		commentId])
      return result
    }
  ```

#### 3. 定义修改评论内容的接口 ####

* 定义路由接口

  ```js
  // 修改评论,你只能修改自己发表的评论，而不能修改别人发表的评论
  commentRouter.patch('/:commentId', verifyAuth, verifyPermission, update)
  ```

* 验证用户登录: verifyAuth

* 验证用户的权限

  * 之前的权限是验证是否具备发表动态的权限，而这里是验证是否有修改评论的权限，是不可以继续用以前的那个权限的
  * 一种思路是按之前验证动态权限一样，再去写一个函数verifyPermission来验证，但是随着越来越多的业务都需要验证时，此时代码量会越来越多。
  * 另一种解决办法是：写一个函数既具备验证动态，也具备验证评论。但是如果你只是调用checkmoment，里面的const statement = `SELECT * FROM moment WHERE id =? AND user_id = ?`是写死的，你只能验证动态。所以让这个验证权限的函数具备多种验证功能的方法是：动态的改变statement，让他查询的东西随权限的不同而变化。

  ```js
  # 对auth.middleware.js重新修改  verifyPermission函数
  # 更改了checkmoment为checkResource，并对参数做了改变
  const verifyPermission = async(ctx, next) => {
    // 验证已经登陆的用户与要修改的动态是否有权限
    console.log('验证是否有修改权限')
  // 1.获取参数
    // momentId 是要修改的动态id
    // const {momentId} = ctx.request.params
    // 拿到当前登录用户的id，也就是谁登陆的
    //在update前面的中间件auth.verify中将ctx.user = result
    //当前登录信息结果保存在user里面
      // 获取tablename:
      //思路1：
      //思路2：如果路径是restful风格，可以从里面取出tableNmae
      const [resourceKey] = Object.keys(ctx.params)
      const tableName = resourceKey.replace('Id', '')
      //resourceId是想修改的那个评论在table中所处的id号
      const resourceId = ctx.params[resourceKey]
  
      const {id} = ctx.user
  // 2. 查询是否具备权限并处理
    try {
      const isPermission = await authService.checkResource(tableName,resourceId, id)
      if(!isPermission){
        throw new Error()//这个错误会在catch捕获
      }
      //必须加await，否则会出问题，为什么
      await next()
    } catch(err) {
      const error = new Error(errorType.NOT_PERMISSION)
      return ctx.app.emit('error', error, ctx)
    }
  ```

```js
  # auth.service.js修改后
  const connection = require('../app/database')
  
  class authService{
    async checkResource(tableNmae, id, userId){
      const statement = `SELECT * FROM ${tableNmae} WHERE id =? AND user_id = ?`
      const result = await connection.execute(statement, [id, userId])
      return result.length === 0? false:true
    }
  }
  
  module.exports = new authService()
```

* Controller和Service中的处理

  ```js
  # comment.controller.js
  	async update(ctx, next){
    const {content} = ctx.request.body
      const {commentId} = ctx.params
      // 修改评论
      const result = await service.update(content, commentId)
      ctx.body = content+commentId+result
    }
  ```

  ```js
  # comment.service.js
    async update(content, commentId){
      const statement = `UPDATE comment SET content=? WHERE comment_id = ?`
      const [result] = await connection.execute(statement, [content, commentId])
      return result
    }
  ```

### 6.2  删除/查询评论内容 ###

#### 1. 定义删除评论内容的接口 ####

* 定义路由接口

  ```js
  // 删除评论
  commentRouter.delete('/:commentId', verifyAuth, verifyPermission, remove)
  ```

* 验证用户登录：verifyAuth

* 验证用户权限：verifyPermission

* Controller和Service的处理

  ```js
  # comment.controller.js
    async remove(ctx, next){
      // 删除评论需要这个评论的id即可
      const {commentId} = ctx.params
      const result = await service.delete(commentId)
      ctx.body = result
    }
  ```

  ```js
  # comment.service.js
    async delete(commentId){
      const statement = `DELETE FROM comment WHERE id=? `
      const result = await connection.execute(statement, [commentId])
      return result
    }
  ```

#### 2. 查询动态 ####

* 需求：

  * 查询一个动态详情时，既要看动态信息，还要看用户信息，评论的列表。需要回头修改moment.user.需要修改sql语句

  * 查询动态列表时，有一个commentCount，也就是对应着你这条动态下有多少条评论计数。

* 查询多个动态时，**显示评论的个数**

  在原有的查看动态getMomentList下的基础上，对sql语句进行了修改，添加查询字段，并增添了评论数量

  在此基础上添加查询字段，子查询字段。

  ```js
  SELECT 
    m.id id, m.content content, 
    m.createAt createTime, m.updateAt updateTime, 
    JSON_OBJECT('id', u.id, 'name', u.name) author,
  	(SELECT COUNT(*) FROM comment c WHERE c.moment_id = m.id) commentCount
    FROM moment m
    LEFT JOIN users u ON m.user_id = u.id
  	LIMIT ?, ?;
  ```

  * 进行请求：
    ![image-20210208223358740](C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20210208223358740.png)

    ```js
    [
        {
            "id": 3,
            "content": "评论动态的内容",
            "createTime": "2021-02-07T09:33:56.000Z",
            "updateTime": "2021-02-07T09:33:56.000Z",
            "author": {
                "id": 3,
                "name": "lucy"
            },
            "commentCount": 4
        },
        {
            "id": 4,
            "content": "评论动态的内容",
            "createTime": "2021-02-07T09:34:48.000Z",
            "updateTime": "2021-02-07T09:34:48.000Z",
            "author": {
                "id": 3,
                "name": "lucy"
            },
            "commentCount": 0
        }
    ]
    ```

    数据库中显示查询结果：
    ![image-20210208223616477](C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20210208223616477.png)

* 查询单个动态时，显示评论的列表

  当用户点击动态后，会进入动态详情页。如何获取评论的列表，之前是评论数量

  * 思路1：动态的接口与评论接口分开，分别用不同的接口获得不同的需求

  ```js
  # comment.router.js
  // 获取评论列表：不需要验证登录、权限
  commentRouter.get('/', list)
  ```

  ```js
  # comment.controller.js
    async list(ctx, next){
      // 拿到要获取comment的动态id：momentId
      const {momentId} = ctx.query
      const result = await service.getCommentsBymomentId(momentId)
      ctx.body = result
    }
  ```

  ```js
  # comment.service.js
    async getCommentsBymomentId(momentId){
      const statement = `SELECT * FROM comment  WHERE moment_id = ?`
      const result = await connection.exexute(statement, [momentId])
      return result
    }
  ```

  ![image-20210208231911140](C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20210208231911140.png)

  * 思路2：直接在请求动态的接口时候，就会携带评论相关的信息，嵌入动态信息里面。缺点：sql语句复杂，容易写错；如果信息很多，一次性请求过多的信息，网速慢，用户体验不好，可以把用户的动态先请求过来。省略
  * 点赞功能：用户之间的多对多的关系，一个动态可以被多个用户点赞，一个用户也可以点赞多个用户。动态表中有很多动态，用户表也有很多用户，在这两个之间建立关系表，把动态相关的id+user_id结合在一起网这个表插入进去。

### 7. 标签接口开发（多对多） ###

标签是给动态加标签，每个动态都有对应着。所以需要标签表记录标签id，标签名等。一个动态可以有多个标签，一个标签可以属于多个动态。多对多的关系，所以当给一条动态添加一个标签以后，先判断是否存在这个标签，没有要先创建，有了再添加。

* 创建标签的表

  ```js
  CREATE TABLE IF NOT EXISTS `label`(
  	 # id是主键
  	id INT PRIMARY KEY AUTO_INCREMENT,
  	# 标签名 是不能重复的，没意义
  	name VARCHAR(10) NOT NULL UNIQUE,
  	createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
  					 ON UPDATE CURRENT_TIMESTAMP
  );
  ```

#### 1. 创建标签接口 ####

* 路由配置Router

  ```js
  const Router = require('koa-router')
  
  const { verifyAuth } = require('../middleWare/auth.middleware')
  const {create} = require('../controller/label.controller')
  
  const labelRouter = new Router({prefix: '/label'})
  
  // 创建标签时会先验证登录，
  labelRouter.post('/', verifyAuth,create)
  
  module.exports = labelRouter
  ```

* 验证用户登录：verifyAuth

* Controller和Service的处理：创建标签

  ```js
  # label.controller
  const service = require('../service/label.service')
  
  class laberController{
    async create(ctx, next){
      // 拿到要添加的标签
      const {name} = ctx.request.body
      const result = await service.create(name)
      ctx.body = result
    }
  }
  module.exports = new laberController()
  ```

  ```js
  # label.service
  const connection = require("../app/database")
  
  class labelService{
    async create(name){
      const statement = `INSERT INTO label (name) VALUES (?);`
      const result = await connection.execute(statement, [name])
      return result
    }
  }
  
  module.exports = new labelService()
  ```

* 创建标签和动态关系表

  ```js
  CREATE TABLE IF NOT EXISTS `moment_label`(
  	moment_id INT NOT NULL,
  	label_id INT NOT NULL,
  	createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  	// 让二者成为联合主键，与复合主键是一个概念
  	PRIMARY KEY (moment_id, label_id),
  	// 这里的联动效果是：这条动态删掉了，关系表里的记录会删掉，但是标签name并不会被删掉,
  	FOREIGN KEY (moment_id) REFERENCES moment(id) ON DELETE CASCADE ON UPDATE CASCADE,
  	FOREIGN KEY (label_id) REFERENCES label(id) ON DELETE CASCADE ON UPDATE CASCADE
  	);
  ```

#### 2. 给动态添加标签 ####

* 给**动态**添加新的接口： /moment/1/labels

  ```js
  # moment.router.js
  const {verifyLabelExist} = require('../middleWare/label.middleware')
  // 给动态添加标签
  momentRouter.post('/:momentId/labels', verifyAuth, verifyPermission,
                      verifyLabelExist,addLabels)
  ```

* 验证用户登录：verifyAuth

* 验证用户权限：verifyPermission

* 验证标签是否存在：Controller和Service的处理

  如果标签不存在，添加到label表中，也就是为label创建新标签。而下面的创建标签是在关系表中添加标签

  * 这里是不可以直接将标签与动态联系在一起的，标签的名字有可能在标签的表里是不存在的，此时是没有对应的id，此时联系表label_id就不存在
  * 所以当用户调用接口时，判断是否存在这个标签，如果不存在先创建这个标签，再往关系表里面插入数据。
  * 所以路由中间还应该有一个中间件labelmiddleware,里面有函数varifyLabelExists，验证标签是否存在

  ```js
  # label.middleware.js
  // 验证要添加的标签是否已经存在与标签表
  const service = require('../service/label.service')
  const verifyLabelExist = async (ctx, next) => {
    //取出要添加的所有标签
    const {labels} = ctx.request.body
    const newLabels = []
    // 判断每个标签是否存在于标签表，遍历
    for(let name of labels){
      // 如果该标签不存在，返回结果是result[0]，为undefined
      // 如果存在：结果是:BinaryRow {
      //   id: 2,
      //   name: '游戏',
      //   createAt: 2021-02-09T10:00:56.000Z,
      //   updateAt: 2021-02-09T10:00:56.000Z
      // }
      const labelResult = await service.getLabelByName(name) //  label.service.js
      const label = {name}
      // 如果不存在,就添加标签
      if(!labelResult){
        const result = await service.create(name)   //  label.service.js
        label.id = result.insertId
      }else{
        label.id = labelResult.id
      }
      newLabels.push(label)
    }
    // 循环结束，完成所有不存在标签的添加到label表
    ctx.body = newLabels
    await next()
  }
  module.exports = {
    verifyLabelExist
  }
  ```

  ```js
  # label.service.js
  const connection = require("../app/database")
  
  class labelService{
    async create(name){
      const statement = `INSERT INTO label (name) VALUES (?);`
      const [result] = await connection.execute(statement, [name])
      return result
    }
    // 判断标签是否存在的情况
    async getLabelByName(name){
      const statement = `SELECT * FROM label WHERE name = ?`
      const [result] = await connection.execute(statement, [name])
      return result[0]
    }
  }
  module.exports = new labelService()
  ```

* 在关系表中添加标签：Controller和Service的处理

  ```js
  # moment.controller.js 
      async addLabels(ctx, next){
      //1. 给哪条动态上加什么标签
      const {labels} = ctx
      const {momentId} = ctx.params
      //2. 判断：如果添加标签是否已存在关系表
        // 2.1 在关系表中是否关于这个moment的标签已经有了
        // 标签表、关系表中标签都应该是唯一的
        for(let label of labels){
          const isExist = await momentService.hasLabel(momentId, label.id)
          if(!isExist){
           await momentService.addLabels(label.id, momentId)
          } 
        }
      ctx.body = '在关系表中添加标签'
    }
  ```

  ```js
  # moment.service.js 
    async hasLabel(momentId, labelId){
      const statement = `SELECT * FROM moment_label WHERE moment_id=? AND label_id=?`
      const [result] = await connection.execute(statement, [momentId, labelId])
      return result[0]? true: false
    }
    async addLabels(label_id, momentId){
      const statement = `INSERT INTO moment_label (moment_id, label_id) VALUES (?, ?)`
      const result = await connection.execute(statement, [momentId, label_id])
      return result[0]
    }
  ```

#### 3. 展示标签 ####

* 展示标签的接口

  ```js
  // 查询标签列表
  labelRouter.get('/', list)
  ```

* **查询动态列表**，展示**标签数量**

  ```js
   # label.controller.js
   async list(ctx, next){
      const {offset, limit} = ctx.query
      const result = await service.getLabels(offset, limit)
      ctx.body = result
    }
  ```

  ```js
  # label.service.js
  async getLabels(offset, limit){
      const statement = `SELECT * FROM label LIMIT ?, ?`
      const [result] = await connection.execute(statement, [offset, limit])
      return result  
  }
  ```

* 修改标签接口：一般标签创建后一般不会做修改和删除操作

* 查询**动态详情**，展示**标签列表**

  ```
  sql语句太复杂了，暂时先不写这块
  ```

  ![image-20210209225206649](C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20210209225206649.png)

### 8. 上传图片 ###

#### 分析实现思路： ####

* 图片（文件）上传 /upload/avatar
  * 图片上传就是文件上传的一种，服务器端可以保存一张图片

* 提供一个接口，可以让用户获取图片

  * 如果有一天浏览器请求这个图片时，要在img标签里展示出来图片。必须提供一个接口提供给用户获取这个接口，而不是让用户下载这个图片文件。
  * 找到图片，读取图片，设置content-type，告诉浏览器类型，而不是将二进制流直接给他。这样浏览器才知道是一图片的形式展示出去

  * avatar -> 找到图片\读取图片\content-type: image/jpeg\返回图像的信息

* 将URL存储到用户信息中

  * 将url存储到用户信息中，用户信息中有一个字段： avatar字段，直接给用户头像的地址

  * avatarURL: 头像的地址

* 获取信息时，获取用户的头像

#### 1. 上传头像 ####

* 定义所有关于上传头像的接口

```js
  # file.router.js   希望在这个路由里定义所有关于图片上传的路由
  const Router = require('koa-router')
  
  const {verifyAuth} = require('../middleWare/auth.middleware')
  const {uploadHandle} = require('../middleWare/file.middleware')
  
  const fileRouter = new Router({prefix: "/upload"})
  // 上传图片：中间件定义图片保存在哪里，保存在服务器里；
  // 关于图片的信息：类型，大小，controller.js里
  // 上传头像必须要登录的，verifyAuth, 验证登录
  fileRouter.post('/avatar', verifyAuth, uploadHandle,saveAvatarInfo)
  
  module.exports = fileRouter
```

  <img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20210210153519583.png" alt="image-20210210153519583" style="zoom:50%;" />

  ```js
  # file.middleware.js   借助插件koa-multer来实现文件上传
  
  const Multer = require('koa-multer')
  // 在本地的process.cwd路径下创建路径./uploads/avatar下的文件夹
  const uploadAvatar = Multer({
    dest: './uploads/avatar'
  })
  // 找到在postman那边上传的avatar字段,single只找一个文件
  // 然后放入后面的路由后面，登陆之后会对上传文件进行处理
  const uploadHandle = uploadAvatar.single('avatar')
  
  module.exports = {
    uploadHandle
  }
  ```

  此时文件夹已经有上传过来的图片了

  <img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20210210153559449.png" alt="image-20210210153559449" style="zoom:50%;" />

* 对上传图片信息保存

  * 新建表avatar

    ```js
    CREATE TABLE IF NOT EXISTS `avatar`(
    	id INT PRIMARY KEY AUTO_INCREMENT,
    	filename VARCHAR(255) NOT NULL UNIQUE,
    	mimetype VARCHAR(30),
    	size INT,
    	user_id INT,
    	createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
    	);
    ```

  * 图像信息保存：saveAvatarInfo中间件

    ```js
    const service = require('../service/file.service')
    class fileController{
      // 上传图片时不仅要传图片，还要对图片信息相关进行保存
      async saveAvatarInfo(ctx, next){
        // 拿到图片信息
        const {filename, mimetype, size} = ctx.req.file
        const {id} = ctx.user
        // 将图片保存到数据库中，所以需要单独创建表
        const result = await service.createAvatar(filename, mimetype, size, id)
        ctx.body = result
      }
    }
    
    module.exports = new fileController()
    ```

    ctx.req.file里面保存的信息：
    <img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20210210154139788.png" alt="image-20210210154139788" style="zoom:50%;" />

  * service的操作

    ```js
    const connection = require("../app/database")
    
    class fileService{
      async createAvatar(filename, mimetype, size, user_id){
        const statement = `INSERT INTO avatar (filename, mimetype, size, user_id) VALUES (?, ?, ?, ?)`
        const [result] = await connection.execute(statement, [filename, mimetype, size, user_id])
        return result
      }
    }
    module.exports = new fileService()
    ```

    ![image-20210210162609117](C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20210210162609117.png)

#### 2. 获取头像 ####

* 定义获取图像的接口

输入浏览器的头像，希望直接展示出来。此时必须单独写个接口，给用户返回头像

  获取用户信息的时候，可以直接看到用户的头像。

  ```
  # user.router.js
  userRouter.get('/:userId/avatar', avatarInfo)
  ```

* 请求用户信息时，获取头像

```js
  # user.controller.js
    async avatarInfo(ctx, next){
      // 用户获取的文件id
      const {userId} = ctx.params
      const result = await fileService.getAvatarByUserId(userId) # file.service.js
      ctx.body = result
    } 
```

  ```js
  # file.service.js
    async getAvatarByUserId(userId){
      const statement = `SELECT * FROM avatar WHERE id = ?`
      const [result] = await connection.execute(statement, [userId])
      return result[0]
    }
  ```

  此时返回的数据：
  <img src="C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20210210171048347.png" alt="image-20210210171048347" style="zoom:50%;" />

  要想将图片信息展示出来：ctx.body = result需要修改。

  ```js
    async avatarInfo(ctx, next){
      // 用户获取的文件id
      const {userId} = ctx.params
      const avatarInfo = await fileService.getAvatarByUserId(userId)
      ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.filename}`)
    }
    # AVATAR_PATH是导入的路径常量：./upload/avatar  // 在constants/file-path.js里
  ```

  此时图片再进行请求，浏览器自动下载文件，并不会展示图片，因为他不知道是图片还是文件。这种做法是只适合普通的图片。现在我们要设置reponse， 拿到响应对象

  ```js
  ctx.response.set('content-type', avatarInfo.mimetype)
  ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.filename}`)
  ```

* 对user表添加一段avatar，用来保存用户头像的url

  ```js
  ALTER TABLE `users` ADD `avatar_url` VARCHAR(200);
  ```

  希望用户在上传图像成功后，就保存这个url。在fileController中，上传后将用户数据保存到users表中。修改之前上传头像的接口：

  ```js
  # file.controller.js
  async saveAvatarInfo(ctx, next){
      // 拿到图片信息
      const {filename, mimetype, size} = ctx.req.file
      const {id} = ctx.user
      // 将图片保存到数据库中，所以需要单独创建表
     const res =  await service.createAvatar(filename, mimetype, size, id)
    // 保存图片地址在users表里
      // 拿到图片路径
      const avatarUrl = `${AVATAR_PATH}/${filename}`
      //更改users表
      await userService.updateAvatarUrlById(avatarUrl, id)
      ctx.body = '用户头像上传头像'
    }
  ```

  ```js
  # file.service.js
    async createAvatar(filename, mimetype, size, user_id){
      const statement = `INSERT INTO avatar 
      								(filename, mimetype, size, user_id) VALUES (?, ?, ?, ?)`
      const [result] = await connection.execute(statement, 
      									[filename, mimetype, size, user_id])
      return result
    }
  ```

  ```js
  # user.service.js
    async updateAvatarUrlById(avatarUrl, id){
      const statement = `UPDATE users SET avatar_url = ? WHERE id = ?`
      const [result] = await connection.execute(statement, [avatarUrl, id])
      return result[0]
    }
  ```

  此时上传头像，users里就有url字段存储着地址
  ![image-20210210195615751](C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20210210195615751.png)

  但这个地址是相对路径，更改：

  ```js
  # 更改env
  APP_PORT = 8000
  LOCAL_HOST = "localhost
  ```

  ```js
  # config.js
  导出增加这一项
  ```

  ```js
  const avatarUrl = `${AVATAR_PATH}/${filename}`
  更改为：
  const avatarUrl = `${LOCAL_HOST}:${APP_PORT}/${id}/avatar`
  ```

  ![image-20210210201631018](C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20210210201631018.png)

#### 3. 上传动态的配图 ####

* 定义上传动态配图的接口

  ```js
  # file.router.js
  fileRouter.post('/picture', verifyAuth, pictureHandle)
  ```

  ```js
  # fie.middleware.js
  // 上传动态图
  const uploadPicture = Multer({
    dest: PICTURE_PATH
  })
  const pictureHandle = uploadPicture.array('picture', 9)
  ```

* 创建表file存储上传的动态配图

  ```js
  CREATE TABLE IF NOT EXISTS `file`(
  	id INT PRIMARY KEY AUTO_INCREMENT,
  	filename VARCHAR(100) NOT NULL UNIQUE,
  	mimetype VARCHAR(30),
  	size INT,
  	moment_id INT,
  	user_id INT,
  	createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  	FOREIGN KEY (moment_id) REFERENCES moment(id) ON DELETE CASCADE ON UPDATE CASCADE
  	);
  ```

* 我希望上传时，把query参数一起传过来：

  ```js
  # # file.router.js
  fileRouter.post('/picture', verifyAuth, pictureHandle, savePictureInfo)
  ```

```js
  # file.controller.js
    async savePictureInfo(ctx, next){
      // 获取头像信息
      const files = ctx.req.files
      const {id} = ctx.user
      const {momentId} = ctx.query
      // 将所有的文件信息保存到数据库中
      for(let file of files){
        // 拿到图片信息
      const {originalname, mimetype, size} = file
      // 拿user_id
      const result = await service.createPicture(
        						 originalname, mimetype, size, momentId, id)
      ctx.body = result
    	}
    }
```

```js
  # file.service.js
   async createPicture(originalname, mimetype, size, momentId, userId){
      const statement = `INSERT INTO file (filename, mimetype, size, moment_id, user_id) 
                         VALUES (?, ?, ?, ?, ?);`
      const [result] = await connection.execute(statement, [originalname, mimetype, size, momentId, userId,])
      return result
    }
```

![image-20210210213006041](C:\Users\小虎牙\AppData\Roaming\Typora\typora-user-images\image-20210210213006041.png)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  

从服务器拿到的图片是原图，服务器会对上传的图片进行一些处理，举例一张图像变成3张（1280、640、320）。当我们在列表中展示图片的时候，可以提供不同类型的图片，这是就需要对用户上传过来的图片进行专门的处理。
