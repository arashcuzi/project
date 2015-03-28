// Require modules here
var express = require('express'),
	bodyParser = require('body-parser'),
	glob = require('glob'),
	mongoose = require('mongoose'),
	exphbs = require('express3-handlebars'),
	moment = require('moment');

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

	app.set('views', config.root + '/app/views');
		app.engine('handlebars', exphbs.create({
			defaultLayout: 'main',
			layoutsDir: app.get('views') + '/layouts',
			helpers: {
				numberNotDone: function (todoItems) {
					var num = 0;
					for (var i = 0; i < todoItems.length; i++) {
						if (!todoItems[i].done) num += 1;
					}
					return num;
				},
				formatDate: function (date) {
					return moment(date).format('MMMM Do YYYY, h:mm:ss a')
				}
			}
		}).engine);
		app.set('view engine', 'handlebars');

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