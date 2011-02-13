//AUTHOR:  Maksim Ryzhikov
//VERSION: 0.4
//NAME:    beautiful-translate
//TODO: do not define langpair in .pentadactylrc on loaded
//Resolves to write Latin.

//PLUGIN DOCUMENTATION {{{
//var INFO =
//<plugin name="btranslate" version="0.3"
    //summary="Beautiful-Translate: translate text using 'Google Translator'.Supports input text using latin"
    //xmlns={NS}>
    //<author email="rv.maksim@gmail.com">Maksim Ryzhikov</author>
    //<project name="Pentadactyl" minVersion="1.0"/>
		//<item>
				//<tags>'btranslate'</tags>
				//<spec>'btranslate' <oa>langpair</oa></spec>
				//<default>"en|ru"</default>
		//</item>
		//<h2>Description</h2>
		//<strut/>
		//<p>
		 //To use the translation you have to call the command <ex>:btranslate some text</ex>
		 //also you must define option <oa>langpair</oa> in your .pentadactylrc, on default it is "en|ru", and you
		 //may change options <oa>flytranslate</oa> for turn off (set false) instance translate.
		 //This plugin allow you translate text using "Google Translator".
		 //Also you can use option "allow to write latin".
		 //About Errors please notify me by email.
		//</p>

		//<h2>Languages are supported input latin</h2>
		//<strut/>
		//<p>
		 //Russian, Arabic, Greek, Persian, Serbian, Urdu, Hindi
		//</p>
//</plugin>;
//}}}

//HELPER FUNCTIONS AND OBJECTS {{{
function hitch(scope, callback) {
	return function () {
		callback.apply(scope, arguments);
	};
}

var xhrGET = function (url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				callback(xhr.responseText);
			}
			else {
				return null;
			}
		}
	};
	xhr.send();
};
//}}}

// ECHO MESSAGE {{{
var echoTranslator = {
  time: 600,
  node: null,
  style: { 
				 display: "block",
				 position: "fixed",
				 left: 0,
				 bottom: 0,
				 color: "#3A3A3A",
				 font_size: "18px",
				 padding: "5px",
				 opacity: 1
	 },
  echo: function(message){
		var style = this._toStyle(this.style);
		var doc = window.content.document;
		var time = this.time;
		var count = this.time;
		var node = window.content.document.getElementById('beautiful-translate-node');
		if (!node){
				this.remove();
				this.node = node = doc.createElement("span");
				node.setAttribute('id','beautiful-translate-node');
				node.innerHTML = message;
				doc.body.appendChild(node);
		}else{
				node.innerHTML = message;
				clearInterval(this.handle);
		}
		node.setAttribute('style',style);
		this.handle = setInterval(hitch(this,function () { 
				if (count <= 0){
           this.remove();
				}
				node.style.opacity = count/time;
				count--; 
		}), 100);
	 },
	 remove: function(){
    if(this.node){
        var orign = this.node.parentNode;
        orign.removeChild(this.node);
        clearInterval(this.handle);
        this.node = null;
    }
   },
  _toStyle: function(obj){
		 var style = "";
		 for (var i in obj){ style += i.replace("_","-") + ":" + obj[i] +";"; }
		 return style;
	}
};
// }}}

// TRANSLATOR {{{
var translator = {
  cmdname: "btranslate",
  flytranslate: true,
	langpair: "en|ru",
	conv: "en|ru",
	tl: "en",
	hl: "ru",
	cmdline: null,
	input: null,
	eve: 'keypress',

	_initilization: function () {
		this.langpair = ((options["langpair"]) ? options["langpair"] : "en|ru").split("|");
		this.flytranslate = (options["flytranslate"]) ? options["flytranslate"] : false;
		this.conv = "en|" + this.langpair[1];
		this.tl = this.langpair[0];
		this.hl = this.langpair[1];
	},
	_listener: function (e) {
    this.input = e.originalTarget;
    if (this.input.value.search("^"+this.cmdname+" ") != -1) {
      if (this.flytranslate){
        var preValue = this.input.value.replace(this.cmdname,"");
        this.translate([preValue]);
      }
      if (e.charCode == 32) {
        var reg = /[\w\']+$/i;
        var text = this.input.value.match(reg)[0];
        this.convertor(text);
      } 
    }
	},
	constructor: function () {
		this._initilization();
		this.cmdline = this.cmdline || document.getElementById('dactyl-commandline');
		this.cmdline.addEventListener(this.eve, hitch(this,this._listener), true);
	},
  update: function(value){
		this._initilization();
    //this.cmdline.removeEventListener(this.eve, this._listener);
    //this.cmdline.addEventListener(this.eve, hitch(this,this._listener), true);
  },
	convertor: function (args) {
		this.url = 'http://www.google.com/transliterate?tlqt=1&langpair=' + encodeURIComponent(this.conv) + '&text=' + encodeURIComponent(args) + '%2C&tl_app=8&num=5&version=2';
		var xhr = new xhrGET(this.url, hitch(this, function (response) {
			var data = eval(response);
			var text = data[0][1][0];
			var match = data[0][0];
			this.input.value = this.input.value.replace(match, text);
		}));
	},
	translate: function (args) {
		this.url = "http://translate.google.com/translate_a/t?client=t&text=" + encodeURIComponent(args.join(' ')) + "&hl=" + this.hl + "&sl=" + this.sl + "&tl=" + this.tl + "&multires=1&otf=1&trs=1&sc=1";
		var xhr = new xhrGET(this.url, hitch(this,function (response) {
			var text = eval(response);
			var tr = text[0][0][0];
			echoTranslator.echo(tr);
		}));
	}
};
//}}}



commands.addUserCommand(["btr[anslate]"], "Translate Text by Google Translator", function (args) {
	translator.translate(args);
});

options.add(["langpair", "lng"], "Define languages for translate", "string", "en|ru", {
	setter: function (value) {
		translator.update(value);
		return value;
	}
});

options.add(["flytranslate", "flytr"], "Instance translate", "boolean", true, {
	setter: function (value) {
		translator.update();
		return value;
	}
});

translator.constructor();

// vim: set fdm=marker sw=2 ts=2 sts=2 et:
