'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	request = require('supertest'),
	passport = require('passport'),
	User = mongoose.model('User'),
	Verificationtoken = mongoose.model('Verificationtoken');

/**
 * Globals
 */
var user1, user2, verificationtoken1;

var agent = request.agent('http://localhost:3001');

describe('User authentication server controller unit test', function() {
	before(function(done) {
    user1 = new User({
			name: 'Fullest',
			displayName: 'Fuller Name',
			email: 'tester@tester.com',
			username: 'username',
			password: 'password',
			verified: true,
			provider: 'local'
		});
		user2 = new User({
			name: 'Another Joe',
			displayName: 'Another',
			email: 'joe@another.com',
			username: 'anotherjoe',
			password: 'password',
			verified: false,
			provider: 'local'
		});
		user1.save(function() {
			verificationtoken1 = new Verificationtoken({
				_userId: user1,
				token: 'bjws8923b982b923jb020932bbe',
				createdAt: Date.now
			});
			user2.save(function() {
				done();
			});
		});
	});

	it ('should Signin verified users', function(done) {
		agent.post('/auth/signin')
		.send({email: 'tester@tester.com', password: 'password'})
		.expect(200)
		.end(function(err, res) {
    	if (err) {
      	throw err;
    	}
    	return done();
    });
	});
	it ('should not Signin unverified users', function(done) {
		agent.post('/auth/signin')
		.send({email: 'joe@another.com', password: 'password'})
		.expect(401)
		.end(function(err, res) {
    	if (err) {
      	throw err;
    	}
    	return done();
    });
	});

	after(function(done) { 
		User.remove().exec();
		done();
	});
});
