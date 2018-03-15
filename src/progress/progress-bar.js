;
(function () {
  let progressBody = document.querySelector('.with-progress');
  // 浏览器可视窗口的高度
  let triggerHeight = window.innerHeight;
  function checkProgressBody() {
    //元素底部 到目前窗口的顶部的距离
    let bottom = progressBody.getBoundingClientRect().bottom;
    if (bottom < triggerHeight && !progressBody.classList.contains('progress-active')) {
      progressBody.classList.add('progress-active');
      window.removeEventListener('scroll', checkProgressBody, false)
    }

  }

  window.addEventListener('scroll', checkProgressBody, false);
})();