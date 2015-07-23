'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	uuid = require('node-uuid'),
	User = mongoose.model('User'),
	Verificationtoken = mongoose.model('Verificationtoken');

/**
 * Globals
 */
var user1, verificationtoken;

/**
 * Unit tests
 */
describe('Verificationtoken Model Unit Tests:', function() {
	beforeEach(function(done) {
		user1 = new User({
			name: 'Full',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user1.save(function() { 
			verificationtoken = new Verificationtoken({
				_userId: user1,
				token: 'hhbsru8798uuiji898iuyg7ybvhg788i'
			});
			done();
		});
	});

	describe('Verification token server model unit test', function() {
		it('Create token', function(done) {
    	verificationtoken.createVerificationToken(function(err) {
    		should.not.exist(err);
    		done();
    	});
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			verificationtoken.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should show an error when try to save without token', function(done) { 
			verificationtoken.token = '';
			verificationtoken.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should show an error when try to save without a user', function(done) { 
			verificationtoken._userId = '';
			verificationtoken.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	after(function(done) { 
		Verificationtoken.remove().exec();
		User.remove().exec();
		done();
	});
});
