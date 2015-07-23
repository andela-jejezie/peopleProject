'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	user = require('../../app/controllers/users'),
	Verificationtoken = mongoose.model('Verificationtoken'),
  Timeline = mongoose.model('Timeline'),
	User = mongoose.model('User'),
	_ = require('lodash');


/**
 * Show the current Verificationtoken
 */
exports.read = function(req, res) {
	res.jsonp(req.verificationtoken);
};


/**
 * List of Verificationtokens
 */
exports.list = function(req, res) { 
	Verificationtoken.find().sort('-created').populate('user', 'displayName').exec(function(err, verificationtokens) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(verificationtokens);
		}
	});
};

exports.verifyUser = function(req, res) {
  Verificationtoken.findOne({token : req.userToken.token}).exec(function (err, doc){
    if (err) {
      return res.status(400).send('Token not valid');
    }
    else {
      User.findOne({_id: doc._userId}, function (err, user) {
        Timeline.findOne({owner : user._id}).exec(function(err, timeline){
          user.verified = true;
          user.timeline = timeline._id;
          user.save();
          res.redirect('/#!/verified');
        });
      });
	  }
  });
};


exports.tokenById = function(req, res, next, id) { 
  Verificationtoken.findOne({token : id}).exec(function(err, userToken) {
    if (err) return next(err);
    if (! userToken) return next(new Error('Failed to load Token ' + id));
    req.userToken = userToken ;
    next();
  });
};


