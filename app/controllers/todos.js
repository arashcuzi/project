var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	Todo = mongoose.model('Todo'),
	User = mongoose.model('User');

module.exports = function (app) {
	app.use('/', router);

	router.get('/api/todos/:userid', function (req, res) {
		User.findById(req.params.userid, function (err, user) {
			if (err) {
				res.status(500).json(err);
			} else {
				res.status(200).json(user);
			}
		});
	});

	router.post('/api/todo/:userid', function (req, res) {
    	User.findById(req.params.userid, function (err, user) {
        	if (err) {
  				res.status(500).json(err);
        	} else {
  				var todo = new Todo(req.body);
  				user.todoItems.push(todo);
			  	user.save(function (err, user) {
					if (err) {
			  	    	res.status(500).json(err);
			  	 	} else {
			  	    	res.render('todo', {'user': user});
			  		}
			  	})
			}
	     })
	});

	router.put('/api/todo/:userid/:todoid', function (req, res) {
		User.findById(req.params.userid, function (err, user) {
			if (err) {
				res.status(500).json(err);
			} else {
				var todo = user.todoItems.id(req.params.todoid);
				if (req.body.task !== undefined) {
					todo.task = req.body.task;
				}
				if (req.body.dueDate !== undefined) {
					todo.dueDate = req.body.dueDate;
				}
				if (req.body.priority !== undefined) {
					todo.priority = req.body.priority;
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

	router.delete('/api/todo/:userid/:todoid', function (req, res) {
		User.findById(req.params.userid, function (err, user) {		
        	if (err) {
        		res.status(500).json(err);
        	} else {
 				var todo = user.todoItems.id(req.params.todoid).remove();
 				user.save(function (err) {
					if (err) {
			  	    	res.status(500).json(err);
			  	 	} else {
			  	    	res.status(201).json(user);
			  		}
			  	})
        	}
    	});
	});
};