# Module: y7_welsh

This module displays a random Welsh phrase and its translation.

## Screenshots
- Year 7 Welsh Screenshot
![Year 7 Welsh Screenshot](y7_welsh_screenshot.jpg)

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module: "y7_welsh",
		position: "middle",	// This can be any of the regions.
									// Best results in one of the middle regions like: lower_third
		config: {
			// The config property is optional.
			// If no config is set, the default compliments are shown.
			// See 'Configuration options' for more information.
		}
	}
]
````

## Configuration options

The following properties can be configured:


| Option           | Description
| ---------------- | -----------
| `updateInterval` | How often does the phrase have to change? (Milliseconds) <br><br> **Possible values:** `1000` - `86400000` <br> **Default value:** `30000` (30 seconds)
| `fadeSpeed`      | Speed of the update animation. (Milliseconds) <br><br> **Possible values:**`0` - `5000` <br> **Default value:** `4000` (4 seconds)
| `phrases`	   | The list of phrases. <br><br> 
| `classes`        | Override the CSS classes of the div showing the phrases <br><br> **Default value:** `thin xlarge bright`
 

