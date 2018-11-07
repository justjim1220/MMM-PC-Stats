/* Magic Mirror
 * Module: MMM-PC-Stats
 *https://www.npmjs.com/package/systeminformation
 * By Mykle1
 *
 */
const NodeHelper = require("node_helper");
const request = require("pc-stats");
var lmSensors = require("sensors.js");

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

    getTemps: function() {
       //exec("runas /user:administrator cmd /c ./MS_CPUTemps.exe", (error, stdout, _stderr)=>{
       //     if (error) {throw error};
       //     this.sendSocketNotification("TEMPS_RESULT", stdout);
       //     console.log(stdout); // for checking
       // });
	this.sendSocketNotification("TEMPS_RESULT", "{\"CPU Core 1\":\"76\",\"CPU Core 2\":\"74\",\"CPU Core 3\":\"71\",\"CPU Core 4\":\"73\",\"CPU Core 5\":\"74\",\"CPU Core 6\":\"76\",\"CPU Package\":\"76\"}");    
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
