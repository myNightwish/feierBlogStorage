---
title: URL、URI
copyright_author: 飞儿
copyright_url: 'https://www.nesxc.com/post/hexocc.html'
license: CC BY-NC-SA 4.0
license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0'
tags: URL、URI
categories: 计算机基础
cover: https://cdn.jsdeliver.net/gh/myNightwish/CDN_res/img/URI&URL.webp
abbrlink: URL_URI
date: 2022-05-06 23:07:56
---
## Url与URI都是啥？ ##

#### 1、URL与URI ####

* URI：统一资源标识符         

  父类        表示请求服务器资源，定位这个资源

* URL：统一资源定位符，常常被称为网址，是因特网上标准的资源地址

  子类       而URL还要表示如何访问这个资源

  通用的格式：scheme://host[:port]/path/…/?query#anchor

#### 2、组成格式： ####

```
https://www.aspxfans.com:8080/news/index.…
```

* **协议：**访问服务器以获取资源时要使用哪种协议，比如：http，https 和 FTP 等后面一定接上://

* **域名：**该URL的域名部分为“www.aspxfans.com”

* **port：**跟在域名后面的是端口，域名和端口之间使用“:”作为分隔符。

  * 端口不是一个URL必须的部分，如果省略端口部分，将采用默认端口

* （HTTP协议默认端口是80，HTTPS协议默认端口是443）；

* **虚拟目录部分**：从域名后的第一个“/”开始到最后一个“/”为止，是虚拟目录部分。虚拟目录也不是一个URL必须的部分。本例中的虚拟目录是“/news/”；

* **文件名部分**：从域名后的最后一个“/”开始到“？”为止，是文件名部分

  * 如果没有“?”,则是从域名后的最后一个“/”开始到“#”为止，是文件部分
  * 如果没有“？”和“#”，那么从域名后的最后一个“/”开始到结束，都是文件名部分。
  * 本例中的文件名是“index.asp”。文件名部分也不是一个URL必须的部分，如果省略该部分，则使用默认的文件名；

* **锚部分**：从“#”开始到最后，都是锚部分。本例的锚部分是“name”。锚部分也不是一个URL必须的部分；

* **参数部分**：从“？”开始到“#”为止之间的部分为参数部分，又称搜索部分、查询部分。

  本例中的参数部分为“boardID=5&ID=24618&page=1”。参数可以允许有多个参数，参数与参数之间用“&”作为分隔符。

#### 3、URL 编码 ####

* URL 只能使用 [ASCII 字符集](https://link.juejin.cn?target=https%3A%2F%2Fwww.w3school.com.cn%2Ftags%2Fhtml_ref_ascii.asp)来通过因特网进行发送。
* 由于 URL 常常会包含 ASCII 集合之外的字符，URL 必须转换为有效的 ASCII 格式。
* URL 编码使用 "%" 其后跟随两位的十六进制数来替换非 ASCII 字符。
* URL 不能包含空格。URL 编码通常使用 + 来替换空格。

```
天天`转换为有效的ASCII格式就是`%CC%EC%CC%EC
```