var focusSheet = null;
var changedSq = [];
var finputOnFocus = false;

function changeSheet(s) {
	if (s == focusSheet)
		return false;
	$("#foot1").children[s - 1].classList = 'focus';
	var lFocusSheet = focusSheet;
	focusSheet = s;
	if ($("#foot1").children[lFocusSheet - 1])
		$("#foot1").children[lFocusSheet - 1].classList = '';
	showSheet(_$file_workspaces[s - 1]);
}


function range_sq(a) {
	try {
		var res = '';

		function line(b) {
			var s = 0;
			for (var i = b.length - 1; i >= 0; i--) s += Math.pow(26, i) * (b[i].charCodeAt() - 64)
			return s;
		}

		function split(b) {
			b = b.split(':');
			c = line(b[0].match(/[A-Z]*/g)[0]);
			d = line(b[1].match(/[A-Z]*/g)[0]);
			e = f = null;
			b[0].match(/[0-9]*/g).forEach(ss => {
				if (ss) e = ss;
			});
			b[1].match(/[0-9]*/g).forEach(ss => {
				if (ss) f = ss;
			});
			res = [c, d, Number(e), Number(f)];
			// <-> , <->, |, |
		}
		split(a)
		// sort
		res = [
			Math.min(res[0], res[1]),
			Math.max(res[0], res[1]),
			Math.min(res[2], res[3]),
			Math.max(res[2], res[3])
		]
		return res;
	} catch (err) {
		console.log(a)
	};
}

function showSheet(obj) {
	var sheetRange = range_sq(obj.content.range);

	createEmptySheet(sheetRange)

	obj.sheet.forEach(x => {
		var rowId = x.para.id;
		x.body.forEach(y => {
			var colId = y.para.id;
			var cellId = colId + rowId;
			var cell = $('#' + cellId);
			cell.innerHTML = `<text class='text'></text>`;
			var val = y.body[0] == undefined ? '' : y.body[0];
			cell.children[0].innerText = val;
			cell.dataset.val = val;

			if (y.body.length == 2) {
				try{
					cell.dataset.val = y.body[1].body[0];
				}catch(err){
					log(err);
				}
			}
		})
	});
	log(obj, sheetRange);
	reformSheet()
}

var cddd = 0;

function col(b) {
	var s = 0;
	for (var i = 0; i < b.length; i++) {
		s += Math.pow(26, b.length - i - 1) * (b[i].charCodeAt() - 64);
	}
	return s;
}

function reCol(b) {
	var s = '';
	while (b > 0) {
		b = b - 1;
		s = String.fromCharCode(b % 26 + 65) + s;
		b = (b - (b % 26)) / 26;
	}
	return s ? s : 'A';
}

function createEmptySheet(range) {
	var width = range[1];
	var height = range[3];

	changedSq = range;

	$("#main-sheet").innerHTML = '';

	for (var i = 1; i <= height; i++) {
		var row = document.createElement("DIV");
		row.classList.add('row');
		row.id = String(i);
		for (var j = 1; j <= width; j++) {
			var cell = document.createElement("DIV");
			var linej = reCol(j);
			cell.id = linej + i;
			cell.classList.add('cell');
			cell.classList.add(`Col${linej}`);
			cell.classList.add(`Row${i}`);
			row.appendChild(cell);
		}
		$("#main-sheet").appendChild(row);
	}

	autoFill();
}

function autoFill() {
	var lastcell = $$(".cell")[$$('.cell').length - 1];
	while ($('#main-sheet').clientWidth + $('#main-sheet').scrollLeft + 10 >
		lastcell.offsetLeft + lastcell.offsetWidth) {
		newColumn();
		lastcell = $$(".cell")[$$('.cell').length - 1];
	};
	while ($('#main-sheet').clientHeight + $('#main-sheet').scrollTop + 10 >
		lastcell.offsetTop - $('#main-sheet').offsetTop + lastcell.offsetHeight) {
		newRow();
		lastcell = $$(".cell")[$$('.cell').length - 1];
	}
	reformSheet();
}

function getCol(e) {
	return e.id.match(/[A-Z]*/)[0];
}

function getRow(e) {
	return Number(e.id.replace(e.id.match(/[A-Z]*/)[0], ''));
}

