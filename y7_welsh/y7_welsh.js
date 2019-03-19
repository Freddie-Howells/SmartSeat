/* global Log, Module, moment */

/* Magic Mirror
 * Module: y7_welsh
 *
 * By Freddie & Katie Howells
 */
Module.register("y7_welsh", {

	// Module config defaults.
	defaults: {
		y7_welsh: {
			anytime: [
				"Beth wnest ti ar y penwythnos? \n What did you do on the weekend?",
				"Beth wyt ti'n hoffi gwylio? \n What do you like watching?",
				"Beth wyt ti'n feddwl o... \n What do you think of...",
				"Faint o'r gloch est ti? \n What time did you go?",
				"Sut oedd y tywydd? \n What was the weather like?",
				"Es i i'r... \n I went to the..." ,
				"Dwi'n hoffi gwylio... \n I like to watch... ",
				"Dwi'n meddal bod...  \n I think that...",
				"Es i am hanner wedi saith \n I went at half past seven",
				"Roedd y tywydd yn... \n The weather was...",	
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
				self.config.y7_welsh = JSON.parse(response);
				self.updateDom();
			});
		}

		// Schedule update timer.
		setInterval(function() {
			self.updateDom(self.config.fadeSpeed);
		}, this.config.updateInterval);
	},

	/* randomIndex(y7_welsh)
	 * Generate a random index for a list of y7_welsh.
	 *
	 * argument y7_welsh Array<String> - Array with y7_welsh.
	 *
	 * return Number - Random index.
	 */
	randomIndex: function(y7_welsh) {
		if (y7_welsh.length === 1) {
			return 0;
		}

		var generate = function() {
			return Math.floor(Math.random() * y7_welsh.length);
		};

		var complimentIndex = generate();

		while (complimentIndex === this.lastComplimentIndex) {
			complimentIndex = generate();
		}

		this.lastComplimentIndex = complimentIndex;

		return complimentIndex;
	},

	/* complimentArray()
	 * Retrieve an array of y7_welsh for the time of the day.
	 *
	 * return y7_welsh Array<String> - Array with y7_welsh for the time of the day.
	 */
	complimentArray: function() {
		var hour = moment().hour();
		var y7_welsh;

		

		if (typeof y7_welsh === "undefined") {
			y7_welsh = new Array();
		}

		if (this.currentWeatherType in this.config.y7_welsh) {
			y7_welsh.push.apply(y7_welsh, this.config.y7_welsh[this.currentWeatherType]);
		}

		y7_welsh.push.apply(y7_welsh, this.config.y7_welsh.anytime);

		return y7_welsh;
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
		var y7_welsh = this.complimentArray();
		var index = this.randomIndex(y7_welsh);

		return y7_welsh[index];
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
