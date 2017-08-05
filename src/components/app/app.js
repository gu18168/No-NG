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

var app = new Vue({
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
            // @todo 跳转添加卡片页面
            console.log('添加卡片')
        },
        addBook() {
            // @todo 跳转添加本页面
            console.log('添加单词本')
        },
        prevTo() {
            document.getElementsByClassName("ng-title-word")[0].innerHTML = '不NG';
            bus.$emit('backToAdd');
            bus.$emit('noRecite');
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

var cards = {
    data() {
        return {
            infoContent: false,
            moreContent: false,
            contentHover: true
        }
    },
    created() {
        // @todo 请求相应的单词卡
    },
    methods: {
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
        flip() {
            this.infoContent = false;
            this.moreContent = false;
            //@todo 翻转动画
            this.contentHover = !this.contentHover;
        }
    },
    template: '<div class="card-wrapper">' +
    '<div class="card-main" :class="{back: contentHover}">' +
    '<div class="card-header">' +
    '<div class="card-info" @click="showInfo">i</div>' +
    '<div class="card-more" @click="showMore">·<span>·</span>·</div>' +
    '</div>' +
    '<div class="card-content" @click="flip">' +
    '<div class="content-front">表能力的一个词缀</div>' +
    '<div class="content-back">-able</div>' +
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
    '</div>'
}

var Container = new Vue({
    el: '#main',
    components: {
        'recite': recite,
        'cards': cards
    }
})



