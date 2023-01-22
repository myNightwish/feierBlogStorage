// 如果当前页有评论就执行函数
if (document.getElementById('post-comment')) owoBig();
// 表情放大
function owoBig() {
    let flag = 1, // 设置节流阀
        owo_time = '', // 设置计时器
        m = 3; // 设置放大倍数
    // 创建盒子
    let div = document.createElement('div'),
        body = document.querySelector('body');
    // 设置ID
    div.id = 'owo-big';
    // 插入盒子
    body.appendChild(div)

    // 构造observer
    let observer = new MutationObserver(mutations => {

        for (let i = 0; i < mutations.length; i++) {
            let dom = mutations[i].addedNodes,
                owo_body = '';
            if (dom.length == 2 && dom[1].className == 'OwO-body') owo_body = dom[1];
            // 如果需要在评论内容中启用此功能请解除下面的注释
            else if (dom.length == 1 && dom[0].className == 'tk-comment') owo_body = dom[0];
            else continue;
            
            // 禁用右键（手机端长按会出现右键菜单，为了体验给禁用掉）
            if (document.body.clientWidth <= 768) owo_body.addEventListener('contextmenu', e => e.preventDefault());
            // 鼠标移入
            owo_body.onmouseover = (e) => {
                    if (flag && e.target.tagName == 'IMG') {
                        flag = 0;
                        // 移入300毫秒后显示盒子
                        owo_time = setTimeout(() => {
                            let height = e.path[0].clientHeight * m, // 盒子高
                                width = e.path[0].clientWidth * m, // 盒子宽
                                left = (e.x - e.offsetX) - (width - e.path[0].clientWidth) / 2, // 盒子与屏幕左边距离
                                top = e.y - e.offsetY; // 盒子与屏幕顶部距离

                            if ((left + width) > body.clientWidth) left -= ((left + width) - body.clientWidth + 10); // 右边缘检测，防止超出屏幕
                            if (left < 0) left = 10; // 左边缘检测，防止超出屏幕
                            // 设置盒子样式
                            div.style.cssText = `display:flex; height:${height}px; width:${width}px; left:${left}px; top:${top}px;`;
                            // 在盒子中插入图片
                            div.innerHTML = `<img src="${e.target.src}">`
                        }, 300);
                    }
                };
            // 鼠标移出隐藏盒子
            owo_body.onmouseout = () => { div.style.display = 'none', flag = 1, clearTimeout(owo_time); }
        }

    })
    observer.observe(document.getElementById('post-comment'), { subtree: true, childList: true }) // 监听的 元素 和 配置项
}


// 点击直达评论区
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
  
  // 功能：评论样式更改
  // 移除FixedComment类，保持原生样式，确保不与最新评论跳转冲突
  function RemoveFixedComment() {
    var activedItems = document.querySelectorAll('.fixedcomment');
  
    if (activedItems) {
      for (i = 0; i < activedItems.length; i++) {
        activedItems[i].classList.remove('fixedcomment');
      }
    }
  }
  
  
  //切换页面先初始化一遍，确保开始时是原生状态。所以要加pjax重载。
  RemoveFixedComment();