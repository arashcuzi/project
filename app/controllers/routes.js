var express = require('express'),
	router = express.Router();

module.exports = function (app) {
	app.use('/', router);

	router.get('/', function(req,res){
		res.status(200).json('');
	});

	router.get('/home', function(req,res){
		res.status(200).json('Hello World!');
	});

	router.post('/home', function(req,res){
		res.status(201).json('Hello Cruel World!')
	})
}