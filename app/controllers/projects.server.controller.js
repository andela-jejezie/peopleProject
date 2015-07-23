'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Project = mongoose.model('Project'),
  Task = mongoose.model('Task'),
  User = mongoose.model('User'),
  _ = require('lodash');

/**
 * Create a Project
 */
exports.createProject = function(req, res) {
  var project = new Project(req.body);
  project.user = req.user;
  User.findById(req.user._id).exec(function(err, userTimeline){
    project.timeline = userTimeline.timeline;
    project.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(project);
      }
    });
  });
};

/**
 * Show the current Project
 */
exports.readProject = function(req, res) {
  res.jsonp(req.project);
};

/**
 * Update a Project
 */
exports.updateProject = function(req, res) {
  var project = req.project;
  project = _.extend(project, req.body);
  project.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      Task.findOne({projectId: project._id}).exec(function(err, task){
        if(task){
          task.projectName = project.name;
          task.save();
        }
      });
      res.jsonp(project);
    }
  });
};

/**
 * Delete an Project
 */
exports.deleteProject = function(req, res) {
  var project = req.project;
  if(project.user._id !== req.user._id)
    return res.status(403).send('User is not authorized');
  project.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(project);
    }
  });
};

/**
 * List of Projects
 */
exports.listProjects = function(req, res) {
  Project.find({'timeline':req.user.timeline}).where(req.query).sort('-created').populate('user', 'username').populate('tasks', 'projectName personName group cohort startDate endDate').exec(function(err, projects) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(projects);
    }
  });
};

/**
 * Project middleware
 */
exports.projectByID = function(req, res, next, id) {
  Project.findById(id).populate('user', 'displayName').exec(function(err, project) {
    if (err) return next(err);
    if (!project) return next(new Error('Failed to load Project ' + id));
    req.project = project;
    next();
  });
};

/**
 * Project authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.project.timeline._id !== req.user.timeline._id) {
    return res.status(403).send('User is not authorized');
  }
  next();
};
