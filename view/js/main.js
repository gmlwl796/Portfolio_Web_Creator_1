"use strict";

var addSkill = function addSkill(name, num) {
    var form = $(".skills").parent();
    form.append("\n        <fieldset class=skills>\n            <a class=\"fa fa-window-close delete\"></a>\n            <legend>\uBCF4\uC720\uAE30\uC220 \uD3FC</legend>\n            <div>\n                <label for=\"skill\">\uBCF4\uC720\uAE30\uC220 : </label>\n                <input type=\"text\" class=\"skill\"> \n            </div>\n            <div>\n                <label for=\"percentage\">\uB2A5\uC219\uB3C4(\uB4F1\uAE09) : </label>\n                <input type=\"number\" class=\"percentage\" min=1> \n            </div>\n        </fieldset>\n    ");
    var current = $(".skills").last();
    var inputs = current.find("input");
    inputs.eq(0).val(name);
    inputs.eq(1).val(num);

    current.find('.delete').click(function (event) {
        current.remove();
    });
};

var addcareer = function addcareer(value) {
    var header = $('.careers').parent();
    header.append("\n        <div class=\"careers\"> \n            <input type=\"text\" name=\"career\"  class=\"career\">\n            <a class=\"fa fa-window-close delete\"></a>\n        </div>\n    ");

    var current = $('.careers').last();
    current.find("input").val(value);

    current.find(".delete").click(function (event) {
        current.remove();
    });
};

$(document).ready(function () {
    $.get('/portfolio/me', function (result) {
        var careers = JSON.parse(result.careers);
        var skills = JSON.parse(result.skills);

        $('#introduce').val(result.introduce);
        $('#homepage').val(result.homepage);
        $('#phone').val(result.phone);

        var themaSelect = $('.thema-select').find('input[type="radio"]');
        themaSelect.eq(result.temp).attr("checked", true);

        careers.forEach(function (career, index) {
            if (index == 0) {
                var input = $('.careers').last();
                input.find("input").val(career["career"]);
            } else {
                addcareer(career["career"]);
            }
        });

        skills.forEach(function (skill, index) {
            if (index == 0) {
                var inputs = $(".skills").last().find("input");
                inputs.eq(0).val(skill["skill"]);
                inputs.eq(1).val(skill["percentage"]);
            } else {
                addSkill(skill["skill"], skill["percentage"]);
            }
        });
    });

    // 기술 추가 
    $(".addskill").click(function () {
        addSkill();
    });

    // 커리어 추가
    $(".addcareer").click(function () {
        addcareer();
    });
});