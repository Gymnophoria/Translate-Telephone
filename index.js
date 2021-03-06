const codes = [ "af", "sq", "am", "ar", "hy", "az", "eu", "be", "bn", "bs", "bg", "ca", "ceb", "zh-CN", "zh-TW", "co", "hr", "cs", "da", "nl", "en", "eo", "et", "fi", "fr", "fy", "gl", "ka", "de", "el", "gu", "ht", "ha", "haw", "he", "hi", "hmn", "hu", "is", "ig", "id", "ga", "it", "ja", "jw", "kn", "kk", "km", "ko", "ku", "ky", "lo", "la", "lv", "lt", "lb", "mk", "mg", "ms", "ml", "mt", "mi", "mr", "mn", "my", "ne", "no", "ny", "ps", "fa", "pl", "pt", "pa", "ro", "ru", "sm", "gd", "sr", "st", "sn", "sd", "si", "sk", "sl", "so", "es", "su", "sw", "sv", "tl", "tg", "ta", "te", "th", "tr", "uk", "ur", "uz", "vi", "cy", "xh", "yi", "yo", "zu" ];
const codesToLanguages = { "af": "Afrikaans", "sq": "Albanian", "am": "Amharic", "ar": "Arabic", "hy": "Armenian", "az": "Azeerbaijani", "eu": "Basque", "be": "Belarusian", "bn": "Bengali", "bs": "Bosnian", "bg": "Bulgarian", "ca": "Catalan", "ceb": "Cebuano", "zh-CN": "Chinese (Simplified)", "zh-TW": "Chinese (Traditional)", "co": "Corsican", "hr": "Croatian", "cs": "Czech", "da": "Danish", "nl": "Dutch", "en": "English", "eo": "Esperanto", "et": "Estonian", "fi": "Finnish", "fr": "French", "fy": "Frisian", "gl": "Galician", "ka": "Georgian", "de": "German", "el": "Greek", "gu": "Gujarati", "ht": "Haitian Creole", "ha": "Hausa", "haw": "Hawaiian", "he": "Hebrew", "hi": "Hindi", "hmn": "Hmong", "hu": "Hungarian", "is": "Icelandic", "ig": "Igbo", "id": "Indonesian", "ga": "Irish", "it": "Italian", "ja": "Japanese", "jw": "Javanese", "kn": "Kannada", "kk": "Kazakh", "km": "Khmer", "ko": "Korean", "ku": "Kurdish", "ky": "Kyrgyz", "lo": "Lao", "la": "Latin", "lv": "Latvian", "lt": "Lithuanian", "lb": "Luxembourgish", "mk": "Macedonian", "mg": "Malagasy", "ms": "Malay", "ml": "Malayalam", "mt": "Maltese", "mi": "Maori", "mr": "Marathi", "mn": "Mongolian", "my": "Myanmar (Burmese)", "ne": "Nepali", "no": "Norwegian", "ny": "Nyanja (Chichewa)", "ps": "Pashto", "fa": "Persian", "pl": "Polish", "pt": "Portuguese", "pa": "Punjabi", "ro": "Romanian", "ru": "Russian", "sm": "Samoan", "gd": "Scots Gaelic", "sr": "Serbian", "st": "Sesotho", "sn": "Shona", "sd": "Sindhi", "si": "Sinhala (Sinhalese)", "sk": "Slovak", "sl": "Slovenian", "so": "Somali", "es": "Spanish", "su": "Sundanese", "sw": "Swahili", "sv": "Swedish", "tl": "Tagalog (Filipino)", "tg": "Tajik", "ta": "Tamil", "te": "Telugu", "th": "Thai", "tr": "Turkish", "uk": "Ukrainian", "ur": "Urdu", "uz": "Uzbek", "vi": "Vietnamese", "cy": "Welsh", "xh": "Xhosa", "yi": "Yiddish", "yo": "Yoruba", "zu": "Zulu" };

$('#form').on('submit', function (event) {
	event.preventDefault();

	$('#submit').attr("disabled","disabled");
	let numElement = $('#num');
	let textElement = $('#text');
	let toEnglish = $('#translate').prop('checked');
	let nums = numElement.val();

	let array = getStrings(nums);

	$('.content').append('<h3>Original text: ' + textElement.val() + '</h3><table id="table"><tr class="bold"><th>Language</th><th>Text</th>' + (toEnglish ? '<th>Translation</th>' : '') + '</tr></table>');
	let table = $('#table');

	addNRows(array, table, textElement.val(), 0, toEnglish);
});

function addNRows(array, table, text, i, toEnglish) {
 	let source = i === 0 ? 'en' : array[i - 1];

	$.ajax({
		url: 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=' + source + '&tl=' + (array[i] || 'en') + '&dt=t&q=' + text,
		method: 'GET'
	}).then(function (response) {
		let text = response[0][0][0];

		if (i < array.length) table.append(`<tr><th>${codesToLanguages[array[i]]}</th><th>${text}</th></tr>`);

		if (toEnglish) {
			setTimeout(function () {
				$.ajax({
					url: 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=' + array[i] + '&tl=en&dt=t&q=' + text,
					method: 'GET'
				}).then(function (response) {
					let textTwo = response[0][0][0];

					$('tr').last().append(`<th>${textTwo}</th>`);

					i++;
					if (i < array.length) {
						setTimeout(function () {
							return addNRows(array, table, text, i, toEnglish)
						}, Math.round(Math.random() * 3001) + 3000);
					} else {
						$('.content').append(`<h3>Final text: ${textTwo}</h3>`);
						$('#submit').attr("disabled",false);
						table.removeAttr('id');
					}
				}).catch(console.error);
			}, Math.round(Math.random() * 2001) + 2000);
		} else if (i < array.length) {
			i++;
			
			setTimeout(function () {
				return addNRows(array, table, text, i, toEnglish)
			}, Math.round(Math.random() * 3001) + 3000);
		} else {
			$('.content').append(`<h3>Final text: ${text}</h3>`);
			$('#submit').attr("disabled",false);
			table.removeAttr('id');
		}
	}).catch(console.error);
}

function getStrings(num) {
	let strings = [];

	for (let i = 0; i < num; i++) {
		let chosen = codes[Math.floor(Math.random() * codes.length)];
		if (strings.includes(chosen)) i--;
		else strings.push(chosen);
	}

	return strings;
}
