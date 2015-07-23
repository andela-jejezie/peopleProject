'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Guest = mongoose.model('Guest'),
	Mailgun = require('mailgun-js'),
	User = mongoose.model('User'),
	_ = require('lodash');

var api_key = 'key-3c618b8023b0606df8a322e4986ff398';
var domain = 'sandbox13255ecc69fa45e1acb966e95b235586.mailgun.org';
var from_who = 'email@calendarizeapp.com';

/**
 * Create a Guest
 */
exports.createGuest = function(req, res) {

	var guest = new Guest(req.body);
	guest.user = req.user;
	guest.createGuestToken(function (err, token) {
	    if (err) {
	    	return res.status(400).send({
	    		message: errorHandler.getErrorMessage(err)
	    	});
	    }
			var mailgun = new Mailgun({apiKey: api_key, domain: domain});

		var data = {
			from: from_who,
			to: req.body.email,
			subject: 'Invitation to join Calendarize',
			html: 'Hello ' + req.body.name + ',' + '<br><br>' + 'You have been invited to join <strong>' + req.user.username + '</strong> on Calendarize. Upon accepting your invitation you will be asked for a password. You will need this password to sign in to Calendarize for future logins. You can accept your invitation and set up your password below:' + '<br><br>' + '<a href='+req.protocol + '://' + req.get('host') + '/guest/invitation/accept?token=' + guest.token + '>' + 'Confirm Invitation'+ '</a><br><br>'+ ' If the above link is not clickable, you may instead copy and paste it into your browser’s address field' + '<br><br>' +'Calendarize is a project scheduling tool. By tracking your current projects and who\'s working on them and when, you\'ll have a clear picture of what\'s going on.' + '<br><br>' + 'If you wish to not accept the invitation, please ignore these instructions. Your account will not be created until you accept your invitation and create a password for your account.' + '<br><br>' + ' — Sincerely, ' + '<br>' + ' The Calendarize team'
		};
		mailgun.messages().send(data);
	});

	guest.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(guest);
		}
	});
};

/**
 * Show the current Guest
 */
exports.readGuest = function(req, res) {
	res.jsonp(req.guest);
};

/**
 * Update a Guest
 */
exports.updateGuest = function(req, res) {
	var guest = req.guest ;

	guest = _.extend(guest , req.body);
	guest.createGuestToken(function (err, token) {
	    if (err) {
	    	return res.status(400).send({
	    		message: errorHandler.getErrorMessage(err)
	    	});
	    }
			var mailgun = new Mailgun({apiKey: api_key, domain: domain});

		var data = {
			from: from_who,
			to: guest.email,
			subject: 'Invitation to join Calendarize',
			html: 'Hello ' + req.body.name + ',' + '<br><br>' + 'You have been invited to join <strong>' + req.user.username + '</strong> on Calendarize. Upon accepting your invitation you will be asked for a password. You will need this password to sign in to Calendarize for future logins. You can accept your invitation and set up your password below:' + '<br><br>' + '<a href='+req.protocol + '://' + req.get('host') + '/guest/invitation/accept?token=' + guest.token + '>' + 'Confirm Invitation'+ '</a><br><br>'+ ' If the above link is not clickable, you may instead copy and paste it into your browser’s address field' + '<br><br>' +'Calendarize is a project scheduling tool. By tracking your current projects and who\'s working on them and when, you\'ll have a clear picture of what\'s going on.' + '<br><br>' + 'If you wish to not accept the invitation, please ignore these instructions. Your account will not be created until you accept your invitation and create a password for your account.' + '<br><br>' + ' — Sincerely, ' + '<br>' + ' The Calendarize team'
		};
		mailgun.messages().send(data);
	});

	guest.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(guest);
		}
	});
};

/**
 * Delete an Guest
 */
exports.deleteGuest = function(req, res) {
	var guest = req.guest ;
		guest.remove(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				User.findOne({guestId : guest._id}).exec(function(err, guestUser){
					if(guestUser){
						guestUser.remove();						
					}
				});
				res.jsonp(guest);
			}
		});
};

/**
 * Verify Guest
 */
exports.verifyGuest = function(req, res){
  Guest.findOne(req.query).exec(function(err, invitedGuest){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
				Guest.findById(invitedGuest._id).exec(function(err, guest) {
				var verifiedGuest = {
					isPending : false
				};
				guest = _.extend(guest , verifiedGuest);
				guest.save();
				res.redirect('/#!/guest/'+guest._id);
			});			
		}
  });
};

/**
 * List of Guests
 */
exports.listGuests = function(req, res) { 
	Guest.find({user:req.user._id}).sort('-created').populate('user', 'username').exec(function(err, guests) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(guests);
		}
	});
};

/**
 * Guest middleware
 */
exports.guestByID = function(req, res, next, id) { 
	Guest.findById(id).populate('user', 'username').exec(function(err, guest) {
		if (err) return next(err);
		if (! guest) return next(new Error('Failed to load Guest ' + id));
		req.guest = guest ;
		next();
	});
};

/**
 * Guest authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.guest.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
