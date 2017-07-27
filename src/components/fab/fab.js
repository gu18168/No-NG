function loadStyles(url) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}

(function () {
    loadStyles("src/components/fab/fab.css")
}())

Vue.component("fab", {
    props: {
        add: {
            default: true
        },
        re: {
            default: false
        }

    },
    data() {
        return {
            isShadow: false,
            isActive: false
        }
    },
    methods: {
        shadow() {
            this.isShadow = !this.isShadow;
            this.isActive = !this.isActive;
        },
        cancel() {
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
        }
    },
    template: '<div class="fab">' +
    '<div class="fab-btn" :class="{active: isActive}" v-if="add" @click="shadow">+</div>' +
    '<div class="fab-btn" v-if="re">←</div>' +
    '<transition name="fade"><div class="shadow" v-if="isShadow" @click="cancel">' +
        '<div class="fab-add fab-add-card" @click="addCard">' +
            '单词卡' +
        '</div>' +
        '<div class="fab-add fab-add-book" @click="addBook">' +
            '单词本' +
        '</div>' +
    '</div></transition>' +
    '</div>'
})

new Vue({
    el: '#fab',
})