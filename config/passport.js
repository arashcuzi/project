var LocalStrategy = require('passport-local').Strategy,
	TwitterStrategy = require('passport-twitter').Strategy,
	FacebookStrategy = require('passport-facebook').Strategy,
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	authconfig = require('./auth');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function (req, email, password, done) {
		process.nextTick(function () {
			User.findOne({'local.email': email}, function (err, user) {
				if (err)
					return done(err);
				if (user) {
					return done(null, false, req.flash('signupMessage', 'That email already exists!'));
				} else {
					var newUser = new User();
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);
					newUser.name.fname = req.body.fname;
					newUser.name.lname = req.body.lname;
					newUser.save(function (err) {
						if (err)
							throw err;
						return done(null, newUser);
					});
				}
			});
		});
	}));

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function (req, email, password, done) {
		process.nextTick(function () {
			User.findOne({'local.email': email}, function (err, user) {
				if (err)
					return done(err);
				if (!user)
					return done(null, false, req.flash('loginMessage', 'That user was not found!'));
				if (!user.validPassword(password))
					return done(null, false, req.flash('loginMessage', 'That password is not valid!'));
				req.session.name = user.fullName;
				return done(null, user);
			});
		});
	}));

	passport.use(new TwitterStrategy({
		// pull in our app key and secret from our auth.js file
		consumerKey: authconfig.twitterAuth.consumerKey,
		consumerSecret: authconfig.twitterAuth.consumerSecret,
		callbackURL: authconfig.twitterAuth.callbackURL
		},
		// twitter sends back the token and profile
		function (token, tokenSecret, profile, done) {
			// asynchronous
			process.nextTick(function () {
				// find the user in the database based on their twitter id
				User.findOne({ 'twitter.id' : profile.id }, function (err, user) {
					// if there is an error, stop everything and return that
					// i.e. an error connecting to the database
					if (err)
						return done(err);
					// if the user is found, then log them in
					if (user) {
						return done(null, user); // user found, return that user
					} else {
						var newUser = new User();
						newUser.twitter.id = profile.id;
						newUser.twitter.token = token;
						newUser.twitter.username = profile.username;
						newUser.twitter.displayName = profile.displayName;
						newUser.save(function (err) {
						if (err)
							throw err;
						// if successful, return the new user
						return done(null, newUser);
					});
				}
			});
		});
	}));

	passport.use(new FacebookStrategy({
		// pull in our app id and secret from our auth.js file
		clientID : authconfig.facebookAuth.clientID,
		clientSecret : authconfig.facebookAuth.clientSecret,
		callbackURL : authconfig.facebookAuth.callbackURL
		},
		// facebook will send back the token and profile
		function (token, refreshToken, profile, done) {
			// asynchronous
			process.nextTick(function() {
				// find the user in the database based on their facebook id
				User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
					// if there is an error, stop everything and return that
					// ie an error connecting to the database
					if (err)
						return done(err);
					// if the user is found, then log them in
					if (user) {
						return done(null, user); // user found, return that user
					} else {
						var newUser = new User();
						newUser.facebook.id = profile.id;
						newUser.facebook.token = token;
						newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
						newUser.facebook.email = profile.emails[0].value;
						newUser.name.fname = profile.name.givenName;
						newUser.name.lname = profile.name.familyName;
						newUser.local.email = profile.emails[0].value
						newUser.save(function(err) {
						if (err)
							throw err;
						// if successful, return the new user
						return done(null, newUser);
					});
				}
			});
		});
	}));
}
