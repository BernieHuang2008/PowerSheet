const Version='2022-11-9.1<br>(Official 1.2.1191)';


window.alert = function (text) {
	var div = document.createElement('div');
	div.id = 'alert';
	div.innerHTML = "<div style=\"width: 280px;position: fixed;top: 50%;left: 50%;z-index: 999;background: #fff;margin-left: -140px;margin-top: -100px;border-radius: 10px;text-align: center;box-shadow: 0 0 10px #999;\"><h4 style=\"margin: 16px 0;padding: 0 16px;\">" + text + "</h4><div onclick=\"document.getElementById('alert').remove()\" style=\"border-top: solid 1px #ccc;line-height: 40px;color: #2196F3;\">确定</div></div><style>#alert{width: 100%; height: 100%;position: fixed;top:0;z-index: 999}</style>";
	document.getElementsByTagName('body')[0].appendChild(div);
}



function app_about(){
	alert(`<h1 style="">Power Sheet</h1><p>Version: ${Version}</p><h5>&copy; 2022 BernieHuang</h5>`);
}

window.onload=function(){
	createEmptySheet([1,2,1,2]);
	initWhiteSheet();
}
var sheetSave=true;
window.onbeforeunload=function(){
	return false;
}

init()
Parse()


function initWhiteSheet(){
	$("#foot1").innerHTML +=
		`<span onclick='changeSheet(1)'>Sheet1</span>`;
	var a=`<content><sheets><sheet id='1'><name>Sheet1</name></sheet></sheets><styles><style id='1'><range>1:2</range></style></styles></content>`;
	var b=`<sheet><content><name>Sheet1</name><range>A1:A1</range></content><r id='1'><c id='A'></c></r></sheet>`;
	_$file_ws_names=['Sheet1'];
	_$file_content_main = Parse(a);
	_$file_workspaces.push(new Sheet(Parse(b)));
	changeSheet(1);
}

