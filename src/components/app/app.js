function loadStyles(url) {
    let link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}

(function () {
    loadStyles("src/components/app/app.css")
    loadStyles("src/components/recite/recite.css")
}());

var bus = new Vue()

var item = {
    props: {
        title: {
            default: '小标题'
        },
        tip: {
            default: '提示'
        }
    },
    methods: {
        start() {
            // @todo 相应页面覆盖
            document.getElementsByClassName("ng-title-word")[0].innerHTML = this.title;
            bus.$emit('recite');
            bus.$emit('addToBack');
        }
    },
    template: '<div class="item-card">' +
    '<div class="item-card-left">' +
    '<div class="item-card-title">{{title}}</div>' +
    '<div class="item-card-tip">{{tip}}</div>' +
    '</div>' +
    '<div class="item-card-right" @click="start">背</div>' +
    '</div>'
}

var subHeader = {
    props: {
        title: {
            default: ''
        },
        more: {
            default: false
        }
    },
    methods: {
        moreCard() {
            // @todo 所有卡片页面跳转
            console.log('更多卡片')
        }
    },
    template: '<div class="ng-sub-title">' +
    '<div class="ng-sub-title-word">{{title}}</div>' +
    '<div class="ng-sub-title-more" v-if="more" @click="moreCard">全部</div>' +
    '</div>'
}

var App = new Vue({
    el: '#app',
    components: {
        'item-card': item,
        'ng-sub-header': subHeader
    }
})

var fab = {
    data() {
        return {
            isShadow: false,
            isActive: false,
            add: true,
            re: false
        }
    },
    mounted() {
        bus.$on('addToBack', () => {
            this.add = false;
            this.re = true;
        });

        bus.$on('backToAdd', () => {
            this.add = true;
            this.re = false;
        })
    },
    methods: {
        addToggle() {
            this.isShadow = !this.isShadow;
            this.isActive = !this.isActive;
        },
        addCancel() {
            this.isShadow = false;
            this.isActive = false;
        },
        addCard() {
            document.getElementsByClassName("ng-title-word")[0].innerHTML = '添加卡片';
            bus.$emit('addCard');
            bus.$emit('addToBack');
        },
        addBook() {
            // @todo 跳转添加本页面
            console.log('添加单词本')
        },
        prevTo() {
            document.getElementsByClassName("ng-title-word")[0].innerHTML = '不NG';
            bus.$emit('backToAdd');
            bus.$emit('noRecite');
            bus.$emit('noAddCard');
        }
    },
    template: '<div class="fab">' +
    '<div class="fab-btn" :class="{active: isActive}" v-if="add" @click="addToggle">+</div>' +
    '<div class="fab-btn" v-if="re" @click="prevTo"><</div>' +
    '<transition name="fade"><div class="shadow" v-if="isShadow" @click="addCancel">' +
    '<div class="fab-add fab-add-card" @click="addCard">' +
    '单词卡' +
    '</div>' +
    '<div class="fab-add fab-add-book" @click="addBook">' +
    '单词本' +
    '</div>' +
    '</div></transition>' +
    '</div>'
}

var Fab = new Vue({
    el: '#fab',
    components: {
        'fab': fab
    }
})

var recite = {
    data() {
        return {
            toRecite: false
        }
    },
    mounted() {
        bus.$on('recite', () => {
            this.toRecite = true;
        });

        bus.$on('noRecite', ()=> {
            this.toRecite = false;
        })
    },
    template: '<transition name="fade"><div id="recite" v-if="toRecite">' +
    '<slot></slot>' +
    '</div></transition>'
}

