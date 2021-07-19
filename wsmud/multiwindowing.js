var count = 0;
(function() {
    let r = getQueryString("c");
    if (r) {
        count = parseInt(r);
        run();
    } else {
        var div = document.getElementById("buttonArea");
        div.appendChild(createDuoKaiButton("单开", 1));
        div.appendChild(createDuoKaiButton("双开", 2));
        div.appendChild(createDuoKaiButton("三开", 3));
    }
})();

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

function createDuoKaiButton(name, value) {
    var button = document.createElement("button");
    button.type = "button";
    button.value = value;
    button.onclick = function() {
        count = this.value;
        run();
    };
    button.innerHTML = name;
    return button;
}

function creatFloatDiv() {
    var float = document.getElementById("float");
    var button = document.createElement("button");
    button.innerHTML = "全部最大化";
    button.className = "float";
    button.onclick = function() {
        for (var i = 1; i <= count; i++) {
            document.getElementById("box" + i).className = "big_box";
            document.getElementById("cover" + i).className = "disable";
        }
	};
	float.appendChild(button);
    button = document.createElement("button");
    button.innerHTML = "全部最小化";
    button.className = "float";
    button.onclick = function() {
        for (var i = 1; i <= count; i++) {
            document.getElementById("box" + i).className = "small_box";
            document.getElementById("cover" + i).className = "cover";
        }
    };
	float.appendChild(button);

	button = document.createElement("button");
    button.innerHTML = "整理";
    button.className = "float";
    button.onclick = function() {
        for (let i = 0; i < window.frames.length; i++) {
			window.frames[i].postMessage("整理", "*");
        }
    };
	float.appendChild(button);
    button = document.createElement("button");
    button.innerHTML = "日常";
    button.className = "float";
    button.onclick = function() {
        for (let i = 0; i < window.frames.length; i++) {
			window.frames[i].postMessage("日常", "*");
        }
    };
	float.appendChild(button);
	
	button = document.createElement("button");
    button.innerHTML = "修炼";
    button.className = "float";
    button.onclick = function() {
        for (let i = 0; i < window.frames.length; i++) {
			window.frames[i].postMessage("修炼", "*");
        }
    };
	float.appendChild(button);

	button = document.createElement("button");
    button.innerHTML = "挂机";
    button.className = "float";
    button.onclick = function() {
        for (let i = 0; i < window.frames.length; i++) {
			window.frames[i].postMessage("挂机", "*");
        }
    };
	float.appendChild(button);
    var input=document.createElement("input");
    input.type="text";
    input.className="cmd";
    input.placeholder="命令";
    input.style="margin-left: 100px;"
    float.appendChild(input);

	button = document.createElement("button");
    button.innerHTML = "运行";
    button.className = "float";
    button.onclick = function() {
        let cmd=document.querySelector(".cmd").value;
        for (let i = 0; i < window.frames.length; i++) {
			window.frames[i].postMessage("$"+cmd, "*");
        }
    };
    float.appendChild(button);
}

function run() {
    creatFloatDiv();
    var buttonArea = document.getElementById("buttonArea");
    buttonArea.className = "disable";
    var iframeArea = document.getElementById("iframeArea");
    iframeArea.innerHTML = "";
    for (var i = 1; i <= count; i++) {
        var box = document.createElement("div");
        box.className = "big_box";
        box.id = "box" + i;

		var iframe = document.createElement("iframe");
		let auto=getQueryString(i);
		if(auto)
		iframe.src = `http://game.wsmud.com/?autoLogin=${auto}`;
		else
		iframe.src = "http://game.wsmud.com/";

        var cover = document.createElement("div");
        cover.className = "disable";
        cover.id = "cover" + i;
        cover.innerHTML = i;
        cover.onclick = function() {
            this.className = "disable"; // cover 消失
            document.getElementById("box" + this.innerHTML).className = "big_box"; // box 变大
        };

        box.appendChild(iframe);
        box.appendChild(cover);
        iframeArea.appendChild(box);
    }
}

function clickCover() {
    var box_array = document.getElementsByClassName("small_box" + " " + this.innerHTML);
    for (var i = 0; i < box_array.length; i++) {
        box_array[i].className = "big_box";
    }
}