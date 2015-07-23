'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var verificationtokens = require('../../app/controllers/verificationtokens.server.controller');

	// Verificationtokens Routes
	app.route('/verificationtokens')
		.get(verificationtokens.list);
	app.route('/verify/:tokenId')
		.get(verificationtokens.verifyUser);

  // Finish by binding the token middleware
  app.param('tokenId', verificationtokens.tokenById);
};
