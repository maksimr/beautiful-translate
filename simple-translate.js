/* AUTHOR:  Maksim Ryzhikov
 * NAME:    simple-translate(beautiful-translate)
 * VERSION: 2.0
 * URL: https://github.com/maksimr
 */
var app = dactyl.plugins.app;

var Translator = function () {};
/*
 * @in translate mode
 */
Translator.prototype.langpair = "en|ru";
/*
 * @in convert mode
 */
Translator.prototype.conv = "ru";
Translator.prototype.count = "5";
/**
 * @param {array} query
 * @param {string} langpair
 * @returns {XMLHttpRequest}
 */
Translator.prototype.translate = function (query, langpair) {
	return util.httpGet("http://ajax.googleapis.com/ajax/services/language/translate?v=1.0&q=" + encodeURIComponent(query.join(" ")) + "&langpair=" + encodeURIComponent(langpair || this.langpair), {
		callback: function (response) {
			dactyl.echomsg(JSON.parse(response.responseText).responseData.translatedText);
		}
	});
};
/**
 * @param {object} context
 * @param {array} args
 * @returns {XMLHttpRequest}
 */
Translator.prototype.converter = function (context, args) {
	var uri = 'http://www.google.com/transliterate?tlqt=1&langpair=' + encodeURIComponent("en|" + this.conv) + '&text=' + encodeURIComponent(args.pop()) + '%2C&tl_app=8&num=' + (this.count || 5) + '&version=3';
	return util.httpGet(uri,{
		callback: function (response) {
			var txt = JSON.parse(response.responseText.replace(/,[\n]*(?=\]|\}|,)/g, ''))[0];
			var text = (txt.hws) ? txt.hws[0] : " ";
			var match = txt.ew;
			context.filter = text;
			context.completions = [[t, "converted text"] for each (t in txt.hws)];
		}
	},this);
};
var tr = new Translator();

group.commands.add(["translate", "tr"], "Google Translator", function (args) {
	tr.translate(args, args['-langpair'] || args['-L']);
},
{
	//literal: 0,
	argCount: "2",
	completer: function (context, args) {
		if (args['-conv'] || args['-C']) {
			tr.converter(context, args);
		}
	},
	options: [{
		names: ['-langpair', '-L'],
		description: "To determine translation languages",
		type: commands.OPTION_STRING
	},
	{
		names: ['-conv', '-C'],
		description: "Allow the writing of Latin"
	}]
});
options.add(["langpair", "lang"], "Determine translation languages", "string", "en|ru", {
	setter: function (value) {
		Translator.prototype.langpair = value;
		return value;
	}
});
options.add(["conv", "cnv"], "Define languages for writing of Latin", "string", "ru", {
	setter: function (value) {
		Translator.prototype.conv = value;
		return value;
	}
});
// vim: set fdm=marker sw=2 ts=2 sts=2 et:
