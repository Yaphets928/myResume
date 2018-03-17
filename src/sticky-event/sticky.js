;
(function () {
    /**
     * 初始化页面
     * @param {!Element} container
     */
    function generatePage(container) {
        // 定义各个栏目标题
        let captions = [
            '个人简介',
            '项目经历',
            '教育经历',
            '个人技能',
            '个人评价',
            '简历说明',
        ];
        // const t = container.querySelector('template');
        const toc = document.querySelector('#toc > ul');
        // t2是#toc下的template
        const t2 = toc.querySelector('template');

        // caption即currentValue，i即index
        captions.forEach(function (caption, i) {

            let h2 = container.querySelectorAll('h2')[i];
            if (h2) {
                // 更改sticky框的标题
                h2.textContent = caption;
                // 修正id（其实就是将空白符和感叹号，替换为'-'的标题）
                h2.id = normalizeTitle(caption);
            }

            // 侧边菜单部分
            // 深度复制侧边菜单节点
            const tocClone = t2.content.cloneNode(true);
            const a = tocClone.querySelector('a');
            // 设置anchor的文本标题
            a.textContent = caption;
            // 设置anchor的链接地址（替换掉一些符号）
            a.href = '#' + normalizeTitle(caption);
            // 插入到侧边菜单的父容器中去
            toc.appendChild(tocClone);
        });
    }


    const top = document.querySelector('nav').getBoundingClientRect().height;

    /**
     * @param {!Element} container #container容器
     */
    function ckeckStickyChange(container) {
        //targets是个人简历-页面说明+div
        const targets = Array.from(container.children);
        /* const targets = [].slice.call(container.children); */
        //遍历每个模块
        //定义出target的位置信息，target里需要sticky的部分
        for (let target of targets) {
            const targetInfo = target.getBoundingClientRect();
            const stickyTarget = target.querySelector('.sticky');
            const isShadow = Boolean(target.querySelector('.shadow'));
            //目标大模块上边缘y坐标：targetTop
            const targetTop = targetInfo.top;

            //目标大模块去掉stick部分的高度==>先用目标大模块下边缘的y坐标
            const targetBottom = targetInfo.bottom - stickyTarget.getBoundingClientRect().height;
            if (targetTop < top && targetBottom > top && !isShadow) {
                fire(true, stickyTarget);
                continue;
            }
            //
            if ((targetTop >= top || targetBottom <= top) && isShadow) {
                fire(false, stickyTarget);
                // continue;
            }
        }
    }


    /**
     * 对指定的目标(target)触发'sticky-change'事件
     * @param {boolean} stuck
     * @param {!Element} target Target element of event.
     */
    function fire(stuck, target) {
        // 切换阴影
        target.classList.toggle('shadow', stuck);

        // 如果为切换粘滞，更新侧边栏展开的栏目
        if (stuck) {
            //allTocsItems是classname为toc-item的元素组成的数组，遍历操作
            allTocsItems.forEach(function (el) {
                //el.firstElementChild.getAttribute('href').slice(1)  是个当前toc-item下的a的指向
                //target.firstElementChild.id 是要sticky的模块的名字
                const match = (el.firstElementChild.getAttribute('href').slice(1) === target.firstElementChild.id);
                el.classList.toggle('active', match);
            });
        }
        // 不切换成粘滞的元素向上滚动至停止粘滞，回复原位
        else {
            const targetInfo = target.getBoundingClientRect();
            if (targetInfo.top > top) {
                target.style.top = '10px';
            }
        }
    }


    /**
     * 调整现有的sticky框位置
     */
    function adjustStickyTarget() {
        const target = document.querySelector('.shadow');
        if (target) {
            const parent = target.parentElement,//subject的div
                parentInfo = parent.getBoundingClientRect(),
                parentStyle = getComputedStyle(parent),
                paddingTop = Number.parseInt(parentStyle['padding-top']),
                paddingBottom = Number.parseInt(parentStyle['padding-bottom']),
                padding = paddingTop + paddingBottom;
            // 将nav的高度和container的padding算入
            const top = paddingTop - parentInfo.top,
                bottom = parentInfo.bottom - target.getBoundingClientRect().height - padding,
                position = top > 10 ? top : 10;

            if (bottom > 0) {
                target.style.top = position + 'px';
                // 如果不需要ie9支持，选用translate3d，开启GPU渲染
                /* target.style.transform = 'translate3d(0,' + (position - 10) + 'px, 0)'; */
            }
        }
    }

    /**
     * 将空白符（空格，制表符，换行符等），替换为'-'
     * @param {string} title
     */
    function normalizeTitle(title) {
        return title.replace(/[\s]/g, '-');
    }

    /**
     * Prevent default
     * @param {Element} el
     * @param {MouseEvent} event
     */
    function scrollToHeader(el, event) {
        event.preventDefault();
        const header = document.querySelector('#' + normalizeTitle(el.textContent));

        if (header) {
            const parent = header.parentElement.parentElement;
            window.scrollTo({
                // 减去paddingTop，然后预留几个px来触发
                top: parent.offsetTop - 48,
                left: 0,
                behavior: 'smooth'
            });
        }

        // 移动端模式下关闭菜单
        if (getComputedStyle(toc).top === '60px') {
            hamburger.classList.toggle('transformed', false);
            toc.style.display = 'none';
        }

    }

    /******************
     开始执行
     ******************/
    /**
     * 1. 初始化页面
     */
    const container = document.querySelector('#container'),
        hamburger = document.querySelector('#hamburger'),
        toc = document.querySelector('#toc');
    generatePage(container);
    // 所有的侧边栏菜单项目
    const allTocsItems = Array.from(toc.querySelectorAll('.toc-item'));

    /**
     * 2. 初次检测
     */
    ckeckStickyChange(container);
    adjustStickyTarget();
    /**
     * 3. 注册事件监听器
     */

    window.addEventListener('scroll', function () {
        ckeckStickyChange(container);
        adjustStickyTarget();

    });

    window.scrollToHeader = scrollToHeader;


})();