function getUp(e) {
	var new_id = getCol(e) + (getRow(e) - 1)
	return $('#' + new_id);
}

function getDown(e) {
	var new_id = getCol(e) + (getRow(e) + 1)
	return $('#' + new_id);
}

function getLeft(e) {
	return e.previousSibling
}

function getRight(e) {
	return e.nextSibling
}

function autoShrink() {
	function selfDestruct(element) {
		element.parentElement.removeChild(element);
	}
	var lastcell = $$(".cell")[$$('.cell').length - 1];
	while ($('#main-sheet').clientWidth + $('#main-sheet').scrollLeft + 10 <= lastcell.offsetLeft) {
		var lcCol = getCol(lastcell);
		if (changedSq[1] >= col(lcCol))
			break;
		delColumn();
		lastcell = $$(".cell")[$$('.cell').length - 1];
	};
	while ($('#main-sheet').clientHeight + $('#main-sheet').scrollTop + 10 <= lastcell.offsetTop - $('#main-sheet')
		.offsetTop) {
		var lcRow = getRow(lastcell);
		if (changedSq[3] >= lcRow)
			break;
		delRow();
		lastcell = $$(".cell")[$$('.cell').length - 1];
	}
}

function newColumn() {
	$$('.row').forEach(ele => {
		var cell = document.createElement('DIV');
		var lastcell = $$(".cell")[$$('.cell').length - 1];
		var linej = reCol(col(getCol(lastcell)) + 1);
		cell.id = linej + ele.id;
		cell.classList.add('cell');
		cell.classList.add(`Col${linej}`);
		cell.classList.add(`Row${ele.id}`);
		ele.appendChild(cell);
	})
}

function newRow() {
	var lastcell = $$(".cell")[$$('.cell').length - 1];
	var rowId = getRow(lastcell) + 1;
	var row = document.createElement("DIV");
	row.classList.add('row');
	row.id = String(rowId);
	for (var j = 1; j <= col(getCol(lastcell)); j++) {
		var cell = document.createElement("DIV");
		var linej = reCol(j);
		cell.id = linej + rowId;
		cell.classList.add('cell');
		cell.classList.add(`Col${linej}`);
		cell.classList.add(`Row${rowId}`);
		row.appendChild(cell);
	}
	$("#main-sheet").appendChild(row);
}

function delColumn() {
	$$('.row').forEach(ele => {
		ele.removeChild(ele.lastChild);
	})
}

function delRow() {
	$("#main-sheet").removeChild($$('.row')[$$('.row').length - 1]);
}

var mouse = false;
var onChoose = 'A1';
var specialChoose = false;

document.addEventListener("mousedown", e => {
	finputOnFocus = false;
	switch (e.target.classList[0]) {
		case 'cell':
			focusCell(mouse = e.target);
			break;
		case 'text':
			focusCell(mouse = e.target.parentElement);
			break;
		case 'finput':
			finputOnFocus = true;
			break;
		case 'cellname':
			finputOnFocus = true;
			break;
		default:
			return;
	}
});

function focusCell(cell) {
	if (cell.length == 0)
		throw (`!Error : Empty list for 'cell'! (from focusCell).`);
	if (typeof cell != 'object')
		throw (`!Error : TypeError of the 'cell'! (from focusCell).`);

	if (cell.offsetLeft + cell.offsetWidth > $('#main-sheet').clientWidth + $('#main-sheet').scrollLeft)
		cell.scrollIntoView();
	if (cell.offsetLeft < $('#main-sheet').scrollLeft)
		cell.scrollIntoView();
	if (cell.offsetTop + cell.offsetHeight > $('#main-sheet').clientHeight + $('#main-sheet').scrollTop + $(
			'#main-sheet').offsetTop)
		cell.scrollIntoView();
	if (cell.offsetTop < $('#main-sheet').scrollTop + $('#main-sheet').offsetTop)
		cell.scrollIntoView();

	clear_style("setValue(x, $('#finput').value);changeSq(x)");

	cell.classList.add("focus");
	cell.classList.add("choose-left");
	cell.classList.add("choose-right");
	cell.classList.add("choose-up");
	cell.classList.add("choose-down");
	onChoose = cell.id;

	$('#finput').value = getValue(cell);
	if(getValue(cell)[0]=='=')
		highlight_vars(search_var(getValue(cell)));
	$('#finput').select();
	setTimeout(`$('#finput').focus();$('#finput').select();$('#cellname').value=onChoose;`, 50);

	return true;
}

