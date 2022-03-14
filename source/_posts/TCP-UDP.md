---
title: TCP && UDP传输
tags:
  - TCP
  - UDP
categories: 计算机基础
description: 传输层的TCP、UDP介绍
cover: >-
  https://images.unsplash.com/photo-1639044678744-d3a0ed8a53c4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDJ8aG1lbnZRaFVteE18fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
abbrlink: 2124882507
date: 2021-12-11 23:30:34
---
## 传输层 ##

### 1、传输层概述 ###

* 物理层、数据链路层以及网络层之间他们共同解决了将主机通过异构网络互连起来所面临的问题，**实现了主机到主机之间的通信**

* 实际上在计算机网络中进行通信的真正实体是位于通信两端的主机中的进程

* **传输层：**为运行在不同主机上的应用进程提供直接的通信服务，又被称为端到端协议

  <img src="https://img-blog.csdnimg.cn/20210204214054815.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="运输层简单传输过程" style="zoom: 25%;" />

* **逻辑通信的概念：**

  指运输层之间的通信使人感觉是沿水平方向传送数据；

  但事实上，这数据并没有一条水平方向的物理连接，要传送的数据是沿着图中上下多次的虚线方向传送

  * 举例：假设进程Ap1与Ap4之间进行基于网络的通信，通信的简单过程如下：

    1. 根据不同的进程，在运输层选择使用不同的端口
    2. 通过网络层及其下层来传输应用层报文
    3. 将收到的应用层报文到达接收方的运输层后，通过不同的端口，交付给应用层中相应的应用进程

    这里端口并不是指看得见、摸得着的物理端口，而是指用来**区分不同应用进程的标识符**

    <img src="https://img-blog.csdnimg.cn/20210204214642914.png" alt="运输层屏蔽下面核心细节" style="zoom:50%;" />

### 2、端口号、复用和分用 ###

#### 1、端口号 ####

* 为什么要用到端口号：
  1. 在操作系统中 ，运行在计算机上的进程使用进程标识符PID来标志，但是因特网上的计算机并不是使用统一的操作系统，不同的操作系统使用不同格式的进程标识符。
  2. **为了使运行不同系统的计算机的应用进程之间能够进行网络通信**，就必须使用统一的方法来对TCP/IP体系的应用进程进行标识。也就是使用端口号
  3. TCP/IP体系的运输层使用端口号来区分应用层的不同应用进程：
     <img src="https://img-blog.csdnimg.cn/20210204215346994.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="端口号的知识" style="zoom: 33%;" />

#### 2、发送方的复用和接收方的分用 ####

* 复用可以理解为**多个进程重复使用一个协议进行应用报文的封装**

* 分用可以理解为**一个封装好的应用报文根据某协议进行解析成不同的进程应用报文**

  <img src="https://img-blog.csdnimg.cn/20210204221120338.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="发送方复用和接收方分用" style="zoom: 33%;" />

* **发送方复用：**

  在发送方中，多个进程通过端口利用一个运输层协议将数据封装成报文后发送，这就称为发送方复用

  * 不同协议就叫不同协议复用，如图中的UDP复用
  * 在IP复用中也会**根据协议字段的不同将其使用不同协议再次进行封装**

* **接收方复用：**

  * 在接收方中，利用一个协议，将用报文解析成不同数据，将数据根据端口发送不同进程，这就称为接收方分用
  * 在IP分用中也会根据协议字段的不同将其使用不同协议进行解析

* TCP/IP体系的应用层常用协议的运输层熟知端口号：

  <img src="https://img-blog.csdnimg.cn/20210204221501845.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="运用层熟知端口号" style="zoom:33%;" />

#### 对**一个域名访问中的运输层传输流程进行解读：** ####

<img src="https://img-blog.csdnimg.cn/20210204221831138.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="运输层传输中的主要路由器" style="zoom:50%;" />

* 首先先认识在一次运输层传输中的主要路由器：

  1. DNS服务器：记录有某域名所对应的IP地址，在输入网页域名后，在hosts中找不到网页对应的IP地址时，就要通过DNS服务器获取域名对应的IP地址
  2. Web服务器:某域名的服务器，也就是前面几章所说的目的主机，在访问域名时IP数据报最终即使到达Web服务器，服务器进行响应

