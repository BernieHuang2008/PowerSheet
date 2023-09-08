function fParser(f, op) {
	if (op)
		return eval(op);

	function compiler(code, op) {
		var vars = [];
		if (op == undefined)
			return AST(token(code));
		if (op == 'search vars') {
			AST(token(code));
			return vars;
		}

		function token(code) {
			var tokens = []
			var i = 0
			var mark1=false;
			while (i < code.length && i < code.length) {
				let ch = code[i]
				mark1=false;
				if(/,/.test(ch)){
					mark1=true;
				}
				else if (/\(|\)/.test(ch)) {
					if(mark1){
						var e = new Error('SelectCellByHand');
						e.name = 'SCBD(Spec-1)';
						console.log(e.message)
						throw (e);
					}
					tokens.push({
						type: 'paren',
						value: ch,
					})
				} else if (/[0-9]/.test(ch)) {
					var value = "";
					while (/[0-9]/.test(ch) && i < code.length) {
						value += ch
						ch = code[++i]
					}
					tokens.push({
						type: 'number',
						value: value,
					})
					i--;
				} else if (/\"|\'/.test(ch)) {
					var value = '';
					var startch = ch;
					i++;
					ch = code[i];
					while (ch != startch && i < code.length) {
						value += ch
						ch = code[++i]
					}
					tokens.push({
						type: 'string',
						value: value,
					})
				} else if (/\+|\-|\*|\//.test(ch)) {
					tokens.push({
						type: 'operator',
						value: ch,
					})
				} else if (/[a-z]|_/i.test(ch)) {
					var value = '';
					while (/[a-z]|_|[0-9]|:/i.test(ch) && i < code.length) {
						value += ch;
						ch = code[++i];
					}
					while (ch == ' ' && i < code.length)
						ch = code[++i];
					tokens.push({
						type: ch == '(' ? "name" : "var",
						value: value,
					})
					i--;
				}
				i++;
			}
			return tokens;
		} // function token

		function AST(tokens) {
			let ast = {
				type: "Program",
				body: [],
			};
			var i = 0;
			while (i < tokens.length && i < code.length) {
				var walkrs = walk();
				if (walkrs)
					ast.body.push(walkrs);
			}

			function walk() {
				var token = tokens[i];
				if (token.type == "operator") {
					i++;
					return {
						type: "Operator",
						name: token.value
					}
				}
				if (token.type == "var") {
					i++;
					vars.push(token.value);
					return {
						type: "Variable",
						value: token.value,
					}
				}
				if (token.type == "number") {
					i++;
					return {
						type: "NumberLiteral",
						value: token.value,
					}
				}
				if (token.type == "string") {
					i++;
					return {
						type: "StringLiteral",
						value: token.value,
					}
				}
				if (token.type == "paren" && token.value == '(' && tokens[i - 1].type == "name") {
					let node = {
						type: 'CallExpression',
						name: tokens[i - 1].value,
						params: [],
					};

					token = tokens[++i];

					while (
						((token.type != 'paren') ||
							(token.type == 'paren' && token.value != ')')) &&
						i < code.length
						// (a normal token, or, a non-close paren) and in range
					) {
						var wkrs = walk();
						if (wkrs)
							node.params.push(wkrs);
						token = tokens[i];
					}

					i++;
					return node;
				}
				i++;
				return;
			}

			return ast;
		} // function AST

	} // function compiler

	if (f[0] == "'") {
		return {
			val: f.substring(1, f.length),
			err: 0
		};
	}
	if (f[0] == '=') {
		try {
			return {
				val: run(compiler(f.substring(1, f.length))),
				err: 0
			};
		} catch (err) {
			if (err.message == "Cannot read properties of undefined (reading 'type')") {
				var e = new Error('SelectCellByHand');
				e.name = 'SCBD(Spec-1)';
				console.log(e.message)
				throw (e);
			}

			console.log('F-ERROR:', err.name, '\n\nDetails:\n', err.message, err);
			return {
				val: '<error class="text">#ERROR! (' + err.message + ')</error>',
				err: 1
			};
		}
	}

	return {
		val: f,
		err: 0
	};
}

function run(ast) {
	var res = [];
	for (var i = 0; i < ast.body.length; i++) {
		res.push(_run(ast.body[i]));
	}
	return _merge(res);
}

function _run(code) {
	switch (code.type) {
		case 'CallExpression':
			var pl = [];
			code.params.forEach(p => {
				var ret=_run(p);
				pl.push(ret);
			})
			var rt;
			try {
				eval(`rt=_$func$_${code.name.toUpperCase()}(${pl.join()})`);
			} catch (e) {
				if (e.name == 'ReferenceError') {
					var err = new Error('Function not found.');
					err.name = 'FNF(0x02)';
					throw (err);
				} else {
					throw (e);
				}
			}
			return rt;
		case 'StringLiteral':
			return `"${code.value}"`;
		case 'NumberLiteral':
			return code.value;
		case 'Variable':
			return `{"type":"cell","val":"${code.value.toUpperCase()}"}`;
		case 'Operator':
			return `"${code.name}"`;
		default:
			var err = new Error('Could Not Run Expression.');
			err.name = 'CNRE(0x01)';
			throw (err);
	}
}

function _merge(li) {
	if (li.length == 1) {
		try {
			var x = JSON.parse(li[0]);
			if (x.type == 'cell')
				return $("#" + x.val).children[0].innerText;
		} catch (err) {
			return li[0];
		}
	}
	var arr = new Array();
	for (var i = 0; i < li.length; i++)
		arr.push(li[i]);
	li = arr;

	for (var i = 0; i < li.length; i++) {
		try {
			if (li[i][0] == '"')
				li[i] = li[i].replaceAll('"', '');
		} catch (err) {
			console.log(err)
		};
		switch (li[i]) {
			case '+':
				var x1 = li[i - 1];
				var x2 = li.splice(i, 2)[1];
				if (Number(x1) + Number(x2) != NaN)
					li[i - 1] = Number(x1) + Number(x2);
				else
					li[i - 1] = x1 + x2;
				break;
			case '-':
				li[i - 1] = Number(li[i - 1]) - Number(li.splice(i, 2)[1]);
				break;
			case '*':
				li[i - 1] = Number(li[i - 1]) * Number(li.splice(i, 2)[1]);
				break;
			case '/':
				li[i - 1] = Number(li[i - 1]) / Number(li.splice(i, 2)[1]);
				break;
			default:
				i++;
		}
		i--;
	}
	log(li);
	return li[0];
}


function search_var(code) {
	return fParser(0, `compiler("${code}", "search vars")`);
}


/* Functions */
// 				_$func$_				
/* 
 * SUM() .............................. sum
 * HELLO() ............................ say hello
 * SHOW() ............................. show message
 * AVERAGE() .......................... average
 * 
 */

function _$func$_SUM() {
	var tot = 0;
	for (var i = 0; i < arguments.length; i++) {
		var x = arguments[i];
		if (typeof x == 'string') {
			var err = new Error('Errow while running Function: "SUM" cannot accept a "string" parameter.')
			err.name = 'EWRF(0x02)';
			throw (err);
		}
		if (typeof x == 'number') {
			tot += x;
		}
		if (x.type == 'cell') {
			if (x.val.indexOf(':') == -1) {
				var n = 0;
				try {
					n = Number($("#" + x.val).children[0].innerText);
				} catch (e) {}

				if (n == NaN) {
				} else {
					tot += n;
				}
			} else {
				var range = range_sq(x.val);
				for (var j = range[0]; j <= range[1]; j++) {
					var colId = reCol(j);
					for (var k = range[2]; k <= range[3]; k++) {
						var cellId = colId + String(k);
						var n = 0;
						try {
							n = Number($("#" + cellId).children[0].innerText);
						} catch (e) {}

						if (n == NaN) {
						} else {
							tot += n;
						}
					}
				}
			}
		}
	}
	return tot;
}

function _$func$_HELLO(s) {
	if (typeof s == 'string')
		return `Hello, ${s}!`;
	if (typeof s == 'object')
		return `Hello, ${s.range}!`;
}

function _$func$_SHOW() {
	if (arguments.length == 1)
		return String(arguments[0]);
	else
		return _merge(arguments);
}

function _$func$_AVERAGE(){
	var tot = 0;
	var num = 0;
	for (var i = 0; i < arguments.length; i++) {
		var x = arguments[i];
		if (typeof x == 'string') {
			var err = new Error('Errow while running Function: "SUM" cannot accept a "string" parameter.')
			err.name = 'EWRF(0x02)';
			throw (err);
		}
		if (typeof x == 'number') {
			tot += x;
			num++;
		}
		if (x.type == 'cell') {
			if (x.val.indexOf(':') == -1) {
				var n = 0;
				try {
					if($("#" + x.val).children[0].innerText)
						n = Number($("#" + x.val).children[0].innerText);
					else
						num--;
				} catch (e) {num--;}
	
				if (n == NaN) {
				} else {
					tot += n;
					num++;
				}
			} else {
				var range = range_sq(x.val);
				for (var j = range[0]; j <= range[1]; j++) {
					var colId = reCol(j);
					for (var k = range[2]; k <= range[3]; k++) {
						var cellId = colId + String(k);
						var n = 0;
						try {
							if($("#" + cellId).children[0].innerText)
								n = Number($("#" + cellId).children[0].innerText);
							else
								num--;
						} catch (e) {num--;}
	
						if (n == NaN) {
						} else {
							tot += n;
							num++;
						}
					}
				}
			}
		}
	}
	if(num)
		return tot/num;
	else
		return 0;
}