function changeSq(cell) {
	console.log("changeSq")
	var c = col(getCol(cell));
	var r = getRow(cell);
	if (cell.dataset.val) {
		var backup = changedSq.slice();

/*
		0               1
	  2	# # # # # # # # #
		# # # # # # # # #
	  3	# # # # # # # # #
*/

		changedSq[0] = Math.min(changedSq[0], c);
		changedSq[1] = Math.max(changedSq[1], c);
		changedSq[2] = Math.min(changedSq[2], r);
		changedSq[3] = Math.max(changedSq[3], r);

		// up-down
		var b = backup[1] - backup[0];
		
		_$file_workspaces[focusSheet - 1].sheet=[];
		
			for (var i = changedSq[2]; i <= changedSq[3]; i++) {
				var obj = {
					name: 'r',
					para: {
						id: String(i)
					},
					body: []
				};
				for (var j = 0; j <= b; j++) {
					var tarc = $('#' + reCol(backup[0] + j) + (i));
					if (tarc.dataset.val && (tarc.dataset.val[0] == '=' || tarc.dataset.val[0] == "'"))
						obj.body.push({
							name: 'c',
							para: {
								id: reCol(backup[0] + j)
							},
							body: [tarc.children[0].innerText, "<f>"+tarc.dataset.val+"</f>"]
						})
					else
						obj.body.push({
							name: 'c',
							para: {
								id: reCol(backup[0] + j)
							},
							body: [tarc.children.length ? tarc.children[0].innerText : '']
						})
				}
				_$file_workspaces[focusSheet - 1].sheet.push(obj);
			}

		// left
		a = backup[0] - changedSq[0];
		if (a) {
			_$file_workspaces[focusSheet - 1].sheet.forEach(row => {
				for (var i = 0; i < a; i++) {
					var tarc = $('#' + reCol(backup[0] - i - 1) + row.para.id);
					if (tarc.dataset.val && (tarc.dataset.val[0] == '=' || tarc.dataset.val[0] == "'"))
						row.body.unshift({
							name: 'c',
							para: {
								id: reCol(backup[0] - i - 1)
							},
							body: [tarc.children[0].innerText, "<f>"+tarc.dataset.val+"</f>"]
						})
					else
						row.body.unshift({
							name: 'c',
							para: {
								id: reCol(backup[0] - i - 1)
							},
							body: [tarc.children.length ? tarc.children[0].innerText : '']
						})
				}
			})
		};

		// right
		a = changedSq[1] - backup[1];
		if (a) {
			_$file_workspaces[focusSheet - 1].sheet.forEach(row => {
				for (var i = 0; i < a; i++) {
					var tarc = $('#' + reCol(backup[1] + i + 1) + row.para.id);
					if (tarc.dataset.val && (tarc.dataset.val[0] == '=' || tarc.dataset.val[0] == "'"))
						row.body.push({
							name: 'c',
							para: {
								id: reCol(backup[1] + i + 1)
							},
							body: [tarc.children[0].innerText, "<f>"+tarc.dataset.val+"</f>"]
						})
					else
						row.body.push({
							name: 'c',
							para: {
								id: reCol(backup[1] + i + 1)
							},
							body: [tarc.children.length ? tarc.children[0].innerText : '']
						})
				}
			})
		};
	} else {

		/*
		  c	0         1
		r	
		2	# # # # # #
			# # # # # #
			# # # # # #
		3	# # # # # #
			*/


		var flag1 = true; // is empty? Can delete?
		var flag2 = true;
		while ((flag1 == true) || (flag2 == true)) {
			if (changedSq[0] == c) {
				for (var ro = changedSq[2]; ro <= changedSq[3]; ro++) {
					var ce = $('#' + reCol(c) + ro);
					if (ce.dataset.val) {
						flag1 = false;
						break;
					}
				}
				if (flag1 && changedSq[1] - changedSq[0] > 0) {
					changedSq[0]++;
					_$file_workspaces[focusSheet - 1].sheet.forEach(row => {
						row.body.shift()
					});
				}
				c++;
			} else {
				flag1 = false;
			}
			if (changedSq[1] == c) {
				for (var ro = changedSq[2]; ro <= changedSq[3]; ro++) {
					var ce = $('#' + reCol(c) + ro);
					if (ce.dataset.val) {
						flag2 = false;
						break;
					}
				}
				if (flag2 && changedSq[1] - changedSq[0] > 0) {
					changedSq[1]--;
					_$file_workspaces[focusSheet - 1].sheet.forEach(row => {
						row.body.pop()
					});
				}
				c--;
			} else {
				flag2 = false;
			}
		}

		flag1 = true;
		flag2 = true;
		c = col(getCol(cell));
		r = getRow(cell);
		while ((flag1 == true) || (flag2 == true)) {
			if (changedSq[2] == r) {
				for (var co = changedSq[0]; co <= changedSq[1]; co++) {
					var ce = $('#' + reCol(co) + r);
					if (ce.dataset.val) {
						flag1 = false;
						break;
					}
				}
				if (flag1 && changedSq[3] - changedSq[2] > 0) {
					changedSq[2]++;
					_$file_workspaces[focusSheet - 1].sheet.shift();
				}
				r++;
			} else {
				flag1 = false;
			}
			if (changedSq[3] == r) {
				for (var co = changedSq[0]; co <= changedSq[1]; co++) {
					var ce = $('#' + reCol(co) + r);
					if (ce.dataset.val) {
						flag2 = false;
						break;
					}
				}
				if (flag2 && changedSq[3] - changedSq[2] > 0) {
					changedSq[3]--;
					_$file_workspaces[focusSheet - 1].sheet.pop();
				}
				r--;
			} else {
				flag2 = false;
			}
		}
	}
	_$file_workspaces[focusSheet - 1].content.range =
		`${reCol(changedSq[0])}${changedSq[2]}:${reCol(changedSq[1])}${changedSq[3]}`;

}

