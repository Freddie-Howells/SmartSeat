/* global Log, Module, moment */

/* Magic Mirror
 * Module: y7_french
 *
 * By Freddie & Katie Howells
 */
Module.register("y7_french", {

	// Module config defaults.
	defaults: {
		y7_french: {
			anytime: [
				"Comment t’appelles-tu? \n What’s your name?",
				"Je m’appelle … \n My name is …",
				"Comment ça va? \n How are you? ",
				"Ça va bien, merci. \n I’m (very) well, thank you.",
				"Pas mal, merci. \n Not bad, thanks.",
				"Et toi? \n How about you?",
				"Quel âge as-tu? \n How old are you?",
				"J’ai (onze) ans. \n I am (11) years old.",
				"Comment ça s’écrit? \n How do you spell that?",
				"Ça s’écrit …... \n You spell it...",
				"lundi \n Monday",
				"mardi \n Tuesday",
				"mercredi \n Wednesday",
				"jeudi \n Thursday",
				"vendredi \n Friday",
				"samedi \n Saturday",
				"dimanche \n Sunday",
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

		this.lastComplimentIndex = -1;

		var self = this;
		if (this.config.remoteFile != null) {
			this.complimentFile(function(response) {
				self.config.y7_french = JSON.parse(response);
				self.updateDom();
			});
		}

		// Schedule update timer.
		setInterval(function() {
			self.updateDom(self.config.fadeSpeed);
		}, this.config.updateInterval);
	},

	/* randomIndex(y7_french)
	 * Generate a random index for a list of y8_german.
	 *
	 * argument y7_french Array<String> - Array with y7_french.
	 *
	 * return Number - Random index.
	 */
	randomIndex: function(y7_french) {
		if (y7_french.length === 1) {
			return 0;
		}

		var generate = function() {
			return Math.floor(Math.random() * y7_french.length);
		};

		var y7_frenchIndex = generate();

		while (y7_frenchIndex === this.lasty7_frenchIndex) {
			y7_frenchIndex = generate();
		}

		this.lasty7_frenchIndex = y7_frenchIndex;

		return y7_frenchIndex;
	},

	/* y7_frenchArray()
	 * Retrieve an array of y7_french for the time of the day.
	 *
	 * return y7_french Array<String> - Array with y7_french for the time of the day.
	 */
	y7_frenchArray: function() {
		var hour = moment().hour();
		var y7_french;

		if (typeof y7_french === "undefined") {
			y7_french = new Array();
		}

		if (this.currentWeatherType in this.config.y7_french) {
			y7_french.push.apply(y7_french, this.config.y7_french[this.currentWeatherType]);
		}

		y7_french.push.apply(y7_french, this.config.y7_french.anytime);

		return y7_french;
	},

	/* y7_frenchFile(callback)
	 * Retrieve a file from the local filesystem
	 */
	y7_frenchFile: function(callback) {
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

	/* y7_frenchArray()
	 * Retrieve a random y7_french.
	 *
	 * return y7_french string - A y7_french.
	 */
	randomy7_french: function() {
		var y7_french = this.y7_frenchArray();
		var index = this.randomIndex(y7_french);

		return y7_french[index];
	},

	// Override dom generator.
	getDom: function() {
		var y7_frenchText = this.randomy7_french();

		var y7_french = document.createTextNode(y7_frenchText);
		var wrapper = document.createElement("div");
		wrapper.className = this.config.classes ? this.config.classes : "thin medium bright pre-line";
		wrapper.appendChild(y7_french);

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
