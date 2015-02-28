// Require modules here
var express = require('express'),
	bodyParser = require('body-parser'),
	glob = require('glob'),
	mongoose = require('mongoose');

module.exports = function (app, config) {
	// configuration of server here
	app.use(express.static(config.root + '/public'));

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	mongoose.connect(config.db);
	var db = mongoose.connection;
	db.on('error', function () {
		throw new Error('Unable to connect to database at ' + config.db);
	});

	var models = glob.sync(config.root + '/app/models/*.js');
	models.forEach(function (model) {
		require(model);
	});

	var controllers = glob.sync(config.root + '/app/controllers/*.js');
	controllers.forEach(function (controller) {
		require(controller)(app);
	});

	app.use(function (req, res, next) {
		var err = new Error('Not Found!');
		err.status = 404;
		next(err);
	});

	app.use(function (req, res, next) {
		var err = new Error('Server Error!');
		err.status = 500;
		next(err);
	});

	app.use(function (err, req, res, next) {
		res.status(err.status);
		res.send(err.message || 'Something Broke!');
	});
};