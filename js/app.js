var async = require("async");
var HdbHandler = require("./js/lib/HdbHandler.js");

var App = function() {
	console.log("Starting CenSQL-Studio " + require("./package.json").version + "...")

	this.ready = false;

    this.init();
}

App.prototype.init = function() {

    this.hdbHandler = new HdbHandler();

    var config = require("./config/hana.json");

    this.hdbHandler.connect(config.host, config.user, config.password, config.port, "MAIN", function(err, client) {
    	this.ready = true;
    	window.dispatchEvent(new Event('app-ready'));
    }.bind(this));
}

APP = new App();
