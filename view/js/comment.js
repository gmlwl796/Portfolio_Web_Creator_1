'use strict';

var initCommentPanel = function initCommentPanel() {
    var commentList = [];
    var portNum = window.location.pathname.split('/');
    portNum = portNum.length > 3 ? portNum[portNum.length - 2] : portNum[portNum.length - 1];
    $('.comment-content').empty();

    $.get('/comment/' + portNum, function (response) {
        response.forEach(function (comment) {
            var now = new Date(comment.date);
            commentList.push('\n                <li>\n                    <label class="name">' + comment.name + '</label>\n                    <label class="comment">' + comment.message + '</label>\n                    <label class="date">' + now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + '</label>\n                </li>\n            ');
        });

        $('.comment-panel').append('\n            <div class="comment-content">\n                <h2> <span class="fa fa-comments"></span> Comment(' + commentList.length + ')</h2>\n                <ul>\n                </ul>\n                <textarea class="input-box"></textarea>\n                <button type="button" class="btn btn-primary" id="comment-submit">\uB313\uAE00 \uB4F1\uB85D</button>\n            </div>\n        ');

        commentList.forEach(function (comment) {
            $('.comment-content ul').append(comment);
        });

        $('#comment-submit').click(function () {
            var inputMsg = $(".input-box").val();
            var data = {
                'portfol_num': portNum,
                'message': inputMsg
            };
            $.post("/comment", data).done(function () {
                initCommentPanel();
            });
        });
    });
};

$(document).ready(function () {
    initCommentPanel();
});