* 在浏览器中输入某域名，点击回车键开始访问：

  1. 若此时在本地hosts缓存中有该域名的IP地址，直接发送带有目的地址的IP数据报

  2. 若计算机中没有该域名对应的IP地址，进行以下操作：

     1. 构建DNS请求报文：

        <img src="https://img-blog.csdnimg.cn/2021020422245862.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="构建DNS请求报文" style="zoom:33%;" />

     2. 然后在空闲的短暂端口中随机选择一个端口来表表示本进程：

        DNS协议请求是熟悉端口之一，根据常见端口熟悉协议可查到，DNS协议的端口为53

     3. 将该UDP请求数据报通过以太网发送给DNS服务器

     4. DNS服务器接收到请求数据报文后，从中解封出UDP用户数据报：

        从数据报的目的端口知道,其目的端口为53后，服务器会将数据载荷部分（DNS请求报文）交给53端口对应的进程进行处理，此例中也就是DNS服务器端进程

     5. DNS服务器端进程解析DNS查询请求报文的内容，然后按照其要求查找对应的IP地址。查找到后会发送DNS响应报文：

     6. 该响应报文使用运输层的UDP协议封装成UDP报文。然后将其源端口设置成发送来的端口，目的端口设置为发送来的源端口

        <img src="https://img-blog.csdnimg.cn/20210204223342657.png" alt="DNS响应报文" style="zoom:50%;" />

     7. 接收方将UDP用户响应数据报封装在IP数据报中发送给发送方

     8. 用户在获得响应报文后，从中解封出用户数据报。根据用户数据报的目的端口，可以知道其传输给DNS进程

     9. 此时会将数据载荷，也就是DNS响应报文交给DNS进程进行处理，DNS进程将其响应报文进行解析，就可知道自己之前所请求的Web服务器的域名，此时就可以开始进行**访问域名**

  3. 知道域名对应的IP地址后，可以开始构建HTTP请求，并发送该请求

     <img src="https://img-blog.csdnimg.cn/20210204224440923.png" alt="构建TCP请求报文" style="zoom: 50%;" />

     * HTTP请求报文的构建需要TCP协议构建TCP首部，在首部中选择一个空闲的短暂端口作为源端口，此时该端口代表TCP应用进程。目的端口选择80，这是HTTP协议所占的常用端口。
     * 将TCP报文段封装在IP数据报中，并进行发送
     * HTTP请求报文通过以太网传输到对应Web服务器中，在接收到报文后会对其进行解析，在知道其端口为80后，会将数据载荷部分传输给本服务器中的**HTTP服务器端进程进**行解析。

  4. 解析到内容后按照其要求查找首页内容。查找到后会给给用户PC发送HTTP响应报文。此时构建的源端口和目的端口刚好和发送的端口含义相反，原因与上面查询DNS服务过程相同

     <img src="https://img-blog.csdnimg.cn/20210204225235116.png" alt="构建HTTP响应报文" style="zoom:50%;" />

     * Web服务器发送响应报文回用户PC

       用户PC接收到报文后进行解封，解封后发现目的端口是49152，也就是用户PC内的HTTP进程。因此将数据载荷（HTTP报文）传输给HTTP进程进行处理

     * HTTP进程解析到其内同后，在网页浏览器中进行展示

  5. 至此，一次网页请求结束

### 3、TCP、UDP协议 ###

#### 1、概念上 ####

* UDP（User Datagram Protocol）：用户数据报协议，向上层提供**无连接、不可靠**服务
* TCP（Transmission Control Protocol）：传输控制协议，向上层提供**面向连接、基于字节流**的可靠服务
  * 流就是指不间断的数据结构，可以把它想象成排水管中的水流

#### 2、在连接方式上 ####

* UDP是无连接的通信方式；

  * UDP 想发数据就可以开始发送了，不需要连接，它只是数据报文的搬运工，不会对数据报文进行任何拆分和拼接操作
  * 在发送端，应用层将数据传递给传输层的 UDP 协议，UDP 只会给数据增加一个 UDP 头标识为UDP 协议，然后就传递给网络层了
  * 在接收端，网络层将数据传递给传输层，UDP 只去除 IP 报文头就传递给应用层，不会任何拼接操作

* TCP是通过著名的**“三次握手”建立连接，“四次挥手”释放连接**

  <img src="https://img-blog.csdnimg.cn/20210205101524393.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="连接方式" style="zoom: 33%;" />

#### 3、在传播方式上： ####

* UDP由于不建立连接，支持单播、多播和广播；

* TCP由于每次通信需要建立基于TCP连接的可靠信道，且每次只能建立一条连接，因此只支持单播

  <img src="https://img-blog.csdnimg.cn/20210205101823359.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="传播方式上的区别" style="zoom: 50%;" />

#### 4、在报文传输处理上： ####

<img src="https://img-blog.csdnimg.cn/20210205102109359.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="报文传输处理上" style="zoom: 33%;" />

* **UDP协议，面向报文。**
  1. UDP发送方：对应用层传下来的**报文不进行处理，保留报文的边界**。在给报文**加上UDP首部就发送**。
  2. UDP接收方：首部接收到UDP数据后，去除其首部，交付给应用层
  3. 因此，应用程序必须选择合适大小的报文
  4. 可以看出，**UDP是针对报文为单位进行处理的，也就是UDP是面向应用报文的**

5. 再者网络环境时好时坏，但是 UDP 因为没有拥塞控制，一直会以恒定的速度发送数据。即使网络条件不好，也不会对发送速率进行调整。这样实现的弊端就是在网络条件不好的情况下可能会导致丢包，但是优点也很明显，在某些实时性要求高的场景（比如电话会议）就需要使用 UDP 而不是 TCP。

* **TCP协议，面向字节流的。**

  发送方：

  1. TCP协议会把应用进程交付下来的数据块（报文）看作是**一连串无结构的字节流**（TCP并不知道这些子节含义），将他们**编号**，并存储在自己的**发送缓存**中
  2. TCP再根据发送策略，**提取一定量的字节**，加上TCP首部，构建成TCP报文进行发送

  接收方：

  1. 从所接受到的TCP报文段中，取出数据载荷部分并存储在接收缓存中
  2. 同时将接收缓存中的一些字节交付给应用进程。

  【注意】：

  1. TCP协议保证接收方收到的字节流和发送方应用进程发出的字节流完全一样；

  2. TCP**不保证**接收方应用进程所收到的数据块与发送方发送的数据块，具有对应大小的关系：

     例如，发送方应用进程交给发送方的TCP共10个数据块，但接收方的TCP可能只用了4个数据块，就把收到的字节流交付给了上层的应用进程，但不会全部将数据交付给上层。

     因此**接收方的TCP应用进程必须有能力识别收到的字节流**，把它还原成有意义的应用层数据

  可以看出，TCP对报文的处理是以子节为单位的，也就是TCP是面向字节流的，这正是TCP实现可靠传输、流量控制、以及拥塞控制的基础

#### 5、在给上层提供的服务上： ####

<img src="https://img-blog.csdnimg.cn/20210205103545602.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="在这里插入图片描述" style="zoom: 33%;" />

