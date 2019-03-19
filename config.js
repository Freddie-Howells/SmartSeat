/* Magic Mirror Config Sample
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 *
 * For more information how you can configurate this file
 * See https://github.com/MichMich/MagicMirror#configuration
 *
 */

var config = {
	address: "localhost", // Address to listen on, can be:
	                      // - "localhost", "127.0.0.1", "::1" to listen on loopback interface
	                      // - another specific IPv4/6 to listen on a specific interface
	                      // - "", "0.0.0.0", "::" to listen on any interface
	                      // Default, when address config is left out, is "localhost"
	port: 8080,
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"], // Set [] to allow all IP addresses
	                                                       // or add a specific IPv4 of 192.168.1.5 :
	                                                       // ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
	                                                       // or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
	                                                       // ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	language: "en",
	timeFormat: 24,
	units: "metric",

	modules: [
		{
			module: "alert",
		},
		{
			module: "updatenotification",
			position: "top_bar"
		},
		{
			module: "clock",
			position: "top_left"
		},
		{
			module: "calendar",
			header: "Google Calendar",
			position: "top_left",
			config: {
				calendars: [
					{
						symbol: "calendar-check",
						url: "https://calendar.google.com/calendar/ical/fehowells05%40gmail.com/public/basic.ics",
					}
				]
			}
		},
		{
			module: "compliments",
			position: "bottom_center"
		},
		{
			module: "y8_french",
			position: "middle",	
		},
		{
			module: "y8_german",
			position: "middle",	
		},
		{
			module: "currentweather",
			position: "top_right",
			config: {
				location: "Caerleon, GB",
				locationID: "2654093",  //ID from http://bulk.openweathermap.org/sample/; unzip the gz file and find your city
				appid: "c543433d7a75032186e6880********"
			}
		},
		{
			module: "weatherforecast",
			position: "top_right",
			header: "Weather Forecast",
			config: {
				location: "Caerleon, GB",
				locationID: "2654093",  //ID from https://openweathermap.org/city
				appid: "c543433d7a75032186e688********"
			}
		},
		{
			module: "iFrame",
			position: "middle_center", // This can be any of the regions.
			config: {
				url:"http://caerleoncomprehensive.net/",
				width: "800px", // Optional. Default: 100%
				height: "600px", //Optional. Default: 100px
			}
		},
		{
            		module: "MMM-Carousel",
           	 	position: "bottom_bar",  // Only required to show navigation
            		config: {           
                		transitionInterval: 60000,
                		showPageIndicators: true,
                		showPageControls: false,
               			ignoreModules: ["clock", "alert"],
                		mode: "slides",
                		slides: {
                    			main: ["calendar", "weatherforecast", "compliments", "currentweather", "email"],
                    			"Slide 2": ["iFrame", "newsfeed"],
					"Slide 3": ["MMM-Garfield"],
					"Slide 4": ["y8_french"],
					"Slide 5": ["y8_german"]}
            		}
        	},
		{
   			module: 'MMM-Garfield',
			position: 'middle',
			config: {
			updateInterval : 36000000
			}
		},
		{
			module: 'email',
                	position: 'middle',
                	header: 'Email',
                	config: {
                    		accounts: [                           	
                        		{
                            		user: 'fehowells05@gmail.com',
                            		password: '*********',
                            		host: 'imap.gmail.com',
                            		port: 993,
                            		tls: true,
                            		authTimeout: 30000,
                            		numberOfEmails: 2 
                        		}
                    		],
                    	fade: false,
                    	maxCharacters: 30
			}
                },
		{
			module: "newsfeed",
			position: "bottom_center",
			config: {
				feeds: [
					{
						title: "Sky News",
						url: "http://feeds.skynews.com/feeds/rss/uk.xml"
					}
				],
				showSourceTitle: true,
				showPublishDate: true
			}
		},
	]

};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}
