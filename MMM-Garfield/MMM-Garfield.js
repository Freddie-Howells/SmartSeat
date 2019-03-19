Module.register("MMM-Garfield", {

    // Default module config.
    defaults: {
        updateInterval : 10000 * 60 * 60, // 10 hours
    },

    start: function() {
        Log.info(this.config);
        Log.info("Starting module: " + this.name);

        this.dailyComic = "";
        this.getComic();
        
        self = this;
        if(self.config.updateInterval < 60000) {
			self.config.updateInterval = 60000;
		}			
		
        setInterval(function() {
            self.getComic();
        }, self.config.updateInterval);
    },

    // Define required scripts.
    getScripts: function() {
        return [];
    },

    getStyles: function() {
        return ["garfield.css"];
    },

    getComic: function() {
        Log.info("Garfield: Getting comic.");
        this.sendSocketNotification("GET_COMIC", {
            config: this.config
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "COMIC") {
            Log.info('Garfield url return: ' + payload.img);
            this.dailyComic = payload.img;
            this.updateDom(1000);
        }
    },

    notificationReceived: function(notification, payload, sender) {
    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");

        var comicWrapper = document.createElement("div");
        comicWrapper.className = "garfield-container";
    
        var img = document.createElement("img");
        img.id = "garfield-content";
        img.src = this.dailyComic;
		img.classList.add('garfield-image');
		comicWrapper.appendChild(img);
        wrapper.appendChild(comicWrapper);
        return wrapper;
    }
});