* UDP提供的是不可靠服务：

  1. 不可靠性首先体现在无连接上，通信不需要建立连接，想发就发，这样的情况肯定不可靠

  2. 对于发送的UDP数据报，接收方在检测到其误码后直接丢弃，不做其他操作

     对于发送方发送过程中出现分组丢失，也不做处理。因此其传输数据是不一定能使接收方全部收到数据，因此是不可靠服务。

  3. 网络环境时好时坏，但 UDP 没有拥塞控制，一直会以恒定的速度发送数据，即使网络条件不好，也不会对发送速率进行调整

  4. 这样实现的弊端就是在网络条件不好的情况下可能会导致丢包，但是优点也很明显，在某些实时性要求高的场景 ( 比如电话会议 ) 就需要使用 UDP 而不是 TCP

* TCP提供的是可靠服务：

  1. TCP传输过程中需要建立连接，通过建立的可靠信道进行传输

  2. TCP为了保证报文传输的可靠，就给每个包一个序号，同时序号也保证了传送到接收端实体的包的按序接收

     判断误码、丢失、乱序、重复靠的是TCP的段编号以及确认号;

     然后接收端实体对已成功收到的字节发回一个相应的确认(ACK)，如果发送端实体在合理的往返时延(RTT)内未收到确认，那么对应的数据（假设丢失了）将会被重传

  3. 因此可以保证发送端发送什么，接收端接收到什么，是可靠传输

#### 6、协议首部对比 ####

<img src="https://img-blog.csdnimg.cn/20210205104221506.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="协议首部对比" style="zoom: 50%;" />

* 由于UDP不提供可靠传输的服务，因此其首部只需要在**网际层的基础上添加区分端口的子节**，其头部包含了以下几个数据

  * 两个十六位的端口号，分别为发出端口和接收端口
  * 整个数据报文的长度
  * 整个数据报文的检验和（IPv4 可选字段），该字段用于发现头部信息和数据中的错误

  所以UDP 的头部开销小，只有8字节，相比 TCP 的至少20字节要少得多，在传输数据报文时高效的

* 在TCP中，需要提供可靠传输、流量控制、拥塞控制等服务，首部比较复杂，字段比较多

### 4、TCP的流量控制 ###

#### 1、流量控制过程 ####

