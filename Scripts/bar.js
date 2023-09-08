function onFocusBar(name) {
	$("#cover").style.display = "none";
	eval("onFocusBar_" + name + "()");
}

function onFocusCBar(name) {
	var txt;
	eval("txt=onFocusCBar_" + name + "()");
	$("#cover-content").innerHTML = txt;
}

$("#cover").onclick = function() {
	// getFile();
}

function onFocusBar_File() {
	$("#cover").style.display = "block";
}

function onFocusBar_Home() {

}

function funcBarChangeWidth() {

}

$("#scroll-x").onscroll = function() {
	var sl = ($("#scroll-x").scrollLeft) / 450 * $("#main-sheet").offsetWidth;
	var sl2 = $("#scroll-x").scrollLeft;
	$("#main-sheet").scrollLeft = sl;
}

$("#main-sheet").onscroll = function(e) {
	var sl = ($("#main-sheet").scrollLeft) / $("#main-sheet").offsetWidth * 450;
	var sl2 = $("#scroll-x").scrollLeft;
	if (Math.abs(sl - $("#scroll-x").scrollLeft) > 1)
		$("#scroll-x").scrollLeft = sl;
}

function calcScrollX(n) {
	n = n / $("#main-sheet").offsetWidth;
	$("#scroll-x-length").style.right = `${500-n*500}px`;
	return 500 - n * 500;
}

function invCalcScrollX(n) {

	$("#main-sheet").scrollTo($("#main-sheet").scrollTop, n * $("#main-sheet").offsetWidth)
	return n * $("#main-sheet").offsetWidth;
}

function onFocusCBar_cBarHome() {
	return "HOME"
}

function onFocusCBar_cBarOpen() {
	return `<h1 id="fileinput" onclick="getFile()">Click to choose a file.</h1>`;
}

function onFocusCBar_cBarNew() {
	onFocusBar("Home");
	open("https://hgaka.github.io/sheet");
}

function onFocusCBar_cBarSave() {
	return "<button onclick='saveFile()'>SAVE</button>"
}

function onFocusCBar_cBarHelp(x, t) {
	if (x == undefined) {
		var rt = "";
		var title = [
			"Our Ten Most Popular Functions",

		]
		var desc = [
			"Here are the 10 functions that people read about most.",

		]
		var fs = [
			`<tr>
				<td><p><a href="help/f/sum">SUM function</a></p></td>
				<td><p>Use this function to add the values in cells.</td>
			</tr>
			`,
			
		]

		for (var i = 0; i < title.length; i++)
			rt += `<h2 onclick="onFocusCBar_cBarHelp(-1, this);" style="
			box-sizing: border-box;
			font-size: 16px;
			line-height: 22px;
			font-family: 'Segoe UI','Segoe UI Web','wf_segoe-ui_normal','Helvetica Neue','BBAlpha Sans','S60 Sans',Arial,sans-serif;
			cursor: pointer;
			font-weight: normal;
			padding-top: 0;
			padding-bottom: 0;
			margin: 0;
			background-color: #fafafa;
			border-top: 1px solid #cecece;
			color: #1e1e1e;
			padding: 13px 18px 8px;
			"><text>${title[i]}</text><text style="font-family: OffSMDL2;float:right;">&#xE70D;</text></h2>
			
			<div style="width: 90%;display:none;">
			<p>${desc[i]}</p>
			<table class='help_functions'>
			<thead><tr><th><p>Function</p></th><th><p>Description</p></th></tr></thead>
			<tbody>${fs[i]}</tbody>
			</table>
			</div>
			`
		return rt;
	}
	t.onclick = function() {
		onFocusCBar_cBarHelp(-x, this)
	};
	if (x < 0)
		t.children[1].innerHTML = "&#xE70E;", // up
		t.nextElementSibling.style.display = "block";
	else
		t.children[1].innerHTML = "&#xE70D;", // down
		t.nextElementSibling.style.display = "none";

}

function onFocusCBar_cBarAbout() {
	return `
	<h1 style="">Power Sheet</h1>
	<p>Version: ${Version}</p>
	
	<h5>&copy; 2022 BernieHuang</h5>
	
	
	<h2>Latest Update</h2>
	<hr>
	<img src="release/img1.png">
	<br>
	New Formulas !
	
	<br><br><br><br><br>
	`
}