function getValue(cell) {
	return cell.dataset.val == undefined ? '' : cell.dataset.val;
}

function setValue(cell, val) {
	_cell = cell;
	if (getValue(cell) == val)
		return val;

	// _$file_workspaces[focusSheet-1].sheet[getRow(cell)].body[col(getCol(cell))-1].body[0]=

	if (sheetSave)
		sheetSave = false, $('#title').innerText += '*', window.onbeforeunload = function() {
			return true
		};

	cell.innerHTML = `<text class='text'></text>`;
	try {
		var result = fParser(val);
		if (result.err == 0)
			cell.children[0].innerText = result.val;
		else
			cell.innerHTML = result.val;
		return cell.dataset.val = val;
	} catch (e) {
		if (e.name == 'SCBD(Spec-1)') {
			specialChoose = {
				"type": 'SCBD',
				cell: onChoose
			};
			cell.children[0].innerText = cell.dataset.val = val;
		}
	}
}

document.addEventListener("mouseup", e => {
	mouse = null;
	if ($(".cell.focus").length == 1)
		$("#cellname").value = $(".cell.focus").id.replace(':', ' x ');
	if (onChoose.split(':')[0] == onChoose.split(':')[1])
		onChoose = onChoose.split(':')[0];
	if (specialChoose) {
		log("SPChoose", specialChoose)
		try {
			spChoose(specialChoose, onChoose);
		} catch (err) {}
		specialChoose = false;
	}
});
document.addEventListener("mousemove", e => {

	if (!mouse)
		return;
	if (e.target.classList[0] != 'cell')
		return;


	clear_style();

	chooseCell(e);
});


