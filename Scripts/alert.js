window.alert = async function (text, wait) {
	var div = document.createElement('div');
	div.id = '_alert_js_alertBox';
	div.innerHTML = "<div style=\"width: 280px;position: fixed;top: 50%;left: 50%;z-index: 999;background: #fff;margin-left: -140px;margin-top: -100px;border-radius: 10px;text-align: center;box-shadow: 0 0 10px #999;\"><h4 style=\"margin: 16px 0;padding: 0 16px;\">" + text + "</h4><div onclick=\"document.getElementById('_alert_js_alertBox').remove();\" style=\"border-top: solid 1px #ccc;line-height: 40px;color: #2196F3;\"> OK </div></div><style>#_alert_js_alertBox{width: 100%; height: 100%;position: fixed;top:0;z-index: 999}</style>";
	document.getElementsByTagName('body')[0].appendChild(div);
	function sleep (time) {
	  return new Promise((resolve) => setTimeout(resolve, time));
	}
	await sleep(300);
	while(document.getElementById('_alert_js_alertBox')){
		await sleep(500);
	}
}

window.confirm = function (text) {
	var div = document.createElement('div');
	div.id = 'confirm';
	div.innerHTML = `<div style="width: 280px;position: fixed;top: 50%;left: 50%;z-index: 999;background: #fff;margin-left: -140px;margin-top: -100px;border-radius: 10px;text-align: center;box-shadow: 0 0 10px #999;"><h4 style="margin: 16px 0;padding: 0 16px;">${text}</h4><div onclick="document.getElementById('confirm').remove();" style="border-top: solid 1px #ccc;line-height: 40px;color: #2196F3;display: inline-block;width: calc(50% - 0.5px);border-right: solid 0.5px #ccc;"> Confirm </div><div onclick="document.getElementById('confirm').remove();" style="border-top: solid 1px #ccc;line-height: 40px;color: #2196F3;display: inline-block;width: calc(50% - 0.5px);border-left: solid 0.5px #ccc;"> Cancel </div></div>`
	document.getElementsByTagName('body')[0].appendChild(div);
}
