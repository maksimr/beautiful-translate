var app = dactyl.plugins.app;

//SETTINGS {{{
var settings = {
	cmdname: "translate",
	flytranslate: true,
	langpair: "en|ru",
	conv: "en|ru",
	tl: "en",
	sl: "ru",
	hl: "en",
	eve: 'onkeyup',
	update: function (value) {
		this.langpair = ((value) ? value: "en|ru").split("|");
		this.conv = "en|" + this.langpair[1];
		this.tl = this.langpair[0];
		this.hl = this.langpair[0];
		this.sl = this.langpair[1];
	}
};
//}}}
//TODO:REWRITE ECHO MESSAGE {{{
var echoTranslator = {
	time: 800,
	node: null,
	style: {
		display: "block",
		//height_min: "48px",
		position: "fixed",
		left: 0,
		bottom: 0,
		//background: "url('"+ICO_TERMINAL+"') no-repeat 0 0 #f2f2f2",
		background: "#f2f2f2",
		border: "1px solid #dcdcdc",
		color: "#3A3A3A",
		font_size: "16px",
		//padding: "12px 5px 12px 54px",
		padding: "2px",
		opacity: 1,
		z_index: 100000
	},
	echo: function (message) {
		var style = this._toStyle(this.style);
		var doc = window.content.document;
		var time = this.time;
		var count = this.time;
		var node = window.content.document.getElementById('beautiful-translate-node');
		if (!node) {
			this.remove();
			this.node = node = doc.createElement("div");
			node.setAttribute('id', 'beautiful-translate-node');
			node.innerHTML = message;
			doc.body.appendChild(node);
		} else {
			node.innerHTML = message;
			clearInterval(this.handle);
		}
		node.setAttribute('style', style);
		this.handle = setInterval(app.hitch(this, function () {
			if (count <= 0) {
				this.remove();
			}
			node.style.opacity = count / time;
			count--;
		}), 100);
	},
	remove: function () {
		if (this.node) {
			var orign = this.node.parentNode;
			orign.removeChild(this.node);
			clearInterval(this.handle);
			this.node = null;
		}
	},
	_toStyle: function (obj) {
		var style = "";
		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				style += i.replace("_", "-") + ":" + obj[i] + ";";
			}
		}
		return style;
	}
};
// }}}
function _build() {
	//CREATE CMDLINE {{{
	var dactyl_container = app.byId('dactyl-container');
	var hbox = app.create("hbox", {
		"class": "dactyl-container",
		hidden: false,
		collapsed: true,
		highlight: "Normal CmdNormal"
	},
	dactyl_container);
	var label = app.create("label", {
		"class": "dactyl-commandline-prompt plain",
		flex: 0,
		crop: "end",
		value: ">>",
		highlight: "Normal CmdNormal"
	},
	hbox);
	var textbox = app.create("textbox", {
		id: "google-translator-console",
		"class": "dactyl-commandline-command plain",
		//type: "input",
		type: "autocomplete",
		autocompletesearch: "form-history",
		showcommentcolumn: "true",
		tabscrolling: "true",
		flex: 1,
		placeholder: "google-translator",
		timeout: 10,
		focused: true,
		collapsed: false
	},
	hbox);
	//}}}
	textbox.onblur = function (evt) {
		hbox.setAttribute("collapsed", true);
		textbox.value = "";
	};

	textbox[settings.eve] = function (evt) {
		if (evt.keyCode == 32) {
			var regex = /(\w+)(?:\D)?(?:\s)*?$/img;
			var lwordArray = regex.exec(evt.target.value);
			if (lwordArray) {
				var url = 'http://www.google.com/transliterate?tlqt=1&langpair=' + encodeURIComponent(settings.conv) + '&text=' + encodeURIComponent(lwordArray[1]) + '%2C&tl_app=8&num=' + (settings.count || 5) + '&version=3';
				var xhr = app.xhrGet({
					url: url,
					load: app.hitch(this, function (response) {
						var txt = app.fromJson(response)[0];
						var text = (txt.hws) ? txt.hws[0] : " ";
						var match = txt.ew;
						evt.target.value = evt.target.value.replace(match, text);
					})
				});
			}
		}
	};

	textbox.onchange = function (e) {
		var args = textbox.value;
		var single = (args.match(/\S+/ig).length > 1) ? "": "&ssel=0&tsel=0&notlr=0";
		var url = "http://translate.google.com/translate_a/t?client=t&text=" + encodeURIComponent(args) + "&hl=" + settings.hl + "&sl=" + settings.sl + "&tl=" + settings.tl + "&multires=1&otf=1&trs=1" + single + "&sc=1";

		var xhr = app.xhrPost({
			url: url,
			load: app.hitch(this, function (response) {
				//0: [[translate,word,"",cyrillic]]
				//1: [[(noun|verb),[value]],[phrases,[value]]]
				//multires
				//0: [[translate,word,"",cyrillic]]
				//5: []
				var txt = app.fromJson(response)[0];
				var tr = txt[0][0];
				echoTranslator.echo(tr);
			})
		});
	};

	textbox._show = function () {
		hbox.setAttribute("collapsed", false);
		textbox.focus();
	};

	return 1;
}

//FIXME: I'm compelled to do because node("dactyl-container") on moment when call this file there is no 
var flag;

commands.add(["btran[slate]"], "Google Translator", function (args) {
  if (args['-langpair']){
    settings.update(args['-langpair']);
  }
  flag = (flag) ? true: Boolean(_build());
  var cmdline = app.byId('google-translator-console');
  cmdline._show();
},{
   options: [[["-langpair"], commands.OPTION_STRING]]
});

// vim: set fdm=marker sw=2 ts=2 sts=2 et:
