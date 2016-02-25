var mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs'),
	Schema = mongoose.Schema,
	path = require('path');

var imageSchema = new Schema({
	title: { type: String },
	description: { type: String },
	filename: { type: String },
	timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Image', imageSchema);

var librarySchema = new Schema({
	title: { type: String },
	createDate: { type: Date, default: Date.now},
	images: [ imageSchema ]
});

module.exports = mongoose.model('Library', librarySchema);

var userSchema = new Schema({
	name: { 
		fname: { type: String },
		lname: { type: String }
	},
	registerDate: { type: Date, default: Date.now},
	libraries: [ librarySchema ],
	local: {
		email: { type: String },
		password: { type: String },
	},
	twitter: {
		id: { type: String },
		token: { type: String },
		displayName: { type: String },
		username: { type: String }
	},
	facebook: {
		id: { type: String },
		token: { type: String },
		email: { type: String },
		name: { type: String }
	}
});

// methods for user
// methods ============
userSchema.methods.generateHash = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.local.password);
};


userSchema.virtual('fullName').get(function () {
	return this.name.fname + ' ' + this.name.lname;
});

// create the users model and export it
module.exports = mongoose.model('User', userSchema);