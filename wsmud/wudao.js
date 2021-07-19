'use strict';
var skills = [];
var updatelist = [];
var list = {
    "force": [],
    "dodge": [],
    "parry": [],
    "unarmed": [],
    "weapon": [],
};
const levels = {
    wht: 0,
    hig: 1,
    hic: 2,
    hiy: 3,
    hiz: 4,
    hio: 5,
    ord: 6
};

const getLevel = (name) => {
    let t = name.substr(1, 3).toLowerCase();
    let level = levels[t];
    if (level == undefined) return 0;
    return level;
}
const PlayerLevels = {
    wht: 1,
    hig: 2,
    hiy: 3,
    hiz: 4,
    hio: 5,
    ord: 6
};
const getplayerLevel = (name) => {
    let t = name.substr(1, 3).toLowerCase();
    let level = PlayerLevels[t];
    if (level == undefined) return 0;
    return level;
}
const getQueryString = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

const clickType = function() {

    $(".active").removeClass("active");
    $(this).addClass("active");
    $(".props").html("");
    $(".prop_attr").html("");
    $(".skill_attr").html("");
    $(".skills").html("");
    //显示升级武道类型
    let type = $(this).attr("id");
    let l1 = 武道清单.filter(a => a.type == type);
    let l = [...l1];
    updatelist.forEach(u => {
        let index = l.findIndex(a => a.id == u.wudao);
        if (index != -1)
            l.splice(index, 1);
        if (l.length == 1) {
            //l = l.concat(l1.filter(a => a.id != l[0].id));
            l = [...l1];
        }
    });

    for (var i = 0; i < l.length; i++) {
        if (i == 3) break; // 最多3条属性。
        var wd = l[i];
        $(".props").append(
            $(`<button type="button" class="btn btn-light btn-sm  mr-1" id="${wd.id}" t="${wd.type}" attr="${wd.prop+wd.value}">${wd.name}</button>`)
            .addClass("prop").click(clickProp)
        );
    }

};
const clickProp = function() {
    $(".prop").removeClass("active");
    $(this).addClass("active");
    $(".prop_attr").html($(this).attr("attr"));
    $(".skills").html("");
    let type = $(this).attr("t");
    let id = $(this).attr("id");
    let wd = 武道清单[id];
    //显示可升级技能
    let s = skills.filter(a => a.type.includes(type) && a.lv2 < 5);
    s.forEach(tmp => {
        for (let i = 0; i < tmp.update.length; i++) {
            if (wd.prop == 武道清单[tmp.update[i]].prop) return;
        }
        $(".skills").append(
            $(`<button type="button" class="btn btn-secondary btn-sm mr-1 mb-1 skill">${tmp.name}</button>`)
            .addClass("color" + tmp.lv2).click(clickSkill)
        );
    });
};
const clickSkill = function() {

    let p = $(".prop.active");
    if (p.length == 0) { $(".prop_attr").html("请选择进阶武道"); return; };
    let skill = skills.find(t => t.name == $(this).text());
    if (skill) {
        let id = p.attr("id");
        let type = p.attr("t");

        updatelist.push({ name: $(this).text(), wudao: id });
        $(".active").removeClass("active");
        $(this).addClass("active");
        $(".props").html("");
        $(".prop_attr").html("");
        $(".skill_attr").html("");
        $(".skills").html("");
        calc();
        createTable();
    };
}
const calc = function() {
    let book = {
        "force": 0,
        "dodge": 0,
        "parry": 0,
        "unarmed": 0,
        "weapon": 0,
    };
    let exp = 0;
    let limit = parseInt($("#limit").val());
    skills.forEach(skill => {
        let update = updatelist.filter(s => s.name == skill.name);
        skill.update = [];
        if (update.length) {
            skill.lv2 = skill.lv + update.length;
            skill.level2 = parseInt(Math.sqrt(skill.level * skill.level * (skill.lv + 1) / (skill.lv2 + 1)));
            update.forEach(u => {
                let wd = 武道清单[u.wudao];
                book[wd.type]++;
                exp++;
                skill.update.push(u.wudao);
            });
            if (skill.level2 < 1000) {
                skill.levelMin = Math.ceil(Math.sqrt(1000000 * skill.lv2 / (skill.lv + 1)));
            }
            skill.exp = (limit - skill.level2) * (limit + skill.level2) * (skill.lv2 + 1) * 2.5;
        } else {
            skill.lv2 = skill.lv;
            skill.level2 = skill.level;
            skill.exp = 0;
            skill.levelMin=undefined;
        }
    });
    $("#list").val(updatelist.map(a => { return a.name + a.wudao }).join(","));
    let msg = "";
    let book_total = 0;
    for (let b in book) {
        let n = book[b] < 10 ? (book[b] * (book[b] + 1) / 2) : (book[b] * 10 - 45);
        msg += `${typeName[b]}：${n}本 `;
        book_total += n;
    }
    if (exp < 10) exp = exp * exp;
    else exp = exp * 20 - 119;
    msg += `<br>共计${book_total}本，潜能消耗：${exp}00万`;
    $(".consumption").html(msg);
};
const createTable = function() {
    let limit = parseInt($("#limit").val());
    let s = skills.sort((a, b) => { return (a.lv2 * 10000 + a.level2) - (b.lv2 * 10000 + b.level2); });
    let table = $("table tbody");
    table.html("");
    s.forEach(tmp => {
        let wdAttr = "";
        if(tmp.levelMin)
        wdAttr=`<h6>请提升等级到${tmp.levelMin}</h6>`
        tmp.update.forEach(i => {
            wdAttr += `<h6>${武道清单[i].getText(tmp.lv2,tmp.level2)}</h6>`;
        });

        table.append(`
    <tr class="color${tmp.lv2}">
    <td>${tmp.name}</td>
    <td>${tmp.level2}</td>
    <td>${wdAttr}</td>
    <td>${tmp.exp}</td>
    </tr>`);
    });
};
$(".type").on("click", ".btn", clickType);
$("#undo").on("click", () => {
    if (updatelist.length) {
        updatelist.splice(updatelist.length - 1, 1);
        calc();
        createTable();
    }
});
$("#limit").on("change", () => {
    calc();
    createTable();
});
$("#reload").on("click", () => {
    let arr = $("#list").val().split(",");
    let newList = [];
    arr.forEach(tmp => {
        let r = tmp.match(/^([\u4e00-\u9fa5]+)(\d+)$/);
        if (r) newList.push({ name: r[1], wudao: r[2] });
    });
    updatelist = newList;
    calc();
    createTable();
});

$("#load").on("click", () => {
    let json;
    try {
        json = eval('(' + $("#skill_json").val() + ')');
    } catch (error) {}
    if (json && json.dialog == "skills" && json.items) {
        console.log("导入成功");
        skills = [];
        $("#limit").val(json.limit);
        json.items.forEach(element => {
            if (element.can_enables == undefined) return;
            if (element.level < 1000) return;
            element.lv = 技能清单[element.id];
            if (element.lv == undefined) element.lv = getLevel(element.name);
            if (element.lv == 5) return;
            skills.push({
                name: $.trim($('<body>' + element.name + '</body>').text()),
                lv: element.lv,
                level: element.level,
                type: element.can_enables.map((a) => a.replace(/sword|blade|club|staff|whip|throwing/, "weapon")),
                update: []
            });

        });
        updatelist = [];
        calc();
        createTable();
    }
});

$(document).ready(function() {
    $("#skill_json").val(getQueryString("json"));
    $("#load").click();
});