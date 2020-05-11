var initCommentPanel = function() {
    let commentList = [];
    let portNum = window.location.pathname.split('/');
    portNum = portNum.length > 3 ? portNum[portNum.length-2] : portNum[portNum.length-1];
    $('.comment-content').empty();

    $.get(`/comment/${portNum}`, response => {
        response.forEach( comment => {
            let now = new Date(comment.date);
            commentList.push(`
                <li>
                    <label class="name">${comment.name}</label>
                    <label class="comment">${comment.message}</label>
                    <label class="date">${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}</label>
                </li>
            `);
        });

        $('.comment-panel').append(`
            <div class="comment-content">
                <h2> <span class="fa fa-comments"></span> Comment(${commentList.length})</h2>
                <ul>
                </ul>
                <textarea class="input-box"></textarea>
                <button type="button" class="btn btn-primary" id="comment-submit">댓글 등록</button>
            </div>
        `);

        commentList.forEach(comment => {
            $('.comment-content ul').append(comment);
        });

        $('#comment-submit').click( () => {
            let inputMsg = $(".input-box").val();
            let data = {
                'portfol_num' : portNum,
                'message' : inputMsg
            }
            $.post("/comment", data).done(() => {
                initCommentPanel();
            });
        });
    });
}

$(document).ready(() => {
    initCommentPanel();
});