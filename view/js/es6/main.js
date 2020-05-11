var addSkill = function(name, num) {
    let form = $(".skills").parent();
    form.append(`
        <fieldset class=skills>
            <a class="fa fa-window-close delete"></a>
            <legend>보유기술 폼</legend>
            <div>
                <label for="skill">보유기술 : </label>
                <input type="text" class="skill"> 
            </div>
            <div>
                <label for="percentage">능숙도(등급) : </label>
                <input type="number" class="percentage" min=1> 
            </div>
        </fieldset>
    `);
    let current = $(".skills").last();
    let inputs = current.find("input");
    inputs.eq(0).val(name);
    inputs.eq(1).val(num);

    current.find('.delete').click( event => {
        current.remove();
    });
}

var addcareer = function(value) {
    let header = $('.careers').parent();
    header.append(`
        <div class="careers"> 
            <input type="text" name="career"  class="career">
            <a class="fa fa-window-close delete"></a>
        </div>
    `);

    let current = $('.careers').last();
    current.find("input").val(value);

    current.find(".delete").click( event => {
        current.remove();
    });
}
  
$(document).ready( () => {
    $.get('/portfolio/me', result => {
        let careers = JSON.parse(result.careers);
        let skills = JSON.parse(result.skills);

        $('#introduce').val(result.introduce);
        $('#homepage').val(result.homepage);
        $('#phone').val(result.phone);

        let themaSelect = $('.thema-select').find('input[type="radio"]');
        themaSelect.eq(result.temp).attr("checked", true);

        careers.forEach((career, index) => {
            if (index == 0){
                let input = $('.careers').last();
                input.find("input").val(career["career"]);
            } else {
                addcareer(career["career"]);
            }
        });

        skills.forEach((skill, index) => {
            if (index == 0){
                let inputs = $(".skills").last().find("input");
                inputs.eq(0).val(skill["skill"]);
                inputs.eq(1).val(skill["percentage"]);
            } else {
                addSkill(skill["skill"], skill["percentage"]);
            }
        });
    });

    // 기술 추가 
    $(".addskill").click(() => {
        addSkill();
    });

    // 커리어 추가
    $(".addcareer").click(()=>{
        addcareer();
    });
});