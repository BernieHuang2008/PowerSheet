function SFACodeObject(code) {
	var vars = [];

	function token(code) {
		var tokens = []
		var i = 0
		var mark1 = false;
		while (i < code.length && i < code.length) {
			let ch = code[i]
			mark1 = false;
			if (/,/.test(ch)) {
				mark1 = true;
			} else if (/\(|\)/.test(ch)) {
				if (mark1) {
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


	this.parse = AST(token(code));
	this.var = vars;

	return this;

} // function compiler


function getUrlParam(name) {
	var x = window.location.search.substr(1).match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)"));
	if (x)
		return decodeURI(x[2]);
	return null;
}


async function checkCodeURL() {
	var code = getUrlParam("script");
	if (code) {
		var par = new SFACodeObject(code);
		await SFARunCode(par);
		return par;
	} else {
		return null;
	}
}



/* 
	Script For Application,
	special Vertion for "PowerSheet".
	
	=====  SFA Code Runner For "PowerSheet"  =====
*/


async function SFARunCode(obj) {
	async function _run(code) {
		switch (code.type) {
			case 'CallExpression':
				var pl = [];
				code.params.forEach(p => {
					var ret=_run(p);
					pl.push(ret);
				})
				var rt;
				try {
					rt=await window[`_$SFAfunc$_${code.name}`](pl);
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
			default:
				var err = new Error('Could Not Run Expression.');
				err.name = 'CNRE(0x01)';
				throw (err);
		}
	}
	
	for(var i=0;i<obj.parse.body.length;i++)
		await _run(obj.parse.body[i]);
}

async function _$SFAfunc$_hello(s){
	await alert("hello, "+s[0], true);
}

async function _$SFAfunc$_echo(s){
	await alert(s[0], true);
}


