var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Library = mongoose.model('Library');

module.exports = function (app) {
	app.use('/', router);

	router.get('/api/user', function (req, res) {
		if (req.session.passport.user) {
			User.findById(req.session.passport.user, function (err, user) {
				if (err) {
					res.status(500).json(err);
				} else {
					res.status(200).json(user);
				}
			});
		}
	});

	router.post('/api/user/library', isLoggedIn, function (req, res) {
		User.findById(req.session.passport.user, function (err, user) {
			if (err) {
				res.status(500).json(err);
			} else {
  				var library = new Library(req.body);
  				user.libraries.push(library);
			  	user.save(function (err, user) {
					if (err) {
			  	    	res.status(500).json(err);
			  	 	} else {
			  	    	res.status(200).json(user);
			  		}
			  	});
			}
		});
	});

	router.delete('/api/user/library/:libraryid', isLoggedIn, function (req, res) {
		User.findById(req.session.passport.user, function (err, user) {
    		var lib = user.libraries.id(req.params.libraryid).remove();
				user.save(function(err) {
				if (err) {
		  	    	res.status(500).json(err);
		  	 	} else {
		  	    	res.status(201).json(user);
		  		}
		  	});
    	});
	});

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated())
			return next();
		res.redirect('/');
	}
};