;
(function () {
    function inView() {
        if (pictures.length) {
            requestAnimationFrame(function () {//每次重新绘制动画时调用
                //windowTop滾動條到页面頂部的距離。。怎麽變成繁體字了 ctrl+shift+f快捷键冲突 :)
                //windowBottom是滚动条底部到页面顶部的距离
                let windowTop = window.pageYOffset,
                    windowBottom = windowTop + window.innerHeight;
                let imageInfo,
                    pictureTop,
                    pictureBottom;

                // 检查pictures数组里每幅图片
                for (var i = 0; i < pictures.length; i++) {
                    imageInfo = pictures[i].getBoundingClientRect();
                    //pictureTop是滚动条上面的距离+当前页面到图片顶的距离 即图片顶部 到页面顶部的距离
                    //pictureBottom是元素底部到页面顶部的距离
                    pictureTop = windowTop + imageInfo.top;
                    pictureBottom = pictureTop + imageInfo.height;
                    //图片在视窗内  滚动条顶部的坐标在图片底部的坐标  上面 即为下边界进入视窗
                    //滚动条底部坐标>图片顶坐标 即为上边界进入视窗
                    if (windowTop < pictureBottom && windowBottom > pictureTop) {
                        loadFullImage(pictures[i]);
                    }
                }

                // 更新需要恢复的照片（放止infinite load加载更多）
                pictures = [].slice.call(document.querySelectorAll('.progressive .preview'));

            });
        }
    }

    /**
     * 恢复指定图片
     * item图片元素
     */
    function loadFullImage(item) {
        //data-actual存放的是图片真实路径
        let href = item && item.getAttribute('data-actual');
        if (!href) return;
        // 预加载，放入缓存
        let img = new Image();
        img.src = href;
        img.onload = function () {
            // 从缓存中去读取
            requestAnimationFrame(function () {
                item.src = href;
                item.classList.add('reveal');
            });
        }
    }

    /**
     * 每0.5s执行一次
     */
    function throttledLoad() {
        throttler = throttler || setTimeout(function () {
                                        throttler = null;
                                        inView();
                                    }, 500)
    }


    let pictures = [].slice.call(document.querySelectorAll('.progressive .preview'));
    let throttler = null;

    // 初始检查
    inView();

    window.addEventListener('scroll', throttledLoad, false);
    window.addEventListener('resize', throttledLoad, false);

})();