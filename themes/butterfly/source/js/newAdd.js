// 同样是首页内容，次高优加载

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


// canvas加载旋转小人



