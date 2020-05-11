// Accordion
function myFunction(id) {
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
        x.previousElementSibling.className += " w3-theme-d1";
    } else { 
        x.className = x.className.replace("w3-show", "");
        x.previousElementSibling.className = 
        x.previousElementSibling.className.replace(" w3-theme-d1", "");
    }
}

// Used to toggle the menu on smaller screens when clicking on the menu button
function openNav() {
    var x = document.getElementById("navDemo");
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else { 
        x.className = x.className.replace(" w3-show", "");
    }
}

function mydownload() {
    alert("다운로드 중입니다!");
} 

$(document).ready( () => {
    $('#image-upload').change( event =>{
        let fileBox = event.target.closest(".profile-image-edit-form");
        let fileInput = event.target;
        let uploadBtn = $(fileBox).find(".file-upload-btn");
        $(fileBox).find(".fa-check").remove();

        if (uploadBtn.length == 0) {
            $(fileBox).append('<button class="btn btn-default file-upload-btn">업로드</button>');
            uploadBtn = $(fileBox).find(".file-upload-btn");
            console.log(fileInput);
            uploadBtn.click( event => {
                let fileObject = fileInput.files[0];
                let formData = new FormData();

                formData.append("img", fileObject);

                $.ajax({
                    url: `/upload/profile_img`,
                    processData: false,
                    contentType: false,
                    data: formData,
                    type: 'POST',
                    success: response => {
                        let viewer = $(fileBox).find('.profile-image-view');
                        $(viewer).find('img').remove();

                        viewer.append(`
                            <img src="/uploads/${response.profileImg}">
                        `);
                        $(uploadBtn).remove();
                        $(fileBox).append('<span class="fa fa-check"></span>');
                    }
                 });
            });
        }
    });
});