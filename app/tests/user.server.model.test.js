'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Timeline = mongoose.model('Timeline'),
	Guest = mongoose.model('Guest');

/**
 * Globals
 */
var user, user2, user3;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', function() {
	before(function(done) {
		user = new User({
			name: 'Full',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			provider: 'local'
		});
		user2 = new User({
			name: 'Full',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			provider: 'local'
		});
		user3 = new User({
			name: 'New',
			displayName: 'New Boy',
			email: 'test@test.com',
			username: 'newboy',
			password: 'password',
			provider: 'local'
		});

		done();
	});

	describe('Method Save', function() {
		// Should not be able to create a user with name that has symbols
		it('should begin with no users', function(done) {
			User.find({}, function(err, users) {
				users.should.have.length(0);
				done();
			});
		});

		it('should be able to save without problems', function(done) {
			user.save(done);
		});

		it('should fail to save an existing user again', function(done) {
			user.save();
			return user2.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should show an error when try to save without first name', function(done) {
			user.name = '';
			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it ('should show an error when trying to save without an email', function(done) {
			user.email = '';
			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should show an error when trying to save with an existing email', function(done) {
			user.save(function() {
				user3.save(function(err) {
					should.exist(err);
					done();
				});
			});
		});
	});

	after(function(done) {
		User.remove().exec();
		done();
	});
});
