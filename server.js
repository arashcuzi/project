var express = require('express'),
	config = require('./config/config');

var app = express();

require('./config/express')(app, config);

app.listen(config.port);

console.log('Server is running, good to go at port:' + config.port);