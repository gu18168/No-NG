function loadStyles(url) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}

(function () {
  loadStyles("src/components/header/header.css")
}())

Vue.component("ng-title", {
    props: {
        title: {
            default: '不NG'
        }
    },
    template: '<div class="ng-title"><div class="ng-title-word">{{title}}</div><div class="ng-title-line"></div></div>'
})

new Vue({
    el: '#header',
})