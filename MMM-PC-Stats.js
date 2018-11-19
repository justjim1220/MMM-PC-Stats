/* Magic Mirror
 * Module: MMM-PC-Stats
 *
 * By Mykle1
 *
 */
Module.register("MMM-PC-Stats", {

	defaults: {
		GPU: "NVIDIA GeForce GTX 960M", // name of your video card
		useHeader: false,
		header: "",
		maxWidth: "1200px",
		animationSpeed: 0,
		initialLoadDelay: 3250,
		retryDelay: 2500,
		updateInterval: 15 * 1000,

		coresArray: {
			"Core 0": [0],
			"Core 1": [1],
			"Core 2": [2],
			"Core 3": [3],
			"Core 4": [4],
			"Core 5": [5],
			"Core 6": [6],
			"Core 7": [7],
		}
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
		this.Temps = null;
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

		// Your GPU
		var yourGPU = document.createElement("div");
		yourGPU.classList.add("medium", "bright", "yourGPU");
		yourGPU.innerHTML = this.config.GPU;
		wrapper.appendChild(yourGPU);

		// Check if Graphics cpu has temp sensor
		var graphicsTempCheck = Sensors["nouveau-pci-0090"]; //["PCI adapter"].temp1.value;
		if (typeof graphicsTempCheck !== "undefined"){

			// graphicsTemp
			var graphicsTemp = document.createElement("div");
			graphicsTemp.classList.add("medium", "bright", "graphicsTemp");
			//console.log(Sensors['coretemp-isa-0000']['ISA adapter']['Core 0'].high);
			graphicsTemp.innerHTML = this.config.GPU +  " temp @ " + Sensors["nouveau-pci-0090"]["PCI adapter"].temp1.value + "&deg;C";
			wrapper.appendChild(graphicsTemp);
		}

		// Your total RAM and Free RAM
		var ram = document.createElement("div");
		ram.classList.add("medium", "bright", "ram");
		ram.innerHTML = "Total RAM = " + Stats.ram.total + Stats.ram.unit + "&nbsp || &nbsp" + "Free RAM = " + Stats.ram.free + Stats.ram.unit;
		wrapper.appendChild(ram);


		// Your CPU and CPU speed
		var yourCPU = document.createElement("div");
		yourCPU.classList.add("medium", "bright", "yourCPU");
		yourCPU.innerHTML = Stats.cpu.name;
		wrapper.appendChild(yourCPU);

		// Your CPU usage
		for (var i = 0, len = Stats.cpu.threads.length; i < len; i++) {
			var Element = document.createElement("div");
			Element.classList.add("medium", "bright", "usage");
			Element.innerHTML = Stats.cpu.threads[i].name + " &nbsp  @  &nbsp " + Number(Math.round(Stats.cpu.threads[i].usage + "e2") + "e-2") + "% <br>";
			wrapper.appendChild(Element);
		}
		// Check if cpu device has temp sensor
		if (os = "Windows") {
			for (var i = 0, len = Stats.cpu.threads.length/2; i < len; i++) {
				if (typeof this.Temps !== "undefined") {
					// convert string to object
					var core0TempCheck = JSON.parse(this.Temps);
					// Windows Core Temps
					var core0Temp = document.createElement("div");
					core0Temp.classList.add("medium", "bright", "core0Temp");
					// add temp for this (i) processor core from array
					core0Temp.innerHTML = "Core " + [i] + ": " + " &nbsp " + core0TempCheck[i] + "°C" + "<br>";
					wrapper.appendChild(core0Temp);
				}
			}

		} else {

			// Check if core0 has temp sensor
			var core0TempCheck = Sensors["coretemp-isa-0000"]["ISA adapter"]["Core 0"];
			if (typeof core0TempCheck !== "undefined") {

				var core0Temp = document.createElement("div");
				core0Temp.classList.add("small", "bright", "core0Temp");
				core0Temp.innerHTML = Sensors["coretemp-isa-0000"]["ISA adapter"]["Core 0"].name + " &nbsp  @  &nbsp "
					+ Sensors["coretemp-isa-0000"]["ISA adapter"]["Core 0"].value + "&deg;C";
				wrapper.appendChild(core0Temp);
			}

			// Check if core1 has temp sensor
			var core1TempCheck = Sensors["coretemp-isa-0000"]["ISA adapter"]["Core 1"];
			if (typeof core1TempCheck !== "undefined") {

				var core1Temp = document.createElement("div");
				core1Temp.classList.add("small", "bright", "core1Temp");
				core1Temp.innerHTML = Sensors["coretemp-isa-0000"]["ISA adapter"]["Core 1"].name + " &nbsp  @  &nbsp "
					+ Sensors["coretemp-isa-0000"]["ISA adapter"]["Core 1"].value + "&deg;C";
				wrapper.appendChild(core1Temp);
			}

			// Check if core2 has temp sensor
			var core2TempCheck = Sensors["coretemp-isa-0000"]["ISA adapter"]["Core 2"];
			if (typeof core2TempCheck !== "undefined") {

				var core2Temp = document.createElement("div");
				core2Temp.classList.add("small", "bright", "core2Temp");
				core2Temp.innerHTML = Sensors["coretemp-isa-0000"]["ISA adapter"]["Core 2"].name + " &nbsp  @  &nbsp "
					+ Sensors["coretemp-isa-0000"]["ISA adapter"]["Core 2"].value + "&deg;C";
				wrapper.appendChild(core2Temp);
			}

			// Check if core3 has temp sensor
			var core3TempCheck = Sensors["coretemp-isa-0000"]["ISA adapter"]["Core 3"];
			if (typeof core3TempCheck !== "undefined") {

				var core3Temp = document.createElement("div");
				core3Temp.classList.add("small", "bright", "core3Temp");
				core3Temp.innerHTML = Sensors["coretemp-isa-0000"]["ISA adapter"]["Core 3"].name + " &nbsp  @  &nbsp "
					+ Sensors["coretemp-isa-0000"]["ISA adapter"]["Core 3"].value + "&deg;C";
				wrapper.appendChild(core3Temp);
			}

			// Check if core4 has temp sensor
			var core4TempCheck = Sensors["coretemp-isa-0000"]["ISA adapter"]["Core 4"];
			if (typeof core4TempCheck !== "undefined") {

				var core4Temp = document.createElement("div");
				core4Temp.classList.add("small", "bright", "core4Temp");
				core4Temp.innerHTML = Sensors["coretemp-isa-0000"]["ISA adapter"]["Core 4"].name + " &nbsp  @  &nbsp "
					+ Sensors["coretemp-isa-0000"]["ISA adapter"]["Core 4"].value + "&deg;C";
				wrapper.appendChild(core4Temp);
			}

			// Check if core5 has temp sensor
			var core5TempCheck = Sensors["coretemp-isa-0000"]["ISA adapter"]["Core 5"];
			if (typeof core5TempCheck !== "undefined") {

				var core5Temp = document.createElement("div");
				core5Temp.classList.add("small", "bright", "core5Temp");
				core5Temp.innerHTML = Sensors["coretemp-isa-0000"]["ISA adapter"]["Core 5"].name + " &nbsp  @  &nbsp "
					+ Sensors["coretemp-isa-0000"]["ISA adapter"]["Core 5"].value + "&deg;C";
				wrapper.appendChild(core5Temp);
			}

			// Check if core6 has temp sensor
			var core6TempCheck = Sensors["coretemp-isa-0000"]["ISA adapter"]["Core 6"];
			if (typeof core6TempCheck !== "undefined") {

				var core6Temp = document.createElement("div");
				core6Temp.classList.add("small", "bright", "core2Temp");
				core6Temp.innerHTML = Sensors["coretemp-isa-0000"]["ISA adapter"]["Core 6"].name + " &nbsp  @  &nbsp "
					+ Sensors["coretemp-isa-0000"]["ISA adapter"]["Core 6"].value + "&deg;C";
				wrapper.appendChild(core6Temp);
			}

			// Check if core7 has temp sensor
			var core7TempCheck = Sensors["coretemp-isa-0000"]["ISA adapter"]["Core 7"];
			if (typeof core7TempCheck !== "undefined") {

				var core7Temp = document.createElement("div");
				core7Temp.classList.add("small", "bright", "core7Temp");
				core7Temp.innerHTML = Sensors["coretemp-isa-0000"]["ISA adapter"]["Core 7"].name + " &nbsp  @  &nbsp "
					+ Sensors["coretemp-isa-0000"]["ISA adapter"]["Core 7"].value + "&deg;C";
				wrapper.appendChild(core7Temp);
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
		//console.log(this.Stats); // for checking in dev console
	},

	processSensors: function(data) {
		this.Sensors = data;
		console.log(this.Sensors); // for checking in dev console
	},

	processTemps: function(data) {
		this.Temps = data;
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
		if (notification === "TEMPS_RESULT") {
			this.processTemps(payload);
			this.updateDom(this.config.fadeSpeed);
		}
		this.updateDom(this.config.initialLoadDelay);
	},
});