var slide= {
    props: {
        sliderinit: {
            default: {}
        }
    },
    data() {
        return {
            basicdata: {
                posWidth: '0',
                posheight: '0',
                start: {},
                end: {},
                tracking: false,
                animation: false,
                containerClass: {
                    'swiper-container-vertical': false
                },
                transitionEnding: false
            },
            currentWidth: 0,
            infoContent: false,
            moreContent: false,
            pages: [
                {
                    'en': "-able",
                    'zh': "表能力的词缀"
                },
                {
                    'en': "-ion",
                    'zh': "名词词缀"
                },
                {
                    'en': "sign-",
                    'zh': "表信号"
                }
            ],
            pageper(index) {
                let style = {};
                style['width'] = (index+1) * 100 / this.pages.length + '%';
                return style;
            }
        }
    },
    computed: {
        styleobj() {
            let style = {};
            style['transform'] = 'translate3D(' + this.basicdata.posWidth + ',' + this.basicdata.posheight + ',0)';
            style['transition-timing-function'] = 'ease';
            style['transition-duration'] = (this.basicdata.animation ? this.sliderinit.slideSpeed || 300 : 0) + 'ms'
            return style;
        },
        pagenums() {
            return this.pages.length;
        }
    },
    created() {
        // @todo 从数据库获取数据至pages
    },
    mounted() {
        let that = this;
        that.slide(0, 'animationnone');
    },
    methods: {
        swipeStart(e) {
            let that = this;
            if (this.basicdata.transitionEnding) {
                return
            }
            this.basicdata.animation = false;
            document.addEventListener('touchmove', that.preventDefault(e))
            if (e.type === 'touchstart') {
                if (e.touches.length > 1) {
                    this.basicdata.tracking = false;
                    return;
                } else {
                    this.basicdata.tracking = true;
                    this.basicdata.start.t = new Date().getTime();
                    this.basicdata.start.x = e.targetTouches[0].clientX;
                    this.basicdata.start.y = e.targetTouches[0].clientY;
                    this.basicdata.end.x = e.targetTouches[0].clientX;
                    this.basicdata.end.y = e.targetTouches[0].clientY;
                }
            } else {
                this.basicdata.tracking = true;
                this.basicdata.start.t = new Date().getTime();
                this.basicdata.start.x = e.clientX;
                this.basicdata.start.y = e.clientY;
                this.basicdata.end.x = e.clientX;
                this.basicdata.end.y = e.clientY;
            }
        },
        swipeMove(e) {
            if (this.basicdata.tracking) {
                if (e.type === 'touchmove') {
                    e.preventDefault();
                    this.basicdata.end.x = e.targetTouches[0].clientX;
                    this.basicdata.end.y = e.targetTouches[0].clientY;
                } else {
                    e.preventDefault();
                    this.basicdata.end.x = e.clientX;
                    this.basicdata.end.y = e.clientY;
                }
                this.basicdata.posWidth = -(this.currentWidth) + this.basicdata.end.x - this.basicdata.start.x + 'px';
            }
        },
        swipeEnd(e) {
            this.basicdata.tracking = false;
            let now = new Date().getTime();
            let deltaTime = now - this.basicdata.start.t;
            let deltaX = this.basicdata.end.x - this.basicdata.start.x;
            let deltaY = this.basicdata.end.y - this.basicdata.start.y;
            document.removeEventListener('touchmove', this.preventDefault(e));
            if (deltaTime > this.sliderinit.thresholdTime) {
                this.slide(this.sliderinit.currentPage);
            } else {
                if ((deltaX > this.sliderinit.thresholdDistance) && (Math.abs(deltaY) < this.sliderinit.thresholdDistance)) {
                    this.pre();
                    return;
                } else if ((-deltaX > this.sliderinit.thresholdDistance) && (Math.abs(deltaY) < this.sliderinit.thresholdDistance)) {
                    this.next();
                    return;
                } else {
                    this.slide(this.sliderinit.currentPage);
                    return;
                }
            }
        },
        pre() {
            if (this.sliderinit.currentPage >= 1) {
                this.sliderinit.currentPage -=  1;
                this.slide();
            } else {
                this.slide();
            }
        },
        next() {
            if (this.sliderinit.currentPage < this.pagenums - 1) {
                this.sliderinit.currentPage += 1;
                this.slide();
            } else {
                // @todo 到底请求下10个
                this.slide();
            }
        },
        slide(pagenum, type) {
            let that = this;
            that.basicdata.animation = true;
            if (type === 'animationnone') {
                that.basicdata.animation = false;
            }
            if (pagenum || pagenum === 0) {
                that.sliderinit.currentPage = pagenum;
            }

            let $sliderChildren = document.getElementsByClassName('slider-item');
            let offsetLeft = $sliderChildren[that.sliderinit.currentPage].offsetLeft;
            that.currentWidth = offsetLeft;
            that.basicdata.posWidth = -that.currentWidth + 'px';

            if (that.sliderinit.currentPage < 0 || that.sliderinit.currentPage >= that.pagenums) {
                return;
            }
        },
        preventDefault(e) {
            e.preventDefault();
        },
        showInfo() {
            this.infoContent = true;
        },
        hideInfo() {
            this.infoContent = false;
        },
        showMore() {
            this.moreContent = true;
        },
        hideMore() {
            this.moreContent = false;
        },
        flip(index) {
            this.infoContent = false;
            this.moreContent = false;
            //@todo 翻转动画
            let card = document.getElementsByClassName('card-main')[index];
            if (card.className.match(new RegExp('(\\s|^)' + 'back' + '(\\s|$)'))) {
                let reg = new RegExp('(\\s|^)' + 'back' + '(\\s|$)');
                card.className = card.className.replace(reg, '');
            } else {
                card.className += " back";
            }
        }
    },
    template: '<div class="slider-container" :class="basicdata.containerClass">' +
    '<div class="slider-pagination">' +
    '<ins :style="pageper(sliderinit.currentPage)"></ins>' +
    '</div>' +
    '<div class="slider-wrapper" :style="styleobj"' +
        '@touchmove="swipeMove" @touchstart="swipeStart" @touchend="swipeEnd" ' +
        '@mousedown="swipeStart" @mouseup="swipeEnd" @mousemove="swipeMove">' +
        '<div class="slider-item" :style="item.style" v-for="(item,index) in pages">' +
            '<div class="card-wrapper">' +
            '<div class="card-main">' +
            '<div class="card-header">' +
            '<div class="card-info" @click="showInfo">i</div>' +
            '<div class="card-more" @click="showMore">·<span>·</span>·</div>' +
            '</div>' +
            '<div class="card-content" @click="flip(index)">' +
            '<div class="content-front">{{item.en}}</div>' +
            '<div class="content-back">{{item.zh}}</div>' +
            '</div>' +
            '<transition name="slide-right"><div class="card-info-content btn-content" v-if="infoContent" @click="hideInfo">' +
            '<p class="icon-swap_vert"> 点击翻转</p>' +
            '<p class="icon-swap_horiz"> 左右滑动</p>' +
            '</div></transition>' +
            '<transition name="slide-left"><div class="card-more-content btn-content" v-if="moreContent" @click="hideMore">' +
            '<p class="icon-quill"> 编辑</p>' +
            '<p class="icon-bin2"> 删除</p>' +
            '</div></transition>' +
            '</div>' +
            '<div class="line c-line"></div>' +
            '<div class="line d-line"></div>' +
            '<div class="card-tags">' +
            '<ul>' +
            '<li class="card-tag tag-blue">词缀</li>' +
            '<li class="card-tag">词缀</li>' +
            '<li class="card-tag tag-red">词缀</li>' +
            '<li class="card-tag tag-green">词缀</li>' +
            '<li class="card-tag tag-yellow">词缀</li>' +
            '<li class="card-tag tag-black">词缀</li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
        '</div>' +
        '<div class="card-another">再来一打<</div>' +
    '</div>' +
    '</div>'
}

