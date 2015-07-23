'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var tasks = require('../../app/controllers/tasks.server.controller');

	// Tasks Routes
	app.route('/tasks')
		.get(tasks.listTasks)
		.post(users.requiresLogin, tasks.createTask);
	app.route('/tasks/:taskId')
		.get(tasks.readTask)
		.put(users.requiresLogin, tasks.hasAuthorization, tasks.updateTask)
		.delete(users.requiresLogin, tasks.hasAuthorization, tasks.deleteTask);

	// Finish by binding the Task middleware
	app.param('taskId', tasks.taskByID);
};
