var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

module.exports = function (app) {
	app.use('/', router);

	router.get('/api/users', function (req, res) {
		User.find(function (err, users) {
			if (err) {
				res.status(500).json(err);
			} else {
				res.status(200).json(users);
			}
		});
	});

	router.get('/api/user/:userid', function (req, res) {
		User.findById(req.params.userid, function (err, user) {
			if (err) {
				res.status(500).json(err);
			} else {
				res.status(200).json(user);
			}
		});
	});

	router.post('/api/user', function (req, res) {
		User.create({
			name: {
				fname: req.body.fname,
				lname: req.body.lname
			},
			local: {
				email: req.body.email,
				password: req.body.password
			}
		}, function (err, user) {
			if (err){
				res.status(500).json(err);
			} else {
				res.status(201).json(user);
			}
		});
	});

	router.put('/api/user/:userid', function (req, res) {
		User.findById(req.params.userid, function (err, user) {
			if (err) {
				res.status(500).json(err);
			} else {
				if (req.body.fname !== undefined) {
					user.name.fname = req.body.fname;
				}
				if (req.body.lname !== undefined) {
					user.name.lname = req.body.lname;
				}
				if (req.body.email !== undefined) {
					user.local.email = req.body.email;
				}
				if (req.body.password !== undefined) {
					user.local.password = req.body.password;
				}
				user.save(function (err, user) {
					if (err) {
			  	    	res.status(500).json(err);
			  	 	} else {
			  	    	res.status(200).json(user);
			  		}
			  	})
			}
		});
	});

	router.delete('/api/user/:userid', function (req, res) {
		User.findByIdAndRemove(req.params.userid, function (err, user) {		
        	if (err) {
        		res.status(500).json(err);
        	} else {    	
        		res.status(204).json('User deleted');		
        	}
    	});
	});

};