var express = require('express'),
	router = express.Router(),
	fs = require('fs'),
	path = require('path'),
	md5 = require('MD5'),
	mongoose = require('mongoose'),
	Image = mongoose.model('Image'),
	User = mongoose.model('User');

module.exports = function (app, passport) {
	app.use('/', router);

	router.post('/api/images/:libraryid',isLoggedIn, function(req, res) {
		var files = req.files.file;
    	User.findById(req.session.passport.user, function (err, user){
        	if (err) {
  				res.status(500).json(err);
        	} else {
  				if (files.length) {
  					for (var i = 0; i < files.length; i++) {
  						newImage = new Image({
  							title: req.body.titles[i],
  							description: req.body.descriptions[i],
  							filename: req.files.file[i].name
  						});
  						user.libraries.id(req.params.libraryid).images.push(newImage);
  					}
  				} else {
  					newImage = new Image({
						title: req.body.titles,
						description: req.body.descriptions,
						filename: req.files.file.name
  					});
  					user.libraries.id(req.params.libraryid).images.push(newImage);
  				}
  				user.save(function (err, user) {
					if (err) {
			  	    	res.status(500).json(err);
			  	 	} else {
			  	    	res.status(200).json(user);
			  		}
			  	});
			}
	     })
	});

	router.delete('/api/image/:libraryid/:imageid', isLoggedIn, function (req, res) {
		User.findById(req.session.passport.user, function (err, user) {
			if (err) {
				res.status(500).json(err);
			} else {
				var filename = user.libraries.id(req.params.libraryid).images.id(req.params.imageid).filename;
				var image = user.libraries.id(req.params.libraryid).images.id(req.params.imageid).remove(function (err) {
					if (err) {
						res.status(500).json(err);
					} else {
						fs.unlink(path.resolve('./public/upload/' + filename), function (err) {
							if (err) {
								console.log(err);
							} else {
								user.save(function(err) {
									if (err) {
							  	    	res.status(500).json(err);
							  	 	} else {
							  	    	res.status(200).json(user);
							  		}
							  	})
							}
						})
					}
				})
			}
		});
    });

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated())
			return next();
		res.redirect('/');
	}
};