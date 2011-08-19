/* AUTHOR:  Maksim Ryzhikov
 * NAME:    simple-translate(beautiful-translate)
 * VERSION: 2.0
 * URL: https://github.com/maksimr
 */
//INFORMATION {{{
var INFO =
<plugin name="simple-translate" version="2.0"
    href="https://github.com/maksimr/beautiful-translate"
    summary="simple-translate allwo you translate text using google translator"
    xmlns={NS}>
    <author email="rv.maksim@gmail.com">Ryzhikov Maksim</author>
    <license href="http://opensource.org/licenses/mit-license.php">MIT License</license>
    <project name="Pentadactyl" minVersion="1.0"/>
    <p>
			This plugin allow you translate text from command line using google translator
			you can also use the options "Allow the writing of Latin".
			Languages support this option: 
			Russian[ru], Arabic[ar], Greek[el], Persian[fa], Serbian[sr], Urdu[ur], Hindi[hi]
    </p>
    <p>
			To determine the translation languages you can use optional arguments -langpair|-L 
			or define in your .pentadactylrc 'set langpair="en|ru"'.
			For using opton "Allow the writing of Latin" you must define in
			your .pentadactylrc 'set conv="ru"' and in command line use arguments -conv|-C
    </p>
</plugin>;
//}}}

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
  if (args['-conv']||args['-C'] && !(args['-langpair'] || args['-L'])){
    args['-langpair'] = tr.langpair.replace(/([a-z]{2})\|([a-z]{2})/i,'$2|$1');
  }
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
group.options.add(["langpair", "lang"], "Determine translation languages", "string", "en|ru", {
	setter: function (value) {
		Translator.prototype.langpair = value;
		return value;
	}
});
group.options.add(["conv", "cnv"], "Define languages for writing of Latin", "string", "ru", {
	setter: function (value) {
		Translator.prototype.conv = value;
		return value;
	}
});
// vim: set fdm=marker sw=2 ts=2 sts=2 et:
