function loadStyles(url) {
    let link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}

function addURLParam(url, name, value) {
    url += (url.indexOf("?") == -1 ? "?" : "&");
    url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
    return url;
}

(function () {
    loadStyles("src/components/app/app.css")
    loadStyles("src/components/recite/recite.css")
}());

var bus = new Vue()
var books = []

var item = {
    props: {
        title: {
            default: '小标题'
        },
        type: {
            default: 'card'
        }
    },
    data() {
        return {
            tip: "卡片量: ",
        }
    },
    created() {
        if (this.type == "card") {
            let that = this;
            let xmlHttp = new XMLHttpRequest();
            let url = "http://101.200.60.114:8765/sum";
            url = addURLParam(url, "book", this.title);
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4) {
                    if ((xmlHttp.status == 200) || xmlHttp.status == 304) {
                        let temp = eval("(" + xmlHttp.responseText +")")
                        that.tip += temp.res + "张";
                    } else {
                        that.tip += "未知错误";
                    }
                }
            }
            xmlHttp.open("GET", url, true);
            xmlHttp.send(null);
        } else {
            this.tip = "创建时间: 2017/8/15"
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
    data() {
      return {
          books: []
      }
    },
    created() {
        let that = this;
        let xmlHttp = new XMLHttpRequest();
        let url = "http://101.200.60.114:8765/getbook";
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4) {
                if ((xmlHttp.status == 200) || xmlHttp.status == 304) {
                    let temp = eval("(" + xmlHttp.responseText +")")
                    for(let i = 0; i < temp.res.length; i++) {
                        that.books.push(temp.res[i].name);
                        books.push(temp.res[i].name);
                    }
                } else {
                    that.books = ["请刷新重试", "服务器出了点小问题"];
                }
            }
        }
        xmlHttp.open("GET", url, true);
        xmlHttp.send(null);
    },
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
            document.getElementById("app").style.opacity = "0";
            setTimeout(function () {
                document.getElementById("app").style.display = "none";
                bus.$emit('addCard');
            }, 300);
            bus.$emit('addToBack');
        },
        addBook() {
            document.getElementsByClassName("ng-title-word")[0].innerHTML = '添加单词本';
            document.getElementById("app").style.opacity = "0";
            setTimeout(function () {
                document.getElementById("app").style.display = "none";
                bus.$emit('addBook');
            }, 300);
            bus.$emit('addToBack');
        },
        prevTo() {
            document.getElementsByClassName("ng-title-word")[0].innerHTML = '不NG';
            setTimeout(function () {
                document.getElementById("app").style.display = "block";
            }, 350);
            setTimeout(function () {
                document.getElementById("app").style.opacity = "1";
            }, 400);
            bus.$emit('backToAdd');
            bus.$emit('noRecite');
            bus.$emit('noAddCard');
            bus.$emit('noAddBook');
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
            bookName: "",
            currentWidth: 0,
            selectedIndex: 0,
            infoContent: false,
            moreContent: false,
            pages: [
                {
                    'en': "loading",
                    'zh': "加载中"
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
        let title = document.getElementsByClassName("ng-title-word")[0].innerHTML

        let that = this;
        let xmlHttp = new XMLHttpRequest();
        let url = "http://101.200.60.114:8765/get";
        url = addURLParam(url, "book", title);
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4) {
                if ((xmlHttp.status == 200) || xmlHttp.status == 304) {
                    let temp = eval("(" + xmlHttp.responseText +")")
                    if (temp.res.length) {
                        that.pages = temp.res;
                    } else {
                        that.pages = [
                            {
                                'en': "nothing",
                                'zh': "没有单词卡"
                            }
                        ]
                    }
                } else {
                    that.pages = [
                        {
                            'en': "error",
                            'zh': "抱歉，服务器出了点小问题"
                        }
                    ]
                }
            }
        }
        xmlHttp.open("GET", url, true);
        xmlHttp.send(null);
    },
    mounted() {
        let that = this;
        that.slide(0, 'animationnone');
    },
    methods: {
        swipeStart(e) {
            let that = this;
            that.hideAll();
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
                } else if (Math.abs(deltaX) < 5) {
                    this.flip();
                } else {
                    this.slide(this.sliderinit.currentPage);
                    return;
                }
            }
        },
        pre() {
            if (this.sliderinit.currentPage >= 1) {
                this.sliderinit.currentPage -=  1;
                this.selectedIndex -= 1;
                this.slide();
            } else {
                this.slide();
            }
        },
        next() {
            if (this.sliderinit.currentPage < this.pagenums - 1) {
                this.sliderinit.currentPage += 1;
                this.selectedIndex += 1;
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
        hideAll() {
            this.infoContent = false;
            this.moreContent = false;
        },
        flip() {
            this.hideAll();
            let card = document.getElementsByClassName('card-main')[this.selectedIndex];
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
    '<div class="slider-wrapper" :style="styleobj">' +
        '<div class="slider-item" :style="item.style" v-for="(item,index) in pages">' +
            '<div class="card-wrapper">' +
            '<div class="card-main">' +
            '<div class="card-header">' +
            '<div class="card-info" @click="showInfo">i</div>' +
            '<div class="card-more" @click="showMore">·<span>·</span>·</div>' +
            '</div>' +
            '<div class="card-content" @touchmove="swipeMove" @touchstart="swipeStart" @touchend="swipeEnd" @mousedown="swipeStart" @mouseup="swipeEnd" @mousemove="swipeMove">' +
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
            '<li class="card-tag tag-black">词缀啊</li>' +
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
            books: [],
            tags: ["词缀", "词缀啊"],
            selectedBooks: [],
            selectedTags: [],
            createdTags: [],
            inputEN: "",
            inputZH: ""
        }
    },
    mounted() {
        bus.$on('addCard', () => {
            this.toAddCard = true;
            this.books = books;
        });

        bus.$on('noAddCard', ()=> {
            this.toAddCard = false;
            this.selectedBooks = this.selectedTags = this.createdTags = [];
            this.inputEN = this.inputZH = "";
            this.isSelectBook = this.isSelectTag = false;
        })
    },
    methods: {
        selectBook() {
            this.isSelectBook = true;
        },
        selectTag() {
            this.isSelectTag = true;
            if (this.tags.length == 0) {
                //@todo 请求热门标签数据
            }
        },
        cancel() {
            this.isSelectBook = false;
            this.isSelectTag = false;
        },
        addTag() {
            let tagName = document.getElementById("tag-input").value;
            document.getElementById("tag-input").value = "";
            this.createdTags.push(tagName);
        },
        submit() {
            if (this.inputEN.trim() == "") {
                document.getElementById("word-en-input").focus();
                return;
            } else if (this.inputZH.trim() == "") {
                document.getElementById("word-zh-input").focus();
            } else {
                //@todo 提交数据 没有
                let xmlHttp = new XMLHttpRequest();
                let url = "http://101.200.60.114:8765/add";
                url = addURLParam(url, "en", this.inputEN);
                url = addURLParam(url, "zh", this.inputZH);
                url = addURLParam(url, "books", this.selectedBooks.join());
                url = addURLParam(url, "tags", this.createdTags.concat(this.selectedTags).join())
                xmlHttp.onreadystatechange = function () {
                    if (xmlHttp.readyState == 4) {
                        if ((xmlHttp.status == 200) || xmlHttp.status == 304) {
                            let temp = eval("(" + xmlHttp.responseText +")")
                            if(temp.res == 1) {
                                // 刷新返回，保证获得最新单词本
                                location.reload();
                            } else if (temp.error) {
                                console.log(temp.error)
                                //@todo 两个错误处理
                            }
                        } else {
                            //@todo 添加失败处理
                            console.log('服务器添加失败');
                        }
                    }
                }
                xmlHttp.open("GET", url, true);
                xmlHttp.send(null);
            }
        }
    },
    template: '<transition name="fade"><div id="addCard" v-if="toAddCard">' +
    '<div class="addCard-container" :class="{hide: isSelectBook || isSelectTag}">' +
        '<div class="form">' +
            '<input id="word-en-input" placeholder="English" v-model="inputEN">' +
            '<input id="word-zh-input" placeholder="Chinese" v-model="inputZH">' +
            '<label @click="selectBook">选择收纳的单词本 ></label>' +
            '<label @click="selectTag">添加标签 ></label>' +
            '<button type="button" @click="submit">创建 ></button>' +
        '</div>' +
    '</div>' +
    '<transition name="slide-into"><div class="select-container" v-if="isSelectBook">' +
        '<div class="form">' +
            '<label v-if="books.length == 0">! 暂无单词本</label>' +
            '<label v-for="item in books"><input type="checkbox" :value="item" v-model="selectedBooks">{{item}}<span>·</span></label>' +
            '<label @click="cancel">返回</label>' +
        '</div>' +
    '</div></transition>' +
    '<transition name="slide-into"><div class="select-container" v-if="isSelectTag">' +
        '<div class="form">' +
            '<label>输入标签</label>' +
            '<input id="tag-input" placeholder="Tag" @keyup.enter="addTag" style="margin-bottom: .3rem">' +
            '<label v-for="item in createdTags" style="display: inline-block"><input type="checkbox" :value="item" v-model="createdTags"><div class="select-tag">· {{item}}</div></label>' +
            '<label style="margin-top: .3rem">热门标签</label>' +
            '<label v-for="item in tags" style="display: inline-block"><input type="checkbox" :value="item" v-model="selectedTags"><div class="select-tag">· {{item}}</div></label>' +
            '<label @click="cancel" style="margin-top: .6rem">返回</label>' +
        '</div>' +
    '</div></transition>' +
    '</div></transition>'
}

