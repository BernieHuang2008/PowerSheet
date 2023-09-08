/*
 * _$file_file ....................... a sheet file
 * _$file_content_main ............... content.xml in sheet
 * _$file_ws_names ................... a list contains the names of all the workspaces
 * _$file_workspaces ................. a list contains all the workspaces(workbooks)
 * function getFile() ................ get file and init
 * function saveFile() ............... save file to drive.
 */


var _$file_file = null;
var _$file_content_main = null;
var _$file_ws_names = [];
var _$file_workspaces = [];
var _$file_styles = [];

var _$file_promise;


var fr = new FileReader();
async function getFile() {
	_$file_file = window.showOpenFilePicker({
		types: [{
			description: "Power Sheet",
			accept: {
				'application/.sheet': ['.sheet']
			}
		}]
	});

	await _$file_file.then(y => {
		_$file_promise = y[0];
		_$file_file = y[0];
	});


	_$file_content_main = null;
	_$file_ws_names = [];
	_$file_workspaces = [];
	$("#foot1").innerHTML = '';

	$("#title").innerText = $("title").innerText = _$file_file.name.substring(0, _$file_file.name.length - 6) +
		' - Sheet';
	await _$file_file.getFile().then(b => {
		_$file_file=JSZip.loadAsync(b);
		do_when_zip_was_loaded();
	})
	function do_when_zip_was_loaded() {
		$("#tool-bar>li")[1].onclick();
		_$file_file.then(zip => {
			log(zip.file("content.xml").async("string").then(a => {


				// Parse and prepare.
				_$file_content_main = Parse(a);
				_$file_content_main.body[0].body[0].body.forEach(b => {
					_$file_ws_names.push(b.body[0].body[0]);
					$("#foot1").innerHTML +=
						`<span onclick='changeSheet(${_$file_ws_names.length})'>${b.body[0].body[0]}</span>`;

				})
				loadSheet();


				changeSheet(1);
			}))
		})
	}

	eval(`onFocusCBar_cBarOpen = function(){return "Uploaded: ${_$file_file.name}";}`)
}


async function loadSheet() {
	for (var i = 1; i <= _$file_ws_names.length; i++) {
		await _$file_file.then(zip => {
			zip.file(`workspaces/${i}/content.xml`).async("string").then(a => {
				_$file_workspaces.push(new Sheet(Parse(a)));
			})
		})
	}

	focusSheet = 0;
	setTimeout("changeSheet(1)",500)
	// changeSheet(1);
}


async function saveFile() {
	var zip = new JSZip();

	if (_$file_content_main.body[0])
		zip.file("content.xml", reParse(_$file_content_main.body[0]));
	else {

	}
	zip.folder("workspaces");
	var i = 1;
	_$file_workspaces.forEach(ws => {
		var ts = ws.sheet.slice();

		var txt = "<content>";
		for (x in ws.content) {
			txt += `<${x}>${ws.content[x]}</${x}>`;
		}
		txt += "</content>";
		ts.unshift(Parse(txt).body[0]);
		console.log(ts)

		var st = reParse({
			name: "sheet",
			para: {},
			body: ts
		});
		zip.file(`workspaces/${i}/content.xml`, st);

		i++;
	})

	zip.generateAsync({
			type: "blob"
		})
		.then(async function(blob) {
			var file_name = onFocusCBar_cBarOpen().split('Uploaded: ')[1];
			if (file_name){
				await _$file_promise.createWritable().then(writable=>{
					writable.write(blob);
					writable.close();
				});
			}
			else
				saveAs(blob, "New Sheet.sheet");
		});

	alert("Saved!");
	var title = $('#title').innerText;
	sheetSave = true;
	window.onbeforeunload = null;
	if (title[title.length - 1] == '*')
		$('#title').innerText = title.substring(0, title.length - 1);
}
