function loadStyles(url) {
    let link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}

(function () {
    loadStyles("src/components/recite/recite.css")
}());

var cards = {
    data() {
        return {
            infoContent: false,
            moreContent: false,
            contentHover: true
        }
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

var recite = new Vue({
    el: '#recite',
    components: {
        'cards': cards
    }
})