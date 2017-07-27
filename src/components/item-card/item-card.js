function loadStyles(url) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}

(function () {
    loadStyles("src/components/item-card/item-card.css")
}())

Vue.component("item-card", {
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
            // @todo 相应的网页跳转
            console.log(this.title)
        }
    },
    template: '<div class="item-card">' +
    '<div class="item-card-left">' +
        '<div class="item-card-title">{{title}}</div>' +
        '<div class="item-card-tip">{{tip}}</div>' +
    '</div>' +
    '<div class="item-card-right" @click="start">背</div>' +
    '</div>'
})

new Vue({
    el: '#app',
})