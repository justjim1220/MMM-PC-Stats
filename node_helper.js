/* Magic Mirror
 * Module: MMM-PC-Stats
 *https://www.npmjs.com/package/systeminformation
 * By Mykle1
 *
 */
const NodeHelper = require("node_helper");
const request = require("pc-stats");
var lmSensors = require("sensors.js");
const {exec, spawn} = require("child_process");
var executablePath = "D\:\\MagicMirror-tester\\modules\\MMM-PC-Stats\\ConsoleApp2.exe";

module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },

    getStats: function() {
		var stats = require("pc-stats")
		stats().then((statistics) => {
    	    this.sendSocketNotification("STATS_RESULT", statistics);
		})
        this.getSensors();
        this.getTemps();
    },

	getSensors: function() {
		lmSensors.sensors(function (data, error) {
            if (error) { throw error };
			var result = data;
			this.sendSocketNotification("SENSORS_RESULT", result);
			console.log(result); // for checking
        });
    },

    /*getTemps: function() {
        exec("runas /user:Administrator cmd /c", executablePath, (stdout, error)=>{
            if (error) {throw error};
            this.sendSocketNotification("TEMPS_RESULT", stdout);
            console.log(stdout); // for checking
        });
    },*/
	    
    getTemps: function() {
        // spawn the temp access tool
        // might want to start it with a parm of the number of seconds to sleep
        // and let it run full time int he background vs start/stop
      	var tempsProcess = spawn(executablePath, { detached: false });
        
        // Handle messages from process
        // if error
        tempsProcess.stderr.on('data', function (data) {
          var message = data.toString()
          console.error("ERROR", message.substring(4))
        })
        
        // if good data
        tempsProcess.stdout.on('data', function (data) {
          var message = data.toString()
          // send it on to module
          this.sendSocketNotification("TEMPS_RESULT", message);
          console.log("have temps info="+message); // for checking
        })
	    
        // if we receive a closed event from the keyword spotter
        tempsProcess.on('close', function(data) {
          console.log("temps process closed message="+data)
        })
      /*exec(executablePath, (stdout, error)=>{
            if (error) {console.log("error="+error; throw error};
            this.sendSocketNotification("TEMPS_RESULT", stdout);
            console.log(stdout); // for checking
        }); */
    },
    

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GET_STATS") {
            this.getStats(payload);
        }
		if (notification === "GET_SENSORS") {
            this.getSensors(payload);
        }
        if (notification === "GET_TEMPS") {
            this.getTemps(payload);
        }
    }
});
