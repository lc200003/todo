// TODO: 用户名称需修改为自己的名称
var userName = "畅";
// 朋友圈页面的数据
var data =
    [
        {
            user: {
                name: "阳和",
                avatar: "./img/avatar2.png"
            },
            content: {
                type: 0, // 多图片消息
                text: "华仔真棒，新的一年继续努力！",//朋友圈发表的文字
                pics: ["./img/reward1.png", "./img/reward2.png", "./img/reward3.png", "./img/reward4.png"],//图片
                share: {},
                timeString: "3分钟前"
            },
            reply: {
                hasLiked: false,
                likes: ["Guo封面", "源小神"],
                comments: [{
                    author: "Guo封面",
                    text: "你也喜欢华仔哈！！！"
                }, {
                    author: "喵仔zsy",
                    text: "华仔实至名归哈"
                }]
            }
        },
        /*******************************************************************************/
        {
            user: {
                name: "伟科大人",
                avatar: "./img/avatar3.png"
            },
            content: {
                type: 1, // 分享消息
                text: "全民读书日",
                pics: [],
                share: {
                    pic: "http://coding.imweb.io/img/p3/transition-hover.jpg",
                    text: "飘洋过海来看你"
                },
                timeString: "50分钟前"
            },
            reply: {
                hasLiked: false,
                likes: ["阳和"],
                comments: []
            }
        },
        /*******************************************************************************/
        {
            user: {
                name: "深圳周润发",
                avatar: "./img/avatar4.png"
            },
            content: {
                type: 2, // 单图片消息
                text: "很好的色彩",
                pics: ["http://coding.imweb.io/img/default/k-2.jpg"],
                share: {},
                timeString: "一小时前"
            },
            reply: {
                hasLiked: false,
                likes: [],
                comments: []
            }
        },
        /*******************************************************************************/
        {
            user: {
                name: "喵仔zsy",
                avatar: "./img/avatar5.png"
            },
            content: {
                type: 3, // 无图片消息
                text: "以后咖啡豆不敢浪费了",
                pics: [],
                share: {},
                timeString: "2个小时前"
            },
            reply: {
                hasLiked: false,
                likes: [],
                comments: []
            }
        }
    ];
// 相关 DOM
var $page = $(".page-moments");
var $momentsList = $(".moments-list");

/**
 * 点赞内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function likesHtmlTpl(likes) {
    if (!likes.length) {
        return "";
    }
    var htmlText = ["<div class=\"reply-like\"><i class=\"icon-like-blue\"></i>"];
    // 点赞人的html列表
    var likesHtmlArr = [];
    // 遍历生成
    for (var i = 0, len = likes.length; i < len; i++) {
        likesHtmlArr.push("<a class=\"reply-who\" href=\"#\">" + likes[i] + "</a>");
    }
    // 每个点赞人以逗号加一个空格来相隔
    var likesHtmlText = likesHtmlArr.join(", ");
    htmlText.push(likesHtmlText);
    htmlText.push("</div>");
    return htmlText.join("");
}

/**
 * 评论内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function commentsHtmlTpl(comments) {
    if (!comments.length) {
        return "";
    }
    var htmlText = ["<div class=\"reply-comment\">"];
    for (var i = 0, len = comments.length; i < len; i++) {
        var comment = comments[i];
        htmlText.push("<div class=\"comment-item\"><a class=\"reply-who\" href=\"#\">" + comment.author + "</a>：" + comment.text + "</div>");
    }
    htmlText.push("</div>");
    return htmlText.join("");
}

/**
 * 评论点赞总体内容 HTML 模板
 * @param {Object} replyData 消息的评论点赞数据
 * @return {String} 返回html字符串
 */
function replyTpl(replyData) {
    var htmlText = [];
    htmlText.push("<div class=\"reply-zone\">");//评论列表开始
    htmlText.push(likesHtmlTpl(replyData.likes));
    htmlText.push(commentsHtmlTpl(replyData.comments));//评论列表结束
    htmlText.push("</div>");
    return htmlText.join("");
}

