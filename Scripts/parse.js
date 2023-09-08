function Parse(s) {
	function get_token() {
		var i = 0;
		token = [];
		l = s.length;
		while (i < l) {
			if (s[i] == '<' && s[i + 1] != '/') {
				t = s[i];
				while (s[i++] != '>') t += s[i];
				token.push(t);
			} else if (s[i] == '<' && s[i + 1] == '/') {
				t = s[i];
				while (s[i++] != '>') t += s[i];
				token.push(t);
			} else { // text
				st = ""
				while (s[i] != '<') {
					st += s[i];
					i++;
				}
				token.push(st);
			}
		}
		return token;
	}

	function parseEach(tokens) {
		for (var ii = 0; ii < tokens.length; ii++) {
			t = tokens[ii];
			var l = t.length;
			if (t[0] == '<' && t[1] != '/') {
				var i = 1;
				name = '';
				while (t[i] != '>' && !t[i].match(/\s/g) && i < l) name += t[i++];
				paras = {};
				while (t[i] != '>') {
					i++;
					para = '';
					while (t[i] != '>' && !t[i].match(/\s/g) && i < l) para += t[i++];
					eval("paras." + para);
				}
				tokens[ii] = {
					name: name,
					para: paras,
					body: []
				}
			}
		}

		return tokens;
	}

	function ast(tokens) {
		s = 0
		path = []
		tree = {
			body: []
		}
		for (var ii = 0; ii < tokens.length; ii++) {
			var fa = tree;

			function walk() {
				if (typeof tokens[ii] == 'object') {
					t = tokens[ii];
					var ctag = "</" + t.name + ">";
					path.push(t);
					fa1 = fa;
					fa.body.push(t);
					fa = t;
					while (tokens[ii] != ctag) {
						ii++;
						walk();
					}
					pp = path.pop();
					fa = path[path.length - 1];
					return;
				} else if (typeof tokens[ii] == 'string') {
					t = tokens[ii];
					if (t[0] == '<' && t[1] == '/') {
						return;
					} else {
						fa.body.push(t);
						return;
					}
				}
			}

			walk();
		}
		return tree;
	}

	return ast(parseEach(get_token()));
}


function reParse(obj) {
	var txt="";
	
	function reparse_helper(obj){
		if(obj.name==undefined){
			txt+=String(obj);
			return 0;
		}
		
		
		txt+=`<${obj.name}`;
		if(JSON.stringify(obj.para) != '{}'){
			for(x in obj.para){
				txt+=` ${x}='${obj.para[x]}'`;
			}
		}
		txt+='>';
		
		obj.body.forEach(x=>{
			reparse_helper(x);
		})
		
		txt+=`</${obj.name}>`;
		
		return 0;
	}
	
	reparse_helper(obj);

	return txt;
}
