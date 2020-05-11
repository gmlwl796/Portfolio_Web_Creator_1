var requestDataSetting = function (fileForm) {
    let fileInput = $(fileForm).find(".file-upload-input");
    let fileObject = fileInput[0].files[0];
    let description = $(fileForm).closest(".file-box").find('.file-upload-description').val();
    let portNum = window.location.pathname.split('/');
    let formData = new FormData();

    portNum = portNum.length > 3 ? portNum[portNum.length-2] : portNum[portNum.length-1];

    formData.append("file", fileObject);
    formData.append("description", description);
    formData.append("portNum", portNum);

    return formData;
}

var putBtnEventBind = function (object, fileForm, file_id) {
    $(object).off('click');
    $(object).click( () => {
        let formData = requestDataSetting(fileForm);

        $.ajax({
           url: `/upload/${file_id}`,
           processData: false,
           contentType: false,
           data: formData,
           type: 'PUT',
           success: response => {
                $(object).remove();
                $(fileForm).closest(".file-box").append('<span class="fa fa-check"></span>');
                fileInputChangeEventBind(object, response.id);
           }
        });
    });
}

var postBtnEventBind = function (object, fileForm) {
    $(object).off('click');
    $(object).click( () => {
        let formData = requestDataSetting(fileForm);

        $.ajax({
           url: `/upload/`,
           processData: false,
           contentType: false,
           data: formData,
           type: 'POST',
           success: response => {
                $(object).remove();
                $(fileForm).closest(".file-box").append('<span class="fa fa-check"></span>');
                fileInputChangeEventBind(object, response.id);
           }
        });
    });
}

var fileInputChangeEventBind = function (object, fileID = -1) {
    $(object).off('change');
    $(object).change( event => {
        let fileBox = event.target.closest(".file-box");
        let uploadBtn = $(fileBox).find(".file-upload-btn");
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
}

$(document).ready( () => {
    let readFiles = $(".file-upload-read");
    let portNum = window.location.pathname.split('/');
    let formData = new FormData();

    if (readFiles.length > 0) {
        // read mode
        portNum = portNum.length > 3 ? portNum[portNum.length-2] : portNum[portNum.length-1];
        $.get(`/upload/${portNum}`, response => {
            response.forEach( file => {
                readFiles.append(`
                    <div class="file-box">
                        <a class="fa fa-file-archive"></a>
                        <span class="info">
                            <h2>${file.name}</h2>
                            <label>${file.description}</label>
                        </span>
                    </div>
                `);

                let fileBox = $(".file-box");
                fileBox = fileBox[fileBox.length -1];

                $(fileBox).find(".fa").click( event => {
                    event.preventDefault();
                    window.location.href = `/uploads/${file.url}`;
                });
            });
        });
    } else {
        // upload mode
        portNum = portNum.length > 3 ? portNum[portNum.length-2] : portNum[portNum.length-1];
        
        $.get(`/upload/${portNum}`, response => {
            response.forEach( file => {
                $(".file-upload").append(
                    `
                    <div class="file-box">
                        <input type="file" class="file-upload-input">
                        <input type="text" placeholder="설명" class="file-upload-description"> 
                    </div>
                    `
                );
    
                let fileBox = $(".file-box");
                fileBox = fileBox[fileBox.length -1];
    
                $(fileBox).find('.file-upload-description').val(file.description);
    
                fileInputChangeEventBind(fileBox, file.id);
            });
        });
    
        $(".addfile").click((event) => {
            $(".file-upload").append(
                `
                    <div class="file-box">
                        <input type="file" class="file-upload-input">
                        <input type="text" placeholder="설명" class="file-upload-description"> 
                    </div>
                `
            );
    
            let fileBox = $(".file-box");
            fileBox = fileBox[fileBox.length -1];
            fileInputChangeEventBind(fileBox);
        });
    }
})