/******************************************3种消息展示start(第四种为空)*************************************************************/
/**
 * 多张图片消息模版
 * @param {Object} pics 多图片消息的图片列表
 * @return {String} 返回html字符串
 */
function multiplePicTpl(pics) {
    var htmlText = [];
    htmlText.push("<ul class=\"item-pic\">");
    for (var i = 0, len = pics.length; i < len; i++) {
        htmlText.push("<img class=\"pic-item\" src=\"" + pics[i] + "\">");
    }
    htmlText.push("</ul>");
    return htmlText.join("");
}

/**
 * 分享消息模版
 * @param {Object} share 分享
 * @return {String} 返回html字符串
 */
function shareTpl(share) {
    var htmlText = [];
    htmlText.push("<div class=\"item-share\">");
    htmlText.push("<img class=\"share-img\"  src=\"" + share.pic + "\">");
    htmlText.push("<p class=\"share-tt\">" + share.text + "</p>");
    htmlText.push("</div>");
    return htmlText.join("");
}

/**
 * 单图片消息模版
 * @param {Object} pics 分享
 * @return {String} 返回html字符串
 */
function onlyImgTpl(pics) {
    var htmlText = [];
    htmlText.push("<img class=\"item-only-img\"  src=\"" + pics[0] + "\">");
    return htmlText.join("");
}

//*****************************************3种消息展示end(第四种为空)******************************************************
/**
 * 循环：消息体
 * @param {Object} messageData 对象
 */
function messageTpl(messageData) {
    var user = messageData.user;
    var content = messageData.content;
    var reply = messageData.reply;
    var htmlText = [];

    htmlText.push("<div class=\"moments-item\" data-index=\"0\">");//设置索引

    // 消息用户头像
    htmlText.push("<a class=\"item-left\" href=\"#\">");
    htmlText.push("<img src=\"" + user.avatar + "\" width=\"42\" height=\"42\" alt=\"\"/>");
    htmlText.push("</a>");
    // 消息右边内容
    htmlText.push("<div class=\"item-right\">");
    // 消息内容-用户名称
    htmlText.push("<a href=\"#\" class=\"item-name\">" + user.name + "</a>");
    // 消息内容-文本信息
    htmlText.push("<p class=\"item-msg\">" + content.text + "</p>");
    // 消息内容-图片列表
    var contentHtml = "";

    switch (content.type) {
        // 多图片消息
        case 0:
            contentHtml = multiplePicTpl(content.pics);
            break;
        case 1:
            // TODO: 实现分享消息
            contentHtml = shareTpl(content.share);
            break;
        case 2:
            // TODO: 实现单张图片消息
            contentHtml = onlyImgTpl(content.pics);
            break;
        case 3:
            // TODO: 实现无图片消息
            contentHtml = '';
            break;
    }
    htmlText.push(contentHtml);
    // 消息时间和回复按钮
    htmlText.push("<div class=\"item-ft\">");
    htmlText.push("<span class=\"item-time\">" + content.timeString + "</span>");
    ///////////////////////////////////////////////////////////////
    htmlText.push("<div class=\"item-reply-bg\">");
    htmlText.push("<div class=\"item-reply-touchUp\">");//点赞的触摸区域
    htmlText.push("<div class=\"icon-like\">" + "</div>");

    htmlText.push("<div class=\"item-reply-iconName\">" + up + "</div>");//点赞or取消
    htmlText.push("</div>");
    htmlText.push("<div class=\"item-reply-touchComment\">");//评论的触摸区域
    htmlText.push("<div class=\"icon-comment\">" + "</div>");
    htmlText.push("<div class=\"item-reply-iconName\">" + "评论" + "</div>");
    htmlText.push("</div></div>");
    htmlText.push("<div class=\"item-reply-btn\">");

    ///////////////////////////////////////////////////////////////
    htmlText.push("<span class=\"item-reply\"></span>");
    htmlText.push("</div></div>");
    // 消息回复模块（点赞和评论）
    htmlText.push(replyTpl(messageData.reply));
    htmlText.push("</div></div>");
    return htmlText.join("");
}


