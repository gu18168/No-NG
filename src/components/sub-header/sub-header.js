function loadStyles(url) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}

(function () {
    loadStyles("src/components/sub-header/sub-header.css")
}())

Vue.component("ng-sub-title", {
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
})

new Vue({
    el: '#app',
})
