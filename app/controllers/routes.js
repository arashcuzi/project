var express = require('express'),
	session = require('express-session'),
	router = express.Router(),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

module.exports = function (app, passport) {
	app.use('/', router);

	router.get('/', function (req, res, next) {
		res.render('index');
	});

	router.get('/signup', function (req, res, next) {
		res.render('signup', { message: req.flash('signupMessage') });
	});

	router.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/images.html',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	router.get('/login', function (req, res, next) {
		res.render('login', { message: req.flash('loginMessage') });
	});

	router.post('/login', passport.authenticate('local-login', {
		successRedirect: '/images.html',
		failureRedirect: '/login',
		failureFlash: true
	}));

	router.get('/logout', function (req, res, next) {
		req.logout();
		res.redirect('/');
	});

	// start facebook authentication
	app.get('/auth/facebook', passport.authenticate('facebook', {
		scope : 'email'
	}));

	// handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect : '/images.html',
		failureRedirect : '/'
	}));

	// start twitter authentication
	app.get('/auth/twitter', passport.authenticate('twitter'));

	// handle the callback after twitter has authenticated the user
	app.get('/auth/twitter/callback', passport.authenticate('twitter', {
		successRedirect : '/twitter',
		failureRedirect : '/'
	}));

	// needed for twitter to go smoothly
	router.get('/twitter', isLoggedIn, function (req, res, next) {
		if (req.user.name.fname) {
			res.redirect('/images.html');
		} else {
			res.render('signupTwitter', { 'user': req.user });
		}
	});

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated())
			return next();
		res.redirect('/');
	}
};