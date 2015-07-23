'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projects = require('../../app/controllers/projects.server.controller');

	// Projects Routes
	app.route('/projects')
		.get(projects.listProjects)
		.post(users.requiresLogin, projects.createProject);
		
	app.route('/projects/:projectId')
		.get(projects.readProject)
		.put(users.requiresLogin, projects.hasAuthorization, projects.updateProject)
		.delete(users.requiresLogin, projects.hasAuthorization, projects.deleteProject);

	// Finish by binding the Project middleware
	app.param('projectId', projects.projectByID);
};
