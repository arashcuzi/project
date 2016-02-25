// Require modules here
var express = require('express'),
	bodyParser = require('body-parser'),
	glob = require('glob'),
	mongoose = require('mongoose'),
	exphbs = require('express3-handlebars'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	flash = require('connect-flash'),
	moment = require('moment'),
	multer = require('multer');

module.exports = function (app, config) {
	// configuration of server here
	app.use(express.static(config.root + '/public'));

	app.use(multer({
		dest: config.uploadPath
	}));

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	app.use(cookieParser('monty-python-and-the-holy-grail'));
	app.use(session({secret: 'montypythonholygrail'}));

	app.use(passport.initialize());
		app.use(passport.session());
		app.use(flash());

	mongoose.connect(config.db);
	var db = mongoose.connection;
	db.on('error', function () {
		throw new Error('Unable to connect to database at ' + config.db);
	});

	app.set('views', config.root + '/app/views');
		app.engine('handlebars', exphbs.create({
			defaultLayout: 'main',
			layoutsDir: app.get('views') + '/layouts'
		}).engine);
	app.set('view engine', 'handlebars');

	var models = glob.sync(config.root + '/app/models/*.js');
	models.forEach(function (model) {
		require(model);
	});

	// passport
	require('./passport')(passport);

	app.use(function (req, res, next) {
		if (req.session && req.session.passport) {
			res.locals.userID = req.session.passport.user;
		}
		next();
	});

	var controllers = glob.sync(config.root + '/app/controllers/*.js');
	controllers.forEach(function (controller) {
		require(controller)(app, passport);
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