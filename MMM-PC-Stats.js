/* Magic Mirror
 * Module: MMM-PC-Stats
 *
 * By Mykle1
 *
 */
Module.register("MMM-PC-Stats", {

	defaults: {
		GPU: "ATI Radeon HD 4200", // name of your video card
		useHeader: false,
		header: "",
		maxWidth: "1200px",
		animationSpeed: 0,
		initialLoadDelay: 3250,
		retryDelay: 2500,
		updateInterval: 15 * 1000
	},

	getStyles: function() {
		return ["MMM-PC-Stats.css"];
	},

	getScripts: function() {

		return ["moment.js"];
	},


	start: function() {
		Log.info("Starting module: " + this.name);
		this.Stats = {};
        this.Sensors = {};
        this.Temps = {};
		this.scheduleUpdate();
	},


	getDom: function() {

		var wrapper = document.createElement("div");
		wrapper.className = "wrapper";
		wrapper.style.maxWidth = this.config.maxWidth;

		if (!this.loaded) {
			wrapper.innerHTML = this.translate("Scanning CPU, GPU, & RAM . . .");
			wrapper.classList.add("normal", "medium");
			return wrapper;
		}

		if (this.config.useHeader != false) {
			var header = document.createElement("header");
			header.classList.add("medium", "dimmed", "header");
			header.innerHTML = this.config.header;
			wrapper.appendChild(header);
		}

		var Stats = this.Stats;
        var Sensors = this.Sensors;
        var Temps = this.Temps;
        var os = this.os;


		// Your total RAM and Free RAM
		var ram = document.createElement("div");
		ram.classList.add("large", "bright", "ram");
		ram.innerHTML = "Total RAM = " + Stats.ram.total + Stats.ram.unit + "<br>" + "Free RAM = " + Stats.ram.free + Stats.ram.unit;
		wrapper.appendChild(ram);


		// Your CPU and CPU speed
		var yourCPU = document.createElement("div");
		yourCPU.classList.add("large", "bright", "yourCPU");
		yourCPU.innerHTML = Stats.cpu.name;
		wrapper.appendChild(yourCPU);

		// Your GPU
		var yourGPU = document.createElement("div");
		yourGPU.classList.add("large", "bright", "yourGPU");
		yourGPU.innerHTML = this.config.GPU;
		wrapper.appendChild(yourGPU);

		// Check if Graphics cpu has temp sensor
		var graphicsTempCheck = Sensors["nouveau-pci-0090"]; //["PCI adapter"].temp1.value;
		if (typeof graphicsTempCheck !== "undefined"){

			// graphicsTemp
			var graphicsTemp = document.createElement("div");
			graphicsTemp.classList.add("large", "bright", "graphicsTemp");
			//console.log(Sensors['coretemp-isa-0000']['ISA adapter']['Core 0'].high);
			graphicsTemp.innerHTML = this.config.gpu +  " temp @ " + Sensors["nouveau-pci-0090"]["PCI adapter"].temp1.value + "&deg;C";
			wrapper.appendChild(graphicsTemp);

		}

		for (var i = 0, len = Stats.cpu.threads.length; i < len; i++) {

			var Element = document.createElement("span");
			Element.classList.add("large", "bright", "usage");
			Element.innerHTML = Stats.cpu.threads[i].name + " &nbsp  @  &nbsp " + Number(Math.round(Stats.cpu.threads[i].usage+"e2")+"e-2") + "%";
			wrapper.appendChild(Element);


			// Check if cpu device has temp sensor
		        if (os === "Windows") {
				var core0TempCheck = Temps["Hardware"]["Sensors"];
				if (typeof core0TempCheck !== "undefined") {

					// Windows Core Temps
					var core0Temp = document.createElement("span");
					core0Temp.classList.add("large", "bright", "core0Temp");
                    			core0Temp.innerHTML = Temps["Hardware"]["Sensors"]["CPU Core 0"].Name + " &nbsp  @  &nbsp " + Temps["Hardware"]["Sensors"]["CPU Core 0"].Value + "&deg;C";
					wrapper.appendChild(core0Temp);
				}
			} else {
				// Check if core0 has temp sensor
					var core0TempCheck = Sensors["acpitz-virtual-0"]["Virtual device"];
					if (typeof core0TempCheck !== 'undefined'){

					// core0Temp
					var core0Temp = document.createElement("span");
					core0Temp.classList.add("large", "bright", "core0Temp");
					core0Temp.innerHTML = "Temp: " + " &nbsp " + Sensors["acpitz-virtual-0"]["Virtual device"].temp1.value + "°C" + "<br>";
					Element.appendChild(core0Temp);
				}
			}
		}

		return wrapper;
	},

	getOS: function() {
		var userAgent = window.navigator.userAgent,
			platform = window.navigator.platform,
			macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
			windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE", "WinNT"],
			iosPlatforms = ["iPhone", "iPad", "iPod"],
			os = null;

		if (macosPlatforms.indexOf(platform) !== -1) {
		  os = "Mac OS";
		} else if (iosPlatforms.indexOf(platform) !== -1) {
		  os = "iOS";
		} else if (windowsPlatforms.indexOf(platform) !== -1) {
		  os = "Windows";
		} else if (/Android/.test(userAgent)) {
		  os = "Android";
		} else if (!os && /Linux/.test(platform)) {
		  os = "Linux";
		}

		return os;
	},

	notificationReceived: function(notification, payload) {
		if (notification === "HIDE_STATS") {
			this.hide();
		} else if (notification === "SHOW_STATS") {
			this.show(1000);
		}
	},

	processStats: function(data) {
		this.Stats = data;
		this.loaded = true;
		console.log(this.Stats); // for checking in dev console
	},

	processSensors: function(data) {
		this.Sensors = data;
		console.log(this.Sensors); // for checking in dev console
	},

	processTemps: function(data) {
		This.Temps = data;
		console.log(this.Temps); // for checking in dev console
	},

	scheduleUpdate: function() {
		setInterval(() => {
			this.getStats();
		}, this.config.updateInterval);
		this.getStats(this.config.initialLoadDelay);
	},

	getStats: function() {
		this.sendSocketNotification("GET_STATS");
	},


	socketNotificationReceived: function(notification, payload) {
		if (notification === "STATS_RESULT") {
			this.processStats(payload);
			this.updateDom(this.config.animationSpeed);
		}
		if (notification === "SENSORS_RESULT") {
			this.processSensors(payload);
			this.updateDom(this.config.fadeSpeed);
		}
		if (notification === "TEMPS_RESULTS") {
			this.processTemps(payload);
			this.updateDom(this.config.fadeSpeed);
		}
		this.updateDom(this.config.initialLoadDelay);
	},
});
