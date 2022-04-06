/*  这部分资源不是首屏渲染中重要的东西，会被推迟加载，只是美化的 */

/*  1. 卖萌标题 */
var OriginTitle = document.title;
var titleTime;
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        $('[rel="icon"]').attr('href', "/img/favicon.ico");
        document.title = '(つェ⊂) 我藏好了哦~~';
        clearTimeout(titleTime);
    } else {
        $('[rel="icon"]').attr('href', "/img/favicon.ico");
        document.title = '(*´∇｀*) 被你发现啦~~' + OriginTitle;
        titleTime = setTimeout(function() {
            document.title = OriginTitle;
        }, 2000);
    }
});




// 功能：评论样式更改
//移除FixedComment类，保持原生样式，确保不与最新评论跳转冲突
function RemoveFixedComment() {
    var activedItems = document.querySelectorAll('.fixedcomment');
    if (activedItems) {
      for (i = 0; i < activedItems.length; i++) {
        activedItems[i].classList.remove('fixedcomment');
      }
    }
  }
  //给post-comment添加fixedcomment类
  function AddFixedComment(){
    var commentBoard = document.getElementById('post-comment');
    var quitBoard = document.getElementById('quit-board');
    commentBoard.classList.add('fixedcomment');
    quitBoard.classList.add('fixedcomment');
  }
  //创建一个蒙版，作为退出键使用
  function CreateQuitBoard(){
    var quitBoard = `<div id="quit-board" onclick="RemoveFixedComment()"></div>`
    var commentBoard = document.getElementById('post-comment');
    commentBoard.insertAdjacentHTML("beforebegin",quitBoard)
  }
  
  function FixedCommentBtn(){
    //第一步，判断当前是否存在FixedComment类，存在则移除，不存在则添加
    // 获取评论区对象
    var commentBoard = document.getElementById('post-comment');
    // 若评论区存在
    if (commentBoard) {
        // 判断是否存在fixedcomment类
        if (commentBoard.className.indexOf('fixedcomment') > -1){
          // 存在则移除
          RemoveFixedComment();
        }
        else{
          // 不存在则添加
          CreateQuitBoard();
          AddFixedComment();
        }
    }
    // 若不存在评论区则跳转至留言板
    else{
      // 判断是否开启了pjax，尽量不破坏全局吸底音乐刷新
        if (pjax){
          pjax.loadUrl("/comment/#post-comment");
        }
        else{
          window.location.href = "/comment/#post-comment";
        }
    }
  }
  //切换页面先初始化一遍，确保开始时是原生状态。所以要加pjax重载。
  RemoveFixedComment();



// 统计功能
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

