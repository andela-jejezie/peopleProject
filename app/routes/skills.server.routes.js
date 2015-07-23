'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var persons = require('../../app/controllers/persons.server.controller');
	var skills = require('../../app/controllers/skills.server.controller');

	// Persons Routes
	app.route('/skills')
		.get(skills.listSkills)
		.post(skills.addSkill);

	app.route('/skills/:skillId')
		// .get(skills.getSkillDetails)
		// .put(users.requiresLogin, persons.hasAuthorization, skills.updateSkill)
		.delete(skills.deleteSkill);

	// Finish by binding the Person middleware
	app.param('skillId', skills.skillByID);
};
