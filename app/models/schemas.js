var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var todoFields = {
	task: { type: String, required: true },
	dueDate: { type: Date, required: true },
	done: { type: Boolean, default: false },
	priority: { type: String, enum: ['High', 'Medium', 'Low'] },
	dateEntered: { type: Date, default: Date.now }
};

var todoSchema = new Schema(todoFields);

// export model for the todos controller
module.exports = mongoose.model('Todo', todoSchema);

var userFields = {
	name: {
		fname: { type: String, required: true },
		lname: { type: String, required: true }
	},
	todoItems: [ todoSchema ],
	registerDate: { type: Date, default: Date.now },
	local: {
		email: { type: String, required: true },
		password: { type: String, required: true },
	}
};

var userSchema = new Schema(userFields);

todoSchema.methods.fullName = function () {
	return this.name.fname + ' ' + this.name.lname;
};

// create the users model and export it
module.exports = mongoose.model('User', userSchema);