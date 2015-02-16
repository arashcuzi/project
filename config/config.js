var path = require('path'),
	rootPath = path.normalize(__dirname + '/..'),
	env = process.env.NODE_ENV || 'development';

var config = {
	development: {
		root: rootPath,
		app: {
			name: 'ToDo List'
		},
		port: 3400,
		db: 'mongodb://localhost/todo-development'
	},
	production: {
		root: rootPath,
		app: {
			name: 'ToDo List'
		},
		port: 80,
		db: 'mongodb://localhost/todo-production'
	}
};

module.exports = config[env];