function loadStyles(url) {
    let link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}

(function () {
    loadStyles("src/components/app/app.css")
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
            let recite = document.getElementById("recite");
            recite.style.display= 'block';
            setTimeout(function () {
                recite.style.opacity = 1;
            }, 20);
            bus.$emit('recite');
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
        bus.$on('recite', () => {
            this.add = false;
            this.re = true;
        });

        bus.$on('noRecite', () => {
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
            let recite = document.getElementById("recite");
            recite.style.opacity = 0;
            setTimeout(function () {
                recite.style.display = "none"
            }, 800);
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

var fab = new Vue({
    el: '#fab',
    components: {
        'fab': fab
    }
})

