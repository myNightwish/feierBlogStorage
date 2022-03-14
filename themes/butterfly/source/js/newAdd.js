// 分类卡片隐藏
var card_category_list = document.getElementsByClassName(
  "card-category-list child"
);
var item = document.getElementsByClassName("card-category-list-item");
function toggle(t) {
  var display = t.parentElement.nextSibling.style.display;
  if (display == "none") {
      t.parentElement.nextSibling.style.display = "block";
      t.parentElement.nextSibling.style.height = "100%";
      t.className = t.className.replace("fa-chevron-up", "fa-chevron-down");
  } else {
      t.parentElement.nextSibling.style.display = "none";
      t.className = t.className.replace("fa-chevron-down", "fa-chevron-up");
  }
}

for (var i = 0; i < card_category_list.length; i++) {
  card_category_list[i].style.display = "none";
  card_category_list[i].style.transition = "all 1s";
  card_category_list[i].previousSibling.innerHTML +=
      '<i class="fa fa-chevron-up menus-expand  menus-closed" aria-hidden="true" style="margin-left:20px;" onclick="toggle(this)"></i>';
}

// 设置背景色
// 获取标签
// 全局背景div
var web_bg = document.getElementById("web_bg");
// 公共父级
var content_inner = document.getElementById("content-inner");
// 获取Cookies
// 透明度
var opacity = Cookies.get("opacity");
// 背景
var bg = Cookies.get("bg");
// 动画
var animation = Cookies.get("animation");
// 背景类型
var type = Cookies.get("type");
// 声明遍历 用于记录当前color
// 设置背景
if (bg) {
  web_bg.style.background = bg;
  web_bg.setAttribute("data-type", type);
  if (animation) {
    web_bg.style.animation = animation;
  }
}
function setColor(opacity) {
  // style="--light_bg_color: rgb(255, 255, 255,.3);--dark_bg_color: rgba(18,18,18,.2);"
  var light_bg_color = "--light_bg_color: rgb(255, 255, 255," + opacity + ");";
  var dark_bg_color = "--dark_bg_color: rgba(18,18,18," + opacity + ");";
  content_inner.setAttribute("style", light_bg_color + dark_bg_color);
}
setColor(opacity);

// 主页冒泡特效
// 友情链接页面 头像找不到时 替换图片
if (location.href.indexOf("link") !== -1) {
  var imgObj = document.getElementsByTagName("img");
  for (i = 0; i < imgObj.length; i++) {　　
      imgObj[i].onerror = function() { this.src = "https://cdn.jsdelivr.net/gh/tzy13755126023/BLOG_SOURCE/theme_f/friend_404.gif" }
  }
}

$(function() {
  // 气泡
  function bubble() {
      $('#page-header').circleMagic({
          radius: 10,
          density: .2,
          color: 'rgba(255,255,255,.4)',
          clearOffset: 0.99
      });
  }! function(p) {
      p.fn.circleMagic = function(t) {
          var o, a, n, r, e = !0,
              i = [],
              d = p.extend({ color: "rgba(255,0,0,.5)", radius: 10, density: .3, clearOffset: .2 }, t),
              l = this[0];

          function c() { e = !(document.body.scrollTop > a) }

          function s() { o = l.clientWidth, a = l.clientHeight, l.height = a + "px", n.width = o, n.height = a }

          function h() {
              if (e)
                  for (var t in r.clearRect(0, 0, o, a), i) i[t].draw();
              requestAnimationFrame(h)
          }

          function f() {
              var t = this;

              function e() { t.pos.x = Math.random() * o, t.pos.y = a + 100 * Math.random(), t.alpha = .1 + Math.random() * d.clearOffset, t.scale = .1 + .3 * Math.random(), t.speed = Math.random(), "random" === d.color ? t.color = "rgba(" + Math.floor(255 * Math.random()) + ", " + Math.floor(0 * Math.random()) + ", " + Math.floor(0 * Math.random()) + ", " + Math.random().toPrecision(2) + ")" : t.color = d.color }
              t.pos = {}, e(), this.draw = function() { t.alpha <= 0 && e(), t.pos.y -= t.speed, t.alpha -= 5e-4, r.beginPath(), r.arc(t.pos.x, t.pos.y, t.scale * d.radius, 0, 2 * Math.PI, !1), r.fillStyle = t.color, r.fill(), r.closePath() }
          }! function() {
              o = l.offsetWidth, a = l.offsetHeight,
                  function() {
                      var t = document.createElement("canvas");
                      t.id = "canvas", t.style.top = 0, t.style.zIndex = 0, t.style.position = "absolute", l.appendChild(t), t.parentElement.style.overflow = "hidden"
                  }(), (n = document.getElementById("canvas")).width = o, n.height = a, r = n.getContext("2d");
              for (var t = 0; t < o * d.density; t++) {
                  var e = new f;
                  i.push(e)
              }
              h()
          }(), window.addEventListener("scroll", c, !1), window.addEventListener("resize", s, !1)
      }
  }(jQuery);
  // 调用气泡方法
  bubble();
})

