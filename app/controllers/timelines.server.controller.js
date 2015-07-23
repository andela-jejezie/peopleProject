'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Timeline = mongoose.model('Timeline'),
  _ = require('lodash');



/**
 * Create a Timeline
 */
exports.createTimeline = function(req, res) {
  var timeline = new Timeline({});
  timeline.owner = req.user;

  timeline.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(timeline);
    }
  });
};

/**
 * Show the current Timeline
 */
exports.read = function(req, res) {
  res.jsonp(req.timeline);
};

/**
 * Update a Timeline
 */
exports.updateTimeline = function(req, res) {
  var timeline = req.timeline ;
  timeline = _.extend(timeline , req.body);
  timeline.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(timeline);
    }
  });
};

/**
 * Delete an Timeline
 */
exports.deleteTimeline = function(req, res) {
  var timeline = req.timeline ;
  timeline.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(timeline);
    }
  });
};


/**
 * List of Timelines
 */
exports.listTimelines = function(req, res) { 
  Timeline.find().sort('-created').populate('owner', 'username').exec(function(err, timelines) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(timelines);
    }
  });
};

/**
 * Timeline middleware
 */
exports.timelineByID = function(req, res, next, id) { 
  Timeline.findById(id).populate('owner', 'username').exec(function(err, timeline) {
    if (err) return next(err);
    if (! timeline) return next(new Error('Failed to load Timeline ' + id));
    req.timeline = timeline ;
    next();
  });
};

/**
 * Timeline authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.timeline.owner.id !== req.user.id) {
    return res.status(403).send('User is not authorized');
  }
  next();
};
