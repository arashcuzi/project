var express = require('express'),
	router = express.Router()
	mongoose = require('mongoose'),
	User = mongoose.model('User');

module.exports = function (app) {
	app.use('/', router);

	router.post('/login', function (req, res) {
		User.findOne({'local.email': req.body.email, 'local.password': req.body.password}, function (err, user) {
			if (err) {
				res.status(500).json(err);
			} else {
				res.render('todo', {'user': user});
			}
		})
	});

	router.get('/', function (req, res) {
		res.render('index');
	});

	router.get('/index.html', function (req, res) {
		res.render('index');
	});

	router.post('/', function (req, res) {
		res.status(201).json("What's UP!");
	});
};