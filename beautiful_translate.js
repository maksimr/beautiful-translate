//AUTHOR:  Maksim Ryzhikov
//VERSION: 0.4
//NAME:    beautiful-translate
//TODO: do not define langpair in .pentadactylrc on loaded
//Resolves to write Latin.

//ICONS {{{
	var ICO_TERMINAL = 'data:image/png;base64,' +
	'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgI'+
	'fAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3'+
	'Lmlua3NjYXBlLm9yZ5vuPBoAAAAOdEVYdFRpdGxlAFRlcm1pbmFs1fugkQAA'+
	'ABd0RVh0QXV0aG9yAExhcG8gQ2FsYW1hbmRyZWnfkRoqAAAAKXRFWHREZXNj'+
	'cmlwdGlvbgBCYXNlZCBvZiBKYWt1YiBTdGVpbmVyJ3Mgd29yayfTJ5kAAAhx'+
	'SURBVGje7VpdbxzVGX7nY2fXju398MeSJlHSC5CCqbiA9g+0VVXUcg3qTSUg'+
	'V3CDKEhIkYhAROIOCW5QQ3JD0gtapEoVaiv1D7RUpIi0JQQ5Ch9ee+PE3l17'+
	'd3Y+eJ/3nDNzxjb2BiRYJE90NGd2Z2af532f533PjOOkaUrf5839XqM/IHBA'+
	'4IAA+fbBY6d++xvHcV5N4nh23IB6ntdK0vTUuTcu/HlXAmfOnHEdcl5bPPmj'+
	'WqM+dvhpZXW5+dHV/7/O090JLC0tBa5PtZ/99OfEWSDXdcFa9t9kjnslSUJx'+
	'HMvejL2Od5uHYUj//d+Hd+0pIUrVRZcvX5ZD/Pgo26jn7baN0kgRjMXFRUoY'+
	'354EcDOMwWBAp194YSykg+C8cvbsV5ItEiB1wnA4lHF7bY1cvoEjsuA9/yM5'+
	'duTGZuCze+6+h04cP07DaEgRpz3i66MoogGn/sqVK8SFQYPg0ue59JMHf0y4'+
	'3ZC/D/F7g5CvjSjk4OEafI59yNcBOJSRJuloGcAAsLnZWf4xjyYnJ6jfH5DC'+
	'r8lY4LE/8cMTND83J6CHw4hJREKi3W5To9EoRPDY0WN05OgR1jUDDwcSrMEA'+
	'REIhMuB9iH2/T8urqwVc+xKw5xvdLi00F+j8m+fpyaeeos8+/0xM5Whz2gOG'+
	'3dzclChGhgBn48anN6jL90l1+BGQJt8T55pIh9aAfEGiz8RAoBjcffpAolME'+
	'0wDU7BzKqUPnL1ygP779Nv3+zXP0p3fekRsh+K7JAINfmF/g62MlHyYR8+gz'+
	'mFIQUAP3SZVEjx05SnXOCMAGQVnJZxgWpDRg8BXOTn9ri3pbyxIcG9++GQAB'+
	'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'+
	'S1dOPRU7KVP6AAAAAElFTkSuQmCC';
// }}}


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
  time: 800,
  node: null,
  style: { 
				 display: "block",
         height_min: "48px",
				 position: "fixed",
				 left: 0,
				 bottom: 0,
         background: "url('"+ICO_TERMINAL+"') no-repeat 0 0 #f2f2f2",
         border: "1px solid #dcdcdc",
				 color: "#3A3A3A",
				 font_size: "16px",
				 padding: "12px 5px 12px 54px",
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
				this.node = node = doc.createElement("div");
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
