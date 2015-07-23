'use strict';

var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Skill = mongoose.model('Skill'),
  _ = require('lodash');

/**
 * List of skills
 */
exports.listSkills = function(req, res) {
  Skill.find().sort('-created').exec(function(err, skills) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(skills);
    }
  });
};


  /**
 * create skills
 */
exports.addSkill = function(req, res) {
  var skill = new Skill(req.body);
  skill.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(skill);
    }
  });
};



/**
 * Skill middleware
 */
exports.skillByID = function(req, res, next, id) {
  Skill.findById(id).exec(function(err, skill) {
    if (err) return next(err);
    if (!skill) return next(new Error('Failed to load Skill ' + id));
    req.skill = skill;
    next();
  });
};


/**
 * Delete a Skill
 */
exports.deleteSkill = function(req, res) {
  var skill = req.skill;
  skill.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(skill);
    }
  });
};


