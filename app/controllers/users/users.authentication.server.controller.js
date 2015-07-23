'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	Mailgun = require('mailgun-js'),
	Verificationtoken = mongoose.model('Verificationtoken'),
	Timeline = mongoose.model('Timeline'),
	Guest = mongoose.model('Guest'),
	User = mongoose.model('User');

var api_key = 'key-3c618b8023b0606df8a322e4986ff398';
var domain = 'sandbox13255ecc69fa45e1acb966e95b235586.mailgun.org';
var from_who = 'email@calendarizeapp.com';


/**
 * Create a new Timeline for user
 */

var userTimeline = {
	createTimeline : function(param) {
		var timeline = new Timeline();
		timeline.owner = param._id;
		timeline.save();
	},
	updateGuestTimeline : function(user){
		var ownerId = user.guestParam.owner._id;
		var guestId = user.guestParam.id;
		Timeline.findOne({owner:ownerId}).exec(function(err, timeline){
			User.findById(user._id).exec(function(err, guestUser){
				Guest.findById(guestId).exec(function(err, guest){
					guest.timeline = timeline._id;
					guestUser.timeline = timeline._id;
					guestUser.guestId = guestId;
					guestUser.roles = ['guest'];
					guest.save();
					guestUser.save();
				});
			});
		});
	}
};

/**
 * Signup
 */
exports.signup = function(req, res) {
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;
	// Init Variables
	if(req.body.guestParam){
		 var guestParam  = req.body.guestParam;
	}
	var user = new User(req.body);
	var message = null;

	// Add missing user fields
	user.provider = 'local';
	user.encryptPassword();

	//Then save the user 
		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				// Remove sensitive data before login
					user.password = undefined;
					user.salt = undefined;

					if(user.verified){
						user.guestParam = guestParam;
						userTimeline.updateGuestTimeline(user);
						res.jsonp(user);
					} 
					else {
						var verificationToken = new Verificationtoken({
							_userId: user
						});
						verificationToken.createVerificationToken(function (err, token) {
						    if (err) {
						    	return res.status(400).send({
						    		message: errorHandler.getErrorMessage(err)
						    	});
						    }
			    		var mailgun = new Mailgun({apiKey: api_key, domain: domain});

							var data = {
								from: from_who,
								to: req.body.email,
								subject: 'Email Verification',
								html: 'Hello ' + req.body.name + ',' + '<br>' + '<br>' + ' You have registered to join  Calendarize. Upon confirming your registration, you will be required to sign in. You can confirm your registration by clicking the link below: ' + '<br>' + '<br>' + '<a href='+ req.protocol + '://' + req.get('host') + '/verify/' + verificationToken.token + '>' + 'Confirm registration' + '</a>' + '<br>' + '<br>' +' If the above link is not clickable, you should copy and paste it into your browser’s address field.'+ '<br>' + '<br>' + '<p style="color:red"><em><bold>' + ' If you did not initiate this request or have already signed up, kindly disregard this message.'+'</bold></em></p>' + ' Calendarize is a project scheduling tool. By tracking your current projects and who\'s working on them and when, you\'ll have a clear picture of what\'s going on.' + '<br>' + ' If you wish to not accept the invitation, please ignore these instructions. Your account will not be created until you accept your invitation and create a password for your account.' + '<br>' + '<br>' + ' — Sincerely, ' + '<br>' + ' The Calendarize team'
							};
							mailgun.messages().send(data, function(err, body) {
								if (err) {
									res.render('error', {error: err});
									errorHandler.getErrorMessage(err);
								}
								else {
									res.render('email-confirmation', {email: req.body.email});
									userTimeline.createTimeline(user);
									verificationToken.save();
									res.jsonp(user);
								}
							});
						});


					}
				}
		});
};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err || !user) {
			res.status(401).send(info);
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			if(user.verified === true) {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.jsonp(user);
					}
				});
			}
			else {
				return res.status(401).send('User not yet verified');
			}
		}
	})(req, res, next);
};

/**
 * Signout
 */
exports.signout = function(req, res) {
	req.logout();
	res.redirect('/');
};

/**
 * OAuth callback
 */
exports.oauthCallback = function(strategy) {
	return function(req, res, next) {
		passport.authenticate(strategy, function(err, user, redirectURL) {
			if (err || !user) {
				return res.redirect('/#!/signin');
			}
			req.login(user, function(err) {
				if (err) {
					return res.redirect('/#!/signin');
				}

				return res.redirect(redirectURL || '/');
			});
		})(req, res, next);
	};
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
	if (!req.user) {
		// Define a search query fields
		var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
		var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

		// Define main provider search query
		var mainProviderSearchQuery = {};
		mainProviderSearchQuery.provider = providerUserProfile.provider;
		mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define additional provider search query
		var additionalProviderSearchQuery = {};
		additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define a search query to find existing user with current provider profile
		var searchQuery = {
			$or: [mainProviderSearchQuery, additionalProviderSearchQuery]
		};

		User.findOne(searchQuery, function(err, user) {
			if (err) {
				return done(err);
			} else {
				if (!user) {
					var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

					User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
						user = new User({
							firstName: providerUserProfile.firstName,
							lastName: providerUserProfile.lastName,
							username: availableUsername,
							displayName: providerUserProfile.displayName,
							email: providerUserProfile.email,
							provider: providerUserProfile.provider,
							providerData: providerUserProfile.providerData
						});

						// And save the user
						user.save(function(err) {
							return done(err, user);
						});
					});
				} else {
					return done(err, user);
				}
			}
		});
	} else {
		// User is already logged in, join the provider data to the existing user
		var user = req.user;

		// Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
		if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
			// Add the provider data to the additional provider data field
			if (!user.additionalProvidersData) user.additionalProvidersData = {};
			user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');

			// And save the user
			user.save(function(err) {
				return done(err, user, '/#!/settings/accounts');
			});
		} else {
			return done(new Error('User is already connected using this provider'), user);
		}
	}
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function(req, res, next) {
	var user = req.user;
	var provider = req.param('provider');

	if (user && provider) {
		// Delete the additional provider
		if (user.additionalProvidersData[provider]) {
			delete user.additionalProvidersData[provider];

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');
		}

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.jsonp(user);
					}
				});
			}
		});
	}
};