var addBook = {
    data() {
        return {
            toAddBook: false,
            title: ""
        }
    },
    mounted() {
        bus.$on('addBook', () => {
            this.toAddBook = true;
        });

        bus.$on('noAddBook', ()=> {
            this.toAddBook = false;
        })
    },
    methods: {
        submit() {
            if (this.title.trim() == "") {
                document.getElementById("book-name-input").focus();
                return;
            }
            let that = this;
            let xmlHttp = new XMLHttpRequest();
            let url = "http://101.200.60.114:8765/addbook";
            url = addURLParam(url, "name", this.title);
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4) {
                    if ((xmlHttp.status == 200) || xmlHttp.status == 304) {
                        let temp = eval("(" + xmlHttp.responseText +")")
                        if(temp.res == 1) {
                            // 刷新返回，保证获得最新单词本
                            location.reload();
                        }
                    } else {
                        //@todo 添加失败处理
                        console.log('服务器添加失败');
                    }
                }
            }
            xmlHttp.open("GET", url, true);
            xmlHttp.send(null);
        }
    },
    template: '<transition name="fade"><div id="addBook" v-if="toAddBook">' +
    '<div class="addCard-container">' +
    '<div class="form">' +
    '<input id="book-name-input" v-model="title" placeholder="Book Name">' +
    '<button type="button" @click="submit">创建 ></button>' +
    '</div>' +
    '</div>' +
    '</div></transition>'
}

var Set = new Vue({
    el: '#set',
    components: {
        'add-card': addCard,
        'add-book': addBook
    }
})



