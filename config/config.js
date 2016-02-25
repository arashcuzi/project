var path = require('path'),
	rootPath = path.normalize(__dirname + '/..'),
	env = process.env.NODE_ENV || 'development';

var config = {
	development: {
		root: rootPath,
		uploadPath: './public/upload',
		app: {
			name: 'Image List'
		},
		port: 3400,
		db: 'mongodb://localhost/image-development'
	},
	production: {
		root: rootPath,
		uploadPath: './public/upload',
		app: {
			name: 'Image List'
		},
		port: 80,
		db: 'mongodb://localhost/image-production'
	}
};

module.exports = config[env];