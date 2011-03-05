//AUTHOR:  Maksim Ryzhikov
//NAME:    _libly-app
//VERSION: 0.1
//HELPERS LIB API {{{
dactyl.plugins.app = {
	console: {
		log: function () {
			return window.Firebug.Console.logFormatted.call(window.Firebug.Console, arguments);
		}
	},
	fromJson: function (json) {
		var inline = "",
		clnwl = json.split('\n');
		for (var i = 0; i < clnwl.length; i++) {
			inline = inline + clnwl[i];
		}
		//FIXME
		var obj = JSON.parse(inline.replace(/,(?!\w+|\"|\{|\[)/g, '$&\"\"'));
		return obj;
	},
	multi: function (str, num, callback) {
		for (var i = 0, nstr = ""; i < num; i++) {
			nstr += (callback) ? callback(str, i, num, nstr) : str;
		}
		return nstr;
	},
	hitch: function (scope, callback) {
		if (typeof callback === "string") {
			scope = scope || window;
			return function () {
				return scope[callback].apply(scope, arguments || []);
			}; // Function
		}
		return function () {
			return callback.apply(scope, arguments||[]);
		};
	},
	attr: function (node, atr, value) {
		return node.setAttribute(atr, value);
	},
	forEach: function (arr, callback, thisObject) {
		if (!arr) {
			return;
		}
		for (var i in arr) {
			if (arr.hasOwnProperty(i)) {
				var args = (arr.constructor == Array) ? [arr[i], i, arr] : [i, arr[i], arr] ;
				callback.apply(thisObject || window, args);
			}
		}
	},
	hasNode: function (node, root) {
		var nodes = this.query(node.tagName, root);
		return Boolean(this.filter(nodes, function (n) {
			return n === node;
		},
		this).toString());
	},
	filter: function (arr, callback, thisObject) {
		return Array.filter(arr, function () {
			return callback.apply(thisObject || window, arguments);
		});
	},
	byId: function (id, doc) {
		if (typeof id == "string") {
			return (doc || document).getElementById(id); // DomNode
		} else {
			return id; // DomNode
		}
	},
	query: function (str, doc) {
		//TODO:
		//Get nested node:
		//document.getElementById('main').getElementsByClassName('test');
		//Check on prent node have some class how node:
		//Array.filter( test, function(elem){ return Array.indexOf( test, elem.parentNode ) > -1; });
		//result regex: [String,Node,(ClassName|IdName),Identificator("."|"#")]
		var regex = /([\w]*)((#|.)[\S]+)?/ig;
		var cArray = regex.exec(str);
		if (cArray && !cArray[3]) {
			//we have only node
			return (doc || document).getElementsByTagName(cArray[1]);
		}
		else if (cArray) {
			//we class or id
			var name = cArray[2].slice(1);
			var nodes = (cArray[3] == "#") ? [this.byId(name, doc)] : (doc || document).getElementsByClassName(name);
			return (cArray[1]) ? Array.filter(nodes, function (elem) {
				return elem.nodeName == cArray[1].toUpperCase;
			}) : nodes;
		}
	},
	create: function (nodeName, opts, parentNode, pos) {
		var builder = (opts.builder) ? opts.builder: document;
		var node = (nodeName == "textNode") ? builder.createTextNode(opts) : builder.createElement(nodeName);
		if (opts && (typeof opts == "object")) {
			this.forEach(opts, function (key, value) {
				if (key != "builder") {
					node.setAttribute(key, value);
				}
			},
			this);
		}
		if (parentNode && parentNode.nodeType) {
			var _ins = (pos) ? parentNode.insertBefore(node, parentNode.firstChild) : parentNode.appendChild(node);
		}
		return node;
	},
	remove: function (node, parentNode) {
		return (parentNode || document).removeChild(node);
	},
	place: function (node, parentNode) {
		return (parentNode||document).appendChild(node);
	},
	//AJAX METHODS {{{
	xhrGet: function (args) {
		var xhr = new XMLHttpRequest();
		var _defaultContentType = "application/x-www-form-urlencoded";
		xhr.open("GET", args.url, true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					return args.load(xhr.responseText);
				} else {
					return null;
				}
			}
		};
		xhr.setRequestHeader("Content-Type", args.contentType || _defaultContentType);
		xhr.send(null);
	}
	//}}}
};
//}}}
