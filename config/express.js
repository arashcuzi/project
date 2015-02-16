// Require modules here
var express = require('express');
var bodyParser = require('body-parser');
var glob = require('glob');

var app = express();

module.exports = function(app, config) {
	// configuration of server here
	app.use(express.static(config.root + '/public'));

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	var models = glob.sync(config.root + '/app/models/*.js');
		models.forEach(function (model) {
			require(model);
		});

	var controllers = glob.sync(config.root + '/app/controllers/*.js');
		controllers.forEach(function (controller) {
			require(controller)(app);
		});

	app.use(function (req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		
	})
}