* 流量控制：

  数据传输中，希望传输的越快越好，但若传输过快会导致接收方不够时间接收数据，造成数据丢失。

  流量控制就是为了让发送方速率不要太快，要让接收方来的及接收

  **TCP 利用滑动窗口实现流量控制**

  ![A与B建立连接](https://img-blog.csdnimg.cn/20210205110201196.png)

* 举例说明：

  ![400的数据窗口](https://img-blog.csdnimg.cn/20210205110243488.png)

  A与B建立连接,建立完后约定好一个数据传输窗口，例如400：此后，双方传输数据就会以此约束的窗口大小进行。

  <img src="https://img-blog.csdnimg.cn/20210205111208400.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="流量控制发送第一步" style="zoom:50%;" />

  1. A主机根据窗口长度，向B主机分三次发送了300子节的数据，但是201-300子节数据报丢失，此时发送方还不知道丢失，只知道传输了300子节，还能传输100子节

  2. 此时接收方根据收到的数据进行累计确认，发送确认信号，第一次流量控制，此信号参数含义：

     ```
     ACK = 1:这是一个TCP确认字段
     ack = 201 :201编号以前的数据全部确认收到
     rwnd = 300 : 将接收窗口大小调整为300
     ```

     <img src="https://img-blog.csdnimg.cn/20210205111708336.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="流量控制示例2" style="zoom:33%;" />

  3. 在A收到确认ACK报文后，根据报文内容，将窗口进行滑动，此时由于前200子节已确认，因此将其**从缓存中删除**。同时根据报文内容的窗口调整调整为300大小。继续发送数据，直到无法发送窗口已满

     此时由于201-300分组丢失超过重传计数器设置时间，对开始重传201-300分组；

     接收方在收到501号所有分组后，发送新的ACK确认报文，报文中将窗口设置为100大小（第二次流量控制）

     <img src="https://img-blog.csdnimg.cn/20210205112138766.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="流量控制示例3" style="zoom:50%;" />

  4. 在接收方接收到ACK报文后，对前500字节数据在缓存中删除，并将窗口调整为100，然后调整滑动窗口位置，开始新的传输。


     传输窗口数据后不再传输数据。等待ACK确认信号。
    
     此时接收方接收到数据后再次发送ACK报文，将窗口大小设置为0。(第三次流量控制)

    5. 此时由于窗口为零，不再发送数据

#### 2、死锁情况考虑 ####

* 出现的场景：

  在缓存不足，接收方窗口调整为0后，过了一段时间便有了新的空间，此时发送一个新的调整窗口报文，但是此时报文传输丢失！无法到达发送方；

  此时就会出现发送方等待接收方有缓存空间，接收方等待发送方发送数据的死锁情况

* 为了解决这个问题，TCP为每一个连接设有一个**持续计时器：**

  <img src="https://img-blog.csdnimg.cn/20210205112832621.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="持续计时器" style="zoom:50%;" />

  1. 在连接的一方接收到对方的零窗口通知后一段时间后，超时计时器到时，就会发送一个1子节的**零窗口发送报文**，在接收方接收到该信号后，就会通告自己的窗口大小

  2. 当知道窗口可以传输数据后，就会开始通信

  3. 如果**零窗口探测报文**在发送过程中如果丢失，还是能打破死锁局面：

     因为零窗口探测报文段也有重传计时器，重传计时器超时后，零窗口探测报文段会被重传

【注意】：TCP中规定不论接收方有没有空间，都必须接收发送方的3种报文：
**零窗口检测报文段**、确认报文段、携带有紧急数据的报文段

#### 3、总结 ####

* 利用滑动窗口机制，可以很方便地在TCP连接上实现对发送方的流量控制：
  1. TCP接收方利用自己的**接收窗口**的大小来限制发送方**发送窗口**的大小；
  2. TCP发送官方收到接收方的**零窗口通知**后，应启动**持续计时器**，持续计时器超时后，向接收方发送**零窗口探测报文**。

### 5、TCP拥塞控制 ###

* 拥塞：

  某段时间，若对网络中某一资源的需求超过了该资源所能提供的可用部分，网络的性能就要变坏；

  而拥塞控制就是为了防止过多的数据注入到网络中，这样就可以使网络中的路由器或链路不致过载；

  若出现拥塞而不进行控制，整个网络的吞吐量将随输入负荷的增大而下降

<img src="https://img-blog.csdnimg.cn/20210205170452296.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="拥塞情况" style="zoom:50%;" />

#### 0、拥塞算法的基本思路 ####

以下算法的前提条件：

<img src="https://img-blog.csdnimg.cn/20210205171237333.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="拥塞算法假定条件" style="zoom: 33%;" />

* 发送方维护一个叫做**拥塞窗口cwnd**的状态变量，其值取决于网络的拥塞程度，并且动态变化

* **拥塞窗口的维护原则：**只要没有网络出现拥塞，拥塞窗口就再增大一些，只要网络出现拥塞，拥塞窗口就减少一些。

* **判断网络拥塞的依据：**没有按时收到应到达的确认报文（发生超时重传）

* 发送方将拥塞窗口作为**发送窗口swnd**，即：swnd = cwnd

* 维护一个**慢开始门限ssthresh**状态便变量，其维护原则为:

  <img src="https://img-blog.csdnimg.cn/20210205172001338.png" alt="在这里插入图片描述" style="zoom:50%;" />

#### 1、拥塞控制算法1：慢开始 ####

* 慢开始算法：用来确定网络的负载能力或拥塞程度，

  * 实现是由小到大逐渐增大（以倍数增长）拥塞窗口数值；慢开始指的是一开始网络注入的报文段少，并不是指拥塞窗口cwnd的增长速度慢

* 过程举例：

  * 横坐标为传输轮次，即完整发送一个拥塞窗口数据并收到确认报文的时间（可理解为往返时间）
  * 纵坐标为拥塞窗口，并且根据不同情况会设置一个慢开始门限

  ![坐标系](https://img-blog.csdnimg.cn/20210205172339397.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70)

  初始化：发送方将初始拥塞窗口设为1，并设置一个ssthresh（慢开始传送位），然后开始传送数据

  进行第一轮数据通信：

  1. 在收到确认报文后：不断地将拥塞窗口设置为原来的两倍

     <img src="https://img-blog.csdnimg.cn/20210205172719478.png" alt="将拥塞窗口设置新值" style="zoom: 50%;" />

  2. 第四次发送顺利进行，成功接收到确认报文后，将**拥塞窗口增大到16.**
     ![坐标轴情况3](https://img-blog.csdnimg.cn/20210205173731557.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70)

  3. 此时，**拥塞窗口已达到慢开始门限SSTHRESH,**此时，慢开始算法阶段结束，开始拥塞避免算法

#### 2、拥塞控制算法2：拥塞避免 ####

* 拥塞避免算法：

  让拥塞窗口 cwnd 缓慢地增大（每伦窗口大小+1），避免出现拥塞；

  在拥塞避免阶段，具有 “加法增大” (Additive Increase) 的特点

  拥塞避免算法并不能完全避免拥塞，只是在拥塞避免阶段将容易拥塞的窗口控制为按线性规律增长，使网络比较不易出现拥塞

* 接着上面的例子：

  1. 进行第六轮传输：此时不再使用慢开始算法，采用拥塞避免算法，每个轮次只给拥塞窗口+1。

     <img src="https://img-blog.csdnimg.cn/20210205173921444.png" alt="第六轮传输" style="zoom: 50%;" />

     ![坐标轴情况5](https://img-blog.csdnimg.cn/20210205174101695.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70)

  2. 第七轮传输：传输成功后，给拥塞窗口+1.

##### 假如报文段丢失： #####

* 循环重复此传输过程，若出现以下情况：

<img src="https://img-blog.csdnimg.cn/2021020517424021.png" alt="出现报文段丢失情况" style="zoom:50%;" />

* 重传计时器超时后，判断网络很可能出现了拥塞，进行以下工作：

  将ssthresh值更新为拥塞时cwnd值的一半
  将cwnd值减少为1，重新开始执行慢开始算法

##### 以上两个算法的完整示意图： #####

<img src="https://img-blog.csdnimg.cn/20210205174838531.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="两个算法的完整示意图" style="zoom:50%;" />

##### 新问题： #####

因此提出了**快重传算法和快恢复算法**

<img src="https://img-blog.csdnimg.cn/20210205174947201.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="错误设置窗口情况" style="zoom:50%;" />

#### 3、拥塞控制算法3：快重传 ####

* 快重传算法：

  在出现分组错误后，发送方尽快重传数据，而不是等待超时计时器超时再重传。

  三个原则：

  1. 要求接收方不要等等自己发送数据时才进行捎带确认，而是要立即发送确认
  2. 即使收到了失序的报文段也要立即发出对已收到的报文段的重复确认
  3. 发送方一旦收到了3个连续的重复确认，就立即将相应的报文段立即重传，不用等到超时计时器超时后再重传

* 对于个别丢失的报文段，发送方不会出现超时重传，也就不会误认为出现了拥塞（这会使拥塞窗口设置为1），该算法可以使整个网络吞吐量提高约20％

  <img src="https://img-blog.csdnimg.cn/20210205175746820.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="快重传算法" style="zoom:50%;" />

* 举例说明：

  1. 在快重传算法中，发送方会在接收到确认分组前就发送下一个分组（前提是在拥塞窗口大小内）
  2. 对于丢失的分组，会在收到3个分组后发送3个重复确认丢失分组序号
  3. 接收方收到3个重复分组序号后便开始重传，而不是等待超时计时器到时，这样子也不会误以为出现了拥塞

#### 4、拥塞控制算法4：快恢复 ####

* 快恢复算法：
  * 是发送方将慢开始门限ssthresh值和拥塞窗口cwnd值调整为当前窗口的一半，并开始执行拥塞避免算法
  * 发送方在收到3个重复确认后，就知道现在只是丢失了个别的报文段。于是不开始启动慢开始算法，转而执行快恢复算法

* 四个算法再传输过程中的使用顺序图：

<img src="https://img-blog.csdnimg.cn/2021020518062065.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="算法使用顺序图" style="zoom:50%;" />

	1. 一开始使用慢开始算法，拥塞窗口开始指数规律增大到设定的ssthres值后执行拥塞避免算法

   	2. 拥塞避免算法将拥塞窗口以1为单位线性增大，直到出现分组丢失
   	3. 重传计时器时间到后，cwnd设置为1，ssthresh值设置为发生拥塞的窗口值大小一半，并重新开始执行慢开始算法
   	4. 在发送方收到3个重复确认时及执行快重传和快恢复算法，将ssthresh的值更新为当前拥塞窗口值得一半，更新cwnd值为ssthresh值

### 6、TCP超时重传时间的选择 ###

TCP使用两套独立的机制来完成重传，一是**基于时间**，二是**基于确认信息**。

* TCP在发送一个数据之后，就开启一个定时器，若是在这个时间内没有收到发送数据的ACK确认报文，则对该报文进行重传，在达到一定次数还没有成功时放弃并发送一个复位信号。

* TCP超时重传时间的选择是TCP最复杂的问题之一：

  * 若RTTO超时重传时间过短会导致不必要的重传，使网络负荷增大。
  * RTO过长会导致网络的空闲时间增大，降低了传输效率
  * 因此，**RTTO的设置应该略大于RTT**

* 新问题：RTTO的判定问题：

  由于网络传输环境的不同，导致接下来的RTT是不确定的，不能直接用某次测量得到的RTT样本值来计算超时重传时间RTO。如此应该如何去认定RTO？

  <img src="https://img-blog.csdnimg.cn/20210205220126650.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="RTT测量复杂" style="zoom:50%;" />

* 关于RTTs的计算：

  <img src="https://img-blog.csdnimg.cn/20210205215919856.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="RTTs的计算" style="zoom: 67%;" />

* 计算超时重传时间RTO:

  <img src="https://img-blog.csdnimg.cn/20210205220003983.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="RFC6298建议下的RTO计算" style="zoom:50%;" />

针对以上问题，有以下解决方式：

<img src="https://img-blog.csdnimg.cn/20210205220207182.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="Karn解决算法" style="zoom:50%;" />

* 一个计算RTO的例子：

  <img src="https://img-blog.csdnimg.cn/20210205220305521.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="计算RTO例子" style="zoom:67%;" />

### 7、TCP可靠传输的实现 ###

TCP基于以子节为单位的滑动窗口来实现可靠传输：

<img src="https://img-blog.csdnimg.cn/20210205222040265.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="TCP可靠传输的实现" style="zoom: 33%;" />

#### 1、发送方 ####

* 在要传递的字节流中，可以大致分为几个区域：

  1. **发送窗口后数据**（图中的左边）：这些数据已经成功发送出去并且已经收到确认信号，因此这部分数据可以从缓存中删除
  2. **发送窗口中数据**（图中的蓝色部分）：这部分数据正处于发送窗口中，此时数据有两种情况，已发送正在等待确认或者未发送出去，对于已发送的数据要存在发送缓存中。
  3. **发送窗口前数据**（图中的右半部分）：这部分数据不允许发送

* 根据发送的具体情况，**发送窗口的后延移动**情况有两种:

  不动：没有收到新的确认信息。

  前移：收到了新的确认信息。

* 根据发送的具体情况,前，**发送窗口的前延移动**情况有三种：

  **不间断向前移动：**收到了新的确认分组

  **不动：**没有收到新的确认分组并且对方的通知窗口信号大小不变；收到新的确认但对方通知的端口缩小个数等于后延移动的位数，使得发送窗口前沿正好不动。

  **向后收缩：**对方通知的窗口缩小了，但是这种情况容易造成错误，是TCP协议不愿看到的情况

#### 2、如何描述发送窗口中数据的状态 ####

由于发送窗口中的字节可能是已经发送的或者未发送的，就出现了一个问题，我们应该如何描述发送窗口中数据的状态？

* 可以采用三个指针来定位不同状态区域

  <img src="https://img-blog.csdnimg.cn/20210205223228998.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="描述发送窗口状态的方法" style="zoom: 33%;" />

#### 3、接收方 ####

<img src="https://img-blog.csdnimg.cn/20210205223433830.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="接收方字节状态" style="zoom:50%;" />


在接收方中也有跟发送方相同的字节序列情况：

​	其字节序列也可以分为三个部分，跟发送方一致，不过多赘述。

1. 若接收方收到未按序到达的数据，如本例收到32-33编号字节数据，**由于TCP的确认方式是只能发送按序收到的最高序号确认**，因此发送一个ack = 31的确认信号，也就是表示现在需要发送31号数据

   <img src="https://img-blog.csdnimg.cn/2021020522354113.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="接受方收到未按序到达的数据" style="zoom: 33%;" />

2. 发送方收到ack = 31报文后，知道31号数据未按序到达，但是根据上面所学的知识，只有**第3次接收到同一个ack信号才会进行重传**，此时**不做处理，继续发送往下的数据**。

   <img src="https://img-blog.csdnimg.cn/20210205224016267.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="成功接收到31序号" style="zoom:50%;" />

3. 此时若成功接收到31号数据，此时31-33号数据按序到达，此时接收方会**择机将数据交给应用层，并且将窗口向后滑动3字节，同时发送确认报文**。

   <img src="https://img-blog.csdnimg.cn/20210205224238102.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="发送确认报文以及同时有数据来到" style="zoom: 33%;" />

4. 在接收方发送的确认报文被发送方收到后，**会将发送窗口向后滑动若干字节（此处为3字节）**。**发送方此时会将31.32.33字节数据从缓存中删除**。

   <img src="https://img-blog.csdnimg.cn/20210205224631661.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="发送方继续发送剩余的数据" style="zoom: 50%;" />
   此时若发送方**又发送了3个未按序到达的数据**。此时接收方接受数据后不做处理。

   此时若迟迟等不到接收方确认信号，重传计时器超时，此时会重新发送发送窗口内已发送的数据，并重启重传计时器。

* 关于可靠传输实现的注意事项：

<img src="https://img-blog.csdnimg.cn/2021020522514810.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="可靠传输实现的注意事项" style="zoom: 33%;" />

### 8、TCP的3次握手、4次挥手 ###

* TCP是面向连接的协议，它基于运输连接来传送TCP报文段；运输连接管理就是使用运输连接的建立和释放都能正常的进行。**连接建立**有以下三个阶段：

  1. 三次挥手建立连接
  2. 建立连接后进行数据传输
  3. 四次挥手释放TCP连接

* TCP的连接建立要解决以下3个问题：

  1、使TCP双方都能确知对方的存在
  2、使TCP双方能够协商一些参数（如窗口最大值、是否使用窗口扩大选项和时间戳选项和服务质量等等）
  3、使TCP双方能够对运输实体资源（如缓存大小、连接表中的项目等）进行分配

#### 1、3次握手 ####

> 在三报文握手过程中，有**两个角色**，**客户端**发送握手连接请求，**服务器**等待接收请求。
>
> 在最开始：**双方都是处于关闭状态，此时双方的TCP进程都是关闭的。**
>
> 此时，**服务器在连接之前要进行准备**：
>
> 1、服务器创建传输控制块，在块中有TCP连接表等一些TCP连接的重要信息。
>
> 2、**创建后便开始监听**，准备接收来自客户端的连接请求
>
> 【注意】：TCP服务器进程是被动等待来自TCP客户进程的连接请求。而不是主动发起，因此称为被动打开连接
>
> 与服务器类似，客户端进程也需要进行准备：其准备过程只有建立传输数据块。

<img src="https://img-blog.csdnimg.cn/20210205231822366.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="客户端进程进行准备" style="zoom:33%;" />

##### 1、 第1次握手 #####

<img src="https://img-blog.csdnimg.cn/202102052321410.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="第一次发送握手报文" style="zoom: 33%;" />

* **客户端**向服务端发送连接请求报文段，并进入同步已发送( `SYN-SENT` 状态)

* TCP连接请求报文段首部中，有两个关键数据：

  1. 同步位SYN：被设置为1，表明这是一个TCP连接请求报文段
  2. 序号字段seq：被设置了一个初始值x，作为TCP客户端进程所选择的初始序号

  【注意】：TCP规定SYN被设置为1的报文段不能携带数据，但要消耗掉一个序号

##### 2、 第2次握手 #####

<img src="https://img-blog.csdnimg.cn/20210205232429727.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="服务器收到信号后" style="zoom:33%;" />

* **TCP服务器进程**收到客户端发送的TCP连接请求报文段后，如果同意建立连接，则向TCP客户进程发送TCP**连接请求确认报文段**，并进入**同步已接受**(  `SYN-RECEIVED` 状态)

* 连接请求确认报文段首部中有几个关键数据位：

  1. 同步位SYN和确认为ACK：都设置为1，表明这是一个TCP连接请求确认报文段
  2. 序号字段seq：设置了一个初始值y，作为TCP服务器进程所选择的初始序号
  3. 确认号字段ack:值被设置成了x+1，这是对TCP客户进程所选择的初始序号（seq）的确认


  【注意】：这个报文段也不能携带数据，因为它是SYN被设置为1的报文段，但同样消耗一个序号

##### 3、 第3次握手 #####

* TCP客户进程收到TCP连接请求确认报文段后，还要向TCP服务器进程发送一个普通的TCP确认报文段，并进入连接已连接（ `ESTABLISHED` 状态）

* 普通的TCP确认报文段首部中有以下重点数据位：

  1. 确认位ACK:设置为1，由于没有SYN同步字段，表明这是一个普通的TCP确认报文段，表示已确认收到建立连接报文。
  2. 序号字段seq:设置为x+1，因为TCP客户进程发送的第一个TCP报文段的序号为x，所以TCP客户进程发送的第二个报文段的序号为x+1（SYN字段报文需要消耗一个序号）
  3. 确认号字段ack：设置为y+1，这是对TCP服务器进程所选择的初始序号的确认

  值得注意的是：TCP规定普通的**TCP确认报文段(只有ACK没有SYN)可以携带数据**，但**如果不携带数据，则不消耗序号**

* 三次握手完毕后，服务器也进入连接已建立状态，此时双方连接已建立，可以开始进行数据传输

#### 2、3次握手的问题 ####

##### 1、为什么是3次？ #####

* ##### 三次握手的目的：三次握手才能确认双方的接收与发送能力都正常 #####

* 第一次：服务端确认自己的接收能力、客户端的发送能力

  第2次：客户端确认自己的接收+发送能力、服务端的发送能力

  **但此时服务器并不能确认客户端的接收能力是否正常**

  第3次：客户端发包，服务端收到了，服务器就能确定

##### 2、2次有什么问题？ #####

* ##### 2次握手：不采用三次握手，只要服务端发出确认，就建立新的连接了 #####

* **防止出现失效的连接请求报文段被服务端接收的情况**，从而产生错误

  * 假如客户端共发出了两个连接请求报文段，其中第一个在**某些网络结点长时间滞留了，延误到连接释放以后的某个时间才到达服务端**，第二个到达了服务端；
  * 此时服务端**误认为客户端又发出一次新的连接请求**，于是就向客户端发出确认报文段，同意建立连接
  * 此时客户端忽略服务端发来的确认，也不发送数据，则服务端一直等待客户端发送数据，**浪费资源**

##### 3、什么是半连接队列？ #####

* 服务器第一次收到客户端的 SYN 之后，就会处于 SYN_RCVD 状态，此时双方还没有完全建立其连接，服务器会把此种状态下请求连接放在一个**队列**里，这种队列称为**半连接队列**。

* **全连接队列**：已经完成三次握手，建立起连接的就会放在全连接队列中。如果队列满了就有可能会出现丢包现象

* **SYN-ACK 重传次数**：

  服务器发送完SYN-ACK包，如果未收到客户确认包，服务器进行首次重传，

  等待一段时间仍未收到客户确认包，进行第二次重传。

  如果重传次数超过系统规定的最大重传次数，系统将该连接信息从半连接队列中删除

  注意，每次重传等待的时间不一定相同，一般会是指数增长，例如间隔时间为 1s，2s，4s，8s......

#####   4、ISN是固定的吗？ #####

* 当一端为建立连接而发送它的SYN时，它为连接选择一个初始序号。
* ISN随时间而变化，因此每个连接都将具有不同的ISN。ISN可以看作是一个32比特的计数器，每4ms加1 。这样选择序号的目的在于防止在网络中被延迟的分组在以后又被传送，而导致某个连接的一方对它做错误的解释。
* **三次握手的其中一个重要功能是客户端和服务端交换 ISN(Initial Sequence Number)，以便让对方知道接下来接收数据的时候如何按序列号组装数据。如果 ISN 是固定的，攻击者很容易猜出后续的确认号，因此 ISN 是动态生成的。**

#### 3、4次挥手 ####

<img src="https://img-blog.csdnimg.cn/20210206101844970.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="数据建立主动释放" style="zoom:33%;" />

在双方连接已建立后，此时需要客户端**主动发出关闭**信号

##### 1、第1次挥手 #####

<img src="https://img-blog.csdnimg.cn/2021020610204186.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="第一次挥手" style="zoom: 33%;" />

* TCP客户进程会**发送TCP连接释放报文段**，并进入**终止等待1**状态
* TCP连接释放报文段首部中有以下关键数据位：
  1. 终止位FIN和确认位ACK：值都被设置为1，表明这是一个TCP连接释放报文段，同时也对之前收到的报文段进行确认
  2. 序号seq字段：值设置为u，u等于TCP客户进程之前已传送过的数据的最后一个字节的序号加1，用来表示发送过程中的最后一个字节序号为u
  3. 确认号ack字段：值设置为v，v等于服务器进程之前发送的数据中最后一个字节的序号加1，也就是确认收到已经收到的服务器发送的数据

* **【注意】：**TCP规定终止位FIN等于1的报文段即使不携带数据，也要消耗掉一个序号

##### 2、第2次挥手 #####

<img src="https://img-blog.csdnimg.cn/20210206103509759.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="第二次挥手" style="zoom: 33%;" />

* 接收方再接收到连接释放报文后，会发送一个**普通的TCP确认报文段**并进入关闭等待（`CLOSE_WAIT` 状态）

* 普通的TCP确认报文段首部中有以下关键数据位：

  1. 确认位ACK：值被设置为1，表明这是一个普通的TCP确认报文段。

  2. 序号seq：值设置为v，v等于TCP服务器进程之前已传送过的数据的最后一个字节的序号加1，与之前收到的TCP连接释放报文段中的确认号ack值匹配

  3. 确认号ack字段：值为u+1，这是对TCP连接释放报文段的确认，也就是为发送方连接释放报文中的seq的值+1.

* 在第2次挥手后，会产生以下过程：

  * TCP服务器进程通知高层应用进程，TCP客户进程要断开与自己的TCP连接，此时的TCP连接进入半关闭状态。
  * 半关闭状态可以认为，此时**客户端与服务器的连接不再传输数据**，也就是客户端没有数据在发生。而此时**服务器若有剩余数据要发送会继续发送**。
  * 半关闭状态可能会持续一段时间，直到发送方没有数据进行发送

* 在以上等待过程中，客户端会进入**终止等待2状态：**

  <img src="https://img-blog.csdnimg.cn/20210206104044261.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="第二次挥手后服务器状态" style="zoom:33%;" />

##### 3、第3次挥手 #####

此时当服务器没有数据要传输后。进行第三次挥手：

<img src="https://img-blog.csdnimg.cn/2021020610480896.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="第三次挥手" style="zoom: 33%;" />

* 此时TCP服务器进程会发送TCP连接释放报文段并进入最后确认状态：

* 在该报文段中有以下关键数据段：

  1、终止位FIN和确认位ACK：值都被设置为1，表明这是一个TCP连接释放报文段，同时也对之前收到的报文段进行确认

  2、序号seq：值为w，因为在半关闭状态下，TCP服务器进程可能又发送一段数据，因此w就是该段数据最后的序号。

  3、确认号ack：值为u+1，这是对之前收到的TCP连接释放报文段的重复确认，因此值与发送方第一次挥手发送的seq值+1。

##### 4、第4次挥手 #####

TCP客户进程**收到TCP连接释放报文段**后开始第四次挥手：

<img src="https://img-blog.csdnimg.cn/20210206105234687.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="第四次挥手" style="zoom:33%;" />

* 针对第三次挥手的报文段发送**普通的TCP确认报文段**，之后进入**时间等待状态。**

* 该报文段首部中有以下关键数据位：

  1、确认位ACK：值被设置为1，表明这是一个普通的TCP确认报文段。

  2、序号seq字段：值设置为u+1，用来表示最后一个发送的字节序号，

  ​	但是为何没有发送数据，而此时值要设置为u+1（对比第一次挥手数据）？

  ​	因为TCP客户进程之前发送的TCP连接释放报文段(带有FIN)虽不携带数据，但要消耗一个序号

  3、确认号ack：值设置为w+1，这是对所收到的TCP连接释放报文段的确认

* 此时**TCP服务器进程收到该报文段后就进入关闭状态**

* 而TCP客户进程还要**经过2MSL**后才能进入关闭状态，MSL具体的值（最大段生存期，指报文段在网络中生存的时间，超时会被抛弃）可以根据TCP协议的不同实现进行设置。

#### 4、4次挥手的问题 ####

##### 1、为什么4次？ #####

* 服务端收到客户端的FIN报文后，不能立刻回应FIN断开服务端-客户端的连接
* 因为自己可能还有数据发给客户端。所以先发ACK应答给客户端，告诉他已经知道要释放链接了，把自己的数据发送完，再开始发FIN来断开服务端-客户端的连接

##### 2、为什么不发送报文段后直接关闭，而是要等待2MSL个时间后才关闭？，是否有必要？ #####

* 目的1：为了保证客户端发送的最后一个ACK报文段能够到达服务器，保证服务器关闭

* 目的2：防止“已失效的连接请求报文段”出现在本连接中

* 举例说明：

  <img src="https://img-blog.csdnimg.cn/20210206110230216.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="不等待2MSL的情况" style="zoom: 33%;" />

  

  1. 若客户端发送完最后一次报文后，也就是第四次挥手后就直接进入关闭状态，此时若第四次挥手报文丢失，会导致服务器的超时重传

  2. 此时客户端又已经关闭，导致不接受该报文，因此服务器会一直不断重传，并一直处于最后确认状态无法进入关闭状态。

  3. 因此，有以下结论：

     * 客户端进入时间等待状态以及处于该状态2MSL时长，可以确保TCP服务器进程可以收到最后一个TCP确认报文段而进入关闭状态。

     * TCP客户进程在发送完最后一个TCP确认报文段后，在经过2MSL时长，就可以使本次连接持续时间内所产生的所有报文段都从网络中消失，这样就可以使下一个新的TCP连接中，不会出现旧连接中的报文段。

* 假如另一种情况：

  1. TCP双方已经建立了连接，但是传输过程中**TCP客户进程所在的主机**出现了故障，此时TCP服务器进程以后就不能再收到TCP客户进程发来的数据，这时服务器进程会一直处于等待状态。

  2. 为了使TCP服务器进程不要再白白等待下去出现了**TCP保活计时器：**

     <img src="https://img-blog.csdnimg.cn/20210206110921258.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="保活计时器" style="zoom: 50%;" />

##### 3、为什么TIME_WAIT状态需要经过2MSL才能返回到CLOSE状态？ #####

* 理论上，四个报文都发送完毕，就可以直接进入CLOSE状态了，但有可能最后一个ACK丢失。所以**TIME_WAIT状态就是用来重发可能丢失的ACK报文**

### 9、TCP报文的首部格式： ###

为了实现可靠传输，TCP采用了面向字节流的方式。在发送数据时，**从发送缓存中取出一部分或者全部字节，并给其添加一个首部**使之称为**TCP报文段**。

1. 一个TCP报文段由首部、数据载荷两部分构成
2. TCP的**全部功能都能体现在它首部中各字段**的作用

TCP首部和IP地址的首部类似，都由固定部分和扩展部分构成

<img src="https://img-blog.csdnimg.cn/20210206111411616.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="TCP首部" style="zoom:50%;" />

#### 1、固定部分 ####

* 源端口和目的端口字段：

<img src="https://img-blog.csdnimg.cn/20210206111530978.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="源端口和目的端口字段" style="zoom: 33%;" />

* 序号、确认号、ACK字段：

<img src="https://img-blog.csdnimg.cn/20210206112000569.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="序号" style="zoom: 33%;" />

<img src="https://img-blog.csdnimg.cn/20210206112111207.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="确认号" style="zoom:33%;" />

也就是四次挥手中的SEQ.

<img src="https://img-blog.csdnimg.cn/20210206112144726.png" alt="ACK" style="zoom: 33%;" />

以上三个字段的使用例子：

<img src="https://img-blog.csdnimg.cn/20210206112234844.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="三个字段例子" style="zoom:50%;" />

* 数据偏移字段：

<img src="https://img-blog.csdnimg.cn/2021020611235494.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="数据偏移字段" style="zoom:33%;" />

例如：其数据偏移二进制数的十进制表示 * 4 = 首部长度

<img src="https://img-blog.csdnimg.cn/20210206112504633.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="数据偏移例子" style="zoom:33%;" />




* 保留、窗口、校验和字段：

  <img src="https://img-blog.csdnimg.cn/20210206112718623.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="保留、窗口" style="zoom: 50%;" />

* 与连接管理相关的字段：

  <img src="https://img-blog.csdnimg.cn/20210206112822979.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="同步标志位" style="zoom: 50%;" />

  <img src="https://img-blog.csdnimg.cn/20210206112841284.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="终止标志位" style="zoom:50%;" />

  <img src="https://img-blog.csdnimg.cn/20210206112906122.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="复位标志位字段" style="zoom:50%;" />

  <img src="https://img-blog.csdnimg.cn/20210206112926575.png" alt="推送标志位字段" style="zoom:50%;" />

  <img src="https://img-blog.csdnimg.cn/20210206113010144.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="紧急标志位URG紧急指针" style="zoom: 50%;" />

#### 2、拓展部分 ####

* 选项和填充字段：

  <img src="https://img-blog.csdnimg.cn/20210206113129998.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pbXJvZF9f,size_16,color_FFFFFF,t_70" alt="选项字段" style="zoom:33%;" />