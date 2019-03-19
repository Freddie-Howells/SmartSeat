/* global Log, Module, moment */

/* Magic Mirror
 * Module: y8_german
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */
Module.register("y8_german", {

	// Module config defaults.
	defaults: {
		y8_german: {
			anytime: [
				"Hallo! \n Hello!",
				"Guten Tag \n Good day",
				"Wie heißt du? \n What's your name?",
				"Ich heiße \n I am called",
				"Mein Name ist \n My name is",
				"Ich bin der \n I am ... (feminine)",
				"Ich bin die \n I am ... (masculine)",
				"Wo wohnst du? \n Where do you live?",
				"Ich wohne in \n I live in",
				"in der Nähe von \n near to",
				"Woher kommst du? \n Where do you come from?",
				"Ich komme aus Wales. \n I come from Wales.",
				"Welche Nationalität bist du? \n What is your Nationality?",
				"Ich bin Waliser. \n I am Welsh. (masculine)",
				"Ich bin Waliserin. \n I am Welsh. (feminine)",
				"Ich bin Deutsch. \n I am German. (masculine)",
				"Ich bin Deutscherin. \n I am German. (feminine)",
				"Wie schreibt man das? \n How do you spell that?",
				"Meine Telefonnummer ist: \n My telephone number is:",
				"Eins \n One",
				"Zwei \n Two",
				"Drei \n Three",
				"Vier \n Four",
				"Fünf \n Five",
				"Sechs \n Six",
				"Sieben \n Seven",
				"Acht \n Eight",
				"Neun \n Nine",
				"Zehn \n Ten",
				"Elf \n Eleven",
				"Zwölf \n Twelve",
				"Auf Wiedersehen \n Goodbye",
				"Tschüß \n Bye / Cheerio",
				"Bis bald \n See you soon",
				"Schönen Tag noch! \n Have a nice day!"
			]
		},
		updateInterval: 10000,
		remoteFile: null,
		fadeSpeed: 4000,
	},


	// Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);

		this.lasty8_germanIndex = -1;

		var self = this;
		if (this.config.remoteFile != null) {
			this.y8_germanFile(function(response) {
				self.config.y8_german = JSON.parse(response);
				self.updateDom();
			});
		}

		// Schedule update timer.
		setInterval(function() {
			self.updateDom(self.config.fadeSpeed);
		}, this.config.updateInterval);
	},

	/* randomIndex(y8_german)
	 * Generate a random index for a list of y8_german.
	 *
	 * argument y8_german Array<String> - Array with y8_german.
	 *
	 * return Number - Random index.
	 */
	randomIndex: function(y8_german) {
		if (y8_german.length === 1) {
			return 0;
		}

		var generate = function() {
			return Math.floor(Math.random() * y8_german.length);
		};

		var y8_germanIndex = generate();

		while (y8_germanIndex === this.lasty8_germanIndex) {
			y8_germanIndex = generate();
		}

		this.lasty8_germanIndex = y8_germanIndex;

		return y8_germanIndex;
	},

	/* y8_germanArray()
	 * Retrieve an array of y8_german for the time of the day.
	 *
	 * return y8_german Array<String> - Array with y8_german for the time of the day.
	 */
	y8_germanArray: function() {
		var hour = moment().hour();
		var y8_german;

		if (typeof y8_german === "undefined") {
			y8_german = new Array();
		}

		if (this.currentWeatherType in this.config.y8_german) {
			y8_german.push.apply(y8_german, this.config.y8_german[this.currentWeatherType]);
		}

		y8_german.push.apply(y8_german, this.config.y8_german.anytime);

		return y8_german;
	},

	/* y8_germanFile(callback)
	 * Retrieve a file from the local filesystem
	 */
	y8_germanFile: function(callback) {
		var xobj = new XMLHttpRequest(),
			isRemote = this.config.remoteFile.indexOf("http://") === 0 || this.config.remoteFile.indexOf("https://") === 0,
			path = isRemote ? this.config.remoteFile : this.file(this.config.remoteFile);
		xobj.overrideMimeType("application/json");
		xobj.open("GET", path, true);
		xobj.onreadystatechange = function() {
			if (xobj.readyState == 4 && xobj.status == "200") {
				callback(xobj.responseText);
			}
		};
		xobj.send(null);
	},

	/* y8_germanArray()
	 * Retrieve a random y8_german.
	 *
	 * return y8_german string - A y8_german.
	 */
	randomy8_german: function() {
		var y8_german = this.y8_germanArray();
		var index = this.randomIndex(y8_german);

		return y8_german[index];
	},

	// Override dom generator.
	getDom: function() {
		var y8_germanText = this.randomy8_german();

		var y8_german = document.createTextNode(y8_germanText);
		var wrapper = document.createElement("div");
		wrapper.className = this.config.classes ? this.config.classes : "thin medium bright pre-line";
		wrapper.appendChild(y8_german);

		return wrapper;
	},


	// From data currentweather set weather type
	setCurrentWeatherType: function(data) {
		var weatherIconTable = {
			"01d": "day_sunny",
			"02d": "day_cloudy",
			"03d": "cloudy",
			"04d": "cloudy_windy",
			"09d": "showers",
			"10d": "rain",
			"11d": "thunderstorm",
			"13d": "snow",
			"50d": "fog",
			"01n": "night_clear",
			"02n": "night_cloudy",
			"03n": "night_cloudy",
			"04n": "night_cloudy",
			"09n": "night_showers",
			"10n": "night_rain",
			"11n": "night_thunderstorm",
			"13n": "night_snow",
			"50n": "night_alt_cloudy_windy"
		};
		this.currentWeatherType = weatherIconTable[data.weather[0].icon];
	},


	// Override notification handler.
	notificationReceived: function(notification, payload, sender) {
		if (notification == "CURRENTWEATHER_DATA") {
			this.setCurrentWeatherType(payload.data);
		}
	},

});
