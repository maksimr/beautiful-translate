/* AUTHOR:  Maksim Ryzhikov
 * NAME:    simple-translate(beautiful-translate)
 * VERSION: 3.1
 * URL: https://github.com/maksimr
 */

(function () {
	"use strict";

	var Cc = Components.classes,
	Ci = Components.interfaces,
	goog = {};

	goog.tranlator = {
		langpair: "en|ru",
		conv: "ru",
		count: 5,
		/**
     * @param {array} query
     * @param {string} langpair
     * @returns {XMLHttpRequest}
     */
		_translate: function (query, langpair) {
			var [hl, tl] = (langpair || this.langpair).split("|"),
			sl = hl;
			return util.httpGet("http://translate.google.com/translate_a/t?client=t&text=" + encodeURIComponent(query.join(' ')) + "&hl=" + hl + "&sl=" + sl + "&tl=" + tl + "&multires=1&otf=1&trs=1&sc=1", {
				callback: function (response) {
					var arr = eval(response.responseText);
					dactyl.echomsg(arr[0][0][0]);
				}.bind(this)
			});
		},
		translate: function (query, langpair) {
			return this._translate(query, langpair);
		},
		/**
     * @param {object} context
     * @param {array} args
     * @returns {XMLHttpRequest}
     */
		converter: function (context, args) {
			var uri = 'http://www.google.com/transliterate?tlqt=1&langpair=' + encodeURIComponent("en|" + this.conv) + '&text=' + encodeURIComponent(args.pop()) + '%2C&tl_app=8&num=' + (this.count || 5) + '&version=3';
			return util.httpGet(uri, {
				callback: function (response) {
					var txt, filter, match;
					txt = JSON.parse(response.responseText.replace(/,[\n]*(?=\]|\}|,)/g, ''))[0];
					filter = (txt.hws) ? txt.hws[0] : " ";
					match = txt.ew;
					context.filter = filter;
					context.completions = txt.hws.map(function (t) {
						return [t, 'converted text'];
					});
				}
			},
			this);
		}
	};

	/*
   * Dactyl command declaration
   */
	group.commands.add(["translate", "tr"], "Google Translator", function (args) {
		if ((args['-conv'] || args['-C']) && !(args['-langpair'] || args['-L'])) {
			args['-langpair'] = goog.tranlator.langpair.replace(/([a-z]{2})\|([a-z]{2})/i, '$2|$1');
		}
		goog.tranlator.translate(args, args['-langpair'] || args['-L']);
	},
	{
		argCount: "2",
		completer: function (context, args) {
			if (args['-conv'] || args['-C']) {
				goog.tranlator.converter(context, args);
				context.incomplete = true;
			}
		},
		options: [{
			names: ['-langpair', '-L'],
			description: "To determine translation languages",
			type: CommandOption.STRING
		},
		{
			names: ['-conv', '-C'],
			description: "Allow the writing of Latin"
		}]
	});

	group.options.add(["langpair", "lang"], "Determine translation languages", "string", "en|ru", {
		setter: function (value) {
			goog.translator.langpair = value;
			return value;
		}
	});
	group.options.add(["conv", "cnv"], "Define languages for writing of Latin", "string", "ru", {
		setter: function (value) {
			goog.translator.conv = value;
			return value;
		}
	});
} ());
