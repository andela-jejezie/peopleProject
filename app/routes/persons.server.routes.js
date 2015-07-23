'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var persons = require('../../app/controllers/persons.server.controller');

	// Persons Routes
	app.route('/persons')
		.get(persons.listPersons)
		.post(users.requiresLogin, persons.createPerson);
		
	app.route('/persons/:personId')
		.get(persons.getPersonDetails)
		.put(users.requiresLogin, persons.hasAuthorization, persons.updatePerson)
		.delete(users.requiresLogin, persons.hasAuthorization, persons.deletePerson);

	// Finish by binding the Person middleware
	app.param('personId', persons.personByID);

};