var Main = new Vue({
    el: '#main',
    components: {
        'recite': recite,
        'slider': slide
    }
})

var addCard = {
    data() {
        return {
            toAddCard: false,
            isSelectBook: false,
            isSelectTag: false,
        }
    },
    mounted() {
        bus.$on('addCard', () => {
            this.toAddCard = true;
        });

        bus.$on('noAddCard', ()=> {
            this.toAddCard = false;
        })
    },
    methods: {
        selectBook() {
            this.isSelectBook = true;
            //@todo 请求已有的单词本数据
        },
        selectTag() {
            this.isSelectTag = true;
            //@todo 请求热门标签数据
        },
        cancel() {
            this.isSelectBook = false;
            this.isSelectTag = false;
        }
    },
    template: '<transition name="fade"><div id="addCard" v-if="toAddCard">' +
    '<div class="addCard-container" :class="{hide: isSelectBook || isSelectTag}">' +
        '<form>' +
            '<input placeholder="English">' +
            '<input placeholder="Chinese">' +
            '<label @click="selectBook">选择收纳的单词本 ></label>' +
            '<label @click="selectTag">添加标签 ></label>' +
            '<button type="submit">创建 ></button>' +
        '</form>' +
    '</div>' +
    '<transition name="slide-into"><div class="select-container" v-if="isSelectBook">' +
        '<form>' +
            '<label @click="cancel">取消</label>' +
        '</form>' +
    '</div></transition>' +
    '<transition name="slide-into"><div class="select-container" v-if="isSelectTag">' +
        '<form>' +
            '<label @click="cancel">取消</label>' +
        '</form>' +
    '</div></transition>' +
    '</div></transition>'
}

var addBook = {}

var Set = new Vue({
    el: '#set',
    components: {
        'add-card': addCard,
        'add-book': addBook
    }
})



