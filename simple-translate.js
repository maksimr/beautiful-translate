/* AUTHOR:  Maksim Ryzhikov
 * NAME:    simple-translate(beautiful-translate)
 * VERSION: 1.1b
 * URL: https://github.com/maksimr
 *
 * DEPENDENCY: Latest version app-lib(0.3)
 *
 * DESCRIPTION: 
 * This plugin allow you translate text using google ajax translator,
 * you can also use the options "Allow the writing of Latin".
 * Languages support this option: 
 * Russian[ru], Arabic[ar], Greek[el], Persian[fa], Serbian[sr], Urdu[ur], Hindi[hi]
 *
 * EXAMPLE:
 * +---------------------------------------------+
 * |:translate -langpair=ru|en hello world       |
 * +---------------------------------------------+
 * OR SHORT FORM
 * +---------------------------------------------+
 * |:translate -L en|ru hello world              |
 * +---------------------------------------------+
 * EXAMPLE CONVERTION:
 * +---------------------------------------------+
 * |:translate -langpair=ru|en -convert ru privet|
 * +---------------------------------------------+
 * OR SHORT FORM
 * +---------------------------------------------+
 * |:translate -L ru|en -C ru privet             |
 * +---------------------------------------------+
 * and in autocomplete you may choice converted word
 */

var app = dactyl.plugins.app;

app.declare("tr[anslate]",null,{
	description: "Google Translator for pentadactyl",
	onExecute: function(args){
		if (args['-langpair'] || args['-L']) {
			this.set("langpair", args['-langpair'] || args['-L']);
		}
		this.translate(args);
	},
	mate: {
		completer: function (context, args) {
			if (args['-convert']||args['-C']){
				this.set("convert", args['-convert'] || args['-C']);
				this.converter(context, args);
			}
		},
		options: [{
			names: ['-langpair','-L'],
			type: commands.OPTION_STRING
		},{
			names: ['-convert','-C'],
			type: commands.OPTION_STRING
		}]
	},
	langpair: "en|ru",
	convert: "en|ru",
	hl: "en",
	tl: "ru",
	sl: "en",
	set: function (action, value) {
		this['_setAttr' + app.capitalize(action)](value);
	},
	_setAttrLangpair: function (value) {
		this.langpair = ((value) ? value: "en|ru").split("|");
		this.sl = this.langpair[0];
		this.tl = this.langpair[1];
	},
	_setAttrConvert: function (value) {
		this.convert = "en|" + value;
	},
	translate: function (args, context) {
		var single = (args.length > 1) ? "": "&ssel=0&tsel=0&notlr=0",
		tl = this.tl,
		hl = this.hl,
		sl = this.sl;
		var url = "http://translate.google.com/translate_a/t?client=t&text=" + encodeURIComponent(args.join(' ')) + "&hl=" + hl + "&sl=" + sl + "&tl=" + tl + "&multires=1&otf=1&trs=1" + single + "&sc=1";
		var xhr = app.xhrGet({
			url: url,
			load: app.hitch(this, function (response) {
				var txt = app.fromJson(response)[0];
				var tr = txt[0][0];
				dactyl.echomsg(tr);
			})
		});
	},
	converter: function (context, args) {
		var url = 'http://www.google.com/transliterate?tlqt=1&langpair=' + encodeURIComponent(this.convert) + '&text=' + encodeURIComponent(args.pop()) + '%2C&tl_app=8&num=' + (this.count || 5) + '&version=3';
		var xhr = app.xhrGet({
			url: url,
			load: app.hitch(this, function (response) {
				var txt = app.fromJson(response)[0];
				var text = (txt.hws) ? txt.hws[0] : " ";
				var match = txt.ew;
				context.filter = text;
				context.completions = [[t, "converted text"] for each (t in txt.hws)];
			})
		});
	}
});
