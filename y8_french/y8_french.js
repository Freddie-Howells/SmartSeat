/* global Log, Module, moment */

/* Magic Mirror
 * Module: y8_french
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */
Module.register("y8_french", {

	// Module config defaults.
	defaults: {
		y8_french: {
			anytime: [
				"J'ai gagné un concours. \n I won a competition.",
				"J'ai passê une semaine à Paris. \n I spent a week in Paris.",
				"J'ai visité la tour Eiffel. \n I visited the Eiffel Tower.",
				"J'ai mangê au restaurant. \n I ate in a restaurant.",
				"J'ai admiré la Pyramide du Louvre. \n I admired the Louvre Pyramid.",
				"J'ai regardé le feu d’artifice. \n I watched the fireworks.",
				"J'ai acheté des souvenirs. \n I bought some souvenirs.",
				"J'ai rencontré un beau garçon / une jolie fille. \n I met a good-looking boy / a pretty girl.",
				"J'ai envoyé des cartes postales. \n I sent some postcards.",
				"J'ai pris des photos. \n I took some photos.",
				"J'ai vu la Jonconde. \n I saw the Mona Lisa.",
				"J'ai attendu le bus. \n I waited for the bus.",
				"J'ai très bien dormi. \n I slept very well.",
				"Je n'ai pas visité Notre-Dame. \n I didn’t visit the Notre-Dame.",
				"On a fait les magasins. \n We went shopping.",
				"On a bu un coca. \n We drank a cola.",
				"On a fait un tour de la ville en segway. \n We went on a tour of the town by segway.",
				"On a fait une balade en bateau-mouche. \n We went on a boat trip.",	
			]
			
		},
		
		font: 'arial',
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
				self.config.y8_french = JSON.parse(response);
				self.updateDom();
			});
		}

		// Schedule update timer.
		setInterval(function() {
			self.updateDom(self.config.fadeSpeed);
		}, this.config.updateInterval);
	},

	/* randomIndex(y8_french)
	 * Generate a random index for a list of y8_french.
	 *
	 * argument y8_french Array<String> - Array with y8_french.
	 *
	 * return Number - Random index.
	 */
	randomIndex: function(y8_french) {
		if (y8_french.length === 1) {
			return 0;
		}

		var generate = function() {
			return Math.floor(Math.random() * y8_french.length);
		};

		var complimentIndex = generate();

		while (complimentIndex === this.lastComplimentIndex) {
			complimentIndex = generate();
		}

		this.lastComplimentIndex = complimentIndex;

		return complimentIndex;
	},

	/* complimentArray()
	 * Retrieve an array of y8_french for the time of the day.
	 *
	 * return y8_french Array<String> - Array with y8_french for the time of the day.
	 */
	complimentArray: function() {
		var hour = moment().hour();
		var y8_french;

		

		if (typeof y8_french === "undefined") {
			y8_french = new Array();
		}

		if (this.currentWeatherType in this.config.y8_french) {
			y8_french.push.apply(y8_french, this.config.y8_french[this.currentWeatherType]);
		}

		y8_french.push.apply(y8_french, this.config.y8_french.anytime);

		return y8_french;
	},

	/* complimentFile(callback)
	 * Retrieve a file from the local filesystem
	 */
	complimentFile: function(callback) {
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

	/* complimentArray()
	 * Retrieve a random compliment.
	 *
	 * return compliment string - A compliment.
	 */
	randomCompliment: function() {
		var y8_french = this.complimentArray();
		var index = this.randomIndex(y8_french);

		return y8_french[index];
	},

	// Override dom generator.
	getDom: function() {
		var complimentText = this.randomCompliment();

		var compliment = document.createTextNode(complimentText);
		var wrapper = document.createElement("div");
		wrapper.className = this.config.classes ? this.config.classes : "thin medium bright pre-line";
		wrapper.appendChild(compliment);

		return wrapper;
	},


	// Override notification handler.
	notificationReceived: function(notification, payload, sender) {
	},

});
