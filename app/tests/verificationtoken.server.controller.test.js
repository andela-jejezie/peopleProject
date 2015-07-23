// 'use strict';

// /**
//  * Module dependencies.
//  */
// var should = require('should'),
// 	mongoose = require('mongoose'),
// 	request = require('supertest'),
// 	User = mongoose.model('User'),
// 	Verificationtoken = mongoose.model('Verificationtoken');

// /**
//  * Globals
//  */

// var user1, verificationtoken;

// var agent = request.agent('http://localhost:3001');

// describe('Verificationtoken Controller Unit Tests:', function() {
// 	before(function(done) {
// 		user1 = new User({
// 			name: 'Full',
// 			displayName: 'Full Name',
// 			email: 'test@test.com',
// 			username: 'username',
// 			password: 'password',
// 			provider: 'local'
// 		});

// 		user1.save(function() { 
// 			verificationtoken = new Verificationtoken({
// 				_userId: user1,
// 				token: 'hhbsru8798uuiji898iuyg7ybvhg788i',
// 				createdAt: Date.now()
// 			});
// 			verificationtoken.save();
// 	        done();
// 		});
			
// 	});

// 	describe('verification tokens methods', function() {
// 	  it('should be able to list all verification tokens', function(done) {
// 			agent.get('/verificationtokens')
// 			.send(verificationtoken)
// 			.expect(200)
// 			.end(function(err, res) {
//           	if (err) {
//             	throw err;
//           	}
//           	return done();
//         });
// 		});

// 	});

// 	describe('Method Verify', function() {
// 		it('should be able to verify users with a valid token', function(done) {
// 			agent.get('/verify/' + verificationtoken.token)
// 			.expect(200)
// 			.end(function(err, res) {
// 	          	if (err) {
// 	            	throw err;
// 	          	}
// 	          	return done();
// 	        });
// 		});

// 		it('should not verify users with an invalid token', function(done) {
// 			agent.get('/verify/hshdfj8bdjhsjh7khbdhb')
// 			.expect(400)
// 			.end(function(err, res) {
// 				if(err) {
// 					throw err;
// 				}
// 				return done();
// 			})
// 		})
// 	})

// 	afterEach(function(done) { 
// 		Verificationtoken.remove().exec();
// 		User.remove().exec();

// 		done();
// 	});
// });

