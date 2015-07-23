// 'use strict';

// var should = require('should'),
// 	request = require('supertest'),
// 	app = require('../../server'),
// 	mongoose = require('mongoose'),
// 	User = mongoose.model('User'),
// 	Guest = mongoose.model('Guest'),
// 	agent = request.agent(app);

// /**
//  * Globals
//  */
// var credentials, user, guest;

// /**
//  * Guest routes tests
//  */
// describe('Guest CRUD tests', function() {
// 	beforeEach(function(done) {
// 		// Create user credentials
// 		credentials = {
// 			username: 'username',
// 			password: 'password'
// 		};

// 		// Create a new user
// 		user = new User({
// 			firstName: 'Full',
// 			lastName: 'Name',
// 			displayName: 'Full Name',
// 			email: 'test@test.com',
// 			username: credentials.username,
// 			password: credentials.password,
// 			provider: 'local'
// 		});

// 		// Save a user to the test db and create new Guest
// 		user.save(function() {
// 			guest = {
// 				name: 'Guest Name'
// 			};

// 			done();
// 		});
// 	});

// 	it('should be able to save Guest instance if logged in', function(done) {
// 		agent.post('/auth/signin')
// 			.send(credentials)
// 			.expect(200)
// 			.end(function(signinErr, signinRes) {
// 				// Handle signin error
// 				if (signinErr) done(signinErr);

// 				// Get the userId
// 				var userId = user.id;

// 				// Save a new Guest
// 				agent.post('/guests')
// 					.send(guest)
// 					.expect(200)
// 					.end(function(guestSaveErr, guestSaveRes) {
// 						// Handle Guest save error
// 						if (guestSaveErr) done(guestSaveErr);

// 						// Get a list of Guests
// 						agent.get('/guests')
// 							.end(function(guestsGetErr, guestsGetRes) {
// 								// Handle Guest save error
// 								if (guestsGetErr) done(guestsGetErr);

// 								// Get Guests list
// 								var guests = guestsGetRes.body;

// 								// Set assertions
// 								(guests[0].user._id).should.equal(userId);
// 								(guests[0].name).should.match('Guest Name');

// 								// Call the assertion callback
// 								done();
// 							});
// 					});
// 			});
// 	});

// 	it('should not be able to save Guest instance if not logged in', function(done) {
// 		agent.post('/guests')
// 			.send(guest)
// 			.expect(401)
// 			.end(function(guestSaveErr, guestSaveRes) {
// 				// Call the assertion callback
// 				done(guestSaveErr);
// 			});
// 	});

// 	it('should not be able to save Guest instance if no name is provided', function(done) {
// 		// Invalidate name field
// 		guest.name = '';

// 		agent.post('/auth/signin')
// 			.send(credentials)
// 			.expect(200)
// 			.end(function(signinErr, signinRes) {
// 				// Handle signin error
// 				if (signinErr) done(signinErr);

// 				// Get the userId
// 				var userId = user.id;

// 				// Save a new Guest
// 				agent.post('/guests')
// 					.send(guest)
// 					.expect(400)
// 					.end(function(guestSaveErr, guestSaveRes) {
// 						// Set message assertion
// 						(guestSaveRes.body.message).should.match('Please fill Guest name');
						
// 						// Handle Guest save error
// 						done(guestSaveErr);
// 					});
// 			});
// 	});

// 	it('should be able to update Guest instance if signed in', function(done) {
// 		agent.post('/auth/signin')
// 			.send(credentials)
// 			.expect(200)
// 			.end(function(signinErr, signinRes) {
// 				// Handle signin error
// 				if (signinErr) done(signinErr);

// 				// Get the userId
// 				var userId = user.id;

// 				// Save a new Guest
// 				agent.post('/guests')
// 					.send(guest)
// 					.expect(200)
// 					.end(function(guestSaveErr, guestSaveRes) {
// 						// Handle Guest save error
// 						if (guestSaveErr) done(guestSaveErr);

// 						// Update Guest name
// 						guest.name = 'WHY YOU GOTTA BE SO MEAN?';

// 						// Update existing Guest
// 						agent.put('/guests/' + guestSaveRes.body._id)
// 							.send(guest)
// 							.expect(200)
// 							.end(function(guestUpdateErr, guestUpdateRes) {
// 								// Handle Guest update error
// 								if (guestUpdateErr) done(guestUpdateErr);

// 								// Set assertions
// 								(guestUpdateRes.body._id).should.equal(guestSaveRes.body._id);
// 								(guestUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

// 								// Call the assertion callback
// 								done();
// 							});
// 					});
// 			});
// 	});

// 	it('should be able to get a list of Guests if not signed in', function(done) {
// 		// Create new Guest model instance
// 		var guestObj = new Guest(guest);

// 		// Save the Guest
// 		guestObj.save(function() {
// 			// Request Guests
// 			request(app).get('/guests')
// 				.end(function(req, res) {
// 					// Set assertion
// 					res.body.should.be.an.Array.with.lengthOf(1);

// 					// Call the assertion callback
// 					done();
// 				});

// 		});
// 	});


// 	it('should be able to get a single Guest if not signed in', function(done) {
// 		// Create new Guest model instance
// 		var guestObj = new Guest(guest);

// 		// Save the Guest
// 		guestObj.save(function() {
// 			request(app).get('/guests/' + guestObj._id)
// 				.end(function(req, res) {
// 					// Set assertion
// 					res.body.should.be.an.Object.with.property('name', guest.name);

// 					// Call the assertion callback
// 					done();
// 				});
// 		});
// 	});

// 	it('should be able to delete Guest instance if signed in', function(done) {
// 		agent.post('/auth/signin')
// 			.send(credentials)
// 			.expect(200)
// 			.end(function(signinErr, signinRes) {
// 				// Handle signin error
// 				if (signinErr) done(signinErr);

// 				// Get the userId
// 				var userId = user.id;

// 				// Save a new Guest
// 				agent.post('/guests')
// 					.send(guest)
// 					.expect(200)
// 					.end(function(guestSaveErr, guestSaveRes) {
// 						// Handle Guest save error
// 						if (guestSaveErr) done(guestSaveErr);

// 						// Delete existing Guest
// 						agent.delete('/guests/' + guestSaveRes.body._id)
// 							.send(guest)
// 							.expect(200)
// 							.end(function(guestDeleteErr, guestDeleteRes) {
// 								// Handle Guest error error
// 								if (guestDeleteErr) done(guestDeleteErr);

// 								// Set assertions
// 								(guestDeleteRes.body._id).should.equal(guestSaveRes.body._id);

// 								// Call the assertion callback
// 								done();
// 							});
// 					});
// 			});
// 	});

// 	it('should not be able to delete Guest instance if not signed in', function(done) {
// 		// Set Guest user 
// 		guest.user = user;

// 		// Create new Guest model instance
// 		var guestObj = new Guest(guest);

// 		// Save the Guest
// 		guestObj.save(function() {
// 			// Try deleting Guest
// 			request(app).delete('/guests/' + guestObj._id)
// 			.expect(401)
// 			.end(function(guestDeleteErr, guestDeleteRes) {
// 				// Set message assertion
// 				(guestDeleteRes.body.message).should.match('User is not logged in');

// 				// Handle Guest error error
// 				done(guestDeleteErr);
// 			});

// 		});
// 	});

// 	afterEach(function(done) {
// 		User.remove().exec();
// 		Guest.remove().exec();
// 		done();
// 	});
// });
