"use strict";

var requestDataSetting = function requestDataSetting(fileForm) {
    var fileInput = $(fileForm).find(".file-upload-input");
    var fileObject = fileInput[0].files[0];
    var description = $(fileForm).closest(".file-box").find('.file-upload-description').val();
    var portNum = window.location.pathname.split('/');
    var formData = new FormData();

    portNum = portNum.length > 3 ? portNum[portNum.length - 2] : portNum[portNum.length - 1];

    formData.append("file", fileObject);
    formData.append("description", description);
    formData.append("portNum", portNum);

    return formData;
};

var putBtnEventBind = function putBtnEventBind(object, fileForm, file_id) {
    $(object).off('click');
    $(object).click(function () {
        var formData = requestDataSetting(fileForm);

        $.ajax({
            url: "/upload/" + file_id,
            processData: false,
            contentType: false,
            data: formData,
            type: 'PUT',
            success: function success(response) {
                $(object).remove();
                $(fileForm).closest(".file-box").append('<span class="fa fa-check"></span>');
                fileInputChangeEventBind(object, response.id);
            }
        });
    });
};

var postBtnEventBind = function postBtnEventBind(object, fileForm) {
    $(object).off('click');
    $(object).click(function () {
        var formData = requestDataSetting(fileForm);

        $.ajax({
            url: "/upload/",
            processData: false,
            contentType: false,
            data: formData,
            type: 'POST',
            success: function success(response) {
                $(object).remove();
                $(fileForm).closest(".file-box").append('<span class="fa fa-check"></span>');
                fileInputChangeEventBind(object, response.id);
            }
        });
    });
};

var fileInputChangeEventBind = function fileInputChangeEventBind(object) {
    var fileID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

    $(object).off('change');
    $(object).change(function (event) {
        var fileBox = event.target.closest(".file-box");
        var uploadBtn = $(fileBox).find(".file-upload-btn");
        $(fileBox).find(".fa-check").remove();

        if (uploadBtn.length == 0) {
            $(fileBox).append('<button class="btn btn-default file-upload-btn">업로드</button>');
            uploadBtn = $(fileBox).find(".file-upload-btn");
        }

        if (fileID == -1) {
            postBtnEventBind(uploadBtn, fileBox);
        } else {
            putBtnEventBind(uploadBtn, fileBox, fileID);
        }
    });
};

$(document).ready(function () {
    var readFiles = $(".file-upload-read");
    var portNum = window.location.pathname.split('/');
    var formData = new FormData();

    if (readFiles.length > 0) {
        // read mode
        portNum = portNum.length > 3 ? portNum[portNum.length - 2] : portNum[portNum.length - 1];
        $.get("/upload/" + portNum, function (response) {
            response.forEach(function (file) {
                readFiles.append("\n                    <div class=\"file-box\">\n                        <a class=\"fa fa-file-archive\"></a>\n                        <span class=\"info\">\n                            <h2>" + file.name + "</h2>\n                            <label>" + file.description + "</label>\n                        </span>\n                    </div>\n                ");

                var fileBox = $(".file-box");
                fileBox = fileBox[fileBox.length - 1];

                $(fileBox).find(".fa").click(function (event) {
                    event.preventDefault();
                    window.location.href = "/uploads/" + file.url;
                });
            });
        });
    } else {
        // upload mode
        portNum = portNum.length > 3 ? portNum[portNum.length - 2] : portNum[portNum.length - 1];

        $.get("/upload/" + portNum, function (response) {
            response.forEach(function (file) {
                $(".file-upload").append("\n                    <div class=\"file-box\">\n                        <input type=\"file\" class=\"file-upload-input\">\n                        <input type=\"text\" placeholder=\"\uC124\uBA85\" class=\"file-upload-description\"> \n                    </div>\n                    ");

                var fileBox = $(".file-box");
                fileBox = fileBox[fileBox.length - 1];

                $(fileBox).find('.file-upload-description').val(file.description);

                fileInputChangeEventBind(fileBox, file.id);
            });
        });

        $(".addfile").click(function (event) {
            $(".file-upload").append("\n                    <div class=\"file-box\">\n                        <input type=\"file\" class=\"file-upload-input\">\n                        <input type=\"text\" placeholder=\"\uC124\uBA85\" class=\"file-upload-description\"> \n                    </div>\n                ");

            var fileBox = $(".file-box");
            fileBox = fileBox[fileBox.length - 1];
            fileInputChangeEventBind(fileBox);
        });
    }
});