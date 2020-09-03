window.onload = function () {
    let jdShop = new JdShop();
    // 1.顶部搜索
    jdShop.search();
    // 2.轮播图
    jdShop.jdBanner();
    // 3.倒计时
    jdShop.downTime();
}
class JdShop {
    constructor () {
        // 搜索框
        this.searchBox = document.querySelector('.jd_search_box');
        // 轮播图
        this.banner = document.querySelector('.jd_banner');
        // 轮播图高度（滚动高度界限）
        this.height = this.banner.offsetHeight;
        // 屏幕宽度
        this.width = this.banner.offsetWidth;
        // 图片容器
        this.imageBox = this.banner.querySelector('ul:first-child');
        // 点容器
        this.pointBox = this.banner.querySelector('ul:last-Child');
        // 所有的点
        this.points = this.pointBox.querySelectorAll('li');
        /*2.倒数计时  假设 3小时*/
        this.time = 3 * 60 * 60;
        // 时间span
        this.spans = document.querySelectorAll('.time span');
    }
    // 搜索框
    search () {
        // 1.默认固定顶部透明背景
        let that = this;
        // 监听页面滚动事件
        window.onscroll = function () {
            // console.log(document.body.scrollTop);
            // console.log(document.documentElement.scrollTop);
            // console.log(window.pageYOffset);
            let scrollTop = document.body.scrollTop;
            // console.log(scrollTop);
            // 默认的透明度
            let opacity = 0;
            if (scrollTop < this.height) {
                // 2.当页面滚动的时候---随着页面卷曲的高度大
                // 透明度变大
                opacity = scrollTop / this.height * 0.85;
                // console.log(opacity);
            } else {
                // 3.当页面滚动的时候---超过某一个高度的时候透明度
                // 固定不变
                opacity = 0.85;
            }
            that.searchBox.style.background = `rgba(201,21,35,${opacity})`;
        }
    }
    // 轮播图
    jdBanner () {
        // 1.自动轮播图且无缝   定时器，过渡
        // 2.点要随着图片的轮播改变 根据索引切换
        // 3.滑动效果   利用touch事件完成
        // 4.滑动结束的时候     如果滑动的距离不超过屏幕的1/3
        // 吸附回去    过渡
        // 5.滑动结束的时候     如果滑动的距离超过屏幕的1/3 切换
        // （上一张，下一张）根据滑动的方向，过渡
        
        // 轮播图
        // 程序的核心   index
        let that = this;
        let index = 1;
        let timer = setInterval(() => {
            index++;
            // 加过渡
            this.addTransition();
            // 做位移
            this.setTranslateX(-index * this.width);
        },1000);
        // 需要等最后一张动画结束去判断 是否瞬间定位第一张
        this.imageBox.addEventListener('transitionend',() => {
            // 自动无缝滚动
            if(index >= 9) {
                index = 1;
                // 瞬间定位
                // 清过渡
                this.removeTransition();
                // 做位移
                this.setTranslateX(-index * this.width);
            }
            // 滑动的时候也需要无缝
            else if (index <= 0) {
                index = 8;
                // 瞬间定位
                // 清过渡
                this.removeTransition();
                // 做位移
                this.setTranslateX(-index * this.width);
            }
            // 根据索引设置点
            // 此时此刻 index的取值范围 1-8（0,8--1,9）
            // 点索引   index -1
            setPoint();
        });
        // 点过渡
        let setPoint =  () => {
            /*index 1-8*/
            /*清除样式*/
            for (let i = 0; i < this.points.length; i++) {
                let obj = this.points[i];
                obj.classList.remove('now');
            }
            // 给对应的加上样式
            this.points[index - 1].classList.add('now');
        }

        // 绑定事件
        let startX = 0;
        let distanceX = 0;
        let isMove = false;
        this.imageBox.addEventListener('touchstart',function (e) {
            // 清除定时器
            clearInterval(timer);
            /*记录起始位置的X坐标*/
            startX = e.touches[0].clientX;
        });
        this.imageBox.addEventListener('touchmove',e => {
            // 记录滑动过程中的X坐标
            let moveX = e.touches[0].clientX;
            // 计算位移 有正负方向
            distanceX = moveX - startX;
            // 计算目标元素的位移   不管正负
            // 元素将要的定位=当前定位+手指移动的距离
            let translateX = -index * this.width + distanceX;
            // 滑动---》元素随着手指的滑动做位置的改变
            this.removeTransition();
            this.setTranslateX(translateX);
            isMove = true;
        });
        this.imageBox.addEventListener('touchend',e => {
            /*4.  5.  实现*/
            /*要使用移动的距离*/
            if (isMove) {
                if (Math.abs(distanceX) < this.width / 3) {
                    // 吸附
                    this.addTransition();
                    this.setTranslateX(-index * this.width);
                } else {
                    // 切换
                    // 右滑动   上一张
                    if (distanceX > 0) {
                        index--;
                    }
                    // 左滑动   下一张
                    else {
                        index++;
                    }
                    // 根据index去动画的移动
                    this.addTransition();
                    this.setTranslateX(-index * this.width);
                }
            }
            // 最好做一次参数的重置
            startX = 0;
            distanceX = 0;
            isMove = false;
            // 加上定时器
            clearInterval(timer);
            timer = setInterval(() => {
                index++;
                // 加过渡
                this.addTransition();
                // 做位移
                this.setTranslateX(-index * this.width);
            },1000); 
        });
    }
    // 添加过渡
    addTransition () {
        this.imageBox.style.transition = 'all 0.2s';
        this.imageBox.style.webkitTransition = 'all 0.2';
    }
    // 删除过渡
    removeTransition () {
        this.imageBox.style.transition = 'none';
        this.imageBox.style.webkitTransition = 'none';
    }
    // 过渡效果
    setTranslateX (translateX) {
        this.imageBox.style.transform = `translateX(${translateX}px)`;
        this.imageBox.style.webkitTransform = `translateX(${translateX}px)`;
    }
    // 倒计时功能模块
    downTime () {
        // 1.每一秒改变当前的时间
        // 2.倒计时 假设   4小时
        let timer = setInterval(() => {
            this.time--;
            // 格式化   给不同的元素html内容
            let h = Math.floor(this.time / 3600);
            let m = Math.floor(this.time % 3600 / 60);
            let s = Math.floor(this.time % 60);

            this.spans[0].innerHTML = Math.floor(h/10);
            this.spans[1].innerHTML = h%10;
            this.spans[3].innerHTML = Math.floor(m/10);
            this.spans[4].innerHTML = m%10;
            this.spans[6].innerHTML = Math.floor(s/10);
            this.spans[7].innerHTML = s%10;

            if(this.time <= 0) {
                clearInterval(timer);
            }

        },1000)
    }

}