/**
 * 页面渲染函数：render
 */
function render() {
    // 展示data数组中的所有消息数据。

    var messageHtml = "";
    // TODO: 这应该是一个for循环
    for (var i = 0; i < data.length; i++) {
        messageHtml += messageTpl(data[i]);
    }
    $momentsList.html(messageHtml);
}


function replyPopup() {
    $(document).click(function () {
        $('.moments-item').find(".item-reply-bg").css("margin-right", "")
    })
    $('.item-reply').click(function () {
        var index = $(this).parent().parent().parent().parent().index()
        var itemreplybg = $(".moments-item").eq(index).find(".item-reply-bg")
        if (itemreplybg.css("margin-right") == "38px") {
            $(itemreplybg).css("margin-right", "")
        } else {
            $(itemreplybg).css("margin-right", "38px")
        }
        $('.moments-item').eq(index).siblings().find(".item-reply-bg").css("margin-right", "")
        return false
    })
}

var up = '点赞'

function touchUp() {
    $('.item-reply-touchUp').click(function () {
        var touchup = $(this).find(".item-reply-iconName")[0]
        var touchupindex = $(this).parent().parent().parent().parent().index()
        var arr = data[touchupindex].reply.likes;
        var like = data[touchupindex].reply.hasLiked;
        if (touchup.innerHTML == "点赞") {
            touchup.innerHTML = "取消"
            up = '取消'
            arr.push(userName);
            data[touchupindex].reply.hasLiked = false
        } else {
            touchup.innerHTML = "点赞"
            up = '点赞'
            data[touchupindex].reply.hasLiked = true
            arr.splice(arr.length - 1);
        }
        init();
    })
}

/**
 * 发表评论函数
 * */
var commentindex;

function touchComment() {
    $('.item-reply-touchComment').click(function () {
        $('.review-box-Shell').show()
        commentindex = $(this).parent().parent().parent().parent().index()
    })

}

//发送按钮点击后触发的事件
function sentMsg() {
    var reviewboxinput = document.querySelector(".review-box-input")
    $('.review-box-sent').click(function () {
        if (document.querySelector(".review-box-sent").style.background == "green" && reviewboxinput.value) {
            ///console.log(reviewboxinput.value)
            data[commentindex].reply.comments.push({author: userName, text: reviewboxinput.value})
            $('.review-box-Shell').hide()
            reviewboxinput.value = ''
        }
        init();
    })
}

//监听评论发送按钮的状态
function listenInput() {
    var reviewboxinput = document.querySelector(".review-box-input")
    reviewboxinput.addEventListener('input', function () {
        //console.log(reviewboxinput.value)
        var reviewboxsent = document.querySelector(".review-box-sent")
        if (reviewboxinput.value) {
            reviewboxsent.style.background = "green"
        } else {
            reviewboxsent.style.background = "gray"
        }
    })
}

//图片点击
function touchImg() {
    $('.pic-item,.item-only-img').click(function () {
        $(".bg-img-out").show()
        $(".bg-img").css("background-image", `url("${$(this)[0].src}")`)
        $('.bg-img-out').click(function () {
            $(".bg-img-out").hide()
            $(".bg-img").css("background-image", `url("")`)
        })
    })
}

/*************************************************************************************************************************/
/**
 * 页面绑定事件函数：bindEvent
 */
function bindEvent() {
    // TODO: 完成页面交互功能事件绑定
    touchUp();
    touchComment();
    touchImg();
    sentMsg();

    listenInput();
    replyPopup();
}

/**
 * 页面入口函数：init
 * 1、根据数据页面内容
 * 2、绑定事件
 */
function init() {
    // 渲染页面
    render();
    bindEvent();
}

init();