function clear_style(sc) {
	$$(".cell.choose").forEach(x => {
		x.classList.remove('choose');
	})
	if (sc)
		$$(".cell.focus").forEach(x => {
			eval(sc);
			x.classList.remove('focus');
		})
	$$(".cell.choose-up").forEach(x => {
		x.classList.remove('choose-up');
	})
	$$(".cell.choose-down").forEach(x => {
		x.classList.remove('choose-down');
	})
	$$(".cell.choose-left").forEach(x => {
		x.classList.remove('choose-left');
	})
	$$(".cell.choose-right").forEach(x => {
		x.classList.remove('choose-right');
	})


	$$(".cell.sp-choose").forEach(x => {
		x.classList.remove('sp-choose');
	})
	$$(".cell.sp-choose-up").forEach(x => {
		x.classList.remove('sp-choose-up');
	})
	$$(".cell.sp-choose-down").forEach(x => {
		x.classList.remove('sp-choose-down');
	})
	$$(".cell.sp-choose-left").forEach(x => {
		x.classList.remove('sp-choose-left');
	})
	$$(".cell.sp-choose-right").forEach(x => {
		x.classList.remove('sp-choose-right');
	})
}

document.getElementById('finput').oninput = function() {
	$('#' + onChoose).innerHTML = `<text class='text'>${this.value}</text>`;
}
document.getElementById('cellname').onchange = function() {
	var backup = onChoose;
	onChoose = this.value.toUpperCase();
	try {
		focusCell($('#' + onChoose));
	} catch (err) {
		onChoose = backup;
		log(err);
		focusCell($('#' + onChoose));
	}
}
document.addEventListener("keydown", function(e) {
	log(e.keyCode)
	if (!finputOnFocus)
		switch (e.keyCode) {
			case 37: // left
				focusCell(getLeft($('#' + onChoose)));
				break;
			case 38: // up
				focusCell(getUp($('#' + onChoose)));
				break;
			case 39: // right
				focusCell(getRight($('#' + onChoose)));
				break;
			case 40: // down
				focusCell(getDown($('#' + onChoose)));
				break;
		}
	switch (e.keyCode) {
		case 9: // tab
			focusCell(getRight($('#' + onChoose)));
			break;
		case 13: // enter
			focusCell(getDown($('#' + onChoose)));
			break;
	}
})

document.getElementById("main-sheet").addEventListener("scroll", function() {
	autoFill();
	autoShrink();
});

function chooseCell(e) {
	var to = e.target;
	sq = range_sq(`${to.id}:${mouse.id}`);
	onChoose = `${to.id}:${mouse.id}`;
	$("#cellname").value = onChoose.replace(':', ' x ');

	for (var i = sq[0]; i <= sq[1]; i++) {
		for (var j = sq[2]; j <= sq[3]; j++) {
			$('#' + reCol(i) + j).classList.add("choose");
			if (i == sq[0]) {
				$('#' + reCol(i) + j).classList.add("choose-left");
			}
			if (i == sq[1]) {
				$('#' + reCol(i) + j).classList.add("choose-right");
			}
			if (j == sq[2]) {
				$('#' + reCol(i) + j).classList.add("choose-up");
			}
			if (j == sq[3]) {
				$('#' + reCol(i) + j).classList.add("choose-down");
			}
		}
	}
}

function reformSheet() {
	calcScrollX($("#main-sheet").scrollWidth);
}

function Sheet(sheet) {
	var code = sheet.body[0].body;
	this.content = {};
	this.content.name = code[0].body[0].body[0];
	this.content.range = code[0].body[1].body[0];
	this.sheet = code.slice(1, code.length);
}

function spChoose(info, cell) {
	switch (info.type) {
		case 'SCBD':
			$("#" + info.cell).dataset.val += cell;
			focusCell($("#" + info.cell));
			$("#finput").oninput();
			setTimeout("$('#finput').selectionStart=$('#finput').selectionEnd", 50);
			break;
	}
}

function highlight_vars(li) {
	li.forEach(x => {
		var sq = range_sq(x);
		for (var i = sq[0]; i <= sq[1]; i++) {
			for (var j = sq[2]; j <= sq[3]; j++) {
				$('#' + reCol(i) + j).classList.add("sp-choose");
				if (i == sq[0]) {
					$('#' + reCol(i) + j).classList.add("sp-choose-left");
				}
				if (i == sq[1]) {
					$('#' + reCol(i) + j).classList.add("sp-choose-right");
				}
				if (j == sq[2]) {
					$('#' + reCol(i) + j).classList.add("sp-choose-up");
				}
				if (j == sq[3]) {
					$('#' + reCol(i) + j).classList.add("sp-choose-down");
				}
			}
		}
	})
}
