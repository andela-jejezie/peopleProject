'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var guests = require('../../app/controllers/guests.server.controller');

	// Guests Routes
	app.route('/guests')
		.get(guests.listGuests)
		.post(users.requiresLogin, guests.createGuest);
	app.route('/guests/:guestId')
		.get(guests.readGuest)
		.put(users.requiresLogin, guests.hasAuthorization, guests.updateGuest)
		.delete(users.requiresLogin, guests.hasAuthorization, guests.deleteGuest);
	app.route('/guest/invitation/accept')
	.get(guests.verifyGuest);

	// Finish by binding the Guest middleware
	app.param('guestId', guests.guestByID);
};