// 统计
function switchPostChart () {
    // 这里为了统一颜色选取的是“明暗模式”下的两种字体颜色，也可以自己定义
    let color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : 'rgba(255,255,255,0.7)'
    if (document.getElementById('posts-chart')) {
      let postsOptionNew = postsOption
      postsOptionNew.textStyle.color = color
      postsOptionNew.title.textStyle.color = color
      postsOptionNew.xAxis.axisLine.lineStyle.color = color
      postsOptionNew.yAxis.axisLine.lineStyle.color = color
      postsChart.setOption(postsOptionNew)
    }
    if (document.getElementById('tags-chart')) {
      let tagsOptionNew = tagsOption
      tagsOptionNew.textStyle.color = color
      tagsOptionNew.title.textStyle.color = color
      tagsOptionNew.xAxis.axisLine.lineStyle.color = color
      tagsOptionNew.yAxis.axisLine.lineStyle.color = color
      tagsChart.setOption(tagsOptionNew)
    }
    if (document.getElementById('categories-chart')) {
      let categoriesOptionNew = categoriesOption
      categoriesOptionNew.textStyle.color = color
      categoriesOptionNew.title.textStyle.color = color
      categoriesOptionNew.legend.textStyle.color = color
      categoriesChart.setOption(categoriesOptionNew)
    }
  }
document.getElementById("mode-button").addEventListener("click", function () { setTimeout(switchPostChart, 100) })


function switchVisitChart () {
  // 这里为了统一颜色选取的是“明暗模式”下的两种字体颜色，也可以自己定义
  let color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : 'rgba(255,255,255,0.7)'
  if (document.getElementById('map-chart')) {
    let mapOptionNew = mapOption
    mapOptionNew.title.textStyle.color = color
    mapOptionNew.visualMap.textStyle.color = color
    mapChart.setOption(mapOptionNew)
  }
  if (document.getElementById('trends-chart')) {
    let trendsOptionNew = trendsOption
    trendsOptionNew.title.textStyle.color = color
    trendsOptionNew.xAxis.axisLine.lineStyle.color = color
    trendsOptionNew.yAxis.axisLine.lineStyle.color = color
    trendsOptionNew.textStyle.color = color
    trendsChart.setOption(trendsOptionNew)
  }
  if (document.getElementById('sources-chart')) {
    let sourcesOptionNew = sourcesOption
    sourcesOptionNew.title.textStyle.color = color
    sourcesOptionNew.legend.textStyle.color = color
    sourcesOptionNew.textStyle.color = color
    sourcesChart.setOption(sourcesOptionNew)
  }
}
document.getElementById("mode-button").addEventListener("click", function () { setTimeout(switchVisitChart, 100) })
